"use client";

import { useMemo, useState } from "react";
import {
  CURRENCY_SYMBOLS,
  DEFAULT_TOTAL_AD_SPEND,
  PRESETS,
  PRESET_DESCRIPTIONS,
} from "@/lib/calculator/defaults";
import {
  calculate,
  conditions,
  formatCompactInt,
  formatCurrency,
  formatCurrencyCompact,
  formatInteger,
  formatPercent,
  funnelDiagram,
  ltvOutputs,
  presetToFunnelEcon,
  scenarioCpls,
  stageGuidance,
  stressTestOutputs,
  suggestLevers,
} from "@/lib/calculator/math";
import type {
  CalculatorInputs,
  Currency,
  Platform,
  Preset,
  Timeframe,
} from "@/lib/calculator/types";

type Step = 1 | 2 | 3 | 4;

const CURRENCIES: Currency[] = [
  "SGD",
  "MYR",
  "USD",
  "GBP",
  "EUR",
  "AUD",
  "HKD",
];

function initialInputs(): CalculatorInputs {
  const { funnel, economics } = presetToFunnelEcon(PRESETS.realistic);
  return {
    platform: "either",
    objective: "lead-gen",
    currency: "SGD",
    timeframe: "monthly",
    preset: "realistic",
    totalAdSpend: DEFAULT_TOTAL_AD_SPEND,
    funnel,
    economics,
    stressTest: false,
  };
}

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [step, setStep] = useState<Step>(1);
  const [savedNumbers, setSavedNumbers] = useState<CalculatorInputs | null>(
    null,
  );

  const sym = CURRENCY_SYMBOLS[inputs.currency];

  const outputs = useMemo(() => calculate(inputs), [inputs]);
  const stress = useMemo(
    () => (inputs.stressTest ? stressTestOutputs(inputs) : null),
    [inputs],
  );
  const cplScenarios = useMemo(
    () => scenarioCpls(inputs.totalAdSpend),
    [inputs.totalAdSpend],
  );
  const checklist = useMemo(() => conditions(inputs, outputs), [inputs, outputs]);
  const levers = useMemo(() => suggestLevers(inputs, outputs), [inputs, outputs]);
  const funnel = useMemo(() => funnelDiagram(outputs, inputs), [outputs, inputs]);
  const guidance = useMemo(() => stageGuidance(funnel), [funnel]);
  const ltv = useMemo(() => ltvOutputs(inputs, outputs), [inputs, outputs]);

  const applyPreset = (preset: Exclude<Preset, "custom">) => {
    const { funnel, economics } = presetToFunnelEcon(PRESETS[preset]);
    setInputs((p) => ({ ...p, preset, funnel, economics }));
    setSavedNumbers(null);
  };

  const loadDefaults = () => {
    setSavedNumbers(inputs);
    applyPreset("realistic");
  };

  const resetToMyNumbers = () => {
    if (savedNumbers) {
      setInputs(savedNumbers);
      setSavedNumbers(null);
    }
  };

  const updateFunnel = (
    field: keyof CalculatorInputs["funnel"],
    value: number,
  ) => {
    setInputs((p) => ({
      ...p,
      preset: "custom",
      funnel: { ...p.funnel, [field]: value },
    }));
  };
  const updateEconomics = (
    field: keyof CalculatorInputs["economics"],
    value: number,
  ) => {
    setInputs((p) => ({
      ...p,
      preset: "custom",
      economics: { ...p.economics, [field]: value },
    }));
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <Header />
      <div className="mt-8 overflow-hidden rounded-2xl border border-paper-3 bg-paper shadow-sm">
        <div className="px-7 py-7">
          <PlatformObjective inputs={inputs} setInputs={setInputs} />

          <div className="mt-7 flex items-center justify-end">
            <button
              onClick={loadDefaults}
              className="flex items-center gap-2 rounded-lg border border-paper-4 bg-paper px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-paper-2"
            >
              <span aria-hidden>↻</span> Load defaults
            </button>
          </div>

          {step !== 4 && (
            <div className="mt-5">
              <QuickStart
                inputs={inputs}
                applyPreset={applyPreset}
                resetToMyNumbers={resetToMyNumbers}
                hasSavedNumbers={savedNumbers !== null}
              />
            </div>
          )}

          <StepDots step={step} setStep={setStep} />

          <div className="mt-6">
            {step === 1 && (
              <StepGoals
                inputs={inputs}
                setInputs={setInputs}
                sym={sym}
              />
            )}
            {step === 2 && (
              <StepFunnel inputs={inputs} updateFunnel={updateFunnel} />
            )}
            {step === 3 && (
              <StepEconomics
                inputs={inputs}
                updateEconomics={updateEconomics}
                setInputs={setInputs}
                sym={sym}
              />
            )}
            {step === 4 && (
              <Results
                inputs={inputs}
                outputs={outputs}
                stress={stress}
                cplScenarios={cplScenarios}
                checklist={checklist}
                levers={levers}
                funnel={funnel}
                guidance={guidance}
                ltv={ltv}
                sym={sym}
              />
            )}
          </div>
        </div>

        <Footer
          step={step}
          setStep={setStep}
          calculate={() => setStep(4)}
        />
      </div>

      <Disclaimer />
    </div>
  );
}

