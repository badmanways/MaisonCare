"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import ServiceRequestForm, {
  ServiceCategorySlug,
} from "@/components/forms/ServiceRequestForm";
import { useLanguage } from "@/context/LanguageContext";

interface DedicatedServiceViewProps {
  slug: ServiceCategorySlug;
}

// 4-column staggered height rhythm matching the rest of the site:
const STAGGER_HEIGHTS = [
  "h-[250px] sm:h-[310px] md:h-[360px]", // Col 1: tall
  "h-[205px] sm:h-[255px] md:h-[300px]", // Col 2: medium
  "h-[170px] sm:h-[210px] md:h-[245px]", // Col 3: shorter
  "h-[275px] sm:h-[340px] md:h-[395px]", // Col 4: tallest
];

// Service-relevant photos for each pillar
const SERVICE_IMAGES: Record<
  ServiceCategorySlug,
  Array<{ src: string; alt: string }>
> = {
  nanny: [
    {
      src: "/images/nanny-baking-childcare.jpg",
      alt: "Warm early-years childcare and kitchen baking with MaisonCare nanny",
    },
    {
      src: "/images/family-consultation-nanny.jpg",
      alt: "Professional childcare consultation and family vetting in Luxembourg",
    },
    {
      src: "/images/childcare-garden-play.jpg",
      alt: "Nanny and children outdoor garden play in Luxembourg",
    },
    {
      src: "/images/childcare-creative-beads.jpg",
      alt: "Dedicated childcare specialist guiding creative play",
    },
    {
      src: "/images/childcare-outdoor-balance.jpg",
      alt: "Active outdoor park supervision with MaisonCare nanny",
    },
    {
      src: "/images/childcare-toddler-rings.jpg",
      alt: "Warm early-years toddler care at home",
    },
  ],
  cleaning: [
    {
      src: "/images/household-cleaning.jpg",
      alt: "MaisonCare professional household linen and surface care",
    },
    {
      src: "/images/home-organization-laundry.jpg",
      alt: "Bespoke laundry organization and domestic upkeep",
    },
    {
      src: "/images/household-management-concierge.jpg",
      alt: "Private household management and property upkeep planning",
    },
    {
      src: "/images/grocery-shopping-home-help.jpg",
      alt: "Household supply replenishment and residence preparation",
    },
    {
      src: "/images/hero-slide-2.jpg",
      alt: "Meticulous household schedules and home organization",
    },
    {
      src: "/images/senior-care-companion.jpg",
      alt: "Clean, tidy, and peaceful residential spaces",
    },
  ],
  concierge: [
    {
      src: "/images/household-management-concierge.jpg",
      alt: "Private household management, weekly plans, and staff coordination",
    },
    {
      src: "/images/grocery-shopping-home-help.jpg",
      alt: "Home help grocery shopping and errand runs in Luxembourg",
    },
    {
      src: "/images/hero-slide-3.jpg",
      alt: "Personal concierge assistance, grocery errands, and household care",
    },
    {
      src: "/images/hero-slide-2.jpg",
      alt: "Detailed schedule and appointment coordination",
    },
    {
      src: "/images/family-consultation-nanny.jpg",
      alt: "Personal family concierge consultation and lifestyle coordination",
    },
    {
      src: "/images/home-organization-laundry.jpg",
      alt: "Bespoke wardrobe and domestic organization",
    },
    {
      src: "/images/household-cleaning.jpg",
      alt: "Household management and practical assistance",
    },
  ],
  senior: [
    {
      src: "/images/senior-care-companion.jpg",
      alt: "Compassionate senior caregiver companion walking in garden with walker",
    },
    {
      src: "/images/grocery-shopping-home-help.jpg",
      alt: "Senior assistance with grocery shopping and daily domestic errands",
    },
    {
      src: "/images/hero-slide-4.jpg",
      alt: "Gentle senior companionship, mobility support, and personal assistance",
    },
    {
      src: "/images/household-management-concierge.jpg",
      alt: "Dignified routine scheduling and family liaison",
    },
    {
      src: "/images/home-organization-laundry.jpg",
      alt: "Household assistance, warm meal preparation, and domestic comfort",
    },
    {
      src: "/images/family-consultation-nanny.jpg",
      alt: "Dignified senior care planning and family coordination",
    },
  ],
  pet: [
    {
      src: "/images/childcare-outdoor-balance.jpg",
      alt: "Active dog walking and outdoor exercise routines",
    },
    {
      src: "/images/childcare-garden-play.jpg",
      alt: "Secure garden playtime and attentive pet companionship",
    },
    {
      src: "/images/grocery-shopping-home-help.jpg",
      alt: "Pet food pickup and domestic pet care supply runs",
    },
    {
      src: "/images/senior-care-companion.jpg",
      alt: "Gentle walking companionship and loving pet supervision",
    },
    {
      src: "/images/household-cleaning.jpg",
      alt: "Pet-friendly household care and clean environments",
    },
    {
      src: "/images/hero-slide-4.jpg",
      alt: "Outdoor pet walking and exercise routines",
    },
  ],
};

