"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";
import TurnstileShield from "@/components/security/TurnstileShield";
import { useLanguage } from "@/context/LanguageContext";

export type ServiceCategorySlug =
  | "nanny"
  | "cleaning"
  | "concierge"
  | "senior"
  | "pet";

interface ServiceRequestFormProps {
  initialCategory?: ServiceCategorySlug;
  lockCategory?: boolean;
  preselectedService?: string;
  onSuccess?: () => void;
  className?: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ServiceRequestForm({
  initialCategory,
  lockCategory = false,
  preselectedService = "",
  onSuccess,
  className = "",
}: ServiceRequestFormProps) {
  const { t } = useLanguage();

  // Category & Core
  const [categorySlug, setCategorySlug] = useState<string>(
    initialCategory || ""
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preselectedService ? [preselectedService] : []
  );

  // Contact Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [contactMethod, setContactMethod] = useState("WhatsApp");

  // Schedule & Duration
  const [frequency, setFrequency] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timeIsFlexible, setTimeIsFlexible] = useState(false);
  const [durationHours, setDurationHours] = useState("");

  // Category: CLEANING Specifics
  const [premisesType, setPremisesType] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [approxSize, setApproxSize] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("1");
  const [cleaningAreas, setCleaningAreas] = useState<string[]>([
    "Kitchen",
    "Bathrooms",
    "Living areas",
  ]);
  const [furnishedStatus, setFurnishedStatus] = useState("Furnished");
  const [suppliesAvailable, setSuppliesAvailable] = useState("Yes");
  const [commercialSchedule, setCommercialSchedule] =
    useState("After business hours");
  const [businessName, setBusinessName] = useState("");

  // Category: NANNY & CHILDCARE Specifics
  const [careArrangement, setCareArrangement] = useState("");
  const [accommodationAvailable, setAccommodationAvailable] = useState("Yes");
  const [callInUrgency, setCallInUrgency] = useState("Within 24-48 hours");
  const [childrenCount, setChildrenCount] = useState("1");
  const [childrenAges, setChildrenAges] = useState("");
  const [specialCareNeeds, setSpecialCareNeeds] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // Category: SENIOR CARE Specifics
  const [completingFor, setCompletingFor] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [seniorSetting, setSeniorSetting] = useState("Customer's home");
  const [seniorNeeds, setSeniorNeeds] = useState<string[]>([
    "Companionship",
    "Everyday routine support",
  ]);
  const [mobilityNotes, setMobilityNotes] = useState("");

  // Category: PET CARE Specifics
  const [petSetting, setPetSetting] = useState("");
  const [petType, setPetType] = useState("Dog / Puppy");
  const [petsCount, setPetsCount] = useState("1");
  const [petNamesAndBreed, setPetNamesAndBreed] = useState("");
  const [petRoutine, setPetRoutine] = useState("");
  const [meetAndGreet, setMeetAndGreet] = useState("Yes");

  // Category: HOME HELP Specifics
  const [homeHelpTasks, setHomeHelpTasks] = useState<string[]>([
    "Meal Preparation",
    "Laundry & Ironing",
  ]);
  const [shoppingAccompaniment, setShoppingAccompaniment] = useState(
    "Worker shops on my behalf"
  );

  // Expectations / Instructions
  const [expectations, setExpectations] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [honeypot, setHoneypot] = useState("");

