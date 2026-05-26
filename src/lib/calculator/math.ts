import { PRESETS, applyStressTest } from "./defaults";
import type {
  CalculatorInputs,
  CalculatorOutputs,
  FunnelRates,
  PresetValues,
  ScenarioCpl,
  UnitEconomics,
} from "./types";

function safe(n: number, d: number): number {
  return d > 0 ? n / d : 0;
}

export function calculate(inputs: CalculatorInputs): CalculatorOutputs {
  const { funnel, economics, totalAdSpend } = inputs;

  const clicks = funnel.cpc > 0 ? totalAdSpend / funnel.cpc : 0;
  const leads = clicks * funnel.lpConversionRate;
  const qualifiedLeads = leads * funnel.qualifiedLeadRate;
  const showedAppts = qualifiedLeads * funnel.showRate;
  const sales = showedAppts * funnel.closeRate;

  const revenue = sales * economics.revenuePerSale;
  const grossProfit = revenue * economics.grossMargin;
  const profitPerSale =
    economics.revenuePerSale * economics.grossMargin -
    safe(totalAdSpend, sales);
  const netProfit = grossProfit - totalAdSpend;
  const roas = safe(revenue, totalAdSpend);
  const roiPercent = totalAdSpend > 0 ? (netProfit / totalAdSpend) * 100 : 0;

  const grossProfitPerSale = economics.revenuePerSale * economics.grossMargin;

  const funnelProduct =
    funnel.lpConversionRate *
    funnel.qualifiedLeadRate *
    funnel.showRate *
    funnel.closeRate;

  const breakevenCpc = funnelProduct > 0 ? grossProfitPerSale * funnelProduct : 0;
  const breakevenSales =
    grossProfitPerSale > 0 ? Math.ceil(totalAdSpend / grossProfitPerSale) : 0;
  const maxCpa = grossProfitPerSale;
  const breakevenRoas =
    economics.grossMargin > 0 ? 1 / economics.grossMargin : 0;

  return {
    clicks,
    leads,
    qualifiedLeads,
    showedAppts,
    sales,

    costPerLead: safe(totalAdSpend, leads),
    costPerQualifiedLead: safe(totalAdSpend, qualifiedLeads),
    costPerShowed: safe(totalAdSpend, showedAppts),
    costPerSale: safe(totalAdSpend, sales),

    revenue,
    grossProfit,
    profitPerSale,
    netProfit,
    roas,
    roiPercent,

    breakevenCpc,
    breakevenSales,
    maxCpa,
    breakevenRoas,

    isProfitable: netProfit >= 0,
  };
}

/**
 * Three cost-per-lead scenarios using each preset, at the user's spend level.
 * Shows the range the user could expect at conservative / realistic / aggressive
 * funnel performance.
 */
export function scenarioCpls(totalAdSpend: number): ScenarioCpl[] {
  const presets: Array<{
    label: ScenarioCpl["label"];
    preset: ScenarioCpl["preset"];
  }> = [
    { label: "Worst", preset: "conservative" },
    { label: "Mid", preset: "realistic" },
    { label: "Best", preset: "aggressive" },
  ];

  return presets.map(({ label, preset }) => {
    const p = PRESETS[preset];
    const clicks = p.cpc > 0 ? totalAdSpend / p.cpc : 0;
    const leads = clicks * p.lpConversionRate;
    return {
      label,
      preset,
      costPerLead: safe(totalAdSpend, leads),
      leads,
    };
  });
}

/**
 * "What must be true" checklist items.
 * Returns an array of conditions that need to hold for the plan to work,
 * each with a pass/fail state.
 */
export type Condition = {
  label: string;
  pass: boolean;
  detail: string;
};

