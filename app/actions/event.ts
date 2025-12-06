// src/app/actions/event.ts

import { createAxiosJWT } from "@/lib/axiosJwt";

// Type event sesuai data dari backend kamu
export interface EventItem {
  id: string;
  title: string;
  description?: string;
  datetime: string;
  location: string;
  capacity: number;
  price: number;
  status: string;
  owner_id: string; // Penting untuk otorisasi
  image?: string; // Jika backend support
}

// Payload untuk create/update event
export interface EventPayload {
  title: string;
  organizer: string;
  date?: string; // ini legacy frontend, backend pakainya datetime
  datetime?: string; // tambahkan ini agar sesuai backend
  location: string;
  image?: string;
  description?: string;
  capacity?: number;
  price?: number;
  status?: string;
}

export interface EventRow {
  id: string;
  title: string;
  date: string;
  price: number;
  participants: string;
  status: string;
}

// =======================
// GET: semua event
// =======================
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

// =======================
// GET: detail event by id
// =======================
export async function getEventById(id: string): Promise<EventItem> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.get(`/api/events/${id}`);
    return response.data.data as EventItem;
  } catch (error) {
    console.error("getEventById error:", error);
    throw error;
  }
}

// =======================
// POST: create event
// =======================
export async function createEvent(payload: EventPayload): Promise<EventItem> {
  try {
    const axiosJWT = await createAxiosJWT();

    // POST /api/events
    const response = await axiosJWT.post("/api/events", payload);

    // Asumsi: { message: "...", data: { ...eventBaru } }
    const { data } = response.data;

    return data as EventItem;
  } catch (error) {
    console.error("createEvent error:", error);
    throw error;
  }
}

// =======================
// PUT/PATCH: update event
// =======================
export async function updateEvent(
  id: string,
  payload: Partial<EventPayload>
): Promise<EventItem> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.put(`/api/events/${id}`, payload);
    return response.data.data as EventItem;
  } catch (error) {
    console.error("updateEvent error:", error);
    throw error;
  }
}

// =======================
// DELETE: hapus event
// =======================
export async function deleteEvent(id: string): Promise<void> {
  try {
    const axiosJWT = await createAxiosJWT();

    // DELETE /api/events/:id
    await axiosJWT.delete(`/api/events/${id}`);

    // kalau backend kirim { message }, kamu bisa return message juga kalau mau
  } catch (error) {
    console.error("deleteEvent error:", error);
    throw error;
  }
}

export async function getMyEvents(): Promise<EventRow[]> {
  const axiosJWT = await createAxiosJWT();
  const response = await axiosJWT.get("/api/events/mine");
  return response.data.data as EventRow[];
}
