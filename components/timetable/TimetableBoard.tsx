// =============================================
// 4) components/timetable/TimetableBoard.tsx  — UI: label 表示・id 内部、Undo/Redo＋保存
// =============================================
"use client";
import React from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import DroppableCell, { SubjectCardInCell } from "@/components/timetable/DroppableCell";
import SubjectCard from "@/components/timetable/SubjectCard";


// 型はこのファイル内にも定義（lib/types と一致させる）
export type Grade = 1 | 2 | 3 | 4;
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type SlotLabel = `${DayOfWeek}-${number}`;

export type TimeSlotInfo = { id: number; day: DayOfWeek; period: number; label: SlotLabel };
export type SubjectCardT = { offeringId: string; code?: string; name: string; units?: number | null };
export type TimetablePayload = {
  subjects: SubjectCardT[];
  timeSlots: TimeSlotInfo[];
  placement: Record<string, number[]>; // offeringId -> timeSlotId[]
};

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PERIODS = [1, 2, 3, 4, 5, 6];

function clonePlacement(src: Record<string, number[]>): Record<string, number[]> {
  const dst: Record<string, number[]> = {};
  for (const k of Object.keys(src)) dst[k] = [...src[k]];
  return dst;
}

export default function TimetableBoard({
  initialGrade = 1,
  initialQuarter = "Q1",
  initialYear = 2025,
}: {
  initialGrade?: Grade;
  initialQuarter?: Quarter;
  initialYear?: number;
}) {
  const [grade, setGrade] = React.useState<Grade>(initialGrade);
  const [quarter, setQuarter] = React.useState<Quarter>(initialQuarter);
  const [year, setYear] = React.useState<number | undefined>(initialYear);

  const [server, setServer] = React.useState<TimetablePayload>({ subjects: [], timeSlots: [], placement: {} });
  const [placement, setPlacement] = React.useState<Record<string, number[]>>({});
  const [history, setHistory] = React.useState<Record<string, number[]>[]>([]);
  const [future, setFuture] = React.useState<Record<string, number[]>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // label <-> id 変換マップ
  const byLabel = React.useMemo(() => {
    const m = new Map<SlotLabel, number>();
    for (const ts of server.timeSlots) m.set(ts.label, ts.id);
    return m;
  }, [server.timeSlots]);
  const byId = React.useMemo(() => {
    const m = new Map<number, SlotLabel>();
    for (const ts of server.timeSlots) m.set(ts.id, ts.label);
    return m;
  }, [server.timeSlots]);

  const fetchData = React.useCallback(async (g: Grade, q: Quarter, y?: number) => {
    setLoading(true);
    const params = new URLSearchParams({ grade: String(g), quarter: q });
    if (y) params.set("year", String(y));

    //const res = await 
    fetch(`https://acsl-hp.vercel.app/api/timetable?${params.toString()}`, {
      method: 'GET',
      credentials: 'include', // ← 認証用Cookie を送るのに必要      
      cache: "no-store"
    }).then((res) => {
      if (!res.ok) throw new Error('認証エラーまたはデータ取得エラー');
      return res.json();
      //return (await res.json()) as TimetablePayload;
    })
      .then((data) => {
        console.log(data);
        setServer(data);
        setPlacement(data.placement);
        setHistory([]);
        setFuture([]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        // window.location.href = '/Login?redirect=/MSE/Timetable';
      });
  }, []);

  React.useEffect(() => { void fetchData(grade, quarter, year); }, [grade, quarter, year, fetchData]);

  const pushHistory = (next: Record<string, number[]>) => {
    setHistory((h) => [...h, placement]);
    setPlacement(next);
    setFuture([]);
  };
  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [placement, ...f]);
      setPlacement(prev);
      return h.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const nxt = f[0];
      setHistory((h) => [...h, placement]);
      setPlacement(nxt);
      return f.slice(1);
    });
  };

  // DnD:
  // - pool <- offeringId: 全 meeting 削除（空配列）
  // - slotLabel <- offeringId: その slotId を追加
  // - pool/slotLabel <- `${offeringId}@@${slotId}`: その meeting を移動/削除
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    const activeId = String(active.id);

    const next = clonePlacement(placement);

    if (activeId.includes("@@")) {
      const [offeringId, fromIdStr] = activeId.split("@@");
      const fromId = Number(fromIdStr);
      if (overId === "pool") {
        next[offeringId] = (next[offeringId] ?? []).filter((id) => id !== fromId);
      } else if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-\d+$/.test(overId)) {
        const toId = byLabel.get(overId as SlotLabel);
        if (toId != null) {
          next[offeringId] = (next[offeringId] ?? []).filter((id) => id !== fromId);
          if (!next[offeringId].includes(toId)) next[offeringId].push(toId);
        }
      }
      pushHistory(next);
      return;
    }

    // 新規（pool の offeringId カード）
    const offeringId = activeId;
    if (overId === "pool") {
      next[offeringId] = [];
      pushHistory(next);
      return;
    }
    if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-\d+$/.test(overId)) {
      const toId = byLabel.get(overId as SlotLabel);
      if (toId != null) {
        const arr = next[offeringId] ?? [];
        if (!arr.includes(toId)) arr.push(toId);
        next[offeringId] = arr;
        pushHistory(next);
      }
    }
  };

  const onRemoveInCell = (offeringId: string, slotLabel: SlotLabel) => {
    const tsId = byLabel.get(slotLabel);
    if (tsId == null) return;
    const next = clonePlacement(placement);
    next[offeringId] = (next[offeringId] ?? []).filter((id) => id !== tsId);
    pushHistory(next);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/timetable/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placement, grade, quarter, year }),
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

  // 表示用: label -> offeringId[]
  const byLabelOfferings = React.useMemo(() => {
    const map = new Map<SlotLabel, string[]>();
    for (const day of DAYS) for (const p of PERIODS) map.set(`${day}-${p}` as SlotLabel, []);
    for (const [offeringId, ids] of Object.entries(placement)) {
      for (const id of ids) {
        const label = byId.get(id);
        if (label) map.get(label)!.push(offeringId);
      }
    }
    console.log("byLabelOfferings:", map);
    return map;
  }, [placement, byId]);

  const subjectMap = React.useMemo(() => {
    const m = new Map<string, SubjectCardT>();
    for (const s of server.subjects) m.set(s.offeringId, s);
    console.log("subjectMap:", m, server);
    return m;
  }, [server.subjects]);

  const poolOfferings = React.useMemo(
    () => server.subjects.filter((s) => (placement[s.offeringId] ?? []).length === 0),
    [server.subjects, placement]
  );

  const dirty = React.useMemo(
    () => JSON.stringify(server.placement) !== JSON.stringify(placement),
    [server.placement, placement]
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">時間割（週次）</h1>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="年度 (例: 2025)"
            className="w-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
            value={year ?? ""}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
          />
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value as Quarter)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
            aria-label="クォーター切替"
          >
            {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value) as Grade)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
            aria-label="学年切替"
          >
            {[1, 2, 3, 4].map((g) => (
              <option key={g} value={g}>
                {g} 年
              </option>
            ))}
          </select>
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
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">読み込み中...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <div className="overflow-x-auto">
            <div className="min-w-[900px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
                <div />
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-sm font-semibold text-slate-600">
                    {d}
                  </div>
                ))}

                {PERIODS.map((p) => (
                  <React.Fragment key={p}>
                    <div className="flex items-center justify-center text-sm font-medium text-slate-600">
                      {p} 限
                    </div>
                    {DAYS.map((d) => {
                      const label = `${d}-${p}` as SlotLabel;
                      const offeringIds = byLabelOfferings.get(label) ?? [];
                      console.log("inTable:", { label, offeringIds });
                      return (
                        <DroppableCell key={label} id={label}>
                          <div className="flex flex-col gap-2">
                            {offeringIds.map((oid) => {
                              const subj = subjectMap.get(oid);
                              console.log("renderCard:", { oid, subj });
                              if (!subj) return null;
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
          </div>

          {/* 未配当（Meeting の無い Offering） */}
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-lg font-semibold">未配当（Meetingなしの Offering）</h2>
              <p className="text-sm text-slate-500">ここにあるカードをコマへドラッグで追加</p>
            </div>
            <DroppableCell id="pool">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {poolOfferings.map((s) => (
                  <SubjectCard key={s.offeringId} subject={s} />
                ))}
              </div>
            </DroppableCell>
          </div>
        </DndContext>
      )}
    </div>
  );
}
