// src/app/actions/organizer.ts
import { createAxiosJWT } from "@/lib/axiosJwt";

export interface OrganizerApplicationPayload {
  organizer_name: string;
  description: string;
  website?: string;
  contact_phone?: string;
}

export async function applyOrganizer(payload: OrganizerApplicationPayload) {
  const axiosJWT = createAxiosJWT();
  const response = await axiosJWT.post("/api/organizers/apply", payload);
  return response.data;
}
