import { JokeResponse } from '@src/core';
import Axios, { AxiosResponse } from 'axios';

export async function getRandomJoke(): Promise<JokeResponse> {
  const jokeApi = ['https://official-joke-api.appspot.com/jokes/programming/random',
    'https://official-joke-api.appspot.com/jokes/ten'];

  const url = jokeApi[Math.round(Math.random())];

  const response = await Axios.get<any, AxiosResponse<JokeResponse[]>>(url);
  return response.data[0];
}
