// lib/matrix.ts
import type {
  Grade,
  Quarter,
  SlotLabel,
  DayOfWeek,
  SubjectCardT,
  TimeSlotInfo,
  TimetablePayload,
} from "@/components/timetable/MatrixBoard";
import { encodeGlobalLabel } from "@/lib/idcodec";

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
          const payload = await res.json();
          return { quarter: q, grade: g, payload } as PanelData;
        });
      jobs.push(job);
    }
  }
  return Promise.all(jobs);
}

// mergeMatrixData: 入=各面の生データ／出=統合後の subjects/timeSlots/placement
export function mergeMatrixData(panels: PanelData[]): TimetablePayload {
  // subjects: 1行：offeringId でユニーク化
  const subjMap = new Map<string, SubjectCardT>();
  for (const p of panels) {
    for (const s of p.payload.subjects) subjMap.set(s.offeringId, s);
  }
  const subjects = Array.from(subjMap.values());

  // timeSlots: 3行：各面のローカルlabel -> globalLabel に昇格して統合
  const tsMap = new Map<number, TimeSlotInfo>();
  for (const p of panels) {
    for (const ts of p.payload.timeSlots) {
      const glabel = encodeGlobalLabel(p.quarter, p.grade, ts.day, ts.period);
      tsMap.set(ts.id, { ...ts, label: glabel });
    }
  }
  const timeSlots = Array.from(tsMap.values());

  // placement: 1行：offeringId -> id[] を単純にマージ（重複は set で除去）
  const placement: Record<string, number[]> = {};
  for (const p of panels) {
    for (const [offeringId, ids] of Object.entries(p.payload.placement)) {
      const set = new Set([...(placement[offeringId] ?? []), ...ids]);
      placement[offeringId] = Array.from(set);
    }
  }

  return { subjects, timeSlots, placement };
}
