import type { Currency, Preset, PresetValues } from "./types";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  SGD: "S$",
  MYR: "RM",
  USD: "$",
  GBP: "£",
  EUR: "€",
  AUD: "A$",
  HKD: "HK$",
};

/**
 * Preset values for clinic Lead Gen campaigns.
 * Charlie's numbers — apply across all platforms (Either / Meta / Google).
 * Realistic mid-points are interpolations from Conservative/Aggressive
 * (Close 20%, Revenue $2,000, Margin 60%); confirm against the reference
 * calculator when Charlie clicks "Realistic" on the example.
 */
export const PRESETS: Record<Exclude<Preset, "custom">, PresetValues> = {
  conservative: {
    cpc: 3.0,
    lpConversionRate: 0.04,
    qualifiedLeadRate: 0.25,
    showRate: 0.5,
    closeRate: 0.17,
    revenuePerSale: 1900,
    grossMargin: 0.57,
    clv: 0,
  },
  realistic: {
    cpc: 2.5,
    lpConversionRate: 0.05,
    qualifiedLeadRate: 0.25,
    showRate: 0.5,
    closeRate: 0.2,
    revenuePerSale: 2000,
    grossMargin: 0.6,
    clv: 0,
  },
  aggressive: {
    cpc: 2.25,
    lpConversionRate: 0.06,
    qualifiedLeadRate: 0.25,
    showRate: 0.5,
    closeRate: 0.22,
    revenuePerSale: 2100,
    grossMargin: 0.612,
    clv: 0,
  },
};

export const PRESET_DESCRIPTIONS: Record<
  Exclude<Preset, "custom">,
  string
> = {
  conservative: "Higher CPC (traffic cost) and lower conversion assumptions",
  realistic: "Typical campaign assumptions",
  aggressive: "Stronger performance assumptions",
};

export const DEFAULT_TOTAL_AD_SPEND = 5000;

/**
 * Stress-test multipliers — applied to the active preset to show
 * "what happens if performance is worse than expected".
 * Pulls CPC up, all funnel rates down.
 */
export const STRESS_TEST_MULTIPLIERS = {
  cpc: 1.25,
  funnel: 0.75,
  revenue: 0.9,
};

export function applyStressTest(values: PresetValues): PresetValues {
  const m = STRESS_TEST_MULTIPLIERS;
  return {
    cpc: values.cpc * m.cpc,
    lpConversionRate: values.lpConversionRate * m.funnel,
    qualifiedLeadRate: values.qualifiedLeadRate * m.funnel,
    showRate: values.showRate * m.funnel,
    closeRate: values.closeRate * m.funnel,
    revenuePerSale: values.revenuePerSale * m.revenue,
    grossMargin: values.grossMargin,
    clv: values.clv * m.revenue,
  };
}
