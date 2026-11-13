"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Info, X, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { EcosystemCategory } from "@/lib/i18n/dictionaries";

interface EcosystemCardProps {
  category: EcosystemCategory;
  onOpenBooking: (slug: string, pill?: string) => void;
}

function EcosystemCard({ category, onOpenBooking }: EcosystemCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [showInfo, setShowInfo] = useState(false);

  const handleCardClick = () => {
    router.push(`/services/${category.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="relative rounded-[20px] overflow-hidden h-[470px] sm:h-[490px] md:h-[510px] w-[85vw] max-w-[350px] md:w-full md:max-w-none snap-center shrink-0 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Full-bleed Background Photography */}
      <img
        src={category.image}
        alt={category.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />

      {/* Subtle gradient vignette to enhance legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#242423]/45 via-[#242423]/10 to-transparent" />

      {/* Floating Top Info Trigger (Hover or Tap to display extended info) */}
      <div
        className="absolute top-3.5 right-3.5 z-20"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <button
          type="button"
          aria-label={`${t.home.serviceOverview}: ${category.title}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowInfo((prev) => !prev);
          }}
          className="w-8 h-8 rounded-full bg-[#242423]/70 hover:bg-[#F1AE1F] text-[#FAF8F5] hover:text-[#242423] backdrop-blur-md flex items-center justify-center transition-all shadow-md"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Extended Information Overlay Drawer on Hover / Info Tap */}
      {showInfo && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="absolute inset-0 z-30 bg-[#242423]/95 backdrop-blur-md p-5 sm:p-6 text-[#FAF8F5] flex flex-col justify-between animate-in fade-in duration-200 overflow-y-auto"
        >
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F1AE1F]" />
                <span className="text-[11px] font-semibold text-[#F1AE1F] tracking-wider uppercase">
                  {t.home.serviceOverview}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(false);
                }}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="mt-3 text-lg font-semibold text-[#FAF8F5]">
              {category.title}
            </h4>
            <p className="mt-2 text-xs text-[#FAF8F5]/85 leading-relaxed">
              {category.extendedIntro || category.description}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[11px] font-semibold text-[#F1AE1F] uppercase tracking-wider mb-2">
                {t.home.availableOptionsScope}
              </div>
              <ul className="space-y-1.5 text-xs text-[#FAF8F5]/90">
                {category.serviceTypes.slice(0, 4).map((srv) => (
                  <li key={srv.id} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F1AE1F] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{srv.label}:</strong>{" "}
                      <span className="text-white/75">{srv.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-auto border-t border-white/10 flex items-center gap-2">
            <Link
              href={`/services/${category.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] text-xs font-semibold py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t.home.exploreDedicatedPage}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(false);
                onOpenBooking(category.slug);
              }}
              className="border border-[#F1AE1F] hover:bg-[#F1AE1F]/15 text-[#FAF8F5] text-xs font-medium py-2.5 px-3 rounded-lg transition-all"
            >
              {t.home.requestShort}
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Frosted-Glass Overlay */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 glass-ecosystem-overlay transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[19px] sm:text-[21px] font-semibold leading-snug text-[#FAF8F5]">
            {category.title}
          </h3>
          <span
            aria-label={`Open dedicated page for ${category.title}`}
            className="w-9 h-9 rounded-full bg-[#F1AE1F] text-[#242423] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
          </span>
        </div>

        <p className="mt-2 text-xs sm:text-[13px] text-[#FAF8F5]/90 leading-relaxed line-clamp-3">
          {category.description}
        </p>

        {/* White Pill Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {category.pills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBooking(category.slug, pill);
              }}
              className="bg-[#FAF8F5] hover:bg-[#F1AE1F] text-[#242423] text-[11px] font-medium px-2.5 py-1 rounded-[6px] transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface EcosystemSectionProps {
  showLearnMore?: boolean;
}

export default function EcosystemSection({
  showLearnMore = true,
}: EcosystemSectionProps) {
  const { t, openBookingModal } = useLanguage();
  const categories = t.categories;
  const topRow = categories.slice(0, 3);
  const bottomRow = categories.slice(3, 5);

  return (
    <section className="w-full bg-[#EEF5EC] py-16 md:py-24">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto">
          <span className="inline-block border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-semibold uppercase tracking-wider px-5 py-1.5 rounded-full">
            {t.home.ecosystemBadge}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-[44px] font-semibold text-[#242423] tracking-tight leading-[1.15]">
            {t.home.ecosystemTitle}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#707070] leading-relaxed">
            {t.home.ecosystemSubtitle}
          </p>
        </div>

        {/* Mobile (< 768px): Horizontal Snap Scroll of all 5 Cards */}
        <div className="mt-10 md:hidden mobile-horizontal-scroll">
          {categories.map((cat) => (
            <EcosystemCard
              key={cat.id}
              category={cat}
              onOpenBooking={(slug, pill) => openBookingModal(slug, pill)}
            />
          ))}
        </div>

        {/* Desktop (>= 768px): 3 Cards on Top Row, 2 Centered Cards on Second Row */}
        <div className="hidden md:block mt-12 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {topRow.map((cat) => (
              <EcosystemCard
                key={cat.id}
                category={cat}
                onOpenBooking={(slug, pill) => openBookingModal(slug, pill)}
              />
            ))}
          </div>

          <div className="max-w-[778px] mx-auto grid grid-cols-2 gap-6">
            {bottomRow.map((cat) => (
              <EcosystemCard
                key={cat.id}
                category={cat}
                onOpenBooking={(slug, pill) => openBookingModal(slug, pill)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA Buttons: "Book a service" + "Learn more" (linking to /services) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-7 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all shadow-sm"
          >
            <span>{t.nav.bookService}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {showLearnMore && (
            <Link
              href="/services"
              className="border border-[#F1AE1F] hover:bg-[#F1AE1F]/10 text-[#242423] font-medium text-[15px] px-7 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all"
            >
              <span>{t.home.ecosystemLearnMore}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
