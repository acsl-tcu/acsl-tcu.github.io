"use client";

import React from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { deepStrictEqual } from "assert";

// ===== Types =====
export type Grade = 1 | 2 | 3 | 4;
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type Subject = {
  id: string;
  code?: string;
  name: string;
  instructor?: string;
  units?: number;
};

// A slot is identified by day + period ("コマ")
export type SlotId = `${DayOfWeek}-${number}`; // e.g. "Mon-1"

// Where a subject is placed
export type Placement =
  | { type: "slot"; slotId: SlotId }
  | { type: "pool" };

// ===== Constants =====
const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri"]; // 週5日想定（必要なら拡張）
const PERIODS = [1, 2, 3, 4, 5, 6]; // コマ数（必要なら拡張）

// ===== Demo data (置き換え前提) =====
// 実運用では /api/timetable?grade=..&quarter=.. などから取得して setState してください
const demoSubjects: Subject[] = [
  { id: "s1", code: "ME101", name: "線形代数", units: 2 },
  { id: "s2", code: "ME102", name: "力学Ⅰ", units: 2 },
  { id: "s3", code: "ME103", name: "プログラミング基礎", units: 2 },
  { id: "s4", code: "ME104", name: "材料力学", units: 2 },
  { id: "s5", code: "ME105", name: "設計製図", units: 2 },
];

// 初期配置例: 一部は未配当 (pool)
const initialPlacement: Record<string, Placement> = {
  s1: { type: "slot", slotId: "Mon-1" },
  s2: { type: "slot", slotId: "Wed-3" },
  s3: { type: "pool" },
  s4: { type: "pool" },
  s5: { type: "slot", slotId: "Fri-2" },
};

// ===== UI Pieces =====
function SubjectCard({ subject }: { subject: Subject }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: subject.id,
  });
  const style = transform
    ? ({ transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } as React.CSSProperties)
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
        {subject.units != null && (
          <span className="text-xs text-slate-500">{subject.units} 単位</span>
        )}
      </div>
      <div className="mt-1 text-xs text-slate-500">{subject.code ?? ""}</div>
      <div className="mt-2 hidden text-[10px] text-slate-400 group-hover:block">ドラッグして移動</div>
    </div>
  );
}

function DroppableCell({ id, children }: { id: string; children?: React.ReactNode }) {
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

// ===== Main Component =====
export default function TimetableBoard() {
  const [grade, setGrade] = React.useState<Grade>(1);
  const [quarter, setQuarter] = React.useState<Quarter>("Q1");

  // const [subjects, setSubjects] = React.useState<Subject[]>(demoSubjects);
  const subjects = demoSubjects;
  const [placement, setPlacement] = React.useState<Record<string, Placement>>(initialPlacement);

  // dnd-kit センサー
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return; // ドロップ先なし

    const subjectId = String(active.id);
    const overId = String(over.id);

    // プール (未配当)
    if (overId === "pool") {
      setPlacement((prev) => ({ ...prev, [subjectId]: { type: "pool" } }));
      void persistMove(subjectId, { type: "pool" }, grade, quarter);
      return;
    }

    // 時間割セル: 形式 "Mon-1"
    if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-\d+$/.test(overId)) {
      const next: Placement = { type: "slot", slotId: overId as SlotId };
      setPlacement((prev) => ({ ...prev, [subjectId]: next }));
      void persistMove(subjectId, next, grade, quarter);
    }
  };

  // 保存（API の雛形）
  async function persistMove(
    subjectId: string,
    dest: Placement,
    g: Grade,
    q: Quarter
  ) {
    try {
      console.log(subjectId,deepStrictEqual,g,q);
      // ここをあなたの API に合わせて調整
      // await fetch("/api/timetable/move", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ subjectId, dest, grade: g, quarter: q }),
      // });
    } catch (e) {
      console.error(e);
    }
  }

  // 表示用: 各セルに入っている科目を抽出
const subjectBySlot = React.useMemo(() => {
  const map: Record<SlotId, Subject[]> = Object.fromEntries(
    DAYS.flatMap((day) => PERIODS.map((p) => [`${day}-${p}` as SlotId, []]))
  ) as Record<SlotId, Subject[]>;

  for (const s of subjects) {
    const plc = placement[s.id];
    if (plc?.type === "slot") map[plc.slotId].push(s);
  }
  return map;
}, [subjects, placement]);

  const poolSubjects = React.useMemo(
    () => subjects.filter((s) => placement[s.id]?.type !== "slot"),
    [subjects, placement]
  );

  // 学年・クォーターの変更: 実運用では fetch して setSubjects/ setPlacement する
  const handleChangeGrade = async (v: number) => {
    setGrade(v as Grade);
    // const res = await fetch(`/api/timetable?grade=${v}&quarter=${quarter}`)
    // ... setSubjects, setPlacement
  };
  const handleChangeQuarter = async (v: Quarter) => {
    setQuarter(v);
    // const res = await fetch(`/api/timetable?grade=${grade}&quarter=${v}`)
    // ... setSubjects, setPlacement
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">時間割（週次）</h1>
        <div className="flex gap-3">
          {/* Quarter */}
          <select
            value={quarter}
            onChange={(e) => handleChangeQuarter(e.target.value as Quarter)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
            aria-label="クォーター切替"
          >
            {(["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          {/* Grade */}
          <select
            value={grade}
            onChange={(e) => handleChangeGrade(Number(e.target.value))}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
            aria-label="学年切替"
          >
            {[1, 2, 3, 4].map((g) => (
              <option key={g} value={g}>
                {g} 年
              </option>
            ))}
          </select>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
              {/* Header Row */}
              <div />
              {DAYS.map((d) => (
                <div key={d} className="text-center text-sm font-semibold text-slate-600">
                  {d}
                </div>
              ))}

              {/* Rows */}
              {PERIODS.map((p) => (
                <React.Fragment key={p}>
                  <div className="flex items-center justify-center text-sm font-medium text-slate-600">
                    {p} 限
                  </div>
                  {DAYS.map((d) => {
                    const id = `${d}-${p}` as SlotId;
                    const items = subjectBySlot[id];
                    return (
                      <DroppableCell key={id} id={id}>
                        <div className="flex flex-col gap-2">
                          {items.map((s) => (
                            <SubjectCard key={s.id} subject={s} />
                          ))}
                        </div>
                      </DroppableCell>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Unassigned Pool */}
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-lg font-semibold">未配当</h2>
            <p className="text-sm text-slate-500">（ここにドラッグして戻せます）</p>
          </div>
          <DroppableCell id="pool">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {poolSubjects.map((s) => (
                <SubjectCard key={s.id} subject={s} />
              ))}
            </div>
          </DroppableCell>
        </div>
      </DndContext>
    </div>
  );
}
