import Image from "next/image";
import { MarkDark } from "@/components/brand/Logo";
import {
  IconCheck,
  IconX,
  IconArrowRight,
  IconChevronDown,
} from "@/components/icons";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { WistiaEmbed } from "@/components/WistiaEmbed";
import {
  process,
  deliverables,
  about,
  hero,
  closer,
} from "@/lib/content";

/* Hero marquee: clinic verticals we serve. Matches the FAQ list exactly.
   Order set by Charlie. Kept strictly clinic-only to protect the
   "5+ years exclusively for clinics" positioning and the specialist
   brand value. Broadening to spas / professional services was tried
   and reverted — dilutes the differentiation. */
const v2Industries = [
  "Dental clinics",
  "Aesthetic clinics",
  "Physiotherapy",
  "Chiropractic",
  "Dermatology",
  "LASIK",
  "Hair transplant",
  "Cosmetic surgery",
];

/* v2-specific: AI follow-up repositioned as a conditional layer, not
   a universal default. Card #3 body copy acknowledges the conditionality
   subtly — we still keep AI follow-up in the system narrative for
   prospects who need it, but we no longer pretend every clinic gets it. */
const v2Systems = [
  {
    n: "01",
    title: "Ad system",
    body:
      "Meta + Google ads built specifically for clinics. Geo-targeted to a 30-minute drive radius around your practice. Creative refreshed weekly.",
  },
  {
    n: "02",
    title: "Funnel system",
    body:
      "High-converting landing page tuned to your specialty. Educates, qualifies, and books, without your team lifting a finger.",
  },
  {
    n: "03",
    title: "AI follow-up layer",
    body:
      "AI automations that text, call, and re-engage every lead in under 5 minutes. Layered in when your current follow-up speed can't hit the math. Books the ready, nurtures the not-yet-ready.",
  },
  {
    n: "04",
    title: "Reporting + ownership",
    body:
      "Weekly performance dashboards. Full asset handover: ads, funnel, automations, data. You own everything we build.",
  },
];

/* v2-specific: adds the "Do I have to use your AI follow-up?" answer
   at position #4, after the "what if I already have X" objection cluster. */
