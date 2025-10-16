// lib/csv.ts
// CSV/Zip ユーティリティ（subjects / timeslots / placement の入出力）

import Papa from "papaparse";
import JSZip from "jszip";

// 型はMatrixBoardのものと一致させる
export type Grade = 1 | 2 | 3 | 4;
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type SubjectRow = { offeringId: string; code?: string; name: string; units?: number | null; grade?: Grade; quarter?: Quarter };
export type TimeSlotRow = { id: number; quarter: Quarter; grade: Grade; day: DayOfWeek; period: number; label: string }; // label=global
export type PlacementRow = { offeringId: string; timeSlotId: number };

export type ExportData = {
  subjects: SubjectRow[];
  timeSlots: TimeSlotRow[];
  placement: Record<string, number[]>;
};

export type ImportData = {
  subjects: SubjectRow[];
  timeSlots: TimeSlotRow[];
  placement: Record<string, number[]>;
};

// toCsv: 入=rows配列／出=CSV文字列（ヘッダ付き）
export const toCsv = <T extends object>(rows: T[]) => Papa.unparse(rows ?? []);

// parseCsv: 入=CSV文字列／出=rows配列（呼出側で型指定必須）
export function parseCsv<T extends object>(csv: string): T[] {
  const { data } = Papa.parse<T>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return data;
}

// flattenPlacement: 入=Record(offeringId->id[])／出=PlacementRow配列
export const flattenPlacement = (p: Record<string, number[]>): PlacementRow[] => {
  const out: PlacementRow[] = [];
  for (const [offeringId, ids] of Object.entries(p ?? {})) {
    for (const id of ids ?? []) out.push({ offeringId, timeSlotId: id });
  }
  return out;
};

// inflatePlacement: 入=PlacementRow配列／出=Record(offeringId->id[])
export const inflatePlacement = (rows: PlacementRow[]): Record<string, number[]> => {
  const out: Record<string, number[]> = {};
  for (const r of rows) {
    (out[r.offeringId] ??= []).push(r.timeSlotId);
  }
  return out;
};

// makeZipBlob: 入=subjects,timeSlots,placement／出=Zip Blob
export const makeZipBlob = async (data: ExportData): Promise<Blob> => {
  const zip = new JSZip();
  zip.file("subjects.csv", toCsv<SubjectRow>(data.subjects));
  zip.file("timeslots.csv", toCsv<TimeSlotRow>(data.timeSlots));
  zip.file("placement.csv", toCsv<PlacementRow>(flattenPlacement(data.placement)));
  return zip.generateAsync({ type: "blob" });
};

// readZip: 入=Zip File／出=ImportData（CSV3種が揃っている前提）
export const readZip = async (file: File): Promise<ImportData> => {
  const zip = await JSZip.loadAsync(file);
  const readText = async (name: string) => {
    const entry = zip.file(name);
    if (!entry) throw new Error(`${name} not found in zip`);
    return entry.async("string");
  };
  const subjectsCsv = await readText("subjects.csv");
  const timesCsv = await readText("timeslots.csv");
  const placementCsv = await readText("placement.csv");

  const subjects = parseCsv<SubjectRow>(subjectsCsv);
  const timeSlots = parseCsv<TimeSlotRow>(timesCsv);
  const placementRows = parseCsv<PlacementRow>(placementCsv);
  const placement = inflatePlacement(placementRows);

  return { subjects, timeSlots, placement };
};

// downloadBlob: 入=Blobとファイル名／出=なし（ブラウザで保存ダイアログ）
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
