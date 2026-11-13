"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PublicChrome from "@/components/layout/PublicChrome";
import EcosystemSection from "@/components/sections/EcosystemSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import { useLanguage } from "@/context/LanguageContext";

const HERO_SLIDES = [
  {
    src: "/images/hero-slide-1.jpg",
    alt: "Mother and children enjoying quality family time at home",
    position: "object-top md:object-[center_15%]",
  },
  {
    src: "/images/hero-slide-2.jpg",
    alt: "Organised household planning, budgeting, and family schedule management",
    position: "object-top",
  },
  {
    src: "/images/hero-slide-3.jpg",
    alt: "Home help and personal grocery shopping assistance",
    position: "object-top",
  },
  {
    src: "/images/hero-slide-4.jpg",
    alt: "Compassionate senior care and outdoor garden accompaniment",
    position: "object-top",
  },
];

export default function HomePage() {
  const { t, openBookingModal } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    resetTimer();
  };

  return (
    <PublicChrome>
      <section className="relative w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex items-center justify-center overflow-hidden bg-[#1D1D1B]">
        {/* Background Slideshow (Anchored to top so images crop from bottom, preserving heads/faces) */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className={`w-full h-full object-cover ${slide.position || "object-top"} select-none`}
              draggable={false}
            />
          </div>
        ))}

        {/* Subtle Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

        {/* Manual Slideshow Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#F1AE1F] text-white hover:text-[#242423] backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer border border-white/15 hover:border-[#F1AE1F] group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#F1AE1F] text-white hover:text-[#242423] backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer border border-white/15 hover:border-[#F1AE1F] group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-5 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrentSlide(index);
                resetTimer();
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-7 bg-[#F1AE1F]"
                  : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-12 sm:px-16 lg:px-20 py-20 md:py-28 text-center">
          <h1 className="text-[34px] sm:text-5xl md:text-[56px] font-semibold tracking-tight leading-[1.14] max-w-3xl mx-auto drop-shadow-xs">
            <span className="text-[#F1AE1F]">{t.home.heroTitleHighlight}</span>{" "}
            <span className="text-white">{t.home.heroTitleRest}</span>
          </h1>

          <p className="mt-5 text-[15px] sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xs">
            {t.home.heroSubtitle}
          </p>

          <div className="mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-7 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all shadow-md"
            >
              <span>{t.nav.bookService}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/jobs"
              className="border border-[#F1AE1F] bg-black/20 hover:bg-[#F1AE1F]/20 text-white font-medium text-[15px] px-7 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all backdrop-blur-[2px]"
            >
              <span>{t.nav.exploreJobs}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <EcosystemSection />
      <TestimonialsSection />
      <FaqSection />
    </PublicChrome>
  );
}
