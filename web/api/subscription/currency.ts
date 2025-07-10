/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";


export async function getCurrencyList(params: any) {
  return request({
    url: `/currency/list`,
    method: "get",
    params,
  });
}

export async function addCurrency(data: any) {
  return request({
    url: `/currency`,
    method: "post",
    data,
  });
}

export async function updateCurrency(data: any) {
  return request({
    url: `/currency`,
    method: "put",
    data,
  });
}

export async function deleteCurrency(id: number) {
  return request({
    url: `/currency/`+ id,
    method: "delete",
  });
}

export async function defaultCurrency(id: number) {
  return request({
    url: `/currency/default/`+ id,
    method: "put",
  });
}

export async function getDefaultCurrency() {
  return request({
    url: `/currency/default`,
    method: "get",
  });
}