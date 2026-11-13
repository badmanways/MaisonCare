import { NextRequest, NextResponse } from "next/server";
import { updateDbAsync } from "@/lib/db";
import { JobVacancy } from "@/lib/jobsData";
import { isAdminAuthenticated, sanitizeText } from "@/lib/security";

function buildJobTranslations(job: {
  title: string;
  fullTitle: string;
  location: string;
  type: string;
  aboutFamily: string;
  whoLookingFor: string[];
  tasks: string[];
  schedule: string;
  titleFr?: string;
  titleDe?: string;
  aboutFamilyFr?: string;
  aboutFamilyDe?: string;
  scheduleFr?: string;
  scheduleDe?: string;
}) {
  const typeFr =
    job.type.toLowerCase().includes("part")
      ? "Temps partiel"
      : job.type.toLowerCase().includes("live")
      ? "Logé(e) / Temps plein"
      : "Temps plein";

  const typeDe =
    job.type.toLowerCase().includes("part")
      ? "Teilzeit"
      : job.type.toLowerCase().includes("live")
      ? "Live-In / Vollzeit"
      : "Vollzeit";

  return {
    en: {
      title: job.title,
      fullTitle: job.fullTitle,
      location: job.location,
      type: job.type,
      aboutFamily: job.aboutFamily,
      whoLookingFor: job.whoLookingFor,
      tasks: job.tasks,
      schedule: job.schedule,
    },
    fr: {
      title: job.titleFr || `${job.title} (FR/EN)`,
      fullTitle: job.titleFr || job.fullTitle,
      location: job.location,
      type: typeFr,
      aboutFamily: job.aboutFamilyFr || job.aboutFamily,
      whoLookingFor: job.whoLookingFor,
      tasks: job.tasks,
      schedule: job.scheduleFr || job.schedule,
    },
    de: {
      title: job.titleDe || `${job.title} (DE/EN)`,
      fullTitle: job.titleDe || job.fullTitle,
      location: job.location,
      type: typeDe,
      aboutFamily: job.aboutFamilyDe || job.aboutFamily,
      whoLookingFor: job.whoLookingFor,
      tasks: job.tasks,
      schedule: job.scheduleDe || job.schedule,
    },
  };
}

