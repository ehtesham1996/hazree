import { AxiosResponse } from 'axios';
import { axiosInstance } from '../functions';

export async function channelMembers(channelId: string): Promise<AxiosResponse> {
  return axiosInstance.request({
    method: 'get',
    url: `/conversations.members?channel=${channelId}`
  });
}
