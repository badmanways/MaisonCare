"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Map, Calendar, Euro } from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import SharedHero from "@/components/sections/SharedHero";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_JOBS, JobVacancy, getLocalizedJob } from "@/lib/jobsData";

export default function JobsPage() {
  const { locale, t } = useLanguage();
  const [jobs, setJobs] = useState<JobVacancy[]>(INITIAL_JOBS);

  useEffect(() => {
    let active = true;
    fetch("/api/jobs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {
        // Fallback to initial seeded Luxembourg jobs
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PublicChrome>
      <SharedHero
        title={t.jobsPage.heroTitle}
        subtitle={t.jobsPage.heroSubtitle}
      />

      {/* Main Jobs Section matching Jobs.png */}
      <section className="w-full bg-[#FAF8F5] py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          {/* Header */}
          <div>
            <span className="inline-block border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-semibold uppercase tracking-wider px-6 py-1.5 rounded-full">
              {t.jobsPage.sectionBadge}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-[46px] font-semibold text-[#242423] tracking-tight">
              {t.jobsPage.sectionTitle}
            </h2>
          </div>

          {/* Mobile (< 768px): Horizontal Snap Scroll | Desktop (>= 768px): 3-Column Grid */}
          <div className="mt-10 md:mt-12 mobile-horizontal-scroll md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {jobs.map((rawJob) => {
              const job = getLocalizedJob(rawJob, locale);
              return (
                <div
                  key={job.id}
                  className="mobile-snap-card w-[85vw] max-w-[350px] md:w-full md:max-w-none border border-[#F1AE1F] rounded-[16px] bg-[#FAF8F5] p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="text-lg sm:text-[19px] font-semibold text-[#242423] leading-snug">
                      {job.title}
                    </h3>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-[13px] text-[#707070]">
                      <div className="inline-flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#242423]" />
                        <span>{job.location}</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5">
                        <Euro className="w-4 h-4 text-[#242423]" />
                        <span>
                          {job.salary
                            ? job.salary.includes("€")
                              ? job.salary
                              : `€${job.salary}`
                            : t.jobsPage.competitiveSalary}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs sm:text-[13px] text-[#707070]">
                      <Calendar className="w-4 h-4 text-[#242423]" />
                      <span>{job.type}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-sm py-3 rounded-[10px] inline-flex items-center justify-center transition-all shadow-sm"
                    >
                      {t.jobsPage.learnMore}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