function parseBulletArray(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => sanitizeText(item, 300)).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split("\n")
      .map((line) => sanitizeText(line.replace(/^[•\-*]\s*/, ""), 300))
      .filter(Boolean);
  }
  return [];
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = sanitizeText(body.title, 180);
    const fullTitle = sanitizeText(body.fullTitle, 220) || title;
    const location = sanitizeText(body.location, 120) || "Luxembourg";
    const salary = sanitizeText(body.salary, 40);
    const type = sanitizeText(body.type, 80) || "Full-time";
    const category = sanitizeText(body.category, 100) || "Nanny & Childcare";
    const aboutFamily = sanitizeText(body.aboutFamily, 2500);
    const schedule = sanitizeText(body.schedule, 1500);
    const whoLookingFor = parseBulletArray(body.whoLookingFor);
    const tasks = parseBulletArray(body.tasks);

    if (!title || !aboutFamily) {
      return NextResponse.json(
        { error: "Job title and role description are required." },
        { status: 400 }
      );
    }

    const translations = buildJobTranslations({
      title,
      fullTitle,
      location,
      type,
      aboutFamily,
      whoLookingFor:
        whoLookingFor.length > 0
          ? whoLookingFor
          : [
              "Verified prior experience in private households or commercial care in Luxembourg.",
              "Clean criminal record check (Extrait de casier judiciaire).",
              "High discretion, punctuality, and multilingual communication.",
            ],
      tasks:
        tasks.length > 0
          ? tasks
          : [
              "Deliver dedicated care and household support according to the agreed schedule.",
              "Maintain a safe, organized, and welcoming environment.",
            ],
      schedule:
        schedule ||
        "Flexible schedule in Luxembourg-Ville / surrounding communes. Immediate or agreed start date.",
      titleFr: sanitizeText(body.titleFr, 200),
      titleDe: sanitizeText(body.titleDe, 200),
      aboutFamilyFr: sanitizeText(body.aboutFamilyFr, 2500),
      aboutFamilyDe: sanitizeText(body.aboutFamilyDe, 2500),
      scheduleFr: sanitizeText(body.scheduleFr, 1500),
      scheduleDe: sanitizeText(body.scheduleDe, 1500),
    });

    const newJob: JobVacancy = {
      id: `job-${Date.now()}`,
      title,
      fullTitle,
      location,
      salary,
      type,
      category,
      aboutFamily,
      whoLookingFor: translations.en.whoLookingFor,
      tasks: translations.en.tasks,
      schedule: translations.en.schedule,
      translations,
      createdAt: new Date().toISOString(),
      active: true,
    };

    await updateDbAsync((db) => {
      db.jobVacancies.unshift(newJob);
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (err) {
    console.error("Error in POST /api/admin/jobs:", err);
    return NextResponse.json(
      { error: "Failed to create job vacancy." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required." },
        { status: 400 }
      );
    }

    const title = sanitizeText(body.title, 180);
    const fullTitle = sanitizeText(body.fullTitle, 220) || title;
    const location = sanitizeText(body.location, 120) || "Luxembourg";
    const salary = sanitizeText(body.salary, 40);
    const type = sanitizeText(body.type, 80) || "Full-time";
    const category = sanitizeText(body.category, 100) || "Nanny & Childcare";
    const aboutFamily = sanitizeText(body.aboutFamily, 2500);
    const schedule = sanitizeText(body.schedule, 1500);
    const whoLookingFor = parseBulletArray(body.whoLookingFor);
    const tasks = parseBulletArray(body.tasks);

    let updatedJob: JobVacancy | null = null;

    await updateDbAsync((db) => {
      const idx = db.jobVacancies.findIndex((j) => j.id === id);
      if (idx >= 0) {
        const existing = db.jobVacancies[idx];
        const translations = buildJobTranslations({
          title: title || existing.title,
          fullTitle: fullTitle || existing.fullTitle || existing.title,
          location: location || existing.location,
          type: type || existing.type,
          aboutFamily: aboutFamily || existing.aboutFamily,
          whoLookingFor:
            whoLookingFor.length > 0 ? whoLookingFor : existing.whoLookingFor,
          tasks: tasks.length > 0 ? tasks : existing.tasks,
          schedule: schedule || existing.schedule,
          titleFr:
            sanitizeText(body.titleFr, 200) ||
            existing.translations?.fr?.title,
          titleDe:
            sanitizeText(body.titleDe, 200) ||
            existing.translations?.de?.title,
          aboutFamilyFr:
            sanitizeText(body.aboutFamilyFr, 2500) ||
            existing.translations?.fr?.aboutFamily,
          aboutFamilyDe:
            sanitizeText(body.aboutFamilyDe, 2500) ||
            existing.translations?.de?.aboutFamily,
          scheduleFr:
            sanitizeText(body.scheduleFr, 1500) ||
            existing.translations?.fr?.schedule,
          scheduleDe:
            sanitizeText(body.scheduleDe, 1500) ||
            existing.translations?.de?.schedule,
        });

        updatedJob = {
          ...existing,
          title: translations.en.title,
          fullTitle: translations.en.fullTitle,
          location: translations.en.location,
          salary,
          type: translations.en.type,
          category,
          aboutFamily: translations.en.aboutFamily,
          whoLookingFor: translations.en.whoLookingFor,
          tasks: translations.en.tasks,
          schedule: translations.en.schedule,
          translations,
        };
        db.jobVacancies[idx] = updatedJob;
      }
    });

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (err) {
    console.error("Error in PUT /api/admin/jobs:", err);
    return NextResponse.json(
      { error: "Failed to update job vacancy." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required." },
        { status: 400 }
      );
    }

    await updateDbAsync((db) => {
      db.jobVacancies = db.jobVacancies.filter((j) => j.id !== id);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /api/admin/jobs:", err);
    return NextResponse.json(
      { error: "Failed to delete job vacancy." },
      { status: 500 }
    );
  }
}

