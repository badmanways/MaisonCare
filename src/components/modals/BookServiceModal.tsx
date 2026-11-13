"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ServiceRequestForm, {
  ServiceCategorySlug,
} from "@/components/forms/ServiceRequestForm";

export default function BookServiceModal() {
  const { bookingModal, closeBookingModal } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && bookingModal.isOpen) {
        closeBookingModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bookingModal.isOpen, closeBookingModal]);

  if (!bookingModal.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#242423]/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={closeBookingModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[640px] bg-[#FEF7E9] rounded-[24px] p-6 sm:p-10 shadow-2xl my-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeBookingModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-[#707070] hover:text-[#242423] hover:bg-[#242423]/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <ServiceRequestForm
          initialCategory={
            bookingModal.initialCategory
              ? (bookingModal.initialCategory as ServiceCategorySlug)
              : undefined
          }
          preselectedService={bookingModal.initialService || ""}
          lockCategory={false}
          onSuccess={() => {
            // keep success banner visible briefly or let user dismiss
          }}
        />
      </div>
    </div>
  );
}
