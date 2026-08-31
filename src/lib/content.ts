/**
 * NorthSend landing page content.
 * Single source of truth. Both /light and /dark pages render from this.
 *
 * Style rules (see CLAUDE.md):
 *   - No em dashes (—). No en-dash ranges (–).
 *   - Hyphens in compound words are fine (AI follow-up, 30-minute).
 */

export type Step = {
  n: string;
  title: string;
  body: string;
};

export type ProcessStep = Step & { when: string };

export const accentRotation = ["sky", "amber", "emerald", "violet"] as const;
export type AccentColor = (typeof accentRotation)[number];

export const painPoints: Array<{ title: string; body: string }> = [
  {
    title: "Unqualified leads burning your front desk",
    body: "Your front desk burns hours chasing leads who never intended to book. Conversion sits in the single digits and nobody can tell you why.",
  },
  {
    title: "Slow follow-up killing conversion",
    body: "By the time someone calls a lead back the next day, they've already booked with a competitor. Most clinics respond in 24+ hours. Patients decide in 5 minutes.",
  },
  {
    title: "Unpredictable patient flow",
    body: "Some months are booked solid. The next is dead. You can't hire, you can't invest, you can't plan, because you don't know what next month looks like.",
  },
  {
    title: "Agencies that deliver dashboards, not patients",
    body: "$2k+/month for weekly reports full of impressions, CTRs, and 'optimisation summaries'. The chairs are still empty.",
  },
];

export const benefits: Array<{ title: string; body: string }> = [
  {
    title: "Predictable booked appointments",
    body: "30 to 50 booked appointments on your calendar every 90 days. You hire, invest, and plan with confidence because the calendar fills itself.",
  },
  {
    title: "Sub-5-minute response on every lead",
    body: "AI follow-up calls, texts, and qualifies every new lead in under 5 minutes, 24/7. You book the ones who are ready, ignore the rest.",
  },
  {
    title: "A system you own, not rent",
    body: "When you stop working with us, you keep the ads, the funnel, the automations, and the patient data. We build systems, not dependencies.",
  },
  {
    title: "Skin in the game, every month",
    body: "If you don't get 30 booked appointments in 90 days, we refund the monthly retainer. Our revenue is on the line alongside yours.",
  },
];

export const systems: Step[] = [
  {
    n: "01",
    title: "Ad system",
    body: "Meta + Google ads built specifically for clinics. Geo-targeted to a 30-minute drive radius around your practice. Creative refreshed weekly.",
  },
  {
    n: "02",
    title: "Funnel system",
    body: "High-converting landing page tuned to your specialty. Educates, qualifies, and books, without your team lifting a finger.",
  },
  {
    n: "03",
    title: "AI follow-up system",
    body: "AI automations that text, call, and re-engage every lead in under 5 minutes. Books the ready, nurtures the not-yet-ready.",
  },
  {
    n: "04",
    title: "Reporting + ownership",
    body: "Weekly performance dashboards. Full asset handover: ads, funnel, automations, data. You own everything we build.",
  },
];

export const process: ProcessStep[] = [
  {
    n: "01",
    title: "Discovery & strategy",
    when: "Week 1",
    body: "We audit your current funnel, ad spend, and conversion rate. We tell you up-front whether we can hit the guarantee, and walk away if we can't.",
  },
  {
    n: "02",
    title: "Build & launch",
    when: "Weeks 2 to 3",
    body: "We build the ads, landing page, AI follow-up sequences, and calendar integration. You review everything before it goes live.",
  },
  {
    n: "03",
    title: "First booked appointments",
    when: "Week 4",
    body: "Campaigns go live. AI follow-up kicks in. First booked appointments hit your calendar within 10 days of launch.",
  },
  {
    n: "04",
    title: "Scale & optimise",
    when: "Months 2 to 3",
    body: "Weekly performance reviews. Continuous ad and copy testing. We push cost-per-booked-appointment down every month.",
  },
];

export const deliverables: Array<{ category: string; items: string[] }> = [
  {
    category: "Strategy",
    items: [
      "Patient acquisition audit",
      "90-day campaign roadmap",
      "Offer engineering session",
    ],
  },
  {
    category: "Google Ads",
    items: [
      "Google Ads account setup + structure",
      "Geo-targeted Search + Performance Max build",
      "Conversion tracking + GA4 setup",
      "Weekly ad copy refresh + bid optimisation",
    ],
  },
  {
    category: "Funnel",
    items: [
      "Custom landing page",
      "A/B tested headlines + offers",
      "Calendar booking integration",
      "Mobile-first build (60%+ traffic)",
    ],
  },
  {
    category: "AI follow-up",
    items: [
      "SMS + email sequences",
      "AI voice agent (sub-5-min response)",
      "Lead scoring + qualification",
      "Re-engagement automations",
    ],
  },
  {
    category: "Reporting",
    items: [
      "Weekly performance dashboard",
      "Monthly strategy review call",
      "Full data + asset ownership",
      "Slack support channel",
    ],
  },
];

