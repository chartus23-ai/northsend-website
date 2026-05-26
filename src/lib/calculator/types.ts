export type Platform = "either" | "meta" | "google";
export type Objective = "lead-gen";
export type Currency = "SGD" | "MYR" | "USD" | "GBP" | "EUR" | "AUD" | "HKD";
export type Timeframe = "monthly" | "quarterly";
export type Preset = "conservative" | "realistic" | "aggressive" | "custom";

export type FunnelRates = {
  cpc: number;
  lpConversionRate: number;
  qualifiedLeadRate: number;
  showRate: number;
  closeRate: number;
};

export type UnitEconomics = {
  revenuePerSale: number;
  grossMargin: number;
  clv: number;
};

export type PresetValues = FunnelRates & UnitEconomics;

export type CalculatorInputs = {
  platform: Platform;
  objective: Objective;
  currency: Currency;
  timeframe: Timeframe;
  preset: Preset;
  totalAdSpend: number;
  funnel: FunnelRates;
  economics: UnitEconomics;
  stressTest: boolean;
};

export type CalculatorOutputs = {
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  showedAppts: number;
  sales: number;

  costPerLead: number;
  costPerQualifiedLead: number;
  costPerShowed: number;
  costPerSale: number;

  revenue: number;
  grossProfit: number;
  profitPerSale: number;
  netProfit: number;
  roas: number;
  roiPercent: number;

  breakevenCpc: number;
  breakevenSales: number;
  maxCpa: number;
  breakevenRoas: number;

  isProfitable: boolean;
};

export type ScenarioCpl = {
  label: "Worst" | "Mid" | "Best";
  preset: "conservative" | "realistic" | "aggressive";
  costPerLead: number;
  leads: number;
};
