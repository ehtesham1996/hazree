import { axiosInstance } from '../functions';

export async function chatPostMessage(channel: string, blocks: Array<any>): Promise<void> {
  return axiosInstance.request({
    method: 'post',
    url: '/chat.postMessage',
    data: { channel, blocks }
  });
}
