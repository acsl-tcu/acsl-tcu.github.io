// components/timetable/LazyTimetableWeek.ts
"use client";
import dynamic from "next/dynamic";
const TimetableWeek = dynamic(() => import("./TimetableWeek"), { ssr: false, loading: () => <div className="min-w-[900px] min-h-[520px] rounded-2xl border border-slate-200 bg-white/40 animate-pulse" /> });
export default TimetableWeek;
