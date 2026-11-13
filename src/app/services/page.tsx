"use client";

import React from "react";
import {
  ShieldCheck,
  UserCheck,
  Award,
  PhoneCall,
  Scale,
  FileCheck2,
} from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import SharedHero from "@/components/sections/SharedHero";
import EcosystemSection from "@/components/sections/EcosystemSection";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <PublicChrome>
      <SharedHero
        title={t.servicesPage.heroTitle}
        subtitle={t.servicesPage.heroSubtitle}
      />

      {/* Primary Ecosystem of Care Glassmorphism Cards (Matches Services.png) */}
      <EcosystemSection showLearnMore={false} />

      {/* How to Request a Service (4 Steps) */}
      <section className="w-full bg-[#FAF8F5] py-16 md:py-24 border-t border-[#242423]/5">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-[740px] mx-auto">
            <span className="inline-block border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-semibold uppercase tracking-wider px-5 py-1.5 rounded-full">
              {t.servicesPage.howItWorksBadge}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-[#242423] tracking-tight">
              {t.servicesPage.howItWorksTitle}
            </h2>
          </div>

          {/* 4-Step Request Process Cards */}
          <div className="mt-10 mobile-horizontal-scroll md:grid md:grid-cols-4 md:gap-5">
            {t.servicesPage.steps.map((step) => (
              <div
                key={step.step}
                className="mobile-snap-card w-[80vw] max-w-[290px] md:w-full md:max-w-none bg-[#FEF7E9] border border-[#F1AE1F]/40 rounded-[16px] p-6"
              >
                <div className="text-xs font-bold text-[#F1AE1F] tracking-widest">
                  {t.servicesPage.stepLabel} {step.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[#242423]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] text-[#707070] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* TRUST AND SAFETY, OUR PRIORITY */}
          <div className="mt-16 bg-[#FEF7E9] border border-[#F1AE1F]/40 rounded-[24px] p-6 sm:p-10 md:p-12 shadow-xs">
            <div className="max-w-[880px] mx-auto text-center space-y-3">
              <span className="inline-flex items-center gap-2 border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/70">
                <ShieldCheck className="w-4 h-4 text-[#005F1B]" />
                <span>{t.servicesPage.trustAndSafety.badge}</span>
              </span>

              <h3 className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-[#242423] tracking-tight leading-snug pt-2">
                {t.servicesPage.trustAndSafety.title}
              </h3>

              <p className="text-sm sm:text-base text-[#707070] font-medium leading-relaxed">
                {t.servicesPage.trustAndSafety.subtitle}
              </p>
            </div>

            {/* Vetting Process Header */}
            <div className="mt-10 pt-8 border-t border-[#242423]/10">
              <span className="text-xs font-bold tracking-widest text-[#005F1B] uppercase block text-center mb-6">
                {t.servicesPage.trustAndSafety.vettingHeader}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Identity Verification */}
                <div className="bg-white border border-[#242423]/10 rounded-[18px] p-6 shadow-xs hover:border-[#005F1B] transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mb-4">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#242423]">
                      {t.servicesPage.trustAndSafety.items[0].title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#707070] leading-relaxed">
                      {t.servicesPage.trustAndSafety.items[0].description}
                    </p>
                  </div>
                </div>

                {/* 2. Qualifications & Experience */}
                <div className="bg-white border border-[#242423]/10 rounded-[18px] p-6 shadow-xs hover:border-[#005F1B] transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mb-4">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#242423]">
                      {t.servicesPage.trustAndSafety.items[1].title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#707070] leading-relaxed">
                      {t.servicesPage.trustAndSafety.items[1].description}
                    </p>
                  </div>
                </div>

                {/* 3. Reference Checks */}
                <div className="bg-white border border-[#242423]/10 rounded-[18px] p-6 shadow-xs hover:border-[#005F1B] transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mb-4">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#242423]">
                      {t.servicesPage.trustAndSafety.items[2].title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#707070] leading-relaxed">
                      {t.servicesPage.trustAndSafety.items[2].description}
                    </p>
                  </div>
                </div>

                {/* 4. Background Checks */}
                <div className="bg-white border border-[#242423]/10 rounded-[18px] p-6 shadow-xs hover:border-[#005F1B] transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mb-4">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#242423]">
                      {t.servicesPage.trustAndSafety.items[3].title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#707070] leading-relaxed">
                      {t.servicesPage.trustAndSafety.items[3].description}
                    </p>
                  </div>
                </div>

                {/* 5. Insurance & Compliance */}
                <div className="bg-white border border-[#242423]/10 rounded-[18px] p-6 shadow-xs hover:border-[#005F1B] transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mb-4">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#242423]">
                      {t.servicesPage.trustAndSafety.items[4].title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#707070] leading-relaxed">
                      {t.servicesPage.trustAndSafety.items[4].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Commitment Footer */}
            <div className="mt-8 pt-6 border-t border-[#242423]/10 text-center">
              <div className="max-w-[820px] mx-auto bg-[#EEF5EC] border border-[#005F1B]/15 rounded-2xl p-5 sm:p-6 text-[#005F1B] leading-relaxed text-xs sm:text-sm font-medium">
                {t.servicesPage.trustAndSafety.commitmentFooter}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
