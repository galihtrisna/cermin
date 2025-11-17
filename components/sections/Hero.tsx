"use client";

import Link from "next/link";
import Image from "next/image";
import { Award, CheckCircle2, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Abstract Image */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <Image
          src="/hero-abstract.jpg" // taruh file di /public/hero-abstract.jpg
          alt=""
          fill
          className="object-cover animate-float"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in text-[#344270]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-[#50A3FB]" />
            <span className="text-sm font-semibold">
              Buat Sertifikat Instan
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-brand-gradient">Certificate Made</span>
            <br />
            <span className="text-[#344270]">Instantly</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-[#344270]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Platform manajemen seminar dan sertifikat digital yang modern.
            Kelola event, peserta, dan sertifikat dalam satu tempat.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth?register"
              className="inline-flex items-center justify-center pastel-gradient text-[#344270] font-semibold text-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Award className="w-5 h-5 mr-2" />
              Buat Sekarang
            </Link>

            <Link
              href="/seminars"
              className="inline-flex items-center justify-center glass-card border border-[#50A3FB66] text-[#344270] font-semibold text-lg px-8 py-3 rounded-xl hover:border-[#50A3FB] transition-colors"
            >
              Lihat Seminar
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Award, text: "Sertifikat Digital" },
              { icon: CheckCircle2, text: "QR Code Verifikasi" },
              { icon: Zap, text: "Generate Otomatis" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card p-6 flex items-center gap-3 hover:scale-105 transition-transform"
              >
                <div className="pastel-gradient p-2 rounded-lg">
                  <feature.icon className="w-5 h-5 text-[#344270]" />
                </div>
                <span className="font-semibold text-[#344270]">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
