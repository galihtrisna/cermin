// src/lib/axiosJwt.ts
import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, getAccessTokenExp, clearAccessToken } from "./token";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

if (!API_SERVER) {
  console.warn("NEXT_PUBLIC_API_SERVER belum diset");
}

export function createAxiosJWT(): AxiosInstance {
  const axiosJWT = axios.create({
    baseURL: API_SERVER,
    withCredentials: true, // biar cookie juga ikut kalau nanti kepakai
  });

  axiosJWT.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const now = Date.now();
      const token = getAccessToken();
      const exp = getAccessTokenExp();

      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // Token masih valid → pakai
      if (token && exp && now < exp) {
        (
          config.headers as AxiosRequestHeaders
        ).Authorization = `Bearer ${token}`;
      } else {
        // token ga ada / expired → buang dari localStorage
        clearAccessToken();
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosJWT.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        clearAccessToken();
      }
      return Promise.reject(error);
    }
  );

  return axiosJWT;
}
