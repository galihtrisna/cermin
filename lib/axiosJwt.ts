import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, clearAccessToken } from "./token"; // Hapus getAccessTokenExp

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export function createAxiosJWT(): AxiosInstance {
  const axiosJWT = axios.create({
    baseURL: API_SERVER,
    withCredentials: true,
  });

  axiosJWT.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // PERBAIKAN: Ambil token saja
      const token = getAccessToken();

      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // Selalu kirim header jika token ada
      // Biarkan Backend yang menentukan token itu expired atau tidak (via respons 401)
      if (token) {
        (
          config.headers as AxiosRequestHeaders
        ).Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosJWT.interceptors.response.use(
    (res) => res,
    (error) => {
      // Jika Backend bilang 401 (Token Salah/Expired), baru kita logout di frontend
      if (error.response?.status === 401) {
        clearAccessToken();
        if (typeof window !== "undefined") {
          window.location.href = "/auth?login";
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosJWT;
}
