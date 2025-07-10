/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function getSubList(params: any) {
  return request({
    url: `/subscription/list`,
    method: "get",
    params,
  });
}

export async function addSub(data: any) {
  return request({
    url: `/subscription`,
    method: "post",
    data,
  });
}

export async function updateSub(data: any) {
  return request({
    url: `/subscription`,
    method: "put",
    data,
  });
}

export async function deleteSub(id: number) {
  return request({
    url: `/subscription/`+ id,
    method: "delete",
  });
}

export async function subTimeline() {
  return request({
    url: `/subscription/timeline/`,
    method: "get",
  });
}

export async function subOverview() {
  return request({
    url: `/subscription/overview`,
    method: "get",
  });
}

export async function enableSub(id: number) {
  return request({
    url: `/subscription/enable/`+ id,
    method: "put",
  });
}

export async function disableSub(id: number) {
  return request({
    url: `/subscription/disable/`+ id,
    method: "put",
  });
}