export function conditions(
  inputs: CalculatorInputs,
  outputs: CalculatorOutputs,
): Condition[] {
  const breakevenCpc = outputs.breakevenCpc;
  const breakevenCac = outputs.maxCpa;

  return [
    {
      label: `Your CPC must stay at or below ${formatCurrencyCompact(breakevenCpc, inputs.currency)}`,
      pass: inputs.funnel.cpc <= breakevenCpc * 1.0,
      detail: `Current CPC: ${formatCurrencyCompact(inputs.funnel.cpc, inputs.currency)}`,
    },
    {
      label: `Your customer acquisition cost (CAC) must stay below ${formatCurrencyCompact(breakevenCac, inputs.currency)}`,
      pass: outputs.costPerSale <= breakevenCac,
      detail: `Current CAC: ${formatCurrencyCompact(outputs.costPerSale, inputs.currency)}`,
    },
    {
      label: `Your landing page must convert at ${formatPercent(FUNNEL_BENCHMARKS.lpConversion.red)} or higher`,
      pass:
        inputs.funnel.lpConversionRate >= FUNNEL_BENCHMARKS.lpConversion.red,
      detail: `Current rate: ${formatPercent(inputs.funnel.lpConversionRate)}`,
    },
    {
      label: `Your ROAS needs to be at least ${outputs.breakevenRoas.toFixed(2)}x to clear gross margin`,
      pass: outputs.roas >= outputs.breakevenRoas,
      detail: `Current ROAS: ${outputs.roas.toFixed(2)}x`,
    },
    {
      label: `Reverse-planning math: each ad dollar needs to return at least ${formatCurrencyCompact(1 / inputs.economics.grossMargin, inputs.currency)} in revenue`,
      pass: outputs.roas >= outputs.breakevenRoas,
      detail: `At ${formatPercent(inputs.economics.grossMargin)} margin`,
    },
    {
      label: "Gross profit must clear the ad spend on first treatment alone",
      pass: outputs.netProfit >= 0,
      detail:
        outputs.netProfit >= 0
          ? `Net contribution: ${formatCurrencyCompact(outputs.netProfit, inputs.currency)}`
          : `Shortfall: ${formatCurrencyCompact(Math.abs(outputs.netProfit), inputs.currency)} — LTV / recurring visits must close the gap`,
    },
  ];
}

/**
 * "What needs to change" — the 1-2 most impactful single-variable changes
 * that would turn an unprofitable plan profitable.
 */
export type Lever = {
  field: string;
  label: string;
  currentValue: number;
  targetValue: number;
  unit: "percent" | "currency";
  improvementPct: number;
};

export function suggestLevers(
  inputs: CalculatorInputs,
  outputs: CalculatorOutputs,
): Lever[] {
  if (outputs.isProfitable) return [];
  if (outputs.sales <= 0) {
    return [
      {
        field: "spend",
        label: "Ad spend",
        currentValue: inputs.totalAdSpend,
        targetValue: inputs.totalAdSpend * 2,
        unit: "currency",
        improvementPct: 100,
      },
    ];
  }

  const requiredRoas = outputs.breakevenRoas;
  const currentRoas = outputs.roas;
  const lift = requiredRoas / Math.max(currentRoas, 0.0001);

  const candidates: Lever[] = [
    {
      field: "cpc",
      label: "Cost per click",
      currentValue: inputs.funnel.cpc,
      targetValue: inputs.funnel.cpc / lift,
      unit: "currency",
      improvementPct: (1 - 1 / lift) * 100,
    },
    {
      field: "lpConversionRate",
      label: "Landing page conversion rate",
      currentValue: inputs.funnel.lpConversionRate,
      targetValue: Math.min(inputs.funnel.lpConversionRate * lift, 0.15),
      unit: "percent",
      improvementPct: (lift - 1) * 100,
    },
    {
      field: "closeRate",
      label: "Close rate",
      currentValue: inputs.funnel.closeRate,
      targetValue: Math.min(inputs.funnel.closeRate * lift, 0.5),
      unit: "percent",
      improvementPct: (lift - 1) * 100,
    },
    {
      field: "revenuePerSale",
      label: "Revenue per sale",
      currentValue: inputs.economics.revenuePerSale,
      targetValue: inputs.economics.revenuePerSale * lift,
      unit: "currency",
      improvementPct: (lift - 1) * 100,
    },
  ];

  return candidates
    .map((c) => ({
      ...c,
      _deltaRatio: Math.abs(c.targetValue - c.currentValue) / c.currentValue,
    }))
    .sort((a, b) => a._deltaRatio - b._deltaRatio)
    .slice(0, 2)
    .map(({ _deltaRatio: _, ...rest }) => rest);
}

