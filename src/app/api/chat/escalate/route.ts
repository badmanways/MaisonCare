import { NextRequest, NextResponse } from "next/server";
import { AiTicketRecord, updateDbAsync } from "@/lib/db";
import { sendAiTicketAdminAlert } from "@/lib/emailService";
import { notifyAdmin } from "@/lib/pushService";
import {
  checkRateLimit,
  getClientIp,
  sanitizeText,
  validateAntiBot,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`chat-escalate:${ip}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many ticket submissions. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const antiBot = validateAntiBot({
      honeypot: body.honeypot,
      formStartedAt: body.formStartedAt,
    });
    if (!antiBot.valid) {
      return NextResponse.json({ error: antiBot.reason }, { status: 400 });
    }

    const visitorEmail = sanitizeText(body.visitorEmail, 160);
    const visitorName = sanitizeText(body.visitorName, 120);
    const questionOrMessage = sanitizeText(body.questionOrMessage, 2000);
    const language: "en" | "fr" | "de" =
      body.language === "fr" || body.language === "de" ? body.language : "en";

    if (!visitorEmail || !visitorEmail.includes("@") || !questionOrMessage) {
      return NextResponse.json(
        { error: "A valid email address and message are required." },
        { status: 400 }
      );
    }

    const rawTranscript = Array.isArray(body.conversationTranscript)
      ? body.conversationTranscript
      : [];

    const conversationTranscript = rawTranscript
      .slice(-16)
      .map((item: { role?: string; content?: string }) => ({
        role: (item.role === "assistant" ? "assistant" : "user") as
          | "user"
          | "assistant",
        content: sanitizeText(item.content, 1500),
      }))
      .filter((item: { content: string }) => Boolean(item.content));

    const newTicket: AiTicketRecord = {
      id: `tkt-${Date.now()}`,
      visitorEmail,
      visitorName: visitorName || undefined,
      language,
      questionOrMessage,
      conversationTranscript,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    try {
      await updateDbAsync((db) => {
        db.aiTickets.unshift(newTicket);
      });
    } catch (dbErr) {
      console.warn("[POST /api/chat/escalate] DB update warning:", dbErr);
    }

    try {
      await sendAiTicketAdminAlert(newTicket);
    } catch (emailErr) {
      console.warn("[POST /api/chat/escalate] Email alert warning:", emailErr);
    }

    try {
      // Instant phone notification dispatch to admin's mobile device
      await notifyAdmin({
        type: "TICKET",
        title: `💬 MaisonCare CS Ticket: ${visitorName || visitorEmail}`,
        body: questionOrMessage.slice(0, 100),
        url: "/admin",
      });
    } catch (pushErr) {
      console.warn("[POST /api/chat/escalate] Push notification warning:", pushErr);
    }

    return NextResponse.json({
      success: true,
      ticket: newTicket,
    });
  } catch (err) {
    console.error("Error in /api/chat/escalate:", err);
    return NextResponse.json(
      { error: "Failed to submit support ticket." },
      { status: 500 }
    );
  }
}

