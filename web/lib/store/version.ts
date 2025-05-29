import Cookies from "js-cookie";
import { LATEST_VERSION } from "./consts";

export function getVersion() {
  const version = Cookies.get(LATEST_VERSION);
  if (!version) {
    return "";
  }
  return version.startsWith('v') ? version.substring(1) : version;
}

export function setVersion(token: string) {
  return Cookies.set(LATEST_VERSION, token, { path: "/" });
}

export function removeVersion() {
  return Cookies.remove(LATEST_VERSION, { path: "/" });
}
