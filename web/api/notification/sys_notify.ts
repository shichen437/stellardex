/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function getNotifyList(params: any) {
  if (params.status === undefined) {
    delete params.status;
  }
  return request({
    url: `/notification/list`,
    method: "get",
    params,
  });
}

export async function getUnread() {
  return request({
    url: `/notification/unread`,
    method: "get",
  });
}

export async function readAll() {
  return request({
    url: `/notification/read`,
    method: "put",
  });
}

export async function deleteNotify(id: number) {
  return request({
    url: `/notification/${id}`,
    method: "delete",
  });
}

export async function deleteAll() {
  return request({
    url: `/notification/all`,
    method: "delete",
  });
}
