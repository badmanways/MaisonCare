import { NextRequest, NextResponse } from "next/server";
import { ContactMessageRecord, updateDbAsync } from "@/lib/db";
import { sendContactAdminAlert } from "@/lib/emailService";
import { notifyAdmin } from "@/lib/pushService";
import { checkRateLimit, sanitizeText, validateAntiBot } from "@/lib/security";

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, "api_contact", 12, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many messages submitted. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const botCheck = validateAntiBot({
      honeypot: body.honeypot,
      elapsedMs: Number(body.elapsedMs || 0),
    });
    if (!botCheck.valid) {
      return NextResponse.json({ error: botCheck.reason }, { status: 400 });
    }

    const name = sanitizeText(body.name, 140);
    const email = sanitizeText(body.email, 160);
    const message = sanitizeText(body.message, 2500);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newMsg: ContactMessageRecord = {
      id: `msg-${Date.now()}`,
      name,
      email,
      message,
      status: "NEW",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    try {
      await updateDbAsync((draft) => {
        draft.contactMessages.unshift(newMsg);
      });
    } catch (dbErr) {
      console.warn("[POST /api/contact] DB update warning:", dbErr);
    }

    try {
      await sendContactAdminAlert(newMsg);
    } catch (emailErr) {
      console.warn("[POST /api/contact] Email alert warning:", emailErr);
    }

    try {
      // Instant phone notification dispatch to admin's mobile device
      await notifyAdmin({
        type: "CONTACT",
        title: `✉️ New Contact Enquiry: ${name}`,
        body: message.slice(0, 100),
        url: "/admin",
      });
    } catch (pushErr) {
      console.warn("[POST /api/contact] Push alert warning:", pushErr);
    }

    return NextResponse.json({
      ok: true,
      contact: newMsg,
    });
  } catch (err) {
    console.error("[POST /api/contact] Error:", err);
    return NextResponse.json(
      { error: "Internal server error while sending message." },
      { status: 500 }
    );
  }
}
