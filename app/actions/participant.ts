"use server";

import { createAxiosJWT } from "@/lib/axiosJwt";

export interface ParticipantPayload {
  name: string;
  email: string;
  phone: string;
}

export async function createParticipant(payload: ParticipantPayload) {
  try {
    const axiosJWT = createAxiosJWT();
    // Endpoint: POST /api/participants
    const response = await axiosJWT.post("/api/participants", payload);
    return response.data.data; // Mengembalikan object participant (termasuk ID)
  } catch (error: any) {
    console.error("Gagal membuat participant:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Gagal menyimpan data peserta.");
  }
}