/* ---------- Top-level chrome ---------- */

function Header() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3">
        <span
          className="font-serif text-3xl text-forest-500"
          aria-hidden
        >
          ∎
        </span>
        <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">
          Patient Acquisition Calculator
        </h1>
        <span className="rounded-md border border-paper-4 bg-paper-2 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Beta
        </span>
      </div>
      <p className="mx-auto mt-3 max-w-xl text-sm text-ink-500">
        Plan your spend, forecast booked appointments, and find your
        break-even points.
      </p>
    </div>
  );
}

function PlatformObjective({
  inputs,
  setInputs,
}: {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}) {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Platform
        </p>
        <div className="mt-2 inline-flex gap-2">
          {(["either", "meta", "google"] as Platform[]).map((p) => (
            <PillButton
              key={p}
              active={inputs.platform === p}
              onClick={() =>
                setInputs((prev) => ({ ...prev, platform: p }))
              }
            >
              {p === "either"
                ? "Either"
                : p === "meta"
                  ? "Meta"
                  : "Google"}
            </PillButton>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Objective
        </p>
        <div className="mt-2 inline-flex gap-2">
          <PillButton active>Lead Generation</PillButton>
        </div>
      </div>
    </div>
  );
}

function QuickStart({
  inputs,
  applyPreset,
  resetToMyNumbers,
  hasSavedNumbers,
}: {
  inputs: CalculatorInputs;
  applyPreset: (p: Exclude<Preset, "custom">) => void;
  resetToMyNumbers: () => void;
  hasSavedNumbers: boolean;
}) {
  const active = inputs.preset;
  const presets: Exclude<Preset, "custom">[] = [
    "conservative",
    "realistic",
    "aggressive",
  ];
  const description =
    active === "custom"
      ? "Your numbers (custom)"
      : PRESET_DESCRIPTIONS[active];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Quick start
        </p>
        {hasSavedNumbers && (
          <button
            onClick={resetToMyNumbers}
            className="text-xs font-semibold text-forest-600 underline-offset-2 hover:underline"
          >
            ↻ Reset to my numbers
          </button>
        )}
      </div>
      <div className="mt-2 inline-flex gap-2">
        {presets.map((p) => (
          <PillButton
            key={p}
            active={active === p}
            onClick={() => applyPreset(p)}
          >
            {p[0].toUpperCase() + p.slice(1)}
          </PillButton>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-500">{description}</p>
      <p className="mt-1 text-xs text-ink-400">
        These presets just help you get started. You can edit any number.
      </p>
    </div>
  );
}

function StepDots({
  step,
  setStep,
}: {
  step: Step;
  setStep: (s: Step) => void;
}) {
  const items: { n: Step; label: string }[] = [
    { n: 1, label: "Goals" },
    { n: 2, label: "Funnel Assumptions" },
    { n: 3, label: "Unit Economics" },
  ];
  return (
    <div className="mt-7 flex items-start">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <div key={it.n} className="flex flex-1 flex-col items-center">
            <div className="relative flex w-full items-center">
              {i > 0 && (
                <span
                  className={`absolute left-0 right-1/2 top-1/2 -translate-y-1/2 border-t ${
                    step > it.n - 1
                      ? "border-forest-300"
                      : "border-paper-4"
                  }`}
                />
              )}
              {i < items.length - 1 && (
                <span
                  className={`absolute left-1/2 right-0 top-1/2 -translate-y-1/2 border-t ${
                    done ? "border-forest-300" : "border-paper-4"
                  }`}
                />
              )}
              <button
                onClick={() => setStep(it.n)}
                className={[
                  "relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition",
                  active
                    ? "border-forest-500 bg-paper text-forest-600"
                    : done
                      ? "border-forest-500 bg-forest-500 text-paper"
                      : "border-paper-4 bg-paper text-ink-300",
                ].join(" ")}
              >
                {done ? "✓" : it.n}
              </button>
            </div>
            <span
              className={[
                "mt-2 text-xs font-semibold",
                active
                  ? "text-forest-600"
                  : done
                    ? "text-ink-500"
                    : "text-ink-300",
              ].join(" ")}
            >
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Footer({
  step,
  setStep,
  calculate,
}: {
  step: Step;
  setStep: (s: Step) => void;
  calculate: () => void;
}) {
  const isResults = step === 4;
  return (
    <div className="flex items-center justify-between border-t border-paper-3 bg-paper-2 px-7 py-4">
      <button
        onClick={() => setStep(Math.max(1, step - 1) as Step)}
        disabled={step === 1}
        className="inline-flex items-center gap-2 rounded-lg border border-paper-4 bg-paper px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden>‹</span> Back
      </button>
      {step < 3 ? (
        <button
          onClick={() => setStep((step + 1) as Step)}
          className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2 text-sm font-semibold text-paper shadow-sm hover:bg-forest-600"
        >
          Next <span aria-hidden>›</span>
        </button>
      ) : !isResults ? (
        <button
          onClick={calculate}
          className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2 text-sm font-semibold text-paper shadow-sm hover:bg-forest-600"
        >
          Calculate <span aria-hidden>›</span>
        </button>
      ) : (
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-2 rounded-lg border border-paper-4 bg-paper px-5 py-2 text-sm font-semibold text-ink-700 hover:bg-paper-2"
        >
          Edit inputs
        </button>
      )}
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="mt-6 text-center text-xs text-ink-400">
      Clinic-acquisition tool. Defaults from public clinic-marketing
      benchmarks; overwrite with real client data as it lands.
    </p>
  );
}

/* ---------- Reusable primitives ---------- */

function PillButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-lg border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-forest-500 bg-forest-500 text-paper shadow-sm"
          : "border-paper-4 bg-paper text-ink-700 hover:border-forest-300 hover:bg-paper-2",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function FieldLabel({
  label,
  required,
  optional,
  hint,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-ink-900">{label}</span>
      {required && <span className="text-forest-500">*</span>}
      {optional && (
        <span className="rounded bg-paper-3 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          Optional
        </span>
      )}
      {hint && (
        <span
          className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-paper-4 text-[10px] text-ink-400"
          title={hint}
        >
          ?
        </span>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-paper-4 bg-paper focus-within:border-forest-500 focus-within:ring-1 focus-within:ring-forest-500">
      {prefix && (
        <span className="flex items-center bg-paper-2 px-3 text-sm font-medium text-ink-500">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step ?? 1}
        min={0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-transparent px-3 py-2 text-sm text-ink-900 outline-none"
      />
      {suffix && (
        <span className="flex items-center bg-paper-2 px-3 text-sm font-medium text-ink-500">
          {suffix}
        </span>
      )}
    </div>
  );
}

function PercentInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <NumberInput
      value={Number((value * 100).toFixed(2))}
      onChange={(v) => onChange(v / 100)}
      suffix="%"
      step={0.5}
    />
  );
}

/* ---------- Steps ---------- */

function StepGoals({
  inputs,
  setInputs,
  sym,
}: {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  sym: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <FieldLabel label="Currency" />
        <select
          value={inputs.currency}
          onChange={(e) =>
            setInputs((p) => ({ ...p, currency: e.target.value as Currency }))
          }
          className="mt-1.5 w-full rounded-lg border border-paper-4 bg-paper px-3 py-2 text-sm text-ink-900 outline-none focus:border-forest-500"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c} ({CURRENCY_SYMBOLS[c]})
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel label="Timeframe" />
        <select
          value={inputs.timeframe}
          onChange={(e) =>
            setInputs((p) => ({
              ...p,
              timeframe: e.target.value as Timeframe,
            }))
          }
          className="mt-1.5 w-full rounded-lg border border-paper-4 bg-paper px-3 py-2 text-sm text-ink-900 outline-none focus:border-forest-500"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly (90 days)</option>
        </select>
      </div>
      <div>
        <FieldLabel label="Total ad spend" required />
        <NumberInput
          value={inputs.totalAdSpend}
          onChange={(v) => setInputs((p) => ({ ...p, totalAdSpend: v }))}
          prefix={sym}
          step={100}
        />
      </div>
      <div>
        <FieldLabel label="Cost per click (CPC)" required hint="Average cost per click" />
        <NumberInput
          value={inputs.funnel.cpc}
          onChange={(v) =>
            setInputs((p) => ({
              ...p,
              preset: "custom",
              funnel: { ...p.funnel, cpc: v },
            }))
          }
          prefix={sym}
          step={0.1}
        />
        <p className="mt-1.5 text-xs text-ink-400">
          If you&apos;re unsure, presets start at {sym}2.25 to {sym}3 for
          clinic Lead Gen.
        </p>
      </div>
    </div>
  );
}

function StepFunnel({
  inputs,
  updateFunnel,
}: {
  inputs: CalculatorInputs;
  updateFunnel: (
    field: keyof CalculatorInputs["funnel"],
    value: number,
  ) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <FieldLabel
          label="Landing page conversion rate"
          required
          hint="Click → lead form submission"
        />
        <PercentInput
          value={inputs.funnel.lpConversionRate}
          onChange={(v) => updateFunnel("lpConversionRate", v)}
        />
        <p className="mt-1.5 text-xs text-ink-400">
          Clinic LP median 4 to 6%.
        </p>
      </div>
      <div>
        <FieldLabel
          label="Qualified lead rate"
          optional
          hint="Lead → qualified (correct service, in-area, real contact)"
        />
        <PercentInput
          value={inputs.funnel.qualifiedLeadRate}
          onChange={(v) => updateFunnel("qualifiedLeadRate", v)}
        />
      </div>
      <div>
        <FieldLabel
          label="Show rate"
          optional
          hint="Qualified → showed up to consultation"
        />
        <PercentInput
          value={inputs.funnel.showRate}
          onChange={(v) => updateFunnel("showRate", v)}
        />
      </div>
      <div>
        <FieldLabel
          label="Close rate"
          required
          hint="Showed → became paying patient"
        />
        <PercentInput
          value={inputs.funnel.closeRate}
          onChange={(v) => updateFunnel("closeRate", v)}
        />
      </div>
    </div>
  );
}

function StepEconomics({
  inputs,
  updateEconomics,
  setInputs,
  sym,
}: {
  inputs: CalculatorInputs;
  updateEconomics: (
    field: keyof CalculatorInputs["economics"],
    value: number,
  ) => void;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  sym: string;
}) {
  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel
            label="Revenue per sale"
            required
            hint="First-treatment revenue per new patient"
          />
          <NumberInput
            value={inputs.economics.revenuePerSale}
            onChange={(v) => updateEconomics("revenuePerSale", v)}
            prefix={sym}
            step={50}
          />
        </div>
        <div>
          <FieldLabel
            label="Gross margin"
            required
            hint="Revenue minus COGS (materials, lab, supplies)"
          />
          <PercentInput
            value={inputs.economics.grossMargin}
            onChange={(v) => updateEconomics("grossMargin", v)}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel
            label="Customer lifetime value (CLV)"
            optional
            hint="Total revenue over 12 months — leave at 0 to ignore"
          />
          <NumberInput
            value={inputs.economics.clv}
            onChange={(v) => updateEconomics("clv", v)}
            prefix={sym}
            step={100}
          />
        </div>
      </div>

      <div className="border-t border-paper-3 pt-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={inputs.stressTest}
            onChange={(e) =>
              setInputs((p) => ({ ...p, stressTest: e.target.checked }))
            }
            className="mt-0.5 h-4 w-4 accent-forest-500"
          />
          <span>
            <span className="block text-sm font-semibold text-ink-900">
              Stress test this plan
            </span>
            <span className="block text-xs text-ink-500">
              Shows what happens if performance is worse than expected
              (CPC +25%, all funnel rates -25%, revenue -10%).
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

/* ---------- Results ---------- */

function Results({
  inputs,
  outputs,
  stress,
  cplScenarios,
  checklist,
  levers,
  funnel,
  guidance,
  ltv,
  sym,
}: {
  inputs: CalculatorInputs;
  outputs: ReturnType<typeof calculate>;
  stress: ReturnType<typeof calculate> | null;
  cplScenarios: ReturnType<typeof scenarioCpls>;
  checklist: ReturnType<typeof conditions>;
  levers: ReturnType<typeof suggestLevers>;
  funnel: ReturnType<typeof funnelDiagram>;
  guidance: ReturnType<typeof stageGuidance>;
  ltv: ReturnType<typeof ltvOutputs>;
  sym: string;
}) {
  return (
    <div className="space-y-7">
      <ProfitabilityBanner
        outputs={outputs}
        ltv={ltv}
        inputs={inputs}
        sym={sym}
      />

      <CplScenarios scenarios={cplScenarios} sym={sym} />

      <MetricsGrid outputs={outputs} inputs={inputs} sym={sym} />

      {ltv && <LtvView ltv={ltv} inputs={inputs} sym={sym} />}

      <FunnelVisual funnel={funnel} />

      {!outputs.isProfitable && levers.length > 0 && (
        <LeversCard levers={levers} sym={sym} />
      )}

      {guidance.length > 0 && <FunnelGuidance guidance={guidance} />}

      <Checklist checklist={checklist} />

      {stress && <StressBlock stress={stress} inputs={inputs} sym={sym} />}
    </div>
  );
}

function ProfitabilityBanner({
  outputs,
  ltv,
  inputs,
  sym,
}: {
  outputs: ReturnType<typeof calculate>;
  ltv: ReturnType<typeof ltvOutputs>;
  inputs: CalculatorInputs;
  sym: string;
}) {
  // Three states: green (both views profitable), amber (negative month-1 but
  // pays back over LTV), red (negative even on LTV). When CLV is 0, fall back
  // to the original 2-state behaviour.
  if (outputs.isProfitable) {
    return (
      <div className="rounded-xl border border-forest-300 bg-forest-50 p-5">
        <p className="text-sm font-semibold text-forest-700">
          Profitable from month 1.
        </p>
        <p className="mt-1 text-xs text-ink-600">
          First-treatment gross profit clears ad spend without relying on LTV.
          Net contribution: +{sym}
          {formatCurrency(outputs.netProfit, inputs.currency)} per period.
        </p>
      </div>
    );
  }

  if (ltv && ltv.isProfitableOnLtv) {
    return (
      <div className="rounded-xl border border-gold-300 bg-gold-50 p-5">
        <p className="text-sm font-semibold text-gold-700">
          Profitable over 12-month LTV, negative on month-1 cash.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-ink-700">
          <li>
            Month-1 net:{" "}
            <strong>
              -{sym}
              {formatCurrency(Math.abs(outputs.netProfit), inputs.currency)}
            </strong>{" "}
            (first treatment alone doesn&apos;t clear spend)
          </li>
          <li>
            LTV net:{" "}
            <strong>
              +{sym}
              {formatCurrency(ltv.trueNetContribution, inputs.currency)}
            </strong>{" "}
            once these patients complete their 12-month spend
          </li>
          <li>
            Payback period:{" "}
            <strong>{ltv.paybackMonths.toFixed(1)} months</strong>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-400 bg-rose-50 p-5">
      <p className="text-sm font-semibold text-rose-500">
        This model is not profitable, even on a 12-month LTV view.
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-ink-700">
        <li>
          Month-1 net:{" "}
          <strong>
            -{sym}
            {formatCurrency(Math.abs(outputs.netProfit), inputs.currency)}
          </strong>{" "}
          per period
        </li>
        {ltv ? (
          <li>
            LTV net:{" "}
            <strong>
              -{sym}
              {formatCurrency(
                Math.abs(ltv.trueNetContribution),
                inputs.currency,
              )}
            </strong>{" "}
            (LTV:CAC {ltv.ltvToCac.toFixed(2)}:1, healthy is 3:1+)
          </li>
        ) : (
          <li>
            ROAS {outputs.roas.toFixed(2)}x is below breakeven of{" "}
            {outputs.breakevenRoas.toFixed(2)}x
          </li>
        )}
        <li>
          CPC must drop to{" "}
          {formatCurrencyCompact(outputs.breakevenCpc, inputs.currency)} or
          the funnel must improve.
        </li>
      </ul>
    </div>
  );
}

function LtvView({
  ltv,
  inputs,
  sym,
}: {
  ltv: NonNullable<ReturnType<typeof ltvOutputs>>;
  inputs: CalculatorInputs;
  sym: string;
}) {
  const ltvCacTone =
    ltv.ltvToCac >= 5
      ? "positive"
      : ltv.ltvToCac >= 3
        ? undefined
        : "negative";

  const paybackTone = ltv.paysBackWithin12Months ? "positive" : "negative";

  return (
    <div>
      <h3 className="font-serif text-lg text-ink-900">
        12-month LTV view
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Same spend, same sales — projected over each patient&apos;s 12-month
        lifetime value of {sym}
        {formatCurrency(inputs.economics.clv, inputs.currency)}.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricTile
          label="LTV revenue"
          value={`${sym}${formatCompactInt(ltv.ltvRevenue)}`}
        />
        <MetricTile
          label="LTV gross profit"
          value={`${sym}${formatCurrency(ltv.ltvGrossProfit, inputs.currency)}`}
        />
        <MetricTile
          label="True net contribution"
          value={`${ltv.trueNetContribution >= 0 ? "+" : "-"}${sym}${formatCurrency(Math.abs(ltv.trueNetContribution), inputs.currency)}`}
          tone={ltv.isProfitableOnLtv ? "positive" : "negative"}
        />
        <MetricTile
          label="True ROAS (LTV-based)"
          value={`${ltv.trueRoas.toFixed(2)}x`}
          tone={ltv.trueRoas >= 1 / inputs.economics.grossMargin ? "positive" : "negative"}
        />
        <MetricTile
          label="LTV:CAC ratio"
          value={`${ltv.ltvToCac.toFixed(2)}:1`}
          tone={ltvCacTone}
          hint="Healthy 3:1, great 5:1+"
        />
        <MetricTile
          label="Payback period"
          value={
            isFinite(ltv.paybackMonths)
              ? `${ltv.paybackMonths.toFixed(1)} mo`
              : "∞"
          }
          tone={paybackTone}
          hint="Months until ad spend recouped"
        />
      </div>
    </div>
  );
}

function FunnelGuidance({
  guidance,
}: {
  guidance: ReturnType<typeof stageGuidance>;
}) {
  const toneStyle: Record<
    "red" | "orange",
    { border: string; bg: string; tag: string; tagText: string }
  > = {
    red: {
      border: "border-rose-300",
      bg: "bg-rose-50",
      tag: "bg-rose-500 text-paper",
      tagText: "Needs fixing",
    },
    orange: {
      border: "border-gold-300",
      bg: "bg-gold-50",
      tag: "bg-gold-500 text-paper",
      tagText: "Room to improve",
    },
  };

  return (
    <div>
      <h3 className="font-serif text-lg text-ink-900">
        How to improve the funnel
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Where the funnel is below best-in-class, here&apos;s the likely
        issue and the fix.
      </p>
      <div className="mt-3 space-y-3">
        {guidance.map((g) => {
          const tone = g.tone === "green" ? null : toneStyle[g.tone];
          if (!tone) return null;
          return (
            <div
              key={g.fromTo}
              className={`rounded-xl border ${tone.border} ${tone.bg} p-4`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-ink-900">
                  {g.stage}
                </span>
                <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-mono text-ink-500">
                  {formatPercent(g.rate)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.tag}`}
                >
                  {tone.tagText}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-ink-800">
                {g.issue}
              </p>
              <p className="mt-1 text-sm text-ink-600">{g.fix}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FunnelVisual({
  funnel,
}: {
  funnel: ReturnType<typeof funnelDiagram>;
}) {
  const toneClasses: Record<
    "red" | "orange" | "green",
    { text: string; bg: string; border: string; badge: string }
  > = {
    red: {
      text: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-300",
      badge: "bg-rose-50 text-rose-500 border border-rose-300",
    },
    orange: {
      text: "text-gold-700",
      bg: "bg-gold-50",
      border: "border-gold-300",
      badge: "bg-gold-50 text-gold-700 border border-gold-300",
    },
    green: {
      text: "text-forest-600",
      bg: "bg-forest-50",
      border: "border-forest-300",
      badge: "bg-forest-50 text-forest-600 border border-forest-300",
    },
  };

  const opp = funnel.biggestOpportunity;
  const oppTone = toneClasses["green"];

  return (
    <div>
      <h3 className="font-serif text-lg text-ink-900">
        What does your funnel look like?
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        How {formatInteger(funnel.stages[0].count)} clicks become{" "}
        {formatInteger(funnel.stages[funnel.stages.length - 1].count)} sales.
      </p>

      <div className="mt-4 rounded-xl border border-paper-3 bg-paper p-5">
        <div className="flex items-center gap-2">
          {funnel.stages.map((stage, i) => (
            <div key={stage.label} className="contents">
              <div className="flex flex-1 flex-col items-center text-center">
                <span className="font-serif text-2xl font-medium text-ink-900 sm:text-3xl">
                  {formatCompactInt(stage.count)}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500 sm:text-xs">
                  {stage.label}
                </span>
              </div>
              {i < funnel.stages.length - 1 && (
                <div className="flex flex-shrink-0 flex-col items-center gap-0.5">
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs",
                      toneClasses[funnel.transitions[i].tone].badge,
                    ].join(" ")}
                  >
                    {formatPercent(funnel.transitions[i].rate)}
                  </span>
                  <span className="text-[10px] leading-none text-ink-300" aria-hidden>
                    ›
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {opp.alreadyGreen ? (
          <div className="mt-5 rounded-lg border border-forest-300 bg-forest-50 px-4 py-3">
            <p className="text-sm font-semibold text-forest-700">
              Every funnel stage is at or above best-in-class.
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              No single-stage tweak will materially lift sales. To scale,
              raise spend or lift CPC efficiency.
            </p>
          </div>
        ) : (
          <div
            className={[
              "mt-5 rounded-lg border px-4 py-3",
              oppTone.border,
              oppTone.bg,
            ].join(" ")}
          >
            <p className={`text-sm font-semibold ${oppTone.text}`}>
              Biggest opportunity: {opp.from} → {opp.to} (push{" "}
              {formatPercent(opp.currentRate)} → {formatPercent(opp.targetRate)})
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              Moving just this stage to best-in-class lifts sales from{" "}
              {formatInteger(opp.currentSales)} to{" "}
              {formatInteger(opp.hypotheticalSales)} (
              <strong className="text-forest-600">
                +{formatInteger(opp.salesLift)}
              </strong>
              ). Highest-leverage fix in the funnel.
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-forest-300 bg-forest-50" />
            Best-in-class
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-gold-300 bg-gold-50" />
            Acceptable
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-rose-300 bg-rose-50" />
            Below benchmark
          </span>
          <span className="ml-auto text-[10px] text-ink-300">
            Thresholds: LP 5/8% · Qual 25/45% · Show 40/75% · Close 20/60%
          </span>
        </div>
      </div>
    </div>
  );
}

function CplScenarios({
  scenarios,
  sym,
}: {
  scenarios: ReturnType<typeof scenarioCpls>;
  sym: string;
}) {
  const cards: Array<{
    label: string;
    tone: "rose" | "gold" | "forest";
    cpl: number;
    leads: number;
    note: string;
  }> = [
    {
      label: "Worst case",
      tone: "rose",
      cpl: scenarios[0].costPerLead,
      leads: scenarios[0].leads,
      note: "Conservative preset",
    },
    {
      label: "Mid case",
      tone: "gold",
      cpl: scenarios[1].costPerLead,
      leads: scenarios[1].leads,
      note: "Realistic preset",
    },
    {
      label: "Best case",
      tone: "forest",
      cpl: scenarios[2].costPerLead,
      leads: scenarios[2].leads,
      note: "Aggressive preset",
    },
  ];

  return (
    <div>
      <h3 className="font-serif text-lg text-ink-900">
        Cost per lead by scenario
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={[
              "rounded-xl border p-4",
              c.tone === "rose"
                ? "border-rose-300 bg-rose-50"
                : c.tone === "gold"
                  ? "border-gold-300 bg-gold-50"
                  : "border-forest-300 bg-forest-50",
            ].join(" ")}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {c.label}
            </p>
            <p className="mt-1.5 font-serif text-2xl font-medium text-ink-900">
              {sym}
              {formatCurrency(c.cpl, "")} <span className="text-sm font-sans text-ink-500">per lead</span>
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {formatInteger(c.leads)} leads — {c.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsGrid({
  outputs,
  inputs,
  sym,
}: {
  outputs: ReturnType<typeof calculate>;
  inputs: CalculatorInputs;
  sym: string;
}) {
  const profitable = outputs.isProfitable;

  const volume = [
    {
      label: "Ad spend",
      value: `${sym}${formatCompactInt(inputs.totalAdSpend)}`,
    },
    { label: "Clicks", value: formatCompactInt(outputs.clicks) },
    { label: "Leads", value: formatInteger(outputs.leads) },
    { label: "Sales", value: formatInteger(outputs.sales) },
  ];

  const profitability = [
    {
      label: "Revenue",
      value: `${sym}${formatCompactInt(outputs.revenue)}`,
    },
    {
      label: "Gross profit",
      value: `${sym}${formatCurrency(outputs.grossProfit, inputs.currency)}`,
    },
    {
      label: "Net profit",
      value: `${outputs.netProfit >= 0 ? "+" : "-"}${sym}${formatCompactInt(Math.abs(outputs.netProfit))}`,
      tone: profitable ? "positive" : "negative",
    },
    {
      label: "ROAS",
      value: `${outputs.roas.toFixed(2)}x`,
      tone: outputs.roas >= outputs.breakevenRoas ? "positive" : "negative",
    },
  ];

  const efficiency = [
    {
      label: "ROI %",
      value: `${outputs.roiPercent.toFixed(1)}%`,
      tone: outputs.roiPercent >= 0 ? "positive" : "negative",
    },
    {
      label: "CPL",
      value: `${sym}${formatCurrency(outputs.costPerLead, inputs.currency)}`,
    },
    {
      label: "CAC",
      value: `${sym}${formatCurrency(outputs.costPerSale, inputs.currency)}`,
    },
    {
      label: "Profit per sale",
      value: `${outputs.profitPerSale >= 0 ? "+" : "-"}${sym}${formatCurrency(Math.abs(outputs.profitPerSale), inputs.currency)}`,
      tone: outputs.profitPerSale >= 0 ? "positive" : "negative",
    },
  ];

  const breakeven = [
    {
      label: "Breakeven CPC",
      value: `${sym}${formatCurrency(outputs.breakevenCpc, inputs.currency)}`,
    },
    {
      label: "Max CPA",
      value: `${sym}${formatCurrency(outputs.maxCpa, inputs.currency)}`,
    },
    {
      label: "Breakeven ROAS",
      value: `${outputs.breakevenRoas.toFixed(2)}x`,
    },
    {
      label: "Breakeven sales",
      value: formatInteger(outputs.breakevenSales),
    },
  ];

  return (
    <div>
      <h3 className="font-serif text-lg text-ink-900">
        Key metrics (month-1 cash)
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        First-treatment math only. For 12-month LTV view, see the section
        below.
      </p>

      <MetricGroup title="Volume" tiles={volume} />
      <MetricGroup title="Profitability" tiles={profitability} />
      <MetricGroup title="Unit cost" tiles={efficiency} />
      <MetricGroup title="Breakeven thresholds" tiles={breakeven} />
    </div>
  );
}

function MetricGroup({
  title,
  tiles,
}: {
  title: string;
  tiles: Array<{
    label: string;
    value: string;
    tone?: string;
    hint?: string;
  }>;
}) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
        {title}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone?: string;
  hint?: string;
}) {
  const color =
    tone === "positive"
      ? "text-forest-600"
      : tone === "negative"
        ? "text-rose-500"
        : "text-ink-900";
  return (
    <div className="rounded-lg border border-paper-3 bg-paper p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className={`mt-1 font-serif text-xl font-medium ${color}`}>{value}</p>
      {hint && <p className="mt-1 text-[10px] text-ink-300">{hint}</p>}
    </div>
  );
}

function LeversCard({
  levers,
  sym,
}: {
  levers: ReturnType<typeof suggestLevers>;
  sym: string;
}) {
  return (
    <div className="rounded-xl border border-paper-3 bg-paper-2 p-5">
      <h3 className="font-serif text-lg text-ink-900">
        What needs to change for this to work?
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        The two smallest single-variable changes that would turn this
        profitable.
      </p>
      <ul className="mt-3 space-y-2">
        {levers.map((l) => (
          <li
            key={l.field}
            className="flex items-center justify-between rounded-lg bg-paper px-4 py-2.5"
          >
            <span className="text-sm font-semibold text-ink-900">
              {l.label}
            </span>
            <span className="text-sm text-ink-500">
              <span className="font-mono">
                {l.unit === "currency"
                  ? `${sym}${l.currentValue.toFixed(2)}`
                  : formatPercent(l.currentValue)}
              </span>
              <span className="mx-2 text-ink-300">→</span>
              <span className="font-mono font-semibold text-forest-600">
                {l.unit === "currency"
                  ? `${sym}${l.targetValue.toFixed(2)}`
                  : formatPercent(l.targetValue)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Checklist({
  checklist,
}: {
  checklist: ReturnType<typeof conditions>;
}) {
  return (
    <div>
      <h3 className="font-serif text-lg text-ink-900">
        What must be true for this to work?
      </h3>
      <ul className="mt-3 space-y-2">
        {checklist.map((c, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-paper-3 bg-paper px-4 py-3"
          >
            <span
              className={[
                "mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-paper",
                c.pass ? "bg-forest-500" : "bg-rose-500",
              ].join(" ")}
              aria-hidden
            >
              {c.pass ? "✓" : "✕"}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-ink-900">
                {c.label}
              </span>
              <span className="block text-xs text-ink-500">{c.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StressBlock({
  stress,
  inputs,
  sym,
}: {
  stress: ReturnType<typeof calculate>;
  inputs: CalculatorInputs;
  sym: string;
}) {
  return (
    <div className="rounded-xl border border-gold-300 bg-gold-50 p-5">
      <h3 className="font-serif text-lg text-ink-900">
        Stress test — performance worse than expected
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        If CPC is 25% higher and funnel rates 25% lower than your inputs.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile label="Sales" value={formatInteger(stress.sales)} />
        <MetricTile
          label="Revenue"
          value={`${sym}${formatCompactInt(stress.revenue)}`}
        />
        <MetricTile
          label="Net profit"
          value={`${stress.netProfit >= 0 ? "+" : "-"}${sym}${formatCompactInt(Math.abs(stress.netProfit))}`}
          tone={stress.netProfit >= 0 ? "positive" : "negative"}
        />
        <MetricTile
          label="ROAS"
          value={`${stress.roas.toFixed(2)}x`}
          tone={stress.roas >= stress.breakevenRoas ? "positive" : "negative"}
        />
      </div>
    </div>
  );
}