const v2Faqs = [
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
    q: "Do I have to use your AI follow-up?",
    a: "No. We audit your current follow-up speed first. If your team already responds within minutes, we skip the AI layer and the guarantee stays the same. If your team responds in hours, we layer it in so the booking math still works. You decide which configuration you want once we've seen the numbers.",
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

/**
 * Warm palette + serif-headline primary page.
 * Paper #FAF7F1 base, forest #1F6A4C primary, gold #A6822A accent.
 * Headlines: Source Serif 4. Body / UI: Manrope.
 *
 * v2-specific: clinic-resonant pain points + mirrored benefits + honest
 * strategy-call framing (no false "no pitch" claim).
 */

/* Pain points reframed to match the lived experience of $15k–$300k/mo
   clinic owners. Each pain has a matching benefit in v2Benefits below. */
const v2PainPoints = [
  {
    title: "Patient flow that depends on luck",
    body:
      "Walk-ins, word-of-mouth, referrals from existing patients. Some months look great. Others feel too quiet. You can't plan, hire, or invest because next month is a coin flip.",
  },
  {
    title: "Inquiries that go cold before your team responds",
    body:
      "Most clinics respond to a new lead in 4 to 24 hours. Patients decide in 5 minutes. By the time your front desk calls back, they've booked with a competitor down the road.",
  },
  {
    title: "Marketing built for businesses, not clinics",
    body:
      "Patients search differently. Compare differently. Decide differently. Generic agencies run your ads with the same playbook they use for plumbers and accountants.",
  },
  {
    title: "Dashboards full of numbers that don't pay your rent",
    body:
      "Impressions. CTRs. 'Optimisation summaries'. If you can't see exactly which dollar produced which booked appointment, you're guessing. And guessing is what got you here.",
  },
];

/* Mirrors v2PainPoints one-to-one. Same order. Same nouns where possible.
   This is the strongest copywriting move — the brain registers
   "yes that's my problem, and yes that's what I want instead". */
const v2Benefits = [
  {
    title: "Patient flow that runs on math",
    body:
      "Ad spend in. Cost-per-booking out. Booked appointments fill the calendar — 10 to 30 every 90 days. You forecast, hire, and invest with the confidence the numbers give you.",
  },
  {
    title: "Funnels built specifically for clinics",
    body:
      "Landing pages tuned to your specialty. Ad creative that matches how patients actually search. Compliance built in from day one. A system built for your category, not retrofitted.",
  },
  {
    title: "Every inquiry contacted within 5 minutes, 24/7",
    body:
      "AI follow-up calls, texts, and qualifies every lead within 5 minutes. Day, night, weekend. By the time your front desk is in on Monday, the bookings are already on the calendar.",
  },
  {
    title: "Numbers that tie directly to booked appointments",
    body:
      "One dashboard. One number that matters: cost per booked appointment. Refreshed weekly. You see exactly which dollar produced which booking. No 'optimisation' theatre.",
  },
];

const accentForIndex = (i: number) => {
  const map = [
    { text: "text-forest-600", chip: "border-forest-200 bg-forest-50 text-forest-700" },
    { text: "text-gold-600", chip: "border-gold-200 bg-gold-50 text-gold-700" },
    { text: "text-clay-500", chip: "border-clay-300/60 bg-clay-100 text-clay-700" },
    { text: "text-teal-500", chip: "border-teal-300/60 bg-teal-100 text-teal-700" },
  ];
  return map[i % map.length];
};

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

const PulseDot = () => (
  <span className="relative flex h-2 w-2 items-center justify-center">
    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-forest-500 opacity-70" />
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-500" />
  </span>
);

const PrimaryCTA = ({
  children,
  href = "#calendar",
}: {
  children: React.ReactNode;
  href?: string;
}) => (
  <a
    href={href}
    className="group inline-flex items-center gap-2 rounded-full bg-forest-600 px-7 py-3.5 text-base font-semibold text-paper transition hover:bg-forest-700 hover:shadow-[0_10px_30px_-10px_rgba(11,58,42,0.4)]"
  >
    {children}
    <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </a>
);

const SecondaryCTA = ({
  children,
  href = "#process",
}: {
  children: React.ReactNode;
  href?: string;
}) => (
  <a
    href={href}
    className="inline-flex items-center gap-2 rounded-full border border-paper-3 bg-paper px-7 py-3.5 text-base font-semibold text-ink-900 transition hover:border-ink-400 hover:bg-paper-2"
  >
    {children}
  </a>
);

const LockupBrand = () => (
  <div className="inline-flex items-center gap-3">
    <MarkDark className="h-7 w-7" />
    <span className="text-lg font-extrabold tracking-[-0.025em] text-ink-900">
      NorthSend
    </span>
  </div>
);

export default function Home() {
  return (
    <div className="bg-paper text-ink-900">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-paper-3 bg-paper/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center">
            <LockupBrand />
          </a>
          <nav className="hidden items-center gap-8 text-sm text-ink-500 md:flex">
            <a href="#process" className="transition hover:text-ink-900">Process</a>
            <a href="#shift" className="transition hover:text-ink-900">The shift</a>
            <a href="#what-you-get" className="transition hover:text-ink-900">What you get</a>
            <a href="#faq" className="transition hover:text-ink-900">FAQ</a>
          </nav>
          {/* Nav-only CTA — compact on mobile, full size on desktop. Label shortens on mobile so it stops crowding the logo. */}
          <a
            href="#calendar"
            className="group inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-paper transition hover:bg-forest-700 hover:shadow-[0_10px_30px_-10px_rgba(11,58,42,0.4)] sm:gap-2 sm:px-5 sm:py-2.5"
          >
            <span className="sm:hidden">Book call</span>
            <span className="hidden sm:inline">Book strategy call</span>
            <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </a>
        </Container>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="glow-hero pointer-events-none absolute inset-0" />
          <Container className="relative pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow tone="green">
                <PulseDot />
                {hero.eyebrow}
              </Eyebrow>

              <h1 className="font-serif mt-8 text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink-900 md:text-6xl lg:text-7xl">
                {hero.headlineLine1}
                <br />
                <span className="text-ink-500">{hero.headlineLine2Pre}</span>
                <span className="text-forest-600 italic">{hero.headlineLine2Accent}</span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-ink-500 md:text-2xl">
                {hero.sub}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <PrimaryCTA>{hero.primaryCta}</PrimaryCTA>
                <SecondaryCTA href="#process">{hero.secondaryCta}</SecondaryCTA>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-400">
                {hero.trust.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* VSL — Wistia embed (media x29jew2n0a) */}
            <div className="mx-auto mt-16 max-w-4xl">
              <WistiaEmbed mediaId="x29jew2n0a" />
            </div>
          </Container>
        </section>

        {/* INDUSTRIES MARQUEE */}
        <section
          aria-label="Industries we serve"
          className="border-t border-paper-3 bg-paper py-10"
        >
          <Container>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Industries we serve
            </p>
            <div className="marquee-mask mt-6">
              <div className="marquee-track flex w-max gap-3">
                {[...v2Industries, ...v2Industries].map((label, i) => (
                  <span
                    key={`${label}-${i}`}
                    className="inline-flex shrink-0 items-center rounded-full border border-paper-3 bg-paper-2 px-5 py-2 text-sm font-medium text-ink-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CURRENT REALITY */}
        <section className="border-t border-paper-3 bg-paper-2 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Your Current Reality</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                The problem isn&rsquo;t effort.
                <br />
                <span className="italic text-forest-600">It&rsquo;s the system.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-500">
                Your clinical work is excellent. Your reviews are good. Patients love you.
                The gap is the system between Google search and a booked appointment.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {v2PainPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-paper-3 bg-paper p-8 transition hover:border-ink-200 hover:shadow-sm"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-300/40 bg-rose-50 text-rose-500">
                    <IconX className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">{p.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-500">{p.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* NEW REALITY */}
        <section className="border-t border-paper-3 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Your New Reality</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                This is what life looks like when{" "}
                <span className="italic text-forest-600">your system runs itself.</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {v2Benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-paper-3 bg-paper p-8 transition hover:border-forest-300 hover:shadow-sm"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest-200 bg-forest-50 text-forest-600">
                    <IconCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">{b.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-500">{b.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <PrimaryCTA>Unlock your new reality</PrimaryCTA>
            </div>
          </Container>
        </section>

        {/* FOUR SYSTEMS */}
        <section className="border-t border-paper-3 bg-paper-2 py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Four systems, one practice</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                Everything you need to fill your calendar. Built, launched, and
                owned by you.
              </h2>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper-3 bg-paper-3 md:grid-cols-2 lg:grid-cols-4">
              {v2Systems.map((s, i) => {
                const c = accentForIndex(i);
                return (
                  <div key={s.n} className="bg-paper p-8">
                    <span className={`font-mono text-xs font-bold ${c.text}`}>
                      {s.n}
                    </span>
                    <h3 className="mt-4 text-xl font-bold text-ink-900">{s.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-500">{s.body}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* PROCESS */}
        <section id="process" className="border-t border-paper-3 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>The Process</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                A simple, proven process to get your growth engine running.
              </h2>
            </div>

            <ol className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-4">
              {process.map((step, i) => {
                const c = accentForIndex(i);
                return (
                  <li
                    key={step.n}
                    className="relative rounded-2xl border border-paper-3 bg-paper p-8 transition hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm font-bold ${c.chip}`}
                      >
                        {step.n}
                      </span>
                      {i < process.length - 1 && (
                        <span className="hidden h-px flex-1 bg-gradient-to-r from-paper-3 to-transparent lg:block" />
                      )}
                    </div>
                    <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.15em] ${c.text}`}>
                      {step.when}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-ink-900">{step.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-500">{step.body}</p>
                  </li>
                );
              })}
            </ol>

            <div className="mt-12 flex justify-center">
              <PrimaryCTA>Book the strategy call</PrimaryCTA>
            </div>
          </Container>
        </section>

        {/* THE SHIFT — Before / After comparison */}
        <section id="shift" className="border-t border-paper-3 bg-paper-2 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>The shift</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                Most clinics run on volatility.{" "}
                <span className="italic text-forest-600">We replace it with math.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-500">
                Five things change the moment the system is installed.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-paper-3 bg-paper-3 md:grid-cols-2">
              {/* WITHOUT */}
              <div className="bg-paper p-8 md:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300/40 bg-rose-50 text-rose-500">
                    <IconX className="h-5 w-5" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                    Without NorthSend
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Walk-ins and referrals (volatile, unpredictable flow)",
                    "Front desk responds to leads in 4 to 24 hours",
                    "Same ad playbook as plumbers and accountants",
                    "Vanity dashboards (impressions, CTRs, 'optimisation summaries')",
                    "Some months booked solid. Other months empty.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-base leading-relaxed text-ink-600"
                    >
                      <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-ink-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WITH */}
              <div className="bg-forest-50 p-8 md:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-forest-200 bg-paper text-forest-600">
                    <IconCheck className="h-5 w-5" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-forest-700">
                    With NorthSend
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Predictable ad + funnel + follow-up loop that fills the calendar",
                    "Every lead contacted within 5 minutes, 24/7",
                    "Funnels and creative tuned to your specialty",
                    "One number on a weekly dashboard: cost per booked appointment",
                    "10 to 30 booked appointments every 90 days, refund-backed",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-base leading-relaxed text-ink-700"
                    >
                      <IconCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* WHAT YOU ACTUALLY GET — uniform forest accent */}
        <section id="what-you-get" className="border-t border-paper-3 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>What You Actually Get</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                A full patient acquisition system.{" "}
                <span className="italic text-forest-600">Not just ads.</span>
              </h2>
              <p className="mt-5 text-lg text-ink-500">
                Every clinic gets every piece below. Nothing is &ldquo;add-on&rdquo;.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {deliverables.map((d) => (
                <div
                  key={d.category}
                  className="rounded-2xl border border-paper-3 bg-paper p-8"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-forest-600">
                    {d.category}
                  </h3>
                  <ul className="mt-6 space-y-3.5">
                    {d.items.map((item) => (
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
              ))}
            </div>
          </Container>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-t border-paper-3 bg-paper-2 py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:items-start">
              <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl border border-paper-3 bg-paper">
                <Image
                  src="/charlie.jpg"
                  alt={`${about.name}, founder of NorthSend`}
                  fill
                  sizes="(min-width: 1024px) 300px, 80vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <Eyebrow tone="gold">Founder</Eyebrow>
                <h2 className="font-serif mt-6 text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
                  {about.name}
                </h2>
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-500">
                  {about.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={
                        i === about.paragraphs.length - 1
                          ? "font-medium text-ink-900"
                          : ""
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* WHO THIS IS FOR — qualification filter */}
        <section id="best-fit" className="border-t border-paper-3 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Best fit</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                Who this is for. And who it isn&rsquo;t.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-500">
                We don&rsquo;t take work we can&rsquo;t guarantee. If you fall on the right side of this list, book the call.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
              {/* Good fit */}
              <div className="rounded-2xl border border-forest-200 bg-forest-50 p-8">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest-200 bg-paper text-forest-600">
                  <IconCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">Good fit</h3>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "$15k to $300k a month in clinic revenue",
                    "Dental, aesthetics, physiotherapy, chiropractic, hair transplant, cosmetic surgery, LASIK, or dermatology",
                    "Already running ads, or ready to invest $1,500 to $3,000 a month in spend",
                    "Front desk that can answer inquiries within 5 minutes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-ink-700">
                      <IconCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not a fit */}
              <div className="rounded-2xl border border-rose-300/40 bg-rose-50/60 p-8">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-300/40 bg-paper text-rose-500">
                  <IconX className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">Not a fit</h3>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "Under $15k a month in revenue (you need cash flow to fund the ad spend)",
                    "Want &lsquo;leads&rsquo; rather than booked appointments on the calendar",
                    "Not willing to change anything about the current funnel or ads",
                    "Expect results in under 14 days (first bookings hit in 14, guarantee at 90)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-ink-700">
                      <IconX className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* WHAT HAPPENS ON THE CALL — strategy-call preview */}
        <section id="the-call" className="border-t border-paper-3 bg-paper-2 py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>The strategy call</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                What happens in your{" "}
                <span className="italic text-forest-600">free 20-minute call.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-500">
                Three steps. Same every time. You leave with the numbers, the math,
                and an honest answer.
              </p>
            </div>

            <ol className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "We audit your numbers",
                  body: "Current ad spend, cost-per-booking, conversion rate. We pull up your accounts on the call.",
                },
                {
                  n: "02",
                  title: "We build your 90-day math",
                  body: "Exact number of bookings we can guarantee. Exact forecast for cost per booked appointment.",
                },
                {
                  n: "03",
                  title: "We tell you the honest answer",
                  body: "Yes, we can hit the guarantee for your clinic. Or no, here&rsquo;s why we can&rsquo;t. No pitch either way.",
                },
              ].map((step) => (
                <li
                  key={step.n}
                  className="rounded-2xl border border-paper-3 bg-paper p-8 transition hover:shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest-200 bg-forest-50 font-mono text-sm font-bold text-forest-700">
                    {step.n}
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-ink-900">{step.title}</h3>
                  <p
                    className="mt-3 text-base leading-relaxed text-ink-500"
                    dangerouslySetInnerHTML={{ __html: step.body }}
                  />
                </li>
              ))}
            </ol>

            <p className="mx-auto mt-10 max-w-xl text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
              Audit first. We only pitch if it fits.
            </p>
          </Container>
        </section>

        {/* CALENDAR / CTA */}
        <section id="calendar" className="border-t border-paper-3 py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                Ready to <span className="italic text-forest-600">guarantee</span>{" "}
                your next 10 booked patients?
              </h2>
              <p className="mt-6 text-xl text-ink-500">
                Book your free 20-minute strategy call. No pressure, just honest
                math. We&rsquo;ll tell you up-front if we can hit the guarantee
                for your practice.
              </p>
            </div>

            <div className="relative mx-auto mt-12 max-w-4xl">
              {/* Green corner brackets — inset slightly inside the card edges. */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-3 left-3 z-10 h-6 w-6 rounded-tl-lg border-t-2 border-l-2 border-forest-500"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute top-3 right-3 z-10 h-6 w-6 rounded-tr-lg border-t-2 border-r-2 border-forest-500"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 left-3 z-10 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-forest-500"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-3 z-10 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-forest-500"
              />

              <div className="overflow-hidden rounded-2xl border border-paper-3 bg-paper pb-6 shadow-[0_20px_60px_-20px_rgba(11,19,14,0.15)]">
                <div className="flex items-center justify-between gap-3 border-b border-paper-3 px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400 sm:px-9 sm:py-6 sm:text-xs sm:tracking-[0.15em] md:px-12 md:py-7">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <PulseDot />
                    <span className="text-forest-700">Live availability</span>
                  </span>
                  <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.1em] text-ink-300 sm:text-[10px] sm:tracking-[0.15em]">
                    Powered by Calendly
                  </span>
                </div>
                <CalendlyEmbed minHeight={900} />
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-paper-3 bg-paper-2 py-24">
          <Container className="max-w-3xl">
            <div className="text-center">
              <Eyebrow>Common questions</Eyebrow>
              <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
                Straight answers.
              </h2>
            </div>

            <div className="mt-12 divide-y divide-paper-3 overflow-hidden rounded-2xl border border-paper-3 bg-paper">
              {v2Faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-6 text-left transition hover:bg-paper-2">
                    <span className="text-lg font-semibold text-ink-900">{faq.q}</span>
                    <IconChevronDown className="accordion-chevron h-5 w-5 flex-shrink-0 text-ink-400" />
                  </summary>
                  <div className="px-6 pt-3 pb-7 text-base leading-relaxed text-ink-500">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CLOSER — strategic dark band with gold + forest glow */}
        <section className="glow-closer relative overflow-hidden bg-forest-900 py-28 text-paper">
          <Container className="relative max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-300">
              {closer.eyebrow}
            </p>
            <h2 className="font-serif mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-paper md:text-6xl">
              {closer.headlineLine1}
              <span className="italic text-gold-300">{closer.headlineAccent}</span>
              <br />
              {closer.headlineLine2}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-paper-3">{closer.sub}</p>

            {/* 3-step preview — reduces "what happens after I click" friction */}
            <ol className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
              {[
                { n: "01", title: "Book the call", body: "Pick a time that works." },
                { n: "02", title: "We audit the math", body: "Numbers reviewed live, on screen." },
                { n: "03", title: "You get clarity", body: "Honest yes or no, up-front." },
              ].map((s) => (
                <li
                  key={s.n}
                  className="rounded-xl border border-forest-700 bg-forest-800/40 p-5"
                >
                  <span className="font-mono text-xs font-bold text-gold-300">{s.n}</span>
                  <h3 className="mt-2 text-base font-bold text-paper">{s.title}</h3>
                  <p className="mt-1 text-sm text-paper-3">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex justify-center">
              <a
                href="#calendar"
                className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-base font-semibold text-forest-900 transition hover:bg-gold-300 hover:shadow-[0_0_40px_-4px_rgba(195,154,54,0.6)]"
              >
                {closer.cta}
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
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
