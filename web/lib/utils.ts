import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getContrastColor(hexColor: string, opacity = 1): string {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128
    ? `rgba(0, 0, 0, ${opacity})`
    : `rgba(255, 255, 255, ${opacity})`;
}

export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "localhost" ||
      urlObj.hostname.startsWith("127.") ||
      urlObj.hostname.startsWith("192.168.") ||
      urlObj.hostname.startsWith("10.") ||
      urlObj.hostname.endsWith(".local")
    ) {
      return `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    } else {
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        url
      )}&sz=128`;
    }
  } catch {
    return "";
  }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];
  const KILO = 1024;
  if (bytes < 0) {
    return `-${formatBytes(Math.abs(bytes), decimals)}`;
  }
  if (bytes === 0) {
    return "0 B";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(KILO));
  const convertedValue = bytes / Math.pow(KILO, i);

  // 确保小数位数非负
  const fixedDecimals = Math.max(0, decimals);

  return `${convertedValue.toFixed(fixedDecimals)} ${UNITS[i]}`;
}
