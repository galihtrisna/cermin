// src/app/actions/event.ts

import { createAxiosJWT } from "@/lib/axiosJwt";

// Type event sesuai data dari backend kamu
export interface EventItem {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  participants: number;
  image: string;
}

// Fetch semua event
export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const axiosJWT = await createAxiosJWT();

    // Endpoint REST API kamu → GET /api/events
    const response = await axiosJWT.get("/api/events");

    // Asumsi struktur dari backend:
    // { message: "...", data: [...] }
    const { data } = response.data;

    return data as EventItem[];
  } catch (error) {
    console.error("getAllEvents error:", error);
    throw error;
  }
}