/**
 * Per-stage benchmarks for funnel diagram colour coding.
 * Green = at or above Aggressive preset (or industry "good" where preset is flat).
 * Orange = between Conservative and Aggressive.
 * Red = below Conservative.
 */
/**
 * Funnel-stage benchmarks (Charlie's values, derived from clinic-acquisition norms).
 * red = value < red, green = value >= green, orange = between.
 */
export const FUNNEL_BENCHMARKS = {
  lpConversion: { red: 0.05, green: 0.08 },
  qualifiedLead: { red: 0.25, green: 0.45 },
  showRate: { red: 0.4, green: 0.75 },
  closeRate: { red: 0.2, green: 0.6 },
};

export type StageTone = "red" | "orange" | "green";

export function stageTone(
  value: number,
  bench: { red: number; green: number },
): StageTone {
  if (value < bench.red) return "red";
  if (value >= bench.green) return "green";
  return "orange";
}

export type FunnelStage = {
  label: string;
  count: number;
};

export type FunnelTransition = {
  from: string;
  to: string;
  rate: number;
  lost: number;
  tone: StageTone;
};

export type FunnelDiagram = {
  stages: FunnelStage[];
  transitions: FunnelTransition[];
  biggestOpportunity: BiggestOpportunity;
};

export type BiggestOpportunity = {
  from: string;
  to: string;
  currentRate: number;
  targetRate: number;
  currentSales: number;
  hypotheticalSales: number;
  salesLift: number;
  alreadyGreen: boolean;
};


export type StageGuidance = {
  stage: string;
  fromTo: string;
  rate: number;
  tone: StageTone;
  issue: string;
  fix: string;
};

const STAGE_FIX_RED: Record<string, { issue: string; fix: string }> = {
  "Clicks→Leads": {
    issue:
      "Your landing page is leaking traffic before it converts. Visitors arrive but don't fill the form.",
    fix: "Match the headline to the ad copy. Cut the form to 4 fields max. Add proof above the fold (Google reviews, before-and-after, certifications). Audit mobile page speed: anything over 3 seconds bleeds conversions.",
  },
  "Leads→Qualified": {
    issue:
      "Speed to lead is killing qualification. Leads contacted within 5 minutes are up to 21x more likely to qualify than leads contacted after 30 minutes (Harvard / InsideSales study). Most clinics respond in hours, not minutes.",
    fix: "Get first-response time under 5 minutes. This single change moves the qualification rate more than any targeting tweak. Then add 2 to 3 qualifying questions to the form (budget range, treatment type, timeframe) to filter bad fits at the form stage rather than the consult.",
  },
  "Qualified→Showed": {
    issue:
      "Booked patients aren't showing up. Same speed-to-lead principle: the longer between booking and confirmation, the higher the no-show rate.",
    fix: "Confirm bookings within 5 minutes with a personal message. Multi-channel reminders (SMS plus email) 24 hours and 1 hour before. Make rescheduling one-click. For high-ticket consults, consider a small refundable deposit.",
  },
  "Showed→Sales": {
    issue:
      "Patients are showing up but not buying. Either the offer, the price presentation, or the in-clinic sales motion is off.",
    fix: "Present price after building value, not before. Add financing options (CareCredit, payment plans). Send a written treatment plan within 24 hours of the consult. Follow up if no decision in 48 hours.",
  },
};

