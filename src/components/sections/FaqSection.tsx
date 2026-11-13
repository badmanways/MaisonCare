"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-16 md:py-24">
      <div className="max-w-[780px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-semibold uppercase tracking-wider px-6 py-1.5 rounded-full">
            {t.home.faqBadge}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-[44px] font-semibold text-[#242423] tracking-tight">
            {t.home.faqTitle}
          </h2>
        </div>

        {/* Accordion Items matching Home.png (#EEF5EC surface + circular #F1AE1F chevron) */}
        <div className="mt-10 space-y-4">
          {t.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-[#EEF5EC] rounded-[14px] px-6 py-5 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-[#242423]">
                    {faq.question}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#F1AE1F] text-[#242423] flex items-center justify-center shrink-0 transition-transform">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 stroke-[2.25]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 stroke-[2.25]" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <p className="mt-3 text-sm sm:text-[15px] text-[#707070] leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
