import { request } from "@/lib/api";
import { SettingsState } from "@/lib/types/settings";

export async function updateSettings(data: SettingsState) {
  return request({
    url: "/settings",
    method: "put",
    data: data,
  });
}

export async function getSettings() {
  return request({
    url: "/settings",
    method: "get",
  });
}

export async function getDefaultLang() {
  return request({
    url: `/settings/lang`,
    method: "get",
    headers: {
      isToken: false,
    },
  });
}

export async function postBgImg(data: FormData) {
  return request({
    url: "/settings/bgImage",
    method: "post",
    data: data,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBgImgList(params: any) {
  return request({
    url: `/settings/bgImage/list`,
    method: "get",
    params: params,
  });
}

export async function deleteBgImg(id: number) {
  return request({
    url: `/settings/bgImage/${id}`,
    method: "delete",
  });
}
