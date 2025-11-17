import EventsShort from "@/components/sections/EventsShort";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Image from "next/image";
import { seminars } from "@/lib/dummy";
import Footer from "@/components/sections/Footer";
import SeminarDetailPage from "@/components/sections/SeminarDetail";

export default function Events() {
  return (
    <div>
      <main>
        <Navbar/>
        <SeminarDetailPage/>
        <Footer/>
      </main>
    </div>
  );
}
