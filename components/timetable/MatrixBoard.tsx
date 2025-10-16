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
import { Search } from "lucide-react";  // 検索アイコン
import { cn } from "@/lib/utils";        // Tailwind クラス結合ヘルパ（なければ手動でOK）

// equalsPlacement: 入=a,b／出=配置が完全一致するか（順不同の配列にも対応）
const equalsPlacement = (a: Record<string, number[]>, b: Record<string, number[]>) => {
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length) return false;
  for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return false;
  for (const k of ak) {
    const av = (a[k] ?? []).slice().sort((x, y) => x - y);
    const bv = (b[k] ?? []).slice().sort((x, y) => x - y);
    if (av.length !== bv.length) return false;
    for (let i = 0; i < av.length; i++) if (av[i] !== bv[i]) return false;
  }
  return true;
};

// HISTORY_LIMIT: 1行：履歴の最大保持件数（メモリ対策）
const HISTORY_LIMIT = 100;


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
  const canUndo = history.length > 0;
  const canRedo = future.length > 0;
  const [drag, setDrag] = React.useState<DragMeta>(null);                                                        // 1行：ドラッグ状態
  const dragging = !!drag; // 1行：ドラッグ中フラグ


  // === スクロール＆ナビ状態 ===
  const containerRef = React.useRef<HTMLDivElement | null>(null); // 1行：盤面のスクロール容器
  const panelRefs = React.useRef<Record<string, HTMLDivElement | null>>({}); // 1行：各パネルの参照(Q|Gキー)
  const [curQ, setCurQ] = React.useState<number>(0); // 1行：現在のクォーター行インデックス(0-3)
  const [curG, setCurG] = React.useState<number>(0); // 1行：現在の学年列インデックス(0-3)

  // keyFrom: 入=q,g／出="Q? - G?" のユニークキー（refs とナビ表示に使用）
  const keyFrom = (q: Quarter, g: Grade) => `${q}-${g}`;

  // indexFrom: 入=q(Quarter)／出=行インデックス(0..3)
  const indexFromQ = (q: Quarter) => QUARTERS.indexOf(q);
  // indexFrom: 入=g(Grade)／出=列インデックス(0..3)
  const indexFromG = (g: Grade) => GRADES.indexOf(g);

  // scrollToPanel: 入=行idx,列idx／出=なし。該当パネルへ滑らかにスクロール
  const scrollToPanel = React.useCallback((qi: number, gi: number) => {
    const q = QUARTERS[Math.max(0, Math.min(3, qi))];
    const g = GRADES[Math.max(0, Math.min(3, gi))];
    const k = keyFrom(q, g);
    const node = panelRefs.current[k];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, []);

  // === プール検索・フィルタ ===
  const [search, setSearch] = React.useState("");          // 検索語
  const [filterGrade, setFilterGrade] = React.useState<Grade | "all">("all");
  const [filterQuarter, setFilterQuarter] = React.useState<Quarter | "all">("all");

  // IntersectionObserver: 一番見えているパネルを現在位置として記録
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const entriesMap = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const k = (e.target as HTMLElement).dataset.key;
          if (!k) return;
          entriesMap.set(k, e.intersectionRatio);

        });
        // 最大の可視率のパネルを現在位置に
        let bestKey = "";
        let bestRatio = -1;
        entriesMap.forEach((r, k) => {
          if (r > bestRatio) { bestRatio = r; bestKey = k; }

        });
        if (bestKey) {
          const [qStr, gStr] = bestKey.split("-");
          const qi = indexFromQ(qStr as Quarter);
          const gi = indexFromG(Number(gStr) as Grade);
          if (qi !== -1 && gi !== -1) { setCurQ(qi); setCurG(gi); }

        }

      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    // 監視開始
    QUARTERS.forEach((q) => {
      GRADES.forEach((g) => {
        const k = keyFrom(q, g);
        const node = panelRefs.current[k];
        if (node) io.observe(node);

      });

    });
    return () => io.disconnect();

  }, [server.timeSlots]); // 盤面リビルド後に張り直す

  // Shift+矢印で盤面単位ジャンプ
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") scrollToPanel(curQ, Math.max(0, curG - 1));
      if (e.key === "ArrowRight") scrollToPanel(curQ, Math.min(3, curG + 1));
      if (e.key === "ArrowUp") scrollToPanel(Math.max(0, curQ - 1), curG);
      if (e.key === "ArrowDown") scrollToPanel(Math.min(3, curQ + 1), curG);

    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);

  }, [curQ, curG, scrollToPanel]);


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

  const undo = React.useCallback(() => {
    setHistory(h => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture(f => [placement, ...f]);
      if (!equalsPlacement(placement, prev)) setPlacement(prev);  // 無駄なset防止
      return h.slice(0, -1);
    });
  }, [placement]);
  const redo = React.useCallback(() => {
    setFuture(f => {
      if (!f.length) return f;
      const nxt = f[0];
      setHistory(h => {
        const appended = [...h, placement];
        if (appended.length > HISTORY_LIMIT) appended.shift();
        return appended;
      });
      if (!equalsPlacement(placement, nxt)) setPlacement(nxt);
      return f.slice(1);
    });
  }, [placement]);
  // Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;        // mac対策: Cmd
      if (!ctrl) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); if (canUndo) undo(); }
      else if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") {
        e.preventDefault(); if (canRedo) redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canUndo, canRedo, undo, redo]);
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
  // pushHistory: 入=次配置／出=なし。差分がなければ積まない・上限管理。
  const pushHistory = (next: Record<string, number[]>) => {
    if (equalsPlacement(placement, next)) return;                 // 変化なしを弾く
    setHistory(h => {
      const appended = [...h, placement];
      if (appended.length > HISTORY_LIMIT) appended.shift();      // 上限管理
      return appended;
    });
    setPlacement(next);
    setFuture([]);                                                // 新分岐
  };
  // resetToServer: 入=なし／出=なし。サーバ状態へ巻き戻し（未保存破棄）
  const resetToServer = () => {
    if (equalsPlacement(placement, server.placement)) return;
    setPlacement(server.placement);
    setHistory([]);
    setFuture([]);
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

  // filteredPool: 入=全subjects／出=検索・フィルタ後の配列
  const filteredPool = React.useMemo(() => {
    return poolOfferings.filter((s) => {
      const matchText =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.code ?? "").toLowerCase().includes(search.toLowerCase());
      const matchGrade = filterGrade === "all" || s.code?.includes(`G${filterGrade}`) || true; // ★必要ならDB上の属性に変更
      const matchQuarter = filterQuarter === "all" || s.code?.includes(filterQuarter) || true;
      return matchText && matchGrade && matchQuarter;

    });
  }, [poolOfferings, search, filterGrade, filterQuarter]);

  const dirty = React.useMemo(
    () => JSON.stringify(server.placement) !== JSON.stringify(placement),
    [server.placement, placement]
  );
  // 未保存で離脱しそうなときに警告
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = ""; // 一部ブラウザ仕様
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
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
              disabled={!canUndo}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-40"
            >
              Redo
            </button>
            <button
              type="button"
              onClick={resetToServer}
              disabled={!dirty}
              className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm text-rose-600 disabled:opacity-40"
              title="未保存の変更を破棄してサーバ状態に戻す"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={save}
              disabled={dragging || !dirty || saving}
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-40"
            >
              {saving ? "保存中..." : "保存"}
            </button>
            <button
              type="button"
              onClick={() => setPoolPos(poolPos === "right" ? "bottom" : "right")}
              className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
              title={`プール位置切替 (${poolPos === "right" ? "右→下" : "下→右"})`}
            >
              {poolPos === "right" ? (
                <>
                  <span>📥</span>
                  <span>右固定</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>下固定</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* ミニマップ：現在位置を可視化しクリックでジャンプ */}
      <div className="mb-3 flex items-center gap-3">
        <div className="text-sm font-medium">ナビ</div>
        <div className="grid grid-rows-4 grid-cols-4 gap-1">
          {QUARTERS.map((q, qi) =>
            GRADES.map((g, gi) => (
              <button
                key={`nav-${q}-${g}`}
                onClick={() => scrollToPanel(qi, gi)}
                className={`h-7 w-10 rounded-md text-xs font-medium transition
                ${qi === curQ && gi === curG ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
                title={`${q} / ${g}年`}
              >
                {q}-{g}
              </button>
            ))
          )}
        </div>
        <div className="text-xs text-slate-500">Shift+矢印で移動</div>
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
            <div ref={containerRef} className="overflow-auto snap-both snap-mandatory scroll-smooth rounded-2xl border border-slate-200 p-3">
              <div className="grid grid-rows-4 grid-cols-4 gap-4 min-w-[1200px] min-h-[800px]">
                {QUARTERS.map((q) =>
                  GRADES.map((g) => (
                    <div
                      key={`${q}-${g}`}
                      data-key={keyFrom(q, g)}
                      ref={(el) => { (panelRefs.current[keyFrom(q, g)] = el) }}
                      className={`snap-start transition-colors ${curQ === indexFromQ(q) && curG === indexFromG(g)
                        ? "outline outline-blue-400 outline-offset-2 rounded-2xl"
                        : ""
                        }`}
                    >
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
            <div
              className={cn(
                poolPos === "right"
                  ? "sticky top-3 h-[calc(100vh-120px)] overflow-auto transition-all duration-300"
                  : "overflow-auto border-t border-slate-200 pt-3 transition-all duration-300"
              )}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">未配当科目プール</h2>
                    <span className="text-xs text-slate-400">（全学年共通）</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="科目名・コード検索"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  <div className="flex gap-2 text-sm">
                    <select
                      value={filterGrade}
                      onChange={(e) => setFilterGrade(e.target.value as Grade | "all")}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1"
                    >
                      <option value="all">全学年</option>
                      {[1, 2, 3, 4].map((g) => (
                        <option key={g} value={g}>
                          {g}年
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterQuarter}
                      onChange={(e) => setFilterQuarter(e.target.value as Quarter | "all")}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1"
                    >
                      <option value="all">全Q</option>
                      {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DroppableCell id="pool">
                  {filteredPool.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-400">該当科目がありません</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {filteredPool.map((s) => (
                        <SubjectCard key={s.offeringId} subject={s} />
                      ))}
                    </div>
                  )}
                </DroppableCell>
              </div>
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
}
