import { NextRequest, NextResponse } from "next/server";

const BLOCKED_BOT_PATTERNS = [
  /gptbot/i,
  /chatgpt-user/i,
  /ccbot/i,
  /claudebot/i,
  /anthropic-ai/i,
  /bytespider/i,
  /scrapy/i,
  /diffbot/i,
  /omgilibot/i,
  /perplexitybot/i,
  /cohere-ai/i,
  /imagesiftbot/i,
];

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";

  // 1. Anti-AI Scraping & LLM Harvesting Protection
  if (BLOCKED_BOT_PATTERNS.some((pattern) => pattern.test(ua))) {
    return new NextResponse(
      JSON.stringify({
        error:
          "Automated AI scraping and data harvesting is strictly prohibited on Nanny & MaisonCare Lëtzebuerg.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Robots-Tag": "noindex, nofollow, noai, noimageai",
        },
      }
    );
  }

  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const { pathname } = req.nextUrl;

  // 2. Domain Affix Support: Check if accessed via subdomain prefix (e.g. admin.nannymaisoncare.lu)
  const isAdminSubdomain = hostname.startsWith("admin.");

  if (isAdminSubdomain) {
    // When accessing root '/' on admin.nannymaisoncare.lu, rewrite internally to '/admin'
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      const res = NextResponse.rewrite(url);
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noai, noimageai");
      return res;
    }

    // Pass through API calls, static assets, manifests, and Service Worker untouched
    const isSpecialPath =
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/icons") ||
      pathname.startsWith("/sounds") ||
      pathname === "/admin-manifest.webmanifest" ||
      pathname === "/manifest.json" ||
      pathname === "/sw.js" ||
      pathname === "/favicon.ico" ||
      pathname === "/robots.txt";

    if (!isSpecialPath && !pathname.startsWith("/admin")) {
      // Rewrite any secondary routes on admin subdomain to stay inside /admin
      const url = req.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      const res = NextResponse.rewrite(url);
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noai, noimageai");
      return res;
    }
  }

  // 3. Standard Path Affix & Security Headers
  const res = NextResponse.next();
  const isAdminPath = pathname.startsWith("/admin") || isAdminSubdomain;
  res.headers.set(
    "X-Robots-Tag",
    isAdminPath ? "noindex, nofollow, noai, noimageai" : "noai, noimageai"
  );
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|sounds/|sw.js|manifest.json|admin-manifest.webmanifest).*)",
  ],
};
