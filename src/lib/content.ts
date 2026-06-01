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
    body: "10 to 30 booked appointments on your calendar every 90 days. You hire, invest, and plan with confidence because the calendar fills itself.",
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
    body: "If you don't get 10 booked appointments in 90 days, we refund the monthly retainer. Our revenue is on the line alongside yours.",
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
    body: "Campaigns go live. AI follow-up kicks in. First booked appointments hit your calendar within 14 days of launch.",
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
    category: "Ads",
    items: [
      "Meta + Google account setup",
      "Geo-targeted campaign build",
      "Weekly creative refresh",
      "Continuous bid + budget optimisation",
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
    q: "What happens if you don't hit 10 booked appointments in 90 days?",
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
  {
    q: "Can you guarantee 30 appointments instead of 10?",
    a: "No. 10 is the floor of the guarantee. 30 is what we typically hit, but we don't promise what we can't refund-back. The guarantee is conservative on purpose.",
  },
];

export const about = {
  name: "Charlie Tay",
  initials: "CT",
  paragraphs: [
    "Charlie started NorthSend after four years running ads exclusively for clinics, and watching too many practice owners get burned by agencies that delivered clicks instead of patients.",
    "Every agency he competed against had the same playbook: sell a retainer, deliver a dashboard, and disappear when results didn't materialise. The clinic carried all the risk. The agency carried none.",
    "NorthSend exists for one reason: to put our revenue on the line alongside our clients'. If we don't deliver 10 to 30 booked patient appointments in 90 days, we refund every dollar of the retainer.",
  ],
};

export const hero = {
  eyebrow: "Patient acquisition for clinics",
  headlineLine1: "Booked patients.",
  headlineLine2Pre: "Guaranteed in ",
  headlineLine2Accent: "90 days.",
  sub: "Most agencies sell you clicks and call it growth. We guarantee 10 to 30 booked patient appointments in 90 days, or you don't pay.",
  trust: [
    "4+ years in the clinic vertical",
    "Refund-backed guarantee",
    "First bookings in 14 days",
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
