"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DICTIONARIES, Dictionary, Locale } from "@/lib/i18n/dictionaries";

interface BookingModalTriggerState {
  isOpen: boolean;
  initialCategory?: string;
  initialService?: string;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: Dictionary;
  bookingModal: BookingModalTriggerState;
  openBookingModal: (initialCategory?: string, initialService?: string) => void;
  closeBookingModal: () => void;
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [bookingModal, setBookingModal] = useState<BookingModalTriggerState>({
    isOpen: false,
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("maisoncare_locale") as Locale | null;
      if (saved && (saved === "en" || saved === "fr" || saved === "de")) {
        setLocaleState(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    try {
      window.localStorage.setItem("maisoncare_locale", loc);
      document.documentElement.lang = loc;
    } catch {
      // ignore
    }
  };

  const openBookingModal = (initialCategory?: string, initialService?: string) => {
    setBookingModal({
      isOpen: true,
      initialCategory,
      initialService,
    });
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false });
  };

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: DICTIONARIES[locale],
    bookingModal,
    openBookingModal,
    closeBookingModal,
    isReviewModalOpen,
    openReviewModal,
    closeReviewModal,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
