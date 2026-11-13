"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_JOBS, JobVacancy, getLocalizedJob } from "@/lib/jobsData";
import TurnstileShield from "@/components/security/TurnstileShield";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = typeof params?.id === "string" ? params.id : "job-1";
  const { locale, t } = useLanguage();

  const [rawJob, setRawJob] = useState<JobVacancy>(
    INITIAL_JOBS.find((j) => j.id === jobId) || INITIAL_JOBS[0]
  );

  // Application Form State matching Jobs 2.png
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whyConsidered, setWhyConsidered] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [openedAt] = useState<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const foundLocal = INITIAL_JOBS.find((j) => j.id === jobId);
    if (foundLocal) setRawJob(foundLocal);

    fetch("/api/jobs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.jobs && Array.isArray(data.jobs)) {
          const match = data.jobs.find((j: JobVacancy) => j.id === jobId);
          if (match) setRawJob(match);
        }
      })
      .catch(() => {
        // Fallback to local
      });
  }, [jobId]);

  const job = getLocalizedJob(rawJob, locale);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const lowerName = file.name.toLowerCase();
    const isAllowedExt = allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isAllowedExt) {
      setErrorMsg(t.jobsPage.applyForm.errorFileType);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(t.jobsPage.applyForm.errorFileSize);
      e.target.value = "";
      return;
    }

    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!cvFile) {
      setErrorMsg(t.jobsPage.applyForm.errorMissingCv);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jobId", job.id);
      formData.append("jobTitle", job.fullTitle || job.title);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("whyConsidered", whyConsidered);
      formData.append("expectedSalary", expectedSalary);
      formData.append("cv", cvFile);
      formData.append("honeypot", honeypot);
      formData.append("elapsedMs", String(Date.now() - openedAt));

      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || t.jobsPage.applyForm.errorSubmit);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicChrome>
      {/* Top Cream Banner matching Jobs 2.png */}
      <section className="w-full bg-[#FEF7E9] pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#707070] hover:text-[#242423] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.jobsPage.backToJobs}</span>
          </Link>

          <h1 className="max-w-[780px] text-3xl sm:text-4xl md:text-[46px] font-semibold text-[#242423] tracking-tight leading-[1.15]">
            {job.fullTitle || job.title}
          </h1>
        </div>
      </section>

      {/* Two-Column Role Details & CV Application Card matching Jobs 2.png */}
      <section className="w-full bg-[#FAF8F5] py-14 md:py-20">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Role Details */}
            <div className="lg:col-span-7 space-y-9">
              {/* About the family */}
              <div>
                <h2 className="text-2xl sm:text-[28px] font-semibold text-[#242423]">
                  {t.jobsPage.aboutFamilyTitle}
                </h2>
                <p className="mt-3.5 text-sm sm:text-[15px] text-[#242423]/85 leading-[1.8]">
                  {job.aboutFamily}
                </p>
              </div>

              {/* Who are we looking for? */}
              <div>
                <h2 className="text-2xl sm:text-[28px] font-semibold text-[#242423]">
                  {t.jobsPage.whoLookingForTitle}
                </h2>
                <ul className="mt-4 space-y-2 text-sm sm:text-[15px] text-[#242423]/85 list-disc pl-5">
                  {(job.whoLookingFor || []).map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What are your tasks? */}
              <div>
                <h2 className="text-2xl sm:text-[28px] font-semibold text-[#242423]">
                  {t.jobsPage.tasksTitle}
                </h2>
                <ul className="mt-4 space-y-2 text-sm sm:text-[15px] text-[#242423]/85 list-disc pl-5">
                  {(job.tasks || []).map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What does your weekly schedule look like? */}
              <div>
                <h2 className="text-2xl sm:text-[28px] font-semibold text-[#242423]">
                  {t.jobsPage.scheduleTitle}
                </h2>
                <p className="mt-3.5 text-sm sm:text-[15px] text-[#242423]/85 leading-[1.8]">
                  {job.schedule}
                </p>
              </div>
            </div>

            {/* Right Column: Gold-Bordered Application Form Card matching Jobs 2.png */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="border border-[#F1AE1F] rounded-[16px] bg-[#FAF8F5] p-6 sm:p-8 shadow-sm">
                {submitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#242423]">
                      {t.jobsPage.applyForm.successTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#707070] leading-relaxed">
                      {t.jobsPage.applyForm.successMessage}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                    />

                    {/* Name* */}
                    <div className="border-b border-[#242423]/12 pb-2.5">
                      <label className="block text-[13px] font-medium text-[#242423]">
                        {t.jobsPage.applyForm.name}
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Marie Laurent"
                        className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                          name ? "text-[#242423]" : "text-[#707070]/70"
                        } placeholder:text-[#707070]/60 focus:outline-none`}
                      />
                    </div>

                    {/* Email* */}
                    <div className="border-b border-[#242423]/12 pb-2.5">
                      <label className="block text-[13px] font-medium text-[#242423]">
                        {t.jobsPage.applyForm.email}
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.lu"
                        className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                          email ? "text-[#242423]" : "text-[#707070]/70"
                        } placeholder:text-[#707070]/60 focus:outline-none`}
                      />
                    </div>

                    {/* Why should you be considered for the role? */}
                    <div className="border-b border-[#242423]/12 pb-2.5">
                      <label className="block text-[13px] font-medium text-[#242423]">
                        {t.jobsPage.applyForm.whyConsidered}
                      </label>
                      <input
                        type="text"
                        required
                        value={whyConsidered}
                        onChange={(e) => setWhyConsidered(e.target.value)}
                        placeholder="Brief summary of your experience..."
                        className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                          whyConsidered ? "text-[#242423]" : "text-[#707070]/70"
                        } placeholder:text-[#707070]/60 focus:outline-none`}
                      />
                    </div>

                    {/* Expected salary per month */}
                    <div className="border-b border-[#242423]/12 pb-2.5">
                      <label className="block text-[13px] font-medium text-[#242423]">
                        {t.jobsPage.applyForm.expectedSalary}
                      </label>
                      <input
                        type="text"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        placeholder="e.g. €3,200 / month or to discuss"
                        className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                          expectedSalary ? "text-[#242423]" : "text-[#707070]/70"
                        } placeholder:text-[#707070]/60 focus:outline-none`}
                      />
                    </div>

                    {/* Click here to upload your CV/Cover Letter* */}
                    <div className="border-b border-[#242423]/12 pb-3 pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-left text-base text-[#242423] w-full"
                      >
                        <span className="font-bold underline">
                          {t.jobsPage.applyForm.uploadPromptPrefix}
                        </span>
                        <span>{t.jobsPage.applyForm.uploadPromptSuffix}</span>
                        <span className="text-red-500">*</span>
                      </button>

                      {cvFile && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#005F1B] bg-[#EEF5EC] px-2.5 py-1 rounded-md">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[240px]">{cvFile.name}</span>
                        </div>
                      )}
                    </div>

                    <TurnstileShield compact />

                    {errorMsg && (
                      <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                    )}

                    {/* Submit Application Button (#F1AE1F) */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] disabled:opacity-60 text-[#242423] font-medium text-sm py-3.5 rounded-[10px] transition-all shadow-sm"
                      >
                        {submitting
                          ? t.jobsPage.applyForm.submitting
                          : t.jobsPage.applyForm.submitBtn}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
