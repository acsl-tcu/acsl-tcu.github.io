// lib/matrix.ts
import {
  Grade,
  Quarter,
  SlotLabel,
  GlobalSlotLabel,
  DayOfWeek,
  SubjectCardT,
  TimeSlotInfo,
  TimetablePayload,
} from "@/lib/types/timetable";
import { encodeGlobalLabel, encodeLocalLabel } from "@/lib/idcodec";


// API から返る day ラベル("Mon" | "Tue" ...)を DayOfWeek ("MON" | "TUE" ...) に変換
function toDayOfWeekEnum(label: string): DayOfWeek {
  const m = label?.toLowerCase?.();
  switch (m) {
    case "mon": return "Mon";
    case "tue": return "Tue";
    case "wed": return "Wed";
    case "thu": return "Thu";
    case "fri": return "Fri";
    case "sat": return "Sat";
    case "sun": return "Sun";
    default: throw new Error(`Invalid day: ${label}`);
  }
}

// API 返却の timeSlot をローカルの TimeSlotInfo へ正規化
// API返却: [{ id, day, period/slot, ... }]
function normalizeTimeSlots(
  slots: Array<{ id: number; day: string; slot?: number; period?: number; label?: string; }>,
  ctx: { quarter: Quarter; grade: Grade }
): TimeSlotInfo[] {
  const { quarter, grade } = ctx;
  return (slots ?? []).map((ts) => {
    const dayEnum = toDayOfWeekEnum(ts.day);          // "Mon" 等に正規化
    const period = (ts.period ?? ts.slot ?? 0);
    const label = `${dayEnum}-${period}` as const;
    const globalLabel = `${quarter}|G${grade}|${label}` as const;
    return { id: ts.id, day: dayEnum, period, quarter, grade, label, globalLabel };
  });
}

// placement のキーを string に統一
// function normalizePlacement(p: Record<string | number, number[]>,
//   ctx: { quarter: Quarter; grade: Grade }
// ): Record<string, number[]> {
//   const out: Record<string, number[]> = {};
//   const { quarter, grade } = ctx;
//   for (const [k, v] of Object.entries(p ?? {})) {
//     out[String(k)] = Array.isArray(v) ? v : [];
//   }
//   return out;
// }
/**
 * placement を ctx(Q,G) に適合させつつ、最終的に id 配列へ統一する
 * - value が number[] の場合はそのまま（数値以外は除去）
 * - value が string[] の場合は ctx に合わせて globalLabel 化し、labelToId で id へ変換
 */
function normalizePlacement(
  p: Record<string | number, Array<number | string>>,
  ctx: { quarter: Quarter; grade: Grade },
  labelToId: Map<string, number> // ← timeSlots から生成して渡す
): Record<string, number[]> {
  const out: Record<string, number[]> = {};

  for (const [k, arr] of Object.entries(p ?? {})) {
    const set = new Set<number>();

    if (Array.isArray(arr)) {
      for (const v of arr) {
        if (typeof v === "number" && Number.isFinite(v)) {
          // すでに id の場合：そのまま
          set.add(v);
        } else if (typeof v === "string") {
          // ラベルの場合：ctx に合わせて globalLabel 化 → id へ変換
          const glabel = v;
          const id = labelToId.get(glabel);
          if (typeof id === "number") set.add(id);
          // 見つからない場合はスキップ（必要なら console.warn など）
        }
      }
    }

    out[String(k)] = Array.from(set);
  }

  return out;
}

// PanelData: 1行：1面ぶんの生データと座標
export type PanelData = {
  quarter: Quarter;
  grade: Grade;
  payload: {
    subjects: SubjectCardT[];
    timeSlots: { id: number; day: DayOfWeek; period: number; label: SlotLabel, globalLabel: GlobalSlotLabel }[];
    placement: Record<string, number[]>;
  };
};

// fetchMatrixData: 入=Q配列,G配列,年／出=各面の生データ配列（16件）
export async function fetchMatrixData(
  quarters: Quarter[],
  grades: Grade[],
  year: number
): Promise<PanelData[]> {
  const jobs: Promise<PanelData>[] = [];
  for (const q of quarters) {
    for (const g of grades) {
      const params = new URLSearchParams({ grade: String(g), quarter: q, year: String(year) });
      const job = fetch(`https://acsl-hp.vercel.app/api/timetable?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`fetch failed: ${q}/${g}`);
          const raw = await res.json() as {
            subjects: SubjectCardT[];
            timeSlots: Array<{ id: number; day: string; slot?: number; period?: number; label?: string; }>;
            placement: Record<string | number, number[]>;
          };

          // ★ ここで正規化して内部型に合わせる
          // 1) 各 panel(q,g) の timeSlots を正規化
          const timeSlots = normalizeTimeSlots(raw.timeSlots ?? [], { quarter: q, grade: g });
          // 2) labelToId を作成（globalLabel -> id）
          const labelToId = new Map<string, number>(
            timeSlots.map(s => [s.globalLabel, s.id])
          );

          // 3) placement を（id配列に）正規化
          const placementNormalized = normalizePlacement(raw.placement ?? {}, { quarter: q, grade: g }, labelToId);

          const normalized: PanelData = {
            quarter: q,
            grade: g,
            payload: {
              subjects: raw.subjects ?? [],
              timeSlots: timeSlots,
              placement: placementNormalized,
            },
          };
          return normalized;
        })
        .catch((err) => {
          console.log(err)
          window.location.href = '/Login?redirect=/MSE/TimetableMatrix';
          const normalized: PanelData = {
            quarter: q,
            grade: g,
            payload: {
              subjects: [],
              timeSlots: normalizeTimeSlots([], { quarter: q, grade: g }),
              placement: normalizePlacement({}, { quarter: q, grade: g }, new Map<string, number>()),
            },
          };
          return normalized;
        });
      jobs.push(job);
    }
  }
  return Promise.all(jobs);
}

// mergeMatrixData: 入=各面の生データ／出=統合後の subjects/timeSlots/placement
export function mergeMatrixData(panels: PanelData[]): TimetablePayload {
  // subjects: offeringId でユニーク化
  const subjMap = new Map<string, SubjectCardT>();
  for (const p of panels) {
    for (const s of p.payload.subjects) {
      // offeringId が number のことが多いので、キーは string に統一
      subjMap.set(String(s.offeringId), s);
    }
  }
  const subjects = Array.from(subjMap.values());

  // timeSlots: 各面のローカル label -> グローバル label に昇格して統合
  const tsMap = new Map<string, TimeSlotInfo>();
  for (const p of panels) {
    for (const ts of p.payload.timeSlots) {
      const globalLabel = encodeGlobalLabel(p.quarter, p.grade, ts.day, ts.period);
      const localLabel = encodeLocalLabel(ts.day, ts.period);
      tsMap.set(globalLabel, { ...ts, label: localLabel, globalLabel: globalLabel, quarter: p.quarter, grade: p.grade });
    }
  }
  const timeSlots = Array.from(tsMap.values());

  // placement: offeringId(string) -> id[] をマージ（重複除去）
  const placement: Record<string, number[]> = {};
  for (const p of panels) {
    for (const [offeringId, ids] of Object.entries(p.payload.placement)) {
      const set = new Set([...(placement[offeringId] ?? []), ...ids]);
      placement[offeringId] = Array.from(set);
    }
  }

  return { subjects, timeSlots, placement };
}
