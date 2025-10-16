// components/timetable/MatrixBoard.tsx
"use client";
import React from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import TimetableWeek from "@/components/timetable/TimetableWeek";
import DroppableCell from "@/components/timetable/DroppableCell";
import SubjectCard from "@/components/timetable/SubjectCard";
import {
  encodeGlobalLabel,
  isGlobalLabel,
  isLocalLabel,
  // toGlobalFromLocal,
} from "@/lib/idcodec";
import { fetchMatrixData, mergeMatrixData } from "@/lib/matrix";
import {
  clonePlacement,
  addTimeslot,
  moveTimeslot,
  clearAllTimeslots,
} from "@/lib/placement";

// ==== 共有型（TimetableBoard と一致させる）====
export type Grade = 1 | 2 | 3 | 4;                // 1行：学年（1〜4）
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";  // 1行：クォーター
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"; // 1行：曜日
export type SlotLabel = `${DayOfWeek}-${number}`; // 1行：ローカルラベル（例: Wed-3）

export type TimeSlotInfo = { id: number; day: DayOfWeek; period: number; label: string }; // 1行：labelはglobal
export type SubjectCardT = { offeringId: string; code?: string; name: string; units?: number | null }; // 1行：科目カード
export type TimetablePayload = {
  subjects: SubjectCardT[];
  timeSlots: TimeSlotInfo[];               // 1行：globalラベル化済みの配列
  placement: Record<string, number[]>;     // 1行：offeringId -> timeSlotId[]
};

// 盤面ループ用の定数
const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"]; // 1行：行方向（Q）
const GRADES: Grade[] = [1, 2, 3, 4];                 // 1行：列方向（G）
const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri"]; // 1行：表示曜日
const PERIODS = [1, 2, 3, 4, 5, 6];                   // 1行：表示時限

// DragMeta: 1行：ドラッグ中カードの簡易メタ
type DragMeta = { offeringId: string; fromLabel?: string; mode: "move" | "clone" } | null;

