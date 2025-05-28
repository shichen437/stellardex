/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function allGroupItems(id: number) {
  return request({
    url: "/group/item/list?groupId=" + id,
    method: "get",
  });
}

export async function getGroupItem(id: number) {
  return request({
    url: `/group/item/` + id,
    method: "get",
  });
}

export async function addGroupItem(data: any) {
  return request({
    url: `/group/item`,
    method: "post",
    data,
  });
}

export async function updateGroupItem(data: any) {
  return request({
    url: `/group/item`,
    method: "put",
    data,
  });
}

export async function deleteGroupItem(id: number) {
  return request({
    url: `/group/item/` + id,
    method: "delete",
  });
}

export async function postIcon(data: FormData) {
  return request({
    url: "/group/item/icon",
    method: "post",
    data: data,
  });
}

export async function search(params: any) {
  return request({
    url: "/group/item/search",
    method: "get",
    params: params,
  });
}
