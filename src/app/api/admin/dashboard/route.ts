import { NextRequest, NextResponse } from "next/server";
import {
  BookingStatus,
  KnowledgeBaseEntry,
  readDbAsync,
  updateDbAsync,
} from "@/lib/db";
import { isAdminAuthenticated, sanitizeText } from "@/lib/security";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await readDbAsync();

    const kpis = {
      totalBookings: (db.bookings || []).length,
      newBookings: (db.bookings || []).filter((b) => b.status === "NEW").length,
      totalApplications: (db.jobApplications || []).length,
      newApplications: (db.jobApplications || []).filter(
        (a) => a.status === "NEW"
      ).length,
      activeJobVacancies: (db.jobVacancies || []).length,
      openAiTickets: (db.aiTickets || []).filter((t) => t.status === "OPEN")
        .length,
      totalAiTickets: (db.aiTickets || []).length,
      pendingReviews: (db.reviews || []).filter((r) => r.status === "PENDING")
        .length,
      approvedReviews: (db.reviews || []).filter(
        (r) => r.status === "APPROVED"
      ).length,
      totalOutboundEmails: (db.outboundEmails || []).length,
      newContactMessages: (db.contactMessages || []).filter(
        (c) => c.status === "NEW"
      ).length,
      totalContactMessages: (db.contactMessages || []).length,
    };

    return NextResponse.json({
      kpis,
      bookings: db.bookings || [],
      jobVacancies: db.jobVacancies || [],
      jobApplications: db.jobApplications || [],
      reviews: db.reviews || [],
      aiTickets: db.aiTickets || [],
      contactMessages: db.contactMessages || [],
      outboundEmails: db.outboundEmails || [],
      knowledgeBase: db.knowledgeBase || [],
      settings: db.settings || {
        adminNotificationEmail: "webadmin@nannymaisoncare.lu",
        agencyPhone: "+352 691 225 764",
        agencyAddress: "140 Rue de Cessange, Luxembourg",
        autoTranslateJobs: true,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/dashboard] Fallback error:", err);
    return NextResponse.json(
      { error: "Failed to read database on server." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update_booking_status") {
      const id = String(body.id || "");
      const status = body.status as BookingStatus;
      await updateDbAsync((db) => {
        const item = db.bookings.find((b) => b.id === id);
        if (item && status) {
          item.status = status;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "update_application_status") {
      const id = String(body.id || "");
      const status = body.status as "NEW" | "SHORTLISTED" | "REJECTED";
      await updateDbAsync((db) => {
        const item = db.jobApplications.find((a) => a.id === id);
        if (item && status) {
          item.status = status;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "update_ticket_status") {
      const id = String(body.id || "");
      const status = body.status as "OPEN" | "REPLIED" | "RESOLVED";
      await updateDbAsync((db) => {
        const item = db.aiTickets.find((t) => t.id === id);
        if (item && status) {
          item.status = status;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "update_contact_status") {
      const id = String(body.id || "");
      const status = body.status as "NEW" | "REPLIED" | "ARCHIVED";
      await updateDbAsync((db) => {
        const item = db.contactMessages.find((c) => c.id === id);
        if (item && status) {
          item.status = status;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "update_settings") {
      await updateDbAsync((db) => {
        if (body.adminNotificationEmail) {
          db.settings.adminNotificationEmail = sanitizeText(
            body.adminNotificationEmail,
            160
          );
        }
        if (body.agencyPhone !== undefined) {
          db.settings.agencyPhone = sanitizeText(body.agencyPhone, 80);
        }
        if (body.agencyAddress !== undefined) {
          db.settings.agencyAddress = sanitizeText(body.agencyAddress, 240);
        }
        if (typeof body.autoTranslateJobs === "boolean") {
          db.settings.autoTranslateJobs = body.autoTranslateJobs;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "save_knowledge_entry") {
      const entryId = body.id ? String(body.id) : `kb-${Date.now()}`;
      const topic = sanitizeText(body.topic, 140);
      const keywords = Array.isArray(body.keywords)
        ? body.keywords
            .map((k: unknown) => sanitizeText(k, 40).toLowerCase())
            .filter(Boolean)
        : String(body.keywords || "")
            .split(",")
            .map((k) => sanitizeText(k, 40).toLowerCase())
            .filter(Boolean);
      const contentEn = sanitizeText(body.contentEn, 2000);
      const contentFr = sanitizeText(body.contentFr, 2000) || contentEn;
      const contentDe = sanitizeText(body.contentDe, 2000) || contentEn;

      if (!topic || !contentEn) {
        return NextResponse.json(
          { error: "Topic and English content are required." },
          { status: 400 }
        );
      }

      const updatedEntry: KnowledgeBaseEntry = {
        id: entryId,
        topic,
        keywords,
        contentEn,
        contentFr,
        contentDe,
        updatedAt: new Date().toISOString(),
      };

      await updateDbAsync((db) => {
        const idx = db.knowledgeBase.findIndex((k) => k.id === entryId);
        if (idx >= 0) {
          db.knowledgeBase[idx] = updatedEntry;
        } else {
          db.knowledgeBase.unshift(updatedEntry);
        }
      });

      return NextResponse.json({ success: true, entry: updatedEntry });
    }

    if (action === "delete_knowledge_entry") {
      const id = String(body.id || "");
      await updateDbAsync((db) => {
        db.knowledgeBase = db.knowledgeBase.filter((k) => k.id !== id);
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Error in PATCH /api/admin/dashboard:", err);
    return NextResponse.json(
      { error: "Failed to update dashboard resource." },
      { status: 500 }
    );
  }
}

