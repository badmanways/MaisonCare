import { NextRequest, NextResponse } from "next/server";
import { ReviewRecord, readDbAsync, updateDbAsync } from "@/lib/db";
import { sendReviewAdminAlert } from "@/lib/emailService";
import { notifyAdmin } from "@/lib/pushService";
import { checkRateLimit, sanitizeText, validateAntiBot } from "@/lib/security";

export async function GET() {
  const db = await readDbAsync();
  // Moderation Rule: Only return APPROVED reviews to the public website
  const approvedReviews = (db.reviews || []).filter((r) => r.status === "APPROVED");
  return NextResponse.json({ reviews: approvedReviews });
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, "api_reviews", 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many review submissions. Please try again later." },
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

    const name = sanitizeText(body.name, 120);
    const role = sanitizeText(body.role, 120) || "Luxembourg";
    const rating = Math.min(5, Math.max(1, Number(body.rating || 5)));
    const text = sanitizeText(body.text, 1200);
    let avatarUrl = "";
    if (typeof body.avatarUrl === "string" && body.avatarUrl.trim()) {
      const trimmed = body.avatarUrl.trim();
      if (
        trimmed.startsWith("data:image/") ||
        trimmed.startsWith("/images/") ||
        trimmed.startsWith("https://")
      ) {
        avatarUrl = trimmed.slice(0, 4_000_000);
      }
    }

    if (!name || !text) {
      return NextResponse.json(
        { error: "Name and review text are required." },
        { status: 400 }
      );
    }

    // Strictly saved as PENDING until Admin approves in /admin
    let textFr = text;
    let textDe = text;

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.includes("your_")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const prompt = `Translate this customer review for "Nanny & MaisonCare Lëtzebuerg" into French and German:
Review: "${text}"

Respond in valid JSON format only:
{
  "textFr": "French translation here",
  "textDe": "German translation here"
}`;
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);
        if (geminiRes.ok) {
          const resData = await geminiRes.json();
          const parsed = JSON.parse(
            resData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
          );
          if (parsed.textFr) textFr = parsed.textFr;
          if (parsed.textDe) textDe = parsed.textDe;
        }
      } catch {
        // Non-fatal fallback to original text
      }
    }

    const newReview: ReviewRecord = {
      id: `rev-${Date.now()}`,
      name,
      role,
      roleFr: role,
      roleDe: role.replace("Luxembourg", "Luxemburg"),
      rating,
      text,
      textFr,
      textDe,
      avatarUrl,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDbAsync((draft) => {
        draft.reviews.unshift(newReview);
      });
    } catch (dbErr) {
      console.warn("[POST /api/reviews] DB update warning:", dbErr);
    }

    try {
      await sendReviewAdminAlert(newReview);
    } catch (emailErr) {
      console.warn("[POST /api/reviews] Email alert warning:", emailErr);
    }

    try {
      // Instant phone notification dispatch to admin's mobile device
      await notifyAdmin({
        type: "REVIEW",
        title: `⭐ New Client Review: ${name}`,
        body: `${rating} Stars: "${text.slice(0, 80)}"`,
        url: "/admin",
      });
    } catch (pushErr) {
      console.warn("[POST /api/reviews] Push notification warning:", pushErr);
    }

    return NextResponse.json({
      ok: true,
      review: newReview,
    });
  } catch (err) {
    console.error("[POST /api/reviews] Error:", err);
    return NextResponse.json(
      { error: "Internal server error while saving review." },
      { status: 500 }
    );
  }
}
