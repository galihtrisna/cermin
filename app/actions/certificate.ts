// app/actions/certificate.ts
"use server";

import axios from "axios";

// Fallback ke localhost jika env belum diset
const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";

/**
 * Helper: Buat header Authorization
 */
function getAuthHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Interface tetap sama
export interface EventWithCertBackground {
  id: string;
  title?: string;
  cert_background?: string | null;
  [key: string]: any;
}

export interface IssueCertificatesResponse {
  issued_count: number;
  [key: string]: any;
}

/**
 * Ambil data event (Public/Private)
 */
export async function getEventCertificateSettings(
  eventId: string,
  token?: string
): Promise<EventWithCertBackground | null> {
  try {
    const res = await axios.get(`${API_SERVER}api/events/${eventId}`, {
      headers: getAuthHeader(token),
    });
    return res.data?.data as EventWithCertBackground;
  } catch (error) {
    console.error("getEventCertificateSettings error:", error);
    return null;
  }
}

/**
 * Upload file background (Butuh Token)
 */
export async function uploadCertificateBackground(
  file: File,
  token: string // Wajib ada token
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_SERVER}api/upload/image`, formData, {
      headers: {
        ...getAuthHeader(token),
        // Jangan set 'Content-Type': 'multipart/form-data' manual, biar axios yang atur boundary
      },
    });

    const url = res.data?.url as string | undefined;
    if (!url) throw new Error("URL upload tidak ditemukan.");

    return url;
  } catch (error) {
    console.error("uploadCertificateBackground error:", error);
    return null;
  }
}

/**
 * Update background URL di database (Butuh Token)
 */
export async function updateEventCertificateBackground(
  eventId: string,
  backgroundUrl: string,
  token: string
): Promise<boolean> {
  try {
    await axios.put(
      `${API_SERVER}api/events/${eventId}`,
      { cert_background: backgroundUrl },
      { headers: getAuthHeader(token) }
    );
    return true;
  } catch (error) {
    console.error("updateEventCertificateBackground error:", error);
    return false;
  }
}

/**
 * Issue Certificates (Trigger Email) - Butuh Token
 */
export async function issueCertificates(
  eventId: string,
  token: string
): Promise<IssueCertificatesResponse | null> {
  try {
    const res = await axios.post(
      `${API_SERVER}api/events/${eventId}/certificates/issue`,
      {}, // Body kosong
      { headers: getAuthHeader(token) }
    );
    return res.data as IssueCertificatesResponse;
  } catch (error) {
    console.error("issueCertificates error:", error);
    return null;
  }
}

// ... Bagian getPublicCertificate biarkan seperti sebelumnya (karena public) ...
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

export async function getPublicCertificate(id: string): Promise<CertificateData | null> {
  try {
    const res = await fetch(`${API_SERVER}api/events/certificates/${id}/public`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();

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
    if (!res.ok) throw new Error("Failed");
    const buffer = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get("content-type") || "image/jpeg";
    return `data:${type};base64,${buffer.toString("base64")}`;
  } catch {
    return url;
  }
}