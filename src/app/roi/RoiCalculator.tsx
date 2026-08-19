"use client";

import { useState } from "react";

/**
 * NorthSend ROI calculator, a live sales-call tool. Edit the client's real
 * numbers on the left and the return updates on the right. Currency shown as $.
 * Models the fee two ways: a flat retainer, or a percentage of revenue.
 *
 * Served at /roi. Brand rule: no em dashes, no en-dash ranges.
 */

const C = {
  paper: "#FAF7F1",
  paper2: "#F2EDDF",
  paper3: "#E8E2D0",
  ink: "#0B130E",
  muted: "#6A6F69",
  forest: "#1F6A4C",
  forest9: "#041910",
  gold: "#A6822A",
};

const money = (n: number) => "$" + Math.round(n).toLocaleString();

// Ratios need cents, otherwise "14.3x" prints as "returns $14" and the two
// numbers on the same card disagree.
const money2 = (n: number) =>
  "$" +
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Slider({
  label, value, set, min, max, step, suffix = "", money: isMoney = false,
}: {
  label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; suffix?: string; money?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold" style={{ color: C.ink }}>{label}</label>
        <div className="flex items-center gap-1">
          {isMoney ? <span style={{ color: C.muted }} className="text-sm">$</span> : null}
          <input
            type="number"
            min={min}
            max={max}
            value={value === 0 ? "" : value}
            placeholder="0"
            onChange={(e) => {
              if (e.target.value === "") return set(0);
              const n = Number(e.target.value);
              // Typed values bypass the slider, so clamp here too. Without this
              // a booking rate of 500% produces more appointments than leads.
              if (Number.isNaN(n)) return;
              set(Math.min(max, Math.max(min, n)));
            }}
            className="w-28 rounded-md border px-2 py-1 text-right text-sm font-bold"
            style={{ borderColor: C.paper3, color: C.forest, background: "#fff" }}
          />
          {suffix ? <span style={{ color: C.muted }} className="text-sm">{suffix}</span> : null}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
        style={{ ["--accent" as string]: C.forest }}
      />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4" style={{ borderColor: C.paper3 }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>{label}</p>
      <p className="mt-1 text-2xl font-extrabold" style={{ color: C.ink }}>{value}</p>
      {sub ? <p className="text-xs" style={{ color: C.muted }}>{sub}</p> : null}
    </div>
  );
}

