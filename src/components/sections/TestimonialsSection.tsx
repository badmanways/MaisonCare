"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface ReviewCardItem {
  id: string;
  name: string;
  role?: string;
  roleFr?: string;
  roleDe?: string;
  rating: number;
  text: string;
  textFr?: string;
  textDe?: string;
  avatarUrl?: string;
}

const INITIAL_APPROVED_REVIEWS: ReviewCardItem[] = [
  {
    id: "rev-1",
    name: "Sophie & Marc Schmit",
    role: "Kirchberg, Luxembourg",
    roleFr: "Kirchberg, Luxembourg",
    roleDe: "Kirchberg, Luxemburg",
    rating: 5,
    text: "“MaisonCare have been doing an amazing job with helping raise our kids! Our life has been so much easier since we hired a trilingual nanny through them for after-school care.”",
    textFr: "« MaisonCare fait un travail formidable pour nous aider à élever nos enfants ! Notre quotidien est tellement plus serein depuis que nous avons engagé une nounou trilingue pour la garde après l'école. »",
    textDe: "„MaisonCare leistet fantastische Arbeit bei der Betreuung unserer Kinder! Unser Alltag ist so viel einfacher geworden, seit wir über die Agentur eine dreisprachige Nanny für die Nachmittagsbetreuung engagiert haben.“",
    avatarUrl: "",
  },
  {
    id: "rev-2",
    name: "Elena Rostova",
    role: "Belair, Luxembourg",
    roleFr: "Belair, Luxembourg",
    roleDe: "Belair, Luxemburg",
    rating: 5,
    text: "“Absolute discretion and reliability. Their household cleaning and laundry organisation specialist keeps our residence spotless every week without us ever worrying about logistics.”",
    textFr: "« Discrétion absolue et fiabilité exemplaire. Leur spécialiste du ménage et de l'entretien du linge garde notre résidence impeccable chaque semaine sans aucun souci logistique. »",
    textDe: "„Absolute Diskretion und Zuverlässigkeit. Die Fachkraft für Haushaltsreinigung und Wäschepflege hält unser Anwesen jede Woche makellos sauber, ohne dass wir uns um logistische Details kümmern müssen.“",
    avatarUrl: "",
  },
  {
    id: "rev-3",
    name: "Thomas Van Der Berg",
    role: "Strassen, Luxembourg",
    roleFr: "Strassen, Luxembourg",
    roleDe: "Strassen, Luxemburg",
    rating: 5,
    text: "“We needed both senior home assistance for my mother and occasional pet sitting when travelling. Having a single point of contact in Luxembourg has been priceless.”",
    textFr: "« Nous avions besoin à la fois d'une assistance à domicile pour ma mère et de garde d'animaux lors de nos déplacements. Avoir un interlocuteur unique au Luxembourg est inestimable. »",
    textDe: "„Wir benötigten sowohl Seniorenbetreuung zu Hause für meine Mutter als auch gelegentliches Pet-Sitting bei Reisen. Einen einzigen verlässlichen Ansprechpartner in Luxemburg zu haben, ist unbezahlbar.“",
    avatarUrl: "",
  },
  {
    id: "rev-4",
    name: "Claire & Julien Weber",
    role: "Limpertsberg, Luxembourg",
    roleFr: "Limpertsberg, Luxembourg",
    roleDe: "Limpertsberg, Luxemburg",
    rating: 5,
    text: "“MaisonCare have been doing an amazing job with helping raise my kids! My life has been so much easier since I hired them to help with childcare and daily meal prep.”",
    textFr: "« MaisonCare fait un travail remarquable pour nous épauler avec les enfants ! Mon quotidien est tellement plus facile depuis que je fais appel à eux pour la garde et les repas quotidiens. »",
    textDe: "„MaisonCare leistet hervorragende Unterstützung bei der Betreuung unserer Kinder! Mein Leben ist so viel entspannter, seit sie uns bei der Kinderbetreuung und der täglichen Essenszubereitung unterstützen.“",
    avatarUrl: "",
  },
];

export default function TestimonialsSection() {
  const { t, locale, openReviewModal } = useLanguage();
  const [reviews, setReviews] = useState<ReviewCardItem[]>(INITIAL_APPROVED_REVIEWS);

  useEffect(() => {
    let active = true;
    fetch("/api/reviews?status=APPROVED")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {
        // Fallback to initial approved reviews if API not yet mounted
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#FEF7E9] py-16 md:py-24">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto">
          <span className="inline-block border border-[#F1AE1F] text-[#F1AE1F] text-[11px] font-semibold uppercase tracking-wider px-5 py-1.5 rounded-full">
            {t.home.testimonialsBadge}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-[44px] font-semibold text-[#242423] tracking-tight">
            {t.home.testimonialsTitle}
          </h2>
        </div>

        {/* Cards: Mobile Horizontal Snap Scroll (< 768px) | Desktop 4-Column Grid (>= 768px) */}
        <div className="mt-10 md:mt-12 mobile-horizontal-scroll md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {reviews.map((item) => {
            const reviewText =
              locale === "fr"
                ? item.textFr || item.text
                : locale === "de"
                ? item.textDe || item.text
                : item.text;

            const reviewRole =
              locale === "fr"
                ? item.roleFr || item.role
                : locale === "de"
                ? item.roleDe || item.role
                : item.role;

            return (
              <div
                key={item.id}
                className="mobile-snap-card w-[82vw] max-w-[310px] md:w-full md:max-w-none bg-[#FBE7BC] rounded-[16px] p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Bold Quote Icon matching Home.png */}
                  <div
                    aria-hidden="true"
                    className="text-4xl font-serif font-black text-[#242423] leading-none select-none mb-2"
                  >
                    “
                  </div>
                  <p className="text-[13px] text-[#242423]/90 leading-relaxed">
                    {reviewText.replace(/^“|”$|^«\s*|\s*»$|^„|“$/g, "")}
                  </p>
                </div>

                <div className="mt-5 pt-2 flex items-center gap-3">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#242423]/15 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#005F1B] text-[#FAF8F5] flex items-center justify-center font-semibold text-xs border border-[#005F1B]/20 shrink-0 select-none shadow-sm">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "MC"}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-[#242423] leading-tight">
                      {item.name}
                    </div>
                    {reviewRole && (
                      <div className="text-[10px] text-[#707070]">{reviewRole}</div>
                    )}
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < item.rating
                              ? "fill-[#F1AE1F] text-[#F1AE1F]"
                              : "text-[#707070]/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leave a review CTA */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={openReviewModal}
            className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-10 py-3.5 rounded-[10px] inline-flex items-center justify-center transition-all shadow-sm"
          >
            {t.home.leaveReviewBtn}
          </button>
        </div>
      </div>
    </section>
  );
}
