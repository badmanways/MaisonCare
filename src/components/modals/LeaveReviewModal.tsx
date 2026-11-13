"use client";

import React, { useState, useRef } from "react";
import { X, Star, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import TurnstileShield from "@/components/security/TurnstileShield";

export default function LeaveReviewModal() {
  const { t, isReviewModalOpen, closeReviewModal } = useLanguage();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isReviewModalOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (.jpg, .png, .webp).");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError("Image size must be under 2.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.onerror = () => {
      setUploadError("Could not read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          rating,
          text,
          avatarUrl: avatarUrl || "",
          honeypot,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setRole("");
    setText("");
    setAvatarUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    closeReviewModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#242423]/80 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[520px] bg-[#FAF8F5] rounded-[20px] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full text-[#707070] hover:text-[#242423]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold text-[#242423]">
              {t.reviewModal.successTitle}
            </h3>
            <p className="text-sm text-[#707070] leading-relaxed">
              {t.reviewModal.successMessage}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="bg-[#F1AE1F] text-[#242423] font-medium text-sm px-8 py-3 rounded-[10px]"
            >
              {t.reviewModal.doneBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-[#242423]">
                {t.reviewModal.title}
              </h3>
              <p className="mt-1 text-xs text-[#707070]">
                {t.reviewModal.subtitle}
              </p>
            </div>

            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
            />

            <div className="border-b border-[#242423]/15 pb-2">
              <label className="block text-[13px] font-medium text-[#242423]">
                {t.reviewModal.nameLabel}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.reviewModal.namePlaceholder}
                className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                  name ? "text-[#242423]" : "text-[#707070]/70"
                } placeholder:text-[#707070]/60 focus:outline-none`}
              />
            </div>

            <div className="border-b border-[#242423]/15 pb-2">
              <label className="block text-[13px] font-medium text-[#242423]">
                {t.reviewModal.roleLabel}
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={t.reviewModal.rolePlaceholder}
                className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                  role ? "text-[#242423]" : "text-[#707070]/70"
                } placeholder:text-[#707070]/60 focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#242423] mb-1.5">
                {t.reviewModal.ratingLabel}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-[#F1AE1F] text-[#F1AE1F]"
                          : "text-[#707070]/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload with Luxury Monogram Fallback */}
            <div>
              <label className="block text-[13px] font-medium text-[#242423] mb-1.5">
                {t.reviewModal.avatarLabel}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#242423]/20 shadow-sm shrink-0">
                    <img
                      src={avatarUrl}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#005F1B] text-[#FAF8F5] flex items-center justify-center font-semibold text-xs border border-[#005F1B]/20 shrink-0 select-none shadow-sm">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "MC"}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#242423]/20 text-xs font-medium text-[#242423] hover:bg-[#242423]/5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#005F1B]" />
                      <span>{avatarUrl ? t.reviewModal.changePhoto : t.reviewModal.uploadPhoto}</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.reviewModal.removePhoto}</span>
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#707070]">
                    {avatarUrl
                      ? t.reviewModal.photoAttached
                      : t.reviewModal.photoHint}
                  </span>
                </div>
              </div>

              {uploadError && (
                <p className="mt-1.5 text-xs text-red-600">{uploadError}</p>
              )}
            </div>

            <div className="border-b border-[#242423]/15 pb-2">
              <label className="block text-[13px] font-medium text-[#242423]">
                {t.reviewModal.reviewLabel}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.reviewModal.reviewPlaceholder}
                className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                  text ? "text-[#242423]" : "text-[#707070]/70"
                } placeholder:text-[#707070]/60 focus:outline-none resize-none`}
              />
            </div>

            <TurnstileShield compact />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-[15px] py-3.5 rounded-[10px] transition-all"
            >
              {t.reviewModal.submitBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