export const faqs: Array<{ q: string; a: string }> = [
  {
    q: "What happens if you don't hit 30 booked appointments in 90 days?",
    a: "We refund every dollar of the monthly retainer. The setup fee covers our build cost and stays. The retainer is fully refundable. Our revenue is genuinely on the line.",
  },
  {
    q: "Do I need to sign a long-term contract?",
    a: "No. The engagement is 90 days. After that we go month-to-month. You can leave any time and keep everything we built: ads, funnel, automations, patient data.",
  },
  {
    q: "What if I already have a website, agency, or Google Ads account?",
    a: "We can either rebuild from scratch or take over what you have. Either way, we audit it first and tell you the honest truth, including walking away if the existing setup is good enough.",
  },
  {
    q: "What ad spend do I need on top of the retainer?",
    a: "Most clinics need $1,500 to $3,000 per month in ad spend to hit the guarantee. We tell you the exact number for your specialty and geography before you sign.",
  },
  {
    q: "Which clinic verticals do you work with?",
    a: "Dental, aesthetics, physiotherapy, chiropractic, dermatology, LASIK, hair transplant, cosmetic surgery. If you're outside these, we'll tell you up-front. We don't take work we can't guarantee.",
  },
];

export const about = {
  name: "Charlie Tay",
  initials: "CT",
  paragraphs: [
    "Charlie started NorthSend after five years running ads exclusively for clinics, and watching too many practice owners get burned by agencies that delivered clicks instead of patients.",
    "Every agency he competed against had the same playbook: sell a retainer, deliver a dashboard, and disappear when results didn't materialise. The clinic carried all the risk. The agency carried none.",
    "NorthSend exists for one reason: to put our revenue on the line alongside our clients'. If we don't deliver 30 to 50 booked patient appointments in 90 days, we refund every dollar of the retainer.",
  ],
};

/**
 * Clinic logo carousel (below hero). Real logo files for the accounts behind
 * the case studies, pulled from each clinic's own site into /public/logos/.
 * Rendered as uniform monochrome (ink silhouette) in a rotating marquee so the
 * wildly different logos read as one cohesive trust strip. This also fixes the
 * two logos (ellim, denscare) that ship as white-on-transparent for dark headers
 * and would otherwise be invisible on the cream background.
 * `imgClass` overrides the default sizing per logo (e.g. the square ellim mark).
 */
export type ClinicLogo = { src: string; alt: string; imgClass?: string };

export const clinicLogos: ClinicLogo[] = [
  { src: "/logos/aklinik.png", alt: "A Klinik" },
  { src: "/logos/denscare.svg", alt: "Dens Care" },
  { src: "/logos/azurose.png", alt: "Klinik Azurose" },
  { src: "/logos/dentalane.png", alt: "Klinik Pergigian Dentalane" },
  { src: "/logos/medicura.png", alt: "Klinik Medicura" },
  { src: "/logos/regenesis.png", alt: "Regenesis Physiotherapy" },
  {
    src: "/logos/ellim.png",
    alt: "E.L. Lim Dental Surgery",
    imgClass: "max-h-14 max-w-[72px]",
  },
];

/**
 * Case studies. Real clinic accounts from Charlie's 5+ years running ads
 * for clinics. Displayed ANONYMISED (clinic type + generic descriptor, no name,
 * no region). Rendered by <CaseStudyCarousel /> as outcome-led cards, each with
 * a "proof panel" mini-dashboard built from real Google Ads data.
 *
 * CURRENCY: AUD. Source data is MYR; converted MYR -> USD @4.07 -> AUD @1.4406
 * (i.e. MYR x 0.35396), rate as of 2026-07-10.
 *
 * What is REAL (from Google Ads via Windsor, trailing 12 months):
 *   - `leadsTotal`, `spend`, cost-per-lead, and the `monthly` lead series.
 * What is ESTIMATED:
 *   - booked appointments = 20% of leads (below the 25%+ benchmark, on purpose)
 *   - revenue = booked x conservative first-case value per vertical, in AUD
 *     (Dental A$432, Implants A$1,729, Physio/Aesthetic A$360, Medical A$115)
 *
 * A KLINIK (card 1) = the AESTHETIC / med-spa side only. Charlie asked for "AKS
 * campaigns / aesthetic only". Taken as ALL aesthetic campaigns (AKS/Signature +
 * HIFU, Ultherapy, Acne, Pico, Slimming, Hair Loss, Pigmentation, Ellanse),
 * EXCLUDING the medical AKM / knee / GP campaigns. The literally-"AKS"-named
 * campaigns alone only launched ~Feb 2026 (1,166 leads, mostly-empty trend), so
 * the broader aesthetic set is used for a real 12-month story.
 *
 * `hero` is the single most impactful honest number for that clinic.
 * `monthly` is 12 months of real leads (Jul 2025 -> Jun 2026) for the trend bars.
 * Ordered by lead volume, descending.
 */
