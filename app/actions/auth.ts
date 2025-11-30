// app/actions/auth.ts
// ❌ JANGAN pakai "use server" di sini
// File ini bakal dipakai dari komponen client (useEffect, event handler)

import axios from "axios";
import { createAxiosJWT } from "@/lib/axiosJwt";
import { setAccessToken, clearAccessToken } from "@/lib/token";
import type { LoginData, Users } from "@/lib/definitions";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

// LOGIN
export async function signIn(loginData: LoginData): Promise<Users> {
  const response = await axios.post(`${API_SERVER}api/login`, loginData, {
    withCredentials: true,
  });

  const { user, accessToken, expire } = response.data.data as {
    user: Users;
    accessToken: string;
    expire: number;
  };

  setAccessToken(accessToken, expire);
  return user;
}

// REGISTER
export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await axios.post(`${API_SERVER}api/register`, payload);
  return response.data;
}

// LOGOUT
export async function signOut() {
  const axiosJWT = createAxiosJWT();
  await axiosJWT.delete("/api/logout");
  clearAccessToken();
}

// CURRENT USER
export async function checkUser(): Promise<Users> {
  const axiosJWT = createAxiosJWT();
  const response = await axiosJWT.get("/api/users/admin");
  return response.data.data as Users;
}

// SET MY ROLE
export async function setMyRole(role: "staff" | "admin"): Promise<Users> {
  const axiosJWT = createAxiosJWT();
  const response = await axiosJWT.patch("/api/me/role", { role });

  const { user, accessToken, expire } = response.data.data as {
    user: Users;
    accessToken: string;
    expire: number;
  };

  setAccessToken(accessToken, expire);
  return user;
}
