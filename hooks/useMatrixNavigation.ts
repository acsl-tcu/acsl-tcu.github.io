"use client";
import React from "react";
import { GRADES, QUARTERS, Quarter, Grade } from "@/lib/types/timetable";

export function useMatrixNavigation() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);          // 1行：スクロール容器
  const panelRefs = React.useRef<Record<string, HTMLDivElement | null>>({}); // 1行：各パネルnode
  const [curQ, setCurQ] = React.useState(0);   // 1行：現在行
  const [curG, setCurG] = React.useState(0);   // 1行：現在列

  const keyFrom = (q: Quarter, g: Grade) => `${q}-${g}`; // 1行：キー
  const qiOf = (q: Quarter) => QUARTERS.indexOf(q);      // 1行：行idx
  const giOf = (g: Grade) => GRADES.indexOf(g);          // 1行：列idx

  const scrollToPanel = React.useCallback((qi: number, gi: number) => {
    const qn = Math.max(0, Math.min(QUARTERS.length - 1, qi));
    const gn = Math.max(0, Math.min(GRADES.length - 1, gi));
    const q = QUARTERS[qn];
    const g = GRADES[gn];
    const node = panelRefs.current[keyFrom(q, g)];
        console.log("scrollToPanel:",q,g,node);
        setCurQ(qn); setCurG(gn);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, []);

  // IO で現在位置トラッキング
  // React.useEffect(() => {
  //   const root = containerRef.current;
  //   if (!root) return;
  //   const ratios = new Map<string, number>();
  //   const io = new IntersectionObserver((entries) => {
  //     entries.forEach((e) => {
  //       const k = (e.target as HTMLElement).dataset.key;
  //       if (k) ratios.set(k, e.intersectionRatio);
  //     });
  //     let best = "", br = -1;
  //     ratios.forEach((r, k) => { if (r > br) { br = r; best = k; } });
  //     console.log("IntersectionObserver",entries,best);
  //     if (best) {
  //       const [q, gStr] = best.split("-");
  //       const qi = qiOf(q as Quarter), gi = GRADES.indexOf(Number(gStr) as Grade);
  //       if (qi >= 0 && gi >= 0) { setCurQ(qi); setCurG(gi); }
  //     }
  //   }, { root, threshold: [0, 0.25, 0.5, 0.75, 1] });

  //   QUARTERS.forEach(q => GRADES.forEach(g => {
  //     const el = panelRefs.current[keyFrom(q, g)];
  //     if (el) io.observe(el);
  //   }));

  //   return () => io.disconnect();
  // }, []);

  // Shift+矢印でジャンプ
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") scrollToPanel(curQ, Math.max(0, curG - 1));
      if (e.key === "ArrowRight") scrollToPanel(curQ, Math.min(GRADES.length - 1, curG + 1));
      if (e.key === "ArrowUp") scrollToPanel(Math.max(0, curQ - 1), curG);
      if (e.key === "ArrowDown") scrollToPanel(Math.min(QUARTERS.length - 1, curQ + 1), curG);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [curQ, curG, scrollToPanel]);

  // 仮想化：近傍の可視範囲（マンハッタン距離）でレンダー許可
  const shouldRender = (qi: number, gi: number, radius = 1) =>
    Math.abs(qi - curQ) + Math.abs(gi - curG) <= radius;

  return { containerRef, panelRefs, keyFrom, qiOf, giOf, curQ, curG, scrollToPanel, shouldRender };
}
