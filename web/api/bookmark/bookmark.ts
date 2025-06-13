/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function saveBookmark(data: any) {
  return request({
    url: `/bookmark`,
    method: "post",
    data,
  });
}

export async function deleteBookmark(id: number) {
  return request({
    url: `/bookmark/${id}`,
    method: "delete",
  });
}

export async function getBookmark(id: number) {
  return request({
    url: `/bookmark/${id}`,
    method: "get",
  });
}

interface ListBookmarkParams {
  pageNum: number;
  pageSize: number;
  status?: number;
  sort?: string;
  keyword?: string;
  author?: string;
  site?: string;
  label?: string;
  isArchive?: number;
  isStarred?: number;
}

export async function listBookmark(params: ListBookmarkParams) {
  if (params.status === undefined) {
    delete params.status;
  }
  if (params.isArchive === undefined) {
    delete params.isArchive;
  }
  if (params.isStarred === undefined) {
    delete params.isStarred;
  }
  return request({
    url: `/bookmark/list`,
    method: "get",
    params,
  });
}

export async function getBookmarkNum() {
  return request({
    url: `/bookmark/num`,
    method: "get",
  });
}

export async function updateBmTitle(data: any) {
  return request({
    url: `/bookmark/title`,
    method: "put",
    data,
  });
}

export async function updateStatus(data: any) {
  return request({
    url: `/bookmark/status`,
    method: "put",
    data,
  });
}