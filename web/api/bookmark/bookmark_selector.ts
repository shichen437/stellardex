/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

interface ListBmSelectorsParams {
  pageNum?: number;
  pageSize?: number;
  domain?: string;
}

export async function listBmSelectors(params: ListBmSelectorsParams) {
  return request({
    url: `/bookmark/selector/list`,
    method: "get",
    params,
  });
}

export async function saveBmSelector(data: any) {
  return request({
    url: `/bookmark/selector`,
    method: "post",
    data,
  });
}

export async function deleteBmSelector(id: number) {
  return request({
    url: `/bookmark/selector/` + id,
    method: "delete",
  });
}

export async function getBmSelector(id: number) {
  return request({
    url: `/bookmark/selector/` + id,
    method: "get",
  });
}

export async function updateBmSelector(data: any) {
  return request({
    url: `/bookmark/selector`,
    method: "put",
    data,
  });
}