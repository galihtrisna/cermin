// lib/axiosJwt.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { getAccessToken, getAccessTokenExp, clearAccessToken } from "./token";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

if (!API_SERVER) {
  console.warn("NEXT_PUBLIC_API_SERVER belum diset");
}

export function createAxiosJWT(): AxiosInstance {
  const axiosJWT = axios.create({
    baseURL: API_SERVER,
    withCredentials: true,
  });

  axiosJWT.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      const exp = getAccessTokenExp();
      const now = Date.now();

      if (token && exp && now < exp) {
        if (!config.headers) {
          config.headers = {} as AxiosRequestHeaders;
        }
        (
          config.headers as AxiosRequestHeaders
        ).Authorization = `Bearer ${token}`;
      } else if (token && exp && now >= exp) {
        clearAccessToken();
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosJWT.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearAccessToken();
      }
      return Promise.reject(error);
    }
  );

  return axiosJWT;
}
