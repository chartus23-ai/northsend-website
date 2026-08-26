"use client";

import { useMemo, useState } from "react";

/**
 * Public-facing simplified calculator for the home page.
 *
 * One slider: target booked patient appointments per month.
 * Output: monthly ad spend needed at industry-realistic clinic-acquisition
 * performance, plus a 3-stage funnel breakdown for credibility.
 *
 * The math uses the same Realistic preset as the internal calculator
 * (CPC 2.50, LP CVR 5%, qualified-lead rate 25%). For a public lead-magnet
 * tool, presets / funnel tweaks would be noise — collapsed to one number.
 *
 * "Booked patient appointment" maps to the Qualified stage in the full
 * funnel (lead has booked a consultation). This aligns with NorthSend's
 * guarantee language and produces ~$200 per booked appointment, which
 * matches Charlie's stated $1.5K to $3K ad-spend range for the guarantee
 * floor of 10 booked appointments per 90 days.
 */

const CPC = 2.5;
const LP_CONV_RATE = 0.05;
const QUAL_RATE = 0.25;

const MIN_BOOKED = 5;
const MAX_BOOKED = 30;
const DEFAULT_BOOKED = 10;

const CALENDLY_URL = "https://calendly.com/charlie-northsend/20min";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export default function CalculatorMini() {
  const [bookedPerMonth, setBookedPerMonth] = useState(DEFAULT_BOOKED);
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const numbers = useMemo(() => {
    const leads = bookedPerMonth / QUAL_RATE;
    const clicks = leads / LP_CONV_RATE;
    const spend = clicks * CPC;
    const costPerBooked = spend / bookedPerMonth;
    return {
      spend: Math.round(spend),
      leads: Math.round(leads),
      clicks: Math.round(clicks),
      costPerBooked: Math.round(costPerBooked),
    };
  }, [bookedPerMonth]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitState === "submitting") return;
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/calculator-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          bookedPerMonth,
          spend: numbers.spend,
        }),
      });
      if (!res.ok) throw new Error("submission failed");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section
      id="calculator"
      className="border-t border-paper-3 bg-paper-2 py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-700 shadow-sm">
            Honest math
          </div>
          <h2 className="font-serif mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-5xl">
            How much will this{" "}
            <span className="italic text-forest-600">actually cost you?</span>
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            Drag the slider. See what monthly ad spend it takes to hit your
            booked-appointment target at industry-realistic performance.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-paper-3 bg-paper p-8 shadow-sm md:p-12">
          {/* Slider */}
          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="booked-slider"
                className="text-sm font-semibold uppercase tracking-wider text-ink-500"
              >
                Target booked patient appointments / month
              </label>
              <span className="font-serif text-3xl font-medium text-ink-900">
                {bookedPerMonth}
              </span>
            </div>
            <input
              id="booked-slider"
              type="range"
              min={MIN_BOOKED}
              max={MAX_BOOKED}
              step={1}
              value={bookedPerMonth}
              onChange={(e) => setBookedPerMonth(Number(e.target.value))}
              className="mt-4 w-full accent-forest-500"
              style={{ accentColor: "var(--color-forest-500)" }}
            />
            <div className="mt-2 flex justify-between text-xs text-ink-400">
              <span>{MIN_BOOKED} / mo</span>
              <span>{MAX_BOOKED} / mo</span>
            </div>
          </div>

          {/* Big result */}
          <div className="mt-10 rounded-2xl border border-forest-200 bg-forest-50 p-8 text-center md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-forest-700">
              Estimated monthly ad spend
            </p>
            <p className="mt-2 font-serif text-5xl font-medium text-forest-700 md:text-6xl">
              S${formatCurrency(numbers.spend)}
              <span className="text-2xl font-normal text-forest-600">
                {" "}/ month
              </span>
            </p>
            <p className="mt-3 text-sm text-ink-600">
              to book{" "}
              <strong className="text-ink-900">{bookedPerMonth} patient appointments</strong>{" "}
              each month, at roughly{" "}
              <strong className="text-ink-900">
                S${formatCurrency(numbers.costPerBooked)} per booked appointment
              </strong>
              .
            </p>
            <p className="mt-1 text-xs text-ink-400">
              Based on industry-average clinic-acquisition performance.
            </p>
          </div>

          {/* Mini funnel */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-paper-3 bg-paper-2 p-5 text-center">
            <div>
              <p className="font-serif text-2xl font-medium text-ink-900">
                {formatCurrency(numbers.clicks)}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Clicks
              </p>
            </div>
            <div className="border-x border-paper-3">
              <p className="font-serif text-2xl font-medium text-ink-900">
                {numbers.leads}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Leads
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-medium text-forest-700">
                {bookedPerMonth}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-forest-700">
                Booked appts
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest-600 px-7 py-4 text-base font-semibold text-paper transition hover:bg-forest-700 hover:shadow-[0_10px_30px_-10px_rgba(11,58,42,0.4)]"
            >
              Book a call to model your real numbers
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>

            <form
              onSubmit={handleEmailSubmit}
              className="flex items-stretch gap-2 md:w-[280px]"
            >
              {submitState === "success" ? (
                <p className="flex w-full items-center justify-center rounded-full border border-forest-200 bg-forest-50 px-4 text-sm font-semibold text-forest-700">
                  Sent — check your inbox.
                </p>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Email for full breakdown"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-paper-4 bg-paper px-4 py-3 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500"
                  />
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="flex-shrink-0 rounded-full border border-paper-4 bg-paper px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-paper-2 disabled:opacity-50"
                  >
                    {submitState === "submitting" ? "…" : "Send"}
                  </button>
                </>
              )}
            </form>
          </div>

          {submitState === "error" && (
            <p className="mt-2 text-xs text-rose-500">
              Couldn&apos;t send. Try again or email charlie@northsend.io.
            </p>
          )}

          <p className="mt-6 text-center text-xs text-ink-400">
            Numbers are estimates based on industry-average funnel performance
            for clinic Lead Gen campaigns. Real results vary by vertical,
            geography, and offer.
          </p>
        </div>
      </div>
    </section>
  );
}
