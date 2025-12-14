"use client";

import { useEffect, useState } from "react";
import { createAxiosJWT } from "@/lib/axiosJwt";
import Link from "next/link";
import { Calendar, MapPin, QrCode } from "lucide-react";
import type { Users } from "@/lib/definitions";

interface StaffDashboardProps {
  user: Users;
}

export default function StaffDashboard({ user }: StaffDashboardProps) {
  const [assignedEvents, setAssignedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const axiosJWT = createAxiosJWT();

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await axiosJWT.get("/api/events/staff/assigned");
        setAssignedEvents(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[#344270]">
          Tugas Event Saya
        </h2>
        <p className="text-sm text-slate-500">
          Daftar event di mana Anda bertugas sebagai scanner/staff.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Memuat tugas...</p>
      ) : assignedEvents.length === 0 ? (
        <div className="p-8 border border-dashed rounded-2xl text-center text-slate-500">
          Belum ada event yang ditugaskan ke Anda.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assignedEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white/80 border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-[#344270] mb-2">
                  {ev.title}
                </h3>
                <div className="space-y-1 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>
                      {new Date(ev.datetime).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/event/${ev.id}/checkin`}
                className="
                  flex items-center justify-center gap-2 
                  w-full py-2.5 rounded-xl 
                  bg-blue-600 text-white font-medium 
                  hover:bg-blue-700 transition
                "
              >
                <QrCode className="w-4 h-4" />
                Mulai Scan Presensi
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
