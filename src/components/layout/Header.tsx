"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/i18n/dictionaries";

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t, openBookingModal } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/jobs", label: t.nav.jobs },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const locales: Locale[] = ["en", "fr", "de"];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FEF7E9]/95 backdrop-blur-md border-b border-[#242423]/5 transition-all">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/images/logo.png"
            alt="Nanny & MaisonCare Lëtzebuerg"
            className="h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] transition-colors py-1 ${
                  active
                    ? "text-[#242423] font-medium border-b-2 border-[#242423]"
                    : "text-[#242423]/80 hover:text-[#242423]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language Switcher + Book a Service CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher (EN / FR / DE) */}
          <div
            className="flex items-center bg-[#FAF8F5] border border-[#242423]/10 rounded-lg p-1 text-xs font-medium"
            aria-label="Language Switcher"
          >
            <Globe className="w-3.5 h-3.5 text-[#707070] ml-1.5 mr-1" />
            {locales.map((loc) => {
              const label = loc.toUpperCase();
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    locale === loc
                      ? "bg-[#F1AE1F] text-[#242423] font-semibold shadow-sm"
                      : "text-[#707070] hover:text-[#242423]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openBookingModal()}
            className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] px-6 py-3 rounded-[10px] inline-flex items-center gap-2.5 transition-all shadow-sm hover:shadow"
          >
            <span>{t.nav.bookService}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu & Language Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center bg-[#FAF8F5] border border-[#242423]/10 rounded-lg p-0.5 text-[11px] font-medium">
            {locales.map((loc) => {
              const label = loc.toUpperCase();
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc)}
                  className={`px-2 py-1 rounded uppercase transition-all ${
                    locale === loc
                      ? "bg-[#F1AE1F] text-[#242423] font-semibold"
                      : "text-[#707070]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-lg text-[#242423] hover:bg-[#242423]/5"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Overlay mounted to document.body */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-0 z-[99999] bg-[#FEF7E9] text-[#242423] flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200 overflow-y-auto w-screen h-screen min-h-[100dvh]"
          >
            {/* Top Bar with Logo and Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-[#242423]/10 shrink-0">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <img
                  src="/images/logo.png"
                  alt="Nanny & MaisonCare Lëtzebuerg"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-3 rounded-full bg-[#FAF8F5] border border-[#242423]/15 text-[#242423] hover:bg-[#F1AE1F] transition-colors shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Centered Navigation Links */}
            <nav className="my-auto py-8 flex flex-col space-y-5">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-2xl sm:text-3xl font-heading font-semibold transition-all py-1.5 flex items-center justify-between ${
                      active
                        ? "text-[#005F1B] translate-x-1"
                        : "text-[#242423]/80 hover:text-[#242423]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#005F1B]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions: Language Selector + Book Service CTA */}
            <div className="pt-6 border-t border-[#242423]/10 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#707070] uppercase tracking-wider">
                  {t.nav.languageLabel}
                </span>
                <div className="flex items-center bg-[#FAF8F5] border border-[#242423]/10 rounded-xl p-1 text-xs font-medium">
                  {locales.map((loc) => {
                    const label = loc.toUpperCase();
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocale(loc)}
                        className={`px-3.5 py-1.5 rounded-lg uppercase transition-all ${
                          locale === loc
                            ? "bg-[#F1AE1F] text-[#242423] font-bold shadow-sm"
                            : "text-[#707070]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-base py-4 rounded-[12px] inline-flex items-center justify-center gap-2.5 transition-all shadow-sm"
              >
                <span>{t.nav.bookService}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Quick Contact Info */}
              <div className="pt-2 pb-1 text-center text-xs text-[#707070] space-y-1">
                <div className="font-medium text-[#242423]">
                  140 Rue de Cessange, Luxembourg
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-1 text-[11px]">
                  <a
                    href="tel:+352691225764"
                    className="text-[#005F1B] font-medium hover:underline"
                  >
                    +352 691 225 764
                  </a>
                  <span>•</span>
                  <a
                    href="tel:+352691346782"
                    className="text-[#005F1B] font-medium hover:underline"
                  >
                    +352 691 346 782
                  </a>
                  <span>•</span>
                  <a
                    href="tel:+352691347090"
                    className="text-[#005F1B] font-medium hover:underline"
                  >
                    +352 691 347 090
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