export default function DedicatedServiceView({ slug }: DedicatedServiceViewProps) {
  const { t } = useLanguage();

  const category =
    t.categories.find((c) => c.slug === slug) || t.categories[0];

  const initialImages = SERVICE_IMAGES[slug] || SERVICE_IMAGES.nanny;
  const [relevantImages, setRelevantImages] = React.useState(initialImages);

  // Randomize / shuffle marquee images every time page is visited or reloaded
  React.useEffect(() => {
    const list = SERVICE_IMAGES[slug] || SERVICE_IMAGES.nanny;
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Guarantee that the first and last images in the sequence are distinct,
    // so the seam between loop cycles never places duplicate images side by side.
    if (
      shuffled.length > 2 &&
      shuffled[0].src === shuffled[shuffled.length - 1].src
    ) {
      [shuffled[shuffled.length - 1], shuffled[1]] = [
        shuffled[1],
        shuffled[shuffled.length - 1],
      ];
    }
    setRelevantImages(shuffled);
  }, [slug]);

  // Map every distinct image to the 4 staggered heights without repeating any image.
  // Duplicated once ([...baseSequence, ...baseSequence]) solely for seamless -50% CSS translation.
  const baseSequence = relevantImages.map((img, idx) => ({
    ...img,
    heightClass: STAGGER_HEIGHTS[idx % STAGGER_HEIGHTS.length],
    key: `seq-${idx}-${img.src}`,
  }));

  const marqueeItems = [...baseSequence, ...baseSequence];

  const ctaLabel = t.dedicatedService.requestThisService;

  return (
    <PublicChrome>
      {/* Hero Section with Integrated Sleek Back Icon & Service-Specific Marquee */}
      <section className="relative w-full bg-[#FEF7E9] pt-8 md:pt-12 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Back Icon Button (no separate navbar required) */}
          <div>
            <Link
              href="/services"
              aria-label={t.dedicatedService.backToServices}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#242423] border border-[#242423]/10 shadow-xs transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Centered Hero Content */}
          <div className="mt-4 max-w-[920px] mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-semibold text-[#242423] tracking-tight leading-[1.12]">
              {category.title}
            </h1>

            <p className="max-w-[720px] mx-auto text-base sm:text-lg text-[#707070] leading-relaxed">
              {category.description}
            </p>

            {category.extendedIntro && (
              <p className="max-w-[680px] mx-auto text-xs sm:text-sm text-[#005F1B] bg-[#EEF5EC] p-3.5 rounded-xl leading-relaxed">
                {category.extendedIntro}
              </p>
            )}

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {category.pills.map((pill) => (
                <span
                  key={pill}
                  className="bg-white border border-[#242423]/10 text-[#242423] text-xs font-medium px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#005F1B]" />
                  <span>{pill}</span>
                </span>
              ))}
            </div>

            {/* Single Request CTA Button (phone CTA removed) */}
            <div className="pt-3 flex items-center justify-center">
              <a
                href="#request-form"
                className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-8 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all shadow-sm hover:shadow"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom-Aligned Staggered 4-Column Continuous Marquee Strip (Filtered by Service) */}
        <div className="mt-10 md:mt-12 w-full overflow-hidden">
          <div className="animate-hero-marquee items-end gap-4 sm:gap-6 px-2">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.key}-${index}`}
                className={`w-[220px] sm:w-[280px] md:w-[340px] lg:w-[360px] ${item.heightClass} shrink-0 rounded-t-[20px] overflow-hidden shadow-sm bg-[#FAF8F5]/50 relative group`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Services Directory */}
      <section className="w-full bg-[#FAF8F5] py-16 md:py-20 border-t border-[#242423]/5">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-[700px] mx-auto">
            <span className="text-[11px] font-bold tracking-widest text-[#F1AE1F] uppercase">
              {t.dedicatedService.scopeBadge}
            </span>
            <h2 className="mt-2 text-3xl font-semibold text-[#242423]">
              {t.dedicatedService.arrangementsTitle}
            </h2>
            <p className="mt-2 text-sm text-[#707070] leading-relaxed">
              {t.dedicatedService.arrangementsSubtitle}
            </p>
          </div>

          {slug === "concierge" && (
            <div className="mt-8 max-w-[960px] mx-auto bg-white border border-[#242423]/10 rounded-[20px] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-widest text-[#005F1B] uppercase px-3 py-1 rounded-full bg-[#EEF5EC]">
                  {t.dedicatedService.conciergeScopeBadge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#242423]">
                {t.dedicatedService.conciergeScopeTitle}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#707070]">
                {t.dedicatedService.conciergeScopeSubtitle}
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#242423]">
                {t.dedicatedService.conciergeScopeItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-[#FEF7E9]/70 border border-[#F1AE1F]/20 rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#005F1B] shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.serviceTypes.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-[#242423]/10 hover:border-[#F1AE1F] rounded-[18px] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#242423]">
                    {srv.label}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#707070] leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#242423]/10 flex items-center justify-between text-xs font-semibold text-[#005F1B]">
                  <span>{t.dedicatedService.availableOnRequest}</span>
                  <a
                    href="#request-form"
                    className="hover:underline flex items-center gap-1 text-[#242423]"
                  >
                    <span>{t.dedicatedService.requestThis}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safeguarding Section */}
      <section className="w-full bg-[#EEF5EC] py-14 border-y border-[#242423]/5">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/80 border border-[#242423]/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#005F1B] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-[#242423]">
              {t.dedicatedService.trustCards[0].title}
            </h4>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.dedicatedService.trustCards[0].description}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-[#242423]/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#005F1B] text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-[#242423]">
              {t.dedicatedService.trustCards[1].title}
            </h4>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.dedicatedService.trustCards[1].description}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-[#242423]/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#005F1B] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-[#242423]">
              {t.dedicatedService.trustCards[2].title}
            </h4>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.dedicatedService.trustCards[2].description}
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Customer Request Form (Design matching Image 1) */}
      <section id="request-form" className="w-full bg-[#FAF8F5] py-16 md:py-24">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <div className="bg-[#FEF7E9] border border-[#F1AE1F]/30 rounded-[20px] p-6 sm:p-10 shadow-sm">
            <div className="mb-6 border-b border-[#242423]/10 pb-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#242423]">
                {category.shortTitle}
              </h2>
              <p className="mt-1 text-xs text-[#707070] leading-relaxed">
                {t.dedicatedService.formSubtitle}
              </p>
            </div>

            <ServiceRequestForm
              initialCategory={slug}
              lockCategory={true}
            />
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
