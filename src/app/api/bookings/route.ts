import { NextRequest, NextResponse } from "next/server";
import { BookingRecord, updateDbAsync } from "@/lib/db";
import { sendBookingAdminAlert } from "@/lib/emailService";
import { notifyAdmin } from "@/lib/pushService";
import { checkRateLimit, sanitizeText, validateAntiBot } from "@/lib/security";

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, "api_bookings", 15, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many booking requests. Please wait a moment and try again." },
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
    const phone = sanitizeText(body.phone, 60);
    const category = sanitizeText(body.category, 140) || "Custom Concierge";
    const categorySlug = sanitizeText(body.categorySlug, 40) || "concierge";
    const services = Array.isArray(body.services)
      ? body.services.map((s: unknown) => sanitizeText(s, 100)).filter(Boolean)
      : [];
    const serviceDate = sanitizeText(body.serviceDate, 40);
    const startTime = sanitizeText(body.startTime, 40);
    const durationHours = sanitizeText(body.durationHours, 40);
    const frequency = sanitizeText(body.frequency, 40) || "once";
    const location = sanitizeText(body.location, 240);
    const premisesType = sanitizeText(body.premisesType, 100);
    const preferredContactMethod = sanitizeText(body.preferredContactMethod, 40);
    const weekdays = Array.isArray(body.weekdays)
      ? body.weekdays.map((w: unknown) => sanitizeText(w, 20)).filter(Boolean)
      : [];

    let customNotes = sanitizeText(body.customNotes, 4000);
    if (!customNotes) {
      customNotes = `Service requested: ${services.join(", ") || category} in ${location || "Luxembourg"}.`;
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required to submit an enquiry." },
        { status: 400 }
      );
    }

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      name,
      email,
      phone,
      category,
      categorySlug,
      services,
      serviceDate,
      startTime,
      durationHours,
      frequency,
      location,
      premisesType: premisesType || undefined,
      preferredContactMethod: preferredContactMethod || undefined,
      weekdays: weekdays.length ? weekdays : undefined,
      propertyDetails: body.propertyDetails && typeof body.propertyDetails === "object" ? body.propertyDetails : undefined,
      childDetails: body.childDetails && typeof body.childDetails === "object" ? body.childDetails : undefined,
      petDetails: body.petDetails && typeof body.petDetails === "object" ? body.petDetails : undefined,
      specificDetails: body.specificDetails && typeof body.specificDetails === "object" ? body.specificDetails : undefined,
      customNotes,
      status: "NEW",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    try {
      await updateDbAsync((draft) => {
        draft.bookings.unshift(newBooking);
      });
    } catch (dbErr) {
      console.warn("[POST /api/bookings] DB update warning:", dbErr);
    }

    try {
      await sendBookingAdminAlert(newBooking);
    } catch (emailErr) {
      console.warn("[POST /api/bookings] Email alert dispatch warning:", emailErr);
    }

    try {
      // Instant phone notification dispatch to admin's mobile device
      await notifyAdmin({
        type: "BOOKING",
        title: `🔔 New Booking: ${name}`,
        body: `${category} • ${services.slice(0, 2).join(", ") || "General"} • ${location || "Luxembourg"}`,
        url: "/admin",
      });
    } catch (pushErr) {
      console.warn("[POST /api/bookings] Push notification warning:", pushErr);
    }

    return NextResponse.json({
      ok: true,
      booking: newBooking,
    });
  } catch (err) {
    console.error("[POST /api/bookings] Error:", err);
    return NextResponse.json(
      { error: "Internal server error while processing booking." },
      { status: 500 }
    );
  }
}
