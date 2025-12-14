import { getPublicCertificate } from "@/app/actions/certificate";
import CertificateView from "@/components/CertificateView"; // Pastikan path ini benar sesuai struktur folder Anda

// Perhatikan tipe data: params adalah Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicCertificatePage({ params }: PageProps) {
  // 1. Unwrap params terlebih dahulu
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch Data di Server menggunakan ID yang sudah didapat
  const data = await getPublicCertificate(id);

  // 3. Handle jika data kosong (404 dari backend)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-xl font-bold text-red-500">Sertifikat Tidak Ditemukan</h1>
        <p className="text-gray-500">Pastikan URL yang Anda akses sudah benar atau hubungi panitia.</p>
      </div>
    );
  }

  // 4. Render Client Component
  return <CertificateView data={data} />;
}