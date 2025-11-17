"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type Mode = "login" | "register";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const AuthPage = () => {
  const searchParams = useSearchParams();
  const initialMode: Mode =
    searchParams.has("register")
      ? "register"
      : searchParams.has("login")
      ? "login"
      : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password wajib diisi.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (mode === "register") {
      if (!form.confirmPassword.trim()) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi.";
      } else if (form.confirmPassword !== form.password) {
        newErrors.confirmPassword = "Konfirmasi password tidak sama.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Di sini nanti tinggal ganti ke fetch/axios ke API kamu
    setTimeout(() => {
      setSubmitting(false);

      // Contoh handler efek
      setErrors({
        general:
          mode === "login"
            ? "Contoh: kredensial salah. (nanti ganti dari respon API)"
            : "Contoh: email sudah terdaftar. (nanti ganti dari respon API)",
      });
    }, 800);
  };

  const isLogin = mode === "login";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo + tagline */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <Image src="/cermin-logo.png" alt="logo" width={200} height={100} />
          </div>
          <p className="text-sm md:text-base text-[#344270b3]">
            Certificate Made Instantly
          </p>
        </div>

        {/* Tab Login / Register */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white/40 backdrop-blur-xl rounded-full p-1 shadow-[0_10px_40px_rgba(15,23,42,0.15)]">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`px-6 md:px-10 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                isLogin
                  ? "bg-white text-[#344270] shadow-md"
                  : "text-[#34427099]"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`px-6 md:px-10 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                !isLogin
                  ? "bg-white text-[#344270] shadow-md"
                  : "text-[#34427099]"
              }`}
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Card */}
        <section
          className="
            bg-white/90 backdrop-blur-2xl 
            rounded-3xl 
            shadow-[0_24px_80px_rgba(15,23,42,0.18)]
            border border-white/60
            px-6 md:px-10 py-8 md:py-10
          "
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="space-y-1 mb-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
                {isLogin ? "Login" : "Daftar"}
              </h1>
              <p className="text-sm md:text-[15px] text-[#344270b3]">
                {isLogin
                  ? "Login untuk akses webinar dan sertifikatmu."
                  : "Daftar untuk mulai mengelola seminar dan sertifikat."}
              </p>
            </div>

            {/* General error */}
            {errors.general && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#344270]"
              >
                Email
              </label>
              <div
                className={`flex items-center rounded-2xl border px-4 py-3 bg-white/70 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent ${
                  errors.email ? "border-red-400" : "border-[#E4E7F5]"
                }`}
              >
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="nama@gmail.com"
                  className="w-full bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#344270]"
              >
                Password
              </label>
              <div
                className={`flex items-center rounded-2xl border px-4 py-3 bg-white/70 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent ${
                  errors.password ? "border-red-400" : "border-[#E4E7F5]"
                }`}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="namal123!"
                  className="w-full bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-[#34427080]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs md:text-[12px] text-[#34427099] mt-1">
                <span>Password minimal 6 karakter</span>
                {isLogin && (
                  <Link href="#" className="hover:underline text-[#50A3FB]">
                    Lupa kata sandi?
                  </Link>
                )}
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Konfirmasi Password (Register only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#344270]"
                >
                  Konfirmasi Password
                </label>
                <div
                  className={`flex items-center rounded-2xl border px-4 py-3 bg-white/70 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-[#E4E7F5]"
                  }`}
                >
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    placeholder="Ulangi password"
                    className="w-full bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="
                mt-4 w-full rounded-2xl 
                bg-[#50A3FB] 
                text-white 
                font-semibold 
                py-3.5 
                text-sm md:text-base
                shadow-[0_12px_30px_rgba(80,163,251,0.55)]
                hover:opacity-95
                disabled:opacity-60
                disabled:cursor-not-allowed
                transition-all
              "
            >
              {submitting
                ? isLogin
                  ? "Memproses..."
                  : "Mendaftar..."
                : isLogin
                ? "Login"
                : "Daftar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AuthPage;
