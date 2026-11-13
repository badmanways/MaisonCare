"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  LifeBuoy,
  CheckCircle2,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/i18n/dictionaries";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  detectedLanguage?: Locale;
  requiresEscalation?: boolean;
  suggestedCategorySlug?: string | null;
}

export default function FloatingChatTrigger() {
  const { locale, t, openBookingModal } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetectedLang, setActiveDetectedLang] = useState<Locale>(locale);

  // Inline Escalation Ticket Form State
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketHoneypot, setTicketHoneypot] = useState("");
  const [formStartedAt, setFormStartedAt] = useState<number>(() => Date.now());
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketError, setTicketError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveDetectedLang(locale);
  }, [locale]);

  useEffect(() => {
    if (isOpen) {
      setFormStartedAt(Date.now() - 3000);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  }, [isOpen, messages.length, showTicketForm]);

  const sendMessage = async (textToSend?: string) => {
    const trimmed = (textToSend ?? inputValue).trim();
    if (!trimmed || isLoading) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userTurn]);
    if (!textToSend) {
      setInputValue("");
    }
    setIsLoading(true);
    setTicketSuccess(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to reach AI Concierge.");
      }

      if (data.detectedLanguage) {
        setActiveDetectedLang(data.detectedLanguage);
      }

      const assistantTurn: ChatTurn = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        detectedLanguage: data.detectedLanguage,
        requiresEscalation: Boolean(data.requiresEscalation),
        suggestedCategorySlug: data.suggestedCategorySlug || null,
      };

      setMessages((prev) => [...prev, assistantTurn]);

      if (data.requiresEscalation) {
        setShowTicketForm(true);
        if (!ticketMessage) {
          setTicketMessage(trimmed);
        }
      }
    } catch {
      const errorTurn: ChatTurn = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "We encountered a temporary connection issue. Please leave your email and message below so our human Concierge Desk can assist you directly.",
        requiresEscalation: true,
      };
      setMessages((prev) => [...prev, errorTurn]);
      setShowTicketForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketError("");

    if (!ticketEmail.trim() || !ticketEmail.includes("@")) {
      setTicketError("Please enter a valid email address.");
      return;
    }
    if (!ticketMessage.trim()) {
      setTicketError("Please enter a short message.");
      return;
    }

    setIsSubmittingTicket(true);

    try {
      const transcriptPayload = [
        { role: "assistant" as const, content: t.chatbot.welcomeMessage },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const res = await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorEmail: ticketEmail.trim(),
          questionOrMessage: ticketMessage.trim(),
          language: activeDetectedLang,
          conversationTranscript: transcriptPayload,
          honeypot: ticketHoneypot,
          formStartedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not submit support ticket.");
      }

      setTicketSuccess(true);
      setShowTicketForm(false);
      setTicketEmail("");
      setTicketMessage("");

      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: "assistant",
          content: t.chatbot.ticketSuccess,
        },
      ]);
    } catch (err: unknown) {
      setTicketError(
        err instanceof Error ? err.message : "Failed to submit ticket."
      );
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const quickPrompts: Record<Locale, string[]> = {
    en: [
      "What nanny & childcare services do you offer?",
      "Can you clean offices outside business hours?",
      "How do you screen your staff?",
      "Custom diplomatic package & pricing quote",
    ],
    fr: [
      "Quels services de garde d’enfants proposez-vous ?",
      "Proposez-vous le nettoyage de bureaux hors horaires ?",
      "Comment sélectionnez-vous vos intervenants ?",
      "Devis personnalisé et tarifs sur mesure",
    ],
    de: [
      "Welche Kinderbetreuung bieten Sie an?",
      "Reinigen Sie Büros außerhalb der Geschäftszeiten?",
      "Wie prüfen Sie Ihr Personal?",
      "Individuelles Preisangebot anfordern",
    ],
  };

  const renderFormattedContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={line.trim() === "" ? "h-2" : "mb-1 last:mb-0"}>
          {parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={idx} className="font-semibold text-[#242423]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[355px] sm:w-[400px] bg-[#FAF8F5] border border-[#242423]/15 rounded-[22px] shadow-2xl overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#005F1B] text-[#FAF8F5] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FAF8F5]/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#F1AE1F]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold leading-tight font-heading">
                    MaisonCare Customer Service
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#F1AE1F] text-[#242423]">
                    {activeDetectedLang === "de" ? "GE" : activeDetectedLang.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowTicketForm((prev) => !prev);
                  setTicketSuccess(false);
                }}
                title={t.chatbot.escalatePrompt}
                className="text-[11px] font-medium bg-[#FAF8F5]/15 hover:bg-[#F1AE1F] hover:text-[#242423] text-[#FAF8F5] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>{t.chatbot.ticketBtnLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#FAF8F5]/10 text-[#FAF8F5]"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="p-4 bg-[#FEF7E9]/70 space-y-3 overflow-y-auto flex-1 max-h-[380px]">
            {/* Welcome Bubble */}
            <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-2xl rounded-tl-sm p-3.5 text-xs sm:text-[13px] text-[#242423] leading-relaxed shadow-sm">
              {t.chatbot.welcomeMessage}
            </div>

            {/* Category Quick Booking Pills */}
            {messages.length === 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-medium text-[#707070] uppercase tracking-wider">
                  {activeDetectedLang === "fr"
                    ? "Questions fréquentes :"
                    : activeDetectedLang === "de"
                    ? "Häufige Fragen:"
                    : "Ask a question or test a topic:"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts[locale].map((promptText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(promptText)}
                      className="text-left text-[11px] font-medium bg-[#EEF5EC] hover:bg-[#F1AE1F] text-[#242423] px-2.5 py-1.5 rounded-lg border border-[#005F1B]/15 transition-colors"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Turns */}
            {messages.map((turn) => (
              <div
                key={turn.id}
                className={`flex flex-col ${
                  turn.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                    turn.role === "user"
                      ? "bg-[#005F1B] text-[#FAF8F5] rounded-tr-sm"
                      : "bg-[#FAF8F5] text-[#242423] border border-[#242423]/10 rounded-tl-sm"
                  }`}
                >
                  {turn.role === "user"
                    ? turn.content
                    : renderFormattedContent(turn.content)}

                  {turn.suggestedCategorySlug && (
                    <div className="mt-2.5 pt-2 border-t border-[#242423]/10">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          openBookingModal(
                            turn.suggestedCategorySlug || undefined
                          );
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>{t.nav.bookService}</span>
                      </button>
                    </div>
                  )}

                  {turn.requiresEscalation && !showTicketForm && (
                    <div className="mt-2.5 pt-2 border-t border-[#242423]/10">
                      <button
                        type="button"
                        onClick={() => setShowTicketForm(true)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-[#005F1B] text-[#FAF8F5] px-3 py-1.5 rounded-lg"
                      >
                        <LifeBuoy className="w-3.5 h-3.5" />
                        <span>{t.chatbot.ticketSubmitBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#707070] bg-[#FAF8F5] border border-[#242423]/10 rounded-2xl px-3.5 py-2.5 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#005F1B]" />
                <span>{t.chatbot.typingLabel}</span>
              </div>
            )}

            {/* Inline Support Ticket Escalation Box */}
            {showTicketForm && (
              <form
                onSubmit={handleTicketSubmit}
                className="bg-[#EEF5EC] border border-[#005F1B]/25 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#005F1B]">
                    <LifeBuoy className="w-4 h-4" />
                    <span>{t.chatbot.escalatePrompt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="text-[#707070] hover:text-[#242423] p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website_url"
                  value={ticketHoneypot}
                  onChange={(e) => setTicketHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder={t.chatbot.ticketEmailPlaceholder}
                  className="w-full bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs text-[#242423] placeholder:text-[#707070] focus:outline-none focus:border-[#005F1B]"
                />

                <textarea
                  rows={2}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder={t.chatbot.ticketMessagePlaceholder}
                  className="w-full bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs text-[#242423] placeholder:text-[#707070] focus:outline-none focus:border-[#005F1B] resize-none"
                />

                {ticketError && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {ticketError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="w-full bg-[#F1AE1F] hover:bg-[#e09e12] disabled:opacity-60 text-[#242423] font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  {isSubmittingTicket ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.chatbot.submittingLabel}</span>
                    </>
                  ) : (
                    <span>{t.chatbot.ticketSubmitBtn}</span>
                  )}
                </button>
              </form>
            )}

            {ticketSuccess && (
              <div className="bg-[#EEF5EC] border border-[#005F1B]/30 rounded-xl p-3 flex items-start gap-2 text-xs text-[#005F1B]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t.chatbot.ticketSuccess}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#242423]/10 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatbot.inputPlaceholder}
              className="flex-1 bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#242423] placeholder:text-[#707070] focus:outline-none focus:border-[#005F1B]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-[#005F1B] hover:bg-[#004a15] disabled:opacity-50 text-[#FAF8F5] flex items-center justify-center shrink-0 transition-colors"
              aria-label={t.chatbot.sendBtn}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent Circular #005F1B Launcher Button matching the UI mockups */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.chatbot.launcherLabel}
        className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-[#005F1B] hover:bg-[#004d16] text-[#FAF8F5] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 ml-auto"
      >
        {isOpen ? (
          <X className="w-7 h-7 stroke-[2]" />
        ) : (
          <MessageCircle className="w-8 h-8 stroke-[1.8]" />
        )}
      </button>
    </div>
  );
}
