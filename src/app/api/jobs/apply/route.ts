import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CV_STORAGE_DIR, JobApplicationRecord, updateDbAsync } from "@/lib/db";
import { sendJobApplicationAdminAlert } from "@/lib/emailService";
import { notifyAdmin } from "@/lib/pushService";
import { checkRateLimit, sanitizeText, validateAntiBot } from "@/lib/security";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, "api_jobs_apply", 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many application submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();

    const honeypot = String(formData.get("honeypot") || "");
    const elapsedMs = Number(formData.get("elapsedMs") || 0);
    const botCheck = validateAntiBot({ honeypot, elapsedMs });
    if (!botCheck.valid) {
      return NextResponse.json({ error: botCheck.reason }, { status: 400 });
    }

    const jobId = sanitizeText(formData.get("jobId"), 80) || "job-1";
    const jobTitle =
      sanitizeText(formData.get("jobTitle"), 200) ||
      "Nanny & MaisonCare Position";
    const name = sanitizeText(formData.get("name"), 140);
    const email = sanitizeText(formData.get("email"), 160);
    const phone = sanitizeText(formData.get("phone"), 60);
    const whyConsidered = sanitizeText(formData.get("whyConsidered"), 2500);
    const expectedSalary = sanitizeText(formData.get("expectedSalary"), 60);

    const cvFile = formData.get("cv") as File | null;
    if (!name || !email || !cvFile) {
      return NextResponse.json(
        { error: "Name, email, and CV file are required." },
        { status: 400 }
      );
    }

    const originalName = path.basename(cvFile.name || "candidate-cv.pdf");
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file format. Only .pdf, .doc, and .docx are allowed." },
        { status: 400 }
      );
    }

    if (
      cvFile.type &&
      !ALLOWED_MIME_TYPES.includes(cvFile.type) &&
      !cvFile.type.includes("pdf") &&
      !cvFile.type.includes("word")
    ) {
      return NextResponse.json(
        { error: "Invalid file MIME type. Please upload a valid PDF or Word document." },
        { status: 400 }
      );
    }

    if (cvFile.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { error: "CV file exceeds maximum size limit of 5MB." },
        { status: 400 }
      );
    }

    if (!fs.existsSync(CV_STORAGE_DIR)) {
      fs.mkdirSync(CV_STORAGE_DIR, { recursive: true });
    }

    const safeStoredFileName = `cv-${Date.now()}-${originalName.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;
    const fullDiskPath = path.join(CV_STORAGE_DIR, safeStoredFileName);

    const arrayBuffer = await cvFile.arrayBuffer();
    const cvBuffer = Buffer.from(arrayBuffer);
    try {
      fs.writeFileSync(fullDiskPath, cvBuffer);
    } catch {
      // Non-fatal if serverless disk is restricted
    }

    const cvBase64 = cvBuffer.toString("base64");
    let cvStorageUrl: string | undefined;

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { uploadCvToSupabaseStorage } = require("@/lib/supabase");
      const uploaded = await uploadCvToSupabaseStorage(
        safeStoredFileName,
        cvBuffer,
        cvFile.type || "application/pdf"
      );
      if (uploaded) cvStorageUrl = uploaded;
    } catch {
      // Non-fatal fallback to base64
    }

    const newApp: JobApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle,
      name,
      email,
      phone,
      whyConsidered,
      expectedSalary,
      cvFileName: originalName,
      cvMimeType: cvFile.type || "application/pdf",
      cvSizeBytes: cvFile.size,
      cvStoredPath: safeStoredFileName,
      cvBase64,
      cvStorageUrl,
      status: "NEW",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    try {
      await updateDbAsync((draft) => {
        draft.jobApplications.unshift(newApp);
      });
    } catch (dbErr) {
      console.warn("[POST /api/jobs/apply] DB save warning:", dbErr);
    }

    try {
      await sendJobApplicationAdminAlert(newApp, fullDiskPath);
    } catch (emailErr) {
      console.warn("[POST /api/jobs/apply] Email alert warning:", emailErr);
    }

    try {
      // Instant phone notification dispatch to admin's mobile device
      await notifyAdmin({
        type: "APPLICATION",
        title: `📄 New Application: ${name}`,
        body: `${jobTitle} • CV: ${originalName}`,
        url: "/admin",
      });
    } catch (pushErr) {
      console.warn("[POST /api/jobs/apply] Push alert warning:", pushErr);
    }

    return NextResponse.json({
      ok: true,
      application: {
        id: newApp.id,
        name: newApp.name,
        jobTitle: newApp.jobTitle,
      },
    });
  } catch (err) {
    console.error("[POST /api/jobs/apply] Error:", err);
    return NextResponse.json(
      { error: "Internal server error while submitting application." },
      { status: 500 }
    );
  }
}