export default function RoiCalculator() {
  const [leads, setLeads] = useState(50);
  const [bookRate, setBookRate] = useState(60);
  const [apptToCust, setApptToCust] = useState(50);
  const [firstPurchase, setFirstPurchase] = useState(250);
  const [ltv, setLtv] = useState(5000);
  const [adSpend, setAdSpend] = useState(3000);
  const [feeModel, setFeeModel] = useState<"flat" | "percent">("percent");
  const [feeFlat, setFeeFlat] = useState(2250);
  const [feePct, setFeePct] = useState(3);

  const appointments = leads * (bookRate / 100);
  const customers = appointments * (apptToCust / 100);
  const revenue = customers * ltv;
  const firstRevenue = customers * firstPurchase;
  const fee = feeModel === "flat" ? feeFlat : revenue * (feePct / 100);
  const investment = adSpend + fee;
  const roi = investment > 0 ? revenue / investment : 0;
  const costPerCustomer = customers > 0 ? investment / customers : 0;
  const feePctOfRev = revenue > 0 ? (fee / revenue) * 100 : 0;

  return (
    <main style={{ background: C.paper, color: C.ink }} className="min-h-screen font-sans">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <header className="text-center">
          <p style={{ color: C.gold }} className="text-xs font-bold uppercase tracking-[0.22em]">NorthSend</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Your return on investment</h1>
          <p style={{ color: C.muted }} className="mx-auto mt-3 max-w-xl">
            These are your real numbers. Change anything on the left and watch the return update.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* INPUTS */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm md:p-7" style={{ borderColor: C.paper3 }}>
            <h2 className="text-lg font-extrabold">Your numbers</h2>
            <div className="mt-6 space-y-6">
              <Slider label="Monthly leads from Google Ads" value={leads} set={setLeads} min={0} max={5000} step={10} />
              <Slider label="Appointment booking rate" value={bookRate} set={setBookRate} min={0} max={100} step={1} suffix="%" />
              <Slider label="Appointment to customer rate" value={apptToCust} set={setApptToCust} min={0} max={100} step={1} suffix="%" />
              <Slider label="Average first purchase value" value={firstPurchase} set={setFirstPurchase} min={0} max={2000} step={10} money />
              <Slider label="Lifetime value (LTV) per customer" value={ltv} set={setLtv} min={0} max={15000} step={50} money />
              <Slider label="Monthly ad spend" value={adSpend} set={setAdSpend} min={0} max={200000} step={500} money />

              {/* fee model */}
              <div>
                <label className="text-sm font-semibold">How NorthSend is paid</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["flat", "percent"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        // switching to the flat retainer carries over the dollar
                        // amount the % model is currently producing
                        if (m === "flat") setFeeFlat(Math.round(revenue * (feePct / 100)));
                        setFeeModel(m);
                      }}
                      className="rounded-lg border px-3 py-2 text-sm font-bold transition"
                      style={feeModel === m
                        ? { background: C.forest, color: "#fff", borderColor: C.forest }
                        : { background: "#fff", color: C.muted, borderColor: C.paper3 }}
                    >
                      {m === "flat" ? "Flat retainer" : "% of revenue"}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  {feeModel === "flat" ? (
                    <Slider label="NorthSend fee (monthly)" value={feeFlat} set={setFeeFlat} min={0} max={100000} step={500} money />
                  ) : (
                    <Slider label="NorthSend fee, as % of revenue" value={feePct} set={setFeePct} min={0} max={30} step={0.5} suffix="%" />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* RESULTS */}
          <section className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Booked appointments" value={Math.round(appointments).toLocaleString()} sub="per month" />
              <Stat label="New customers" value={Math.round(customers).toLocaleString()} sub="per month" />
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.paper3 }}>
              <div className="flex items-baseline justify-between">
                <span style={{ color: C.muted }} className="text-sm font-semibold uppercase tracking-wide">Revenue generated (at LTV)</span>
              </div>
              <p className="mt-1 text-3xl font-extrabold" style={{ color: C.forest }}>{money(revenue)}</p>
              <p style={{ color: C.muted }} className="text-sm">First-purchase revenue: {money(firstRevenue)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Stat label="Your investment" value={money(investment)} sub={`${money(adSpend)} ads + ${money(fee)} fee`} />
              <Stat label="NorthSend fee" value={money(fee)} sub={`${feePctOfRev.toFixed(1)}% of revenue`} />
            </div>

            {/* THE BIG NUMBER */}
            <div className="rounded-2xl p-7 text-center text-white shadow-lg" style={{ background: C.forest9 }}>
              <p style={{ color: C.gold }} className="text-xs font-bold uppercase tracking-[0.22em]">Return on investment</p>
              <p className="mt-2 text-6xl font-extrabold">{roi.toFixed(1)}x</p>
              <p className="mt-2 text-white/80">
                Every <span className="font-bold text-white">$1</span> you invest returns <span className="font-bold" style={{ color: C.gold }}>{money2(roi)}</span>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-white/60">Our fee is only</p>
                  <p className="text-xl font-extrabold">{feePctOfRev.toFixed(1)}%</p>
                  <p className="text-xs text-white/60">of the revenue we generate</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-white/60">Cost per new customer</p>
                  <p className="text-xl font-extrabold">{money(costPerCustomer)}</p>
                  <p className="text-xs text-white/60">worth {money(ltv)} over their lifetime</p>
                </div>
              </div>
            </div>

            <p style={{ color: C.muted }} className="text-center text-sm leading-relaxed">
              At these numbers, you keep <span className="font-bold" style={{ color: C.ink }}>{money(revenue - investment)}</span> after ad spend and our fee.
            </p>
          </section>
        </div>

        <p style={{ color: C.muted }} className="mt-8 text-center text-xs">
          Illustrative model for discussion. Figures update from the inputs above and are not a guarantee.
        </p>
      </div>
    </main>
  );
}