export type CaseStudyStat = { value: string; label: string; est?: boolean };

export type CaseStudy = {
  sector: string;
  hero: { value: string; unit: string; est?: boolean };
  context: string;
  stats: CaseStudyStat[];
  leadsTotal: string;
  spend: string;
  monthly: number[];
};

export const caseStudies: CaseStudy[] = [
  {
    sector: "Aesthetic · med spa",
    hero: { value: "6,469", unit: "leads" },
    context:
      "6,469 aesthetic leads in twelve months across skin, HIFU, Ultherapy and slimming treatments.",
    stats: [
      { value: "1,294", label: "Booked appts" },
      { value: "A$38,820", label: "Revenue / mo", est: true },
    ],
    leadsTotal: "6,469",
    spend: "A$196,969",
    monthly: [395, 371, 367, 422, 638, 948, 932, 727, 968, 225, 223, 254],
  },
  {
    sector: "Dental · general & braces",
    hero: { value: "1,279", unit: "booked appointments" },
    context:
      "6,397 real leads in twelve months, an estimated 1,279 booked appointments.",
    stats: [
      { value: "6,397", label: "Leads" },
      { value: "A$46,044", label: "Revenue / mo", est: true },
    ],
    leadsTotal: "6,397",
    spend: "A$43,919",
    monthly: [528, 468, 518, 550, 546, 680, 534, 513, 541, 492, 513, 514],
  },
  {
    sector: "Medical · primary care",
    hero: { value: "1,078", unit: "booked appointments" },
    context:
      "5,389 leads in twelve months, an estimated 1,078 booked appointments.",
    stats: [
      { value: "5,389", label: "Leads" },
      { value: "A$10,331", label: "Revenue / mo", est: true },
    ],
    leadsTotal: "5,389",
    spend: "A$20,602",
    monthly: [492, 307, 351, 526, 462, 459, 467, 410, 413, 353, 613, 537],
  },
  {
    sector: "Dental · general & cosmetic",
    hero: { value: "577", unit: "booked appointments" },
    context:
      "2,887 leads over twelve months, an estimated 577 booked appointments.",
    stats: [
      { value: "2,887", label: "Leads" },
      { value: "A$20,772", label: "Revenue / mo", est: true },
    ],
    leadsTotal: "2,887",
    spend: "A$14,246",
    monthly: [210, 146, 150, 102, 150, 177, 190, 241, 246, 758, 323, 194],
  },
  {
    sector: "Medical · family clinic",
    hero: { value: "503", unit: "booked appointments" },
    context:
      "2,515 leads for a neighbourhood family clinic, steady month after month.",
    stats: [
      { value: "2,515", label: "Leads" },
      { value: "A$4,820", label: "Revenue / mo", est: true },
    ],
    leadsTotal: "2,515",
    spend: "A$14,245",
    monthly: [137, 107, 227, 218, 201, 245, 257, 257, 220, 200, 206, 240],
  },
  {
    sector: "Physio & chiro · sports rehab",
    hero: { value: "339", unit: "booked appointments" },
    context:
      "1,697 leads for a sports physiotherapy and chiro practice.",
    stats: [
      { value: "1,697", label: "Leads" },
      { value: "A$10,170", label: "Revenue / mo", est: true },
    ],
    leadsTotal: "1,697",
    spend: "A$17,682",
    monthly: [92, 160, 192, 177, 161, 184, 146, 116, 148, 132, 113, 77],
  },
  {
    sector: "Dental · implants only",
    hero: { value: "A$15,561", unit: "monthly revenue" },
    context:
      "An implants-only practice. 539 high-intent leads at premium case value per patient.",
    stats: [
      { value: "539", label: "Leads" },
      { value: "108", label: "Booked appts" },
    ],
    leadsTotal: "539",
    spend: "A$11,660",
    monthly: [24, 36, 51, 50, 55, 54, 62, 39, 43, 46, 56, 24],
  },
];

export const hero = {
  eyebrow: "Patient acquisition for clinics",
  headlineLine1: "Booked patients.",
  headlineLine2Pre: "Guaranteed in ",
  headlineLine2Accent: "90 days.",
  sub: "Most agencies sell you clicks and call it growth. We guarantee 30 to 50 booked patient appointments in 90 days, or you don't pay.",
  trust: [
    "5+ years in the clinic vertical",
    "Refund-backed guarantee",
    "First bookings in 10 days",
  ],
  primaryCta: "Book your strategy call",
  secondaryCta: "See how it works",
};

export const closer = {
  eyebrow: "Limited capacity, Q3 2026",
  headlineLine1: "Your ",
  headlineAccent: "growth engine",
  headlineLine2: "starts here.",
  sub: "Free strategy call. Audit of your current setup. Custom 90-day roadmap. Zero pressure, zero obligation.",
  cta: "Book your free strategy call",
};
