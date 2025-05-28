export interface GroupItem {
  id: number;
  groupId: number;
  title: string;
  description?: string;
  url: string;
  lanUrl?: string;
  iconType: "text" | "image" | "lucide" | "local";
  iconUrl: string;
  bgColor?: string;
  opacity?: number;
  orderNum: number;
}

export interface Group {
  id: number;
  groupName: string;
  isShow: boolean;
  displayType: "details" | "icons" | "titles";
  items: GroupItem[];
}

export interface SearchGroupItem {
  groupId: number;
  title: string;
  description: string;
  url: string;
  lanUrl: string;
  groupName: string;
}