// app/superadmin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getAdminUsers,
  updateUserStatus,
  deleteUserForce,
  getOrganizers,
  updateOrganizerStatus,
} from "@/app/actions/superadmin";
import {
  Users as UserIcon,
  Search,
  Trash2,
  ShieldCheck,
  Ban,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Users } from "@/lib/definitions";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<"users" | "organizers">("users");

  // State Users
  const [users, setUsers] = useState<Users[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // State Organizers
  const [organizers, setOrganizers] = useState<any[]>([]);

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const data = await getAdminUsers(search, roleFilter);
        setUsers(data);
      } else {
        const data = await getOrganizers(); // Ambil semua status
        setOrganizers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, search, roleFilter]);

  // Handler Actions User
  const handleChangeRole = async (id: string, newRole: any) => {
    if (!confirm(`Ubah role user ini menjadi ${newRole}?`)) return;
    await updateUserStatus(id, { role: newRole });
    fetchData();
  };

  const handleToggleBlock = async (user: Users) => {
    const newStatus = !user.is_verified;
    if (!confirm(newStatus ? "Aktifkan user ini?" : "Blokir user ini?")) return;
    await updateUserStatus(user.id, { is_verified: newStatus });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus user ini secara permanen?")) return;
    await deleteUserForce(id);
    fetchData();
  };

  // Handler Actions Organizer
  const handleOrganizerAction = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;
    await updateOrganizerStatus(id, status);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#344270]">
          Manajemen Pengguna
        </h1>
        <p className="text-sm text-slate-500">
          Kelola akun pengguna dan pengajuan organizer.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2 text-sm font-medium transition ${
            activeTab === "users"
              ? "border-b-2 border-[#50A3FB] text-[#50A3FB]"
              : "text-slate-500 hover:text-[#344270]"
          }`}
        >
          Semua Pengguna
        </button>
        <button
          onClick={() => setActiveTab("organizers")}
          className={`pb-2 text-sm font-medium transition ${
            activeTab === "organizers"
              ? "border-b-2 border-[#50A3FB] text-[#50A3FB]"
              : "text-slate-500 hover:text-[#344270]"
          }`}
        >
          Pengajuan Organizer
        </button>
      </div>

      {/* Filters (Only for Users Tab) */}
      {activeTab === "users" && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/20 bg-white"
          >
            <option value="all">Semua Role</option>
            <option value="staff">Staff (User Biasa)</option>
            <option value="admin">Organizer (Admin)</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "users" ? (
              /* TABEL USERS */
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-center text-slate-400"
                      >
                        Tidak ada user ditemukan.
                      </td>
                    </tr>
                  )}
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-medium text-[#344270]">
                          {u.name}
                        </div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      {/* --- GANTI BAGIAN INI (Kolom Role) --- */}
                      <td className="p-4">
                        <select
                          value={u.role || "staff"}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            // 1. Pop-up Konfirmasi
                            const isConfirmed = window.confirm(
                              `Apakah Anda yakin ingin mengubah role user "${u.name}" menjadi "${newRole}"?`
                            );

                            if (isConfirmed) {
                              handleChangeRole(u.id, newRole);
                            } else {
                              // Reset dropdown jika batal
                              e.target.value = u.role || "staff";
                            }
                          }}
                          // 2. Perbaikan Warna (bg-white & text-slate-900)
                          className="bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="staff" className="text-slate-900">
                            Staff
                          </option>
                          <option value="admin" className="text-slate-900">
                            Admin
                          </option>
                          <option value="superadmin" className="text-slate-900">
                            Superadmin
                          </option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            u.is_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.is_verified ? "Aktif" : "Diblokir"}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleBlock(u)}
                          className={`p-2 rounded-lg hover:bg-slate-100 ${
                            u.is_verified ? "text-amber-500" : "text-green-500"
                          }`}
                          title={u.is_verified ? "Blokir" : "Aktifkan"}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* TABEL ORGANIZERS */
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Organisasi</th>
                    <th className="p-4">Pemohon</th>
                    <th className="p-4">Detail</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-6 text-center text-slate-400"
                      >
                        Belum ada pengajuan.
                      </td>
                    </tr>
                  )}
                  {organizers.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-[#344270]">
                        {org.organizer_name}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{org.users?.name}</div>
                        <div className="text-xs text-slate-500">
                          {org.users?.email}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-slate-600 max-w-xs truncate">
                        {org.description}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium 
                           ${
                             org.status === "approved"
                               ? "bg-green-100 text-green-700"
                               : org.status === "rejected"
                               ? "bg-red-100 text-red-700"
                               : "bg-yellow-100 text-yellow-700"
                           }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {org.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleOrganizerAction(org.id, "approved")
                              }
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> ACC
                            </button>
                            <button
                              onClick={() =>
                                handleOrganizerAction(org.id, "rejected")
                              }
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Tolak
                            </button>
                          </div>
                        )}
                        {org.status !== "pending" && (
                          <span className="text-xs text-slate-400">
                            Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
