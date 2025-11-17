// app/feedback/[token]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

const FeedbackPage = () => {
  const params = useParams();
  const token = params?.token as string | undefined;

  // nanti token dipakai call API: /api/feedback/{token}
  // dummy data:
  const participant = {
    name: "Galih Trisna",
    email: "galih@example.com",
    eventTitle: "Workshop Digital Marketing 2025",
  };

  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);

    // TODO: kirim ke API dengan token
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 700);
  };

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-sm text-red-600">
            Token feedback tidak ditemukan. Pastikan link yang kamu buka benar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-md
          bg-white/90 backdrop-blur-2xl
          rounded-3xl border border-white/70
          shadow-[0_24px_80px_rgba(15,23,42,0.18)]
          px-5 md:px-8 py-6 md:py-8
        "
      >
        {!done ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center mb-4">
              <p className="text-xs text-[#34427080] mb-1">
                Terima kasih sudah mengikuti
              </p>
              <h1 className="text-xl md:text-2xl font-semibold text-[#344270]">
                {participant.eventTitle}
              </h1>
              <p className="text-[11px] md:text-xs text-[#34427080] mt-1">
                Feedback kamu membantu kami bikin event yang lebih baik lagi ✨
              </p>
            </div>

            {/* Info peserta (read-only) */}
            <div className="rounded-2xl bg-[#F5F6FF] border border-[#E4E7F5] px-4 py-3 text-xs md:text-sm text-[#344270]">
              <p className="font-semibold">{participant.name}</p>
              <p className="text-[11px] md:text-xs text-[#34427099]">
                {participant.email}
              </p>
              <p className="text-[11px] text-[#34427099] mt-1">
                Data ini otomatis dari tiket kamu, tidak perlu diubah lagi.
              </p>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#344270]">
                Bagaimana pengalamanmu di event ini?
              </p>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`
                      flex-1 py-2 rounded-2xl text-xs md:text-sm font-semibold
                      border 
                      ${
                        rating === val
                          ? "border-transparent pastel-gradient text-[#344270] shadow-[0_8px_22px_rgba(148,163,216,0.5)]"
                          : "border-[#E4E7F5] bg-white text-[#34427099]"
                      }
                    `}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#34427080]">
                1 = sangat kurang, 5 = sangat puas
              </p>
            </div>

            {/* Komentar */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#344270]">
                Ada masukan atau saran?
              </p>
              <div className="rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tulis saran, hal yang kamu suka, atau ide topik lain..."
                  className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066] resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !rating}
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
              {submitting ? "Mengirim..." : "Kirim Feedback"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#344270]">
              Terima kasih! 💙
            </h2>
            <p className="text-sm text-[#34427099]">
              Feedback kamu sudah kami terima. Sertifikat dan materi (kalau ada)
              akan dikirim sesuai ketentuan panitia.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default FeedbackPage;
