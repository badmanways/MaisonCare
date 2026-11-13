import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { DICTIONARIES, Locale } from "@/lib/i18n/dictionaries";
import { checkRateLimit, getClientIp, sanitizeText } from "@/lib/security";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Automatically detects whether the user is writing in English ('en'), French ('fr'), or German ('de').
 * Falls back to the active UI locale if the message is very short or ambiguous.
 */
function detectLanguage(text: string, fallbackLocale: Locale = "en"): Locale {
  const lower = ` ${text.toLowerCase()} `;

  const frMarkers = [
    " bonjour ",
    " salut ",
    " merci ",
    " combien ",
    " quels ",
    " quelles ",
    " comment ",
    " puis-je ",
    " je ",
    " nous ",
    " vous ",
    " cherchons ",
    " cherche ",
    " nounou ",
    " garde ",
    " enfants ",
    " ménage ",
    " nettoyage ",
    " animaux ",
    " chien ",
    " chat ",
    " personnes âgées ",
    " seniors ",
    " tarif ",
    " prix ",
    " réserver ",
    " emploi ",
    " postuler ",
    " travail ",
    " cours ",
    " soutien scolaire ",
    " est-ce ",
    " avez-vous ",
    " proposez ",
  ];

  const deMarkers = [
    " hallo ",
    " guten ",
    " danke ",
    " bitte ",
    " wie ",
    " was ",
    " welche ",
    " kosten ",
    " preise ",
    " kinderbetreuung ",
    " reinigung ",
    " putzfrau ",
    " büroreinigung ",
    " seniorenbetreuung ",
    " tierbetreuung ",
    " hund ",
    " katze ",
    " haushaltshilfe ",
    " buchen ",
    " anfrage ",
    " stellenangebote ",
    " bewerben ",
    " nachhilfe ",
    " unterricht ",
    " wir ",
    " ich ",
    " suchen ",
    " bieten ",
    " sie ",
  ];

  const enMarkers = [
    " hello ",
    " hi ",
    " please ",
    " how ",
    " what ",
    " which ",
    " do you ",
    " can i ",
    " nanny ",
    " childcare ",
    " cleaning ",
    " senior ",
    " pet ",
    " dog ",
    " cat ",
    " concierge ",
    " book ",
    " price ",
    " cost ",
    " job ",
    " jobs ",
    " apply ",
    " tutor ",
    " tutoring ",
    " screening ",
  ];

  let frScore = 0;
  let deScore = 0;
  let enScore = 0;

  for (const m of frMarkers) {
    if (lower.includes(m)) frScore += 2;
  }
  for (const m of deMarkers) {
    if (lower.includes(m)) deScore += 2;
  }
  for (const m of enMarkers) {
    if (lower.includes(m)) enScore += 2;
  }

  // Accent / character heuristics
  if (/[éèêàùçœ]/i.test(text)) frScore += 1;
  if (/[äöüß]/i.test(text)) deScore += 2;

  if (frScore > deScore && frScore > enScore && frScore >= 2) return "fr";
  if (deScore > frScore && deScore > enScore && deScore >= 2) return "de";
  if (enScore > frScore && enScore > deScore && enScore >= 2) return "en";

  return fallbackLocale;
}