const STAGE_FIX_ORANGE: Record<string, { issue: string; fix: string }> = {
  "Clicks→Leads": {
    issue: "Landing page conversion is acceptable but below best-in-class.",
    fix: "Cut form fields, tighten the offer, and test bolder headlines to push above 8%.",
  },
  "Leads→Qualified": {
    issue:
      "Lead quality is acceptable but the speed-to-lead opportunity is sitting on the table.",
    fix: "Drop first-response time below 5 minutes (vs typical 1 to 24 hours). Per the Harvard / InsideSales study, this alone can add 30 to 50% to qualification without changing anything upstream.",
  },
  "Qualified→Showed": {
    issue: "Show rate is acceptable but below well-run-clinic standard.",
    fix: "Faster first response and a 1-hour SMS reminder are usually enough to push above 75%.",
  },
  "Showed→Sales": {
    issue: "Close rate is acceptable but you're leaving sales on the table.",
    fix: "Financing options and a written 24-hour follow-up can push above 60%.",
  },
};

export function stageGuidance(funnel: FunnelDiagram): StageGuidance[] {
  return funnel.transitions
    .filter((t) => t.tone !== "green")
    .map((t) => {
      const key = `${t.from}→${t.to}`;
      const copy =
        t.tone === "red"
          ? STAGE_FIX_RED[key]
          : STAGE_FIX_ORANGE[key];
      return {
        stage: `${t.from} → ${t.to}`,
        fromTo: key,
        rate: t.rate,
        tone: t.tone,
        issue: copy?.issue ?? "",
        fix: copy?.fix ?? "",
      };
    })
    .sort((a, b) => {
      // Red before orange
      if (a.tone === b.tone) return 0;
      if (a.tone === "red") return -1;
      return 1;
    });
}

export function funnelDiagram(
  outputs: CalculatorOutputs,
  inputs: CalculatorInputs,
): FunnelDiagram {
  const stages: FunnelStage[] = [
    { label: "Clicks", count: outputs.clicks },
    { label: "Leads", count: outputs.leads },
    { label: "Qualified", count: outputs.qualifiedLeads },
    { label: "Showed", count: outputs.showedAppts },
    { label: "Sales", count: outputs.sales },
  ];

  const transitions: FunnelTransition[] = [
    {
      from: "Clicks",
      to: "Leads",
      rate: inputs.funnel.lpConversionRate,
      lost: outputs.clicks - outputs.leads,
      tone: stageTone(
        inputs.funnel.lpConversionRate,
        FUNNEL_BENCHMARKS.lpConversion,
      ),
    },
    {
      from: "Leads",
      to: "Qualified",
      rate: inputs.funnel.qualifiedLeadRate,
      lost: outputs.leads - outputs.qualifiedLeads,
      tone: stageTone(
        inputs.funnel.qualifiedLeadRate,
        FUNNEL_BENCHMARKS.qualifiedLead,
      ),
    },
    {
      from: "Qualified",
      to: "Showed",
      rate: inputs.funnel.showRate,
      lost: outputs.qualifiedLeads - outputs.showedAppts,
      tone: stageTone(inputs.funnel.showRate, FUNNEL_BENCHMARKS.showRate),
    },
    {
      from: "Showed",
      to: "Sales",
      rate: inputs.funnel.closeRate,
      lost: outputs.showedAppts - outputs.sales,
      tone: stageTone(inputs.funnel.closeRate, FUNNEL_BENCHMARKS.closeRate),
    },
  ];

  return {
    stages,
    transitions,
    biggestOpportunity: biggestImprovementOpportunity(inputs, outputs),
  };
}

