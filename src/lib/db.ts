import fs from "fs";
import path from "path";
import { INITIAL_JOBS, JobVacancy } from "@/lib/jobsData";

export type BookingStatus = "NEW" | "IN_REVIEW" | "CONFIRMED" | "ARCHIVED";

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  categorySlug: string;
  services: string[];
  serviceDate: string;
  startTime: string;
  durationHours: string;
  frequency: string;
  location: string;
  customNotes: string;
  premisesType?: string;
  preferredContactMethod?: string;
  weekdays?: string[];
  propertyDetails?: Record<string, unknown>;
  childDetails?: Record<string, unknown>;
  petDetails?: Record<string, unknown>;
  specificDetails?: Record<string, unknown>;
  status: BookingStatus;
  createdAt: string;
  replies: OutboundEmailRecord[];
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  whyConsidered: string;
  expectedSalary: string;
  cvFileName: string;
  cvMimeType: string;
  cvSizeBytes: number;
  cvStoredPath: string;
  cvBase64?: string;
  cvStorageUrl?: string;
  status: "NEW" | "SHORTLISTED" | "REJECTED";
  createdAt: string;
  replies: OutboundEmailRecord[];
}

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewRecord {
  id: string;
  name: string;
  role: string;
  roleFr?: string;
  roleDe?: string;
  rating: number;
  text: string;
  textFr?: string;
  textDe?: string;
  avatarUrl: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface AiTicketRecord {
  id: string;
  visitorEmail: string;
  visitorName?: string;
  language: "en" | "fr" | "de";
  questionOrMessage: string;
  conversationTranscript: { role: "user" | "assistant"; content: string }[];
  status: "OPEN" | "REPLIED" | "RESOLVED";
  createdAt: string;
  replies: OutboundEmailRecord[];
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "NEW" | "REPLIED";
  createdAt: string;
  replies: OutboundEmailRecord[];
}

export interface OutboundEmailRecord {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  contextType:
    | "BOOKING_ADMIN_ALERT"
    | "JOB_APPLICATION_ADMIN_ALERT"
    | "AI_TICKET_ADMIN_ALERT"
    | "CONTACT_ADMIN_ALERT"
    | "REVIEW_ADMIN_ALERT"
    | "ADMIN_DIRECT_REPLY";
  relatedEntityId?: string;
  sentAt: string;
  deliveryMethod: "SMTP" | "LOCAL_OUTBOX";
}

export interface KnowledgeBaseEntry {
  id: string;
  topic: string;
  keywords: string[];
  contentEn: string;
  contentFr: string;
  contentDe: string;
  updatedAt: string;
}

export interface AdminSettings {
  adminNotificationEmail: string;
  agencyPhone: string;
  agencyAddress: string;
  autoTranslateJobs: boolean;
}

export interface AdminPushSubscription {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  createdAt: string;
}

export interface AdminAlertEvent {
  id: string;
  type: "BOOKING" | "APPLICATION" | "TICKET" | "CONTACT" | "REVIEW";
  title: string;
  body: string;
  url: string;
  timestamp: string;
  read: boolean;
}

export interface MaisonCareDatabase {
  bookings: BookingRecord[];
  jobVacancies: JobVacancy[];
  jobApplications: JobApplicationRecord[];
  reviews: ReviewRecord[];
  aiTickets: AiTicketRecord[];
  contactMessages: ContactMessageRecord[];
  outboundEmails: OutboundEmailRecord[];
  knowledgeBase: KnowledgeBaseEntry[];
  settings: AdminSettings;
  adminPushSubscriptions?: AdminPushSubscription[];
  alertEvents?: AdminAlertEvent[];
}

const IS_VERCEL = process.env.VERCEL === "1";

const LOCAL_MAC_DB_DIR =
  "/Users/badman/.gemini/antigravity/brain/728cdf5a-05a3-478a-af10-03887c19b9c7/db";
const NON_ICLOUD_DB_DIR = IS_VERCEL
  ? path.join("/tmp", "maisoncare")
  : fs.existsSync("/Users/badman/.gemini/antigravity")
  ? LOCAL_MAC_DB_DIR
  : path.join(process.cwd(), "data");
const PRIMARY_DB_FILE = path.join(NON_ICLOUD_DB_DIR, "maisoncare-db.json");
const WORKSPACE_DB_FILE = path.join(process.cwd(), "data", "maisoncare-db.json");
export const CV_STORAGE_DIR = path.join(NON_ICLOUD_DB_DIR, "uploads", "cvs");

const INITIAL_KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  {
    id: "kb-1",
    topic: "5 Main Service Pillars Overview",
    keywords: [
      "service",
      "services",
      "render",
      "offer",
      "pillars",
      "proposez",
      "leistungen",
      "angebot",
    ],
    contentEn:
      "Nanny & MaisonCare Lëtzebuerg offers 5 specialized pillars of care across Luxembourg: (1) Nanny & Childcare Services (Occasional, Full-Time, Part-Time, After-School, Newborn & Infant, Twins/Multiples, Holiday, Call-In/On-Demand, Live-In/Live-Out — focused on care and supervision, not formal academic tutoring), (2) General Household & Commercial Cleaning (Apartments & Houses, Office Cleaning Outside Business Hours, Post-Renovation, Bathrooms/Windows/Terraces, Commercial Premises, Regular/Scheduled, Deep Cleaning, Move-In/Move-Out), (3) Senior Care & Home Assistance (Domestic Help, Personal Care & Hygiene, Meal Preparation, Shopping Assistance, Mobility & Accompaniment), (4) Pet Care & Pet Sitting (at your home or at the sitter's home for dogs, cats, puppies, kittens, rabbits), and (5) Home Help & Concierge Services (Meal Prep & Basic Cooking, Grocery Shopping & Errands, Laundry & Ironing, Home Organisation, Decluttering, Accompaniment).",
    contentFr:
      "Nanny & MaisonCare Lëtzebuerg propose 5 grands piliers de services au Luxembourg : (1) Garde d’Enfants & Nounous (ponctuelle, temps plein, temps partiel, sortie d’école, nourrissons, jumeaux, vacances, sur appel, logée ou externe — centré sur le soin et la supervision), (2) Nettoyage Domestique & Commercial (appartements, maisons, bureaux hors heures d’ouverture, fin de chantier, vitres et terrasses, grand ménage, états des lieux), (3) Aide aux Seniors & Maintien à Domicile (aide ménagère, hygiène personnelle, repas, courses, mobilité), (4) Garde d’Animaux & Pet Sitting (à votre domicile ou chez le pet-sitter), et (5) Aide Ménagère & Conciergerie (cuisine quotidienne, courses, lessive et repassage, rangement et organisation).",
    contentDe:
      "Nanny & MaisonCare Lëtzebuerg bietet 5 spezialisierte Leistungssäulen in ganz Luxemburg an: (1) Nanny & Kinderbetreuung (gelegentlich, Vollzeit, Teilzeit, Nachmittagsbetreuung, Säuglinge, Zwillinge, Ferien, Abruf-Nanny, Live-In/Live-Out), (2) Haushalts- & Gewerbereinigung (Wohnungen, Häuser, Büroreinigung außerhalb der Geschäftszeiten, Bauendreinigung, Fenster & Terrassen, Grundreinigung, Umzugsreinigung), (3) Seniorenbetreuung & Alltagshilfe (Hauswirtschaft, Körperpflege, Mahlzeiten, Einkäufe, Begleitung), (4) Tierbetreuung & Pet Sitting (bei Ihnen zu Hause oder beim Tiersitter), sowie (5) Haushaltshilfe & Concierge-Service (Kochen, Einkäufe, Wäsche & Bügeln, Haushaltsorganisation).",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "kb-2",
    topic: "How to Request a Service & Booking Confirmation",
    keywords: [
      "book",
      "booking",
      "request",
      "price",
      "pricing",
      "cost",
      "confirm",
      "réserver",
      "tarif",
      "prix",
      "buchen",
      "anfrage",
      "kosten",
      "preise",
    ],
    contentEn:
      "To request a service: click 'Request a Service' or select one of our 5 category cards, choose your specific service type(s) or write a custom request, and specify your preferred date(s), start time, number of hours, frequency, and location in Luxembourg. Please note: a submitted request is an enquiry, not an automatically confirmed booking. Our concierge desk will contact you promptly to discuss your requirements and confirm availability, pricing, and arrangements.",
    contentFr:
      "Pour demander un service : cliquez sur « Demander un Service » ou sur l’une de nos 5 catégories, choisissez le type de prestation souhaité (ou décrivez votre demande sur mesure), puis indiquez la date, l’heure de début, le nombre d’heures, la fréquence et votre commune au Luxembourg. Une demande soumise constitue une prise de contact : notre équipe vous recontacte rapidement pour confirmer les disponibilités, les tarifs et les modalités.",
    contentDe:
      "So stellen Sie eine Service-Anfrage: Klicken Sie auf ‚Service anfragen‘ oder wählen Sie eine unserer 5 Kategorien, wählen Sie die gewünschte Leistung und geben Sie Datum, Startzeit, Stundenzahl, Häufigkeit und Ihren Ort in Luxemburg an. Hinweis: Eine abgesendete Anfrage ist zunächst eine unverbindliche Anfrage. Unser Team kontaktiert Sie zeitnah zur Bestätigung von Verfügbarkeit, Preisen und Ablauf.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "kb-3",
    topic: "Safety, Vetting & Screening Standards",
    keywords: [
      "vetting",
      "screen",
      "screening",
      "safe",
      "safety",
      "trust",
      "background",
      "criminal",
      "discretion",
      "sécurité",
      "casier",
      "sicherheit",
      "prüfung",
    ],
    contentEn:
      "Every Nanny & MaisonCare specialist undergoes our strict multi-layered screening framework: identity and work-authorization verification, clean criminal record check (Extrait de casier judiciaire), verified references from prior households or commercial clients, and assessment of multilingual proficiency (English, French, German, Luxembourgish) and absolute discretion.",
    contentFr:
      "Chaque intervenant Nanny & MaisonCare passe par notre processus de sélection multicouche : vérification d’identité, extrait de casier judiciaire vierge, contrôle des références auprès d’anciens employeurs, évaluation linguistique (français, anglais, allemand, luxembourgeois) et engagement de confidentialité absolue.",
    contentDe:
      "Jede Fachkraft von Nanny & MaisonCare durchläuft unser mehrstufiges Prüfverfahren: Identitätsprüfung, einwandfreies polizeiliches Führungszeugnis (Extrait de casier judiciaire), geprüfte Referenzen früherer Familien sowie Prüfung der Sprachkompetenz (Deutsch, Französisch, Englisch, Luxemburgisch) und absoluter Diskretion.",
    updatedAt: new Date().toISOString(),
  },
];

