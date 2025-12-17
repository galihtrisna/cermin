"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Sedang memverifikasi email Anda...");

  useEffect(() => {
    if (!token || !uid) {
      setStatus("error");
      setMessage("Link verifikasi tidak valid.");
      return;
    }

    const verify = async () => {
      try {
        // Panggil endpoint backend yang baru kita buat
        await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER}api/verify-email`, {
          uid,
          token,
        });
        setStatus("success");
        setMessage("Email berhasil diverifikasi! Anda sekarang dapat login.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Gagal memverifikasi email.");
      }
    };

    verify();
  }, [token, uid]);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        {status === "verifying" && "⏳ Memverifikasi..."}
        {status === "success" && "✅ Berhasil!"}
        {status === "error" && "❌ Gagal"}
      </h1>
      <p className="text-slate-600">{message}</p>
      
      {status === "success" && (
        <button
          onClick={() => router.push("/auth?login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Login Sekarang
        </button>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <Suspense fallback={<p>Loading...</p>}>
          <VerifyContent />
        </Suspense>
      </div>
    </main>
  );
}