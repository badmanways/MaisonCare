"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const pathname = usePathname();
  const { t, openBookingModal } = useLanguage();

  const isServicesPage = pathname === "/services";
  const isContactPage = pathname === "/contact";

  return (
    <footer className="relative w-full bg-[#002B0C] text-[#FAF8F5] overflow-hidden pt-20 pb-10 md:pt-28 md:pb-12">
      {/* Left Tilted Photo Frame (-rotate-12) with #F1AE1F Border */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute -bottom-14 left-6 xl:left-14 w-[250px] xl:w-[285px] h-[330px] xl:h-[365px] -rotate-12 rounded-[26px] border-[4px] border-[#F1AE1F] overflow-hidden shadow-2xl pointer-events-none select-none z-10"
      >
        <img
          src="/images/childcare-creative-beads.jpg"
          alt="Nanny & MaisonCare Childcare"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Tilted Photo Frame (rotate-12) with #F1AE1F Border */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute -bottom-14 right-6 xl:right-14 w-[250px] xl:w-[285px] h-[330px] xl:h-[365px] rotate-12 rounded-[26px] border-[4px] border-[#F1AE1F] overflow-hidden shadow-2xl pointer-events-none select-none z-10"
      >
        <img
          src="/images/household-cleaning.jpg"
          alt="Nanny & MaisonCare Household Support"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Center Content Column */}
      <div className="relative z-20 max-w-[700px] mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-[50px] font-semibold text-[#FAF8F5] tracking-tight leading-tight">
          {t.footer.headline}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#FAF8F5]/85">
          {t.footer.subtext}
        </p>

        {/* Action Buttons matching each page's design */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {isServicesPage ? (
            <Link
              href="/contact"
              className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-8 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all"
            >
              <span>{t.footer.contactBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : isContactPage ? (
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-8 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all"
            >
              <span>{t.footer.bookBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-7 py-3.5 rounded-[10px] inline-flex items-center gap-2.5 transition-all"
              >
                <span>{t.footer.bookBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/contact"
                className="border border-[#F1AE1F]/70 hover:border-[#F1AE1F] text-[#FAF8F5] font-medium text-[15px] px-9 py-3.5 rounded-[10px] inline-flex items-center justify-center transition-all hover:bg-[#FAF8F5]/5"
              >
                {t.footer.contactBtn}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Tilted Preview Pair for < 1024px */}
        <div className="mt-12 flex lg:hidden items-center justify-center gap-6">
          <div className="w-36 h-44 -rotate-6 rounded-[18px] border-[3px] border-[#F1AE1F] overflow-hidden shadow-lg">
            <img
              src="/images/childcare-creative-beads.jpg"
              alt="Childcare"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-36 h-44 rotate-6 rounded-[18px] border-[3px] border-[#F1AE1F] overflow-hidden shadow-lg">
            <img
              src="/images/household-cleaning.jpg"
              alt="Household Care"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Official Channels & Address Bar */}
        <div className="mt-14 lg:mt-20 pt-8 border-t border-[#FAF8F5]/15 flex flex-col items-center gap-4 text-xs sm:text-[13px] text-[#FAF8F5]/90">
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6">
            {/* Address */}
            <div className="inline-flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F1AE1F] shrink-0" />
              <span>{t.footer.address}</span>
            </div>

            {/* Email */}
            <a
              href={`mailto:${t.footer.email}`}
              className="inline-flex items-center gap-2 hover:text-[#F1AE1F] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#F1AE1F] shrink-0" />
              <span>{t.footer.email}</span>
            </a>
          </div>

          {/* 3 Official Contact Numbers */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[#F1AE1F] font-medium mr-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Tel:</span>
            </span>
            {t.footer.phoneNumbers.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="bg-[#FAF8F5]/10 hover:bg-[#F1AE1F] hover:text-[#242423] text-[#FAF8F5] px-3 py-1 rounded-full transition-colors text-xs"
              >
                {phone}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-xs text-[#FAF8F5]/70">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
