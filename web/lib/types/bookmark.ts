/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Bookmark {
  id: number;
  title: string;
  excerpt: string;
  siteName: string;
  readingTime: number;
  coverImageUrl: string;
  status: number;
  isArchive: number;
  isStarred: number;
  author: string;
  sourceUrl: string;
}

export interface Selector {
  id: number;
  domain: string;
  title: string;
  content: string;
  byline: string;
  excerpt: string;
  publishedTime: string;
  cookie: string;
}

export interface NavItem {
  label: string;
  labelKey: string;
  icon: any;
  count: number;
  active: boolean;
  status?: number;
  isArchive?: number;
  isStarred?: number;
  group: "status" | "archive" | "starred" | "tags" | "selector";
  selector?: boolean;
}

export interface UserBmLabel {
  id: number;
  name: string;
  bmNum: number;
}