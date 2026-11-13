import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NON_ICLOUD_CACHE_DIR =
  "/Users/badman/.gemini/antigravity/brain/728cdf5a-05a3-478a-af10-03887c19b9c7/media-assets";

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

// In-memory buffer cache so repeated image requests require zero file descriptors (prevents macOS EMFILE)
const memoryBufferCache = new Map<string, { buffer: Buffer; contentType: string }>();

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const safeName = path.basename(params.filename || "");
  if (!safeName) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const cached = memoryBufferCache.get(safeName);
  if (cached) {
    return new NextResponse(new Uint8Array(cached.buffer), {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const cachePath = path.join(NON_ICLOUD_CACHE_DIR, safeName);
  const publicPath = path.join(process.cwd(), "public", "images", safeName);

  let targetPath = "";
  if (fs.existsSync(cachePath)) {
    targetPath = cachePath;
  } else if (fs.existsSync(publicPath)) {
    targetPath = publicPath;
  } else {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const contentType = MIME_MAP[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(targetPath);

  memoryBufferCache.set(safeName, { buffer, contentType });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

