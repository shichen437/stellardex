/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/api";

export async function login(username: string, password: string) {
  const data = {
    username,
    password,
  };
  return request({
    url: "/login",
    method: "post",
    headers: {
      isToken: false,
    },
    data: data,
  });
}

export async function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

export async function getInfo() {
  return request({
    url: "/user/getInfo",
    method: "get",
  });
}

export async function listUser(params: any) {
  return request({
    url: "/user/list",
    method: "get",
    params: params,
  });
}

export async function getUser(id: number) {
  return request({
    url: "/user/" + id,
    method: "get",
  });
}

export async function postUser(data: any) {
  return request({
    url: "/user",
    method: "post",
    data: data,
  });
}

export async function putUser(data: any) {
  return request({
    url: "/user",
    method: "put",
    data: data,
  });
}

export async function delUser(id: number) {
  return request({
    url: "/user/" + id,
    method: "delete",
  });
}

export async function resetPwd(data: any) {
  return request({
    url: "/user/resetPwd",
    method: "put",
    data: data,
  });
}
