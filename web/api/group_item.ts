/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '@/lib/api';

export async function allGroupItems(id: number) {
    return request({
      url: '/group/item/list?groupId=' + id,
      method: 'get',
    });
  }
  
  export async function getGroupItem(id: number) {
    return request({
      url: `/group/item/` + id,
      method: 'get',
    });
  }
  
  export async function addGroupItem(data: any) {
    return request({
      url: `/group/item`,
      method: 'post',
      data,
    });
  }
  
  export async function updateGroupItem(data: any) {
    return request({
      url: `/group/item`,
      method: 'put',
      data,
    });
  }
  
  export async function deleteGroupItem(id: number) {
    return request({
      url: `/group/item/` + id,
      method: 'delete',
    });
  }