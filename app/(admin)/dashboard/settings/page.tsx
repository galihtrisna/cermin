// app/dashboard/settings/page.tsx
"use client";

import { useState, FormEvent } from "react";

const SettingsPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("Galih Trisna");
  const [email] = useState("galih@example.com");
  const [organization, setOrganization] = useState("CERMIN Organizer");
  const [role, setRole] = useState("Event Organizer");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setSubmitting(true);

    // TODO: update via API
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("Pengaturan berhasil disimpan.");
    }, 700);
  };

  return (
    <>
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-[#34427099]">
          Atur profil dan preferensi akunmu.
        </p>
      </div>

      <section
        className="
          bg-white/90 backdrop-blur-2xl 
          rounded-3xl 
          shadow-[0_24px_80px_rgba(15,23,42,0.18)]
          border border-white/60
          px-4 md:px-8 py-6 md:py-8
          max-w-3xl
        "
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Nama */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="
                w-full rounded-2xl border border-[#E4E7F5]
                bg-white/80 px-4 py-2.5
                text-sm text-[#344270]
                placeholder:text-[#34427066]
                focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
              "
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="
                w-full rounded-2xl border border-[#E4E7F5]
                bg-[#F5F6FF] px-4 py-2.5
                text-sm text-[#34427099]
                cursor-not-allowed
              "
            />
            <p className="text-[11px] text-[#34427080]">
              Email digunakan untuk login & menerima notifikasi.
            </p>
          </div>

          {/* Organisasi */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Organisasi / Komunitas
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="
                w-full rounded-2xl border border-[#E4E7F5]
                bg-white/80 px-4 py-2.5
                text-sm text-[#344270]
                placeholder:text-[#34427066]
                focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
              "
              placeholder="Contoh: BEM, Komunitas, LPK, dll"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Peran
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="
                w-full rounded-2xl border border-[#E4E7F5]
                bg-white/80 px-4 py-2.5
                text-sm text-[#344270]
                placeholder:text-[#34427066]
                focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
              "
              placeholder="Contoh: Event Organizer, Panitia, Admin"
            />
          </div>

          {/* Timezone */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Zona Waktu
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="
                w-full rounded-2xl border border-[#E4E7F5]
                bg-white/80 px-4 py-2.5
                text-sm text-[#344270]
                focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
              "
            >
              <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
              <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
              <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
            </select>
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="
                w-full rounded-2xl 
                bg-[#50A3FB] 
                text-white 
                font-semibold 
                py-3.5 
                text-sm md:text-base
                shadow-[0_12px_30px_rgba(80,163,251,0.55)]
                hover:opacity-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
              "
            >
              {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default SettingsPage;
