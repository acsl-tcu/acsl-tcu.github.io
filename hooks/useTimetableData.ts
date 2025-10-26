"use client";
import React from "react";
import { TimetablePayload, SubjectCardT, Grade, Quarter } from "@/lib/types/timetable";
import { fetchMatrixData, mergeMatrixData } from "@/lib/matrix";
import { makeById, makeByLabel } from "@/lib/selectors/timetable";
import { addTimeslot, moveTimeslot, clearAllTimeslots } from "@/lib/placement";
import { computePlacementDiff } from "@/lib/diff";

export function useTimetableData(initialYear: number) {
  const [year, setYear] = React.useState<number>(initialYear);            // 1行：年度
  const [server, setServer] = React.useState<TimetablePayload>({ subjects: [], timeSlots: [], placement: {} }); // 1行：サーバ基準
  const [placement, setPlacement] = React.useState<Record<string, number[]>>({}); // 1行：編集中
  const [history, setHistory] = React.useState<Record<string, number[]>[]>([]);   // 1行：Undo
  const [future, setFuture] = React.useState<Record<string, number[]>[]>([]);     // 1行：Redo
  const [loading, setLoading] = React.useState(false);                    // 1行：ロード状態
  const [saving, setSaving] = React.useState(false);                      // 1行：保存状態

  const canUndo = history.length > 0, canRedo = future.length > 0;        // 1行：可否

  // 取得（16面→マージ）
  const fetchAll = React.useCallback(async (quarters: Quarter[], grades: Grade[], y: number) => {
    setLoading(true);
    try {
      const panels = await fetchMatrixData(quarters, grades, y);
      console.log("Panels: ", panels)
      const merged = mergeMatrixData(panels);
      console.log("Merged:", merged);
      setServer(merged);
      setPlacement(merged.placement);
      setHistory([]);
      setFuture([]);
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { /* 呼出側が fetchAll を叩く */ }, []);

  // セレクタ系（Map生成）
  const byLabel = React.useMemo(() => makeByLabel(server), [server]);
  const byId = React.useMemo(() => makeById(server), [server]);

  // 履歴操作
  const pushHistory = React.useCallback((next: Record<string, number[]>) => {
    // console.log("pushHistroy:",next)
    if (JSON.stringify(placement) === JSON.stringify(next)) return;
    setHistory(h => [...h, placement]);
    console.log("pushHistroy[after]:", next, '[before]', placement)
    setPlacement(next);
    setFuture([]);
  }, [placement]);
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
  const resetToServer = () => {
    setPlacement(server.placement);
    setHistory([]); setFuture([]);
  };

  // DnDオペ
  const ops = React.useMemo(() => ({
    add: (offeringId: string, toId: number) => pushHistory(addTimeslot(placement, offeringId, toId)),
    move: (offeringId: string, fromId: number, toId: number) => pushHistory(moveTimeslot(placement, offeringId, fromId, toId)),
    clearAll: (offeringId: string) => pushHistory(clearAllTimeslots(placement, offeringId)),
  }), [placement, pushHistory]);

  // 保存（差分or丸ごと）
  const save = async () => {
    setSaving(true);
    try {
      const diff = computePlacementDiff(server.placement, placement);
      const SMALL = 40;
      if (diff.total > 0 && diff.total <= SMALL) {
        const res = await fetch("https://acsl-hp.vercel.app/api/timetable/patch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ add: diff.add, remove: diff.remove, year }),
        });
        if (!res.ok) throw new Error("patch failed");
      } else {
        const res = await fetch("https://acsl-hp.vercel.app/api/timetable/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ placement, year }),
        });
        if (!res.ok) throw new Error("save failed");
      }
      setServer((p) => ({ ...p, placement }));
      setHistory([]); setFuture([]);
    } finally { setSaving(false); }
  };

  const dirty = React.useMemo(() => JSON.stringify(server.placement) !== JSON.stringify(placement), [server.placement, placement]);

  // subjectMap / pool
  const subjectMap = React.useMemo(() => {
    const m = new Map<number, SubjectCardT>();
    for (const s of server.subjects) m.set(Number(s.offeringId), s);
    return m;
  }, [server.subjects]);

  const poolOfferings = React.useMemo(
    () => server.subjects.filter((s) => (placement[s.offeringId] ?? []).length === 0),
    [server.subjects, placement]
  );

  return {
    year, setYear,
    server, placement, setPlacement,
    byLabel, byId,
    loading, saving, save,
    history, future, canUndo, canRedo, undo, redo, resetToServer,
    fetchAll,
    subjectMap, poolOfferings,
    dirty,
    ops,
  };
}
