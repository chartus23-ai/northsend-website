import type { Metadata } from "next";
import { MarkDark } from "@/components/brand/Logo";
import { IconCheck, IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Deliverables: everything we build, launch, and hand over | NorthSend",
  description:
    "The full NorthSend patient acquisition system, itemised. Strategy, Google Ads, conversion tracking, funnel, AI follow-up, and reporting. You own all of it.",
  alternates: { canonical: "/deliverables" },
};

/* Page-local detailed breakdown. The homepage "What You Actually Get" strip
   stays high-level (src/lib/content.ts); this page is the deep, itemised view.
   Google-only ad stack (Meta dropped for now) with a dedicated conversion
   tracking group. Colour rotation per CLAUDE.md: forest, gold, clay, teal. */
type Group = {
  category: string;
  blurb: string;
  items: string[];
  conditional?: string;
};

const groups: Group[] = [
  {
    category: "Strategy",
    blurb:
      "Before a dollar is spent, we map the math: who you target, what you offer, and the exact path to the guarantee.",
    items: [
      "Patient acquisition audit (current spend, cost-per-booking, conversion rate)",
      "90-day campaign roadmap with booked-appointment targets",
      "Offer engineering session (the hook patients actually book on)",
      "Competitor and local-market review",
    ],
  },
  {
    category: "Google Ads",
    blurb:
      "A Google-first ad system built specifically for clinics, geo-targeted to a drive-time radius around your practice.",
    items: [
      "Google Ads account setup + campaign architecture",
      "Search campaigns tuned to high-intent patient queries",
      "Performance Max for Search partners, Maps, and YouTube",
      "Keyword + search-term research per specialty",
      "Negative keyword lists, maintained weekly",
      "Geo-targeting to your drive-time radius",
      "Responsive search ads, refreshed weekly",
      "Bid strategy + budget optimisation toward target cost-per-booking",
    ],
  },
  {
    category: "Conversion tracking",
    blurb:
      "The plumbing that ties every ad dollar to a booked appointment. This is where most agencies cut corners. We do not.",
    items: [
      "Google Ads conversion actions for forms, calls, and bookings",
      "GA4 + Google Tag Manager install and configuration",
      "Enhanced conversions for leads (hashed first-party data)",
      "Call tracking, with qualified calls counted as conversions",
      "Offline conversion import: booked appointments fed back into Google",
      "Conversion-value tracking toward cost-per-booked-appointment",
      "Event mapping across the funnel (view, lead, call, booking)",
      "Tracking QA + validation before launch",
    ],
  },
  {
    category: "Funnel",
    blurb:
      "A landing page and booking flow tuned to your specialty, built to educate, qualify, and book without your team lifting a finger.",
    items: [
      "Custom landing page matched to your specialty",
      "A/B tested headlines + offers",
      "Calendar booking integration",
      "Mobile-first build (60%+ of clinic traffic is mobile)",
      "Compliance-aware copy from day one",
    ],
  },
  {
    category: "AI follow-up",
    blurb:
      "Layered in when your current follow-up speed cannot hit the booking math. Contacts and qualifies every lead within 5 minutes, day or night.",
    conditional: "Layered in when your follow-up speed needs it",
    items: [
      "SMS + email follow-up sequences",
      "AI voice agent with sub-5-minute response",
      "Lead scoring + qualification",
      "Re-engagement automations for the not-yet-ready",
    ],
  },
  {
    category: "Reporting + ownership",
    blurb:
      "One dashboard, one number that matters: cost per booked appointment. Plus full handover of everything we build.",
    items: [
      "Weekly performance dashboard",
      "Monthly strategy review call",
      "Full data + asset ownership (ads, funnel, automations, tracking)",
      "Slack support channel",
    ],
  },
];

const accents = [
  { text: "text-forest-600", chip: "border-forest-200 bg-forest-50 text-forest-700", ring: "border-forest-200" },
  { text: "text-gold-600", chip: "border-gold-200 bg-gold-50 text-gold-700", ring: "border-gold-200" },
  { text: "text-clay-500", chip: "border-clay-300/60 bg-clay-100 text-clay-700", ring: "border-clay-300/50" },
  { text: "text-teal-500", chip: "border-teal-300/60 bg-teal-100 text-teal-700", ring: "border-teal-300/50" },
];
const accentFor = (i: number) => accents[i % accents.length];

const totalItems = groups.reduce((n, g) => n + g.items.length, 0);

const Container = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mx-auto w-full max-w-[1200px] px-6 md:px-10 ${className}`}>
    {children}
  </div>
);

const Eyebrow = ({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "gold" | "green";
}) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm ${
      tone === "gold"
        ? "border-gold-300 bg-gold-50 text-gold-700"
        : tone === "green"
        ? "border-forest-200/70 bg-forest-50 text-forest-700"
        : "border-paper-3 bg-paper text-ink-500"
    }`}
  >
    {children}
  </div>
);

const LockupBrand = () => (
  <div className="inline-flex items-center gap-3">
    <MarkDark className="h-7 w-7" />
    <span className="text-lg font-extrabold tracking-[-0.025em] text-ink-900">
      NorthSend
    </span>
  </div>
);

