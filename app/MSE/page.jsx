// app/dashboard/page.tsx
'use client';

import TimetableBoard from './timetable_board_tsx_next';

export default function DashboardPage() {
   
  return (
    <div className="px-2 w-full">
      <TimetableBoard />   
    </div>
  );
}
