import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const axiosInstance = axios.create({
  baseURL: 'https://slack.com/api',
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.SLACK_AUTH_TOKEN}`
  }
});
export const axiosAccessInstance = axios.create({
  baseURL: 'https://slack.com/api',
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`
  }
});
