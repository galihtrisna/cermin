import EventsShort from "@/components/sections/EventsShort";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

import { getAllEvents } from "@/app/actions/event";

export default async function Home() {
  // Ambil data event dari backend
  const seminars = await getAllEvents();

  return (
    <div>
      <main>
        <Navbar />
        <Hero />
        <EventsShort seminars={seminars} />
        <Footer />
      </main>
    </div>
  );
}
