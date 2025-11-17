"use client";

import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const SeminarRegisterPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const price = 55000;
  const admin = 5000;
  const total = price + admin;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!form.phone.trim()) newErrors.phone = "No. telepon wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // nanti diganti call API
    setTimeout(() => {
      setSubmitting(false);
      alert(`Form untuk seminar ${id ?? ""} terkirim (dummy).`);
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-28">
      <div
        className="
          w-full max-w-3xl 
          rounded-[32px]
          bg-gradient-to-b from-[#EBDCFF] via-white to-[#F3E9FF]
          border border-white/70
          shadow-[0_10px_40px_rgba(0,0,0,0.06)]
          px-6 md:px-10 py-8 md:py-10
        "
      >
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270] mb-1">
            Daftar Seminar
          </h1>
          <p className="text-sm md:text-base text-[#344270b3]">
            Workshop Digital Marketing 2025
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Lengkap */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#344270]"
            >
              Nama Lengkap
            </label>
            <div
              className={`
                rounded-2xl border px-4 py-3 bg-white/85
                focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent
                ${errors.name ? "border-red-400" : "border-[#E4E7F5]"}
              `}
            >
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#344270]"
            >
              Email
            </label>
            <div
              className={`
                rounded-2xl border px-4 py-3 bg-white/85
                focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent
                ${errors.email ? "border-red-400" : "border-[#E4E7F5]"}
              `}
            >
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* No. Telepon */}
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-[#344270]"
            >
              No. Telepon
            </label>
            <div
              className={`
                rounded-2xl border px-4 py-3 bg-white/85
                focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent
                ${errors.phone ? "border-red-400" : "border-[#E4E7F5]"}
              `}
            >
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="08xxxxxxxx"
                className="w-full bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Ringkasan Biaya */}
          <section className="mt-4 rounded-2xl bg-white/95 border border-white/70 px-5 py-4 md:px-6 md:py-5">
            <h2 className="text-sm md:text-base font-semibold text-[#344270] mb-3">
              Ringkasan Biaya
            </h2>

            <div className="space-y-2 text-sm md:text-[15px] text-[#344270cc]">
              <div className="flex items-center justify-between">
                <span>Biaya Pendaftaran</span>
                <span>Rp {price.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Biaya Admin</span>
                <span>Rp {admin.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="border-t border-[#E4E7F5] mt-3 pt-3 flex items-center justify-between text-sm md:text-[15px]">
              <span className="font-semibold text-[#344270]">Total</span>
              <span className="font-semibold text-[#50A3FB]">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </section>

          {/* Info pembayaran */}
          <p className="text-xs md:text-sm text-[#34427099] mt-2">
            Pembayaran dilakukan melalui QRIS setelah menekan tombol Bayar
          </p>

          {/* Tombol Bayar */}
          <button
            type="submit"
            disabled={submitting}
            className="
              mt-4 w-full rounded-2xl 
              bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
              text-white font-semibold
              py-3.5 
              text-sm md:text-base
              shadow-[0_12px_30px_rgba(80,163,251,0.45)]
              hover:opacity-95
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition
            "
          >
            {submitting ? "Memproses..." : "Bayar"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default SeminarRegisterPage;
