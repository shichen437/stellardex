/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function listApiKey(params: any) {
  return request({
    url: `/user/apiKey/list`,
    method: "get",
    params,
  });
}

export async function addApiKey(data: any) {
  return request({
    url: `/user/apiKey`,
    method: "post",
    data,
  });
}

export async function disableApiKey(id: number) {
  return request({
    url: `/user/apiKey/disable/${id}`,
    method: "put",
  });
}

export async function deleteApiKey(id: number) {
  return request({
    url: `/user/apiKey/${id}`,
    method: "delete",
  });
}
