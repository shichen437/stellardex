/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '@/lib/api';

export async function updateProfile(data: any) {
    return request({
        url: '/user/profile',
        method: 'put',
        data: data,
    });
}

export async function updatePwd(oldPwd: string, newPwd: string) {
    const data = {
        oldPwd,
        newPwd,
    };
    return request({
        url: '/user/password',
        method: 'put',
        data: data,
    });
}