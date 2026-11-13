import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { CV_STORAGE_DIR, readDbAsync } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/security";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json(
      { error: "Unauthorized administrator access required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const db = await readDbAsync();
    const app = db.jobApplications.find((a) => a.id === id);

    if (!app) {
      return NextResponse.json(
        { error: "Application record not found." },
        { status: 404 }
      );
    }

    let fileBuffer: Buffer | null = null;

    if (app.cvBase64) {
      fileBuffer = Buffer.from(app.cvBase64, "base64");
    } else {
      const safeFileName = path.basename(app.cvStoredPath);
      const fullPath = path.join(CV_STORAGE_DIR, safeFileName);
      if (fs.existsSync(fullPath)) {
        fileBuffer = fs.readFileSync(fullPath);
      } else if (app.cvStorageUrl) {
        return NextResponse.redirect(app.cvStorageUrl);
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { error: "CV file not available." },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") === "download" ? "attachment" : "inline";

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": app.cvMimeType || "application/pdf",
        "Content-Disposition": `${mode}; filename="${encodeURIComponent(
          app.cvFileName
        )}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/admin/cv/[id]:", err);
    return NextResponse.json(
      { error: "Failed to stream CV file." },
      { status: 500 }
    );
  }
}