export default function MatrixBoard({
  initialYear = 2025,
}: {
  initialYear?: number;
}) {
  const [year, setYear] = React.useState<number>(initialYear);     // 1行：対象年度
  const [poolPos, setPoolPos] = React.useState<"right" | "bottom">("right"); // 1行：プール位置
  const [loading, setLoading] = React.useState(false);             // 1行：ロード中フラグ
  const [saving, setSaving] = React.useState(false);               // 1行：保存中フラグ
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } })); // 1行：DnDセンサ

  // 全体データ（subjects/timeSlots/placement）を親で一元管理
  const [server, setServer] = React.useState<TimetablePayload>({ subjects: [], timeSlots: [], placement: {} }); // 1行：サーバ（基準）
  const [placement, setPlacement] = React.useState<Record<string, number[]>>({});                                // 1行：編集中
  const [history, setHistory] = React.useState<Record<string, number[]>[]>([]);                                  // 1行：Undo用
  const [future, setFuture] = React.useState<Record<string, number[]>[]>([]);                                    // 1行：Redo用
  const [drag, setDrag] = React.useState<DragMeta>(null);                                                        // 1行：ドラッグ状態

  // Ctrl で Clone/Move 切替
  React.useEffect(() => {
    if (!drag) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Control") return;
      setDrag(d => d ? ({ ...d, mode: e.type === "keydown" ? "clone" : "move" }) : d);
      document.body.classList.toggle("cursor-copy", e.type === "keydown");
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      document.body.classList.remove("cursor-copy");
    };
  }, [drag]);

  // byLabel( globalLabel -> id ) / byId( id -> globalLabel )
  const byLabel = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const ts of server.timeSlots) m.set(ts.label, ts.id);
    return m;
  }, [server.timeSlots]);
  const byId = React.useMemo(() => {
    const m = new Map<number, string>();
    for (const ts of server.timeSlots) m.set(ts.id, ts.label);
    return m;
  }, [server.timeSlots]);

  // 初回＆年度変更時に 16 面ぶん取得 → マージ
  const fetchAll = React.useCallback(async (y: number) => {
    setLoading(true);
    try {
      const panels = await fetchMatrixData(QUARTERS, GRADES, y);     // 3行：入=Q配列,G配列,年／出=各面の生データ配列
      const merged = mergeMatrixData(panels);                        // 3行：入=各面データ／出=subjects/timeSlots/placement の統合
      setServer(merged);
      setPlacement(merged.placement);
      setHistory([]);
      setFuture([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void fetchAll(year); }, [year, fetchAll]);

  // Undo/Redo 基本操作
  const pushHistory = (next: Record<string, number[]>) => {
    setHistory(h => [...h, placement]);
    setPlacement(next);
    setFuture([]);
  };
  const undo = () => {
    setHistory(h => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture(f => [placement, ...f]);
      setPlacement(prev);
      return h.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture(f => {
      if (!f.length) return f;
      const nxt = f[0];
      setHistory(h => [...h, placement]);
      setPlacement(nxt);
      return f.slice(1);
    });
  };

  // DnD: start
  const onDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    if (activeId.includes("@@")) {
      const [offeringId, fromLabel] = activeId.split("@@");
      setDrag({ offeringId, fromLabel, mode: "move" });
    } else {
      setDrag({ offeringId: activeId, fromLabel: undefined, mode: "move" });
    }
  };

  // DnD: end（global/local を受け入れ、内部は global に統一）
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDrag(null);
    document.body.classList.remove("cursor-copy");
    if (!over) return;

    const overId = String(over.id);     // "pool" or global/local label
    const activeId = String(active.id); // "offeringId" or "offeringId@@<label>"

    // 1) pool
    if (overId === "pool") {
      if (drag?.mode !== "clone") {
        const offeringId = activeId.includes("@@") ? activeId.split("@@")[0] : activeId;
        pushHistory(clearAllTimeslots(placement, offeringId));
      }
      return;
    }

    // 2) セル（global/local）
    const toKey = isGlobalLabel(overId)
      ? overId
      : isLocalLabel(overId)
        ? (() => { throw new Error("local label is not expected in MatrixBoard"); })()
        : null;
    if (!toKey) return;
    const toId = byLabel.get(toKey);
    if (toId == null) return;

    // 2-1) 既存 meeting（セル上のカード）をドラッグ
    if (activeId.includes("@@")) {
      const [offeringId, fromLabelRaw] = activeId.split("@@");
      const fromKey = isGlobalLabel(fromLabelRaw) ? fromLabelRaw : null;
      if (!fromKey) return;
      const fromId = byLabel.get(fromKey);
      if (fromId == null) return;

      if (drag?.mode === "clone") {
        pushHistory(addTimeslot(placement, offeringId, toId));
      } else {
        pushHistory(moveTimeslot(placement, offeringId, fromId, toId));
      }
      return;
    }

    // 2-2) pool から新規
    pushHistory(addTimeslot(placement, activeId, toId));
  };

  // 表示用: globalLabel -> offeringId[]
  const byLabelOfferings = React.useMemo(() => {
    const map = new Map<string, string[]>();
    for (const ts of server.timeSlots) map.set(ts.label, []);
    for (const [offeringId, ids] of Object.entries(placement)) {
      for (const id of ids) {
        const label = byId.get(id);
        if (label) map.get(label)!.push(offeringId);
      }
    }
    return map;
  }, [placement, byId, server.timeSlots]);

  // subjectMap: offeringId(number) -> Subject
  const subjectMap = React.useMemo(() => {
    const m = new Map<number, SubjectCardT>();
    for (const s of server.subjects) m.set(Number(s.offeringId), s);
    return m;
  }, [server.subjects]);

  // 未配当（全体基準）
  const poolOfferings = React.useMemo(
    () => server.subjects.filter((s) => (placement[s.offeringId] ?? []).length === 0),
    [server.subjects, placement]
  );

  const dirty = React.useMemo(
    () => JSON.stringify(server.placement) !== JSON.stringify(placement),
    [server.placement, placement]
  );

  // セル削除（globalLabel を受ける）
  const onRemoveInCell = (offeringId: string, globalLabel: string) => {
    const tsId = byLabel.get(globalLabel);
    if (tsId == null) return;
    const next = clonePlacement(placement);
    next[offeringId] = (next[offeringId] ?? []).filter((id) => id !== tsId);
    pushHistory(next);
  };

  // 保存（丸ごと保存：必要ならAPIを /timetable/save-matrix に変更）
  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("https://acsl-hp.vercel.app/api/timetable/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ placement, year }), // 3行：入=全体のplacement & year／出=200想定（サーバ側調整可）
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setServer((p) => ({ ...p, placement }));
      setHistory([]);
      setFuture([]);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] p-6">
      {/* ヘッダ */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">時間割（4×4 マトリクス）</h1>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="年度 (例: 2025)"
            className="w-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <div className="ml-2 flex items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-40"
            >
              Redo
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-40"
            >
              {saving ? "保存中..." : "保存"}
            </button>
            <div className="ml-3 flex items-center gap-2 text-sm">
              <label className="font-medium">プール位置</label>
              <select
                value={poolPos}
                onChange={(e) => setPoolPos(e.target.value as "right" | "bottom")}
                className="rounded-xl border border-slate-300 bg-white px-2 py-1 shadow-sm"
              >
                <option value="right">右固定</option>
                <option value="bottom">下固定</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">読み込み中...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <DragOverlay>
            {drag && (
              <div className="rounded-xl border bg-white px-3 py-2 text-sm shadow">
                <span>Subject #{drag.offeringId}</span>
                <span className="ml-2 text-xs opacity-70">[{drag.mode.toUpperCase()}]</span>
              </div>
            )}
          </DragOverlay>

          {/* レイアウト：左=4×4 盤面（scroll-snap）、右 or 下=未配当プール（sticky） */}
          <div className={poolPos === "right" ? "grid grid-cols-[1fr_360px] gap-4" : "grid grid-rows-[1fr_auto] gap-4"}>
            {/* 左・上：4×4 盤面 */}
            <div className="overflow-auto snap-both snap-mandatory rounded-2xl border border-slate-200 p-3">
              <div className="grid grid-rows-4 grid-cols-4 gap-4 min-w-[1200px] min-h-[800px]">
                {QUARTERS.map((q) =>
                  GRADES.map((g) => (
                    <div key={`${q}-${g}`} className="snap-start">
                      <TimetableWeek
                        title={`${year} / ${q} / ${g}年`}
                        days={DAYS}
                        periods={PERIODS}
                        getOfferingIds={(globalLabel) => byLabelOfferings.get(globalLabel) ?? []}
                        subjectMap={subjectMap}
                        drag={drag}
                        onRemoveInCell={onRemoveInCell}
                        makeLabel={(d, p) => encodeGlobalLabel(q, g, d, p)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 右 or 下：未配当プール（sticky） */}
            <div className={poolPos === "right" ? "sticky top-3 h-[calc(100vh-120px)] overflow-auto" : ""}>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">未配当（全体）</h2>
                  <p className="text-sm text-slate-500">プールから盤面へドラッグ</p>
                </div>
                <DroppableCell id="pool">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {poolOfferings.map((s) => (
                      <SubjectCard key={s.offeringId} subject={s} />
                    ))}
                  </div>
                </DroppableCell>
              </div>
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
}
