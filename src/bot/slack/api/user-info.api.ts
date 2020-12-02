import { AxiosResponse } from 'axios';
import { axiosInstance } from '../functions';

export async function userInfo(user: string): Promise<AxiosResponse> {
  return axiosInstance.request({
    method: 'get',
    url: `/users.info?user=${user}`
  });
}
