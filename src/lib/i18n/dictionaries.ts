export type Locale = "en" | "fr" | "de";

export interface ServiceTypeItem {
  id: string;
  label: string;
  description: string;
  defaultRecurring?: boolean;
}

export interface EcosystemCategory {
  id: string;
  slug: "nanny" | "cleaning" | "concierge" | "senior" | "pet";
  title: string;
  shortTitle: string;
  description: string;
  extendedIntro?: string;
  image: string;
  pills: string[];
  serviceTypes: ServiceTypeItem[];
}

export interface PillarItem {
  tag: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const HERO_MARQUEE_IMAGES = [
  {
    src: "/images/childcare-garden-play.jpg",
    alt: "Nanny and children outdoor garden ring toss play in Luxembourg",
    heightClass: "h-[260px] md:h-[360px]",
  },
  {
    src: "/images/household-cleaning.jpg",
    alt: "MaisonCare professional household linen and surface care",
    heightClass: "h-[220px] md:h-[300px]",
  },
  {
    src: "/images/household-management-concierge.jpg",
    alt: "Private household management and weekly concierge planning",
    heightClass: "h-[280px] md:h-[390px]",
  },
  {
    src: "/images/home-organization-laundry.jpg",
    alt: "Bespoke laundry organization and domestic upkeep",
    heightClass: "h-[185px] md:h-[250px]",
  },
  {
    src: "/images/nanny-baking-childcare.jpg",
    alt: "Warm early-years childcare and kitchen baking activities",
    heightClass: "h-[260px] md:h-[360px]",
  },
  {
    src: "/images/senior-care-companion.jpg",
    alt: "Compassionate senior accompaniment and gentle garden walks",
    heightClass: "h-[245px] md:h-[330px]",
  },
  {
    src: "/images/family-consultation-nanny.jpg",
    alt: "Professional childcare consultation and family advisory",
    heightClass: "h-[210px] md:h-[285px]",
  },
  {
    src: "/images/grocery-shopping-home-help.jpg",
    alt: "Home help errands and fresh grocery shopping delivery",
    heightClass: "h-[280px] md:h-[390px]",
  },
  {
    src: "/images/childcare-creative-beads.jpg",
    alt: "Dedicated childcare specialist guiding creative play",
    heightClass: "h-[220px] md:h-[300px]",
  },
  {
    src: "/images/childcare-outdoor-balance.jpg",
    alt: "Active outdoor park supervision with MaisonCare nanny",
    heightClass: "h-[245px] md:h-[330px]",
  },
  {
    src: "/images/childcare-toddler-rings.jpg",
    alt: "Warm early-years toddler care at home",
    heightClass: "h-[185px] md:h-[250px]",
  },
  {
    src: "/images/hero-slide-1.jpg",
    alt: "Happy family moments and attentive childcare in Luxembourg",
    heightClass: "h-[260px] md:h-[360px]",
  },
  {
    src: "/images/hero-slide-2.jpg",
    alt: "Detailed household schedules, budgeting, and home management",
    heightClass: "h-[220px] md:h-[300px]",
  },
  {
    src: "/images/hero-slide-3.jpg",
    alt: "Personal concierge assistance, grocery errands, and household care",
    heightClass: "h-[280px] md:h-[390px]",
  },
  {
    src: "/images/hero-slide-4.jpg",
    alt: "Gentle senior companionship, mobility support, and personal assistance",
    heightClass: "h-[245px] md:h-[330px]",
  },
];

export const DICTIONARIES = {
  en: {
    localeName: "EN",
    nav: {
      home: "Home",
      about: "About Us",
      services: "Our Services",
      jobs: "Jobs",
      contact: "Contact Us",
      bookService: "Request a Service",
      exploreJobs: "Explore Open Jobs",
      admin: "Admin",
      languageLabel: "Language",
    },
    home: {
      heroTitleHighlight: "Your Life, Organised.",
      heroTitleRest: "Your Time, Reclaimed.",
      heroSubtitle:
        "Personal assistance, childcare and household support tailored to your lifestyle. Delegate your everyday responsibilities to trusted professionals—so you can reclaim your time for your career, your family, and what matters most.",
      ecosystemBadge: "OUR ECOSYSTEM OF CARE",
      ecosystemTitle: "Everything you need to keep your home and life in balance.",
      ecosystemSubtitle:
        "From professional childcare and meticulous housekeeping to personal concierge assistance and companion care. Delegate your daily tasks to rigorously vetted specialists—so you can reclaim your time for what matters most.",
      ecosystemLearnMore: "Learn more",
      serviceOverview: "Service Overview",
      availableOptionsScope: "Available Options & Scope",
      exploreDedicatedPage: "Explore Dedicated Page",
      requestShort: "Request",
      testimonialsBadge: "TESTIMONIALS",
      testimonialsTitle: "See reviews from our trusted clients.",
      leaveReviewBtn: "Leave a review",
      faqBadge: "FAQs",
      faqTitle: "Frequently Asked Questions",
    },
    about: {
      heroTitle: "ABOUT US",
      heroSubtitlePrefix:
        "Built specifically for Luxembourg’s dynamic, international, and multilingual professional community, ",
      heroSubtitleHighlight: "Nanny & MaisonCare",
      heroSubtitleSuffix:
        " serves as the trusted bridge between discerning households and exceptional domestic professionals.",
      whoWeAreBadge: "ABOUT US",
      whoWeAreTitle: "WHO WE ARE",
      whoWeAreLead:
        "We’re the Grand Duchy’s premier family-staffing and household concierge agency. We understand that managing a demanding corporate schedule, an international lifestyle, or a fast-paced household requires more than just an extra pair of hands—it requires complete peace of mind. Nanny and MaisonCare Lëtzebuerg is not a passive directory or a volume-based placement service. We are a boutique, trust-led intermediary dedicated to understanding the unique cultural, linguistic, and operational DNA of your home.",
      missionTitle: "Mission",
      missionText:
        "To make premium family life easier. We connect Luxembourg households with trusted, professionally screened, and precisely matched childcare and domestic specialists, taking the friction out of household management.",
      visionTitle: "Vision",
      visionText:
        "To stand as Luxembourg’s most trusted household-support brand, universally recognized for absolute discretion, uncompromising safety, and a highly personalized touch.",
      pillarsBadge: "THE PILLARS OF MAISONCARE",
      pillarsTitle: "Anchored by uncompromising standards.",
      pillars: [
        {
          tag: "SAFETY",
          title: "Trust & Safety",
          description:
            "Your family’s well-being is our priority, backed by a strict multi-layered screening framework.",
        },
        {
          tag: "PRIVACY",
          title: "Absolute Discretion",
          description:
            "Utmost confidentiality for both our prominent client families and our high-caliber domestic candidates.",
        },
        {
          tag: "LANGUAGES",
          title: "Multilingual Excellence",
          description:
            "Built for Luxembourg’s international community—matching families with precise linguistic proficiency.",
        },
        {
          tag: "HARMONY",
          title: "Cultural Personalization",
          description:
            "We look past CVs to assess personality, values, and lifestyle preferences, ensuring a harmonious fit within your home.",
        },
        {
          tag: "CONTINUITY",
          title: "End-to-End Reliability",
          description:
            "Our commitment doesn’t end on day one. We provide ongoing relationship management, milestone follow-ups, and replacement support.",
        },
      ] as PillarItem[],
    },
    servicesPage: {
      heroTitle: "OUR SERVICES",
      heroSubtitle:
        "We offer a comprehensive, single point of contact for the modern estate, structured across five specialized pillars.",
      howItWorksBadge: "HOW TO REQUEST A SERVICE",
      howItWorksTitle: "Seamless, tailored arrangements in 4 steps.",
      stepLabel: "STEP",
      steps: [
        {
          step: "01",
          title: "Choose a Category",
          description:
            "Click any of our five main service categories to explore its tailored household, family, or business care options.",
        },
        {
          step: "02",
          title: "Select a Specific Service",
          description:
            "Choose preset service pills or a specific service from the dropdown—or freely describe your bespoke request.",
        },
        {
          step: "03",
          title: "Specify Schedule & Details",
          description:
            "Provide your preferred service date(s), start time, duration in hours, recurring frequency, and location in Luxembourg.",
        },
        {
          step: "04",
          title: "Personal Consultation & Confirmation",
          description:
            "A submitted request is an enquiry. Our team will contact you promptly to confirm availability, pricing, and final arrangements.",
        },
      ],
      trustAndSafety: {
        badge: "YOUR TRUST AND SAFETY, OUR PRIORITY",
        title:
          "We understand the trust involved in welcoming someone into your home or placing your loved ones in their care.",
        subtitle: "That is why we take our selection process seriously.",
        vettingHeader: "Our vetting process includes:",
        items: [
          {
            title: "Identity Verification",
            description: "Confirming candidates’ identities.",
          },
          {
            title: "Qualifications & Experience",
            description:
              "Reviewing relevant qualifications, skills and professional experience.",
          },
          {
            title: "Reference Checks",
            description:
              "Contacting previous employers or referees to assess suitability.",
          },
          {
            title: "Background Checks",
            description:
              "Conducting appropriate criminal-record and other background checks, subject to applicable requirements.",
          },
          {
            title: "Insurance & Compliance",
            description:
              "Maintaining appropriate insurance arrangements and taking applicable legal and regulatory requirements into account.",
          },
        ],
        commitmentFooter:
          "We are committed to professionalism, discretion and responsible service delivery, giving you greater confidence when choosing support for your home and family.",
      },
    },
    dedicatedService: {
      backToServices: "Back to Services",
      requestThisService: "Request this service",
      scopeBadge: "Full Scope & Available Options",
      arrangementsTitle: "Available Arrangements",
      arrangementsSubtitle:
        "Every home and family in Luxembourg operates with unique rhythms. Explore the specific services offered under this pillar.",
      conciergeScopeBadge: "Concierge & Home Help Scope",
      conciergeScopeTitle: "Core Responsibilities You Can Delegate",
      conciergeScopeSubtitle:
        "MaisonCare provides structured lifestyle management and practical domestic support:",
      conciergeScopeItems: [
        "Managing appointments and personal schedules.",
        "Grocery shopping and personal errands.",
        "Coordinating household deliveries.",
        "Organising laundry and other household tasks.",
        "Arranging approved home-maintenance visits.",
        "Coordinating agreed family routines.",
        "Booking travel or other personal arrangements.",
        "Providing practical administrative support.",
      ],
      availableOnRequest: "Available on request",
      requestThis: "Request this",
      trustCards: [
        {
          title: "100% Police & Identity Verified",
          description:
            "Every caregiver and household specialist undergoes criminal record screening (Bulletin N°3) and verified references.",
        },
        {
          title: "Flexible Schedule Matching",
          description:
            "From one-time urgent support to ongoing daily and live-in placements across all Luxembourg communes.",
        },
        {
          title: "Multilingual Proficiency",
          description:
            "Staff matched to the linguistic preferences of your home: English, Français, Deutsch, Lëtzebuergesch.",
        },
      ],
      formSubtitle:
        "Submit your service request below. Our team will contact you to confirm availability, scope, and pricing.",
    },
    jobsPage: {
      heroTitle: "JOBS",
      heroSubtitle: "Apply to relevant available jobs",
      sectionBadge: "JOBS",
      sectionTitle: "Apply to jobs here",
      learnMore: "Learn more",
      competitiveSalary: "Competitive",
      backToJobs: "Back to all jobs",
      aboutFamilyTitle: "About the family",
      whoLookingForTitle: "Who are we looking for?",
      tasksTitle: "What are your tasks?",
      scheduleTitle: "What does your weekly schedule look like?",
      applyForm: {
        name: "Name",
        email: "Email",
        phone: "Phone / WhatsApp",
        whyConsidered: "Why should you be considered for the role?",
        expectedSalary: "Expected salary per month",
        uploadPromptPrefix: "Click here",
        uploadPromptSuffix: " to upload your CV/Cover Letter",
        submitBtn: "Submit Application",
        submitting: "Submitting...",
        successTitle: "Application Received",
        successMessage:
          "Thank you for applying to Nanny & MaisonCare Lëtzebuerg. Our recruitment team has received your CV and will contact you if your profile matches.",
        errorFileType: "Please upload a PDF, DOC, or DOCX file.",
        errorFileSize: "File size must be 5MB or less.",
        errorMissingCv: "Please attach your CV/Cover Letter (.pdf, .doc, or .docx).",
        errorSubmit: "Unable to submit application. Please try again.",
      },
    },
    contactPage: {
      heroTitle: "Contact Us",
      heroSubtitle: "Let us know anything more you want to communicate with us",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Your message",
      submitBtn: "Send us a message",
      sendAnotherBtn: "Send another message",
      writeToUs: "Write to us",
      emailAddress: "info@nannymaisoncare.lu",
      officialNumbersTitle: "Official Contact Numbers",
      phoneNumbers: [
        "+352 691 225 764",
        "+352 691 346 782",
        "+352 691 347 090",
      ],
      addressTitle: "Headquarters",
      address: "140 Rue de Cessange, Luxembourg",
      successMessage:
        "Thank you for your message! Our concierge team will respond within 24 hours.",
    },
    footer: {
      headline: "Let’s be of service to you!",
      subtext: "We want to hear from you.",
      bookBtn: "Request a Service",
      contactBtn: "Contact Us",
      address: "140 Rue de Cessange, Luxembourg",
      phoneNumbers: [
        "+352 691 225 764",
        "+352 691 346 782",
        "+352 691 347 090",
      ],
      email: "info@nannymaisoncare.lu",
      copyright: "© 2026, Nanny & MaisonCare Lëtzebuerg. All rights reserved.",
    },
    bookingModal: {
      title: "Book a Service Enquiry",
      subtitle:
        "Choose a category and select one or more preset services—or type your bespoke requirements below. We will contact you to confirm availability, pricing, and arrangements.",
      nameLabel: "Name",
      namePlaceholder: "e.g. Marie Laurent",
      emailLabel: "Email",
      phoneLabel: "Phone / WhatsApp",
      selectCategory: "Select a category",
      serviceCategoryLabel: "Service Category",
      selectServices: "Select one or more services",
      addedSuffix: "(Added)",
      serviceDate: "Preferred Start Date",
      startTime: "Preferred Start Time",
      durationHours: "Number of Hours (per visit)",
      durationOptions: {
        h1_2: "1–2 hours",
        h3_4: "3–4 hours",
        h5_6: "5–6 hours",
        h7_8: "7–8 hours",
        overnight: "Overnight",
        flexible: "Not sure / To discuss",
      },
      frequency: "Frequency",
      frequencies: {
        once: "One-off / Occasional",
        weekly: "Weekly",
        biweekly: "Multiple times per week",
        fulltime: "Full-Time / Daily",
        livein: "Live-In / Overnight",
      },
      frequencyOptions: {
        once: "Just once / One-time",
        weekly: "Once a week",
        severalWeekly: "Several times a week",
        biweekly: "Every two weeks",
        monthly: "Monthly",
        ongoing: "Ongoing arrangement",
      },
      location: "Service Address / Postcode in Luxembourg",
      locationPlaceholder: "e.g. 140 Rue de Cessange, Luxembourg",
      preferredDaysLabel: "Preferred recurring days of the week",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      cleaningPremisesLabel: "Premises & Property Type",
      cleaningPremisesOptions: {
        home: "Home / Residential (Apartment or House)",
        office: "Office / Workplace",
        commercial: "Commercial Premises / Retail",
        other: "Other",
      },
      cleaningSizeLabel: "Bedrooms / Bathrooms / Approx Size",
      cleaningSizePlaceholder: "e.g. 2 beds, 1 bath, 95 m²",
      nannyArrangementLabel: "Care Arrangement",
      nannyArrangementOptions: {
        liveOut: "Live-out (Leaves after shift)",
        liveIn: "Live-in (Stays in family home)",
        flexible: "Flexible / To discuss",
      },
      nannyChildrenLabel: "Number of Children & Ages",
      nannyChildrenPlaceholder: "e.g. 2 children (1 year and 4 years)",
      petSettingLabel: "Pet Type & Care Setting",
      petSettingOptions: {
        myHome: "Pet Care at My Home",
        sitterHome: "Pet Sitting at Sitter's Home",
        walking: "Dog Walking & Exercise",
        overnight: "Overnight / Holiday Care",
      },
      petDetailsLabel: "Pet Name, Breed & Routine",
      petDetailsPlaceholder: "e.g. Max (Golden Retriever, 3 yrs)",
      seniorCompletingLabel: "Who is completing this form?",
      seniorCompletingOptions: {
        family: "A family member / Representative",
        self: "The person receiving support",
        other: "Other",
      },
      seniorRecipientLabel: "Recipient Name (if different)",
      seniorRecipientPlaceholder: "e.g. Jean Dupont (Father)",
      customNotes: "Tell us what you want from us (or describe a custom request)",
      customNotesPlaceholder:
        "Describe your schedule, priorities, or any custom request...",
      enquiryDisclaimer:
        "Note: Submitting this request sends an enquiry to Nanny & MaisonCare Lëtzebuerg. Arrangements are confirmed after our team contacts you to discuss schedule and pricing.",
      submitBtn: "Submit",
      submitting: "Submitting...",
      submitAnotherBtn: "Submit Another Request",
      errorMissingFields: "Please provide your name and email address.",
      errorSubmit: "Unable to submit your service request. Please try again.",
      successTitle: "Service Enquiry Received",
      successMessage:
        "Thank you! Your request has been logged and dispatched to our concierge desk. We will contact you shortly to confirm availability, schedule, and arrangements.",
    },
    reviewModal: {
      title: "Leave a Client Review",
      subtitle:
        "Share your experience with Nanny & MaisonCare Lëtzebuerg. Reviews are verified by our team before appearing on the website.",
      nameLabel: "Your Full Name",
      namePlaceholder: "e.g. Sophie & Marc Schmit",
      roleLabel: "Household / Location (e.g., Family in Kirchberg)",
      rolePlaceholder: "e.g. Kirchberg, Luxembourg",
      ratingLabel: "Star Rating",
      reviewLabel: "Your Review",
      reviewPlaceholder:
        "Share your experience with our nanny, cleaning, or concierge service...",
      avatarLabel: "Profile Photo (Optional)",
      uploadPhoto: "Upload photo",
      changePhoto: "Change photo",
      removePhoto: "Remove",
      photoAttached: "Custom photo attached.",
      photoHint:
        "Optional. If skipped, your initials are shown as a luxury monogram.",
      submitBtn: "Submit Review for Approval",
      doneBtn: "Done",
      successTitle: "Thank You for Your Review!",
      successMessage:
        "Your review has been submitted with PENDING status and will be published once approved by our administrator.",
    },
    chatbot: {
      launcherLabel: "Chat with MaisonCare Customer Service",
      headerTitle: "MaisonCare Customer Service",
      headerSubtitle: "",
      ticketBtnLabel: "Ticket",
      typingLabel: "MaisonCare AI is typing...",
      submittingLabel: "Submitting...",
      welcomeMessage:
        "Welcome to Nanny & MaisonCare Lëtzebuerg! How can we assist you today with our childcare, household cleaning, senior care, pet care, concierge services, or open job vacancies?",
      inputPlaceholder: "Ask a question in English, Français, or German...",
      sendBtn: "Send",
      escalatePrompt:
        "Would you like to open a priority ticket with our human Concierge Desk?",
      ticketEmailPlaceholder: "Your email address...",
      ticketMessagePlaceholder: "Briefly describe how we can help...",
      ticketSubmitBtn: "Send to Concierge Desk",
      ticketSuccess:
        "Your support ticket has been created and emailed directly to our administrator. We will reply to your email shortly.",
    },
    categories: [
      {
        id: "cat-nanny",
        slug: "nanny",
        title: "MaisonCare Nanny & Childcare",
        shortTitle: "Nanny & Childcare Services",
        description:
          "Professionally screened childcare specialists matched to the linguistic and cultural DNA of your family. Flexible care and supervision tailored to your routine.",
        image: "/images/childcare-creative-beads.jpg",
        pills: [
          "Full-Time & Part-Time",
          "Newborn & Infant Support",
          "After-School Care",
          "Live-In Nannies",
        ],
        serviceTypes: [
          {
            id: "occasional-childcare",
            label: "Occasional Childcare",
            description:
              "Short-term childcare for agreed periods, such as appointments or evening commitments.",
          },
          {
            id: "full-time-nanny",
            label: "Full-Time Nanny",
            description: "Regular childcare based on an agreed full-time schedule.",
            defaultRecurring: true,
          },
          {
            id: "part-time-nanny",
            label: "Part-Time Nanny",
            description: "Childcare on selected days or for selected hours.",
            defaultRecurring: true,
          },
          {
            id: "after-school-care",
            label: "After-School Care",
            description:
              "School pick-ups where requested, snacks, play and supervision during the afternoon and evening routine.",
            defaultRecurring: true,
          },
          {
            id: "newborn-infant-care",
            label: "Newborn & Infant Care",
            description:
              "Everyday care for babies, according to the family's needs and the caregiver's qualifications.",
          },
          {
            id: "twins-multiple-care",
            label: "Twins & Multiple-Child Care",
            description: "Care tailored to twins, triplets or siblings.",
          },
          {
            id: "holiday-childcare",
            label: "Holiday Childcare",
            description: "Childcare during school holidays and breaks.",
          },
          {
            id: "call-in-nanny",
            label: "Call-In / On-Demand Nanny",
            description:
              "Request a nanny when an unexpected need or short-notice commitment arises; subject to availability.",
          },
          {
            id: "live-in-out-nanny",
            label: "Live-In or Live-Out Nanny",
            description:
              "Arrangements according to the family's needs and service availability.",
            defaultRecurring: true,
          },
        ],
      },
      {
        id: "cat-cleaning",
        slug: "cleaning",
        title: "MaisonCare Household & Commercial Cleaning",
        shortTitle: "General Household & Commercial Cleaning",
        description:
          "Dedicated domestic professionals and commercial specialists for private homes, offices, and estates—arranged around your preferred schedule.",
        image: "/images/household-cleaning.jpg",
        pills: [
          "Apartments & Houses",
          "Office & Commercial",
          "Deep & Post-Renovation",
          "Regular Scheduled Care",
        ],
        serviceTypes: [
          {
            id: "apartments-houses",
            label: "Apartments & Houses",
            description: "Regular or one-off cleaning for private homes.",
          },
          {
            id: "office-cleaning",
            label: "Office Cleaning Outside Business Hours",
            description:
              "Cleaning scheduled outside normal working hours to minimise disruption.",
            defaultRecurring: true,
          },
          {
            id: "post-renovation",
            label: "Post-Renovation / After-Works Cleaning",
            description: "Cleaning after renovation, construction or maintenance work.",
          },
          {
            id: "bathrooms-windows-terraces",
            label: "Bathrooms, Windows & Terraces",
            description:
              "Cleaning bathrooms, interior windows, glass surfaces, terraces and balconies, as agreed.",
          },
          {
            id: "commercial-premises",
            label: "Commercial Premises",
            description:
              "Cleaning for shops, retail units, offices and other business spaces.",
            defaultRecurring: true,
          },
          {
            id: "regular-scheduled-cleaning",
            label: "Regular & Scheduled Cleaning",
            description: "Recurring visits at agreed intervals.",
            defaultRecurring: true,
          },
          {
            id: "deep-cleaning",
            label: "Deep Cleaning",
            description: "Detailed cleaning based on the property's needs.",
          },
          {
            id: "move-in-move-out",
            label: "Move-In & Move-Out Cleaning",
            description: "Cleaning before moving into or leaving a property.",
          },
        ],
      },
      {
        id: "cat-concierge",
        slug: "concierge",
        title: "MaisonCare Concierge & Home Help",
        shortTitle: "Home Help & Concierge Services",
        description:
          "High-level personal assistants and practical everyday household help—from meal preparation and laundry to errands and bespoke family logistics.",
        image: "/images/home-organization-laundry.jpg",
        pills: [
          "Personal & Family Assistants",
          "Meal Prep & Errands",
          "Laundry & Home Organisation",
          "Daily Logistics",
        ],
        serviceTypes: [
          {
            id: "appointments-schedules",
            label: "Managing Appointments & Personal Schedules",
            description:
              "Coordinating calendars, private appointments, and professional scheduling commitments.",
          },
          {
            id: "grocery-errands",
            label: "Grocery Shopping & Personal Errands",
            description:
              "Weekly pantry provisioning, grocery shopping, dry cleaning pickups, and daily errand runs.",
          },
          {
            id: "household-deliveries",
            label: "Coordinating Household Deliveries",
            description:
              "Receiving parcels, supervising home drop-offs, and coordinating incoming packages.",
          },
          {
            id: "laundry-household-tasks",
            label: "Organising Laundry & Household Tasks",
            description:
              "Washing, ironing, folding, wardrobe organisation, and light everyday domestic upkeep.",
          },
          {
            id: "home-maintenance-visits",
            label: "Arranging Approved Home-Maintenance Visits",
            description:
              "Scheduling, welcoming, and overseeing approved technicians, contractors, and tradespeople.",
          },
          {
            id: "family-routines",
            label: "Coordinating Agreed Family Routines",
            description:
              "Managing school schedules, extracurricular activities, and harmonising daily family logistics.",
          },
          {
            id: "travel-arrangements",
            label: "Booking Travel & Personal Arrangements",
            description:
              "Managing travel bookings, itineraries, hotel reservations, and personal appointments.",
          },
          {
            id: "administrative-support",
            label: "Providing Practical Administrative Support",
            description:
              "Mail sorting, household paperwork, bill management, and day-to-day administrative assistance.",
          },
        ],
      },
      {
        id: "cat-senior",
        slug: "senior",
        title: "MaisonCare Senior Care & Home Assistance",
        shortTitle: "Senior Care & Home Assistance",
        description:
          "Practical, dignified non-medical support for older adults—helping them maintain comfort, safety, and independence at home and in the community.",
        image: "/images/childcare-toddler-rings.jpg",
        pills: [
          "Domestic Help & Tidying",
          "Personal Hygiene Support",
          "Meal Preparation",
          "Mobility & Accompaniment",
        ],
        serviceTypes: [
          {
            id: "senior-domestic-help",
            label: "Domestic Help",
            description:
              "Light household cleaning, laundry, ironing, tidying and home organisation.",
          },
          {
            id: "senior-personal-care",
            label: "Personal Care & Hygiene",
            description:
              "Assistance with washing, bathing, dressing, undressing, toileting and everyday personal hygiene.",
          },
          {
            id: "senior-meal-prep",
            label: "Meal Preparation",
            description:
              "Preparing meals according to agreed preferences and dietary needs.",
          },
          {
            id: "senior-shopping-assistance",
            label: "Shopping Assistance",
            description:
              "Accompanying clients to shops or completing grocery and essential shopping on their behalf.",
          },
          {
            id: "senior-mobility-accompaniment",
            label: "Mobility & Accompaniment",
            description:
              "Support with moving around the home, walks, appointments, errands and everyday outings.",
          },
        ],
      },
      {
        id: "cat-pet",
        slug: "pet",
        title: "MaisonCare Pet Care & Pet Sitting",
        shortTitle: "Pet Care & Pet Sitting",
        description:
          "Personalised care for dogs, cats, and small domestic pets during work, trips, or holidays—arranged in the comfort of your home or at the sitter’s home.",
        extendedIntro:
          "Does your cat feel safest at home, or does your dog become anxious in unfamiliar surroundings? Choose a care option that suits your pet's routine and temperament. A meet-and-greet before care begins is encouraged.",
        image: "/images/childcare-outdoor-balance.jpg",
        pills: [
          "Pet Care at Your Home",
          "Pet Care at Sitter's Home",
          "Dog Walking & Exercise",
          "Holiday & Overnight Sitting",
        ],
        serviceTypes: [
          {
            id: "pet-home-visits",
            label: "Pet Care at Your Home (Visits, Feeding & Play)",
            description:
              "Feeding, fresh water, cat litter-box cleaning, puppy care, and visits while you are at work or away.",
          },
          {
            id: "pet-dog-walking",
            label: "Dog Walking & Exercise",
            description:
              "Dedicated outdoor walks, exercise, and companionship following your pet's routine.",
          },
          {
            id: "pet-sitter-daytime",
            label: "Daytime Pet Care (at Sitter's Home)",
            description:
              "Full daytime supervision, feeding, playtime, and walks at the pet sitter's home.",
          },
          {
            id: "pet-overnight-holiday",
            label: "Overnight Stays & Holiday Pet Sitting",
            description:
              "Extended overnight or holiday care tailored to dogs, cats, rabbits, and small domestic pets.",
          },
        ],
      },
    ] as EcosystemCategory[],
    faqs: [
      {
        id: "faq-1",
        question: "What are the services you render?",
        answer:
          "We provide five comprehensive pillars of care across Luxembourg: (1) Nanny & Childcare Services (occasional, full-time, part-time, after-school, newborn, twins, holiday, and on-demand care), (2) General Household & Commercial Cleaning, (3) Concierge & Home Help Services (meal prep, errands, laundry, organisation), (4) Senior Care & Home Assistance, and (5) Pet Care & Pet Sitting.",
      },
      {
        id: "faq-2",
        question: "How does requesting a service work, and is a request immediately confirmed?",
        answer:
          "Simply click 'Request a Service' or select any of our 5 service category cards. Choose a specific service type from the list (or write your custom requirements), then fill in your preferred date(s), start time, number of hours, frequency, and location. Submitting a request sends an enquiry to our team—we will contact you promptly to discuss your requirements and confirm availability, pricing, and arrangements.",
      },
      {
        id: "faq-3",
        question: "How do you screen and vet your nannies and household professionals?",
        answer:
          "Every candidate undergoes our multi-layered screening framework: identity and residency verification, clean criminal record checks (Extrait de casier judiciaire), verified reference checks from prior family or commercial placements, and in-depth assessments of linguistic proficiency (English, French, German, Luxembourgish) and cultural fit.",
      },
      {
        id: "faq-4",
        question: "Can I request a custom schedule, short-notice nanny, or after-hours office cleaning?",
        answer:
          "Yes. Whether you need an on-demand call-in nanny for an unexpected commitment, office cleaning outside business hours to minimize disruption, post-renovation deep cleaning, or a bespoke combination of household tasks, you can select multiple services or describe your exact needs in our booking form.",
      },
    ] as FaqItem[],
  },

  fr: {
    localeName: "FR",
    nav: {
      home: "Accueil",
      about: "À propos",
      services: "Nos Services",
      jobs: "Emplois",
      contact: "Contact",
      bookService: "Demander un Service",
      exploreJobs: "Voir les offres d’emploi",
      admin: "Admin",
      languageLabel: "Langue",
    },
    home: {
      heroTitleHighlight: "Votre Vie, Organisée.",
      heroTitleRest: "Votre Temps, Retrouvé.",
      heroSubtitle:
        "Assistance personnelle, garde d’enfants et intendance sur mesure adaptées à votre mode de vie. Déléguez vos obligations quotidiennes à des spécialistes de confiance pour vous consacrer à votre carrière, votre famille et vos priorités.",
      ecosystemBadge: "NOTRE ÉCOSYSTÈME DE SOINS",
      ecosystemTitle: "Tout ce dont vous avez besoin pour un quotidien serein et équilibré.",
      ecosystemSubtitle:
        "Garde d'enfants professionnelle, entretien soigné du foyer, conciergerie privée et accompagnement attentionné. Déléguez vos tâches quotidiennes à des spécialistes de confiance et retrouvez du temps pour l'essentiel.",
      ecosystemLearnMore: "En savoir plus",
      serviceOverview: "Aperçu du Service",
      availableOptionsScope: "Options & Prestations Disponibles",
      exploreDedicatedPage: "Voir la page dédiée",
      requestShort: "Demander",
      testimonialsBadge: "TÉMOIGNAGES",
      testimonialsTitle: "Découvrez les avis de nos clients de confiance.",
      leaveReviewBtn: "Laisser un avis",
      faqBadge: "FAQs",
      faqTitle: "Questions Fréquemment Posées",
    },
    about: {
      heroTitle: "À PROPOS DE NOUS",
      heroSubtitlePrefix:
        "Conçu spécialement pour la communauté professionnelle, internationale et multilingue du Luxembourg, ",
      heroSubtitleHighlight: "Nanny & MaisonCare",
      heroSubtitleSuffix:
        " est le pont de confiance entre les familles exigeantes et des professionnels domestiques d’exception.",
      whoWeAreBadge: "À PROPOS",
      whoWeAreTitle: "QUI SOMMES-NOUS",
      whoWeAreLead:
        "Nous sommes la première agence de placement familial et de conciergerie domestique du Grand-Duché. Gérer un emploi du temps exigeant et une vie familiale internationale nécessite bien plus qu’une simple aide : cela exige une tranquillité d’esprit absolue. Nanny and MaisonCare Lëtzebuerg comprend l’ADN culturel, linguistique et opérationnel unique de votre foyer.",
      missionTitle: "Mission",
      missionText:
        "Faciliter la vie de famille au quotidien. Nous mettons en relation les ménages luxembourgeois avec des spécialistes de la garde d’enfants et de l’entretien rigoureusement sélectionnés.",
      visionTitle: "Vision",
      visionText:
        "Être la référence de confiance au Luxembourg pour le soutien à domicile, reconnue pour sa discrétion absolue, sa sécurité sans compromis et son approche personnalisée.",
      pillarsBadge: "LES PILIERS DE MAISONCARE",
      pillarsTitle: "Ancrés dans des standards sans compromis.",
      pillars: [
        {
          tag: "SÉCURITÉ",
          title: "Confiance & Sécurité",
          description:
            "Le bien-être de votre famille est notre priorité, soutenu par un processus de sélection strict à plusieurs niveaux.",
        },
        {
          tag: "CONFIDENTIALITÉ",
          title: "Discrétion Absolue",
          description:
            "Une confidentialité totale tant pour nos familles clientes que pour nos candidats domestiques de haut niveau.",
        },
        {
          tag: "LANGUES",
          title: "Excellence Multilingue",
          description:
            "Conçu pour la communauté internationale du Luxembourg — avec une maîtrise linguistique adaptée à votre foyer.",
        },
        {
          tag: "HARMONIE",
          title: "Personnalisation Culturelle",
          description:
            "Au-delà du CV, nous évaluons la personnalité, les valeurs et le mode de vie pour garantir une harmonie parfaite.",
        },
        {
          tag: "CONTINUITÉ",
          title: "Fiabilité de Bout en Bout",
          description:
            "Notre engagement continue après le premier jour : suivi régulier, gestion de la relation et remplacement si nécessaire.",
        },
      ] as PillarItem[],
    },
    servicesPage: {
      heroTitle: "NOS SERVICES",
      heroSubtitle:
        "Un point de contact complet et unique pour votre résidence ou entreprise, structuré autour de cinq piliers spécialisés.",
      howItWorksBadge: "COMMENT FAIRE UNE DEMANDE",
      howItWorksTitle: "Une organisation fluide et sur mesure en 4 étapes.",
      stepLabel: "ÉTAPE",
      steps: [
        {
          step: "01",
          title: "Choisir une Catégorie",
          description:
            "Cliquez sur l’une de nos cinq catégories principales pour découvrir les prestations adaptées à votre foyer ou entreprise.",
        },
        {
          step: "02",
          title: "Sélectionner un Service Précis",
          description:
            "Choisissez un ou plusieurs services dans la liste déroulante ou décrivez librement votre demande personnalisée.",
        },
        {
          step: "03",
          title: "Indiquer Horaires & Détails",
          description:
            "Précisez les dates souhaitées, l’heure de début, le nombre d’heures, la fréquence et votre commune au Luxembourg.",
        },
        {
          step: "04",
          title: "Consultation & Confirmation",
          description:
            "Une demande envoyée constitue une prise de contact. Nous vous recontactons rapidement pour confirmer disponibilités et tarifs.",
        },
      ],
      trustAndSafety: {
        badge: "VOTRE CONFIANCE ET VOTRE SÉCURITÉ, NOTRE PRIORITÉ",
        title:
          "Nous comprenons la confiance qu’implique le fait d’accueillir quelqu’un chez vous ou de lui confier vos proches.",
        subtitle:
          "C’est pourquoi nous prenons notre processus de sélection très au sérieux.",
        vettingHeader: "Notre processus de vérification comprend :",
        items: [
          {
            title: "Vérification d’Identité",
            description: "Confirmation rigoureuse de l’identité des candidats.",
          },
          {
            title: "Qualifications & Expérience",
            description:
              "Examen des diplômes, compétences et expériences professionnelles pertinentes.",
          },
          {
            title: "Contrôle des Références",
            description:
              "Prise de contact avec les anciens employeurs ou référents pour évaluer l’aptitude.",
          },
          {
            title: "Vérification des Antécédents",
            description:
              "Contrôle du casier judiciaire et autres vérifications d’antécédents, conformément aux exigences applicables.",
          },
          {
            title: "Assurance & Conformité",
            description:
              "Maintien de couvertures d’assurance appropriées et respect des exigences légales et réglementaires applicables.",
          },
        ],
        commitmentFooter:
          "Nous nous engageons à faire preuve de professionnalisme, de discrétion et de responsabilité dans chacune de nos prestations, afin de vous offrir une sérénité totale lorsque vous choisissez un accompagnement pour votre foyer et votre famille.",
      },
    },
    dedicatedService: {
      backToServices: "Retour aux services",
      requestThisService: "Demander ce service",
      scopeBadge: "Périmètre Complet & Options Disponibles",
      arrangementsTitle: "Formules Disponibles",
      arrangementsSubtitle:
        "Chaque foyer et chaque famille au Luxembourg fonctionne selon son propre rythme. Découvrez les prestations spécifiques proposées dans ce domaine.",
      conciergeScopeBadge: "Périmètre Conciergerie & Aide à Domicile",
      conciergeScopeTitle: "Responsabilités Clés que Vous Pouvez Déléguer",
      conciergeScopeSubtitle:
        "MaisonCare assure une gestion structurée de votre quotidien et un soutien domestique pratique :",
      conciergeScopeItems: [
        "Gestion des rendez-vous et des agendas personnels.",
        "Courses alimentaires et commissions personnelles.",
        "Coordination des livraisons à domicile.",
        "Organisation du linge et des autres tâches ménagères.",
        "Planification des visites d’entretien et de maintenance approuvées.",
        "Coordination des routines familiales convenues.",
        "Réservation de voyages ou d’autres arrangements personnels.",
        "Assistance administrative pratique au quotidien.",
      ],
      availableOnRequest: "Disponible sur demande",
      requestThis: "Demander",
      trustCards: [
        {
          title: "Identité & Casier 100 % Vérifiés",
          description:
            "Chaque intervenant fait l’objet d’une vérification du casier judiciaire (Bulletin N°3) et d’un contrôle approfondi des références.",
        },
        {
          title: "Horaires Flexibles sur Mesure",
          description:
            "D’une aide ponctuelle urgente à un accompagnement quotidien ou à demeure dans toutes les communes du Luxembourg.",
        },
        {
          title: "Compétences Multilingues",
          description:
            "Personnel adapté aux préférences linguistiques de votre foyer : Français, English, Deutsch, Lëtzebuergesch.",
        },
      ],
      formSubtitle:
        "Envoyez votre demande de service ci-dessous. Notre équipe vous contactera pour confirmer la disponibilité, le périmètre et les tarifs.",
    },
    jobsPage: {
      heroTitle: "EMPLOIS",
      heroSubtitle: "Postulez aux offres d’emploi disponibles",
      sectionBadge: "EMPLOIS",
      sectionTitle: "Postulez aux offres ici",
      learnMore: "En savoir plus",
      competitiveSalary: "Compétitif",
      backToJobs: "Retour aux offres",
      aboutFamilyTitle: "À propos de la famille",
      whoLookingForTitle: "Qui recherchons-nous ?",
      tasksTitle: "Quelles sont vos tâches ?",
      scheduleTitle: "Quel est votre horaire hebdomadaire ?",
      applyForm: {
        name: "Nom complet",
        email: "Email",
        phone: "Téléphone / WhatsApp",
        whyConsidered: "Pourquoi devrions-nous retenir votre candidature ?",
        expectedSalary: "Salaire mensuel souhaité (€)",
        uploadPromptPrefix: "Cliquez ici",
        uploadPromptSuffix: " pour téléverser votre CV / Lettre de motivation",
        submitBtn: "Envoyer la candidature",
        submitting: "Envoi en cours...",
        successTitle: "Candidature Reçue",
        successMessage:
          "Merci d’avoir postulé chez Nanny & MaisonCare Lëtzebuerg. Notre équipe a bien reçu votre CV et vous contactera prochainement.",
        errorFileType: "Veuillez téléverser un fichier PDF, DOC ou DOCX.",
        errorFileSize: "La taille du fichier ne doit pas dépasser 5 Mo.",
        errorMissingCv:
          "Veuillez joindre votre CV / Lettre de motivation (.pdf, .doc ou .docx).",
        errorSubmit:
          "Impossible d’envoyer la candidature. Veuillez réessayer.",
      },
    },
    contactPage: {
      heroTitle: "Contactez-nous",
      heroSubtitle: "Faites-nous part de toute question ou demande particulière",
      nameLabel: "Nom",
      emailLabel: "Email",
      messageLabel: "Votre message",
      submitBtn: "Envoyer le message",
      sendAnotherBtn: "Envoyer un autre message",
      writeToUs: "Écrivez-nous",
      emailAddress: "info@nannymaisoncare.lu",
      officialNumbersTitle: "Numéros de Contact Officiels",
      phoneNumbers: [
        "+352 691 225 764",
        "+352 691 346 782",
        "+352 691 347 090",
      ],
      addressTitle: "Siège Social",
      address: "140 Rue de Cessange, Luxembourg",
      successMessage:
        "Merci pour votre message ! Notre équipe vous répondra sous 24 heures.",
    },
    footer: {
      headline: "Soyons à votre service !",
      subtext: "Nous sommes à votre écoute.",
      bookBtn: "Demander un Service",
      contactBtn: "Contactez-nous",
      address: "140 Rue de Cessange, Luxembourg",
      phoneNumbers: [
        "+352 691 225 764",
        "+352 691 346 782",
        "+352 691 347 090",
      ],
      email: "info@nannymaisoncare.lu",
      copyright: "© 2026, Nanny & MaisonCare Lëtzebuerg. Tous droits réservés.",
    },
    bookingModal: {
      title: "Demande de Service",
      subtitle:
        "Choisissez une catégorie et sélectionnez un ou plusieurs services — ou décrivez votre besoin sur mesure. Nous vous contacterons pour confirmer les disponibilités et tarifs.",
      nameLabel: "Nom complet",
      namePlaceholder: "ex. Marie Laurent",
      emailLabel: "Email",
      phoneLabel: "Téléphone / WhatsApp",
      selectCategory: "Sélectionnez une catégorie",
      serviceCategoryLabel: "Catégorie de service",
      selectServices: "Sélectionnez un ou plusieurs services",
      addedSuffix: "(Ajouté)",
      serviceDate: "Date de début souhaitée",
      startTime: "Heure de début",
      durationHours: "Nombre d’heures (par visite)",
      durationOptions: {
        h1_2: "1 à 2 heures",
        h3_4: "3 à 4 heures",
        h5_6: "5 à 6 heures",
        h7_8: "7 à 8 heures",
        overnight: "Nuit complète",
        flexible: "À discuter / Flexible",
      },
      frequency: "Fréquence",
      frequencies: {
        once: "Ponctuel / Occasionnel",
        weekly: "Hebdomadaire",
        biweekly: "Plusieurs fois par semaine",
        fulltime: "Temps plein / Quotidien",
        livein: "À demeure / Nuit",
      },
      frequencyOptions: {
        once: "Une seule fois / Ponctuel",
        weekly: "Une fois par semaine",
        severalWeekly: "Plusieurs fois par semaine",
        biweekly: "Toutes les deux semaines",
        monthly: "Mensuel",
        ongoing: "Accompagnement régulier continu",
      },
      location: "Adresse de prestation / Code postal au Luxembourg",
      locationPlaceholder: "ex. 140 Rue de Cessange, Luxembourg",
      preferredDaysLabel: "Jours souhaités dans la semaine",
      weekdays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      cleaningPremisesLabel: "Type de locaux & propriété",
      cleaningPremisesOptions: {
        home: "Domicile / Résidentiel (Appartement ou Maison)",
        office: "Bureau / Espace de travail",
        commercial: "Locaux commerciaux / Boutique",
        other: "Autre",
      },
      cleaningSizeLabel: "Chambres / Salles de bain / Surface approx.",
      cleaningSizePlaceholder: "ex. 2 chambres, 1 sdb, 95 m²",
      nannyArrangementLabel: "Formule de garde",
      nannyArrangementOptions: {
        liveOut: "Externe (rentre après son service)",
        liveIn: "À demeure (logée au domicile familial)",
        flexible: "Flexible / À discuter",
      },
      nannyChildrenLabel: "Nombre d’enfants & âges",
      nannyChildrenPlaceholder: "ex. 2 enfants (1 an et 4 ans)",
      petSettingLabel: "Type d’animal & lieu de garde",
      petSettingOptions: {
        myHome: "Garde à mon domicile",
        sitterHome: "Garde au domicile du pet-sitter",
        walking: "Promenade & exercice",
        overnight: "Garde de nuit / Vacances",
      },
      petDetailsLabel: "Nom, race & habitudes de l’animal",
      petDetailsPlaceholder: "ex. Max (Golden Retriever, 3 ans)",
      seniorCompletingLabel: "Qui remplit ce formulaire ?",
      seniorCompletingOptions: {
        family: "Un membre de la famille / Représentant",
        self: "La personne bénéficiaire",
        other: "Autre",
      },
      seniorRecipientLabel: "Nom du bénéficiaire (si différent)",
      seniorRecipientPlaceholder: "ex. Jean Dupont (Père)",
      customNotes: "Dites-nous ce que vous souhaitez (détails ou demande sur mesure)",
      customNotesPlaceholder:
        "Décrivez vos horaires, priorités ou toute demande particulière...",
      enquiryDisclaimer:
        "Note : L’envoi de ce formulaire constitue une demande de renseignements. La prestation est confirmée uniquement après validation par notre équipe.",
      submitBtn: "Envoyer la demande",
      submitting: "Envoi en cours...",
      submitAnotherBtn: "Envoyer une nouvelle demande",
      errorMissingFields: "Veuillez renseigner votre nom et votre adresse email.",
      errorSubmit:
        "Impossible d’envoyer votre demande. Veuillez réessayer.",
      successTitle: "Demande Enregistrée",
      successMessage:
        "Merci ! Votre demande a été transmise à notre conciergerie. Nous vous contacterons très prochainement pour confirmer les disponibilités et modalités.",
    },
    reviewModal: {
      title: "Laisser un Avis Client",
      subtitle:
        "Partagez votre expérience avec Nanny & MaisonCare Lëtzebuerg. Les avis sont vérifiés par notre administration avant publication.",
      nameLabel: "Votre Nom",
      namePlaceholder: "ex. Sophie & Marc Schmit",
      roleLabel: "Foyer / Commune (ex. Famille à Kirchberg)",
      rolePlaceholder: "ex. Kirchberg, Luxembourg",
      ratingLabel: "Note en étoiles",
      reviewLabel: "Votre Avis",
      reviewPlaceholder:
        "Partagez votre expérience avec notre service de garde d’enfants, ménage ou conciergerie...",
      avatarLabel: "Photo de profil (Optionnel)",
      uploadPhoto: "Téléverser une photo",
      changePhoto: "Changer la photo",
      removePhoto: "Supprimer",
      photoAttached: "Photo personnalisée jointe.",
      photoHint:
        "Optionnel. Sans photo, vos initiales s’affichent en monogramme.",
      submitBtn: "Soumettre l’avis pour validation",
      doneBtn: "Terminé",
      successTitle: "Merci pour votre avis !",
      successMessage:
        "Votre avis a été enregistré avec le statut EN ATTENTE et sera publié dès son approbation par notre administrateur.",
    },
    chatbot: {
      launcherLabel: "Discuter avec le Service Client MaisonCare",
      headerTitle: "Service Client MaisonCare",
      headerSubtitle: "",
      ticketBtnLabel: "Ticket",
      typingLabel: "MaisonCare IA écrit...",
      submittingLabel: "Envoi en cours...",
      welcomeMessage:
        "Bienvenue chez Nanny & MaisonCare Lëtzebuerg ! Comment pouvons-nous vous aider aujourd'hui concernant nos services de garde d'enfants, nettoyage, aide aux seniors, garde d'animaux, conciergerie ou nos offres d'emploi ?",
      inputPlaceholder: "Posez votre question en Français, English ou German...",
      sendBtn: "Envoyer",
      escalatePrompt:
        "Souhaitez-vous ouvrir un ticket prioritaire auprès de notre équipe ?",
      ticketEmailPlaceholder: "Votre adresse email...",
      ticketMessagePlaceholder: "Décrivez brièvement votre demande...",
      ticketSubmitBtn: "Envoyer à la Conciergerie",
      ticketSuccess:
        "Votre ticket a été créé et envoyé directement à notre administrateur. Nous vous répondrons par email très rapidement.",
    },
    categories: [
      {
        id: "cat-nanny",
        slug: "nanny",
        title: "MaisonCare Nounou & Garde d’Enfants",
        shortTitle: "Services de Nounou & Garde d’Enfants",
        description:
          "Spécialistes de la garde d’enfants rigoureusement sélectionnés, adaptés au rythme, aux langues et aux besoins de chaque famille.",
        image: "/images/childcare-creative-beads.jpg",
        pills: [
          "Temps Plein & Partiel",
          "Nourrissons & Bébés",
          "Sortie d’École",
          "Nounou à Demeure",
        ],
        serviceTypes: [
          {
            id: "occasional-childcare",
            label: "Garde Ponctuelle / Occasionnelle",
            description:
              "Garde d’enfants de courte durée pour des rendez-vous ou engagements en soirée.",
          },
          {
            id: "full-time-nanny",
            label: "Nounou à Temps Plein",
            description: "Garde régulière selon un horaire complet convenu.",
            defaultRecurring: true,
          },
          {
            id: "part-time-nanny",
            label: "Nounou à Temps Partiel",
            description: "Garde certains jours ou pour un nombre d’heures défini.",
            defaultRecurring: true,
          },
          {
            id: "after-school-care",
            label: "Garde Périscolaire / Sortie d’École",
            description:
              "Trajets scolaires sur demande, goûter, jeux et supervision l’après-midi et en soirée.",
            defaultRecurring: true,
          },
          {
            id: "newborn-infant-care",
            label: "Soins aux Nouveau-nés & Nourrissons",
            description:
              "Soins quotidiens pour bébés selon les besoins de la famille et les qualifications de l’intervenant(e).",
          },
          {
            id: "twins-multiple-care",
            label: "Jumeaux & Enfants Multiples",
            description: "Garde adaptée aux jumeaux, triplés ou fratries.",
          },
          {
            id: "holiday-childcare",
            label: "Garde pendant les Vacances Scolaires",
            description: "Accompagnement et supervision durant les congés scolaires.",
          },
          {
            id: "call-in-nanny",
            label: "Nounou sur Appel / Urgence",
            description:
              "Demande de nounou pour un besoin imprévu ou à court terme, selon disponibilité.",
          },
          {
            id: "live-in-out-nanny",
            label: "Nounou Logée (Live-In) ou Externe (Live-Out)",
            description:
              "Formules adaptées aux besoins de la famille et aux disponibilités.",
            defaultRecurring: true,
          },
        ],
      },
      {
        id: "cat-cleaning",
        slug: "cleaning",
        title: "MaisonCare Nettoyage Domestique & Commercial",
        shortTitle: "Nettoyage Domestique & Commercial",
        description:
          "Services de nettoyage professionnel pour résidences privées, bureaux et locaux commerciaux, planifiés selon vos exigences.",
        image: "/images/household-cleaning.jpg",
        pills: [
          "Appartements & Maisons",
          "Bureaux Hors Horaires",
          "Après-Travaux & Grand Ménage",
          "Entretien Régulier",
        ],
        serviceTypes: [
          {
            id: "apartments-houses",
            label: "Appartements & Maisons",
            description: "Nettoyage régulier ou ponctuel pour résidences privées.",
          },
          {
            id: "office-cleaning",
            label: "Nettoyage de Bureaux Hors Heures d’Ouverture",
            description:
              "Interventions planifiées en dehors des heures de bureau pour éviter toute perturbation.",
            defaultRecurring: true,
          },
          {
            id: "post-renovation",
            label: "Nettoyage Après Rénovation / Fin de Chantier",
            description: "Remise en état après travaux, rénovation ou maintenance.",
          },
          {
            id: "bathrooms-windows-terraces",
            label: "Salles de Bain, Vitres & Terrasses",
            description:
              "Nettoyage des sanitaires, vitres intérieures, surfaces vitrées, terrasses et balcons.",
          },
          {
            id: "commercial-premises",
            label: "Locaux Commerciaux & Boutiques",
            description: "Entretien pour commerces, bureaux et espaces professionnels.",
            defaultRecurring: true,
          },
          {
            id: "regular-scheduled-cleaning",
            label: "Nettoyage Régulier & Planifié",
            description: "Visites récurrentes à intervalles convenus.",
            defaultRecurring: true,
          },
          {
            id: "deep-cleaning",
            label: "Grand Nettoyage en Profondeur",
            description: "Nettoyage complet et détaillé selon l’état du bien.",
          },
          {
            id: "move-in-move-out",
            label: "Nettoyage d’Emménagement / Déménagement",
            description: "Remise au propre avant l’entrée ou la sortie d’un logement.",
          },
        ],
      },
      {
        id: "cat-concierge",
        slug: "concierge",
        title: "MaisonCare Conciergerie & Aide Ménagère",
        shortTitle: "Aide à Domicile & Conciergerie",
        description:
          "Assistance pratique aux tâches quotidiennes et conciergerie privée : préparation des repas, courses, linge, rangement et logistique familiale.",
        image: "/images/home-organization-laundry.jpg",
        pills: [
          "Assistants Personnels",
          "Repas & Courses",
          "Linge, Repassage & Rangement",
          "Logistique Quotidienne",
        ],
        serviceTypes: [
          {
            id: "appointments-schedules",
            label: "Gestion des Rendez-vous & Agendas Personnels",
            description:
              "Coordination des plannings familiaux, rendez-vous personnels et professionnels.",
          },
          {
            id: "grocery-errands",
            label: "Courses Alimentaires & Courses Personnelles",
            description:
              "Approvisionnement du foyer, courses d’épicerie, pressing et commissions quotidiennes.",
          },
          {
            id: "household-deliveries",
            label: "Coordination des Livraisons à Domicile",
            description:
              "Réception des colis, gestion des livraisons et accueil des livreurs à votre résidence.",
          },
          {
            id: "laundry-household-tasks",
            label: "Entretien du Linge & Tâches Domestiques",
            description:
              "Lessive, repassage, pliage, organisation du dressing et entretien courant du foyer.",
          },
          {
            id: "home-maintenance-visits",
            label: "Organisation des Visites de Maintenance Agréées",
            description:
              "Planification et supervision des artisans, techniciens et interventions approuvées.",
          },
          {
            id: "family-routines",
            label: "Coordination des Routines Familiales Convenues",
            description:
              "Gestion des emplois du temps des enfants, activités extrascolaires et logistique quotidienne.",
          },
          {
            id: "travel-arrangements",
            label: "Réservation de Voyages & Déplacements",
            description:
              "Réservations de transport, hôtels, itinéraires et démarches de voyage personnalisées.",
          },
          {
            id: "administrative-support",
            label: "Soutien Administratif Pratique",
            description:
              "Tri du courrier, gestion des documents ménagers, factures et aide administrative pratique.",
          },
        ],
      },
      {
        id: "cat-senior",
        slug: "senior",
        title: "MaisonCare Aide aux Seniors & Maintien à Domicile",
        shortTitle: "Aide aux Seniors & Assistance à Domicile",
        description:
          "Soutien pratique et bienveillant pour les personnes âgées afin de préserver leur confort, leur dignité et leur autonomie à domicile.",
        image: "/images/childcare-toddler-rings.jpg",
        pills: [
          "Aide Ménagère Douce",
          "Hygiène & Soins Personnels",
          "Préparation des Repas",
          "Mobilité & Sorties",
        ],
        serviceTypes: [
          {
            id: "senior-domestic-help",
            label: "Aide Ménagère",
            description:
              "Ménage léger, lessive, repassage, rangement et organisation du domicile.",
          },
          {
            id: "senior-personal-care",
            label: "Soins Personnels & Hygiène",
            description:
              "Aide à la toilette, à l’habillage et à l’hygiène quotidienne selon la réglementation applicable.",
          },
          {
            id: "senior-meal-prep",
            label: "Préparation des Repas",
            description:
              "Préparation de repas équilibrés selon les goûts et régimes alimentaires.",
          },
          {
            id: "senior-shopping-assistance",
            label: "Assistance aux Courses",
            description:
              "Accompagnement dans les commerces ou réalisation des courses essentielles.",
          },
          {
            id: "senior-mobility-accompaniment",
            label: "Mobilité & Accompagnement",
            description:
              "Aide aux déplacements à domicile, promenades, rendez-vous et sorties quotidiennes.",
          },
        ],
      },
      {
        id: "cat-pet",
        slug: "pet",
        title: "MaisonCare Garde d’Animaux & Pet Sitting",
        shortTitle: "Garde d’Animaux & Pet Sitting",
        description:
          "Soins personnalisés pour vos animaux (chiens, chats et petits animaux) pendant votre travail ou vos vacances — chez vous ou chez le pet-sitter.",
        extendedIntro:
          "Votre chat se sent-il plus en sécurité chez vous, ou votre chien est-il anxieux dans un lieu inconnu ? Choisissez la formule adaptée à son tempérament. Une rencontre préalable est encouragée.",
        image: "/images/childcare-outdoor-balance.jpg",
        pills: [
          "À Votre Domicile",
          "Chez le Pet-Sitter",
          "Promenades & Exercice",
          "Séjours Nuit & Vacances",
        ],
        serviceTypes: [
          {
            id: "pet-home-visits",
            label: "Soins à Votre Domicile (Visites, Repas & Jeux)",
            description:
              "Nourriture, eau fraîche, litière pour chat, soins aux chiots et visites pendant votre absence.",
          },
          {
            id: "pet-dog-walking",
            label: "Promenades de Chiens & Exercice",
            description:
              "Sorties régulières, dépenses physiques et compagnie selon la routine de votre animal.",
          },
          {
            id: "pet-sitter-daytime",
            label: "Garde de Jour (Chez le Pet-Sitter)",
            description:
              "Garde en journée, repas, jeux et promenades au domicile du pet-sitter.",
          },
          {
            id: "pet-overnight-holiday",
            label: "Garde de Nuit & Vacances",
            description:
              "Séjours prolongés pour chiens, chats, lapins et petits animaux domestiques.",
          },
        ],
      },
    ] as EcosystemCategory[],
    faqs: [
      {
        id: "faq-1",
        question: "Quels sont les services que vous proposez ?",
        answer:
          "Nous proposons cinq grands piliers de services au Luxembourg : (1) Garde d’enfants et Nounous (ponctuelle, temps plein, temps partiel, sortie d’école, nourrissons, jumeaux, vacances), (2) Nettoyage Domestique et Commercial, (3) Conciergerie et Aide Ménagère (repas, courses, linge, organisation), (4) Aide aux Seniors à domicile, et (5) Garde d’Animaux (à votre domicile ou chez le pet-sitter).",
      },
      {
        id: "faq-2",
        question: "Comment fonctionne la demande d’un service ?",
        answer:
          "Cliquez sur « Demander un Service » ou sur l’une de nos 5 catégories. Choisissez le type de prestation souhaité (ou décrivez votre besoin sur mesure), puis indiquez la date, l’heure, la durée, la fréquence et votre commune. Votre demande nous est envoyée comme prise de contact : nous vous rappelons rapidement pour confirmer la disponibilité et le tarif.",
      },
      {
        id: "faq-3",
        question: "Comment sélectionnez-vous vos intervenants ?",
        answer:
          "Chaque candidat fait l’objet d’une vérification rigoureuse : contrôle d’identité, extrait de casier judiciaire vierge, vérification des références auprès d’employeurs précédents et évaluation des compétences linguistiques (français, anglais, allemand, luxembourgeois).",
      },
      {
        id: "faq-4",
        question: "Puis-je demander une prestation urgente ou hors horaires de bureau ?",
        answer:
          "Oui. Qu’il s’agisse d’une nounou sur appel pour un imprévu, du nettoyage de bureaux en dehors des heures d’ouverture ou d’une remise en état après travaux, vous pouvez préciser vos besoins exacts dans le formulaire.",
      },
    ] as FaqItem[],
  },

  de: {
    localeName: "DE",
    nav: {
      home: "Startseite",
      about: "Über uns",
      services: "Unsere Leistungen",
      jobs: "Stellenangebote",
      contact: "Kontakt",
      bookService: "Service anfragen",
      exploreJobs: "Offene Stellen ansehen",
      admin: "Admin",
      languageLabel: "Sprache",
    },
    home: {
      heroTitleHighlight: "Ihr Leben, Organisiert.",
      heroTitleRest: "Ihre Zeit, Gewonnen.",
      heroSubtitle:
        "Persönliche Assistenz, Kinderbetreuung und Haushaltsführung – abgestimmt auf Ihren Lebensstil. Delegieren Sie alltägliche Pflichten an vertrauensvolle Experten und gewinnen Sie wertvolle Zeit für Beruf, Familie und persönliche Prioritäten zurück.",
      ecosystemBadge: "UNSER BETREUUNGS-ÖKOSYSTEM",
      ecosystemTitle: "Alles, was Sie brauchen, um Haushalt und Alltag in Balance zu halten.",
      ecosystemSubtitle:
        "Von professioneller Kinderbetreuung und gehobener Haushaltsführung bis zu persönlicher Concierge-Assistenz und würdevoller Begleitung. Delegieren Sie Ihre Aufgaben an geprüfte Experten – für mehr Zeit für das Wesentliche.",
      ecosystemLearnMore: "Mehr erfahren",
      serviceOverview: "Service-Übersicht",
      availableOptionsScope: "Verfügbare Optionen & Leistungsumfang",
      exploreDedicatedPage: "Detailseite ansehen",
      requestShort: "Anfragen",
      testimonialsBadge: "REFERENZEN",
      testimonialsTitle: "Erfahrungen unserer geschätzten Kunden.",
      leaveReviewBtn: "Bewertung schreiben",
      faqBadge: "FAQs",
      faqTitle: "Häufig gestellte Fragen",
    },
    about: {
      heroTitle: "ÜBER UNS",
      heroSubtitlePrefix:
        "Speziell für Luxemburgs dynamische, internationale und mehrsprachige Gemeinschaft entwickelt, dient ",
      heroSubtitleHighlight: "Nanny & MaisonCare",
      heroSubtitleSuffix:
        " als vertrauensvolle Brücke zwischen anspruchsvollen Haushalten und erstklassigen Fachkräften.",
      whoWeAreBadge: "ÜBER UNS",
      whoWeAreTitle: "WER WIR SIND",
      whoWeAreLead:
        "Wir sind die führende Agentur für Familienpersonal und Haushalts-Concierge im Großherzogtum. Ein anspruchsvoller Berufsalltag und ein internationaler Lebensstil erfordern mehr als nur eine zusätzliche helfende Hand – sie erfordern vollkommene Sorgenfreiheit. Nanny and MaisonCare Lëtzebuerg versteht die kulturelle, sprachliche und organisatorische DNA Ihres Zuhauses.",
      missionTitle: "Mission",
      missionText:
        "Das Familienleben spürbar zu erleichtern. Wir verbinden Luxemburger Haushalte mit geprüften und passgenau ausgewählten Kinderbetreuungs- und Haushaltsspezialisten.",
      visionTitle: "Vision",
      visionText:
        "Als Luxemburgs vertrauenswürdigste Marke für Haushaltsunterstützung zu stehen – bekannt für absolute Diskretion, kompromisslose Sicherheit und persönliche Betreuung.",
      pillarsBadge: "DIE SÄULEN VON MAISONCARE",
      pillarsTitle: "Verankert in kompromisslosen Standards.",
      pillars: [
        {
          tag: "SICHERHEIT",
          title: "Vertrauen & Sicherheit",
          description:
            "Das Wohl Ihrer Familie steht an erster Stelle – gestützt durch ein mehrstufiges Prüfverfahren.",
        },
        {
          tag: "DISKRETION",
          title: "Absolute Diskretion",
          description:
            "Höchste Vertraulichkeit sowohl für unsere Kundenfamilien als auch für unsere qualifizierten Fachkräfte.",
        },
        {
          tag: "SPRACHEN",
          title: "Mehrsprachige Exzellenz",
          description:
            "Entwickelt für Luxemburgs internationale Gemeinschaft – passgenaue Sprachkompetenz für Ihren Haushalt.",
        },
        {
          tag: "HARMONIE",
          title: "Kulturelle Passgenauigkeit",
          description:
            "Wir blicken hinter den Lebenslauf und prüfen Persönlichkeit, Werte und Lebensstil für ein harmonisches Miteinander.",
        },
        {
          tag: "KONTINUITÄT",
          title: "Rundum-Verlässlichkeit",
          description:
            "Unser Engagement endet nicht am ersten Tag. Wir bieten laufende Betreuung, Feedback-Gespräche und Ersatzlösungen.",
        },
      ] as PillarItem[],
    },
    servicesPage: {
      heroTitle: "UNSERE LEISTUNGEN",
      heroSubtitle:
        "Ein umfassender zentraler Ansprechpartner für Ihr Zuhause und Ihr Unternehmen – gegliedert in fünf spezialisierte Säulen.",
      howItWorksBadge: "SO FUNKTIONIERT IHRE ANFRAGE",
      howItWorksTitle: "Maßgeschneiderte Betreuung in 4 klaren Schritten.",
      stepLabel: "SCHRITT",
      steps: [
        {
          step: "01",
          title: "Kategorie wählen",
          description:
            "Klicken Sie auf eine unserer fünf Hauptkategorien, um die passenden Leistungen für Familie, Haushalt oder Gewerbe zu sehen.",
        },
        {
          step: "02",
          title: "Spezifischen Service auswählen",
          description:
            "Wählen Sie eine oder mehrere Leistungen aus der Liste oder beschreiben Sie Ihr individuelles Anliegen.",
        },
        {
          step: "03",
          title: "Zeitplan & Details angeben",
          description:
            "Geben Sie Wunschdatum, Startzeit, Stundenzahl, Häufigkeit und Ihren Wohnort in Luxemburg an.",
        },
        {
          step: "04",
          title: "Persönliche Beratung & Bestätigung",
          description:
            "Ihre gesendete Anfrage ist zunächst unverbindlich. Wir kontaktieren Sie zeitnah zur Bestätigung von Verfügbarkeit und Konditionen.",
        },
      ],
      trustAndSafety: {
        badge: "IHR VERTRAUEN UND IHRE SICHERHEIT – UNSERE PRIORITÄT",
        title:
          "Wir wissen, welches Vertrauen es bedeutet, jemanden im eigenen Zuhause willkommen zu heißen oder die eigenen Angehörigen in dessen Obhut zu geben.",
        subtitle: "Deshalb nehmen wir unseren Auswahlprozess äußerst ernst.",
        vettingHeader: "Unser Prüfverfahren umfasst:",
        items: [
          {
            title: "Identitätsprüfung",
            description: "Sorgfältige Bestätigung der Identität aller Kandidaten.",
          },
          {
            title: "Qualifikationen & Erfahrung",
            description:
              "Überprüfung relevanter Qualifikationen, Fachkenntnisse und Berufserfahrung.",
          },
          {
            title: "Referenzprüfungen",
            description:
              "Kontaktaufnahme mit früheren Arbeitgebern oder Referenzgebern zur Beurteilung der Eignung.",
          },
          {
            title: "Hintergrundprüfungen",
            description:
              "Durchführung von Führungszeugnis- und Hintergrundprüfungen gemäß den geltenden Bestimmungen.",
          },
          {
            title: "Versicherung & Compliance",
            description:
              "Sicherstellung angemessener Versicherungslösungen und Beachtung aller gesetzlichen und behördlichen Vorgaben.",
          },
        ],
        commitmentFooter:
          "Wir verpflichten uns zu höchster Professionalität, Diskretion und verantwortungsvoller Servicequalität – damit Sie bei der Auswahl von Unterstützung für Ihr Zuhause und Ihre Familie ein sicheres Gefühl haben.",
      },
    },
    dedicatedService: {
      backToServices: "Zurück zu den Leistungen",
      requestThisService: "Diesen Service anfragen",
      scopeBadge: "Leistungsumfang & Verfügbare Optionen",
      arrangementsTitle: "Verfügbare Betreuungsmodelle",
      arrangementsSubtitle:
        "Jeder Haushalt und jede Familie in Luxemburg hat ihren eigenen Rhythmus. Entdecken Sie die spezifischen Leistungen dieser Kategorie.",
      conciergeScopeBadge: "Leistungsumfang Concierge & Haushaltshilfe",
      conciergeScopeTitle: "Aufgaben, die Sie delegieren können",
      conciergeScopeSubtitle:
        "MaisonCare bietet strukturierte Alltags- und Haushaltsorganisation sowie praktische Unterstützung:",
      conciergeScopeItems: [
        "Verwaltung von Terminen und persönlichen Zeitplänen.",
        "Lebensmitteleinkäufe und persönliche Besorgungen.",
        "Koordination von Hauslieferungen.",
        "Organisation von Wäsche und weiteren Haushaltsaufgaben.",
        "Organisation autorisierter Handwerker- und Wartungsbesuche.",
        "Koordination vereinbarter Familienroutinen.",
        "Buchung von Reisen oder anderen persönlichen Arrangements.",
        "Praktische administrative Unterstützung.",
      ],
      availableOnRequest: "Auf Anfrage verfügbar",
      requestThis: "Anfragen",
      trustCards: [
        {
          title: "100 % Identitäts- & Führungszeugnis-geprüft",
          description:
            "Jede Betreuungs- und Haushaltskraft durchläuft eine Prüfung des Führungszeugnisses (Bulletin N°3) sowie Referenzprüfungen.",
        },
        {
          title: "Flexible Zeitmodelle",
          description:
            "Von einmaliger kurzfristiger Hilfe bis hin zu täglicher Betreuung und Live-In-Einsätzen in allen Luxemburger Gemeinden.",
        },
        {
          title: "Mehrsprachige Kompetenz",
          description:
            "Fachkräfte passend zu den Sprachwünschen Ihres Haushalts: Deutsch, Français, English, Lëtzebuergesch.",
        },
      ],
      formSubtitle:
        "Senden Sie Ihre Service-Anfrage über das untenstehende Formular. Unser Team meldet sich zeitnah bei Ihnen, um Verfügbarkeit, Umfang und Konditionen abzustimmen.",
    },
    jobsPage: {
      heroTitle: "STELLENANGEBOTE",
      heroSubtitle: "Bewerben Sie sich auf aktuelle Stellenangebote",
      sectionBadge: "JOBS",
      sectionTitle: "Hier auf Stellen bewerben",
      learnMore: "Mehr erfahren",
      competitiveSalary: "Attraktive Vergütung",
      backToJobs: "Zurück zu allen Stellen",
      aboutFamilyTitle: "Über die Familie",
      whoLookingForTitle: "Wen suchen wir?",
      tasksTitle: "Was sind Ihre Aufgaben?",
      scheduleTitle: "Wie sieht Ihr Wochenplan aus?",
      applyForm: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon / WhatsApp",
        whyConsidered: "Warum sollten wir Sie für diese Position berücksichtigen?",
        expectedSalary: "Gehaltsvorstellung pro Monat (€)",
        uploadPromptPrefix: "Hier klicken",
        uploadPromptSuffix: ", um Lebenslauf / Anschreiben hochzuladen",
        submitBtn: "Bewerbung absenden",
        submitting: "Wird gesendet...",
        successTitle: "Bewerbung eingegangen",
        successMessage:
          "Vielen Dank für Ihre Bewerbung bei Nanny & MaisonCare Lëtzebuerg. Unser Team hat Ihren Lebenslauf erhalten und meldet sich zeitnah bei Ihnen.",
        errorFileType: "Bitte laden Sie eine PDF-, DOC- oder DOCX-Datei hoch.",
        errorFileSize: "Die Dateigröße darf maximal 5 MB betragen.",
        errorMissingCv: "Bitte fügen Sie Ihren Lebenslauf / Ihr Anschreiben (.pdf, .doc oder .docx) bei.",
        errorSubmit: "Ihre Bewerbung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      },
    },
    contactPage: {
      heroTitle: "Kontakt",
      heroSubtitle: "Teilen Sie uns Ihr Anliegen oder Ihre Fragen direkt mit",
      nameLabel: "Name",
      emailLabel: "E-Mail",
      messageLabel: "Ihre Nachricht",
      submitBtn: "Nachricht senden",
      sendAnotherBtn: "Weitere Nachricht senden",
      writeToUs: "Schreiben Sie uns",
      emailAddress: "info@nannymaisoncare.lu",
      officialNumbersTitle: "Offizielle Telefonnummern",
      phoneNumbers: [
        "+352 691 225 764",
        "+352 691 346 782",
        "+352 691 347 090",
      ],
      addressTitle: "Hauptsitz",
      address: "140 Rue de Cessange, Luxemburg",
      successMessage:
        "Vielen Dank für Ihre Nachricht! Unser Concierge-Team antwortet Ihnen innerhalb von 24 Stunden.",
    },
    footer: {
      headline: "Wir sind gerne für Sie da!",
      subtext: "Wir freuen uns darauf, von Ihnen zu hören.",
      bookBtn: "Service anfragen",
      contactBtn: "Kontakt",
      address: "140 Rue de Cessange, Luxemburg",
      phoneNumbers: [
        "+352 691 225 764",
        "+352 691 346 782",
        "+352 691 347 090",
      ],
      email: "info@nannymaisoncare.lu",
      copyright: "© 2026, Nanny & MaisonCare Lëtzebuerg. Alle Rechte vorbehalten.",
    },
    bookingModal: {
      title: "Service-Anfrage stellen",
      subtitle:
        "Wählen Sie eine Kategorie und eine oder mehrere Leistungen – oder beschreiben Sie Ihren individuellen Wunsch. Wir kontaktieren Sie zur Abstimmung von Verfügbarkeit und Preisen.",
      nameLabel: "Name",
      namePlaceholder: "z. B. Marie Laurent",
      emailLabel: "E-Mail",
      phoneLabel: "Telefon / WhatsApp",
      selectCategory: "Kategorie wählen",
      serviceCategoryLabel: "Service-Kategorie",
      selectServices: "Eine oder mehrere Leistungen wählen",
      addedSuffix: "(Hinzugefügt)",
      serviceDate: "Gewünschtes Startdatum",
      startTime: "Gewünschte Startzeit",
      durationHours: "Anzahl der Stunden (pro Einsatz)",
      durationOptions: {
        h1_2: "1–2 Stunden",
        h3_4: "3–4 Stunden",
        h5_6: "5–6 Stunden",
        h7_8: "7–8 Stunden",
        overnight: "Übernachtung",
        flexible: "Noch offen / Nach Absprache",
      },
      frequency: "Häufigkeit",
      frequencies: {
        once: "Einmalig / Gelegentlich",
        weekly: "Wöchentlich",
        biweekly: "Mehrmals pro Woche",
        fulltime: "Vollzeit / Täglich",
        livein: "Live-In / Übernachtung",
      },
      frequencyOptions: {
        once: "Einmalig / Gelegentlich",
        weekly: "Einmal pro Woche",
        severalWeekly: "Mehrmals pro Woche",
        biweekly: "Alle zwei Wochen",
        monthly: "Monatlich",
        ongoing: "Dauerhaftes Arrangement",
      },
      location: "Adresse / Gemeinde in Luxemburg",
      locationPlaceholder: "z. B. 140 Rue de Cessange, Luxemburg",
      preferredDaysLabel: "Bevorzugte Wochentage",
      weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      cleaningPremisesLabel: "Objekt- & Immobilientyp",
      cleaningPremisesOptions: {
        home: "Privathaushalt (Wohnung oder Haus)",
        office: "Büro / Arbeitsplatz",
        commercial: "Gewerberäume / Ladenlokal",
        other: "Sonstiges",
      },
      cleaningSizeLabel: "Zimmer / Bäder / Ungefähre Fläche",
      cleaningSizePlaceholder: "z. B. 2 Schlafzimmer, 1 Bad, 95 m²",
      nannyArrangementLabel: "Betreuungsform",
      nannyArrangementOptions: {
        liveOut: "Live-Out (Kommt stunden-/tageweise)",
        liveIn: "Live-In (Wohnt im Familienhaushalt)",
        flexible: "Flexibel / Nach Absprache",
      },
      nannyChildrenLabel: "Anzahl & Alter der Kinder",
      nannyChildrenPlaceholder: "z. B. 2 Kinder (1 Jahr und 4 Jahre)",
      petSettingLabel: "Tierart & Betreuungsort",
      petSettingOptions: {
        myHome: "Tierbetreuung bei mir zu Hause",
        sitterHome: "Betreuung beim Tiersitter",
        walking: "Gassi-Service & Auslauf",
        overnight: "Übernachtungs- / Urlaubsbetreuung",
      },
      petDetailsLabel: "Name, Rasse & Gewohnheiten des Tieres",
      petDetailsPlaceholder: "z. B. Max (Golden Retriever, 3 Jahre)",
      seniorCompletingLabel: "Wer füllt dieses Formular aus?",
      seniorCompletingOptions: {
        family: "Ein Familienmitglied / Bevollmächtigter",
        self: "Die betreute Person selbst",
        other: "Sonstige",
      },
      seniorRecipientLabel: "Name der betreuten Person (falls abweichend)",
      seniorRecipientPlaceholder: "z. B. Jean Dupont (Vater)",
      customNotes: "Teilen Sie uns Ihre Wünsche mit (Details oder individuelle Anfrage)",
      customNotesPlaceholder:
        "Beschreiben Sie Ihren Zeitplan, Ihre Prioritäten oder besondere Wünsche...",
      enquiryDisclaimer:
        "Hinweis: Eine abgesendete Anfrage ist noch keine verbindliche Buchung. Alle Vereinbarungen werden nach persönlicher Rücksprache durch unser Team bestätigt.",
      submitBtn: "Anfrage absenden",
      submitting: "Wird gesendet...",
      submitAnotherBtn: "Weitere Anfrage stellen",
      errorMissingFields: "Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an.",
      errorSubmit: "Ihre Service-Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      successTitle: "Service-Anfrage erhalten",
      successMessage:
        "Vielen Dank! Ihre Anfrage wurde an unseren Concierge-Desk übermittelt. Wir melden uns in Kürze bei Ihnen, um Verfügbarkeit, Zeitplan und Konditionen zu bestätigen.",
    },
    reviewModal: {
      title: "Kundenbewertung abgeben",
      subtitle:
        "Teilen Sie Ihre Erfahrungen mit Nanny & MaisonCare Lëtzebuerg. Neue Bewertungen werden vor der Veröffentlichung von unserem Administrator geprüft.",
      nameLabel: "Ihr vollständiger Name",
      namePlaceholder: "z. B. Sophie & Marc Schmit",
      roleLabel: "Haushalt / Ort (z. B. Familie in Kirchberg)",
      rolePlaceholder: "z. B. Kirchberg, Luxemburg",
      ratingLabel: "Sternebewertung",
      reviewLabel: "Ihre Bewertung",
      reviewPlaceholder:
        "Teilen Sie Ihre Erfahrungen mit unserem Nanny-, Reinigungs- oder Concierge-Service...",
      avatarLabel: "Profilbild (Optional)",
      uploadPhoto: "Foto hochladen",
      changePhoto: "Foto ändern",
      removePhoto: "Entfernen",
      photoAttached: "Eigenes Foto beigefügt.",
      photoHint:
        "Optional. Ohne Foto werden Ihre Initialen als elegantes Monogramm angezeigt.",
      submitBtn: "Bewertung zur Freigabe senden",
      doneBtn: "Fertig",
      successTitle: "Vielen Dank für Ihre Bewertung!",
      successMessage:
        "Ihre Bewertung wurde mit dem Status AUSSTEHEND gespeichert und wird nach Freigabe durch unseren Administrator veröffentlicht.",
    },
    chatbot: {
      launcherLabel: "Chat mit MaisonCare Kundenservice",
      headerTitle: "MaisonCare Customer Service",
      headerSubtitle: "",
      ticketBtnLabel: "Ticket",
      typingLabel: "MaisonCare KI schreibt...",
      submittingLabel: "Wird gesendet...",
      welcomeMessage:
        "Willkommen bei Nanny & MaisonCare Lëtzebuerg! Wie können wir Ihnen heute bei Kinderbetreuung, Reinigung, Seniorenhilfe, Tierbetreuung, Concierge-Diensten oder offenen Stellen behilflich sein?",
      inputPlaceholder: "Stellen Sie Ihre Frage auf Deutsch, Français oder English...",
      sendBtn: "Senden",
      escalatePrompt:
        "Möchten Sie ein direktes Support-Ticket an unser Concierge-Team senden?",
      ticketEmailPlaceholder: "Ihre E-Mail-Adresse...",
      ticketMessagePlaceholder: "Beschreiben Sie kurz Ihr Anliegen...",
      ticketSubmitBtn: "An Concierge-Team senden",
      ticketSuccess:
        "Ihr Support-Ticket wurde erstellt und an unseren Administrator gesendet. Wir antworten Ihnen zeitnah per E-Mail.",
    },
    categories: [
      {
        id: "cat-nanny",
        slug: "nanny",
        title: "MaisonCare Nanny & Kinderbetreuung",
        shortTitle: "Nanny & Kinderbetreuung",
        description:
          "Geprüfte Kinderbetreuungsspezialisten, abgestimmt auf den Alltag, Zeitplan und die sprachlichen Bedürfnisse Ihrer Familie.",
        image: "/images/childcare-creative-beads.jpg",
        pills: [
          "Vollzeit & Teilzeit",
          "Neugeborenen- & Säuglingspflege",
          "Nachmittagsbetreuung",
          "Live-In Nannys",
        ],
        serviceTypes: [
          {
            id: "occasional-childcare",
            label: "Gelegentliche Kinderbetreuung",
            description:
              "Kurzzeitige Betreuung für vereinbarte Zeiträume, z. B. bei Terminen oder am Abend.",
          },
          {
            id: "full-time-nanny",
            label: "Vollzeit-Nanny",
            description: "Regelmäßige Kinderbetreuung nach fest vereinbartem Vollzeitplan.",
            defaultRecurring: true,
          },
          {
            id: "part-time-nanny",
            label: "Teilzeit-Nanny",
            description: "Betreuung an ausgewählten Tagen oder zu bestimmten Stunden.",
            defaultRecurring: true,
          },
          {
            id: "after-school-care",
            label: "Nachmittags- & Schulbetreuung",
            description:
              "Abholung von der Schule auf Wunsch, Snacks, Spielen und Beaufsichtigung am Nachmittag und Abend.",
            defaultRecurring: true,
          },
          {
            id: "newborn-infant-care",
            label: "Neugeborenen- & Säuglingsbetreuung",
            description:
              "Liebevolle Alltagspflege für Babys entsprechend den Familienbedürfnissen.",
          },
          {
            id: "twins-multiple-care",
            label: "Zwillings- & Mehrlingsbetreuung",
            description: "Speziell abgestimmte Betreuung für Zwillinge, Drillinge oder Geschwister.",
          },
          {
            id: "holiday-childcare",
            label: "Ferienbetreuung",
            description: "Zuverlässige Kinderbetreuung während der Schulferien.",
          },
          {
            id: "call-in-nanny",
            label: "Abruf- / Notfall-Nanny (On-Demand)",
            description:
              "Kurzfristige Unterstützung bei unvorhergesehenen Terminen, je nach Verfügbarkeit.",
          },
          {
            id: "live-in-out-nanny",
            label: "Live-In oder Live-Out Nanny",
            description: "Betreuungsmodelle im Haushalt wohnend oder extern nach Wunsch.",
            defaultRecurring: true,
          },
        ],
      },
      {
        id: "cat-cleaning",
        slug: "cleaning",
        title: "MaisonCare Haushalts- & Gewerbereinigung",
        shortTitle: "Haushalts- & Gewerbereinigung",
        description:
          "Professionelle Reinigungsdienste für Privathaushalte, Büros und Geschäftsräume – flexibel abgestimmt auf Ihren Wunschtermin.",
        image: "/images/household-cleaning.jpg",
        pills: [
          "Wohnungen & Häuser",
          "Büroreinigung außerhalb der Geschäftszeiten",
          "Bauend- & Grundreinigung",
          "Regelmäßige Intervalle",
        ],
        serviceTypes: [
          {
            id: "apartments-houses",
            label: "Wohnungen & Häuser",
            description: "Regelmäßige oder einmalige Reinigung für Privathaushalte.",
          },
          {
            id: "office-cleaning",
            label: "Büroreinigung außerhalb der Geschäftszeiten",
            description:
              "Reinigung außerhalb der regulären Arbeitszeiten für einen störungsfreien Betrieb.",
            defaultRecurring: true,
          },
          {
            id: "post-renovation",
            label: "Reinigung nach Renovierung / Bauarbeiten",
            description: "Gründliche Reinigung nach Umbau-, Renovierungs- oder Wartungsarbeiten.",
          },
          {
            id: "bathrooms-windows-terraces",
            label: "Bäder, Fenster & Terrassen",
            description:
              "Reinigung von Badezimmern, Innenfenstern, Glasflächen, Terrassen und Balkonen.",
          },
          {
            id: "commercial-premises",
            label: "Gewerberäume & Ladenlokale",
            description: "Reinigung für Geschäfte, Praxen, Büros und Gewerbeflächen.",
            defaultRecurring: true,
          },
          {
            id: "regular-scheduled-cleaning",
            label: "Regelmäßige Unterhaltsreinigung",
            description: "Wiederkehrende Einsätze in fest vereinbarten Intervallen.",
            defaultRecurring: true,
          },
          {
            id: "deep-cleaning",
            label: "Intensive Grundreinigung (Deep Cleaning)",
            description: "Detaillierte Tiefenreinigung nach individuellem Bedarf.",
          },
          {
            id: "move-in-move-out",
            label: "Einzugs- & Auszugsreinigung",
            description: "Komplettreinigung vor dem Einzug oder bei Wohnungsübergabe.",
          },
        ],
      },
      {
        id: "cat-concierge",
        slug: "concierge",
        title: "MaisonCare Concierge & Haushaltshilfe",
        shortTitle: "Haushaltshilfe & Concierge-Service",
        description:
          "Praktische Unterstützung im Haushaltsalltag und persönlicher Concierge-Service – von Mahlzeiten und Einkäufen bis zu Wäschepflege und Ordnung.",
        image: "/images/home-organization-laundry.jpg",
        pills: [
          "Persönliche Familienassistenten",
          "Mahlzeiten & Einkäufe",
          "Wäsche, Bügeln & Ordnung",
          "Alltagslogistik",
        ],
        serviceTypes: [
          {
            id: "appointments-schedules",
            label: "Verwaltung von Terminen & persönlichen Plänen",
            description:
              "Koordination von Kalendern, privaten Terminen und beruflichen Verpflichtungen.",
          },
          {
            id: "grocery-errands",
            label: "Lebensmitteleinkäufe & persönliche Besorgungen",
            description:
              "Wocheneinkäufe, Vorratsauffüllung, Reinigungsabholungen und Erledigungen des Alltags.",
          },
          {
            id: "household-deliveries",
            label: "Koordination von Hauslieferungen",
            description:
              "Paketannahme, Betreuung von Lieferungen und Koordination eingehender Sendungen.",
          },
          {
            id: "laundry-household-tasks",
            label: "Organisation von Wäsche & Haushaltsaufgaben",
            description:
              "Waschen, Bügeln, Falten, Kleiderschrankorganisation und laufende Haushaltspflege.",
          },
          {
            id: "home-maintenance-visits",
            label: "Organisation autorisierter Handwerkerbesuche",
            description:
              "Terminierung, Empfang und Betreuung von Handwerkern und Wartungsdiensten.",
          },
          {
            id: "family-routines",
            label: "Koordination vereinbarter Familienroutinen",
            description:
              "Harmonisierung von Schulzeiten, Freizeitaktivitäten und täglicher Familienlogistik.",
          },
          {
            id: "travel-arrangements",
            label: "Buchung von Reisen & persönlichen Arrangements",
            description:
              "Organisation von Transport, Hotelreservierungen, Reiseplänen und individuellen Buchungen.",
          },
          {
            id: "administrative-support",
            label: "Praktische administrative Unterstützung",
            description:
              "Postsortierung, Unterlagenablage, Rechnungsübersicht und praktische Hilfe bei Formalitäten.",
          },
        ],
      },
      {
        id: "cat-senior",
        slug: "senior",
        title: "MaisonCare Seniorenbetreuung & Alltagshilfe",
        shortTitle: "Seniorenbetreuung & Hilfe zu Hause",
        description:
          "Praktische, würdevolle Unterstützung für ältere Menschen, um Komfort, Sicherheit und Selbstständigkeit im eigenen Zuhause zu bewahren.",
        image: "/images/childcare-toddler-rings.jpg",
        pills: [
          "Hauswirtschaftliche Hilfe",
          "Körperpflege & Hygiene",
          "Mahlzeitenzubereitung",
          "Mobilität & Begleitung",
        ],
        serviceTypes: [
          {
            id: "senior-domestic-help",
            label: "Hauswirtschaftliche Unterstützung",
            description:
              "Leichte Reinigung, Wäsche, Bügeln, Aufräumen und Haushaltsorganisation.",
          },
          {
            id: "senior-personal-care",
            label: "Körperpflege & Alltags-Hygiene",
            description:
              "Unterstützung beim Waschen, Ankleiden und der täglichen Hygiene im Rahmen der geltenden Bestimmungen.",
          },
          {
            id: "senior-meal-prep",
            label: "Mahlzeitenzubereitung",
            description:
              "Frische Zubereitung von Speisen nach individuellen Vorlieben und Diätvorgaben.",
          },
          {
            id: "senior-shopping-assistance",
            label: "Einkaufshilfe",
            description:
              "Begleitung beim Einkaufen oder zuverlässige Erledigung aller Besorgungen.",
          },
          {
            id: "senior-mobility-accompaniment",
            label: "Mobilität & Begleitung",
            description:
              "Unterstützung im Haus, bei Spaziergängen, Arztterminen und Ausflügen.",
          },
        ],
      },
      {
        id: "cat-pet",
        slug: "pet",
        title: "MaisonCare Tierbetreuung & Pet Sitting",
        shortTitle: "Tierbetreuung & Pet Sitting",
        description:
          "Liebevolle Betreuung für Hunde, Katzen und Kleintiere während Ihrer Arbeit, Terminen oder im Urlaub – bei Ihnen zu Hause oder beim Tiersitter.",
        extendedIntro:
          "Fühlt sich Ihre Katze zu Hause am wohlsten oder wird Ihr Hund in fremder Umgebung nervös? Wählen Sie die Betreuung, die perfekt zum Charakter Ihres Tieres passt. Ein vorheriges Kennenlernen wird empfohlen.",
        image: "/images/childcare-outdoor-balance.jpg",
        pills: [
          "Betreuung bei Ihnen zu Hause",
          "Betreuung beim Tiersitter",
          "Gassi-Service & Auslauf",
          "Urlaubs- & Übernachtungsbetreuung",
        ],
        serviceTypes: [
          {
            id: "pet-home-visits",
            label: "Tierbetreuung bei Ihnen zu Hause (Füttern, Spielen & Pflege)",
            description:
              "Fütterung, frisches Wasser, Katzenklo-Reinigung, Welpenbetreuung und Hausbesuche.",
          },
          {
            id: "pet-dog-walking",
            label: "Hundeauslauf & Spaziergänge",
            description:
              "Regelmäßige Spaziergänge, Bewegung und Beschäftigung nach gewohnter Routine.",
          },
          {
            id: "pet-sitter-daytime",
            label: "Tagesbetreuung (beim Tiersitter zu Hause)",
            description:
              "Ganztagsbetreuung, Fütterung, Spielzeit und Auslauf im Haushalt des Sittters.",
          },
          {
            id: "pet-overnight-holiday",
            label: "Übernachtungs- & Urlaubsbetreuung",
            description:
              "Mehrtagige liebevolle Betreuung für Hunde, Katzen, Kaninchen und Kleintiere.",
          },
        ],
      },
    ] as EcosystemCategory[],
    faqs: [
      {
        id: "faq-1",
        question: "Welche Dienstleistungen bieten Sie an?",
        answer:
          "Wir bieten fünf spezialisierte Säulen in ganz Luxemburg an: (1) Nanny & Kinderbetreuung (gelegentlich, Vollzeit, Teilzeit, Nachmittagsbetreuung, Säuglinge, Zwillinge, Ferien), (2) Haushalts- & Gewerbereinigung, (3) Concierge & Haushaltshilfe (Kochen, Einkäufe, Wäsche, Organisation), (4) Seniorenbetreuung & Alltagshilfe sowie (5) Tierbetreuung & Pet Sitting.",
      },
      {
        id: "faq-2",
        question: "Wie läuft eine Service-Anfrage ab?",
        answer:
          "Klicken Sie auf ‚Service anfragen‘ oder wählen Sie eine unserer 5 Kategorien. Nach Auswahl der gewünschten Leistung erscheinen die Felder für Datum, Startzeit, Stundenzahl, Häufigkeit und Wohnort. Eine abgesendete Anfrage ist zunächst unverbindlich – wir kontaktieren Sie kurzfristig zur Bestätigung von Verfügbarkeit und Preisen.",
      },
      {
        id: "faq-3",
        question: "Wie werden Ihre Nannys und Haushaltskräfte geprüft?",
        answer:
          "Alle Kandidaten durchlaufen unser mehrstufiges Prüfverfahren: Identitätsprüfung, einwandfreies polizeiliches Führungszeugnis (Extrait de casier judiciaire), geprüfte Referenzen früherer Familien sowie Prüfung der Sprachkenntnisse (Englisch, Französisch, Deutsch, Luxemburgisch).",
      },
      {
        id: "faq-4",
        question: "Kann ich auch kurzfristige Einsätze oder Büroreinigungen außerhalb der Geschäftszeiten anfragen?",
        answer:
          "Ja. Ob Abruf-Nanny bei kurzfristigen Terminen, Büroreinigung nach Feierabend, Grundreinigung nach Renovierungen oder individuelle Haushaltskombinationen – Sie können mehrere Leistungen auswählen oder Ihren Wunsch frei beschreiben.",
      },
    ] as FaqItem[],
  },
};

export type Dictionary = typeof DICTIONARIES.en;