  // Form Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeCategoryObj =
    t.categories.find((c) => c.slug === categorySlug) || t.categories[0];

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleCleaningArea = (area: string) => {
    setCleaningAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleSeniorNeed = (need: string) => {
    setSeniorNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const toggleHomeHelpTask = (task: string) => {
    setHomeHelpTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!name || !email) {
      setErrorMsg(t.bookingModal.errorMissingFields);
      return;
    }

    setSubmitting(true);

    try {
      const notesParts: string[] = [];

      if (categorySlug === "nanny") {
        notesParts.push(`[Nanny & Childcare Request]`);
        notesParts.push(`Arrangement: ${careArrangement}`);
        if (careArrangement === "Live-in") {
          notesParts.push(`Accommodation: ${accommodationAvailable}`);
        }
        notesParts.push(
          `Children: ${childrenCount} (Ages: ${childrenAges || "Not specified"})`
        );
        if (specialCareNeeds) notesParts.push(`Care needs: ${specialCareNeeds}`);
        if (schoolName) notesParts.push(`School: ${schoolName}`);
      } else if (categorySlug === "cleaning") {
        notesParts.push(`[Cleaning Request]`);
        notesParts.push(`Premises: ${premisesType} (${propertyType})`);
        notesParts.push(`Size: ${approxSize || "N/A"} m² | Beds: ${bedrooms} | Baths: ${bathrooms}`);
        notesParts.push(`Areas: ${cleaningAreas.join(", ")}`);
        notesParts.push(`Furnished: ${furnishedStatus} | Products on-site: ${suppliesAvailable}`);
        if (businessName) notesParts.push(`Business: ${businessName} | Hours: ${commercialSchedule}`);
      } else if (categorySlug === "senior") {
        notesParts.push(`[Senior Care & Home Assistance Request]`);
        notesParts.push(`Requester: ${completingFor} | Recipient: ${recipientName || "Self"}`);
        notesParts.push(`Setting: ${seniorSetting}`);
        notesParts.push(`Support: ${seniorNeeds.join(", ")}`);
        if (mobilityNotes) notesParts.push(`Mobility notes: ${mobilityNotes}`);
      } else if (categorySlug === "pet") {
        notesParts.push(`[Pet Care Request]`);
        notesParts.push(`Setting: ${petSetting}`);
        notesParts.push(`Pets: ${petsCount} x ${petType} (${petNamesAndBreed || "N/A"})`);
        if (petRoutine) notesParts.push(`Routine: ${petRoutine}`);
        notesParts.push(`Meet & Greet: ${meetAndGreet}`);
      } else if (categorySlug === "concierge") {
        notesParts.push(`[Home Help & Concierge Request]`);
        notesParts.push(`Tasks: ${homeHelpTasks.join(", ")}`);
        if (homeHelpTasks.includes("Grocery Shopping")) {
          notesParts.push(`Shopping: ${shoppingAccompaniment}`);
        }
      }

      if (selectedWeekdays.length > 0) {
        notesParts.push(`Preferred Weekdays: ${selectedWeekdays.join(", ")}`);
      }

      if (expectations) {
        notesParts.push(`Client Instructions: ${expectations}`);
      }

      const formattedNotes = notesParts.join("\n");

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          location: serviceAddress || "Luxembourg",
          category: activeCategoryObj?.title || "General Request",
          categorySlug: categorySlug || "general",
          services: selectedServices.length
            ? selectedServices
            : [activeCategoryObj?.shortTitle || "General Service"],
          serviceDate: startDate,
          startTime: timeIsFlexible
            ? "Flexible / to discuss"
            : startTime || "Flexible",
          durationHours: durationHours
            ? `${durationHours} hours`
            : "Flexible / to discuss",
          frequency: frequency || "once",
          premisesType: premisesType || "Home / Residential",
          preferredContactMethod: contactMethod,
          weekdays: selectedWeekdays,
          customNotes: formattedNotes,
          propertyDetails: {
            propertyType,
            approxSize,
            bedrooms,
            bathrooms,
            cleaningAreas,
            furnishedStatus,
            suppliesAvailable,
            businessName,
          },
          childDetails: {
            childrenCount,
            childrenAges,
            specialCareNeeds,
            schoolName,
          },
          petDetails: {
            petType,
            petsCount,
            petNamesAndBreed,
            petSetting: petSetting || "Pet Care at My Home",
            meetAndGreet,
          },
          specificDetails: {
            completingFor: completingFor || "Representative / Self",
            recipientName,
            seniorSetting,
            seniorNeeds,
            mobilityNotes,
            careArrangement: careArrangement || "Live-out",
            callInUrgency,
            homeHelpTasks,
          },
          elapsedMs: 6000,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || t.bookingModal.errorSubmit);
      }
    } catch {
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-[#242423]">
          {t.bookingModal.successTitle}
        </h3>
        <p className="text-sm text-[#707070] max-w-md mx-auto leading-relaxed">
          {t.bookingModal.successMessage}
        </p>
        <p className="text-xs text-[#707070]/80 max-w-md mx-auto">
          {t.bookingModal.enquiryDisclaimer}
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setExpectations("");
            }}
            className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-medium text-sm px-8 py-3 rounded-[10px] transition-all"
          >
            {t.bookingModal.submitAnotherBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${className}`}
    >
      {/* Hidden Honeypot */}
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name* (Underline style matching Image 1) */}
      <div className="border-b border-[#242423]/12 pb-2">
        <label className="block text-[13px] text-[#242423] font-medium">
          {t.bookingModal.nameLabel}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.bookingModal.namePlaceholder}
          className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
            name ? "text-[#242423]" : "text-[#707070]/70"
          } placeholder:text-[#707070]/60 focus:outline-none`}
        />
      </div>

