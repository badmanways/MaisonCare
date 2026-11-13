import { NextRequest, NextResponse } from "next/server";
import { sendAdminDirectReply } from "@/lib/emailService";
import { isAdminAuthenticated, sanitizeText } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const to = sanitizeText(body.to, 180);
    const subject = sanitizeText(body.subject, 240);
    const messageBody = sanitizeText(body.body, 5000);
    const entityType = body.entityType as
      | "booking"
      | "application"
      | "ticket"
      | "contact";
    const entityId = String(body.entityId || "");

    if (!to || !subject || !messageBody || !entityType || !entityId) {
      return NextResponse.json(
        { error: "Recipient, subject, message body, and entity ID are required." },
        { status: 400 }
      );
    }

    const emailRecord = await sendAdminDirectReply({
      to,
      subject,
      body: messageBody,
      entityType,
      entityId,
    });

    return NextResponse.json({
      success: true,
      emailRecord,
    });
  } catch (err) {
    console.error("Error in /api/admin/reply:", err);
    return NextResponse.json(
      { error: "Failed to dispatch outbound email reply." },
      { status: 500 }
    );
  }
}

