// lib/matrix.ts
import {
  Grade,
  Quarter,
  SlotLabel,
  DayOfWeek,
  SubjectCardT,
  // TimeSlotInfo,
  // TimetablePayload,
} from "@/lib/types/timetable";
// import { encodeGlobalLabel } from "@/lib/idcodec";

// PanelData: 1行：1面ぶんの生データと座標
export type PanelData = {
  quarter: Quarter;
  grade: Grade;
  payload: {
    subjects: SubjectCardT[];
    timeSlots: { id: number; day: DayOfWeek; period: number; label: SlotLabel }[];
    placement: Record<string, number[]>;
  };
};
// export type PanelData = {
//   quarter: Quarter; // "Q1" | "Q2" | "Q3" | "Q4"
//   grade: Grade;     // 1 | 2 | 3 | 4
//   payload: {
//     subjects: { offeringId: number; code: string; name: string; units: number | null }[];
//     timeSlots: { id: number; day: string; period: number; label: string }[];
//     placement: Record<string, number[]>; // offeringId(string) -> slotId[]
//   };
// };
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
      console.log("fetchAll", params);
      const job = fetch(`https://acsl-hp.vercel.app/api/timetable?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
        .then(async (res) => {
          console.log(job, res);
          if (!res.ok) throw new Error(`fetch failed: ${q}/${g}`);
          const payload = await res.json();
          return { quarter: q, grade: g, payload } as PanelData;
        });
      jobs.push(job);
    }
  }
  return Promise.all(jobs);
}

// mergeMatrixData: 入=各面の生データ／出=統合後の subjects/timeSlots/placement


type Merged = {
  // 例: "Q2|G1|Thu-2" -> slot情報（必要なら quarter/grade を付与して保持）
  byLabel: Record<string, { id: number; day: string; period: number; label: string; quarter: Quarter; grade: Grade }>;
  // 例: "Q2|G1" -> その面の subjects / placement / timeSlots
  panels: Record<string, PanelData>;
};

export function mergeMatrixData(panels: PanelData[]): Merged {
  const byLabel: Merged["byLabel"] = {};
  const panelMap: Merged["panels"] = {};

  for (const p of panels) {
    const q = p.quarter;
    const g = p.grade;
    const pgKey = `${q}|G${g}`;

    // 面（パネル）自体を保持（必要ならディープコピー）
    panelMap[pgKey] = p;

    // ★ ここがポイント：Q/G を必ずキーに含める
    for (const s of p.payload.timeSlots) {
      const key = `${q}|G${g}|${s.day}-${s.period}`; // 例: "Q2|G1|Thu-2"
      byLabel[key] = { ...s, quarter: q, grade: g };
    }
  }

  return { byLabel, panels: panelMap };
}