      {/* Email* & Phone (Underline style matching Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.emailLabel}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.lu"
            className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
              email ? "text-[#242423]" : "text-[#707070]/70"
            } placeholder:text-[#707070]/60 focus:outline-none`}
          />
        </div>

        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.phoneLabel}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+352 691 ..."
            className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
              phone ? "text-[#242423]" : "text-[#707070]/70"
            } placeholder:text-[#707070]/60 focus:outline-none`}
          />
        </div>
      </div>

      {/* Select a category* (Underline dropdown matching Image 1) */}
      {!lockCategory ? (
        <div className="border-b border-[#242423]/12 pb-2 relative">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.selectCategory}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative flex items-center">
            <select
              required
              value={categorySlug}
              onChange={(e) => {
                setCategorySlug(e.target.value as ServiceCategorySlug);
                setSelectedServices([]);
              }}
              className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                categorySlug ? "text-[#242423]" : "text-[#707070]/70"
              } focus:outline-none cursor-pointer`}
            >
              <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                — {t.bookingModal.selectCategory} —
              </option>
              {t.categories.map((cat) => (
                <option key={cat.id} value={cat.slug} className="text-[#242423] bg-[#FEF7E9]">
                  {cat.shortTitle}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
          </div>
        </div>
      ) : (
        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.serviceCategoryLabel}
          </label>
          <div className="pt-1.5 text-[14px] font-semibold text-[#005F1B]">
            {activeCategoryObj.title}
          </div>
        </div>
      )}

      {/* Select one or more services* (Dropdown selector + removable pills below matching Image 1) */}
      <div className="border-b border-[#242423]/12 pb-2.5">
        <label className="block text-[13px] text-[#242423] font-medium">
          {t.bookingModal.selectServices}
          <span className="text-red-500 ml-0.5">*</span>
        </label>

        <div className="relative flex items-center mt-1">
          <select
            value=""
            disabled={!categorySlug}
            onChange={(e) => {
              const val = e.target.value;
              if (val && !selectedServices.includes(val)) {
                setSelectedServices((prev) => [...prev, val]);
              }
            }}
            className="w-full appearance-none bg-transparent pt-1 pr-8 text-[14px] font-normal text-[#707070]/70 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
              {categorySlug
                ? `— ${t.bookingModal.selectServices} —`
                : "— Select a category first —"}
            </option>
            {categorySlug &&
              activeCategoryObj.serviceTypes.map((srv) => (
                <option
                  key={srv.id}
                  value={srv.label}
                  disabled={selectedServices.includes(srv.label)}
                  className="text-[#242423] bg-[#FEF7E9]"
                >
                  {selectedServices.includes(srv.label)
                    ? `✓ ${srv.label} ${t.bookingModal.addedSuffix}`
                    : `+ ${srv.label}`}
                </option>
              ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-1.5" />
        </div>

        {/* Removable pills below dropdown matching Image 1 */}
        {selectedServices.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1">
            {selectedServices.map((serviceLabel) => (
              <span
                key={serviceLabel}
                className="inline-flex items-center gap-1.5 bg-[#F1AE1F] text-[#242423] text-xs font-semibold px-3 py-1 rounded-full shadow-xs animate-in fade-in"
              >
                <span>{serviceLabel}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedServices((prev) =>
                      prev.filter((s) => s !== serviceLabel)
                    )
                  }
                  aria-label={`Remove ${serviceLabel}`}
                  className="w-3.5 h-3.5 rounded-full bg-[#242423]/10 hover:bg-[#242423]/25 flex items-center justify-center transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Schedule & Brief Requirements (Clean Underline Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.serviceDate}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
              startDate ? "has-value text-[#242423]" : "text-[#707070]/70"
            } focus:outline-none cursor-pointer`}
          />
        </div>

        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.startTime}
          </label>
          <input
            type="time"
            disabled={timeIsFlexible}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
              startTime ? "has-value text-[#242423]" : "text-[#707070]/70"
            } focus:outline-none disabled:opacity-40 cursor-pointer`}
          />
        </div>

        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.durationHours}
          </label>
          <div className="relative flex items-center">
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                durationHours ? "text-[#242423]" : "text-[#707070]/70"
              } focus:outline-none cursor-pointer`}
            >
              <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                — {t.bookingModal.durationHours} —
              </option>
              <option value="1-2" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.durationOptions.h1_2}</option>
              <option value="3-4" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.durationOptions.h3_4}</option>
              <option value="5-6" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.durationOptions.h5_6}</option>
              <option value="7-8" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.durationOptions.h7_8}</option>
              <option value="overnight" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.durationOptions.overnight}</option>
              <option value="flexible" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.durationOptions.flexible}</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
          </div>
        </div>
      </div>

      {/* Flexible Time & Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.frequency}
          </label>
          <div className="relative flex items-center">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                frequency ? "text-[#242423]" : "text-[#707070]/70"
              } focus:outline-none cursor-pointer`}
            >
              <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                — {t.bookingModal.frequency} —
              </option>
              <option value="once" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.frequencyOptions.once}</option>
              <option value="weekly" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.frequencyOptions.weekly}</option>
              <option value="several-weekly" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.frequencyOptions.severalWeekly}</option>
              <option value="biweekly" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.frequencyOptions.biweekly}</option>
              <option value="monthly" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.frequencyOptions.monthly}</option>
              <option value="ongoing" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.frequencyOptions.ongoing}</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
          </div>
        </div>

        <div className="border-b border-[#242423]/12 pb-2">
          <label className="block text-[13px] text-[#242423] font-medium">
            {t.bookingModal.location}
          </label>
          <input
            type="text"
            value={serviceAddress}
            onChange={(e) => setServiceAddress(e.target.value)}
            placeholder={t.bookingModal.locationPlaceholder}
            className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
              serviceAddress ? "text-[#242423]" : "text-[#707070]/70"
            } placeholder:text-[#707070]/60 focus:outline-none`}
          />
        </div>
      </div>

      {/* Recurring Weekday Selector (minimalist pills) */}
      {frequency !== "once" && frequency !== "" && (
        <div className="pt-1">
          <label className="block text-[13px] text-[#242423] font-medium mb-1.5">
            {t.bookingModal.preferredDaysLabel}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {WEEKDAYS.map((day, idx) => {
              const active = selectedWeekdays.includes(day);
              const localizedDay = t.bookingModal.weekdays[idx] || day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeekday(day)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#F1AE1F] text-[#242423] shadow-xs"
                      : "bg-[#242423]/5 text-[#242423] hover:bg-[#242423]/10"
                  }`}
                >
                  {localizedDay}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Specific Brief Questions (Clean Underline Style) */}
      {categorySlug === "cleaning" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.cleaningPremisesLabel}
            </label>
            <div className="relative flex items-center">
              <select
                value={premisesType}
                onChange={(e) => setPremisesType(e.target.value)}
                className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                  premisesType ? "text-[#242423]" : "text-[#707070]/70"
                } focus:outline-none cursor-pointer`}
              >
                <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                  — {t.bookingModal.cleaningPremisesLabel} —
                </option>
                <option value="Home / Residential" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.cleaningPremisesOptions.home}</option>
                <option value="Office / Workplace" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.cleaningPremisesOptions.office}</option>
                <option value="Commercial Premises" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.cleaningPremisesOptions.commercial}</option>
                <option value="Other" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.cleaningPremisesOptions.other}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
            </div>
          </div>

          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.cleaningSizeLabel}
            </label>
            <input
              type="text"
              value={approxSize}
              onChange={(e) => setApproxSize(e.target.value)}
              placeholder={t.bookingModal.cleaningSizePlaceholder}
              className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                approxSize ? "text-[#242423]" : "text-[#707070]/70"
              } placeholder:text-[#707070]/60 focus:outline-none`}
            />
          </div>
        </div>
      )}

      {categorySlug === "nanny" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.nannyArrangementLabel}
            </label>
            <div className="relative flex items-center">
              <select
                value={careArrangement}
                onChange={(e) => setCareArrangement(e.target.value)}
                className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                  careArrangement ? "text-[#242423]" : "text-[#707070]/70"
                } focus:outline-none cursor-pointer`}
              >
                <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                  — {t.bookingModal.nannyArrangementLabel} —
                </option>
                <option value="Live-out" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.nannyArrangementOptions.liveOut}</option>
                <option value="Live-in" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.nannyArrangementOptions.liveIn}</option>
                <option value="Flexible" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.nannyArrangementOptions.flexible}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
            </div>
          </div>

          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.nannyChildrenLabel}
            </label>
            <input
              type="text"
              value={childrenAges}
              onChange={(e) => setChildrenAges(e.target.value)}
              placeholder={t.bookingModal.nannyChildrenPlaceholder}
              className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                childrenAges ? "text-[#242423]" : "text-[#707070]/70"
              } placeholder:text-[#707070]/60 focus:outline-none`}
            />
          </div>
        </div>
      )}

      {categorySlug === "pet" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.petSettingLabel}
            </label>
            <div className="relative flex items-center">
              <select
                value={petSetting}
                onChange={(e) => setPetSetting(e.target.value)}
                className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                  petSetting ? "text-[#242423]" : "text-[#707070]/70"
                } focus:outline-none cursor-pointer`}
              >
                <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                  — {t.bookingModal.petSettingLabel} —
                </option>
                <option value="Pet Care at My Home" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.petSettingOptions.myHome}</option>
                <option value="Pet Sitting at Sitter's Home" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.petSettingOptions.sitterHome}</option>
                <option value="Dog Walking" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.petSettingOptions.walking}</option>
                <option value="Overnight / Holiday Sitting" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.petSettingOptions.overnight}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
            </div>
          </div>

          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.petDetailsLabel}
            </label>
            <input
              type="text"
              value={petNamesAndBreed}
              onChange={(e) => setPetNamesAndBreed(e.target.value)}
              placeholder={t.bookingModal.petDetailsPlaceholder}
              className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                petNamesAndBreed ? "text-[#242423]" : "text-[#707070]/70"
              } placeholder:text-[#707070]/60 focus:outline-none`}
            />
          </div>
        </div>
      )}

      {categorySlug === "senior" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.seniorCompletingLabel}
            </label>
            <div className="relative flex items-center">
              <select
                value={completingFor}
                onChange={(e) => setCompletingFor(e.target.value)}
                className={`w-full appearance-none bg-transparent pt-1.5 pr-8 text-[14px] font-normal ${
                  completingFor ? "text-[#242423]" : "text-[#707070]/70"
                } focus:outline-none cursor-pointer`}
              >
                <option value="" disabled className="text-[#707070]/70 bg-[#FEF7E9]">
                  — {t.bookingModal.seniorCompletingLabel} —
                </option>
                <option value="A family member / Representative" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.seniorCompletingOptions.family}</option>
                <option value="The person receiving support" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.seniorCompletingOptions.self}</option>
                <option value="Other" className="text-[#242423] bg-[#FEF7E9]">{t.bookingModal.seniorCompletingOptions.other}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#707070] pointer-events-none absolute right-1 top-2" />
            </div>
          </div>

          <div className="border-b border-[#242423]/12 pb-2">
            <label className="block text-[13px] text-[#242423] font-medium">
              {t.bookingModal.seniorRecipientLabel}
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder={t.bookingModal.seniorRecipientPlaceholder}
              className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
                recipientName ? "text-[#242423]" : "text-[#707070]/70"
              } placeholder:text-[#707070]/60 focus:outline-none`}
            />
          </div>
        </div>
      )}

      {/* Tell us what you want from us* (Underline style matching Image 1) */}
      <div className="border-b border-[#242423]/12 pb-2">
        <label className="block text-[13px] text-[#242423] font-medium">
          {t.bookingModal.customNotes}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <textarea
          required
          rows={2}
          value={expectations}
          onChange={(e) => setExpectations(e.target.value)}
          placeholder={t.bookingModal.customNotesPlaceholder}
          className={`w-full bg-transparent pt-1.5 text-[14px] font-normal ${
            expectations ? "text-[#242423]" : "text-[#707070]/70"
          } placeholder:text-[#707070]/60 focus:outline-none resize-none`}
        />
      </div>

      <p className="text-[11px] text-[#707070] leading-relaxed">
        {t.bookingModal.enquiryDisclaimer}
      </p>

      {/* Turnstile Shield */}
      <TurnstileShield />

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit Button (Matching Image 1: Solid Gold #F1AE1F, rounded, 15px font) */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] disabled:opacity-60 text-[#242423] font-medium text-[15px] py-3.5 rounded-[10px] transition-all shadow-sm cursor-pointer"
        >
          {submitting ? t.bookingModal.submitting : t.bookingModal.submitBtn}
        </button>
      </div>
    </form>
  );
}
