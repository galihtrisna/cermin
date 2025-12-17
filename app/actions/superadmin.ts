// app/actions/superadmin.ts
import { Users } from "@/lib/definitions";
import { createAxiosJWT } from "@/lib/axiosJwt";

// ===============================
// USERS
// ===============================

export async function getAdminUsers(
  query: string = "",
  role: string = ""
): Promise<Users[]> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.get(
      `/api/superadmin/users?q=${query}&role=${role}`
    );
    return response.data.data as Users[];
  } catch (error) {
    console.error("getAdminUsers error:", error);
    return [];
  }
}

export async function updateUserStatus(
  userId: string,
  data: Partial<Users>
): Promise<Users> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.patch(
      `/api/superadmin/users/${userId}`,
      data
    );
    return response.data.data as Users;
  } catch (error) {
    console.error("updateUserStatus error:", error);
    throw error;
  }
}

export async function deleteUserForce(
  userId: string
): Promise<{ message: string }> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.delete(
      `/api/superadmin/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteUserForce error:", error);
    throw error;
  }
}

// ===============================
// ORGANIZERS
// ===============================

export async function getOrganizers(
  status: string = ""
): Promise<any[]> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.get(
      `/api/superadmin/organizers?status=${status}`
    );
    return response.data.data;
  } catch (error) {
    console.error("getOrganizers error:", error);
    return [];
  }
}

export async function updateOrganizerStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<{ message: string }> {
  try {
    const axiosJWT = createAxiosJWT();
    const response = await axiosJWT.patch(
      `/api/superadmin/organizers/${id}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("updateOrganizerStatus error:", error);
    throw error;
  }
}
