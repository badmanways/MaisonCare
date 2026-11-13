"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  CalendarCheck,
  Briefcase,
  FileText,
  MessageSquareWarning,
  Star,
  Settings,
  LogOut,
  Mail,
  Plus,
  Pencil,
  Trash2,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  RefreshCw,
  BookOpen,
  Lock,
  Sparkles,
  ArrowUpRight,
  Bell,
  BellRing,
  Smartphone,
  Volume2,
  Share2,
  Building2,
  Home,
  Baby,
  Dog,
  HeartHandshake,
  CalendarDays,
  PhoneCall,
  MessageSquare,
  CheckSquare,
  Layers,
  Search,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";
import type {
  BookingRecord,
  BookingStatus,
  JobApplicationRecord,
  ReviewRecord,
  ReviewStatus,
  AiTicketRecord,
  ContactMessageRecord,
  OutboundEmailRecord,
  KnowledgeBaseEntry,
  AdminSettings,
} from "@/lib/db";
import type { JobVacancy } from "@/lib/jobsData";

type AdminTab =
  | "overview"
  | "bookings"
  | "applications"
  | "jobs"
  | "tickets"
  | "messages"
  | "reviews"
  | "settings";

interface DashboardPayload {
  kpis: {
    totalBookings: number;
    newBookings: number;
    totalApplications: number;
    newApplications: number;
    activeJobVacancies: number;
    openAiTickets: number;
    totalAiTickets: number;
    pendingReviews: number;
    approvedReviews: number;
    totalOutboundEmails: number;
    newContactMessages?: number;
    totalContactMessages?: number;
  };
  bookings: BookingRecord[];
  jobVacancies: JobVacancy[];
  jobApplications: JobApplicationRecord[];
  reviews: ReviewRecord[];
  aiTickets: AiTicketRecord[];
  contactMessages: ContactMessageRecord[];
  outboundEmails: OutboundEmailRecord[];
  knowledgeBase: KnowledgeBaseEntry[];
  settings: AdminSettings;
}