/**
 * For each funnel stage, simulate moving JUST that stage to its green
 * threshold and recompute sales. Pick the stage with the largest sales lift.
 *
 * This replaces the lazier "biggest count lost" logic, which always
 * pointed at LP because that's where funnel volume cuts the most by
 * definition. Marginal analysis is more actionable: "fix this stage first
 * because it has the biggest upside."
 */
function biggestImprovementOpportunity(
  inputs: CalculatorInputs,
  outputs: CalculatorOutputs,
): BiggestOpportunity {
  const f = inputs.funnel;
  const clicks = outputs.clicks;
  const currentSales = outputs.sales;

  const stages: Array<{
    from: string;
    to: string;
    currentRate: number;
    greenThreshold: number;
    rates: [number, number, number, number];
  }> = [
    {
      from: "Clicks",
      to: "Leads",
      currentRate: f.lpConversionRate,
      greenThreshold: FUNNEL_BENCHMARKS.lpConversion.green,
      rates: [f.lpConversionRate, f.qualifiedLeadRate, f.showRate, f.closeRate],
    },
    {
      from: "Leads",
      to: "Qualified",
      currentRate: f.qualifiedLeadRate,
      greenThreshold: FUNNEL_BENCHMARKS.qualifiedLead.green,
      rates: [f.lpConversionRate, f.qualifiedLeadRate, f.showRate, f.closeRate],
    },
    {
      from: "Qualified",
      to: "Showed",
      currentRate: f.showRate,
      greenThreshold: FUNNEL_BENCHMARKS.showRate.green,
      rates: [f.lpConversionRate, f.qualifiedLeadRate, f.showRate, f.closeRate],
    },
    {
      from: "Showed",
      to: "Sales",
      currentRate: f.closeRate,
      greenThreshold: FUNNEL_BENCHMARKS.closeRate.green,
      rates: [f.lpConversionRate, f.qualifiedLeadRate, f.showRate, f.closeRate],
    },
  ];

  let best: BiggestOpportunity = {
    from: stages[0].from,
    to: stages[0].to,
    currentRate: stages[0].currentRate,
    targetRate: stages[0].greenThreshold,
    currentSales,
    hypotheticalSales: currentSales,
    salesLift: 0,
    alreadyGreen: true,
  };

  stages.forEach((s, i) => {
    const targetRate = Math.max(s.currentRate, s.greenThreshold);
    const hypoRates = [...s.rates];
    hypoRates[i] = targetRate;
    const hypoSales =
      clicks * hypoRates[0] * hypoRates[1] * hypoRates[2] * hypoRates[3];
    const lift = hypoSales - currentSales;
    if (lift > best.salesLift) {
      best = {
        from: s.from,
        to: s.to,
        currentRate: s.currentRate,
        targetRate,
        currentSales,
        hypotheticalSales: hypoSales,
        salesLift: lift,
        alreadyGreen: s.currentRate >= s.greenThreshold,
      };
    }
  });

  return best;
}

export type LtvOutputs = {
  ltvRevenue: number;
  ltvGrossProfit: number;
  trueNetContribution: number;
  trueRoas: number;
  cac: number;
  ltvToCac: number;
  paybackMonths: number;
  paysBackWithin12Months: boolean;
  isProfitableOnLtv: boolean;
};

/**
 * 12-month LTV view. Null when CLV is 0 (user opted out of LTV math).
 *
 * Payback is computed at the cohort level: how many months of evenly-spread
 * LTV contribution from this month's new patients until ad spend is recouped.
 * Assumes CLV represents 12-month revenue; monthly contribution per patient
 * = CLV × margin / 12.
 */
