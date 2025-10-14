// DB => API変換関数
export const StudentConvertToAPIFormat = (rows: StudentDB[]): StudentAPI[] =>
  rows.map(({ sid, ...rest }) => ({
    id: sid,
    ...rest,
  }));

// API => DB変換関数
export const StudentConvertToDBFormat = (rows: StudentAPI[]): StudentDB[] =>
  rows.map(({ id, ...rest }) => ({
    sid: id,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  }));

export interface StudentAPI {
  id: string;            // sidをidとして扱う
  name: string;
  readingKana?: string;
  ugEntryYear?: number;
  gradeYear?: number;
  gradEntryYear?: number;
  docEntryYear?: number;
}

export interface StudentDB {
  sid: string;
  name: string;
  readingKana?: string;
  ugEntryYear?: number;
  gradeYear?: number;
  gradEntryYear?: number;
  docEntryYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const StudentColumns = [
  { key: 'id', label: 'SID' },
  { key: 'name', label: 'Name' },
  { key: 'readingKana', label: 'Reading Kana' },
  { key: 'ugEntryYear', label: 'Undergrad Entry Year' },
  { key: 'gradeYear', label: 'Grade Year' },
  { key: 'gradEntryYear', label: 'Grad Entry Year' },
  { key: 'docEntryYear', label: 'Doctorate Entry Year' },
] as const;

export const student_table_title = "学生一覧";
