"use client";

import React from "react";
import { Eye } from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import SharedHero from "@/components/sections/SharedHero";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const pillarsTop = t.about.pillars.slice(0, 3);
  const pillarsBottom = t.about.pillars.slice(3, 5);

  return (
    <PublicChrome>
      <SharedHero
        title={t.about.heroTitle}
        subtitle={
          <>
            <span>{t.about.heroSubtitlePrefix}</span>
            <span className="text-[#F1AE1F] font-semibold">
              {t.about.heroSubtitleHighlight}
            </span>
            <span>{t.about.heroSubtitleSuffix}</span>
          </>
        }
      />

      {/* WHO WE ARE Section (#FAF8F5 surface matching About.png) */}
      <section className="w-full bg-[#FAF8F5] py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column */}
            <div className="lg:col-span-5 lg:pt-28">
              <span className="inline-block border border-[#005F1B] text-[#005F1B] text-[11px] font-semibold uppercase tracking-wider px-5 py-1.5 rounded-full">
                {t.about.whoWeAreBadge}
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-semibold text-[#242423] tracking-tight">
                {t.about.whoWeAreTitle}
              </h2>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-10">
              <p className="text-sm sm:text-[15px] text-[#242423]/90 leading-[1.8]">
                {t.about.whoWeAreLead}
              </p>

              {/* Mission & Vision Cards (#EEF5EC surface with #005F1B circular icon) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#EEF5EC] rounded-[16px] p-7 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#005F1B] text-[#FAF8F5] flex items-center justify-center mb-4 shadow-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#242423]">
                    {t.about.missionTitle}
                  </h3>
                  <p className="mt-3 text-xs sm:text-[13px] text-[#707070] leading-relaxed">
                    {t.about.missionText}
                  </p>
                </div>

                <div className="bg-[#EEF5EC] rounded-[16px] p-7 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#005F1B] text-[#FAF8F5] flex items-center justify-center mb-4 shadow-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#242423]">
                    {t.about.visionTitle}
                  </h3>
                  <p className="mt-3 text-xs sm:text-[13px] text-[#707070] leading-relaxed">
                    {t.about.visionText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PILLARS OF MAISONCARE Section (#FEF7E9 surface matching About.png) */}
      <section className="w-full bg-[#FEF7E9] py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <div>
            <span className="inline-block border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-semibold uppercase tracking-wider px-5 py-1.5 rounded-full">
              {t.about.pillarsBadge}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-[48px] font-semibold text-[#242423] tracking-tight leading-tight">
              {t.about.pillarsTitle}
            </h2>
          </div>

          {/* Mobile (< 768px): Horizontal Snap Scroll */}
          <div className="mt-10 md:hidden mobile-horizontal-scroll">
            {t.about.pillars.map((pillar) => (
              <div
                key={pillar.tag}
                className="mobile-snap-card w-[82vw] max-w-[330px] border border-[#F1AE1F] rounded-[16px] bg-[#FEF7E9] p-6"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F1AE1F]">
                  {pillar.tag}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-[#242423]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-[#707070] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop (>= 768px): 3 Top Cards + 2 Wider Bottom Cards matching About.png */}
          <div className="hidden md:block mt-12 space-y-5">
            <div className="grid grid-cols-3 gap-5">
              {pillarsTop.map((pillar) => (
                <div
                  key={pillar.tag}
                  className="border border-[#F1AE1F] rounded-[16px] bg-[#FEF7E9] p-7 hover:shadow-md transition-shadow"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F1AE1F]">
                    {pillar.tag}
                  </div>
                  <h3 className="mt-2.5 text-2xl font-semibold text-[#242423]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#707070] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {pillarsBottom.map((pillar) => (
                <div
                  key={pillar.tag}
                  className="border border-[#F1AE1F] rounded-[16px] bg-[#FEF7E9] p-7 hover:shadow-md transition-shadow"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F1AE1F]">
                    {pillar.tag}
                  </div>
                  <h3 className="mt-2.5 text-2xl font-semibold text-[#242423]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#707070] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