function buildGroundedResponse(
  query: string,
  lang: Locale
): {
  reply: string;
  requiresEscalation: boolean;
  suggestedCategorySlug?: string;
} {
  const q = query.toLowerCase();
  const db = readDb();
  const dict = DICTIONARIES[lang];

  // 1. Check explicitly if the user asks about formal academic tutoring / homework teaching (important brief constraint!)
  if (
    q.includes("tutor") ||
    q.includes("tutoring") ||
    q.includes("homework") ||
    q.includes("academic") ||
    q.includes("teaching") ||
    q.includes("soutien scolaire") ||
    q.includes("cours particulier") ||
    q.includes("devoirs") ||
    q.includes("nachhilfe") ||
    q.includes("unterricht")
  ) {
    const replies: Record<Locale, string> = {
      en: "Important note regarding our Nanny & Childcare pillar: Nanny & MaisonCare Lëtzebuerg provides dedicated childcare, safe supervision, school pick-ups, and daily routines (including Occasional, Full-Time, Part-Time, After-School, Newborn & Infant, Twins/Multiples, Holiday, Call-In, and Live-In/Live-Out care). However, we do not offer formal academic tutoring or teaching services. Would you like to book a nanny for care and supervision, or open a support ticket with our Concierge Desk?",
      fr: "Information importante concernant notre pilier Garde d’Enfants & Nounous : Nanny & MaisonCare Lëtzebuerg assure la garde, la supervision bienveillante, les sorties d’école et les routines quotidiennes (ponctuelle, temps plein/partiel, nourrissons, jumeaux, vacances, logée ou externe). Toutefois, nous ne proposons pas d’enseignement scolaire formel ni de cours particuliers. Souhaitez-vous réserver une nounou ou ouvrir un ticket auprès de notre Conciergerie ?",
      de: "Wichtiger Hinweis zu unserer Säule Nanny & Kinderbetreuung: Nanny & MaisonCare Lëtzebuerg bietet liebevolle Betreuung, sichere Beaufsichtigung, Schulabholung und Alltagsbegleitung (gelegentlich, Vollzeit, Teilzeit, Säuglinge, Zwillinge, Ferien, Live-In/Live-Out). Formelle schulische Nachhilfe oder Unterricht bieten wir jedoch nicht an. Möchten Sie eine Betreuung anfragen oder ein Ticket bei unserem Concierge-Desk eröffnen?",
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
      suggestedCategorySlug: "nanny",
    };
  }

  // 2. Check custom / bespoke / pricing / diplomatic / relocation / unknown complex requests -> Escalate to Support Ticket
  const escalationTriggers = [
    "price",
    "pricing",
    "cost",
    "quote",
    "rate",
    "hourly",
    "how much",
    "tarif",
    "prix",
    "combien",
    "devis",
    "kosten",
    "preise",
    "stundensatz",
    "angebot",
    "diplomatic",
    "embassy",
    "relocating",
    "relocation",
    "invoice",
    "billing",
    "contract",
    "urgent tomorrow",
    "custom package",
    "human",
    "agent",
    "speak to someone",
    "call me",
    "ticket",
    "complaint",
  ];

  const needsHumanQuoteOrTicket = escalationTriggers.some((kw) =>
    q.includes(kw)
  );

  if (needsHumanQuoteOrTicket) {
    const replies: Record<Locale, string> = {
      en: "Because every household and commercial schedule in Luxembourg is tailored to your exact hours, frequency, and requirements, personalized rates and custom arrangements are confirmed directly by our human Concierge Desk. Please enter your email and message below to open a priority Support Ticket—our administrator will be notified immediately and will reply directly to your inbox.",
      fr: "Chaque prestation au Luxembourg étant adaptée sur mesure à vos horaires, à la fréquence souhaitée et aux besoins de votre foyer ou entreprise, les tarifs personnalisés et disponibilités exactes sont confirmés directement par notre Conciergerie humaine. Veuillez indiquer votre e-mail et votre message ci-dessous pour ouvrir un ticket prioritaire : notre administrateur vous répondra directement par e-mail.",
      de: "Da jeder Einsatz in Luxemburg individuell auf Ihre Zeiten, die gewünschte Häufigkeit und Ihre Anforderungen abgestimmt wird, werden konkrete Tarife und Sondervereinbarungen direkt von unserem Concierge-Desk bestätigt. Bitte geben Sie unten Ihre E-Mail-Adresse und Ihre Nachricht ein, um ein Support-Ticket zu eröffnen – unser Administrator wird sofort benachrichtigt und antwortet Ihnen direkt per E-Mail.",
    };
    return {
      reply: replies[lang],
      requiresEscalation: true,
    };
  }

  // 3. Check Nanny & Childcare queries
  if (
    q.includes("nanny") ||
    q.includes("nannies") ||
    q.includes("child") ||
    q.includes("children") ||
    q.includes("baby") ||
    q.includes("newborn") ||
    q.includes("infant") ||
    q.includes("twins") ||
    q.includes("after-school") ||
    q.includes("after school") ||
    q.includes("live-in") ||
    q.includes("babysit") ||
    q.includes("nounou") ||
    q.includes("enfant") ||
    q.includes("bébé") ||
    q.includes("nourrisson") ||
    q.includes("jumeaux") ||
    q.includes("kinder") ||
    q.includes("säugling") ||
    q.includes("zwilling")
  ) {
    const cat = dict.categories.find((c) => c.slug === "nanny")!;
    const subList = cat.serviceTypes.map((s) => `• ${s.label}`).join("\n");
    const replies: Record<Locale, string> = {
      en: `Our **${cat.title}** pillar provides vetted, multilingual childcare specialists across Luxembourg:\n\n${subList}\n\nAll childcare focuses on safe supervision, developmental play, and family routines (excluding formal academic tutoring). You can click **"Request a Service"** to select your preferred schedule, dates, and hours.`,
      fr: `Notre pilier **${cat.title}** met à votre disposition des spécialistes qualifiés et multilingues au Luxembourg :\n\n${subList}\n\nToutes nos prestations sont centrées sur la garde, l’éveil et la supervision en toute sécurité. Cliquez sur **« Réserver un service »** pour préciser vos dates et horaires.`,
      de: `Unsere Säule **${cat.title}** bietet geprüfte, mehrsprachige Betreuungskräfte in ganz Luxemburg:\n\n${subList}\n\nUnsere Betreuung konzentriert sich auf sichere Beaufsichtigung und den Familienalltag. Klicken Sie auf **„Service buchen“**, um Ihre Wunschzeiten anzugeben.`,
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
      suggestedCategorySlug: "nanny",
    };
  }

  // 4. Check Household & Commercial Cleaning queries
  if (
    q.includes("clean") ||
    q.includes("cleaning") ||
    q.includes("office") ||
    q.includes("renovation") ||
    q.includes("window") ||
    q.includes("terrace") ||
    q.includes("move-in") ||
    q.includes("move-out") ||
    q.includes("ménage") ||
    q.includes("nettoyage") ||
    q.includes("bureau") ||
    q.includes("chantier") ||
    q.includes("vitre") ||
    q.includes("reinigung") ||
    q.includes("putz") ||
    q.includes("büro") ||
    q.includes("fenster")
  ) {
    const cat = dict.categories.find((c) => c.slug === "cleaning")!;
    const subList = cat.serviceTypes.map((s) => `• ${s.label}`).join("\n");
    const replies: Record<Locale, string> = {
      en: `Our **${cat.title}** division serves both private residences and commercial offices across Luxembourg:\n\n${subList}\n\nOffice cleaning can be scheduled strictly **outside business hours** (evenings, early mornings, or weekends) so your operations are never disrupted.`,
      fr: `Notre division **${cat.title}** intervient pour les résidences privées et les locaux professionnels au Luxembourg :\n\n${subList}\n\nLe nettoyage de bureaux peut être planifié **en dehors des heures d’ouverture** (tôt le matin, en soirée ou le week-end) pour ne jamais perturber votre activité.`,
      de: `Unser Bereich **${cat.title}** betreut Privathaushalte sowie Gewerbe- und Büroräume in Luxemburg:\n\n${subList}\n\nDie Büroreinigung kann gezielt **außerhalb der Geschäftszeiten** (abends, frühmorgens oder am Wochenende) durchgeführt werden.`,
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
      suggestedCategorySlug: "cleaning",
    };
  }

  // 5. Check Senior Care & Home Assistance queries
  if (
    q.includes("senior") ||
    q.includes("elder") ||
    q.includes("elderly") ||
    q.includes("parent") ||
    q.includes("hygiene") ||
    q.includes("mobility") ||
    q.includes("personnes âgées") ||
    q.includes(" maintien à domicile") ||
    q.includes("senioren") ||
    q.includes("pflege") ||
    q.includes("alltagshilfe")
  ) {
    const cat = dict.categories.find((c) => c.slug === "senior")!;
    const subList = cat.serviceTypes.map((s) => `• ${s.label}`).join("\n");
    const replies: Record<Locale, string> = {
      en: `Our **${cat.title}** pillar helps seniors live comfortably, safely, and independently at home in Luxembourg:\n\n${subList}\n\nWould you like to submit a service enquiry for your family member?`,
      fr: `Notre pilier **${cat.title}** accompagne les seniors à domicile au Luxembourg avec dignité et bienveillance :\n\n${subList}\n\nSouhaitez-vous soumettre une demande pour un proche ?`,
      de: `Unsere Säule **${cat.title}** unterstützt Senioren in Luxemburg für ein sicheres und selbstbestimmtes Leben zu Hause:\n\n${subList}\n\nMöchten Sie eine unverbindliche Anfrage für Ihre Angehörigen stellen?`,
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
      suggestedCategorySlug: "senior",
    };
  }

  // 6. Check Pet Care & Pet Sitting queries
  if (
    q.includes("pet") ||
    q.includes("dog") ||
    q.includes("cat") ||
    q.includes("puppy") ||
    q.includes("kitten") ||
    q.includes("rabbit") ||
    q.includes("walk") ||
    q.includes("sitting") ||
    q.includes("animaux") ||
    q.includes("chien") ||
    q.includes("chat") ||
    q.includes("promenade") ||
    q.includes("tier") ||
    q.includes("hund") ||
    q.includes("katze") ||
    q.includes("gassi")
  ) {
    const cat = dict.categories.find((c) => c.slug === "pet")!;
    const subList = cat.serviceTypes.map((s) => `• ${s.label}`).join("\n");
    const replies: Record<Locale, string> = {
      en: `Our **${cat.title}** pillar cares for dogs, cats, puppies, kittens, rabbits, and small household pets—available **At Your Home** or **At the Sitter’s Home**:\n\n${subList}`,
      fr: `Notre pilier **${cat.title}** prend soin de vos chiens, chats, chiots, chatons et petits animaux — **à votre domicile** ou **au domicile du pet-sitter** :\n\n${subList}`,
      de: `Unsere Säule **${cat.title}** betreut Hunde, Katzen, Welpen, Kätzchen und Kleintiere – wahlweise **bei Ihnen zu Hause** oder **im Haushalt des Tiersitters**:\n\n${subList}`,
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
      suggestedCategorySlug: "pet",
    };
  }

  // 7. Check Concierge & Home Help queries
  if (
    q.includes("concierge") ||
    q.includes("home help") ||
    q.includes("meal") ||
    q.includes("cooking") ||
    q.includes("grocery") ||
    q.includes("errand") ||
    q.includes("laundry") ||
    q.includes("ironing") ||
    q.includes("declutter") ||
    q.includes("organis") ||
    q.includes("organiz") ||
    q.includes("repas") ||
    q.includes("courses") ||
    q.includes("repassage") ||
    q.includes("lessive") ||
    q.includes("rangement") ||
    q.includes("haushaltshilfe") ||
    q.includes("kochen") ||
    q.includes("bügeln") ||
    q.includes("wäsche") ||
    q.includes("einkauf")
  ) {
    const cat = dict.categories.find((c) => c.slug === "concierge")!;
    const subList = cat.serviceTypes.map((s) => `• ${s.label}`).join("\n");
    const replies: Record<Locale, string> = {
      en: `Our **${cat.title}** pillar handles everyday household logistics so you can reclaim your time:\n\n${subList}`,
      fr: `Notre pilier **${cat.title}** prend en charge la logistique quotidienne de votre foyer :\n\n${subList}`,
      de: `Unsere Säule **${cat.title}** entlastet Sie zuverlässig im täglichen Haushaltsmanagement:\n\n${subList}`,
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
      suggestedCategorySlug: "concierge",
    };
  }

  // 8. Check Jobs / Careers / Applying
  if (
    q.includes("job") ||
    q.includes("jobs") ||
    q.includes("vacancy") ||
    q.includes("vacancies") ||
    q.includes("career") ||
    q.includes("work") ||
    q.includes("apply") ||
    q.includes("cv") ||
    q.includes("hiring") ||
    q.includes("emploi") ||
    q.includes("postuler") ||
    q.includes("recrut") ||
    q.includes("travail") ||
    q.includes("stelle") ||
    q.includes("bewerb") ||
    q.includes("arbeit") ||
    q.includes("jobangebot")
  ) {
    const openJobs = db.jobVacancies.slice(0, 4);
    const jobBullets = openJobs
      .map(
        (j) =>
          `• **${j.translations?.[lang]?.title || j.title}** (${j.location} — €${j.salary}/mo)`
      )
      .join("\n");

    const replies: Record<Locale, string> = {
      en: `We are actively recruiting experienced household, childcare, and cleaning professionals in Luxembourg! Current live vacancies on our **Jobs** page include:\n\n${jobBullets}\n\nVisit the **Jobs** page and click **"Learn more"** on any role to submit your application and upload your CV (\`.pdf\`, \`.doc\`, or \`.docx\`).`,
      fr: `Nous recrutons régulièrement des professionnels de la garde d’enfants, du ménage et de l’aide à domicile au Luxembourg ! Voici nos postes actuellement ouverts sur la page **Emplois** :\n\n${jobBullets}\n\nRendez-vous sur la page **Emplois** et cliquez sur **« En savoir plus »** pour postuler avec votre CV (\`.pdf\`, \`.doc\` ou \`.docx\`).`,
      de: `Wir suchen laufend erfahrene Fachkräfte für Kinderbetreuung, Reinigung und Haushaltshilfe in Luxemburg! Aktuelle Stellenangebote auf unserer **Jobs**-Seite:\n\n${jobBullets}\n\nBesuchen Sie die Seite **Jobs** und klicken Sie auf **„Mehr erfahren“**, um sich mit Ihrem Lebenslauf (\`.pdf\`, \`.doc\` oder \`.docx\`) zu bewerben.`,
    };
    return {
      reply: replies[lang],
      requiresEscalation: false,
    };
  }

  // 9. Check Knowledge Base entries (Services overview, Booking flow, Screening/Vetting)
  for (const entry of db.knowledgeBase) {
    const matched = entry.keywords.some((kw) => q.includes(kw.toLowerCase()));
    if (matched) {
      const content =
        lang === "fr"
          ? entry.contentFr
          : lang === "de"
          ? entry.contentDe
          : entry.contentEn;
      return {
        reply: content,
        requiresEscalation: false,
      };
    }
  }

  // 10. Check FAQs in dictionary
  for (const faq of dict.faqs) {
    const faqWords = faq.question
      .toLowerCase()
      .split(/\W+/)
      .filter((w: string) => w.length > 4);
    const matchCount = faqWords.filter((w: string) => q.includes(w)).length;
    if (matchCount >= 2) {
      return {
        reply: `**${faq.question}**\n\n${faq.answer}`,
        requiresEscalation: false,
      };
    }
  }

  // 11. Check simple greetings
  if (
    /^(hi|hello|hey|good morning|good afternoon|bonjour|salut|bonsoir|hallo|guten tag|moien)\b/i.test(
      q.trim()
    ) &&
    q.trim().length < 35
  ) {
    const greetings: Record<Locale, string> = {
      en: "Hello! Welcome to **Nanny & MaisonCare Lëtzebuerg**. I can help you explore our 5 pillars of care (Nanny & Childcare, Household & Commercial Cleaning, Senior Care, Pet Care, and Concierge & Home Help), explain our screening standards, or show our open job vacancies in Luxembourg. How can I help you today?",
      fr: "Bonjour ! Bienvenue chez **Nanny & MaisonCare Lëtzebuerg**. Je peux vous renseigner sur nos 5 piliers de services (Garde d’enfants, Nettoyage domestique & commercial, Aide aux seniors, Garde d’animaux et Conciergerie), nos critères de sélection ou nos offres d’emploi au Luxembourg. Comment puis-je vous aider ?",
      de: "Hallo und herzlich willkommen bei **Nanny & MaisonCare Lëtzebuerg**! Ich informiere Sie gerne über unsere 5 Leistungssäulen (Nanny & Kinderbetreuung, Haushalts- & Gewerbereinigung, Seniorenbetreuung, Tierbetreuung sowie Haushaltshilfe & Concierge), unsere Sicherheitsstandards oder aktuelle Stellenangebote in Luxemburg. Wie kann ich Ihnen helfen?",
    };
    return {
      reply: greetings[lang],
      requiresEscalation: false,
    };
  }

  // 12. Fallback Rule: If the chatbot cannot find a grounded answer on the website, prompt inline for Email + Message to open an Escalated Support Ticket
  const fallbackReplies: Record<Locale, string> = {
    en: "I want to make sure you receive an accurate, personalized answer from our team, and I couldn't find that specific detail in our public website knowledge base. Please share your **Email** and **Message** in the ticket form below—I will immediately open an **Escalated Support Ticket** for our Concierge Desk in Luxembourg.",
    fr: "Afin de vous apporter une réponse précise et personnalisée, cette demande nécessite l’intervention de notre équipe (l’information ne figurant pas dans notre base publique). Veuillez indiquer votre **E-mail** et votre **Message** ci-dessous : j’ouvrirai immédiatement un **Ticket de Support Prioritaire** auprès de notre Conciergerie au Luxembourg.",
    de: "Damit Sie eine genaue und persönliche Auskunft erhalten, möchte ich Ihre Anfrage direkt an unser Team weiterleiten, da dieses spezifische Detail nicht in unserer öffentlichen Wissensdatenbank hinterlegt ist. Bitte tragen Sie unten Ihre **E-Mail-Adresse** und **Nachricht** ein – ich eröffne umgehend ein **Support-Ticket** für unser Concierge-Team in Luxemburg.",
  };

  return {
    reply: fallbackReplies[lang],
    requiresEscalation: true,
  };
}

