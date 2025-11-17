import EventsShort from "@/components/sections/EventsShort";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Image from "next/image";
import { seminars } from "@/lib/dummy";
import Footer from "@/components/sections/Footer";
import SeminarRegisterPage from "@/components/SeminarRegister";

export default function Register() {
  return (
    <div>
      <main>
        <Navbar/>
        <SeminarRegisterPage/>
        <Footer/>
      </main>
    </div>
  );
}
