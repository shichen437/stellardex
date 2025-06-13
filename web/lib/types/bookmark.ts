/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Bookmark {
  id: number;
  title: string;
  excerpt: string;
  siteName: string;
  readingTime: number;
  coverImageUrl: string;
  status: number;
  author: string;
  isArchive: number;
  isStarred: number;
  sourceUrl: string;
  contentHtml: string;
  contentText: string;
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

export interface Bookmark {
  id: number;
  title: string;
  excerpt: string;
  siteName: string;
  readingTime: number;
  coverImageUrl: string;
  status: number;
  author: string;
  sourceUrl: string;
  contentHtml: string;
  contentText: string;
  isArchive: number;
  isStarred: number;
}

export interface Label {
  id: number;
  name: string;
  labelId?: number;
}

export interface UserLabel {
  id: number;
  name: string;
}