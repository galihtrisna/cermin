import EventsShort from "@/components/sections/EventsShort";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Image from "next/image";
import { seminars } from "@/lib/dummy";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div>
      <main>
        <Navbar/>
        <Hero/>
        <EventsShort seminars={seminars}/>
        <Footer/>
      </main>
    </div>
  );
}
