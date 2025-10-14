// フロント・バックで共有してもOK（別リポなら両方に同一定義を置く）
export type Grade = 1 | 2 | 3 | 4;
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type SlotId = `${DayOfWeek}-${number}`; // 例: "Mon-1"

export type SubjectCard = {
  offeringId: string;
  code?: string;
  name: string;
  units?: number | null;
};

// 複数Meeting対応: offeringId -> SlotId[]（空配列=未配当）
export type Placement = Record<string, SlotId[]>;

export type TimetablePayload = {
  subjects: SubjectCard[];   // Offering ごとのメタ情報
  placement: Placement;      // Meeting 配置（複数可）
};

export const DAYS: DayOfWeek[] = ["Mon","Tue","Wed","Thu","Fri"];
export const PERIODS = [1,2,3,4,5,6];
