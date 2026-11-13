import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  createAdminSessionToken,
  isAdminAuthenticated,
  SESSION_COOKIE_NAME,
} from "@/lib/security";

export async function GET(req: NextRequest) {
  const authenticated = isAdminAuthenticated(req);
  const adminEmail = process.env.ADMIN_EMAIL || "info@nannymaisoncare.lu";
  return NextResponse.json({
    authenticated,
    adminEmail: authenticated ? adminEmail : null,
  });
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, "admin_login", 12, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    const allowedEmail = (process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();
    const allowedPassword = process.env.ADMIN_PASSWORD || "";

    if (!allowedEmail || !allowedPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured on the server." },
        { status: 500 }
      );
    }

    if (email !== allowedEmail || password !== allowedPassword) {
      return NextResponse.json(
        {
          error:
            "Invalid administrator credentials. Access is restricted to the single whitelisted MaisonCare administrator.",
        },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(allowedEmail);
    const res = NextResponse.json({
      success: true,
      adminEmail: allowedEmail,
    });

    const host = req.headers.get("host") || "";
    const isProdDomain = host.includes("nannymaisoncare.lu");

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain: isProdDomain ? ".nannymaisoncare.lu" : undefined,
      maxAge: 60 * 60 * 24 * 7, // 7 days persistent session
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid login request." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  const host = req.headers.get("host") || "";
  const isProdDomain = host.includes("nannymaisoncare.lu");

  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    domain: isProdDomain ? ".nannymaisoncare.lu" : undefined,
    maxAge: 0,
  });
  return res;
}

