// src/app/actions/event.ts

import { createAxiosJWT } from "@/lib/axiosJwt";

// Type event sesuai data dari backend
export interface EventItem {
  date: string;
  id: string;
  title: string;
  description?: string;
  datetime: string;
  location: string;
  capacity: number;
  price: number;
  status: string;
  owner_id: string;
  image?: string;
}

// Payload untuk create/update event
export interface EventPayload {
  title: string;
  organizer: string;
  date?: string;
  datetime?: string;
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

export interface ParticipantOrder {
  id: string;
  status: string;
  created_at: string;
  participant: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

// =======================
// GET: semua event
// =======================
export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const axiosJWT = await createAxiosJWT();
    const response = await axiosJWT.get("/api/events");
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
    const response = await axiosJWT.post("/api/events", payload);
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
    await axiosJWT.delete(`/api/events/${id}`);
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

export async function getEventOrders(
  eventId: string
): Promise<ParticipantOrder[]> {
  try {
    const axiosJWT = await createAxiosJWT();
    const response = await axiosJWT.get(`/api/orders`, {
      params: {
        event_id: eventId,
        expand: true,
        limit: 1000,
      },
    });
    return response.data.data as ParticipantOrder[];
  } catch (error) {
    console.error("getEventOrders error:", error);
    return [];
  }
}

// =======================
// UPLOAD: Upload Gambar ke Backend
// =======================
export async function uploadEventImage(file: File): Promise<string> {
  try {
    const axiosJWT = await createAxiosJWT();
    const formData = new FormData();
    // Key 'file' harus sesuai dengan yang diminta backend (upload.route.js / multer)
    formData.append("file", file);

    // POST /api/upload/image
    const response = await axiosJWT.post("/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Backend mengembalikan { message, url }
    return response.data.url;
  } catch (error: any) {
    console.error("Upload image error:", error);
    // Ambil pesan error dari backend jika ada
    const msg = error?.response?.data?.message || "Gagal mengunggah gambar.";
    throw new Error(msg);
  }
}

