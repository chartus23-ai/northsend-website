import { caseStudies, type CaseStudy } from "@/lib/content";

/* Per-card accent, cycling the CLAUDE.md sequence (forest, gold, clay, teal). */
const ACCENTS = [
  {
    text: "text-forest-600",
    bar: "bg-forest-400",
    dot: "bg-forest-500",
    chip: "border-forest-200 bg-forest-50 text-forest-700",
  },
  {
    text: "text-gold-600",
    bar: "bg-gold-400",
    dot: "bg-gold-500",
    chip: "border-gold-200 bg-gold-50 text-gold-700",
  },
  {
    text: "text-clay-500",
    bar: "bg-clay-400",
    dot: "bg-clay-500",
    chip: "border-clay-300/60 bg-clay-100 text-clay-700",
  },
  {
    text: "text-teal-500",
    bar: "bg-teal-400",
    dot: "bg-teal-500",
    chip: "border-teal-300/60 bg-teal-100 text-teal-700",
  },
] as const;

/* Mini bar chart — 12 months of real leads. Heights are relative to the
   card's own peak month, so every card reads as its own trend. */
function MiniBars({ data, barClass }: { data: number[]; barClass: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-12 items-end gap-[3px]" aria-hidden>
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-[2px] ${barClass}`}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function CaseStudyCard({ cs, i }: { cs: CaseStudy; i: number }) {
  const a = ACCENTS[i % ACCENTS.length];
  return (
    <article className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-paper-3 bg-paper p-6 shadow-[0_1px_0_rgba(11,19,14,0.03)] sm:w-[330px]">
      {/* Category chip */}
      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${a.chip}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
        {cs.sector}
      </span>

      {/* Hero outcome — big number, unit as an accent label below so longer
          units like "booked appointments" sit cleanly. */}
      <div className="mt-5">
        <div className="text-4xl font-extrabold leading-none tracking-tight text-ink-900">
          {cs.hero.value}
        </div>
        <div
          className={`mt-2 text-sm font-bold uppercase tracking-[0.08em] ${a.text}`}
        >
          {cs.hero.unit}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-500">{cs.context}</p>

      {/* Supporting stat tiles */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {cs.stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-paper-3 bg-paper-2/50 px-2 py-3 text-center"
          >
            <div className="text-base font-extrabold text-ink-900">
              {s.value}
            </div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-ink-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Proof panel — real Google Ads data, styled as a mini dashboard. */}
      <div className="mt-5 rounded-xl border border-paper-3 bg-paper-2/60 p-4">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
            Google Ads
          </span>
          <span>Trailing 12 mo</span>
        </div>
        <div className="mt-3">
          <MiniBars data={cs.monthly} barClass={a.bar} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-paper-3 pt-3 text-xs">
          <span className="text-ink-400">
            Leads <span className="font-bold text-ink-900">{cs.leadsTotal}</span>
          </span>
          <span className="text-ink-400">
            Spend <span className="font-bold text-ink-900">{cs.spend}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function CaseStudyCarousel() {
  return (
    <div className="mt-12">
      <div className="flex snap-x gap-5 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
        {caseStudies.map((cs, i) => (
          <CaseStudyCard key={i} cs={cs} i={i} />
        ))}
      </div>
      <p className="mt-1 text-center text-xs text-ink-300">
        Scroll to see more
      </p>
    </div>
  );
}
