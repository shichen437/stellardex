/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Notification {
  id: number;
  title: string;
  content: string;
  type: number;
  status: number;
  createAt: string;
}

export interface NavItem {
  label: string;
  labelKey: string;
  icon: any;
  active: boolean;
  status?: number;
  group: "status" | "channel";
}