"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { createAxiosJWT } from "@/lib/axiosJwt";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Loader2 } from "lucide-react";

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
  const router = useRouter();
  const id = params?.id as string | undefined; // Event ID

  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  
  // State harga
  const [price, setPrice] = useState(0);
  const [eventTitle, setEventTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch Event Data untuk dapat Harga
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const axios = createAxiosJWT();
        // Pastikan endpoint ini PUBLIC (tanpa requireUser) di backend
        const res = await axios.get(`/api/events/${id}`);
        const data = res.data.data;
        setPrice(data.price);
        setEventTitle(data.title);
      } catch (err) {
        console.error("Event not found", err);
        setErrorMsg("Event tidak ditemukan.");
      } finally {
        setLoadingEvent(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  // 2. Logic Hitung Fee (Sama dengan backend untuk display)
  const calculateFees = (basePrice: number) => {
    let fee = basePrice * 0.02; // 2%
    if (fee < 1000) fee = 1000; // Min 1000
    fee = Math.ceil(fee / 100) * 100; // Round up kelipatan 100
    return fee;
  };

  const adminFee = calculateFees(price);
  const total = price + adminFee;

  // Form Handlers
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const axios = createAxiosJWT();
      // Submit order
      const response = await axios.post("/api/orders", {
        event_id: id,
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      // Sukses -> Redirect ke Payment Page
      const orderId = response.data.data.id;
      router.push(`/payment/${orderId}`);

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal melakukan pendaftaran.";
      setErrorMsg(msg);
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#50A3FB]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-2xl rounded-[32px] bg-gradient-to-b from-[#EBDCFF] via-white to-[#F3E9FF] border border-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.06)] px-6 md:px-10 py-8 md:py-10">
          
          {/* Header */}
          <header className="mb-8 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#344270] mb-1">
              Daftar Seminar
            </h1>
            <p className="text-sm md:text-base text-[#344270b3]">
              {eventTitle}
            </p>
          </header>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-semibold text-[#344270]">
                Nama Lengkap
              </label>
              <div className={`rounded-2xl border px-4 py-3 bg-white/85 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent ${errors.name ? "border-red-400" : "border-[#E4E7F5]"}`}>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-transparent outline-none text-[#344270]"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-[#344270]">
                Email
              </label>
              <div className={`rounded-2xl border px-4 py-3 bg-white/85 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent ${errors.email ? "border-red-400" : "border-[#E4E7F5]"}`}>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@anda.com"
                  className="w-full bg-transparent outline-none text-[#344270]"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-semibold text-[#344270]">
                No. WhatsApp
              </label>
              <div className={`rounded-2xl border px-4 py-3 bg-white/85 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent ${errors.phone ? "border-red-400" : "border-[#E4E7F5]"}`}>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="08xxxxxxxx"
                  className="w-full bg-transparent outline-none text-[#344270]"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
            </div>

            {/* Ringkasan Biaya */}
            <section className="mt-6 rounded-2xl bg-white/60 border border-white/50 px-5 py-4">
              <h2 className="text-sm font-semibold text-[#344270] mb-3">Ringkasan Biaya</h2>
              <div className="space-y-2 text-sm text-[#344270cc]">
                <div className="flex justify-between">
                  <span>Tiket Seminar</span>
                  <span>Rp {price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan (Admin)</span>
                  <span>Rp {adminFee.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between text-base font-bold text-[#344270]">
                <span>Total Bayar</span>
                <span className="text-[#50A3FB]">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 rounded-2xl bg-gradient-to-r from-[#50A3FB] to-[#A667E4] text-white font-semibold py-3.5 shadow-lg hover:opacity-95 disabled:opacity-70 transition"
            >
              {submitting ? "Memproses..." : "Lanjut Pembayaran"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeminarRegisterPage;