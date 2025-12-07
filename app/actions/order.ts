// app/actions/order.ts
import { createAxiosJWT } from "@/lib/axiosJwt";

// Tipe data dari API Backend (tabel 'order' join 'participant')
export interface OrderItem {
  id: string;
  created_at: string;
  status: string;
  amount: number;
  // Karena expand=true, kita dapat object participant
  participant?: {
    name: string;
    email: string;
    phone: string;
  };
  event?: {
    title: string;
    price: number;
  };
}

export async function getOrdersByEvent(eventId: string): Promise<OrderItem[]> {
  try {
    const axiosJWT = createAxiosJWT();
    // Endpoint ini sudah ada di backend: GET /api/orders
    // Kita filter by event_id dan expand participant
    const response = await axiosJWT.get("/api/orders", {
      params: {
        event_id: eventId,
        expand: true,
        sort_by: "created_at",
        sort_dir: "desc",
      },
    });
    return response.data.data as OrderItem[];
  } catch (error) {
    console.error("getOrdersByEvent error:", error);
    return [];
  }
}