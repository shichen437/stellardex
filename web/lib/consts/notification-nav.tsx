import { Bell, BellDot, BellRing } from "lucide-react";
import { type NavItem } from "@/lib/types/notification";

export const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    label: t("notification.nav.all"),
    labelKey: "notification.nav.all",
    icon: BellRing,
    active: true,
    status: undefined,
    group: "status",
  },
  {
    label: t("notification.nav.unread"),
    labelKey: "notification.nav.unread",
    icon: BellDot,
    active: false,
    status: 0,
    group: "status",
  },
  {
    label: t("notification.nav.read"),
    labelKey: "notification.nav.read",
    icon: Bell,
    active: false,
    status: 1,
    group: "status",
  },
];
