/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Subscription {
  id: number;
  title: string;
  amount: number;
  cycleNum: number;
  cycleType: number;
  cycleDay: number;
  startDate: string;
  nextDate: string;
  currency: number;
  category: string;
  site: string;
  status: number;
  currencySymbol?: string;
  createAt: string;
}

export interface NavItem {
  label: string;
  labelKey: string;
  icon: any;
  active: boolean;
  needAdmin: boolean;
  group: "overview" | "sub" | "currency";
}

export interface SubOverview {
  total: number;
  active: number;
  yearAmount: number;
  monthAmount: number;
}

export interface SubCurrency {
  id: number;
  code: string;
  symbol: string;
  isDefault: boolean;
  rate: number;
  sort: number;
}

export interface SubOverview {
  total: number;
  active: number;
  perYearAmount: number;
  perMonthAmount: number;
}

export interface SubTimeline {
  title: string;
  nextDate: string;
}