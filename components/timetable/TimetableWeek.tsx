// components/timetable/TimetableWeek.tsx
"use client";
import React from "react";
import DroppableCell, { SubjectCardInCell } from "@/components/timetable/DroppableCell";
import type {
  DayOfWeek,
  SubjectCardT,
  SlotLabel,
} from "@/components/timetable/TimetableBoard";

// DragMeta: 1行：親が管理するドラッグ状態の薄い型
type DragMeta = { offeringId: string; fromLabel?: string; mode: "move" | "clone" } | null;

type Props = {
  // title: 1行：盤面タイトル（例：2025 / Q1 / 1年）
  title?: string;

  // days: 1行：横軸の曜日配列（例：["Mon","Tue",...])
  days: DayOfWeek[];

  // periods: 1行：縦軸の時限配列（例：[1,2,3,4,5,6]）
  periods: number[];

  // getOfferingIds: 3行：入=SlotLabel／出=そのセルに配置された offeringId 群。親の計算結果を参照。
  getOfferingIds: (label: SlotLabel) => string[];

  // subjectMap: 1行：offeringId(number) -> Subject データ
  subjectMap: Map<number, SubjectCardT>;

  // drag: 1行：ドラッグ中カードの可視制御に使用（元セルを一時非表示）
  drag: DragMeta;

  // onRemoveInCell: 3行：入=offeringId, slotLabel／出=なし。セル内バッジの×押下で meeting を除去。
  onRemoveInCell: (offeringId: string, slotLabel: SlotLabel) => void;
};

export default function TimetableWeek({
  title,
  days,
  periods,
  getOfferingIds,
  subjectMap,
  drag,
  onRemoveInCell,
}: Props) {
  return (
    <div className="min-w-[900px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {title ? (
        <div className="mb-3 text-sm font-semibold text-slate-600">{title}</div>
      ) : null}

      <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
        {/* 列ヘッダ（曜日） */}
        <div />
        {days.map((d) => (
          <div key={d} className="text-center text-sm font-semibold text-slate-600">
            {d}
          </div>
        ))}

        {/* 本体マス */}
        {periods.map((p) => (
          <React.Fragment key={p}>
            <div className="flex items-center justify-center text-sm font-medium text-slate-600">
              {p} 限
            </div>
            {days.map((d) => {
              const label = `${d}-${p}` as SlotLabel;
              const offeringIds = getOfferingIds(label) ?? [];

              return (
                <DroppableCell key={label} id={label}>
                  <div className="flex flex-col gap-2">
                    {offeringIds.map((oid) => {
                      const subj = subjectMap.get(Number(oid));
                      if (!subj) return null;

                      // hide: 1行：ドラッグ中の元セルではカードを一時非表示
                      const hide =
                        drag &&
                        drag.mode === "move" &&
                        drag.fromLabel === label &&
                        drag.offeringId === String(oid);

                      if (hide) return null;

                      return (
                        <SubjectCardInCell
                          key={`${oid}@@${label}`}
                          subject={subj}
                          slotId={label}
                          onRemove={onRemoveInCell}
                        />
                      );
                    })}
                  </div>
                </DroppableCell>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
