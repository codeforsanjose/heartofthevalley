import axios, { AxiosRequestConfig } from "axios";

const baseUrl = import.meta.env.SSR ? "http://backend:8080" : "http://localhost:8080";

export const apiClient = axios.create();

export const myAxios = (config: AxiosRequestConfig) => {
  return apiClient({
    baseURL: baseUrl,
    ...config,
  });
};
