import { BadgeDollarSign, ChartNoAxesGantt, Coins } from "lucide-react";
import { type NavItem } from "@/lib/types/subscription";

export const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    label: t("subscription.nav.overview"),
    labelKey: "subscription.nav.overview",
    icon: ChartNoAxesGantt,
    active: true,
    needAdmin: false,
    group: "overview",
  },
  {
    label: t("subscription.nav.subscription"),
    labelKey: "subscription.nav.subscription",
    icon: BadgeDollarSign,
    active: false,
    needAdmin: false,
    group: "sub",
  },
  {
    label: t("subscription.nav.currency"),
    labelKey: "subscription.nav.currency",
    icon: Coins,
    active: false,
    needAdmin: true,
    group: "currency",
  },
];
