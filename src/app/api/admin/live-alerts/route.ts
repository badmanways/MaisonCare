import { NextRequest, NextResponse } from "next/server";
import { getAdminAlertsSinceAsync, updateDbAsync } from "@/lib/db";
import { notifyAdmin } from "@/lib/pushService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since") || undefined;

    const { alerts, unreadCount } = await getAdminAlertsSinceAsync(since);

    return NextResponse.json({
      alerts,
      unreadCount,
      serverTime: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/admin/live-alerts] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch live alerts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    if (body.action === "test") {
      const alert = await notifyAdmin({
        type: "BOOKING",
        title: "🔔 MaisonCare VIP Alert (Test)",
        body: "Instant phone notifications are active! New bookings, CVs, and AI requests will alert your phone immediately.",
        url: "/admin",
      });
      return NextResponse.json({ ok: true, testAlert: alert });
    }

    if (body.action === "mark-read") {
      await updateDbAsync((draft) => {
        if (draft.alertEvents) {
          draft.alertEvents.forEach((a) => {
            a.read = true;
          });
        }
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/live-alerts] Error:", err);
    return NextResponse.json(
      { error: "Failed to process alert action." },
      { status: 500 }
    );
  }
}

