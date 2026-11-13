import { NextResponse } from "next/server";
import { readDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await readDbAsync();
  const activeJobs = (db.jobVacancies || []).filter((j) => j.active !== false);
  return NextResponse.json({ jobs: activeJobs });
}
