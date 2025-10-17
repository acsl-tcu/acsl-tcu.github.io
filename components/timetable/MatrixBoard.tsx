"use client";
import React from "react";
import TimetableWeek from "@/components/timetable/TimetableWeek";
// import TimetableWeek from "@/components/timetable/LazyTimetableWeek";
import DroppableCell from "@/components/timetable/DroppableCell";
import SubjectCard from "@/components/timetable/SubjectCard";
import { QUARTERS, GRADES, Quarter, Grade } from "@/lib/types/timetable";
import { encodeGlobalLabel, isGlobalLabel } from "@/lib/idcodec";
import { useTimetableData } from "@/hooks/useTimetableData";
import { useMatrixNavigation } from "@/hooks/useMatrixNavigation";
import { labelOfferings } from "@/lib/selectors/timetable";
import { DndContext, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { clonePlacement } from "@/lib/placement";
// import { off } from "process";

type DragMeta = { offeringId: string; fromLabel?: string; mode: "move" | "clone" } | null; // 1行：ドラッグ状態

export default function MatrixBoard({ initialYear = 2025 }: { initialYear?: number }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [poolPos, setPoolPos] = React.useState<"right" | "bottom">("right");
  const [drag, setDrag] = React.useState<DragMeta>(null);
  const dragging = !!drag;

  // データ（取得・保存・Undo/Redoなど）
  const {
    year, setYear, server, placement, setPlacement,
    byLabel, byId,
    loading, saving, save,
    canUndo, canRedo, undo, redo, resetToServer,
    fetchAll,
    subjectMap, poolOfferings,
    dirty, ops
  } = useTimetableData(initialYear);
  console.log("server: ", server);
  // 初回取得
  React.useEffect(() => { fetchAll(QUARTERS, GRADES, year); }, [year, fetchAll]);

  // ナビ・仮想化
  const { containerRef, panelRefs, keyFrom, qiOf, giOf, curQ, curG, scrollToPanel, shouldRender } = useMatrixNavigation();
  console.log("qi gi of:", qiOf, giOf);
  // CtrlでClone/Move
  React.useEffect(() => {
    if (!drag) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Control") return;
      setDrag(d => d ? ({ ...d, mode: e.type === "keydown" ? "clone" : "move" }) : d);
      document.body.classList.toggle("cursor-copy", e.type === "keydown");
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); document.body.classList.remove("cursor-copy"); };
  }, [drag]);

  // DnD
  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    if (id.includes("@@")) {
      const [offeringId, fromLabel] = id.split("@@");
      console.log("onDragStart:", offeringId, fromLabel, id);
      setDrag({ offeringId, fromLabel, mode: "move" });
    } else setDrag({ offeringId: id, fromLabel: undefined, mode: "move" });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    setDrag(null);
    document.body.classList.remove("cursor-copy");
    if (!over) return;

    const overId = String(over.id);
    const activeId = String(active.id);
    if (overId === "pool") {
      if (drag?.mode !== "clone") {
        const offeringId = activeId.includes("@@") ? activeId.split("@@")[0] : activeId;
        ops.clearAll(offeringId);
      }
      return;
    }
    // console.log(isGlobalLabel(overId),byLabel);
    if (!isGlobalLabel(overId)) return;
    const to = byLabel.get(overId);
    console.log('[onDragEnd]', { active: e.active.id, over: e.over?.id }, to);
    if (to == null) return;
    if (activeId.includes("@@")) {// offeringId@@SlotLabel
      const [offeringId, fromLabel] = activeId.split("@@");
      if (!isGlobalLabel(fromLabel)) return;
      const from = byLabel.get(fromLabel);
      if (from == null) return;

      if (drag?.mode === "clone") {
        ops.add(offeringId, to)
      } else {
        ops.move(offeringId, from, to);
      }
    } else {
      ops.add(activeId, to);
    }
  };

  // byLabelOfferings を“今レンダーするパネルだけ”都度生成（安価）
  const getOfferingIds = React.useCallback((q: Quarter, g: Grade) => {
    const map = labelOfferings(placement, byId, q, g);
    return (label: string) => map.get(label) ?? [];
  }, [placement, byId]);

  // レイアウト用
  const TTW_W = 900;  // TimetableWeek の実寸幅（既存プレースホルダに合わせる）
  const TTW_H = 520;  // TimetableWeek の実寸高
  // フォーカス中セルを中央にスクロール
  React.useEffect(() => {
    const k = keyFrom(QUARTERS[curQ], GRADES[curG]);
    const el = panelRefs.current[k];
    if (el && containerRef.current) {
      // 両軸とも中央へ
      el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    }
  }, [curQ, curG]); // 既存の curQ, curG を依存に


  return (
    <div className="mx-auto max-w-[1400px] p-6">
      {/* ヘッダ */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">時間割（4×4 マトリクス）</h1>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="年度 (例: 2025)" className="w-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          <div className="ml-2 flex items-center gap-2">
            <button onClick={undo} disabled={!canUndo} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-40">Undo</button>
            <button onClick={redo} disabled={!canRedo} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-40">Redo</button>
            <button onClick={resetToServer} disabled={!dirty} className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm text-rose-600 disabled:opacity-40">Reset</button>
            <button onClick={save} disabled={dragging || !dirty || saving} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-40">{saving ? "保存中..." : "保存"}</button>
            <button type="button" onClick={() => setPoolPos(poolPos === "right" ? "bottom" : "right")} className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50">
              {poolPos === "right" ? (<><span>📥</span><span>右固定</span></>) : (<><span>📤</span><span>下固定</span></>)}
            </button>
          </div>
        </div>
      </div>

      {/* ミニマップ */}
      <div className="mb-3 flex items-center gap-3">
        <div className="text-sm font-medium">ナビ</div>
        <div className="grid grid-rows-4 grid-cols-4 gap-1">
          {QUARTERS.map((q, qi) => GRADES.map((g, gi) => (
            <button key={`nav-${q}-${g}`} onClick={() => scrollToPanel(qi, gi)} className={`h-7 w-10 rounded-md text-xs font-medium transition ${qi === curQ && gi === curG ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`} title={`${q} / ${g}年`}>{q}-{g}</button>
          )))}
        </div>
        <div className="text-xs text-slate-500">Shift+矢印で移動</div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">読み込み中...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <DragOverlay>
            {drag && (
              <div className="rounded-xl border bg-white px-3 py-2 text-sm shadow">
                <span>Subject #{drag.offeringId}</span>
                <span className="ml-2 text-xs opacity-70">[{drag.mode.toUpperCase()}]</span>
              </div>
            )}
          </DragOverlay>

          {/* レイアウト */}
          <div className={poolPos === "right" ? "grid grid-cols-[1fr_360px] gap-4" : "grid grid-rows-[1fr_auto] gap-4"}>
            {/* 左／上：4×4 盤面（領域A） */}
            <div
              ref={containerRef}
              // CSS 変数で基準サイズを配信
              style={
                {
                  ["--ttw-w"]: `${TTW_W}px`,
                  ["--ttw-h"]: `${TTW_H}px`,
                  ["--gap"]: "16px",
                } as React.CSSProperties
              }
              className={[
                // 領域Aビューポート：1.5x × 1.2x
                "w-[calc(1.5*var(--ttw-w))]",
                "h-[calc(1.2*var(--ttw-h))]",
                // 縦横スクロール + スナップ
                "overflow-auto snap-x snap-mandatory scroll-smooth",
                // 見た目
                "rounded-2xl border border-slate-200 bg-white/60 shadow-inner backdrop-blur",
                // 内側に“クッション”を入れるため外側パディングはゼロ
                "p-0"
              ].join(" ")}
            >
              {/* クッション：端のセルも snap-center できるように (1.5-1)/2 = 0.25W、(1.2-1)/2 = 0.1H */}
              <div className="px-[calc(0.25*var(--ttw-w))] py-[calc(0.1*var(--ttw-h))]">
                {/* 4×4 グリッド本体。内容サイズに合わせるため w-max/h-max */}
                <div className="grid grid-rows-4 grid-cols-4 gap-[var(--gap)] w-max h-max place-items-center">
                  {QUARTERS.map((q, qi) =>
                    GRADES.map((g, gi) => {
                      const k = keyFrom(q, g);
                      const render = shouldRender(qi, gi, 1); // 既存の仮想化
                      const focused = qi === curQ && gi === curG;

                      return (
                        <div
                          key={k}
                          data-key={k}
                          ref={(el) => { panelRefs.current[k] = el; }}
                          className={[
                            "snap-center shrink-0",
                            // セル自体を TimetableWeek の実寸に固定
                            "w-[var(--ttw-w)] h-[var(--ttw-h)]",
                            // 見栄え（フォーカス時アウトライン）
                            "rounded-2xl transition-colors",
                            focused ? "outline outline-blue-400 outline-offset-2" : ""
                          ].join(" ")}
                        >
                          {render ? (
                            <TimetableWeek
                              title={`${year} / ${q} / ${g}年`}
                              getOfferingIds={getOfferingIds(q, g)}
                              subjectMap={subjectMap}
                              drag={drag}
                              onRemoveInCell={(offeringId, label) => {
                                const id = byLabel.get(label); if (id == null) return;
                                const next = clonePlacement(placement);
                                next[offeringId] = (next[offeringId] ?? []).filter((x) => x !== id);
                                setPlacement(next);
                              }}
                              makeLabel={(d, p) => encodeGlobalLabel(q, g, d, p)}
                              // TimetableWeek 側も枠が広がらないように明示
                              classname="w-[var(--ttw-w)] h-[var(--ttw-h)]"
                            />
                          ) : (
                            // プレースホルダも実寸に合わせる
                            <div className="w-[var(--ttw-w)] h-[var(--ttw-h)] rounded-2xl border border-dashed border-slate-200 bg-slate-50/40" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* 右／下：プール（既存のまま） */}
            <div className={poolPos === "right" ? "sticky top-3 h-[calc(100vh-120px)] overflow-auto transition-all duration-300" : "overflow-auto border-t border-slate-200 pt-3 transition-all duration-300"}>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">未配当（全体）</h2>
                  <p className="text-sm text-slate-500">プールから盤面へドラッグ</p>
                </div>
                <DroppableCell id="pool">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {poolOfferings.map((s) => (<SubjectCard key={s.offeringId} subject={s} />))}
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
