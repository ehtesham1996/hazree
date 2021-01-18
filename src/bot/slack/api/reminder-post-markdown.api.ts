/**
 * Note for Reminders to work you have to allocate
 * permission
 * "reminders:write"
 * "reminders:read"
 */

import { AxiosResponse } from 'axios';
import { axiosAccessInstance } from '../functions';

require('dotenv').config();

export async function reminderInfo(
  text: string,
  time: any,
  userId: string
): Promise<AxiosResponse> {
  return axiosAccessInstance.request({
    method: 'post',
    url: '/reminders.add',
    data: { text, time, user: userId }
  });
}

export async function allReminders(): Promise<AxiosResponse> {
  return axiosAccessInstance.request({
    method: 'GET',
    url: 'reminders.list'
  });
}

export async function reminderRemove(id: string): Promise<AxiosResponse> {
  return axiosAccessInstance.request({
    method: 'post',
    url: '/reminders.delete',
    data: { reminder: id }
  });
}
