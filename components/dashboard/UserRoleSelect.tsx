"use client";

import { useState } from "react";

interface Props {
  userId: string;
  currentRole: string;
  userName: string;
  onUpdate: (userId: string, newRole: string) => Promise<void>;
}

export default function UserRoleSelect({ userId, currentRole, userName, onUpdate }: Props) {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    // 1. Logic Pop-up Konfirmasi
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mengubah role "${userName}" menjadi "${newRole}"?`
    );

    if (!confirmed) {
      // Kembalikan ke role awal jika batal
      e.target.value = role;
      return;
    }

    setLoading(true);
    try {
      await onUpdate(userId, newRole);
      setRole(newRole);
      alert("Role berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui role.");
      e.target.value = role; // Reset jika gagal
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={role}
        onChange={handleChange}
        disabled={loading}
        // 2. Fix Warna Dropdown (text-slate-900 dan bg-white)
        className={`
          block w-full rounded-lg border-slate-200 
          bg-white py-1.5 px-3 
          text-slate-900 font-medium text-sm
          shadow-sm focus:border-blue-500 focus:ring-blue-500
          disabled:opacity-50
          cursor-pointer
        `}
        style={{ color: '#0f172a' }} // Memaksa warna teks hitam pekat
      >
        <option value="staff" className="text-slate-900">Staff / User</option>
        <option value="admin" className="text-slate-900">Organizer (Admin)</option>
        <option value="superadmin" className="text-slate-900">Superadmin</option>
      </select>
      {loading && (
        <span className="absolute right-8 top-2 text-xs text-blue-600">...</span>
      )}
    </div>
  );
}