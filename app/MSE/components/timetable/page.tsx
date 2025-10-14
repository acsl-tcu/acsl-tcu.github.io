// import dynamic from "next/dynamic";

import TimetableBoard from "./TimetableBoard";
// dnd-kit を含むため SSR 無効でクライアント描画
// const TimetableBoard = dynamic(() => import("@/app/MSE/components/timetable/TimetableBoard"), { ssr: false });

export default function Page() {
  return <TimetableBoard initialQuarter="Q1" initialGrade={1} />;
}
