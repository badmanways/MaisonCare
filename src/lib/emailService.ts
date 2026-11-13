import nodemailer from "nodemailer";
import {
  BookingRecord,
  JobApplicationRecord,
  AiTicketRecord,
  ContactMessageRecord,
  ReviewRecord,
  OutboundEmailRecord,
  readDb,
  readDbAsync,
  updateDb,
  updateDbAsync,
} from "@/lib/db";

interface DispatchEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  contextType: OutboundEmailRecord["contextType"];
  relatedEntityId?: string;
  attachments?: { filename: string; path: string }[];
}

export async function dispatchTransactionalEmail(
  options: DispatchEmailOptions
): Promise<OutboundEmailRecord> {
  const db = readDb();
  const configuredFrom =
    process.env.SMTP_FROM ||
    (process.env.SMTP_USER && process.env.SMTP_USER !== "resend"
      ? process.env.SMTP_USER
      : process.env.ADMIN_EMAIL || "info@nannymaisoncare.lu");
  let fromAddress = configuredFrom;

  let deliveryMethod: "SMTP" | "LOCAL_OUTBOX" = "LOCAL_OUTBOX";

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (
    smtpHost &&
    smtpHost !== "smtp.example.com" &&
    smtpUser &&
    smtpPass &&
    smtpPass !== "your_smtp_password"
  ) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 8000,
      });

      try {
        await transporter.sendMail({
          from: `"Nanny & MaisonCare Letzebuerg" <${fromAddress}>`,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html || options.text.replace(/\n/g, "<br/>"),
          attachments: options.attachments,
        });
        deliveryMethod = "SMTP";
      } catch (sendErr: unknown) {
        // If Resend rejected because the custom domain is not yet verified on Resend, retry with onboarding@resend.dev
        const errMsg = sendErr instanceof Error ? sendErr.message : String(sendErr);
        if (
          smtpHost.includes("resend.com") &&
          (errMsg.includes("domain") || errMsg.includes("verify") || errMsg.includes("validation"))
        ) {
          fromAddress = "onboarding@resend.dev";
          await transporter.sendMail({
            from: `"Nanny & MaisonCare Letzebuerg" <onboarding@resend.dev>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text.replace(/\n/g, "<br/>"),
            attachments: options.attachments,
          });
          deliveryMethod = "SMTP";
        } else {
          throw sendErr;
        }
      }
    } catch (err) {
      console.warn(
        "[MaisonCare Email Engine] SMTP dispatch failed, logged to local outbox:",
        err
      );
    }
  }

  const record: OutboundEmailRecord = {
    id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    to: options.to,
    from: fromAddress,
    subject: options.subject,
    body: options.text,
    contextType: options.contextType,
    relatedEntityId: options.relatedEntityId,
    sentAt: new Date().toISOString(),
    deliveryMethod,
  };

  await updateDbAsync((draft) => {
    draft.outboundEmails.unshift(record);
  });

  return record;
}

export async function getAdminEmailAsync(): Promise<string> {
  const db = await readDbAsync();
  return (
    db.settings?.adminNotificationEmail ||
    process.env.ADMIN_EMAIL ||
    "info@nannymaisoncare.lu"
  );
}

export function getAdminEmail(): string {
  const db = readDb();
  return (
    db.settings?.adminNotificationEmail ||
    process.env.ADMIN_EMAIL ||
    "info@nannymaisoncare.lu"
  );
}

export async function sendBookingAdminAlert(booking: BookingRecord) {
  const adminEmail = await getAdminEmailAsync();
  const subject = `[New Service Enquiry] ${booking.category} — ${booking.name}`;
  const text = `New Service Enquiry submitted on Nanny & MaisonCare Lëtzebuerg:

Client Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone || "Not provided"}
Category: ${booking.category}
Selected Services: ${booking.services.length ? booking.services.join(", ") : "Custom Request"}
Preferred Date: ${booking.serviceDate || "Flexible"}
Start Time: ${booking.startTime || "Flexible"}
Duration (Hours): ${booking.durationHours || "Flexible"}
Frequency: ${booking.frequency || "One-off"}
Location / Commune: ${booking.location || "Luxembourg"}

Client Notes / Custom Request:
${booking.customNotes}

---
View and reply directly from the Admin Command Center (/admin).`;

  return dispatchTransactionalEmail({
    to: adminEmail,
    subject,
    text,
    contextType: "BOOKING_ADMIN_ALERT",
    relatedEntityId: booking.id,
  });
}

export async function sendJobApplicationAdminAlert(
  app: JobApplicationRecord,
  fullCvPath?: string
) {
  const adminEmail = await getAdminEmailAsync();
  const subject = `[New Job Application] ${app.jobTitle} — ${app.name}`;
  const text = `New Job Application & CV received on Nanny & MaisonCare Lëtzebuerg:

Candidate Name: ${app.name}
Email: ${app.email}
Phone: ${app.phone || "Not provided"}
Role Applied For: ${app.jobTitle} (${app.jobId})
Expected Monthly Salary: €${app.expectedSalary || "Negotiable"}
CV Attached: ${app.cvFileName} (${Math.round(app.cvSizeBytes / 1024)} KB)

Why Candidate Should Be Considered:
${app.whyConsidered}

---
Download CV and reply directly to ${app.name} from the Admin Command Center (/admin).`;

  return dispatchTransactionalEmail({
    to: adminEmail,
    subject,
    text,
    contextType: "JOB_APPLICATION_ADMIN_ALERT",
    relatedEntityId: app.id,
    attachments: fullCvPath
      ? [{ filename: app.cvFileName, path: fullCvPath }]
      : undefined,
  });
}

export async function sendAiTicketAdminAlert(ticket: AiTicketRecord) {
  const adminEmail = await getAdminEmailAsync();
  const subject = `[Escalated AI Support Ticket] ${ticket.visitorEmail} (${ticket.language.toUpperCase()})`;
  const text = `An AI Chatbot conversation was escalated to a human Support Ticket:

Visitor Email: ${ticket.visitorEmail}
Language: ${ticket.language.toUpperCase()}
Support Message:
${ticket.questionOrMessage}

---
Reply directly from the AI Escalation Inbox in the Admin Command Center (/admin).`;

  return dispatchTransactionalEmail({
    to: adminEmail,
    subject,
    text,
    contextType: "AI_TICKET_ADMIN_ALERT",
    relatedEntityId: ticket.id,
  });
}

export async function sendContactAdminAlert(msg: ContactMessageRecord) {
  const adminEmail = await getAdminEmailAsync();
  const subject = `[Website Contact Inquiry] From ${msg.name}`;
  const text = `New Contact Us message received:

Name: ${msg.name}
Email: ${msg.email}

Message:
${msg.message}`;

  return dispatchTransactionalEmail({
    to: adminEmail,
    subject,
    text,
    contextType: "CONTACT_ADMIN_ALERT",
    relatedEntityId: msg.id,
  });
}

export async function sendReviewAdminAlert(review: ReviewRecord) {
  const adminEmail = await getAdminEmailAsync();
  const subject = `[New Client Review Pending Approval] ${review.name} (${review.rating}★)`;
  const text = `A new client testimonial was submitted and is awaiting moderation (status: PENDING):

Client: ${review.name} (${review.role || "Luxembourg"})
Rating: ${review.rating} / 5 Stars
Review:
"${review.text}"

Approve or reject this review inside the Admin Command Center (/admin).`;

  return dispatchTransactionalEmail({
    to: adminEmail,
    subject,
    text,
    contextType: "REVIEW_ADMIN_ALERT",
    relatedEntityId: review.id,
  });
}

export async function sendAdminDirectReply(params: {
  to: string;
  subject: string;
  body: string;
  entityType: "booking" | "application" | "ticket" | "contact";
  entityId: string;
}): Promise<OutboundEmailRecord> {
  const record = await dispatchTransactionalEmail({
    to: params.to,
    subject: params.subject,
    text: params.body,
    contextType: "ADMIN_DIRECT_REPLY",
    relatedEntityId: params.entityId,
  });

  await updateDbAsync((draft) => {
    if (params.entityType === "booking") {
      const target = draft.bookings.find((b) => b.id === params.entityId);
      if (target) {
        target.replies.unshift(record);
        if (target.status === "NEW") target.status = "IN_REVIEW";
      }
    } else if (params.entityType === "application") {
      const target = draft.jobApplications.find((a) => a.id === params.entityId);
      if (target) {
        target.replies.unshift(record);
        if (target.status === "NEW") target.status = "SHORTLISTED";
      }
    } else if (params.entityType === "ticket") {
      const target = draft.aiTickets.find((t) => t.id === params.entityId);
      if (target) {
        target.replies.unshift(record);
        target.status = "REPLIED";
      }
    } else if (params.entityType === "contact") {
      const target = draft.contactMessages.find((c) => c.id === params.entityId);
      if (target) {
        target.replies.unshift(record);
        target.status = "REPLIED";
      }
    }
  });

  return record;
}

