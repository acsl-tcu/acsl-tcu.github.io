"use client";
import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { SubjectCard as SubjectCardType, SlotLabel } from "@/lib/types/timetable";

export default function DroppableCell({ id, children }: { id: string; children?: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={
        "min-h-[84px] rounded-lg border border-slate-200 bg-slate-50/60 p-2 transition " +
        (isOver ? "ring-2 ring-blue-400 bg-blue-50" : "")
      }
    >
      {children}
    </div>
  );
}

/**
 * グリッド内のカード。Offering×SlotLabel を表す。
 * id は `${offeringId}@@${SlotLabel}` とし、別スロットに落とすと移動、pool に落とすと削除。
 */
export function SubjectCardInCell({
  subject,
  SlotLabel,
  onRemove,
}: {
  subject: SubjectCardType;
  SlotLabel: SlotLabel;
  onRemove: (offeringId: string, SlotLabel: SlotLabel) => void;
}) {
  const dragId = `${subject.offeringId}@@${SlotLabel}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dragId });
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
        "group rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition relative " +
        (isDragging ? "opacity-80 ring-2 ring-blue-500" : "")
      }
    >
      <button
        type="button"
        onClick={() => onRemove(subject.offeringId, SlotLabel)}
        className="absolute right-1 top-1 hidden rounded-md border border-slate-200 bg-white/80 px-1 text-[10px] text-slate-600 hover:bg-red-50 hover:text-red-600 group-hover:block"
        aria-label="このコマから外す"
      >
        ×
      </button>
      <div className="font-semibold text-slate-800">{subject.name}</div>
      <div className="mt-1 text-xs text-slate-500">{subject.code ?? ""}</div>
    </div>
  );
}
