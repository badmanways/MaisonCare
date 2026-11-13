import { Locale } from "@/lib/i18n/dictionaries";

export interface JobVacancy {
  id: string;
  title: string;
  fullTitle?: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  aboutFamily: string;
  whoLookingFor: string[];
  tasks: string[];
  schedule: string;
  translations?: {
    [key in Locale]?: {
      title: string;
      fullTitle?: string;
      location: string;
      type: string;
      aboutFamily: string;
      whoLookingFor: string[];
      tasks: string[];
      schedule: string;
    };
  };
  createdAt?: string;
  active?: boolean;
}

export const INITIAL_JOBS: JobVacancy[] = [
  {
    id: "job-1",
    title: "Experienced nanny / family assistant wanted for a 3-year-old toddler",
    fullTitle:
      "Experienced nanny / family assistant wanted for a 3-year-old toddler",
    location: "Luxembourg",
    salary: "5000",
    type: "Part-time",
    category: "Nanny & Childcare",
    aboutFamily:
      "For a committed family in Luxembourg, we are looking for a warm nanny / family assistant who wants to become a permanent value within the family. You support both in the care of their youngest son of 3 years old and in the household and help to ensure that daily family life runs smoothly and organised.",
    whoLookingFor: [
      "You are warm, caring and involved.",
      "You take initiative and work independently.",
      "You are responsible, reliable and discreet.",
      "You work in an organized way and see work.",
      "You communicate clearly and respectfully.",
      "You guide children in a positive and patient way.",
      "You have an eye for order, cleanliness and hygiene.",
      "You speak French fluently.",
      "You have a driver's license and your own car.",
      "You are looking for a long-term cooperation within a family.",
    ],
    tasks: [
      "Daily care for the youngest son of 3 years old",
      "Playing, guiding and stimulating his development",
      "Creating a safe and warm environment",
      "Supervising eating and snacking moments, taking allergies into account",
      "Follow naps and daily routines",
      "Pick up the preschooler from school if necessary",
      "Vacuuming, mopping, washing, folding and ironing",
      "Replacing bed linen",
      "Shopping and stock tracking",
      "Assist in meal preparation",
      "Keeping the household orderly and organized",
      "Taking initiative and seeing work",
    ],
    schedule:
      "About 30 hours per week. Working hours mainly between 09.00 and 16.00. On Wednesday, you pick up the youngest from school. During school holidays, the focus shifts to more child guidance instead of household chores.",
    translations: {
      fr: {
        title:
          "Nounou expérimentée / assistante familiale pour enfant de 3 ans",
        fullTitle:
          "Nounou expérimentée / assistante familiale pour un enfant de 3 ans",
        location: "Luxembourg",
        type: "Temps partiel",
        aboutFamily:
          "Pour une famille investie au Luxembourg, nous recherchons une nounou / assistante familiale chaleureuse souhaitant s’inscrire dans la durée. Vous accompagnez leur plus jeune fils de 3 ans et veillez à l’organisation fluide et harmonieuse de la maison.",
        whoLookingFor: [
          "Vous êtes chaleureuse, bienveillante et impliquée.",
          "Vous prenez des initiatives et travaillez de manière autonome.",
          "Vous êtes responsable, fiable et discrète.",
          "Vous travaillez avec rigueur et savez anticiper les besoins.",
          "Vous communiquez avec clarté et respect.",
          "Vous guidez les enfants de façon patiente et positive.",
          "Vous avez le sens de l'ordre, de la propreté et de l'hygiène.",
          "Vous parlez couramment le français.",
          "Vous possédez le permis de conduire et votre propre véhicule.",
          "Vous recherchez une collaboration à long terme dans une famille.",
        ],
        tasks: [
          "Soins quotidiens pour le plus jeune fils de 3 ans",
          "Jeux, éveil et stimulation de son développement",
          "Création d'un environnement sécurisant et chaleureux",
          "Supervision des repas et collations (prise en compte des allergies)",
          "Respect des siestes et des routines quotidiennes",
          "Sortie d'école de l'enfant en maternelle si nécessaire",
          "Aspirateur, lavage des sols, lessive, pliage et repassage",
          "Changement du linge de lit",
          "Courses et gestion des stocks alimentaires",
          "Aide à la préparation des repas",
          "Maintien de l'ordre et de la propreté du foyer",
          "Prise d'initiative et sens de l'observation",
        ],
        schedule:
          "Environ 30 heures par semaine. Horaires principalement entre 09h00 et 16h00. Le mercredi, sortie d'école pour le plus jeune. Durant les vacances scolaires, l'accent est mis sur l'éveil et l'accompagnement des enfants plutôt que sur les tâches ménagères.",
      },
      de: {
        title:
          "Erfahrene Nanny / Familienassistentin für ein 3-jähriges Kleinkind",
        fullTitle:
          "Erfahrene Nanny / Familienassistentin für ein 3-jähriges Kleinkind gesucht",
        location: "Luxemburg",
        type: "Teilzeit",
        aboutFamily:
          "Für eine engagierte Familie in Luxemburg suchen wir eine herzliche Nanny / Familienassistentin, die eine feste Bezugsperson im Familienalltag werden möchte. Sie betreuen den 3-jährigen Sohn und unterstützen die strukturierte Haushaltsführung.",
        whoLookingFor: [
          "Sie sind herzlich, fürsorglich und engagiert.",
          "Sie ergreifen Initiative und arbeiten eigenständig.",
          "Sie sind verantwortungsbewusst, verlässlich und diskret.",
          "Sie arbeiten strukturiert und haben einen Blick fürs Detail.",
          "Sie kommunizieren klar und respektvoll.",
          "Sie begleiten Kinder geduldig und auf Augenhöhe.",
          "Sie legen großen Wert auf Ordnung, Sauberkeit und Hygiene.",
          "Sie sprechen fließend Französisch.",
          "Sie besitzen einen Führerschein und ein eigenes Auto.",
          "Sie streben eine langfristige Zusammenarbeit in einer Familie an.",
        ],
        tasks: [
          "Tägliche Betreuung des 3-jährigen Sohnes",
          "Spielen, Fördern und altersgerechtes Begleiten",
          "Schaffung einer sicheren und geborgenen Umgebung",
          "Begleitung bei Mahlzeiten und Snacks (unter Beachtung von Allergien)",
          "Einhaltung von Ruhezeiten und Tagesroutinen",
          "Abholung des Vorschulkindes von der Schule nach Bedarf",
          "Staubsaugen, Wischen, Waschen, Zusammenlegen und Bügeln",
          "Wechseln der Bettwäsche",
          "Einkäufe und Vorratshaltung",
          "Unterstützung bei der Zubereitung gesunder Mahlzeiten",
          "Haushalt geordnet und übersichtlich halten",
          "Eigeninitiative und vorausschauendes Mitdenken",
        ],
        schedule:
          "Ca. 30 Stunden pro Woche. Arbeitszeiten überwiegend zwischen 09:00 und 16:00 Uhr. Mittwochs Abholung des Jüngsten von der Schule. In den Schulferien liegt der Schwerpunkt verstärkt auf der Kinderbegleitung.",
      },
    },
  },
  {
    id: "job-2",
    title: "Become a fixture in the lives of three young children",
    fullTitle:
      "Become a fixture in the lives of three young children (4.5yo & 14-month twins)",
    location: "Luxembourg",
    salary: "3600",
    type: "Part-time",
    category: "Nanny & Childcare",
    aboutFamily:
      "For an enterprising and loving family in Luxembourg, we are looking for a family assistant. They have three young children: a 4.5-year-old daughter and 14-month-old twins. It is a warm family where structure, peace and involvement are central.",
    whoLookingFor: [
      "We are looking for a mature, warm and proactive person.",
      "Experience with young children (experience with several children is a plus).",
      "Works independently and takes initiative.",
      "Sees work and likes to help where necessary.",
      "Can bring peace and structure to a family.",
      "Wants to make a long-term commitment.",
      "Someone with a 'second mom/grandma' feeling fits in perfectly here.",
    ],
    tasks: [
      "Child care: Taking care of the children when they are home from school and nursery",
      "Playing, guiding and doing enriching activities",
      "Preparing healthy snacks",
      "Providing peace and structure",
      "Light household support: Tidying up and keeping order",
      "Doing laundry and folding",
      "Light cleaning tasks (vacuuming, cleaning surfaces)",
      "Occasional cooking or meal prep",
      "Organizing living spaces",
    ],
    schedule:
      "On average 16 to 18 hours per week: Monday afternoon 13:00 to 18:00, Tuesday afternoon 13:00 to 18:00 (sometimes until 19:00), Wednesday afternoon 12:00 to 17:00, Saturday morning 09:00 to 13:00 (or 2x per month). Extra hours possible during school holidays and free school days. In time, when the twins go to school, the focus will be more on support after school hours (until about 18:00). Flexibility in consultation.",
    translations: {
      fr: {
        title:
          "Devenez un pilier essentiel dans la vie de trois jeunes enfants",
        fullTitle:
          "Devenez un pilier essentiel dans la vie de trois jeunes enfants (4,5 ans & jumeaux de 14 mois)",
        location: "Luxembourg",
        type: "Temps partiel",
        aboutFamily:
          "Pour une famille dynamique et bienveillante à Luxembourg, nous recherchons une assistante familiale. Ils ont trois jeunes enfants : une fille de 4 ans et demi et des jumeaux de 14 mois. Une famille chaleureuse où structure, calme et écoute sont essentiels.",
        whoLookingFor: [
          "Une personne chaleureuse, mature et proactive.",
          "Expérience confirmée avec les jeunes enfants (expérience avec plusieurs enfants en bas âge appréciée).",
          "Autonome et sachant prendre des initiatives bienvenues.",
          "Sens du service et désir sincère d'aider là où le besoin se fait sentir.",
          "Capacité à instaurer calme, sérénité et structure au foyer.",
          "Souhait d'un engagement stable et durable.",
          "Un profil bienveillant de type 'seconde maman / mamie' s'intégrera à merveille.",
        ],
        tasks: [
          "Garde d'enfants : accueil et soins au retour de l'école et de la crèche",
          "Jeux, activités d'éveil et accompagnement quotidien",
          "Préparation de collations saines",
          "Apport de calme, rythme et sécurité émotionnelle",
          "Soutien domestique léger : rangement et ordre des pièces",
          "Gestion du linge et pliage",
          "Tâches d'entretien légères (aspirateur, surfaces)",
          "Préparation ponctuelle de repas sains",
          "Organisation des espaces de jeux et de vie",
        ],
        schedule:
          "En moyenne 16 à 18 heures par semaine : lundi 13h-18h, mardi 13h-18h (parfois jusqu'à 19h), mercredi 12h-17h, samedi matin 09h-13h (ou 2x par mois). Heures supplémentaires possibles durant les congés scolaires et jours sans école. Flexibilité en concertation.",
      },
      de: {
        title:
          "Werden Sie eine feste Bezugsperson für drei kleine Kinder",
        fullTitle:
          "Werden Sie eine feste Bezugsperson für drei kleine Kinder (4,5 Jahre & 14 Monate alte Zwillinge)",
        location: "Luxemburg",
        type: "Teilzeit",
        aboutFamily:
          "Für eine herzliche und unternehmungslustige Familie in Luxemburg suchen wir eine Familienassistentin für drei kleine Kinder (4,5-jährige Tochter und 14 Monate alte Zwillinge). Ein harmonisches Umfeld, in dem Struktur und Geborgenheit im Fokus stehen.",
        whoLookingFor: [
          "Eine reife, herzliche und proaktive Persönlichkeit.",
          "Erfahrung mit Kleinkindern (Erfahrung mit mehreren Kleinkindern gleichzeitig von Vorteil).",
          "Selbstständige Arbeitsweise und Freude an Eigeninitiative.",
          "Blick für das Wesentliche und Hilfsbereitschaft.",
          "Fähigkeit, Ruhe und feste Strukturen in den Alltag zu bringen.",
          "Wunsch nach einer langfristigen Anstellung.",
          "Ein liebevolles Auftreten wie eine 'zweite Mama/Oma' passt perfekt in diese Familie.",
        ],
        tasks: [
          "Kinderbetreuung: Betreuung nach Kindergarten und Krippe",
          "Altersgerechtes Spielen, Fördern und Begleiten",
          "Zubereitung gesunder Snacks",
          "Sicherstellung von Ruhe und verlässlichen Routinen",
          "Leichte Haushaltsunterstützung: Ordnung halten und Aufräumen",
          "Wäschepflege und Zusammenlegen",
          "Leichte Reinigungsaufgaben (Staubsaugen, Oberflächenpflege)",
          "Gelegentliches Kochen oder Vorbereiten von Mahlzeiten",
          "Wohnbereiche geordnet halten",
        ],
        schedule:
          "Durchschnittlich 16 bis 18 Stunden pro Woche: Montag 13-18 Uhr, Dienstag 13-18 Uhr (gelegentlich bis 19 Uhr), Mittwoch 12-17 Uhr, Samstag 09-13 Uhr (oder 2x im Monat). Zusätzliche Stunden in den Schulferien möglich.",
      },
    },
  },
  {
    id: "job-3",
    title: "French-English-Speaking Live-In Nanny / Childcare Assistant",
    fullTitle:
      "French-English-Speaking Live-In Nanny / Childcare Assistant (CDI 40h)",
    location: "Luxembourg",
    salary: "5500",
    type: "Full-time / Live-in",
    category: "Nanny & Childcare",
    aboutFamily:
      "A private household in Luxembourg is seeking a dedicated, live-in French-English speaking nanny / childcare assistant under a permanent contract (CDI) to provide attentive, nurturing childcare in a private family setting.",
    whoLookingFor: [
      "Minimum 2 years of professional childcare experience in a private family environment.",
      "Fluency in French (essential).",
      "Good working knowledge of English (any additional language desirable).",
      "Strong references from previous employers.",
      "First-aid knowledge is an asset.",
      "Responsible, trustworthy, patient, and highly organized.",
      "Strong childcare, educational, and communication skills.",
      "High discretion and respect for privacy and confidentiality.",
    ],
    tasks: [
      "Daily care of children in a private household",
      "Preparing children for school and extracurricular activities",
      "Supervising homework and educational activities in French",
      "Organizing age-appropriate learning and recreational activities",
      "Preparing children's healthy meals",
      "Maintaining children's living areas, clothing, and belongings",
      "Accompanying children to school, medical appointments, and outings",
      "Assisting with evening routines and occasional babysitting",
    ],
    schedule:
      "40 hours per week under a permanent employment contract (CDI). Live-in arrangement with private accommodations provided. Flexible schedule according to family routines.",
    translations: {
      fr: {
        title:
          "Nounou / Assistante Maternelle Logée Bilingue Français-Anglais (CDI)",
        fullTitle:
          "Nounou / Assistante Maternelle Logée Bilingue Français-Anglais (CDI 40h)",
        location: "Luxembourg",
        type: "Temps plein / Logée",
        aboutFamily:
          "Un ménage privé au Luxembourg recherche une nounou / assistante familiale bilingue français-anglais logée sous contrat à durée indéterminée (CDI) pour l'accompagnement complet et bienveillant des enfants.",
        whoLookingFor: [
          "Minimum 2 ans d'expérience professionnelle dans la garde d'enfants au sein d'un environnement familial.",
          "Excellente maîtrise du français (indispensable).",
          "Bonne maîtrise de travail de l'anglais (autre langue appréciée).",
          "Références solides et vérifiables d'anciens employeurs.",
          "Connaissance des premiers secours appréciée.",
          "Sens aigu des responsabilités, fiabilité, patience et organisation.",
          "Compétences éducatives et bienveillance affirmées.",
          "Respect absolu de la vie privée et discrétion.",
        ],
        tasks: [
          "Soins quotidiens des enfants au sein d'un foyer privé",
          "Préparation des enfants pour l'école et leurs activités périscolaires",
          "Aide aux devoirs et activités éducatives en français",
          "Organisation d'activités ludiques et pédagogiques adaptées à leur âge",
          "Préparation de repas équilibrés pour les enfants",
          "Entretien des espaces de vie, vêtements et affaires des enfants",
          "Accompagnement à l'école, aux rendez-vous médicaux et sorties",
          "Prise en charge des routines du soir et baby-sitting ponctuel",
        ],
        schedule:
          "40 heures par semaine sous contrat à durée indéterminée (CDI). Formule logée avec logement privé mis à disposition. Horaires flexibles selon les impératifs familiaux.",
      },
      de: {
        title:
          "Französisch-Englischsprachige Live-In Nanny / Betreuungsassistentin (CDI)",
        fullTitle:
          "Französisch-Englischsprachige Live-In Nanny / Betreuungsassistentin (CDI 40 Std.)",
        location: "Luxemburg",
        type: "Vollzeit / Live-In",
        aboutFamily:
          "Ein gehobener Privathaushalt in Luxemburg sucht eine engagierte, zweisprachige (Französisch/Englisch) Live-In Nanny im Rahmen eines unbefristeten Festvertrags (CDI) für eine liebevolle und zuverlässige Kinderbetreuung.",
        whoLookingFor: [
          "Mindestens 2 Jahre Berufserfahrung in der Kinderbetreuung in Privathaushalten.",
          "Fließendes Französisch (zwingend erforderlich).",
          "Gute Englischkenntnisse (weitere Sprachen von Vorteil).",
          "Hervorragende Referenzen früherer Arbeitgeber.",
          "Erste-Hilfe-Kenntnisse von Vorteil.",
          "Verantwortungsbewusst, vertrauenswürdig, geduldig und strukturiert.",
          "Ausgeprägte pädagogische Fähigkeiten und Herzenswärme.",
          "Höchste Diskretion und Respekt für die Privatsphäre.",
        ],
        tasks: [
          "Tägliche Betreuung der Kinder im Privathaushalt",
          "Vorbereitung auf Schule und Freizeitaktivitäten",
          "Hausaufgabenbetreuung und Lernförderung auf Französisch",
          "Organisation altersgerechter Spiel- und Freizeitaktivitäten",
          "Zubereitung frischer, kindgerechter Mahlzeiten",
          "Pflege der Kinderbereiche, Kleidung und persönlichen Dinge",
          "Begleitung zur Schule, zu Terminen und Ausflügen",
          "Begleitung der Abendroutine und gelegentliches Babysitting",
        ],
        schedule:
          "40 Stunden pro Woche mit unbefristetem Arbeitsvertrag (CDI). Wohnen im Haushalt mit privatem Wohnbereich. Flexible Zeiteinteilung nach Absprache.",
      },
    },
  },
  {
    id: "job-4",
    title: "Will you be the permanent pillar of this young family?",
    fullTitle: "Permanent Pillar Nanny & Family Assistant (Bonnevoie)",
    location: "Bonnevoie, Luxembourg",
    salary: "4200",
    type: "Part-time / Expandable",
    category: "Nanny & Childcare",
    aboutFamily:
      "For a warm family in Bonnevoie, Luxembourg, we are looking for a reliable and independent nanny / family assistant who guides the children and supports the family in a practical way. You help ensure peace, structure and a smooth course of the daily family life.",
    whoLookingFor: [
      "You have experience with young children, including newborn babies.",
      "You are warm, calm and reliable.",
      "You like to work independently and take initiative.",
      "You are solution-oriented and practical.",
      "You are discreet and have a good sense of what a family needs.",
      "You are consciously looking for a long-term collaboration.",
    ],
    tasks: [
      "Caring for and guiding the children",
      "Play, organize activities and stimulate development",
      "Preparing meals and snacks",
      "Support with daily routines and personal care",
      "Providing peace and structure",
      "Incorporate light household and practical tasks",
      "Help keep the kitchen and living spaces in order",
      "Independently see what is needed within the family",
    ],
    schedule:
      "You will work 27 hours a week, spread over 3 days, from about 8.30 am to 5.30 pm. The start is ideally February–March, but earlier is possible for the right candidate. Possibility of expansion: This position can be extended to full-time employment of 38 hours per week, if you combine family support with administrative tasks for the company.",
    translations: {
      fr: {
        title: "Serez-vous le pilier permanent de cette jeune famille ?",
        fullTitle:
          "Pilier Permanent Nounou & Assistante Familiale (Bonnevoie)",
        location: "Bonnevoie, Luxembourg",
        type: "Temps partiel / Évolutif",
        aboutFamily:
          "Pour une famille bienveillante à Bonnevoie, Luxembourg, nous recherchons une nounou / assistante familiale autonome et fiable pour guider les enfants et soutenir la logistique familiale au quotidien avec douceur et efficacité.",
        whoLookingFor: [
          "Expérience avec les jeunes enfants, y compris les nourrissons.",
          "Personnalité chaleureuse, posée, rassurante et fiable.",
          "Goût pour le travail autonome et la prise d'initiative.",
          "Esprit pragmatique et orienté solutions.",
          "Grande discrétion et perception intuitive des besoins d'une famille.",
          "Recherche sincère d'une relation de confiance à long terme.",
        ],
        tasks: [
          "Soins attentifs et accompagnement bienveillant des enfants",
          "Jeux, activités créatives et soutien au développement de l'autonomie",
          "Préparation des repas et goûters équilibrés",
          "Accompagnement des routines quotidiennes et soins d'hygiène",
          "Instauration d'un cadre serein, structurant et sécurisant",
          "Prise en charge de tâches ménagères légères et pratiques",
          "Maintien de l'ordre dans la cuisine et les espaces partagés",
          "Anticipation proactive des besoins du foyer",
        ],
        schedule:
          "27 heures par semaine réparties sur 3 jours (environ 08h30 à 17h30). Début souhaité idéalement février-mars (ou plus tôt pour le bon profil). Possibilité d'évolution : le poste peut évoluer vers un temps plein de 38h/semaine en associant des missions administratives pour l'entreprise familiale.",
      },
      de: {
        title:
          "Möchten Sie die dauerhafte Stütze dieser jungen Familie werden?",
        fullTitle:
          "Dauerhafte Stütze: Nanny & Familienassistentin (Bonnevoie)",
        location: "Bonnevoie, Luxemburg",
        type: "Teilzeit / Erweiterbar",
        aboutFamily:
          "Für eine herzliche Familie in Bonnevoie suchen wir eine zuverlässige und eigenständige Nanny / Familienassistentin, die den Kindern Halt gibt und den Alltag der Familie tatkräftig unterstützt.",
        whoLookingFor: [
          "Erfahrung mit Kleinkindern und Neugeborenen.",
          "Herzliche, ruhige und verlässliche Art.",
          "Selbstständige Arbeitsweise und Freude an Eigeninitiative.",
          "Lösungsorientiertes und praktisches Denken.",
          "Diskretion und Feingefühl für die Bedürfnisse einer Familie.",
          "Bewusstes Streben nach einer langfristigen Zusammenarbeit.",
        ],
        tasks: [
          "Liebevolle Betreuung und Begleitung der Kinder",
          "Spielen, Aktivitäten gestalten und Entwicklung fördern",
          "Zubereitung frischer Mahlzeiten und Snacks",
          "Unterstützung bei täglichen Routinen und Körperpflege",
          "Struktur, Ruhe und Geborgenheit vermitteln",
          "Leichte hauswirtschaftliche und praktische Aufgaben übernehmen",
          "Küche und Wohnräume in ordentlichem Zustand halten",
          "Vorausschauend erkennen, wo Unterstützung gebraucht wird",
        ],
        schedule:
          "27 Stunden pro Woche an 3 Tagen von ca. 08:30 bis 17:30 Uhr. Beginn idealerweise Februar-März (früher möglich). Erweiterungsmöglichkeit: Vollzeitbeschäftigung mit 38 Stunden pro Woche bei Kombination mit administrativen Aufgaben für das Familienunternehmen.",
      },
    },
  },
  {
    id: "job-5",
    title:
      "Strong with children and administration? This is your unique combination job",
    fullTitle:
      "Childcare & Executive Administrative Assistant (Strassen)",
    location: "Strassen, Luxembourg",
    salary: "4800",
    type: "Full-time / Part-time",
    category: "Childcare & Concierge Support",
    aboutFamily:
      "For an enterprising family in Strassen, we are looking for a versatile and reliable candidate who wants to combine childcare and administrative support. You will become an important pillar of support for the family and also support the company from the home.",
    whoLookingFor: [
      "You have experience with newborn babies and young children.",
      "You preferably have experience with administrative or organizational tasks.",
      "You are digitally skilled and work accurately.",
      "You work independently and take initiative.",
      "You are organizationally strong and can set priorities well.",
      "You are calm and solution-oriented.",
      "You are discreet, reliable and responsible.",
      "You are looking for a long-term partnership.",
    ],
    tasks: [
      "Caring for and guiding the children",
      "Providing structure and peace",
      "Activities and games with the children",
      "Preparing meals and snacks",
      "Practical support within the family and light household chores",
      "Manage email and calendars",
      "Organizing and following up on appointments",
      "Structuring documents and processing administrative tasks",
      "Providing organizational support to the company from the home",
    ],
    schedule:
      "You work full-time, 38 hours a week. The administrative work is done from the house. The start is ideally November–January, but earlier is possible for the right candidate. Prefer fewer hours? The position can also be filled as a part-time employment of 27 hours per week, spread over three days. In that case, the focus is entirely on child care and family support, without administrative tasks.",
    translations: {
      fr: {
        title:
          "À l'aise avec les enfants et l'administration ? Un poste combiné unique",
        fullTitle:
          "Garde d'Enfants & Assistante Administrative Polyvalente (Strassen)",
        location: "Strassen, Luxembourg",
        type: "Temps plein / Temps partiel",
        aboutFamily:
          "Pour une famille d'entrepreneurs à Strassen, nous recherchons un profil polyvalent et fiable combinant garde d'enfants et soutien administratif. Vous devenez un pilier essentiel de la famille tout en prêtant main forte à l'entreprise depuis le domicile.",
        whoLookingFor: [
          "Expérience avec les nourrissons et jeunes enfants.",
          "Expérience préalable souhaitée dans des tâches administratives ou d'organisation.",
          "Aisance avec les outils numériques et rigueur d'exécution.",
          "Grande autonomie et sens proactif de l'initiative.",
          "Excellentes compétences organisationnelles et gestion claire des priorités.",
          "Tempérament calme, posé et tourné vers les solutions.",
          "Discrétion, sens des responsabilités et fiabilité à toute épreuve.",
          "Recherche d'un partenariat de confiance à long terme.",
        ],
        tasks: [
          "Soins, éveil et accompagnement des enfants",
          "Maintien d'un cadre serein et structurant",
          "Activités d'éveil et jeux interactifs",
          "Préparation des repas et collations saines",
          "Soutien pratique au quotidien et tâches ménagères légères",
          "Gestion des e-mails et agendas électroniques",
          "Organisation et suivi des rendez-vous",
          "Classement documentaire et traitement de tâches administratives courantes",
          "Appui logistique et organisationnel à l'entreprise depuis la résidence",
        ],
        schedule:
          "Temps plein à 38 heures par semaine (travail administratif effectué depuis le domicile). Début souhaité novembre-janvier (ou plus tôt). Préférence pour moins d'heures ? Ce poste peut également être pourvu à temps partiel (27 heures/semaine sur 3 jours), concentré à 100% sur les enfants et la vie de famille, sans volet administratif.",
      },
      de: {
        title:
          "Stark in Kinderbetreuung und Administration? Einzigartige Kombi-Stelle",
        fullTitle:
          "Kinderbetreuung & Administrative Assistenz im Privathaushalt (Strassen)",
        location: "Strassen, Luxemburg",
        type: "Vollzeit / Teilzeit",
        aboutFamily:
          "Für eine unternehmerische Familie in Strassen suchen wir eine vielseitige und verlässliche Persönlichkeit, die Kinderbetreuung mit büroorganisatorischer Assistenz verbindet. Sie werden eine wichtige Stütze im Familienalltag und unterstützen das Unternehmen vom Haus aus.",
        whoLookingFor: [
          "Erfahrung mit Neugeborenen und Kleinkindern.",
          "Idealerweise Erfahrung im administrativen oder organisatorischen Bereich.",
          "Digitale Kompetenz und sorgfältige Arbeitsweise.",
          "Eigeninitiative und selbstständiges Handeln.",
          "Organisationstalent mit sicherem Gespür für Prioritäten.",
          "Ruhige, besonnene und lösungsorientierte Grundeinstellung.",
          "Hohe Diskretion, Zuverlässigkeit und Pflichtbewusstsein.",
          "Interesse an einer langfristigen partnerschaftlichen Anstellung.",
        ],
        tasks: [
          "Liebevolle Betreuung und Begleitung der Kinder",
          "Gewährleistung von Ruhe und verlässlicher Struktur",
          "Fördernde Spiele und Freizeitbeschäftigungen",
          "Zubereitung von Mahlzeiten und gesunden Snacks",
          "Praktische Alltagsentlastung und leichte Haushaltsaufgaben",
          "E-Mail- und Terminkoordination",
          "Organisation und Nachbereitung von Terminen",
          "Dokumentenablage und Abwicklung administrativer Vorgänge",
          "Organisatorische Unterstützung des Unternehmens direkt vom Haus aus",
        ],
        schedule:
          "Vollzeit mit 38 Wochenstunden (Büroarbeit erfolgt im Privathaus). Beginn idealerweise November-Januar (früher möglich). Weniger Stunden gewünscht? Auch als Teilzeitstelle mit 27 Stunden pro Woche an drei Tagen möglich – in diesem Fall liegt der Schwerpunkt rein auf der Kinderbetreuung ohne Administration.",
      },
    },
  },
];

export function getLocalizedJob(job: JobVacancy, locale: Locale) {
  const tr = job.translations?.[locale];
  if (!tr || locale === "en") return job;
  return {
    ...job,
    title: tr.title || job.title,
    fullTitle: tr.fullTitle || job.fullTitle || tr.title,
    location: tr.location || job.location,
    type: tr.type || job.type,
    aboutFamily: tr.aboutFamily || job.aboutFamily,
    whoLookingFor: tr.whoLookingFor?.length
      ? tr.whoLookingFor
      : job.whoLookingFor,
    tasks: tr.tasks?.length ? tr.tasks : job.tasks,
    schedule: tr.schedule || job.schedule,
  };
}