export default function DeliverablesPage() {
  return (
    <div className="bg-paper text-ink-900">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-paper-3 bg-paper/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center">
            <LockupBrand />
          </a>
          <nav className="hidden items-center gap-8 text-sm text-ink-500 md:flex">
            <a href="/#process" className="transition hover:text-ink-900">Process</a>
            <a href="/#results" className="transition hover:text-ink-900">Results</a>
            <a href="/deliverables" className="font-semibold text-ink-900">Deliverables</a>
            <a href="/#faq" className="transition hover:text-ink-900">FAQ</a>
          </nav>
          <a
            href="/#calendar"
            className="group inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-paper transition hover:bg-forest-700 hover:shadow-[0_10px_30px_-10px_rgba(11,58,42,0.4)] sm:gap-2 sm:px-5 sm:py-2.5"
          >
            <span className="sm:hidden">Book call</span>
            <span className="hidden sm:inline">Book strategy call</span>
            <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </a>
        </Container>
      </header>

      <main>
        {/* HEADER */}
        <section className="relative overflow-hidden border-b border-paper-3">
          <div className="glow-hero pointer-events-none absolute inset-0" />
          <Container className="relative pt-20 pb-16 md:pt-28 md:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow tone="gold">What&rsquo;s included</Eyebrow>
              <h1 className="font-serif mt-8 text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink-900 md:text-6xl">
                Everything we build, launch,
                <br />
                <span className="italic text-forest-600">and hand over.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-ink-500">
                The full patient acquisition system, itemised. From the first
                strategy session to the last line of conversion tracking. Every
                piece is built for your clinic, and every piece is yours to keep.
              </p>

              {/* Stat row */}
              <div className="mt-10 inline-flex flex-wrap items-center justify-center divide-x divide-paper-3 rounded-2xl border border-paper-3 bg-paper text-center shadow-sm">
                {[
                  { k: `${groups.length}`, v: "systems" },
                  { k: `${totalItems}`, v: "deliverables" },
                  { k: "100%", v: "yours to keep" },
                ].map((s) => (
                  <div key={s.v} className="px-6 py-4 md:px-8">
                    <div className="font-serif text-3xl font-semibold text-forest-600">
                      {s.k}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FULL LIST */}
        <section className="border-t border-paper-3 py-20 md:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>The full list</Eyebrow>
              <h2 className="font-serif mt-6 text-3xl font-semibold leading-tight tracking-tight text-ink-900 md:text-4xl">
                Every deliverable, itemised.
              </h2>
            </div>

            <div className="mt-14 space-y-5">
              {groups.map((g, i) => {
                const c = accentFor(i);
                const id = g.category.toLowerCase().replace(/[^a-z]+/g, "-");
                return (
                  <div
                    key={g.category}
                    id={id}
                    className="scroll-mt-24 rounded-2xl border border-paper-3 bg-paper p-8 md:p-10"
                  >
                    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                      <div>
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm font-bold ${c.chip}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink-900">
                          {g.category}
                        </h3>
                        {g.conditional && (
                          <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${c.chip}`}>
                            {g.conditional}
                          </span>
                        )}
                        <p className="mt-4 text-base leading-relaxed text-ink-500">
                          {g.blurb}
                        </p>
                      </div>

                      <ul className="grid gap-3.5 sm:grid-cols-2 md:content-start">
                        {g.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-base text-ink-700"
                          >
                            <IconCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* OWNERSHIP BAND */}
        <section className="border-y border-paper-3 bg-forest-50/40 py-16">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow tone="green">You own everything</Eyebrow>
              <h2 className="font-serif mt-6 text-3xl font-semibold leading-tight tracking-tight text-ink-900 md:text-4xl">
                When the 90 days end,{" "}
                <span className="italic text-forest-600">you keep all of it.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-500">
                Ads, funnel, automations, tracking, and data. Everything is built
                inside your accounts, in your name. No lock-in, no hostage
                situation. If you leave, you walk away with the whole system.
              </p>
            </div>
          </Container>
        </section>

        {/* WHAT'S SEPARATE — honest-math boundary */}
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <Eyebrow>Honest math</Eyebrow>
                <h2 className="font-serif mt-6 text-3xl font-semibold leading-tight tracking-tight text-ink-900 md:text-4xl">
                  What&rsquo;s separate, so there are no surprises.
                </h2>
              </div>
              <div className="mt-10 rounded-2xl border border-paper-3 bg-paper-2 p-8 md:p-10">
                <ul className="space-y-5">
                  {[
                    {
                      t: "Ad spend",
                      b: "$1,500 to $3,000 per month, paid directly to Google, not to us. We tell you the exact number for your specialty and geography before you sign.",
                    },
                    {
                      t: "Third-party software",
                      b: "Any tools we set up (booking, call tracking, CRM) run on your own subscriptions where they carry an outside cost. We recommend the leanest stack that hits the math.",
                    },
                  ].map((x) => (
                    <li key={x.t} className="flex items-start gap-4">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold-500" />
                      <div>
                        <div className="text-base font-bold text-ink-900">{x.t}</div>
                        <p className="mt-1 text-base leading-relaxed text-ink-500">{x.b}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-paper-3 bg-paper py-10">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <MarkDark className="h-7 w-7" />
            <div>
              <div className="text-sm font-bold text-ink-900">NorthSend</div>
              <div className="text-xs text-ink-400">Booked patients. Guaranteed.</div>
            </div>
          </div>
          <div className="text-xs text-ink-400">
            ©{new Date().getFullYear()} NorthSend. Built for clinics that take growth seriously.
          </div>
        </Container>
      </footer>
    </div>
  );
}
