"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import SharedHero from "@/components/sections/SharedHero";
import { useLanguage } from "@/context/LanguageContext";
import TurnstileShield from "@/components/security/TurnstileShield";

export default function ContactPage() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [openedAt] = useState<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          honeypot,
          elapsedMs: Date.now() - openedAt,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicChrome>
      <SharedHero
        title={t.contactPage.heroTitle}
        subtitle={t.contactPage.heroSubtitle}
      />

      {/* Main Contact Form & Info Section matching Contact Us.png */}
      <section className="w-full bg-[#FAF8F5] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left Column: Minimalist Underline Contact Form */}
            <div className="md:col-span-6">
              {submitted ? (
                <div className="bg-[#EEF5EC] rounded-[16px] p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#005F1B] text-[#FAF8F5] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm sm:text-base text-[#242423] font-medium">
                    {t.contactPage.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="bg-[#F1AE1F] text-[#242423] text-xs font-medium px-6 py-2.5 rounded-lg"
                  >
                    {t.contactPage.sendAnotherBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
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
                      {t.contactPage.nameLabel}
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
                      {t.contactPage.emailLabel}
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

                  {/* Your message* */}
                  <div className="border-b border-[#242423]/12 pb-2.5">
                    <label className="block text-[13px] font-medium text-[#242423]">
                      {t.contactPage.messageLabel}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your requirements or enquiries..."
                      className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                        message ? "text-[#242423]" : "text-[#707070]/70"
                      } placeholder:text-[#707070]/60 focus:outline-none resize-none`}
                    />
                  </div>

                  <TurnstileShield compact />

                  {/* Send us a message (#F1AE1F) */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] disabled:opacity-60 text-[#242423] font-medium text-sm py-3.5 rounded-[10px] transition-all shadow-sm"
                    >
                      {t.contactPage.submitBtn}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Direct Channels (Email, 3 Contact Numbers, Luxembourg Headquarters) */}
            <div className="md:col-span-6 flex flex-col items-center justify-center space-y-8 sm:space-y-10 text-center">
              {/* Write to Us */}
              <a
                href={`mailto:${t.contactPage.emailAddress}`}
                className="group flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FEF7E9] border border-[#F1AE1F]/30 flex items-center justify-center text-[#242423] shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6 stroke-[1.75] text-[#005F1B]" />
                </div>
                <div className="mt-3.5 text-sm font-semibold text-[#242423]">
                  {t.contactPage.writeToUs}
                </div>
                <div className="mt-1 text-xs text-[#707070] group-hover:text-[#005F1B] transition-colors">
                  {t.contactPage.emailAddress}
                </div>
              </a>

              {/* Official Contact Numbers */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FEF7E9] border border-[#F1AE1F]/30 flex items-center justify-center text-[#242423] shadow-sm">
                  <Phone className="w-6 h-6 stroke-[1.75] text-[#005F1B]" />
                </div>
                <div className="mt-3.5 text-sm font-semibold text-[#242423]">
                  {t.contactPage.officialNumbersTitle}
                </div>
                <div className="mt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#242423]">
                  {t.contactPage.phoneNumbers.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="bg-[#FEF7E9] hover:bg-[#F1AE1F] hover:text-[#242423] font-medium px-3.5 py-1.5 rounded-full border border-[#242423]/10 transition-colors shadow-2xs"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              {/* Headquarters Address */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FEF7E9] border border-[#F1AE1F]/30 flex items-center justify-center text-[#242423] shadow-sm">
                  <MapPin className="w-6 h-6 stroke-[1.75] text-[#005F1B]" />
                </div>
                <div className="mt-3.5 text-sm font-semibold text-[#242423]">
                  {t.contactPage.addressTitle}
                </div>
                <div className="mt-1 text-xs text-[#707070]">
                  {t.contactPage.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
