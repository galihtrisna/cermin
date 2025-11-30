"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { checkUser, setMyRole } from "@/app/actions/auth";
import { applyOrganizer } from "@/app/actions/organizer";
import type { Users } from "@/lib/definitions";
import { clearAccessToken } from "@/lib/token";

type Step = "choose-role" | "organizer-form" | "submitted";

interface OrganizerFormState {
  organizer_name: string;
  description: string;
  website: string;
  contact_phone: string;
}

interface OrganizerFormErrors {
  organizer_name?: string;
  description?: string;
  website?: string;
  contact_phone?: string;
  general?: string;
}

export default function RoleSetupPage() {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<Users | null>(null);
  const [step, setStep] = useState<Step>("choose-role");
  const [submitting, setSubmitting] = useState(false);

  const [organizerForm, setOrganizerForm] = useState<OrganizerFormState>({
    organizer_name: "",
    description: "",
    website: "",
    contact_phone: "",
  });
  const [errors, setErrors] = useState<OrganizerFormErrors>({});

  // Bagian useEffect di app/role-setup/page.tsx

  useEffect(() => {
    const init = async () => {
      try {
        const u = await checkUser(); // GET /api/users/admin

        // PERBAIKAN: Jika u null (misal karena 401 tertangkap tapi return null),
        // kita paksa logout
        if (!u) {
          throw new Error("User data is empty");
        }

        setUser(u);

        if (u.role === "staff") {
          router.replace("/dashboard");
          return;
        }
        if (u.role === "admin") {
          router.replace("/dashboard");
          return;
        }
      } catch (err) {
        console.error("Gagal memuat sesi:", err);

        // PENTING: Hapus token supaya tidak looping saat dilempar ke login
        clearAccessToken();

        router.replace("/auth?login");
      } finally {
        setLoadingUser(false);
      }
    };

    init();
  }, [router]);

  const handleOrganizerChange = (
    field: keyof OrganizerFormState,
    value: string
  ) => {
    setOrganizerForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validateOrganizerForm = () => {
    const newErrors: OrganizerFormErrors = {};

    if (!organizerForm.organizer_name.trim()) {
      newErrors.organizer_name = "Nama penyelenggara wajib diisi.";
    }
    if (!organizerForm.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2️⃣ Handler pilih role staff
  const handleChooseStaff = async () => {
    try {
      setSubmitting(true);
      const updated = await setMyRole("staff");
      setUser(updated);
      router.replace("/dashboard-staff"); // sesuaikan rute staff-mu
    } catch (err: any) {
      console.error(err);
      setErrors({
        general:
          err?.response?.data?.message ||
          "Gagal menyimpan role staff. Coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 3️⃣ Handler pilih penyelenggara (admin) → lanjut ke form
  const handleChooseOrganizer = () => {
    setStep("organizer-form");
  };

  // 4️⃣ Submit form penyelenggara
  const handleOrganizerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateOrganizerForm()) return;

    try {
      setSubmitting(true);
      // 1) Set role jadi admin dulu
      const updated = await setMyRole("admin");
      setUser(updated);

      // 2) Kirim pengajuan penyelenggara
      await applyOrganizer({
        organizer_name: organizerForm.organizer_name.trim(),
        description: organizerForm.description.trim(),
        website: organizerForm.website.trim() || undefined,
        contact_phone: organizerForm.contact_phone.trim() || undefined,
      });

      setStep("submitted");
    } catch (err: any) {
      console.error(err);
      setErrors({
        general:
          err?.response?.data?.message ||
          "Gagal mengirim pengajuan penyelenggara. Coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-slate-500">Memuat data pengguna...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-6 border border-slate-100">
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Tentukan Peranmu di Cermin
          </h1>
          <p className="text-sm md:text-[15px] text-slate-600">
            Hai, {user.name || user.email}! Pilih bagaimana kamu ingin
            menggunakan Cermin.
          </p>
        </header>

        {errors.general && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        {step === "choose-role" && (
          <section className="grid md:grid-cols-2 gap-4">
            {/* Kartu Staff */}
            <button
              type="button"
              onClick={handleChooseStaff}
              disabled={submitting}
              className="text-left rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition p-5 flex flex-col gap-2 disabled:opacity-60"
            >
              <h2 className="font-semibold text-slate-900">
                Saya Staff/Peserta
              </h2>
              <p className="text-sm text-slate-600">
                Akses fitur sebagai staff atau peserta: lihat event, cek
                sertifikat, dan fitur-fitur non-penyelenggara lainnya.
              </p>
              <span className="mt-2 inline-flex text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded-full border border-slate-200">
                Role: staff
              </span>
            </button>

            {/* Kartu Penyelenggara */}
            <button
              type="button"
              onClick={handleChooseOrganizer}
              disabled={submitting}
              className="text-left rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition p-5 flex flex-col gap-2 disabled:opacity-60"
            >
              <h2 className="font-semibold text-slate-900">
                Saya Penyelenggara Acara
              </h2>
              <p className="text-sm text-slate-600">
                Buat dan kelola event, generate sertifikat otomatis, dan undang
                peserta. Pengajuanmu akan ditinjau oleh tim Cermin.
              </p>
              <span className="mt-2 inline-flex text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-full border border-blue-200">
                Role: admin (penyelenggara)
              </span>
            </button>
          </section>
        )}

        {step === "organizer-form" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Data Penyelenggara
            </h2>
            <p className="text-sm text-slate-600">
              Isi data berikut agar kami bisa memverifikasi bahwa penyelenggara
              ini kredibel.
            </p>

            <form onSubmit={handleOrganizerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-800">
                  Nama Penyelenggara
                </label>
                <input
                  type="text"
                  value={organizerForm.organizer_name}
                  onChange={(e) =>
                    handleOrganizerChange("organizer_name", e.target.value)
                  }
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                    errors.organizer_name
                      ? "border-red-400"
                      : "border-slate-200 focus:border-blue-400"
                  }`}
                  placeholder="Contoh: Cermin Academy, BEM ITTP, Komunitas X"
                />
                {errors.organizer_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.organizer_name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-800">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={organizerForm.description}
                  onChange={(e) =>
                    handleOrganizerChange("description", e.target.value)
                  }
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none min-h-[96px] ${
                    errors.description
                      ? "border-red-400"
                      : "border-slate-200 focus:border-blue-400"
                  }`}
                  placeholder="Ceritakan jenis acara yang biasa diadakan, target peserta, atau pengalaman sebelumnya."
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-800">
                    Website / Link Sosial (opsional)
                  </label>
                  <input
                    type="text"
                    value={organizerForm.website}
                    onChange={(e) =>
                      handleOrganizerChange("website", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    placeholder="Link Instagram, website, atau Linktree"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-800">
                    Kontak (WA/Telepon) (opsional)
                  </label>
                  <input
                    type="text"
                    value={organizerForm.contact_phone}
                    onChange={(e) =>
                      handleOrganizerChange("contact_phone", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    placeholder="Contoh: 08xxxxxx"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep("choose-role")}
                  className="text-sm text-slate-600 hover:underline"
                >
                  ← Kembali, pilih role lain
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "Mengirim pengajuan..." : "Kirim Pengajuan"}
                </button>
              </div>
            </form>
          </section>
        )}

        {step === "submitted" && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Pengajuan Dikirim ✅
            </h2>
            <p className="text-sm text-slate-600">
              Terima kasih! Pengajuanmu sebagai penyelenggara sudah kami terima.
              Superadmin Cermin akan meninjau data penyelenggara yang kamu
              kirim.
            </p>
            <p className="text-sm text-slate-600">
              Sambil menunggu, kamu masih bisa login dan melihat status akunmu.
            </p>
            <button
              type="button"
              onClick={() => router.replace("/dashboard")}
              className="mt-2 inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"
            >
              Kembali ke Dashboard
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
