/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '@/lib/api';

export async function groupList() {
  return request({
    url: '/group/list',
    method: 'get',
  });
}

export async function getGroup(id: number) {
  return request({
    url: `/group/` + id,
    method: 'get',
  });
}

export async function addGroup(data: any) {
  return request({
    url: `/group`,
    method: 'post',
    data,
  });
}

export async function updateGroup(data: any) {
  return request({
    url: `/group`,
    method: 'put',
    data,
  });
}

export async function deleteGroup(id: number) {
  return request({
    url: `/group/` + id,
    method: 'delete',
  });
}

export async function sortGroup(data: any) {
  return request({
    url: `/group/sort`,
    method: 'put',
    data,
  });
}

export async function visiableGroup(data: any) {
  return request({
    url: `/group/isShow`,
    method: 'put',
    data,
  });
}