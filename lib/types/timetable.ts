// 変数は1行、関数は3行以内の意図コメントを守る

export type Grade = 1 | 2 | 3 | 4;                           // 1行：学年
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";             // 1行：クォーター
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"; // 1行：曜日
export type SlotLabel = `${DayOfWeek}-${number}`;            // 1行：ローカルラベル

export const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"]; // 1行：行
export const GRADES: Grade[] = [1, 2, 3, 4];                 // 1行：列
export const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri"]; // 1行：表示曜日
export const PERIODS = [1, 2, 3, 4, 5, 6];                   // 1行：表示時限

export type SubjectCardT = { offeringId: string; code?: string; name: string; units?: number | null }; // 1行：科目
export type TimeSlotInfo = { id: number; day: DayOfWeek; period: number; label: string };              // 1行：globalラベル
export type TimetablePayload = { subjects: SubjectCardT[]; timeSlots: TimeSlotInfo[]; placement: Record<string, number[]> }; // 1行：全体

// 複数Meeting対応: offeringId -> SlotLabel[]（空配列=未配当）
export type Placement = Record<string, SlotLabel[]>;
export type SubjectCard = {
  offeringId: string;
  code?: string;
  name: string;
  units?: number | null;
};