export function ltvOutputs(
  inputs: CalculatorInputs,
  outputs: CalculatorOutputs,
): LtvOutputs | null {
  const clv = inputs.economics.clv;
  if (clv <= 0) return null;

  const margin = inputs.economics.grossMargin;
  const ltvRevenue = outputs.sales * clv;
  const ltvGrossProfit = ltvRevenue * margin;
  const trueNetContribution = ltvGrossProfit - inputs.totalAdSpend;
  const trueRoas =
    inputs.totalAdSpend > 0 ? ltvRevenue / inputs.totalAdSpend : 0;
  const cac = outputs.costPerSale;
  const ltvToCac = cac > 0 ? clv / cac : 0;
  const monthlyContributionPerPatient = (clv * margin) / 12;
  const monthlyCohortProfit = outputs.sales * monthlyContributionPerPatient;
  const paybackMonths =
    monthlyCohortProfit > 0
      ? inputs.totalAdSpend / monthlyCohortProfit
      : Infinity;

  return {
    ltvRevenue,
    ltvGrossProfit,
    trueNetContribution,
    trueRoas,
    cac,
    ltvToCac,
    paybackMonths,
    paysBackWithin12Months: paybackMonths <= 12,
    isProfitableOnLtv: trueNetContribution >= 0,
  };
}

export function stressTestOutputs(
  inputs: CalculatorInputs,
): CalculatorOutputs {
  const stressed = applyStressTest({
    cpc: inputs.funnel.cpc,
    lpConversionRate: inputs.funnel.lpConversionRate,
    qualifiedLeadRate: inputs.funnel.qualifiedLeadRate,
    showRate: inputs.funnel.showRate,
    closeRate: inputs.funnel.closeRate,
    revenuePerSale: inputs.economics.revenuePerSale,
    grossMargin: inputs.economics.grossMargin,
    clv: inputs.economics.clv,
  });

  const stressedInputs: CalculatorInputs = {
    ...inputs,
    funnel: {
      cpc: stressed.cpc,
      lpConversionRate: stressed.lpConversionRate,
      qualifiedLeadRate: stressed.qualifiedLeadRate,
      showRate: stressed.showRate,
      closeRate: stressed.closeRate,
    },
    economics: {
      revenuePerSale: stressed.revenuePerSale,
      grossMargin: stressed.grossMargin,
      clv: stressed.clv,
    },
  };

  return calculate(stressedInputs);
}

export function formatCurrency(value: number, _currency: string): string {
  const abs = Math.abs(value);
  // Values under 100 always show 2 decimals (so "1.5" renders as "1.50").
  // Values 100 and up show no decimals (cleaner for thousands).
  const decimals = abs < 100 ? 2 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.round(value * 100) / 100);
}

export function formatCurrencyCompact(
  value: number,
  currency: string,
): string {
  const sym = currencySymbol(currency);
  const abs = Math.abs(value);
  if (abs >= 10000) return `${sym}${(value / 1000).toFixed(1)}K`;
  if (abs >= 1000) return `${sym}${(value / 1000).toFixed(2)}K`;
  return `${sym}${value.toFixed(2)}`;
}

function currencySymbol(currency: string): string {
  const map: Record<string, string> = {
    SGD: "S$",
    MYR: "RM",
    USD: "$",
    GBP: "£",
    EUR: "€",
    AUD: "A$",
    HKD: "HK$",
  };
  return map[currency] ?? "$";
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCompactInt(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000) return `${(value / 1000).toFixed(1)}K`;
  if (abs >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return formatInteger(value);
}

// Re-export for the math module so callers don't need a separate import
export function presetValues(p: Exclude<CalculatorInputs["preset"], "custom">): PresetValues {
  return PRESETS[p];
}

export function presetToFunnelEcon(values: PresetValues): {
  funnel: FunnelRates;
  economics: UnitEconomics;
} {
  return {
    funnel: {
      cpc: values.cpc,
      lpConversionRate: values.lpConversionRate,
      qualifiedLeadRate: values.qualifiedLeadRate,
      showRate: values.showRate,
      closeRate: values.closeRate,
    },
    economics: {
      revenuePerSale: values.revenuePerSale,
      grossMargin: values.grossMargin,
      clv: values.clv,
    },
  };
}
