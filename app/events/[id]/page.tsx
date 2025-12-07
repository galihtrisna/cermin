import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import SeminarDetailPage from "@/components/sections/SeminarDetail";
import { getEventById } from "@/app/actions/event";

// Definisikan props params sesuai standar Next.js App Router
interface PageProps {
  params: {
    id: string;
  };
}

export default async function EventsDetail({ params }: PageProps) {
  // 1. Ambil ID dari URL
  const { id } = await params; // Next.js 15 mungkin butuh await params, versi 14 tidak masalah jika di-await

  let eventData = null;
  try {
    // 2. Fetch data detail dari backend
    eventData = await getEventById(id);
  } catch (error) {
    console.error("Error fetching event detail:", error);
    // Anda bisa me-return komponen Not Found kustom di sini
  }

  // Jika data tidak ditemukan
  if (!eventData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-[#344270]">
          <h1 className="text-xl font-semibold">Event tidak ditemukan atau terjadi kesalahan.</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* 3. Lempar data event ke komponen SeminarDetailPage */}
      <main className="flex-grow">
         <SeminarDetailPage event={eventData} />
      </main>
      <Footer />
    </div>
  );
}