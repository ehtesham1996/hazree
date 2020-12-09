import { AxiosResponse } from 'axios';
import { axiosInstance } from '../functions';

export async function allUsersInfo(): Promise<AxiosResponse> {
  return axiosInstance.request({
    method: 'get',
    url: '/users.list'
  });
}
