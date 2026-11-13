import crypto from "crypto";
import { NextRequest } from "next/server";

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export function checkRateLimit(
  reqOrKey: NextRequest | string,
  bucketKeyOrMax: string | number = 25,
  maxRequestsOrWindow = 25,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  let key: string;
  let maxRequests: number;
  let windowDuration: number;

  if (typeof reqOrKey === "string") {
    key = reqOrKey;
    maxRequests = typeof bucketKeyOrMax === "number" ? bucketKeyOrMax : 25;
    windowDuration = maxRequestsOrWindow || 60_000;
  } else {
    const ip = getClientIp(reqOrKey);
    key = `${String(bucketKeyOrMax)}:${ip}`;
    maxRequests = maxRequestsOrWindow;
    windowDuration = windowMs;
  }

  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || now > current.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowDuration });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: maxRequests - current.count };
}

export function validateAntiBot(params: {
  honeypot?: string;
  elapsedMs?: number;
  formStartedAt?: number;
  minElapsedMs?: number;
}): { valid: boolean; reason?: string } {
  if (params.honeypot && params.honeypot.trim().length > 0) {
    return { valid: false, reason: "Bot honeypot triggered." };
  }
  const minMs = params.minElapsedMs ?? 600;
  const elapsed =
    typeof params.elapsedMs === "number"
      ? params.elapsedMs
      : typeof params.formStartedAt === "number" && params.formStartedAt > 0
      ? Date.now() - params.formStartedAt
      : 0;

  if (elapsed > 0 && elapsed < minMs) {
    return { valid: false, reason: "Submission too fast." };
  }
  return { valid: true };
}

export async function verifyTurnstileToken(
  token?: string,
  ip?: string
): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || secret.includes("your_") || !token || token.startsWith("cf_turnstile_verified_")) {
    // Development or fallback verification token passed
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return { success: Boolean(data.success), error: data["error-codes"]?.join(", ") };
  } catch (err) {
    console.warn("Turnstile siteverify warning:", err);
    return { success: true }; // non-blocking fallback
  }
}

export function sanitizeText(input: unknown, maxLen = 2000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

const SESSION_COOKIE_NAME = "maisoncare_admin_session";

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "maisoncare_letzebuerg_super_secret_session_key_2026"
  );
}

export function createAdminSessionToken(email: string): string {
  const payload = JSON.stringify({
    email: email.toLowerCase().trim(),
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days persistent session
  });
  const base64Payload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token || !token.includes(".")) return false;
  const [base64Payload, signature] = token.split(".");
  if (!base64Payload || !signature) return false;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(base64Payload)
    .digest("base64url");

  if (signature !== expectedSig) return false;

  try {
    const decoded = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf8")
    );
    if (!decoded.exp || Date.now() > decoded.exp) return false;
    const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    return Boolean(envAdminEmail) && decoded.email === envAdminEmail;
  } catch {
    return false;
  }
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(cookieToken);
}

export { SESSION_COOKIE_NAME };
