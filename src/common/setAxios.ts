import axios, { AxiosInstance } from 'axios';

export const weatherApi: AxiosInstance = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  headers: {
    'Content-Type': 'application/json',
  },
});