const MAISONCARE_KNOWLEDGE_BASE = `
COMPANY PROFILE:
- Name: Nanny & MaisonCare Lëtzebuerg (MaisonCare)
- Headquarters Address: 140 Rue de Cessange, Luxembourg
- Official Contact Numbers: +352 691 225 764, +352 691 346 782, +352 691 347 090
- Official Contact Email: Info@nannymaisoncare.lu
- Location & Coverage: Grand Duchy of Luxembourg (serving all 102 communes including Luxembourg-Ville, Kirchberg, Limpertsberg, Belair, Strassen, Bertrange, Mamer, Hesperange, Niederanven, Esch-sur-Alzette, etc.). Cross-border arrangements can be organized upon consultation.
- Identity: Premier private household management, luxury nanny placement, residential housekeeping, pet sitting, senior companionship, and family concierge services.
- Bot Persona: "MaisonCare Customer Service" — warm, polished, courteous, highly resourceful, intelligent, and proactive.

5 CORE SERVICE PILLARS & SUB-SERVICES:
1. Childcare & Nannies:
   - Full-Time Nanny / Gouvernante (comprehensive child development, daily schedule, homework guidance, bilingual enrichment)
   - Part-Time Nanny
   - After-School Care & Pick-up
   - Newborn & Infant Care Specialist (maternity care, night support, feeding & gentle sleep routines)
   - Twins & Multiple-Child Care
   - Holiday & Travel Childcare
   - Call-In / On-Demand Babysitting (evenings, weekends, emergencies)
2. Housekeeping & Cleaning:
   - Luxury Residential Cleaning & Regular Home Maintenance (weekly, bi-weekly, or daily)
   - Deep Cleaning (seasonal refresh, detailed surface restoration)
   - Move-In / Move-Out Turnaround Cleaning
   - Post-Renovation Dust & Debris Cleaning
   - Short-Stay & Executive Rental Turnover
   - Wardrobe, Laundry & Delicate Garment Care
3. Senior Companionship:
   - Non-medical elderly assistance and emotional companionship
   - Accompanying on leisurely walks, cultural outings, appointments, and doctor visits
   - Nutrition assistance, light meal preparation, and hydration checks
   - Medication reminders and gentle mobility support
   - Stimulating conversations, reading, board games, and cognitive engagement
4. Pet Care & Sitting:
   - Daily Dog Walking and energetic exercise
   - In-home Cat Sitting, feeding, litter care, and companionship
   - Care for small animals / exotic pets
   - Overnight Pet Sitting in the client's home
   - Vet visit escorts
5. Executive & Concierge Assistance:
   - Private Family Assistant & administrative household management
   - Errand running, grocery provisioning, gourmet pantry stocking
   - Private Chef & Catering coordination for private dinners
   - Event hosting, party setup, and guest reception
   - Oversight of tradespeople, gardeners, and home maintenance contractors

STAFF VETTING, SAFETY & INTEGRITY:
- 100% rigorous background checks (Extrait de Casier Judiciaire N° 3 & N° 5 / child protection records verified).
- Certified in Pediatric and Adult CPR / First-Aid.
- Verifiable reference checks from previous high-calibre households.
- Comprehensive civil liability insurance and full regulatory compliance with Luxembourg labour and social security laws.

CURRENT OPEN VACANCIES (FOR APPLICANTS):
1. Experienced Nanny / Gouvernante in Luxembourg (Full-time, school runs, homework, active play).
2. Nanny for 3 Young Children (High-energy, creative, structured routine, meal prep).
3. Weekend / Flexible Call-in Nanny (Evenings, weekends, adaptable).
4. Permanent Pillar Nanny for Young Family (Long-term commitment, nurturing, bilingual preferred).
5. Childcare & Family Administrative Assistant (Dual role: childcare + executive calendar management and household errands).
- Applicants can browse and apply directly via the Careers page (/jobs) with their CV.

PRICING & REQUEST INSTRUCTIONS:
- Pricing is tailored to specific household needs (regular weekly contracts, on-demand placements, or full-time live-in arrangements).
- How to request: Clients can simply click "Request a Service" at any time on the website to choose their services, preferred start date, time, duration, frequency (one-off, weekly, bi-weekly, full-time, live-in), and location. We follow up swiftly within 24 hours to confirm arrangements.
`;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`chat:${ip}`, 35, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many chat requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = sanitizeText(body.message, 1200);
    const uiLocale: Locale =
      body.locale === "fr" || body.locale === "de" ? body.locale : "en";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const detectedLanguage = detectLanguage(message, uiLocale);
    const grounded = buildGroundedResponse(message, detectedLanguage);

    let finalReply = grounded.reply;
    let requiresEscalation = grounded.requiresEscalation;

    // Intelligent Gemini LLM deductive reasoning
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.includes("your_")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const targetLangName =
          detectedLanguage === "fr"
            ? "French"
            : detectedLanguage === "de"
            ? "German"
            : "English";

        const promptText = `You are "MaisonCare Customer Service", the luxury AI concierge for "Nanny & MaisonCare Lëtzebuerg" in Luxembourg.

MaisonCare Verified Knowledge:
${MAISONCARE_KNOWLEDGE_BASE}

Grounded Website Reference (if relevant):
${grounded.reply}

User Message: "${message}"
Detected Language: ${targetLangName} (you MUST respond strictly and fluently in ${targetLangName}).

Instructions:
1. DEDUCTIVE REASONING:
   - Understand both direct and indirect or roundabout inquiries.
   - If the user describes a multi-part household scenario (e.g. kids, pets, cleaning, or busy work hours), deduce the ideal combination of our services and explain how MaisonCare crafts a unified solution.
   - If they ask about services we offer, describe them eloquently using our 5 pillars.
   - If they ask about jobs or working with us, explain the open positions and invite them to apply through our Careers page (/jobs).
   - If they ask about safety or qualifications, highlight our 100% background checks (Bulletin N° 3 & N° 5), CPR certification, and insurance.
2. TONE: Warm, courteous, polished, concise, and helpful. Use markdown formatting with bullet points when listing options.
3. CALL TO ACTION: Encourage them to use the "Request a Service" button on the website for immediate scheduling or a personalized quote.
4. ACCURACY: Do not invent unrelated commercial services (e.g. heavy construction, accredited school diplomas).
5. ESCALATION: Only suggest an escalated support ticket if the user explicitly asks to speak directly with a manager, requests a manual phone callback, or submits a dispute/complaint.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generated =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated && generated.trim().length > 10) {
            finalReply = generated.trim();
            // If the LLM successfully resolved and deduced the answer, do not force escalation form
            // unless the user message explicitly requested a callback/manager
            const userLower = message.toLowerCase();
            const wantsHuman =
              userLower.includes("call me") ||
              userLower.includes("speak to a human") ||
              userLower.includes("manager") ||
              userLower.includes("parler à quelqu'un") ||
              userLower.includes("rappel") ||
              userLower.includes("mitarbeiter");
            requiresEscalation = wantsHuman;
          }
        }
      } catch {
        // Graceful fallback to deterministic grounded reply on any network timeout
      }
    }

    return NextResponse.json({
      reply: finalReply,
      detectedLanguage,
      requiresEscalation,
      suggestedCategorySlug: grounded.suggestedCategorySlug || null,
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return NextResponse.json(
      { error: "Failed to process chat message." },
      { status: 500 }
    );
  }
}