function createSeedDatabase(): MaisonCareDatabase {
  const adminEmail = process.env.ADMIN_EMAIL || "info@nannymaisoncare.lu";
  return {
    bookings: [
      {
        id: "bk-1001",
        name: "Camille & Henri Meyers",
        email: "c.meyers@example.lu",
        phone: "+352 621 440 192",
        category: "Nanny & Childcare Services",
        categorySlug: "nanny",
        services: ["After-School Care", "Part-Time Nanny"],
        serviceDate: "2026-11-02",
        startTime: "15:30",
        durationHours: "4",
        frequency: "weekly",
        location: "Kirchberg, Luxembourg",
        customNotes:
          "Looking for a French and English speaking nanny to pick up our two children (ages 4 and 7) from European School Kirchberg 4 afternoons per week.",
        status: "NEW",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        replies: [],
      },
      {
        id: "bk-1002",
        name: "Dr. Lukas Hoffmann",
        email: "l.hoffmann@example.lu",
        phone: "+352 691 882 310",
        category: "General Household & Commercial Cleaning",
        categorySlug: "cleaning",
        services: [
          "Office Cleaning Outside Business Hours",
          "Bathrooms, Windows & Terraces",
        ],
        serviceDate: "2026-11-05",
        startTime: "19:00",
        durationHours: "3",
        frequency: "biweekly",
        location: "Limpertsberg, Luxembourg",
        customNotes:
          "Twice-weekly evening cleaning for our private medical practice in Limpertsberg after 19:00 so patient hours are never disrupted.",
        status: "CONFIRMED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        replies: [],
      },
    ],
    jobVacancies: INITIAL_JOBS,
    jobApplications: [
      {
        id: "app-2001",
        jobId: "job-1",
        jobTitle:
          "Experienced nanny / family assistant wanted for a 3-year-old toddler",
        name: "Aline Ferreira",
        email: "aline.ferreira@example.lu",
        phone: "+352 661 209 441",
        whyConsidered:
          "7 years of full-time toddler nanny and family assistant experience in Luxembourg-Ville and Belair. Fluent in French, Portuguese, and English, with my own car and clean driving record.",
        expectedSalary: "4800",
        cvFileName: "Aline_Ferreira_CV_Luxembourg.pdf",
        cvMimeType: "application/pdf",
        cvSizeBytes: 142800,
        cvStoredPath: "sample-aline-cv.pdf",
        status: "NEW",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        replies: [],
      },
    ],
    reviews: [
      {
        id: "rev-1",
        name: "Sophie & Marc Schmit",
        role: "Kirchberg, Luxembourg",
        roleFr: "Kirchberg, Luxembourg",
        roleDe: "Kirchberg, Luxemburg",
        rating: 5,
        text: "MaisonCare have been doing an amazing job with helping raise our kids! Our life has been so much easier since we hired a trilingual nanny through them for after-school care.",
        textFr: "MaisonCare fait un travail formidable pour nous aider à élever nos enfants ! Notre quotidien est tellement plus serein depuis que nous avons engagé une nounou trilingue pour la garde après l'école.",
        textDe: "MaisonCare leistet fantastische Arbeit bei der Betreuung unserer Kinder! Unser Alltag ist so viel einfacher geworden, seit wir über die Agentur eine dreisprachige Nanny für die Nachmittagsbetreuung engagiert haben.",
        avatarUrl: "",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      },
      {
        id: "rev-2",
        name: "Elena Rostova",
        role: "Belair, Luxembourg",
        roleFr: "Belair, Luxembourg",
        roleDe: "Belair, Luxemburg",
        rating: 5,
        text: "Absolute discretion and reliability. Their household cleaning and laundry organisation specialist keeps our residence spotless every week without us ever worrying about logistics.",
        textFr: "Discrétion absolue et fiabilité exemplaire. Leur spécialiste du ménage et de l'entretien du linge garde notre résidence impeccable chaque semaine sans aucun souci logistique.",
        textDe: "Absolute Diskretion und Zuverlässigkeit. Die Fachkraft für Haushaltsreinigung und Wäschepflege hält unser Anwesen jede Woche makellos sauber, ohne dass wir uns um logistische Details kümmern müssen.",
        avatarUrl: "",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
      {
        id: "rev-3",
        name: "Thomas Van Der Berg",
        role: "Strassen, Luxembourg",
        roleFr: "Strassen, Luxembourg",
        roleDe: "Strassen, Luxemburg",
        rating: 5,
        text: "We needed both senior home assistance for my mother and occasional pet sitting when travelling. Having a single point of contact in Luxembourg has been priceless.",
        textFr: "Nous avions besoin à la fois d'une assistance à domicile pour ma mère et de garde d'animaux lors de nos déplacements. Avoir un interlocuteur unique au Luxembourg est inestimable.",
        textDe: "Wir benötigten sowohl Seniorenbetreuung zu Hause für meine Mutter als auch gelegentliches Pet-Sitting bei Reisen. Einen einzigen verlässlichen Ansprechpartner in Luxemburg zu haben, ist unbezahlbar.",
        avatarUrl: "",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: "rev-4",
        name: "Claire & Julien Weber",
        role: "Limpertsberg, Luxembourg",
        roleFr: "Limpertsberg, Luxembourg",
        roleDe: "Limpertsberg, Luxemburg",
        rating: 5,
        text: "MaisonCare have been doing an amazing job with helping raise my kids! My life has been so much easier since I hired them to help with childcare and daily meal prep.",
        textFr: "MaisonCare fait un travail remarquable pour nous épauler avec les enfants ! Mon quotidien est tellement plus facile depuis que je fais appel à eux pour la garde et les repas quotidiens.",
        textDe: "MaisonCare leistet hervorragende Unterstützung bei der Betreuung unserer Kinder! Mein Leben ist so viel entspannter, seit sie uns bei der Kinderbetreuung und der täglichen Essenszubereitung unterstützen.",
        avatarUrl: "",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "rev-5",
        name: "Amélie Becker",
        role: "Mamer, Luxembourg",
        roleFr: "Mamer, Luxembourg",
        roleDe: "Mamer, Luxemburg",
        rating: 5,
        text: "Our weekend call-in nanny was wonderful with our twins. Highly recommend Nanny & MaisonCare Lëtzebuerg to any international family in the Grand Duchy!",
        textFr: "Notre nounou ponctuelle du week-end a été formidable avec nos jumeaux. Je recommande vivement Nanny & MaisonCare Lëtzebuerg à toute famille internationale au Grand-Duché !",
        textDe: "Unsere Wochenend-Nanny auf Abruf war wunderbar mit unseren Zwillingen. Ich kann Nanny & MaisonCare Lëtzebuerg jeder internationalen Familie im Großherzogtum wärmstens empfehlen!",
        avatarUrl: "",
        status: "PENDING",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
    aiTickets: [
      {
        id: "tkt-3001",
        visitorEmail: "m.vanouten@example.lu",
        visitorName: "Martijn Van Outen",
        language: "en",
        questionOrMessage:
          "We are relocating from Amsterdam to Senningerberg next month with newborn twins and a Labrador. Can we arrange a combined consultation for both a live-in infant specialist and daytime dog walking?",
        conversationTranscript: [
          {
            role: "user",
            content:
              "Do you offer combined live-in newborn twin care and daily dog walking packages in Senningerberg with custom diplomatic billing?",
          },
          {
            role: "assistant",
            content:
              "We offer both Twins & Multiple-Child Care (including Live-In arrangements) and Dog Walking & Pet Care across Luxembourg. For custom diplomatic billing and a combined package quote, please leave your email and message below so our human Concierge Desk can assist you directly.",
          },
        ],
        status: "OPEN",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        replies: [],
      },
    ],
    contactMessages: [],
    outboundEmails: [],
    knowledgeBase: INITIAL_KNOWLEDGE_BASE,
    adminPushSubscriptions: [],
    alertEvents: [],
    settings: {
      adminNotificationEmail: adminEmail,
      agencyPhone: "+352 691 225 764 / +352 691 346 782 / +352 691 347 090",
      agencyAddress: "140 Rue de Cessange, Luxembourg",
      autoTranslateJobs: true,
    },
  };
}

let memoryDbCache: MaisonCareDatabase | null = null;

function ensureDirectories() {
  try {
    if (!fs.existsSync(NON_ICLOUD_DB_DIR)) {
      fs.mkdirSync(NON_ICLOUD_DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(CV_STORAGE_DIR)) {
      fs.mkdirSync(CV_STORAGE_DIR, { recursive: true });
    }
    const sampleCvPath = path.join(CV_STORAGE_DIR, "sample-aline-cv.pdf");
    if (!fs.existsSync(sampleCvPath)) {
      const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 148 >> stream
BT /F1 16 Tf 50 720 Td (Aline Ferreira - Curriculum Vitae) Tj /F1 12 Tf 0 -28 Td (Senior Nanny & Family Assistant | Luxembourg-Ville) Tj 0 -20 Td (7+ Years Experience | FR / EN / PT | Valid EU Driving License) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000241 00000 n 
0000000440 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
508
%%EOF`;
      fs.writeFileSync(sampleCvPath, minimalPdf, "utf8");
    }
  } catch (err) {
    console.warn("[MaisonCare DB] Directory initialization warning:", err);
  }
}

export function readDb(): MaisonCareDatabase {
  if (memoryDbCache) {
    return memoryDbCache;
  }

  ensureDirectories();

  if (fs.existsSync(PRIMARY_DB_FILE)) {
    try {
      const raw = fs.readFileSync(PRIMARY_DB_FILE, "utf8");
      const parsed = JSON.parse(raw) as MaisonCareDatabase;
      memoryDbCache = parsed;
      return parsed;
    } catch {
      // Fall through to seed
    }
  }

  // If running on Vercel or fresh server, seed from bundled workspace file
  if (fs.existsSync(WORKSPACE_DB_FILE)) {
    try {
      const raw = fs.readFileSync(WORKSPACE_DB_FILE, "utf8");
      const parsed = JSON.parse(raw) as MaisonCareDatabase;
      memoryDbCache = parsed;
      writeDb(parsed);
      return parsed;
    } catch {
      // Fall through to seed
    }
  }

  const seeded = createSeedDatabase();
  writeDb(seeded);
  return seeded;
}

export function writeDb(data: MaisonCareDatabase): void {
  memoryDbCache = data;
  try {
    ensureDirectories();
    const serialized = JSON.stringify(data, null, 2);
    fs.writeFileSync(PRIMARY_DB_FILE, serialized, "utf8");

    if (!IS_VERCEL) {
      try {
        const workspaceDataDir = path.dirname(WORKSPACE_DB_FILE);
        if (!fs.existsSync(workspaceDataDir)) {
          fs.mkdirSync(workspaceDataDir, { recursive: true });
        }
        fs.writeFileSync(WORKSPACE_DB_FILE, serialized, "utf8");
      } catch {
        // Non-fatal if workspace mirror is busy
      }
    }
  } catch (diskErr) {
    console.warn(
      "[MaisonCare DB] Serverless disk write warning (in-memory state preserved):",
      diskErr
    );
  }

  // Asynchronously persist to Supabase if credentials are configured
  try {
    // Dynamic import to prevent circular dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isSupabaseConfigured, saveDatabaseToSupabase } = require("./supabase");
    if (isSupabaseConfigured()) {
      saveDatabaseToSupabase(data).catch(() => {});
    }
  } catch {
    // Non-fatal
  }
}

export async function readDbAsync(): Promise<MaisonCareDatabase> {
  if (memoryDbCache) return memoryDbCache;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isSupabaseConfigured, fetchDatabaseFromSupabase } = require("./supabase");
    if (isSupabaseConfigured()) {
      const cloudDb = await fetchDatabaseFromSupabase();
      if (cloudDb) {
        memoryDbCache = cloudDb;
        return cloudDb;
      }
    }
  } catch {
    // Fall back to local
  }
  return readDb();
}

export function updateDb(
  mutator: (draft: MaisonCareDatabase) => void
): MaisonCareDatabase {
  const current = readDb();
  mutator(current);
  writeDb(current);
  return current;
}

export async function writeDbAsync(data: MaisonCareDatabase): Promise<void> {
  memoryDbCache = data;
  writeDb(data);

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isSupabaseConfigured, saveDatabaseToSupabase } = require("./supabase");
    if (isSupabaseConfigured()) {
      await saveDatabaseToSupabase(data);
    }
  } catch (err) {
    console.warn("[MaisonCare DB] writeDbAsync Supabase note:", err);
  }
}

export async function updateDbAsync(
  mutator: (draft: MaisonCareDatabase) => void
): Promise<MaisonCareDatabase> {
  const current = await readDbAsync();
  mutator(current);
  await writeDbAsync(current);
  return current;
}

export async function recordAdminAlertAsync(
  event: Omit<AdminAlertEvent, "id" | "timestamp" | "read">
): Promise<AdminAlertEvent> {
  const newAlert: AdminAlertEvent = {
    ...event,
    id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };

  await updateDbAsync((draft) => {
    if (!draft.alertEvents) {
      draft.alertEvents = [];
    }
    draft.alertEvents.unshift(newAlert);
    if (draft.alertEvents.length > 150) {
      draft.alertEvents = draft.alertEvents.slice(0, 150);
    }
  });

  return newAlert;
}

export async function getAdminAlertsSinceAsync(
  sinceIso?: string
): Promise<{ alerts: AdminAlertEvent[]; unreadCount: number }> {
  const db = await readDbAsync();
  const allAlerts = db.alertEvents || [];
  const unreadCount = allAlerts.filter((a) => !a.read).length;

  if (!sinceIso) {
    return { alerts: allAlerts.slice(0, 25), unreadCount };
  }
  const sinceTime = new Date(sinceIso).getTime();
  const alerts = allAlerts.filter(
    (a) => new Date(a.timestamp).getTime() > sinceTime
  );
  return { alerts, unreadCount };
}

export function recordAdminAlert(
  event: Omit<AdminAlertEvent, "id" | "timestamp" | "read">
): AdminAlertEvent {
  const newAlert: AdminAlertEvent = {
    ...event,
    id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };

  updateDb((draft) => {
    if (!draft.alertEvents) {
      draft.alertEvents = [];
    }
    draft.alertEvents.unshift(newAlert);
    if (draft.alertEvents.length > 150) {
      draft.alertEvents = draft.alertEvents.slice(0, 150);
    }
  });

  return newAlert;
}

export function getAdminAlertsSince(sinceIso?: string): AdminAlertEvent[] {
  const db = readDb();
  const alerts = db.alertEvents || [];
  if (!sinceIso) {
    return alerts.slice(0, 25);
  }
  const sinceTime = new Date(sinceIso).getTime();
  return alerts.filter((a) => new Date(a.timestamp).getTime() > sinceTime);
}

