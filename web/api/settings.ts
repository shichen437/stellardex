import { request } from '@/lib/api';
import { SettingsState } from '@/lib/types/settings';

export async function updateSettings(data: SettingsState) {
    return request({
        url: '/settings',
        method: 'put',
        data: data,
    });
}

export async function getSettings() {
    return request({
        url: '/settings',
        method: 'get',
    });
}