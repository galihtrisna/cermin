// app/actions/certificate.ts
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
