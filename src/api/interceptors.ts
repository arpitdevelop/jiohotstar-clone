import { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = process.env.EXPO_PUBLIC_TMDB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.accept = 'application/json';
  return config;
};

export const errorInterceptor = (error: any) => {
  console.error('API Error:', error?.response?.data || error?.message);
  return Promise.reject(error);
};
