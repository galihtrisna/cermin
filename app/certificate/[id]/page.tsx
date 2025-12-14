"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Download, Share2, ShieldCheck, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react"; // Gunakan SVG agar tajam saat diprint

// Tipe data (sesuaikan dengan API response)
interface CertificateData {
  id: string;
  cert_no: string;
  issued_at: string;
  participant: { name: string };
  event: {
    title: string;
    cert_background: string; // URL gambar background
    datetime: string;
  };
}

export default function PublicCertificatePage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  const certRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data
  useEffect(() => {
    // Ganti dengan URL API backend Anda
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/certificates/${id}/public`)
      .then((res) => {
        if (!res.ok) throw new Error("Not Found");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // 2. Fungsi Download PDF
  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      const element = certRef.current;
      
      // Convert HTML ke Canvas
      // scale: 2 atau 3 agar resolusi tinggi (tidak pecah)
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true, // Penting agar gambar dari URL eksternal bisa dirender
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Buat PDF A4 Landscape
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Sertifikat-${data?.participant.name}.pdf`);
    } catch (error) {
      console.error("Gagal generate PDF", error);
      alert("Gagal mendownload sertifikat.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Sertifikat tidak ditemukan.</div>;

  // URL untuk verifikasi (misal discan QR-nya)
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/certificate/${data.id}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center gap-6">
      
      {/* Header Info */}
      <div className="text-center space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Sertifikat Terverifikasi
        </div>
        <h1 className="text-2xl font-bold text-slate-800">E-Certificate</h1>
        <p className="text-slate-500 text-sm">
          Diberikan kepada <b>{data.participant.name}</b> atas partisipasi pada event <b>{data.event.title}</b>.
        </p>
      </div>

      {/* --- AREA SERTIFIKAT (Akan di-convert ke PDF) --- */}
      {/* Aspect Ratio A4 Landscape = 297mm x 210mm (~1.414) */}
      <div className="relative w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden bg-white">
        <div 
          ref={certRef}
          className="relative w-full aspect-[297/210] text-slate-900"
          style={{
             // Agar saat html2canvas, background ter-load
             backgroundImage: `url(${data.event.cert_background})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
          }}
        >
          {/* Overlay Konten Dinamis */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[5%]">
            
            {/* Nama Peserta */}
            <h1 className="text-[3vw] md:text-[24px] lg:text-[32px] font-bold tracking-wide uppercase font-serif text-[#1e293b]">
              {data.participant.name}
            </h1>
            
            {/* Divider / Garis */}
            <div className="w-[40%] h-[2px] bg-slate-800 my-[1.5%]"></div>

            {/* Nomor Sertifikat */}
            <p className="text-[1.2vw] md:text-[12px] font-medium text-slate-600">
              No: {data.cert_no}
            </p>
          </div>

          {/* QR Code & Proteksi (Pojok Kanan Bawah) */}
          <div className="absolute bottom-[8%] right-[5%] flex flex-col items-center gap-2 bg-white/90 p-2 rounded-lg border border-slate-200 shadow-sm">
            <QRCodeSVG 
              value={verificationUrl} 
              size={80} // Ukuran dalam pixel (akan menyesuaikan skala)
              level={"H"} // Error correction level High
              className="w-[10%] h-auto max-w-[80px]" 
            />
            <span className="text-[8px] text-slate-500 font-mono tracking-tighter">
              ID: {data.id.split('-')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {downloading ? "Memproses PDF..." : "Download PDF"}
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        &copy; {new Date().getFullYear()} Cermin Event Platform. Scan QR untuk verifikasi keaslian.
      </p>
    </div>
  );
}