"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { SubjectCard as SubjectCardType } from "@/lib/types/timetable";

/**
 * プール（未配当）に置くカード。id は offeringId 単体。
 * スロットへドロップ→そのスロットが「追加」される。
 */
export default function SubjectCard({ subject }: { subject: SubjectCardType }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: subject.offeringId,
  });
  const style: React.CSSProperties | undefined = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={
        "group rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition " +
        (isDragging ? "opacity-80 ring-2 ring-blue-500" : "")
      }
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-800">{subject.name}</div>
        {subject.units != null && <span className="text-xs text-slate-500">{subject.units} 単位</span>}
      </div>
      <div className="mt-1 text-xs text-slate-500">{subject.code ?? ""}</div>
      <div className="mt-2 hidden text-[10px] text-slate-400 group-hover:block">ドラッグしてコマへ追加</div>
    </div>
  );
}
