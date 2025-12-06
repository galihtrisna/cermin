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

// Payload untuk create/update event
export interface EventPayload {
  title: string;
  organizer: string;
  date: string; // simpan sebagai string (ISO / "YYYY-MM-DD" / "YYYY-MM-DD HH:mm")
  location: string;
  image?: string; // optional, bisa diisi URL
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
    const axiosJWT = await createAxiosJWT();

    // GET /api/events/:id
    const response = await axiosJWT.get(`/api/events/${id}`);

    // Asumsi: { message: "...", data: { ...event } }
    const { data } = response.data;

    return data as EventItem;
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
    const axiosJWT = await createAxiosJWT();

    // Kalau di backend pakai PUT:
    // const response = await axiosJWT.put(`/api/events/${id}`, payload);
    // Kalau pakai PATCH:
    const response = await axiosJWT.patch(`/api/events/${id}`, payload);

    // Asumsi: { message: "...", data: { ...eventUpdated } }
    const { data } = response.data;

    return data as EventItem;
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
