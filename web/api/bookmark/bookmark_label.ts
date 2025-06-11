/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function getBmLabels(id: number) {
  return request({
    url: `/bookmark/labels/` + id,
    method: "get",
  });
}

export async function saveBmLabel(data: any) {
  return request({
    url: `/bookmark/label`,
    method: "post",
    data,
  });
}

export async function deleteBmLabel(id: number, labelId: number) {
  const data = {
    id: id,
    labelId: labelId,
  };
  return request({
    url: `/bookmark/label/` + id,
    method: "delete",
    data,
  });
}

export async function getUserBmLabels() {
  return request({
    url: `/bookmark/user/labels`,
    method: "get",
  });
}

export async function saveUserBmLabel(data: any) {
  return request({
    url: `/bookmark/user/label`,
    method: "post",
    data,
  });
}

export async function updateUserBmLabel(data: any) {
  return request({
    url: `/bookmark/user/label`,
    method: "put",
    data,
  });
}

export async function deleteUserBmLabel(id: number) {
  return request({
    url: `/bookmark/user/label/` + id,
    method: "delete",
  });
}