export default function AdminDashboardPage() {
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search UX States
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("ALL");
  const [bookingCategoryFilter, setBookingCategoryFilter] =
    useState<string>("ALL");
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>("");

  const [appStatusFilter, setAppStatusFilter] = useState<string>("ALL");
  const [appJobFilter, setAppJobFilter] = useState<string>("ALL");
  const [appSearchQuery, setAppSearchQuery] = useState<string>("");

  const [contactStatusFilter, setContactStatusFilter] = useState<string>("ALL");
  const [contactSearchQuery, setContactSearchQuery] = useState<string>("");

  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>("ALL");
  const [ticketSearchQuery, setTicketSearchQuery] = useState<string>("");

  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>("ALL");
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>("");

  // Mobile PWA & Push Notification State
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>("default");
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [lastAlertTime, setLastAlertTime] = useState<string>(
    new Date().toISOString()
  );
  const [testingAlert, setTestingAlert] = useState(false);

  // Direct Outbound Email Responder Modal State
  const [replyModal, setReplyModal] = useState<{
    open: boolean;
    to: string;
    recipientName: string;
    subject: string;
    body: string;
    entityType: "booking" | "application" | "ticket" | "contact";
    entityId: string;
  } | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  // Job Vacancy CRUD Modal State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    fullTitle: "",
    location: "Luxembourg",
    salary: "4500",
    type: "Full-time",
    category: "Nanny & Childcare",
    aboutFamily: "",
    whoLookingFor: "",
    tasks: "",
    schedule: "",
    titleFr: "",
    titleDe: "",
  });
  const [savingJob, setSavingJob] = useState(false);

  // Knowledge Base Editor State
  const [kbForm, setKbForm] = useState({
    id: "",
    topic: "",
    keywords: "",
    contentEn: "",
    contentFr: "",
    contentDe: "",
  });
  const [savingKb, setSavingKb] = useState(false);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<AdminSettings>({
    adminNotificationEmail: "info@nannymaisoncare.lu",
    agencyPhone: "",
    agencyAddress: "Luxembourg",
    autoTranslateJobs: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const fetchDashboardData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const json: DashboardPayload = await res.json();
        setData(json);
        setSettingsForm(json.settings);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Web Audio Luxury Crystal Dual-Tone Chime
  const playLuxuryChime = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.7);

      // Note 2: 880.00 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880.0, now + 0.12);
      gain2.gain.setValueAtTime(0, now + 0.12);
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 1.0);
    } catch {
      // Audio context silenced
    }
  }, []);

  const triggerPhoneAlert = useCallback(
    (title: string, body: string, url: string = "/admin") => {
      playLuxuryChime();

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([200, 100, 200, 100, 300]);
        } catch {
          // Non-fatal
        }
      }

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          const n = new Notification(title, {
            body,
            icon: "/images/logo.png",
            tag: "maisoncare-alert",
          });
          n.onclick = () => {
            window.focus();
            window.location.href = url;
          };
        } catch {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification(title, {
                body,
                icon: "/images/logo.png",
                badge: "/images/logo.png",
                tag: "maisoncare-alert",
                data: { url },
              });
            });
          }
        }
      }

      if (typeof navigator !== "undefined" && "setAppBadge" in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).setAppBadge?.();
      }
    },
    [playLuxuryChime]
  );

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerDevicePushSubscription(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
  if (!("Notification" in window) || Notification.permission !== "granted") return false;

  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const res = await fetch("/api/admin/push/subscribe");
    if (!res.ok) return false;
    const { publicKey } = await res.json();
    if (!publicKey) return false;

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }

    if (sub) {
      await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      return true;
    }
  } catch (err) {
    console.warn("[Push] Subscription sync note:", err);
  }
  return false;
}

  const handleEnableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      showToast("Web Notifications are not supported in this browser.");
      return;
    }

    setIsSubscribingPush(true);
    try {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);

      if (perm === "granted") {
        playLuxuryChime();
        await registerDevicePushSubscription();

        triggerPhoneAlert(
          "🔔 MaisonCare Alerts Active",
          "Your phone is connected! New bookings, CVs, and AI enquiries will alert your phone immediately."
        );
        showToast("Instant mobile phone notifications enabled!");
      } else {
        showToast("Notification permission was not granted.");
      }
    } catch (err) {
      console.error("Failed to enable notifications:", err);
      showToast("Could not request notification permission.");
    } finally {
      setIsSubscribingPush(false);
    }
  };

  const handleTestNotification = async () => {
    setTestingAlert(true);
    try {
      triggerPhoneAlert(
        "🔔 MaisonCare VIP Alert (Test)",
        "Instant phone chime & lock screen notification working perfectly!"
      );
      await fetch("/api/admin/live-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      showToast("Test notification sent to all active admin devices!");
    } catch {
      showToast("Test alert triggered.");
    } finally {
      setTestingAlert(false);
    }
  };

  // PWA detection & SW registration
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
      if (Notification.permission === "granted") {
        registerDevicePushSubscription().catch(console.warn);
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    setIsStandalone(Boolean(standalone));

    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !(window as any).MSStream;
    setIsIos(Boolean(isIosDevice));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Real-time Live Poller (Every 7 seconds while authenticated)
  useEffect(() => {
    if (!authenticated) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/admin/live-alerts?since=${encodeURIComponent(lastAlertTime)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.alerts) && json.alerts.length > 0) {
            json.alerts.forEach(
              (alert: { title: string; body: string; url: string }) => {
                triggerPhoneAlert(alert.title, alert.body, alert.url);
                showToast(`${alert.title} — ${alert.body}`);
              }
            );
            if (json.serverTime) {
              setLastAlertTime(json.serverTime);
            }
            fetchDashboardData();
          }
        }
      } catch {
        // Poller catch
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [authenticated, lastAlertTime, triggerPhoneAlert, fetchDashboardData]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const json = await res.json();
        if (json.authenticated) {
          setAuthenticated(true);
          setAdminEmail(json.adminEmail || "info@nannymaisoncare.lu");
          await fetchDashboardData();
        }
      } catch {
        // Not authenticated
      } finally {
        setAuthChecking(false);
      }
    })();
  }, [fetchDashboardData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || "Invalid credentials.");
        return;
      }
      setAuthenticated(true);
      setAdminEmail(json.adminEmail);
      await fetchDashboardData();
    } catch {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setData(null);
  };

  const handleStatusUpdate = async (
    action:
      | "update_booking_status"
      | "update_application_status"
      | "update_ticket_status",
    id: string,
    status: string
  ) => {
    const res = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, id, status }),
    });
    if (res.ok) {
      showToast(`Status updated to ${status}`);
      await fetchDashboardData();
    }
  };

  const handleSendDirectReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: replyModal.to,
          subject: replyModal.subject,
          body: replyModal.body,
          entityType: replyModal.entityType,
          entityId: replyModal.entityId,
        }),
      });
      if (res.ok) {
        showToast(`Direct email sent to ${replyModal.to}`);
        setReplyModal(null);
        await fetchDashboardData();
      }
    } finally {
      setSendingReply(false);
    }
  };

  const openCreateJobModal = () => {
    setEditingJobId(null);
    setJobForm({
      title: "",
      fullTitle: "",
      location: "Luxembourg-Ville",
      salary: "4500",
      type: "Full-time",
      category: "Nanny & Childcare",
      aboutFamily: "",
      whoLookingFor:
        "You have verified experience in private households or childcare in Luxembourg.\nYou hold a clean criminal record check (Extrait de casier judiciaire).\nYou are discreet, warm, and fluent in English or French.",
      tasks:
        "Provide dedicated daily care and household support.\nMaintain a safe, structured, and welcoming routine.",
      schedule:
        "Monday to Friday, 35–40 hours per week. Immediate or agreed start.",
      titleFr: "",
      titleDe: "",
    });
    setJobModalOpen(true);
  };

  const openEditJobModal = (job: JobVacancy) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      fullTitle: job.fullTitle || job.title,
      location: job.location,
      salary: job.salary,
      type: job.type,
      category: job.category || "Nanny & Childcare",
      aboutFamily: job.aboutFamily,
      whoLookingFor: (job.whoLookingFor || []).join("\n"),
      tasks: (job.tasks || []).join("\n"),
      schedule: job.schedule,
      titleFr: job.translations?.fr?.title || "",
      titleDe: job.translations?.de?.title || "",
    });
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJob(true);
    try {
      const method = editingJobId ? "PUT" : "POST";
      const payload = editingJobId
        ? { ...jobForm, id: editingJobId }
        : jobForm;

      const res = await fetch("/api/admin/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast(
          editingJobId
            ? "Job vacancy updated live on /jobs"
            : "New job vacancy published live on /jobs"
        );
        setJobModalOpen(false);
        await fetchDashboardData();
      }
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!window.confirm(`Remove job vacancy "${title}" from /jobs?`)) return;
    const res = await fetch(`/api/admin/jobs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Job vacancy removed from /jobs");
      await fetchDashboardData();
    }
  };

  const handleReviewStatus = async (id: string, status: ReviewStatus) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      showToast(
        status === "APPROVED"
          ? "Review approved & published to Homepage!"
          : `Review marked as ${status}`
      );
      await fetchDashboardData();
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Permanently delete this review?")) return;
    const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Review deleted");
      await fetchDashboardData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_settings",
        ...settingsForm,
      }),
    });
    if (res.ok) {
      showToast("Administrator settings saved");
      await fetchDashboardData();
    }
  };

  const handleSaveKb = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKb(true);
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_knowledge_entry",
          ...kbForm,
        }),
      });
      if (res.ok) {
        showToast("AI Knowledge Base entry saved");
        setKbForm({
          id: "",
          topic: "",
          keywords: "",
          contentEn: "",
          contentFr: "",
          contentDe: "",
        });
        await fetchDashboardData();
      }
    } finally {
      setSavingKb(false);
    }
  };

  const handleDeleteKb = async (id: string) => {
    const res = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_knowledge_entry", id }),
    });
    if (res.ok) {
      showToast("Knowledge Base entry removed");
      await fetchDashboardData();
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FEF7E9] flex items-center justify-center p-6">
        <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[24px] p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#EEF5EC] text-[#005F1B] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-[#242423]">
            Verifying Single-Admin Session...
          </h1>
          <p className="text-sm text-[#707070] mt-1">
            Nanny & MaisonCare Lëtzebuerg Command Center
          </p>
        </div>
      </div>
    );
  }

  // SINGLE-USER AUTH GATE
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#002B0C] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#FAF8F5] rounded-[28px] border border-[#F1AE1F]/30 shadow-2xl overflow-hidden">
          <div className="bg-[#FEF7E9] px-7 py-6 border-b border-[#242423]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Nanny & MaisonCare Lëtzebuerg"
                className="w-12 h-12 object-contain"
              />
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF5EC] text-[#005F1B]">
                  <Lock className="w-3 h-3" /> Single-Admin Gate
                </span>
                <h1 className="text-lg font-bold text-[#242423] mt-0.5">
                  MaisonCare Command Center
                </h1>
              </div>
            </div>
            <Link
              href="/"
              className="text-xs font-medium text-[#707070] hover:text-[#242423] underline"
            >
              ← Public Site
            </Link>
          </div>

          <form onSubmit={handleLogin} className="p-7 space-y-4">
            <p className="text-xs text-[#707070] leading-relaxed">
              Restricted strictly to the single whitelisted Nanny & MaisonCare
              Lëtzebuerg administrator account. Public sign-ups are disabled.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#242423] mb-1.5">
                Administrator Email (`ADMIN_EMAIL`)
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="info@nannymaisoncare.lu"
                className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-4 py-2.5 text-sm text-[#242423] focus:outline-none focus:border-[#005F1B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423] mb-1.5">
                Administrator Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-4 py-2.5 text-sm text-[#242423] focus:outline-none focus:border-[#005F1B]"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#005F1B] hover:bg-[#004c15] text-[#FAF8F5] font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              {loginLoading
                ? "Authenticating..."
                : "Sign In to Admin Command Center"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Bookings
  const filteredBookings = (data?.bookings || []).filter((bk) => {
    if (bookingStatusFilter !== "ALL" && bk.status !== bookingStatusFilter)
      return false;
    if (
      bookingCategoryFilter !== "ALL" &&
      bk.categorySlug !== bookingCategoryFilter
    )
      return false;
    if (bookingSearchQuery.trim()) {
      const q = bookingSearchQuery.toLowerCase();
      const matchName = bk.name?.toLowerCase().includes(q);
      const matchEmail = bk.email?.toLowerCase().includes(q);
      const matchPhone = bk.phone?.toLowerCase().includes(q);
      const matchLocation = bk.location?.toLowerCase().includes(q);
      const matchNotes = bk.customNotes?.toLowerCase().includes(q);
      const matchCategory = bk.category?.toLowerCase().includes(q);
      const matchServices = bk.services?.some((s) => s.toLowerCase().includes(q));
      if (
        !matchName &&
        !matchEmail &&
        !matchPhone &&
        !matchLocation &&
        !matchNotes &&
        !matchCategory &&
        !matchServices
      ) {
        return false;
      }
    }
    return true;
  });

  // Filtered Job Applications
  const filteredApplications = (data?.jobApplications || []).filter((app) => {
    if (appStatusFilter !== "ALL" && app.status !== appStatusFilter)
      return false;
    if (
      appJobFilter !== "ALL" &&
      app.jobId !== appJobFilter &&
      app.jobTitle !== appJobFilter
    )
      return false;
    if (appSearchQuery.trim()) {
      const q = appSearchQuery.toLowerCase();
      const matchName = app.name?.toLowerCase().includes(q);
      const matchEmail = app.email?.toLowerCase().includes(q);
      const matchPhone = app.phone?.toLowerCase().includes(q);
      const matchRole = app.jobTitle?.toLowerCase().includes(q);
      const matchWhy = app.whyConsidered?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchRole && !matchWhy)
        return false;
    }
    return true;
  });

  // Filtered Direct Contact Inquiries
  const filteredContactMessages = (data?.contactMessages || []).filter((msg) => {
    if (contactStatusFilter !== "ALL" && msg.status !== contactStatusFilter)
      return false;
    if (contactSearchQuery.trim()) {
      const q = contactSearchQuery.toLowerCase();
      const matchName = msg.name?.toLowerCase().includes(q);
      const matchEmail = msg.email?.toLowerCase().includes(q);
      const matchMsg = msg.message?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchMsg) return false;
    }
    return true;
  });

  // Filtered AI Tickets
  const filteredTickets = (data?.aiTickets || []).filter((tkt) => {
    if (ticketStatusFilter !== "ALL" && tkt.status !== ticketStatusFilter)
      return false;
    if (ticketSearchQuery.trim()) {
      const q = ticketSearchQuery.toLowerCase();
      const matchName = tkt.visitorName?.toLowerCase().includes(q);
      const matchEmail = tkt.visitorEmail?.toLowerCase().includes(q);
      const matchMsg = tkt.questionOrMessage?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchMsg) return false;
    }
    return true;
  });

  // Filtered Reviews
  const filteredReviews = (data?.reviews || []).filter((rev) => {
    if (reviewStatusFilter !== "ALL" && rev.status !== reviewStatusFilter)
      return false;
    if (reviewSearchQuery.trim()) {
      const q = reviewSearchQuery.toLowerCase();
      const matchName = rev.name?.toLowerCase().includes(q);
      const matchRole = rev.role?.toLowerCase().includes(q);
      const matchText = rev.text?.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchText) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FEF7E9] text-[#242423] flex flex-col">
      {/* Top Admin Command Bar */}
      <header className="sticky top-0 z-30 bg-[#002B0C] text-[#FAF8F5] border-b border-[#FAF8F5]/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain bg-[#FAF8F5] rounded-xl p-1"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#FAF8F5]">
                  Nanny & MaisonCare Lëtzebuerg
                </h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#F1AE1F] text-[#242423]">
                  Admin Command Center
                </span>
              </div>
              <p className="text-xs text-[#FAF8F5]/75">
                Signed in as single administrator:{" "}
                <strong className="text-[#FAF8F5]">{adminEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Test Alert Button */}
            <button
              type="button"
              onClick={handleTestNotification}
              disabled={testingAlert}
              title="Test phone alert, vibration and audio chime"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-[#FAF8F5] px-3 py-2 rounded-xl transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F1AE1F]" />
              <span className="hidden sm:inline">
                {testingAlert ? "Pinging..." : "Test Phone Alert"}
              </span>
            </button>

            {/* Notification Permission Pill */}
            {notifPermission === "granted" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#005F1B] text-[#FAF8F5] px-3 py-2 rounded-xl border border-[#FAF8F5]/20">
                <Bell className="w-3.5 h-3.5 text-[#F1AE1F]" />
                <span className="hidden sm:inline">Phone Alerts Active</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleEnableNotifications}
                disabled={isSubscribingPush}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] px-3 py-2 rounded-xl transition-all shadow-sm"
              >
                <BellRing className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  {isSubscribingPush
                    ? "Connecting..."
                    : "Enable Phone Alerts"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] px-3 py-2 rounded-xl transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-[#FAF8F5] px-3.5 py-2 rounded-xl transition-colors"
            >
              <span className="hidden sm:inline">View Live Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Add to Home Screen Banner (iOS & Android) */}
      {(!isStandalone || notifPermission !== "granted") && (
        <div className="bg-[#002B0C] border-b border-[#F1AE1F]/30 px-4 sm:px-8 py-3 text-[#FAF8F5]">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F1AE1F] text-[#242423] flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#FAF8F5]">
                  MaisonCare Instant Phone Alerts (Installable Web App)
                </p>
                <p className="text-[#FAF8F5]/80">
                  {notifPermission === "granted"
                    ? "Phone alerts connected! Add to your phone's Home Screen to see notifications on your lock screen instantly."
                    : "Connect your phone to receive instant chime, vibration, and push notifications the second a new booking, CV, or AI enquiry arrives."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
              {notifPermission !== "granted" && (
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  disabled={isSubscribingPush}
                  className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>
                    {isSubscribingPush
                      ? "Connecting..."
                      : "1. Enable Phone Alerts"}
                  </span>
                </button>
              )}

              {isIos && !isStandalone && (
                <button
                  type="button"
                  onClick={() => setShowIosGuide((prev) => !prev)}
                  className="bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-[#FAF8F5] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#F1AE1F]" />
                  <span>2. Add to iPhone Home Screen ⊞</span>
                </button>
              )}

              {deferredInstallPrompt && !isStandalone && (
                <button
                  type="button"
                  onClick={() => {
                    deferredInstallPrompt.prompt();
                    deferredInstallPrompt.userChoice.then(() =>
                      setDeferredInstallPrompt(null)
                    );
                  }}
                  className="bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-[#FAF8F5] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#F1AE1F]" />
                  <span>Install App on Phone</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleTestNotification}
                disabled={testingAlert}
                className="bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#F1AE1F]" />
                <span>{testingAlert ? "Testing..." : "Test Chime & Sound"}</span>
              </button>
            </div>
          </div>

          {/* iOS 3-Step Visual Instruction Dropdown */}
          {showIosGuide && (
            <div className="max-w-[1440px] mx-auto mt-3 pt-3 border-t border-[#FAF8F5]/10 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-[#FAF8F5]/90">
              <div className="bg-[#FAF8F5]/10 rounded-lg p-2.5">
                <span className="font-bold text-[#F1AE1F]">Step 1:</span> Open
                this Admin URL in Safari on your iPhone.
              </div>
              <div className="bg-[#FAF8F5]/10 rounded-lg p-2.5">
                <span className="font-bold text-[#F1AE1F]">Step 2:</span> Tap the
                Safari <strong className="text-[#FAF8F5]">Share button (⎋)</strong> at
                the bottom of the screen.
              </div>
              <div className="bg-[#FAF8F5]/10 rounded-lg p-2.5">
                <span className="font-bold text-[#F1AE1F]">Step 3:</span> Scroll
                down and tap{" "}
                <strong className="text-[#FAF8F5]">&quot;Add to Home Screen&quot; (⊞)</strong>.
                Open the new MaisonCare icon from your Home Screen!
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#005F1B] text-[#FAF8F5] px-4 py-3 rounded-xl shadow-xl border border-[#FAF8F5]/20 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#F1AE1F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-2.5 flex lg:flex-col gap-1 overflow-x-auto">
            {[
              {
                id: "overview" as AdminTab,
                label: "Overview & KPIs",
                icon: LayoutDashboard,
                badge: null,
              },
              {
                id: "bookings" as AdminTab,
                label: "Service Bookings",
                icon: CalendarCheck,
                badge: data?.kpis.newBookings || 0,
              },
              {
                id: "applications" as AdminTab,
                label: "Job Applications & CVs",
                icon: FileText,
                badge: data?.kpis.newApplications || 0,
              },
              {
                id: "jobs" as AdminTab,
                label: "Job Vacancies CRUD",
                icon: Briefcase,
                badge: data?.kpis.activeJobVacancies || 0,
              },
              {
                id: "tickets" as AdminTab,
                label: "AI Escalation Inbox",
                icon: MessageSquareWarning,
                badge: data?.kpis.openAiTickets || 0,
              },
              {
                id: "messages" as AdminTab,
                label: "Contact Inquiries",
                icon: Mail,
                badge: data?.kpis.newContactMessages || 0,
              },
              {
                id: "reviews" as AdminTab,
                label: "Reviews Moderation",
                icon: Star,
                badge: data?.kpis.pendingReviews || 0,
              },
              {
                id: "settings" as AdminTab,
                label: "AI Knowledge & Settings",
                icon: Settings,
                badge: null,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#005F1B] text-[#FAF8F5]"
                      : "text-[#242423] hover:bg-[#EEF5EC]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#F1AE1F]" : "text-[#005F1B]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#F1AE1F] text-[#242423]"
                          : "bg-[#FBE7BC] text-[#242423]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Panel */}
        <main className="flex-1 min-w-0 space-y-6">
          {!data && loadingData && (
            <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#005F1B] mx-auto" />
              <p className="text-sm font-semibold text-[#242423]">
                Loading MaisonCare Command Center...
              </p>
              <p className="text-xs text-[#707070]">
                Syncing service bookings, job vacancies, and real-time alerts.
              </p>
            </div>
          )}

          {!data && !loadingData && (
            <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-[#005F1B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#242423]">
                  Unable to connect to dashboard database
                </p>
                <p className="text-xs text-[#707070] mt-1">
                  Please tap retry to re-sync the command center data.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="bg-[#005F1B] hover:bg-[#004c15] text-[#FAF8F5] px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                Retry Re-sync
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === "overview" && data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div
                  onClick={() => setActiveTab("bookings")}
                  className="cursor-pointer bg-[#FAF8F5] hover:border-[#005F1B] border border-[#242423]/10 rounded-[20px] p-5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#707070]">
                      Service Bookings
                    </span>
                    <CalendarCheck className="w-5 h-5 text-[#005F1B]" />
                  </div>
                  <div className="text-3xl font-bold text-[#242423] mt-2 font-heading">
                    {data.kpis.totalBookings}
                  </div>
                  <div className="text-xs text-[#005F1B] font-medium mt-1">
                    {data.kpis.newBookings} new awaiting review →
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("applications")}
                  className="cursor-pointer bg-[#FAF8F5] hover:border-[#005F1B] border border-[#242423]/10 rounded-[20px] p-5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#707070]">
                      Candidate CVs & Applications
                    </span>
                    <FileText className="w-5 h-5 text-[#005F1B]" />
                  </div>
                  <div className="text-3xl font-bold text-[#242423] mt-2 font-heading">
                    {data.kpis.totalApplications}
                  </div>
                  <div className="text-xs text-[#005F1B] font-medium mt-1">
                    {data.kpis.newApplications} new candidate CVs →
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("messages")}
                  className="cursor-pointer bg-[#FAF8F5] hover:border-[#005F1B] border border-[#242423]/10 rounded-[20px] p-5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#707070]">
                      Direct Contact Inquiries
                    </span>
                    <Mail className="w-5 h-5 text-[#005F1B]" />
                  </div>
                  <div className="text-3xl font-bold text-[#242423] mt-2 font-heading">
                    {data.kpis.totalContactMessages || data.contactMessages?.length || 0}
                  </div>
                  <div className="text-xs text-[#005F1B] font-medium mt-1">
                    {data.kpis.newContactMessages || data.contactMessages?.filter(m => m.status === "NEW").length || 0} new inquiries →
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("tickets")}
                  className="cursor-pointer bg-[#FAF8F5] hover:border-[#005F1B] border border-[#242423]/10 rounded-[20px] p-5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#707070]">
                      AI Escalated Support Tickets
                    </span>
                    <MessageSquareWarning className="w-5 h-5 text-[#F1AE1F]" />
                  </div>
                  <div className="text-3xl font-bold text-[#242423] mt-2 font-heading">
                    {data.kpis.openAiTickets}
                  </div>
                  <div className="text-xs text-[#707070] mt-1">
                    {data.kpis.totalAiTickets} total escalated conversations →
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("reviews")}
                  className="cursor-pointer bg-[#FBE7BC] hover:border-[#242423]/30 border border-[#242423]/10 rounded-[20px] p-5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#242423]">
                      Reviews Moderation Queue
                    </span>
                    <Star className="w-5 h-5 text-[#242423] fill-[#F1AE1F]" />
                  </div>
                  <div className="text-3xl font-bold text-[#242423] mt-2 font-heading">
                    {data.kpis.pendingReviews}
                  </div>
                  <div className="text-xs text-[#242423]/80 font-medium mt-1">
                    Pending approval ({data.kpis.approvedReviews} published
                    live) →
                  </div>
                </div>
              </div>

              {/* Recent Activity Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-[#242423]">
                      Latest Service Enquiries
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs font-semibold text-[#005F1B] hover:underline"
                    >
                      View all ({data.bookings.length})
                    </button>
                  </div>
                  <div className="space-y-3">
                    {data.bookings.slice(0, 4).map((bk) => (
                      <div
                        key={bk.id}
                        className="p-3.5 rounded-xl bg-[#FEF7E9] border border-[#242423]/10 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-[#242423]">
                              {bk.name}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF5EC] text-[#005F1B]">
                              {bk.category}
                            </span>
                            {bk.premisesType && (
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white border border-[#242423]/10 text-[#707070]">
                                {bk.premisesType}
                              </span>
                            )}
                            {bk.preferredContactMethod && (
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#FAF8F5] text-[#242423] border border-[#F1AE1F]/30">
                                {bk.preferredContactMethod}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#707070] mt-1 line-clamp-2">
                            {bk.customNotes}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyModal({
                              open: true,
                              to: bk.email,
                              recipientName: bk.name,
                              subject: `Re: Your ${bk.category} Enquiry — Nanny & MaisonCare Lëtzebuerg`,
                              body: `Dear ${bk.name},\n\nThank you for reaching out to Nanny & MaisonCare Lëtzebuerg regarding ${bk.category} in ${
                                bk.location || "Luxembourg"
                              }.\n\nWe would be delighted to assist you. `,
                              entityType: "booking",
                              entityId: bk.id,
                            })
                          }
                          className="shrink-0 text-[11px] font-semibold bg-[#005F1B] text-[#FAF8F5] px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-[#242423]">
                      Recent Outbound Email Dispatch Log
                    </h2>
                    <span className="text-xs text-[#707070]">
                      Target: {data.settings.adminNotificationEmail}
                    </span>
                  </div>
                  {data.outboundEmails.length === 0 ? (
                    <p className="text-xs text-[#707070] py-6 text-center">
                      No outbound emails logged yet in this session. Submit any
                      form or send a direct reply to inspect it here.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                      {data.outboundEmails.slice(0, 8).map((em) => (
                        <div
                          key={em.id}
                          className="p-3 rounded-xl bg-[#EEF5EC]/70 border border-[#005F1B]/15 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#242423] truncate">
                              {em.subject}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#005F1B] text-[#FAF8F5] shrink-0">
                              {em.deliveryMethod}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#707070] mt-1 flex items-center justify-between">
                            <span>To: {em.to}</span>
                            <span>
                              {new Date(em.sentAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNIFIED SUBMISSIONS — BOOKINGS & CUSTOM REQUESTS */}
          {activeTab === "bookings" && data && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#242423]">
                      Service Requests & Bookings
                    </h2>
                    <p className="text-xs text-[#707070]">
                      Showing {filteredBookings.length} of {data.bookings.length} requests
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#707070] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={bookingSearchQuery}
                      onChange={(e) => setBookingSearchQuery(e.target.value)}
                      placeholder="Search client, email, phone, notes..."
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#242423] focus:outline-none focus:border-[#005F1B]"
                    />
                    {bookingSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setBookingSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#242423]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#242423]/10">
                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "ALL", label: "All", count: data.bookings.length },
                      {
                        id: "NEW",
                        label: "New",
                        count: data.bookings.filter((b) => b.status === "NEW").length,
                      },
                      {
                        id: "IN_REVIEW",
                        label: "In Review",
                        count: data.bookings.filter((b) => b.status === "IN_REVIEW").length,
                      },
                      {
                        id: "CONFIRMED",
                        label: "Confirmed",
                        count: data.bookings.filter((b) => b.status === "CONFIRMED").length,
                      },
                      {
                        id: "ARCHIVED",
                        label: "Archived",
                        count: data.bookings.filter((b) => b.status === "ARCHIVED").length,
                      },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setBookingStatusFilter(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                          bookingStatusFilter === s.id
                            ? "bg-[#005F1B] text-[#FAF8F5] shadow-xs"
                            : "bg-[#FEF7E9] text-[#242423] hover:bg-[#F1AE1F]/20"
                        }`}
                      >
                        {s.label} ({s.count})
                      </button>
                    ))}
                  </div>

                  {/* Category Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#707070] font-medium hidden sm:inline">
                      Pillar:
                    </span>
                    <select
                      value={bookingCategoryFilter}
                      onChange={(e) => setBookingCategoryFilter(e.target.value)}
                      className="bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242423]"
                    >
                      <option value="ALL">All Pillars</option>
                      <option value="nanny">Nanny & Childcare</option>
                      <option value="cleaning">Luxury Cleaning</option>
                      <option value="concierge">Concierge & Home Help</option>
                      <option value="senior">Senior Care</option>
                      <option value="pet">Pet Care</option>
                    </select>

                    {(bookingStatusFilter !== "ALL" ||
                      bookingCategoryFilter !== "ALL" ||
                      bookingSearchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStatusFilter("ALL");
                          setBookingCategoryFilter("ALL");
                          setBookingSearchQuery("");
                        }}
                        className="text-xs font-semibold text-[#005F1B] hover:underline px-2"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-10 text-center space-y-3">
                    <CalendarCheck className="w-8 h-8 text-[#707070]/60 mx-auto" />
                    <p className="text-sm font-semibold text-[#242423]">
                      No service bookings match your filter criteria.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingStatusFilter("ALL");
                        setBookingCategoryFilter("ALL");
                        setBookingSearchQuery("");
                      }}
                      className="text-xs font-semibold bg-[#005F1B] text-white px-4 py-2 rounded-xl"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredBookings.map((bk) => {
                  const prop = bk.propertyDetails as {
                    propertyType?: string;
                    approxSize?: string;
                    bedrooms?: string;
                    bathrooms?: string;
                    cleaningAreas?: string[];
                    furnishedStatus?: string;
                    suppliesAvailable?: string;
                    businessName?: string;
                  } | undefined;

                  const child = bk.childDetails as {
                    childrenCount?: string;
                    childrenAges?: string;
                    specialCareNeeds?: string;
                    schoolName?: string;
                  } | undefined;

                  const pet = bk.petDetails as {
                    petType?: string;
                    petsCount?: string;
                    petNamesAndBreed?: string;
                    petSetting?: string;
                    meetAndGreet?: string;
                  } | undefined;

                  const spec = bk.specificDetails as {
                    completingFor?: string;
                    recipientName?: string;
                    seniorSetting?: string;
                    seniorNeeds?: string[];
                    mobilityNotes?: string;
                    careArrangement?: string;
                    callInUrgency?: string;
                    homeHelpTasks?: string[];
                    shoppingAccompaniment?: string;
                  } | undefined;

                  return (
                    <div
                      key={bk.id}
                      className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-[#242423]">
                              {bk.name}
                            </h3>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF5EC] text-[#005F1B]">
                              {bk.category}
                            </span>
                            {bk.premisesType && (
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#242423]/10 text-[#242423] inline-flex items-center gap-1">
                                {bk.premisesType.toLowerCase().includes("commercial") ? (
                                  <Building2 className="w-3 h-3 text-[#707070]" />
                                ) : (
                                  <Home className="w-3 h-3 text-[#707070]" />
                                )}
                                <span>{bk.premisesType}</span>
                              </span>
                            )}
                            {bk.preferredContactMethod && (
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FEF7E9] text-[#242423] border border-[#F1AE1F]/40 inline-flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-[#F1AE1F]" />
                                <span>Via {bk.preferredContactMethod}</span>
                              </span>
                            )}
                            <span className="text-[11px] text-[#707070]">
                              • {new Date(bk.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-[#707070] mt-1.5 flex flex-wrap gap-4 items-center">
                            <span>
                              <strong>Email:</strong>{" "}
                              <a
                                href={`mailto:${bk.email}`}
                                className="text-[#005F1B] hover:underline"
                              >
                                {bk.email}
                              </a>
                            </span>
                            {bk.phone && (
                              <span>
                                <strong>Phone:</strong>{" "}
                                <a
                                  href={`tel:${bk.phone}`}
                                  className="hover:underline text-[#242423]"
                                >
                                  {bk.phone}
                                </a>
                              </span>
                            )}
                            {bk.location && (
                              <span>
                                <strong>Address / Location:</strong> {bk.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={bk.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                "update_booking_status",
                                bk.id,
                                e.target.value as BookingStatus
                              )
                            }
                            className="bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242423]"
                          >
                            <option value="NEW">Status: NEW</option>
                            <option value="IN_REVIEW">Status: IN_REVIEW</option>
                            <option value="CONFIRMED">Status: CONFIRMED</option>
                            <option value="ARCHIVED">Status: ARCHIVED</option>
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              setReplyModal({
                                open: true,
                                to: bk.email,
                                recipientName: bk.name,
                                subject: `Re: Your ${bk.category} Enquiry — Nanny & MaisonCare Lëtzebuerg`,
                                body: `Dear ${bk.name},\n\nThank you for your ${bk.category} enquiry with Nanny & MaisonCare Lëtzebuerg.\n\nWe have reviewed your schedule preferences (${
                                  bk.serviceDate || "flexible date"
                                }, ${bk.startTime || "flexible start"}, ${
                                  bk.durationHours || "agreed"
                                } hours, ${bk.frequency}) in ${
                                  bk.location || "Luxembourg"
                                }.\n\n`,
                                entityType: "booking",
                                entityId: bk.id,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] px-3.5 py-2 rounded-xl transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send Email Reply</span>
                          </button>
                        </div>
                      </div>

                      {/* Scheduling & Selected Sub-Services Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#FEF7E9] rounded-xl p-3.5 text-xs">
                        <div>
                          <span className="font-semibold text-[#707070] block mb-1">
                            Selected Scope & Sub-Services:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {bk.services.length > 0 ? (
                              bk.services.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="bg-[#FAF8F5] border border-[#242423]/10 px-2.5 py-1 rounded-lg font-medium text-[#242423]"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[#707070] italic">
                                Custom Free-Text Request
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[#707070]">Start Date:</span>{" "}
                              <strong>{bk.serviceDate || "Flexible"}</strong>
                            </div>
                            <div>
                              <span className="text-[#707070]">Start Time:</span>{" "}
                              <strong>{bk.startTime || "Flexible"}</strong>
                            </div>
                            <div>
                              <span className="text-[#707070]">Hours/Visit:</span>{" "}
                              <strong>{bk.durationHours || "Flexible"}</strong>
                            </div>
                            <div>
                              <span className="text-[#707070]">Frequency:</span>{" "}
                              <strong className="capitalize">{bk.frequency}</strong>
                            </div>
                          </div>

                          {bk.weekdays && bk.weekdays.length > 0 && (
                            <div className="pt-1.5 border-t border-[#242423]/10 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-semibold text-[#707070] flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5 text-[#005F1B]" />
                                Preferred Days:
                              </span>
                              {bk.weekdays.map((day) => (
                                <span
                                  key={day}
                                  className="text-[11px] font-semibold bg-white border border-[#242423]/10 px-2 py-0.5 rounded-md text-[#005F1B]"
                                >
                                  {day}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CATEGORY-SPECIFIC STRUCTURED INFORMATION */}

                      {/* 1. Property & Cleaning Specs */}
                      {prop &&
                        (prop.propertyType ||
                          prop.approxSize ||
                          prop.bedrooms ||
                          prop.bathrooms ||
                          prop.businessName ||
                          (prop.cleaningAreas && prop.cleaningAreas.length > 0)) && (
                          <div className="bg-white border border-[#242423]/10 rounded-xl p-3.5 text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-[#242423]">
                              <Building2 className="w-4 h-4 text-[#005F1B]" />
                              <span>Property & Cleaning Specifications</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              {prop.propertyType && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Property Type
                                  </span>
                                  <strong>{prop.propertyType}</strong>
                                </div>
                              )}
                              {prop.businessName && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Company / Business
                                  </span>
                                  <strong>{prop.businessName}</strong>
                                </div>
                              )}
                              {prop.approxSize && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Surface Area
                                  </span>
                                  <strong>{prop.approxSize}</strong>
                                </div>
                              )}
                              {(prop.bedrooms || prop.bathrooms) && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Bedrooms / Baths
                                  </span>
                                  <strong>
                                    {prop.bedrooms || "-"} / {prop.bathrooms || "-"}
                                  </strong>
                                </div>
                              )}
                              {prop.furnishedStatus && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Furnishing
                                  </span>
                                  <strong>{prop.furnishedStatus}</strong>
                                </div>
                              )}
                              {prop.suppliesAvailable && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Supplies On-Site
                                  </span>
                                  <strong>{prop.suppliesAvailable}</strong>
                                </div>
                              )}
                            </div>
                            {prop.cleaningAreas && prop.cleaningAreas.length > 0 && (
                              <div className="pt-2 border-t border-[#242423]/5">
                                <span className="text-[11px] text-[#707070] block mb-1">
                                  Specified Areas to Clean:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {prop.cleaningAreas.map((area) => (
                                    <span
                                      key={area}
                                      className="bg-[#EEF5EC] text-[#005F1B] px-2 py-0.5 rounded-md text-[11px] font-medium"
                                    >
                                      ✓ {area}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      {/* 2. Childcare Details */}
                      {child &&
                        (child.childrenCount ||
                          child.childrenAges ||
                          child.specialCareNeeds ||
                          child.schoolName) && (
                          <div className="bg-white border border-[#242423]/10 rounded-xl p-3.5 text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-[#242423]">
                              <Baby className="w-4 h-4 text-[#005F1B]" />
                              <span>Childcare & Family Specifications</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              {child.childrenCount && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Number of Children
                                  </span>
                                  <strong>{child.childrenCount}</strong>
                                </div>
                              )}
                              {child.childrenAges && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Children Ages
                                  </span>
                                  <strong>{child.childrenAges}</strong>
                                </div>
                              )}
                              {child.schoolName && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    School / Creche Pickup
                                  </span>
                                  <strong>{child.schoolName}</strong>
                                </div>
                              )}
                            </div>
                            {child.specialCareNeeds && (
                              <div className="pt-1.5 border-t border-[#242423]/5">
                                <span className="text-[11px] text-[#707070] block">
                                  Care Routines, Needs & Allergies:
                                </span>
                                <p className="font-medium text-[#242423] mt-0.5">
                                  {child.specialCareNeeds}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                      {/* 3. Pet Details */}
                      {pet &&
                        (pet.petType ||
                          pet.petsCount ||
                          pet.petNamesAndBreed ||
                          pet.meetAndGreet) && (
                          <div className="bg-white border border-[#242423]/10 rounded-xl p-3.5 text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-[#242423]">
                              <Dog className="w-4 h-4 text-[#005F1B]" />
                              <span>Pet Care Specifications</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              {pet.petType && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Pet Type & Count
                                  </span>
                                  <strong>
                                    {pet.petType} ({pet.petsCount || "1"})
                                  </strong>
                                </div>
                              )}
                              {pet.petNamesAndBreed && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Name(s) & Breed
                                  </span>
                                  <strong>{pet.petNamesAndBreed}</strong>
                                </div>
                              )}
                              {pet.meetAndGreet && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Pre-Booking Meet & Greet
                                  </span>
                                  <strong>{pet.meetAndGreet}</strong>
                                </div>
                              )}
                            </div>
                            {pet.petSetting && (
                              <div className="pt-1.5 border-t border-[#242423]/5">
                                <span className="text-[11px] text-[#707070] block">
                                  Setting & Walking Routine:
                                </span>
                                <p className="font-medium text-[#242423] mt-0.5">
                                  {pet.petSetting}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                      {/* 4. Senior Care / Home Help Details */}
                      {spec &&
                        (spec.completingFor ||
                          spec.recipientName ||
                          spec.seniorSetting ||
                          spec.mobilityNotes ||
                          (spec.seniorNeeds && spec.seniorNeeds.length > 0) ||
                          (spec.homeHelpTasks && spec.homeHelpTasks.length > 0)) && (
                          <div className="bg-white border border-[#242423]/10 rounded-xl p-3.5 text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-[#242423]">
                              <HeartHandshake className="w-4 h-4 text-[#005F1B]" />
                              <span>Personalized Care & Domestic Support</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              {spec.completingFor && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Request For
                                  </span>
                                  <strong>
                                    {spec.completingFor}
                                    {spec.recipientName ? ` (${spec.recipientName})` : ""}
                                  </strong>
                                </div>
                              )}
                              {spec.seniorSetting && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Living Arrangement
                                  </span>
                                  <strong>{spec.seniorSetting}</strong>
                                </div>
                              )}
                              {(spec.careArrangement || spec.callInUrgency) && (
                                <div>
                                  <span className="text-[#707070] block text-[11px]">
                                    Arrangement & Urgency
                                  </span>
                                  <strong>
                                    {[spec.careArrangement, spec.callInUrgency]
                                      .filter(Boolean)
                                      .join(" • ")}
                                  </strong>
                                </div>
                              )}
                            </div>

                            {spec.mobilityNotes && (
                              <div className="pt-1.5 border-t border-[#242423]/5">
                                <span className="text-[11px] text-[#707070] block">
                                  Mobility & Medical Context:
                                </span>
                                <p className="font-medium text-[#242423] mt-0.5">
                                  {spec.mobilityNotes}
                                </p>
                              </div>
                            )}

                            {spec.seniorNeeds && spec.seniorNeeds.length > 0 && (
                              <div className="pt-1.5 border-t border-[#242423]/5">
                                <span className="text-[11px] text-[#707070] block mb-1">
                                  Senior Support Focus:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {spec.seniorNeeds.map((need) => (
                                    <span
                                      key={need}
                                      className="bg-[#EEF5EC] text-[#005F1B] px-2 py-0.5 rounded-md text-[11px] font-medium"
                                    >
                                      ✓ {need}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {spec.homeHelpTasks && spec.homeHelpTasks.length > 0 && (
                              <div className="pt-1.5 border-t border-[#242423]/5">
                                <span className="text-[11px] text-[#707070] block mb-1">
                                  Home Help & Errand Tasks:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {spec.homeHelpTasks.map((task) => (
                                    <span
                                      key={task}
                                      className="bg-[#FEF7E9] text-[#242423] border border-[#F1AE1F]/30 px-2 py-0.5 rounded-md text-[11px] font-medium"
                                    >
                                      ✓ {task}
                                    </span>
                                  ))}
                                </div>
                                {spec.shoppingAccompaniment && (
                                  <p className="text-[11px] text-[#707070] mt-1">
                                    Shopping Mode: <strong>{spec.shoppingAccompaniment}</strong>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      {/* Custom Notes */}
                      <div className="text-xs text-[#242423] bg-[#EEF5EC]/50 border border-[#005F1B]/10 rounded-xl p-3.5">
                        <span className="font-semibold text-[#005F1B] block mb-1">
                          Full Client Summary & Special Instructions:
                        </span>
                        <p className="whitespace-pre-line leading-relaxed">
                          {bk.customNotes}
                        </p>
                      </div>

                      {/* Logged Outbound Replies */}
                      {bk.replies && bk.replies.length > 0 && (
                      <div className="border-t border-[#242423]/10 pt-3 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#005F1B]">
                          Outbound Reply History ({bk.replies.length})
                        </span>
                        {bk.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="bg-[#EEF5EC] rounded-xl p-3 text-xs space-y-1"
                          >
                            <div className="flex justify-between font-semibold">
                              <span>{rep.subject}</span>
                              <span className="text-[#707070]">
                                {new Date(rep.sentAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[#242423]/80 whitespace-pre-line">
                              {rep.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
              </div>
            </div>
          )}

          {/* TAB 3: JOB APPLICATIONS & CV VIEWER */}
          {activeTab === "applications" && data && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#242423]">
                      Candidate Job Applications & CV Submissions
                    </h2>
                    <p className="text-xs text-[#707070]">
                      Showing {filteredApplications.length} of {data.jobApplications.length} candidates
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#707070] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={appSearchQuery}
                      onChange={(e) => setAppSearchQuery(e.target.value)}
                      placeholder="Search candidate, role, email, phone..."
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#242423] focus:outline-none focus:border-[#005F1B]"
                    />
                    {appSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setAppSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#242423]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#242423]/10">
                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "ALL", label: "All", count: data.jobApplications.length },
                      {
                        id: "NEW",
                        label: "New",
                        count: data.jobApplications.filter((a) => a.status === "NEW").length,
                      },
                      {
                        id: "SHORTLISTED",
                        label: "Shortlisted",
                        count: data.jobApplications.filter((a) => a.status === "SHORTLISTED").length,
                      },
                      {
                        id: "REJECTED",
                        label: "Rejected",
                        count: data.jobApplications.filter((a) => a.status === "REJECTED").length,
                      },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setAppStatusFilter(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                          appStatusFilter === s.id
                            ? "bg-[#005F1B] text-[#FAF8F5] shadow-xs"
                            : "bg-[#FEF7E9] text-[#242423] hover:bg-[#F1AE1F]/20"
                        }`}
                      >
                        {s.label} ({s.count})
                      </button>
                    ))}
                  </div>

                  {/* Job Vacancy Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#707070] font-medium hidden sm:inline">
                      Vacancy:
                    </span>
                    <select
                      value={appJobFilter}
                      onChange={(e) => setAppJobFilter(e.target.value)}
                      className="bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242423] max-w-[220px] truncate"
                    >
                      <option value="ALL">All Vacancies</option>
                      {data.jobVacancies.map((jv) => (
                        <option key={jv.id} value={jv.id}>
                          {jv.title}
                        </option>
                      ))}
                    </select>

                    {(appStatusFilter !== "ALL" ||
                      appJobFilter !== "ALL" ||
                      appSearchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setAppStatusFilter("ALL");
                          setAppJobFilter("ALL");
                          setAppSearchQuery("");
                        }}
                        className="text-xs font-semibold text-[#005F1B] hover:underline px-2"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-10 text-center space-y-3">
                  <FileText className="w-8 h-8 text-[#707070]/60 mx-auto" />
                  <p className="text-sm font-semibold text-[#242423]">
                    No candidate applications match your filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAppStatusFilter("ALL");
                      setAppJobFilter("ALL");
                      setAppSearchQuery("");
                    }}
                    className="text-xs font-semibold bg-[#005F1B] text-white px-4 py-2 rounded-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#242423]">
                          {app.name}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FBE7BC] text-[#242423]">
                          Role: {app.jobTitle}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF5EC] text-[#005F1B]">
                          Expected: €{app.expectedSalary}/mo
                        </span>
                      </div>
                      <div className="text-xs text-[#707070] mt-1 flex flex-wrap gap-4">
                        <span>
                          <strong>Email:</strong> {app.email}
                        </span>
                        {app.phone && (
                          <span>
                            <strong>Phone:</strong> {app.phone}
                          </span>
                        )}
                        <span>
                          <strong>Applied:</strong>{" "}
                          {new Date(app.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/api/admin/cv/${encodeURIComponent(
                          app.id
                        )}?mode=inline`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#EEF5EC] hover:bg-[#F1AE1F] text-[#242423] px-3 py-2 rounded-xl border border-[#005F1B]/20 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview CV ({app.cvFileName})</span>
                      </a>

                      <a
                        href={`/api/admin/cv/${encodeURIComponent(
                          app.id
                        )}?mode=download`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] px-3 py-2 rounded-xl transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CV</span>
                      </a>

                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            "update_application_status",
                            app.id,
                            e.target.value
                          )
                        }
                        className="bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs font-semibold text-[#242423]"
                      >
                        <option value="NEW">NEW</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          setReplyModal({
                            open: true,
                            to: app.email,
                            recipientName: app.name,
                            subject: `Regarding your application for ${app.jobTitle} — Nanny & MaisonCare Lëtzebuerg`,
                            body: `Dear ${app.name},\n\nThank you for submitting your application and CV (${app.cvFileName}) for the role "${app.jobTitle}" at Nanny & MaisonCare Lëtzebuerg.\n\nWe would like to invite you for an introductory screening call. Please let us know your availability this week.\n\nWarm regards,\nNanny & MaisonCare Lëtzebuerg Recruitment Desk`,
                            entityType: "application",
                            entityId: app.id,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] px-3.5 py-2 rounded-xl transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply to Candidate</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FEF7E9] rounded-xl p-3.5 text-xs text-[#242423]">
                    <span className="font-semibold text-[#707070] block mb-1">
                      Why Candidate Should Be Considered:
                    </span>
                    <p className="whitespace-pre-line leading-relaxed">
                      {app.whyConsidered}
                    </p>
                  </div>

                  {app.replies && app.replies.length > 0 && (
                    <div className="border-t border-[#242423]/10 pt-3 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#005F1B]">
                        Outbound Reply History ({app.replies.length})
                      </span>
                      {app.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="bg-[#EEF5EC] rounded-xl p-3 text-xs space-y-1"
                        >
                          <div className="flex justify-between font-semibold">
                            <span>{rep.subject}</span>
                            <span className="text-[#707070]">
                              {new Date(rep.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[#242423]/80 whitespace-pre-line">
                            {rep.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

          {/* TAB 4: JOB VACANCIES CRUD MANAGER */}
          {activeTab === "jobs" && data && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#242423]">
                    Live Job Vacancies CRUD Manager
                  </h2>
                  <p className="text-xs text-[#707070]">
                    Add, Edit, or Remove job listings. Changes reflect
                    immediately on `/jobs` with `EN`, `FR`, and `DE` language
                    support.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateJobModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Job Vacancy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.jobVacancies.map((job) => (
                  <div
                    key={job.id}
                    className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF5EC] text-[#005F1B]">
                          {job.category || "MaisonCare Role"}
                        </span>
                        <span className="text-xs font-bold text-[#242423]">
                          {job.salary
                            ? `€${job.salary.replace(/^€/, "")}/mo`
                            : "Competitive"}{" "}
                          • {job.type}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#242423] mt-2">
                        {job.title}
                      </h3>
                      <p className="text-xs text-[#707070] mt-0.5">
                        Location: {job.location}
                      </p>
                      <p className="text-xs text-[#707070] mt-2 line-clamp-3">
                        {job.aboutFamily}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#242423]/10 flex items-center justify-between gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-xs font-semibold text-[#005F1B] hover:underline inline-flex items-center gap-1"
                      >
                        <span>View public page</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditJobModal(job)}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FEF7E9] hover:bg-[#FBE7BC] text-[#242423] px-3 py-1.5 rounded-lg border border-[#242423]/15"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI CHATBOT ESCALATION INBOX */}
          {activeTab === "tickets" && data && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#242423]">
                      AI Chatbot Escalation Inbox
                    </h2>
                    <p className="text-xs text-[#707070]">
                      Showing {filteredTickets.length} of {data.aiTickets.length} tickets
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#707070] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={ticketSearchQuery}
                      onChange={(e) => setTicketSearchQuery(e.target.value)}
                      placeholder="Search email, question, visitor..."
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#242423] focus:outline-none focus:border-[#005F1B]"
                    />
                    {ticketSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTicketSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#242423]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#242423]/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "ALL", label: "All", count: data.aiTickets.length },
                      {
                        id: "OPEN",
                        label: "Open",
                        count: data.aiTickets.filter((t) => t.status === "OPEN").length,
                      },
                      {
                        id: "REPLIED",
                        label: "Replied",
                        count: data.aiTickets.filter((t) => t.status === "REPLIED").length,
                      },
                      {
                        id: "RESOLVED",
                        label: "Resolved",
                        count: data.aiTickets.filter((t) => t.status === "RESOLVED").length,
                      },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTicketStatusFilter(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                          ticketStatusFilter === s.id
                            ? "bg-[#005F1B] text-[#FAF8F5] shadow-xs"
                            : "bg-[#FEF7E9] text-[#242423] hover:bg-[#F1AE1F]/20"
                        }`}
                      >
                        {s.label} ({s.count})
                      </button>
                    ))}
                  </div>

                  {(ticketStatusFilter !== "ALL" || ticketSearchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTicketStatusFilter("ALL");
                        setTicketSearchQuery("");
                      }}
                      className="text-xs font-semibold text-[#005F1B] hover:underline px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-10 text-center space-y-3">
                  <MessageSquareWarning className="w-8 h-8 text-[#707070]/60 mx-auto" />
                  <p className="text-sm font-semibold text-[#242423]">
                    No escalated AI tickets match your filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketStatusFilter("ALL");
                      setTicketSearchQuery("");
                    }}
                    className="text-xs font-semibold bg-[#005F1B] text-white px-4 py-2 rounded-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-[#242423]">
                          {tkt.visitorEmail}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F1AE1F] text-[#242423]">
                          {tkt.language.toUpperCase()}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            tkt.status === "OPEN"
                              ? "bg-amber-100 text-amber-900"
                              : tkt.status === "REPLIED"
                              ? "bg-[#EEF5EC] text-[#005F1B]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tkt.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#707070] mt-1">
                        Opened: {new Date(tkt.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={tkt.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            "update_ticket_status",
                            tkt.id,
                            e.target.value
                          )
                        }
                        className="bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242423]"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="REPLIED">REPLIED</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          setReplyModal({
                            open: true,
                            to: tkt.visitorEmail,
                            recipientName:
                              tkt.visitorName || tkt.visitorEmail,
                            subject: `Re: Your MaisonCare Support Ticket (${tkt.id})`,
                            body: `Hello,\n\nThank you for contacting the Nanny & MaisonCare Lëtzebuerg Concierge Desk regarding:\n"${tkt.questionOrMessage}"\n\nHere are the details for your request:\n\n`,
                            entityType: "ticket",
                            entityId: tkt.id,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] px-3.5 py-2 rounded-xl transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FEF7E9] rounded-xl p-3.5 text-xs">
                    <span className="font-semibold text-[#707070] block mb-1">
                      Escalated Visitor Question / Message:
                    </span>
                    <p className="text-[#242423] font-medium whitespace-pre-line">
                      {tkt.questionOrMessage}
                    </p>
                  </div>

                  {tkt.conversationTranscript &&
                    tkt.conversationTranscript.length > 0 && (
                      <div className="bg-[#EEF5EC]/60 rounded-xl p-3.5 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#005F1B] block">
                          AI Chat Transcript ({tkt.conversationTranscript.length}{" "}
                          turns)
                        </span>
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {tkt.conversationTranscript.map((turn, i) => (
                            <div
                              key={i}
                              className="text-xs flex items-start gap-2"
                            >
                              <strong className="uppercase text-[10px] text-[#707070] w-16 shrink-0 mt-0.5">
                                {turn.role}:
                              </strong>
                              <span className="text-[#242423]">
                                {turn.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {tkt.replies && tkt.replies.length > 0 && (
                    <div className="border-t border-[#242423]/10 pt-3 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#005F1B]">
                        Admin Email Replies ({tkt.replies.length})
                      </span>
                      {tkt.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="bg-[#EEF5EC] rounded-xl p-3 text-xs space-y-1"
                        >
                          <div className="flex justify-between font-semibold">
                            <span>{rep.subject}</span>
                            <span className="text-[#707070]">
                              {new Date(rep.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[#242423]/80 whitespace-pre-line">
                            {rep.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

          {/* TAB: DIRECT CONTACT INQUIRIES */}
          {activeTab === "messages" && data && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#242423]">
                      Direct Contact Inquiries
                    </h2>
                    <p className="text-xs text-[#707070]">
                      Showing {filteredContactMessages.length} of {(data.contactMessages || []).length} inquiries submitted via the Contact Us page
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#707070] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={contactSearchQuery}
                      onChange={(e) => setContactSearchQuery(e.target.value)}
                      placeholder="Search sender, email, message..."
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#242423] focus:outline-none focus:border-[#005F1B]"
                    />
                    {contactSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setContactSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#242423]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#242423]/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "ALL", label: "All", count: (data.contactMessages || []).length },
                      {
                        id: "NEW",
                        label: "New",
                        count: (data.contactMessages || []).filter((m) => m.status === "NEW").length,
                      },
                      {
                        id: "REPLIED",
                        label: "Replied",
                        count: (data.contactMessages || []).filter((m) => m.status === "REPLIED").length,
                      },
                      {
                        id: "ARCHIVED",
                        label: "Archived",
                        count: (data.contactMessages || []).filter((m) => m.status === "ARCHIVED").length,
                      },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setContactStatusFilter(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                          contactStatusFilter === s.id
                            ? "bg-[#005F1B] text-[#FAF8F5] shadow-xs"
                            : "bg-[#FEF7E9] text-[#242423] hover:bg-[#F1AE1F]/20"
                        }`}
                      >
                        {s.label} ({s.count})
                      </button>
                    ))}
                  </div>

                  {(contactStatusFilter !== "ALL" || contactSearchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setContactStatusFilter("ALL");
                        setContactSearchQuery("");
                      }}
                      className="text-xs font-semibold text-[#005F1B] hover:underline px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {filteredContactMessages.length === 0 ? (
                <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-10 text-center space-y-3">
                  <Mail className="w-8 h-8 text-[#707070]/60 mx-auto" />
                  <p className="text-sm font-semibold text-[#242423]">
                    No contact inquiries match your filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactStatusFilter("ALL");
                      setContactSearchQuery("");
                    }}
                    className="text-xs font-semibold bg-[#005F1B] text-white px-4 py-2 rounded-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredContactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#242423]">
                            {msg.name}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                              msg.status === "NEW"
                                ? "bg-[#EEF5EC] text-[#005F1B]"
                                : msg.status === "REPLIED"
                                ? "bg-[#FBE7BC] text-[#242423]"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#707070] mt-1 flex flex-wrap gap-4 items-center">
                          <span>
                            <strong>Email:</strong>{" "}
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-[#005F1B] hover:underline"
                            >
                              {msg.email}
                            </a>
                          </span>
                          <span>
                            <strong>Received:</strong>{" "}
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={msg.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              "update_contact_status",
                              msg.id,
                              e.target.value
                            )
                          }
                          className="bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242423]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="REPLIED">REPLIED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            setReplyModal({
                              open: true,
                              to: msg.email,
                              recipientName: msg.name,
                              subject: `Re: Your Inquiry with Nanny & MaisonCare Lëtzebuerg`,
                              body: `Dear ${msg.name},\n\nThank you for reaching out to Nanny & MaisonCare Lëtzebuerg regarding:\n"${msg.message}"\n\nWe would be pleased to assist you.\n\nWarm regards,\nNanny & MaisonCare Lëtzebuerg Concierge Desk`,
                              entityType: "contact",
                              entityId: msg.id,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] px-3.5 py-2 rounded-xl transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#FEF7E9] rounded-xl p-3.5 text-xs">
                      <span className="font-semibold text-[#707070] block mb-1">
                        Inquiry Message:
                      </span>
                      <p className="text-[#242423] font-medium whitespace-pre-line leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    {msg.replies && msg.replies.length > 0 && (
                      <div className="border-t border-[#242423]/10 pt-3 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#005F1B]">
                          Outbound Reply History ({msg.replies.length})
                        </span>
                        {msg.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="bg-[#EEF5EC] rounded-xl p-3 text-xs space-y-1"
                          >
                            <div className="flex justify-between font-semibold">
                              <span>{rep.subject}</span>
                              <span className="text-[#707070]">
                                {new Date(rep.sentAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[#242423]/80 whitespace-pre-line">
                              {rep.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: CLIENT REVIEWS MODERATION QUEUE */}
          {activeTab === "reviews" && data && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#242423]">
                      Client Testimonials & Review Moderation Queue
                    </h2>
                    <p className="text-xs text-[#707070]">
                      Showing {filteredReviews.length} of {data.reviews.length} reviews
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#707070] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={reviewSearchQuery}
                      onChange={(e) => setReviewSearchQuery(e.target.value)}
                      placeholder="Search author, role, review text..."
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#242423] focus:outline-none focus:border-[#005F1B]"
                    />
                    {reviewSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setReviewSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#242423]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#242423]/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "ALL", label: "All", count: data.reviews.length },
                      {
                        id: "PENDING",
                        label: "Pending",
                        count: data.reviews.filter((r) => r.status === "PENDING").length,
                      },
                      {
                        id: "APPROVED",
                        label: "Approved",
                        count: data.reviews.filter((r) => r.status === "APPROVED").length,
                      },
                      {
                        id: "REJECTED",
                        label: "Rejected",
                        count: data.reviews.filter((r) => r.status === "REJECTED").length,
                      },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setReviewStatusFilter(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                          reviewStatusFilter === s.id
                            ? "bg-[#005F1B] text-[#FAF8F5] shadow-xs"
                            : "bg-[#FEF7E9] text-[#242423] hover:bg-[#F1AE1F]/20"
                        }`}
                      >
                        {s.label} ({s.count})
                      </button>
                    ))}
                  </div>

                  {(reviewStatusFilter !== "ALL" || reviewSearchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setReviewStatusFilter("ALL");
                        setReviewSearchQuery("");
                      }}
                      className="text-xs font-semibold text-[#005F1B] hover:underline px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-10 text-center space-y-3">
                  <Star className="w-8 h-8 text-[#707070]/60 mx-auto" />
                  <p className="text-sm font-semibold text-[#242423]">
                    No client reviews match your filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewStatusFilter("ALL");
                      setReviewSearchQuery("");
                    }}
                    className="text-xs font-semibold bg-[#005F1B] text-white px-4 py-2 rounded-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`rounded-[20px] p-5 border flex flex-col justify-between gap-4 ${
                        rev.status === "PENDING"
                          ? "bg-[#FEF7E9] border-[#F1AE1F]"
                          : rev.status === "APPROVED"
                          ? "bg-[#FBE7BC] border-[#242423]/10"
                          : "bg-[#FAF8F5] border-red-200 opacity-75"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              rev.status === "PENDING"
                                ? "bg-[#F1AE1F] text-[#242423]"
                                : rev.status === "APPROVED"
                                ? "bg-[#005F1B] text-[#FAF8F5]"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {rev.status === "PENDING" && (
                              <Clock className="w-3 h-3" />
                            )}
                            {rev.status === "APPROVED" && (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {rev.status === "REJECTED" && (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span>{rev.status}</span>
                          </span>

                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: rev.rating || 5 }).map(
                              (_, idx) => (
                                <Star
                                  key={idx}
                                  className="w-4 h-4 text-[#F1AE1F] fill-[#F1AE1F]"
                                />
                              )
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-[#242423] leading-relaxed italic">
                          “{rev.text}”
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                          {rev.avatarUrl ? (
                            <img
                              src={rev.avatarUrl}
                              alt={rev.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#242423]/15 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#005F1B] text-[#FAF8F5] flex items-center justify-center font-semibold text-xs border border-[#005F1B]/20 shrink-0 select-none shadow-sm">
                              {rev.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase() || "MC"}
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-bold text-[#242423]">
                              {rev.name}
                            </div>
                            <div className="text-[11px] text-[#707070]">
                              {rev.role || "Luxembourg"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#242423]/10 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {rev.status !== "APPROVED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleReviewStatus(rev.id, "APPROVED")
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Publish</span>
                            </button>
                          )}
                          {rev.status !== "REJECTED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleReviewStatus(rev.id, "REJECTED")
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FAF8F5] hover:bg-amber-100 text-[#242423] px-3 py-1.5 rounded-lg border border-[#242423]/15"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Hide / Reject</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: AI KNOWLEDGE BASE & ADMIN SETTINGS */}
          {activeTab === "settings" && data && (
            <div className="space-y-6">
              {/* Notification & Agency Configuration */}
              <form
                onSubmit={handleSaveSettings}
                className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#005F1B]" />
                  <h2 className="text-lg font-bold text-[#242423]">
                    Notification Email & Agency Configuration
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#242423] mb-1">
                      Admin Notification Email (`ADMIN_EMAIL`)
                    </label>
                    <input
                      type="email"
                      value={settingsForm.adminNotificationEmail}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          adminNotificationEmail: e.target.value,
                        })
                      }
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3.5 py-2 text-xs text-[#242423]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242423] mb-1">
                      Agency Concierge Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.agencyPhone}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          agencyPhone: e.target.value,
                        })
                      }
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3.5 py-2 text-xs text-[#242423]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242423] mb-1">
                      Luxembourg Headquarters
                    </label>
                    <input
                      type="text"
                      value={settingsForm.agencyAddress}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          agencyAddress: e.target.value,
                        })
                      }
                      className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3.5 py-2 text-xs text-[#242423]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                  Save Notification Configuration
                </button>
              </form>

              {/* Instant Mobile Alerts & Web App Settings */}
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#005F1B]" />
                    <div>
                      <h2 className="text-lg font-bold text-[#242423]">
                        Instant Mobile Alerts & Web App Configuration
                      </h2>
                      <p className="text-xs text-[#707070]">
                        Manage device push notifications, audible chimes, and home screen installation.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    disabled={testingAlert}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{testingAlert ? "Testing..." : "Send Test Phone Alert & Chime"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#FEF7E9] border border-[#242423]/10 rounded-xl p-3.5 space-y-1">
                    <p className="font-bold text-[#242423]">Notification Status</p>
                    <p className="text-[#707070]">
                      {notifPermission === "granted" ? (
                        <span className="text-[#005F1B] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active & Subscribed
                        </span>
                      ) : (
                        <span className="text-amber-800 font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> {notifPermission}
                        </span>
                      )}
                    </p>
                    {notifPermission !== "granted" && (
                      <button
                        type="button"
                        onClick={handleEnableNotifications}
                        disabled={isSubscribingPush}
                        className="mt-2 text-xs font-bold text-[#005F1B] underline hover:opacity-80 block"
                      >
                        Click to request notification permission →
                      </button>
                    )}
                  </div>

                  <div className="bg-[#FEF7E9] border border-[#242423]/10 rounded-xl p-3.5 space-y-1">
                    <p className="font-bold text-[#242423]">Web App Mode</p>
                    <p className="text-[#707070]">
                      {isStandalone ? (
                        <span className="text-[#005F1B] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Installed Standalone PWA
                        </span>
                      ) : (
                        <span className="text-[#242423] font-medium">
                          Running in Browser Tab
                        </span>
                      )}
                    </p>
                    {!isStandalone && (
                      <p className="text-[11px] text-[#707070] pt-1">
                        Add to Home Screen from Safari / Chrome for lock screen alerts.
                      </p>
                    )}
                  </div>

                  <div className="bg-[#FEF7E9] border border-[#242423]/10 rounded-xl p-3.5 space-y-1">
                    <p className="font-bold text-[#242423]">Sound & Vibration</p>
                    <p className="text-[#005F1B] font-semibold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> High-End Dual-Tone Crystal Chime
                    </p>
                    <p className="text-[11px] text-[#707070] pt-1">
                      Plays automatically on incoming bookings, CVs, and AI chats.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Knowledge Base Quick Editor */}
              <div className="bg-[#FAF8F5] border border-[#242423]/10 rounded-[20px] p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#005F1B]" />
                  <div>
                    <h2 className="text-lg font-bold text-[#242423]">
                      Multilingual AI Chatbot Knowledge Base (`EN` / `FR` /
                      `DE`)
                    </h2>
                    <p className="text-xs text-[#707070]">
                      Add or update custom grounding topics used by `/api/chat`
                      when answering visitor questions.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveKb}
                  className="bg-[#FEF7E9] border border-[#242423]/10 rounded-xl p-4 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={kbForm.topic}
                      onChange={(e) =>
                        setKbForm({ ...kbForm, topic: e.target.value })
                      }
                      placeholder="Topic Title (e.g., Weekend & Holiday Availability)"
                      className="bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      value={kbForm.keywords}
                      onChange={(e) =>
                        setKbForm({ ...kbForm, keywords: e.target.value })
                      }
                      placeholder="Comma-separated keywords (e.g., weekend, holiday, sunday)"
                      className="bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={kbForm.contentEn}
                    onChange={(e) =>
                      setKbForm({ ...kbForm, contentEn: e.target.value })
                    }
                    placeholder="English response (EN)..."
                    className="w-full bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <textarea
                      rows={2}
                      value={kbForm.contentFr}
                      onChange={(e) =>
                        setKbForm({ ...kbForm, contentFr: e.target.value })
                      }
                      placeholder="French response (FR - optional, defaults to EN)..."
                      className="w-full bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                    />
                    <textarea
                      rows={2}
                      value={kbForm.contentDe}
                      onChange={(e) =>
                        setKbForm({ ...kbForm, contentDe: e.target.value })
                      }
                      placeholder="German response (DE - optional, defaults to EN)..."
                      className="w-full bg-[#FAF8F5] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingKb}
                    className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-semibold text-xs px-4 py-2 rounded-xl"
                  >
                    {savingKb
                      ? "Saving..."
                      : kbForm.id
                      ? "Update Knowledge Entry"
                      : "+ Add Knowledge Base Entry"}
                  </button>
                </form>

                <div className="space-y-3">
                  {data.knowledgeBase.map((kb) => (
                    <div
                      key={kb.id}
                      className="p-4 rounded-xl bg-[#EEF5EC]/70 border border-[#005F1B]/15 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#005F1B]" />
                          <strong className="text-sm text-[#242423]">
                            {kb.topic}
                          </strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setKbForm({
                                id: kb.id,
                                topic: kb.topic,
                                keywords: kb.keywords.join(", "),
                                contentEn: kb.contentEn,
                                contentFr: kb.contentFr,
                                contentDe: kb.contentDe,
                              })
                            }
                            className="text-[#005F1B] font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKb(kb.id)}
                            className="text-red-700 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#707070]">
                        Keywords: {kb.keywords.join(", ")}
                      </div>
                      <p className="text-[#242423]">{kb.contentEn}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DIRECT OUTBOUND EMAIL RESPONDER MODAL */}
      {replyModal && replyModal.open && (
        <div className="fixed inset-0 z-50 bg-[#242423]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendDirectReply}
            className="bg-[#FAF8F5] border border-[#242423]/15 rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#005F1B]" />
                <h3 className="text-base font-bold text-[#242423]">
                  Direct Outbound Email Responder
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReplyModal(null)}
                className="text-xs text-[#707070] hover:text-[#242423]"
              >
                ✕
              </button>
            </div>

            <div className="text-xs bg-[#EEF5EC] text-[#005F1B] p-3 rounded-xl">
              Sending to: <strong>{replyModal.recipientName}</strong> (
              {replyModal.to})
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423] mb-1">
                Subject Line
              </label>
              <input
                type="text"
                required
                value={replyModal.subject}
                onChange={(e) =>
                  setReplyModal({ ...replyModal, subject: e.target.value })
                }
                className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423] mb-1">
                Email Body
              </label>
              <textarea
                rows={6}
                required
                value={replyModal.body}
                onChange={(e) =>
                  setReplyModal({ ...replyModal, body: e.target.value })
                }
                className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReplyModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#707070] hover:bg-[#FEF7E9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingReply}
                className="inline-flex items-center gap-1.5 bg-[#005F1B] hover:bg-[#004a15] text-[#FAF8F5] text-xs font-semibold px-5 py-2.5 rounded-xl"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {sendingReply ? "Dispatching..." : "Send Email Now"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* JOB VACANCY CRUD MODAL */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#242423]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveJob}
            className="bg-[#FAF8F5] border border-[#242423]/15 rounded-[24px] max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#242423]">
                {editingJobId
                  ? "Edit Job Vacancy"
                  : "Post New Live Job Vacancy"}
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="text-xs text-[#707070] hover:text-[#242423]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Job Card Title (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, title: e.target.value })
                  }
                  placeholder="Experienced nanny wanted for a toddler"
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Pillar / Category *
                </label>
                <select
                  value={jobForm.category}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, category: e.target.value })
                  }
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Nanny & Childcare">Nanny & Childcare</option>
                  <option value="Household & Commercial Cleaning">
                    Household & Commercial Cleaning
                  </option>
                  <option value="Senior Care & Home Assistance">
                    Senior Care & Home Assistance
                  </option>
                  <option value="Pet Care & Pet Sitting">
                    Pet Care & Pet Sitting
                  </option>
                  <option value="Concierge & Home Help">
                    Concierge & Home Help
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Location in Luxembourg *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, location: e.target.value })
                  }
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Monthly Salary (€) (Optional)
                </label>
                <input
                  type="text"
                  value={jobForm.salary}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, salary: e.target.value })
                  }
                  placeholder="e.g. 4500 or leave blank"
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Employment Type *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.type}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, type: e.target.value })
                  }
                  placeholder="Full-time / Part-time"
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                About the Family / Client Role Description *
              </label>
              <textarea
                rows={3}
                required
                value={jobForm.aboutFamily}
                onChange={(e) =>
                  setJobForm({ ...jobForm, aboutFamily: e.target.value })
                }
                className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Who We Are Looking For (1 bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={jobForm.whoLookingFor}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, whoLookingFor: e.target.value })
                  }
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Key Tasks (1 bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={jobForm.tasks}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, tasks: e.target.value })
                  }
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Working Hours & Schedule
              </label>
              <textarea
                rows={2}
                value={jobForm.schedule}
                onChange={(e) =>
                  setJobForm({ ...jobForm, schedule: e.target.value })
                }
                className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#242423]/10">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  French Title Override (FR - Optional)
                </label>
                <input
                  type="text"
                  value={jobForm.titleFr}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, titleFr: e.target.value })
                  }
                  placeholder="Auto-generated if left blank"
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  German Title Override (DE - Optional)
                </label>
                <input
                  type="text"
                  value={jobForm.titleDe}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, titleDe: e.target.value })
                  }
                  placeholder="Auto-generated if left blank"
                  className="w-full bg-[#FEF7E9] border border-[#242423]/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#707070]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingJob}
                className="bg-[#F1AE1F] hover:bg-[#e09e12] text-[#242423] font-semibold text-xs px-5 py-2.5 rounded-xl"
              >
                {savingJob
                  ? "Saving..."
                  : editingJobId
                  ? "Save Job Changes"
                  : "Publish Job Vacancy"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

