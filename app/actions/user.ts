import { LoginData, Users } from "@/lib/definitions";
import axios from "axios";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export async function getAllUsers(query: string) {
  try {
    const response = await fetch(
      `${API_SERVER}api/users?name=${query}&email=${query}`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function addUser(user: Users) {
  try {
    const response = await axios.post(`${API_SERVER}api/register`, user);
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteUserById(userId: string) {
  try {
    const response = await axios.delete(`${API_SERVER}api/users/${userId}`);
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateUserById(userId: string, user: Users) {
  try {
    const response = await axios.patch(
      `${API_SERVER}api/users/${userId}`,
      user
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signIn(loginData: LoginData) {
  try {
    const response = await axios.post(`${API_SERVER}api/login`, loginData, {
      withCredentials: true,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function signOut() {
  try {
    const response = await axios.delete(`${API_SERVER}api/logout`, {
      withCredentials: true,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkUser() {
  try {
    const response = await axios.get(`${API_SERVER}api/users/admin`, {
      withCredentials: true,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function refreshToken(token: string | undefined) {
  try {
    const response = await axios.get(`${API_SERVER}api/users/admin`, {
      withCredentials: true,
      headers: { refreshToken: token },
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function resetPassword({ email }: { email: string }) {
  try {
    const response = await axios.post(`${API_SERVER}api/forget-password`, {
      email,
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const response = await axios.get(`${API_SERVER}api/verify-token/${token}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changePassword({
  password,
  token,
}: {
  password: string;
  token: string;
}) {
  try {
    const response = await axios.post(
      `${API_SERVER}api/reset-password/${token}`,
      { password }
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}