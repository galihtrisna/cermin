// src/app/actions/auth.ts
import axios from "axios";
import { createAxiosJWT } from "@/lib/axiosJwt";
import { setAccessToken, clearAccessToken } from "@/lib/token";
import type { LoginData, Users } from "@/lib/definitions";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

// ========= LOGIN / LOGOUT =========

export interface LoginResponse {
  user: Users;
  accessToken: string;
  expire: number;
}

// login → simpen token di localStorage
export async function signIn(loginData: LoginData): Promise<Users> {
  const response = await axios.post(`${API_SERVER}api/login`, loginData, {
    withCredentials: true,
  });

  const { user, accessToken, expire } = response.data.data as LoginResponse;

  // Simpan token buat axiosJWT
  setAccessToken(accessToken, expire);

  return user;
}

// logout
export async function signOut() {
  const axiosJWT = createAxiosJWT();
  await axiosJWT.delete("/api/logout");
  clearAccessToken();
}

// ========= REGISTER =========

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await axios.post(`${API_SERVER}api/register`, payload);
  return response.data;
}

// ========= USER MANAGEMENT (ADMIN AREA) =========

export async function getAllUsers(query: string) {
  const axiosJWT = createAxiosJWT();

  const response = await axiosJWT.get("/api/users", {
    params: {
      name: query,
      email: query,
    },
  });

  // { message, data: Users[] }
  return response.data.data as Users[];
}

export async function updateUserById(id: string, payload: Partial<Users>) {
  const axiosJWT = createAxiosJWT();
  const response = await axiosJWT.patch(`/api/users/${id}`, payload);
  return response.data.data as Users;
}

export async function deleteUserById(id: string) {
  const axiosJWT = createAxiosJWT();
  const response = await axiosJWT.delete(`/api/users/${id}`);
  return response.data;
}

// dipakai di frontend: checkUser()
// actions/auth.ts
export async function checkUser(): Promise<Users | null> {
  const axiosJWT = createAxiosJWT();

  try {
    const response = await axiosJWT.get("/api/users/admin");
    return response.data.data as Users;
  } catch (error: any) {
    // kalau belum login / token invalid → balikin null
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return null;
    }
    // error lain tetap dilempar
    throw error;
  }
}

export async function setMyRole(role: "staff" | "admin"): Promise<Users> {
  const axiosJWT = createAxiosJWT();
  const response = await axiosJWT.patch("/api/me/role", { role });

  const { user, accessToken, expire } = response.data.data as {
    user: Users;
    accessToken: string;
    expire: number;
  };

  // token baru dengan role baru
  setAccessToken(accessToken, expire);

  return user;
}
