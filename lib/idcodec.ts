// lib/idcodec.ts
// ※ 変数は1行、関数は3行以内の意図コメント（入出力の説明つき）

import type { Grade, Quarter, DayOfWeek, SlotLabel, GlobalSlotLabel } from "@/lib/types/timetable";

// ラベル判定用の簡易正規表現
const LOCAL_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-\d+$/;      // 1行: 従来のローカルラベル "Wed-3" を判定
const GLOBAL_RE = /^(Q1|Q2|Q3|Q4)\|G[1-4]\|(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-\d+$/; // 1行: グローバル "Q2|G3|Wed-3"

// makeLocalLabel: 入=day,period／出="Wed-3" のローカルラベル文字列
export const makeLocalLabel = (day: DayOfWeek, period: number): string => `${day}-${period}`;

// isLocalLabel: 入=文字列／出=従来ラベルかを返す
export const isLocalLabel = (label: string): boolean => LOCAL_RE.test(label);

// isGlobalLabel: 入=文字列／出=グローバルラベルかを返す
export const isGlobalLabel = (label: string): boolean => GLOBAL_RE.test(label);

// encodeGlobalLabel: 入=Q,G,day,period／出="Q2|G3|Wed-3" のグローバルラベル
export const encodeGlobalLabel = (q: Quarter, g: Grade, day: DayOfWeek, period: number): GlobalSlotLabel =>
  `${q}|G${g}|${day}-${period}`;

export const encodeLocalLabel = (d: DayOfWeek, p: number): SlotLabel => `${d}-${p}`;
// parseGlobalLabel: 入=グローバルラベル／出={quarter,grade,day,period}（不正は null）
export const parseGlobalLabel = (label: string):
  | { quarter: Quarter; grade: Grade; day: DayOfWeek; period: number }
  | null => {
  if (!isGlobalLabel(label)) return null;
  const [q, g, dp] = label.split("|");
  const [day, pStr] = dp.split("-");
  return {
    quarter: q as Quarter,
    grade: Number(g.slice(1)) as Grade,
    day: day as DayOfWeek,
    period: Number(pStr),
  };
};

// toGlobalFromLocal: 入=Q,G,local("Wed-3")／出=global("Q2|G3|Wed-3")
export const toGlobalFromLocal = (
  q: Quarter,
  g: Grade,
  local: string
): string => {
  if (!isLocalLabel(local)) throw new Error(`Invalid local label: ${local}`);
  return `${q}|G${g}|${local}`;
};

// toLocalFromGlobal: 入=global("Q2|G3|Wed-3")／出=local("Wed-3")
export const toLocalFromGlobal = (global: string): string => {
  const parsed = parseGlobalLabel(global);
  if (!parsed) throw new Error(`Invalid global label: ${global}`);
  return `${parsed.day}-${parsed.period}`;
};
