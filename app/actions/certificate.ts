// app/actions/certificate.ts
"use server";
import { createAxiosJWT } from "@/lib/axiosJwt";

export interface EventWithCertBackground {
  id: string;
  title?: string;
  cert_background?: string | null;
  // biar fleksibel kalau backend nambah field lain
  [key: string]: any;
}

export interface IssueCertificatesResponse {
  issued_count: number;
  // kalau backend ngirim info lain, tetep aman
  [key: string]: any;
}

/**
 * Ambil data event (termasuk cert_background kalau ada).
 */
export async function getEventCertificateSettings(
  eventId: string
): Promise<EventWithCertBackground | null> {
  try {
    const axiosJWT = createAxiosJWT();
    const res = await axiosJWT.get(`/api/events/${eventId}`);

    // [FIX] Tambahkan .data untuk mengambil objek event yang sebenarnya
    // Karena struktur response backend adalah: { message: "Success", data: { ... } }
    return res.data?.data as EventWithCertBackground;
  } catch (error) {
    console.error("getEventCertificateSettings error:", error);
    return null;
  }
}

/**
 * Upload file background sertifikat ke backend.
 * Return: URL publik hasil upload (dari Supabase / storage lain).
 */
export async function uploadCertificateBackground(
  file: File
): Promise<string | null> {
  try {
    const axiosJWT = createAxiosJWT();
    const formData = new FormData();
    formData.append("file", file); // harus sama dengan field di multer backend

    const res = await axiosJWT.post("/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const url = res.data?.url as string | undefined;
    if (!url) {
      throw new Error("URL hasil upload tidak ditemukan di response backend.");
    }

    return url;
  } catch (error) {
    console.error("uploadCertificateBackground error:", error);
    return null;
  }
}

/**
 * Update field cert_background di tabel events.
 */
export async function updateEventCertificateBackground(
  eventId: string,
  backgroundUrl: string
): Promise<boolean> {
  try {
    const axiosJWT = createAxiosJWT();
    await axiosJWT.put(`/api/events/${eventId}`, {
      cert_background: backgroundUrl,
    });
    return true;
  } catch (error) {
    console.error("updateEventCertificateBackground error:", error);
    return false;
  }
}

/**
 * Trigger generate & kirim sertifikat ke peserta yang hadir.
 */
export async function issueCertificates(
  eventId: string
): Promise<IssueCertificatesResponse | null> {
  try {
    const axiosJWT = createAxiosJWT();
    const res = await axiosJWT.post(
      `/api/events/${eventId}/certificates/issue`
    );
    return res.data as IssueCertificatesResponse;
  } catch (error) {
    console.error("issueCertificates error:", error);
    return null;
  }
}

// app/actions/certificate.ts
// ... (import lain biarkan saja)

// Tambahkan definisi tipe jika belum ada di file lain, atau import dari definitions
export interface CertificateData {
  id: string;
  cert_no: string;
  issued_at: string;
  participant: { name: string };
  event: {
    title: string;
    cert_background: string;
    datetime: string;
  };
}

/**
 * Ambil data sertifikat publik (Server Action)
 */
export async function getPublicCertificate(id: string): Promise<CertificateData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_SERVER;
    // Pastikan URL API backend benar
    const res = await fetch(`${baseUrl}api/events/certificates/${id}/public`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Gagal fetch sertifikat: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    // [FIX] Convert background image URL to Base64
    // Ini mem-bypass masalah CORS pada html2canvas
    if (data?.event?.cert_background) {
      data.event.cert_background = await imageToBase64(data.event.cert_background);
    }

    return data as CertificateData;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return null;
  }
}

async function imageToBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return url; // Jika gagal, kembalikan URL asli sebagai fallback
  }
}

