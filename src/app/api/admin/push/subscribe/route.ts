import { NextRequest, NextResponse } from "next/server";
import {
  getVapidPublicKey,
  savePushSubscriptionAsync,
} from "@/lib/pushService";

export async function GET() {
  const publicKey = getVapidPublicKey();
  return NextResponse.json({ publicKey });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json(
        { error: "Invalid push subscription object." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "Unknown Device";
    const saved = await savePushSubscriptionAsync(body, userAgent);

    return NextResponse.json({ ok: true, subscription: saved });
  } catch (err) {
    console.error("[POST /api/admin/push/subscribe] Error:", err);
    return NextResponse.json(
      { error: "Failed to save push subscription." },
      { status: 500 }
    );
  }
}

