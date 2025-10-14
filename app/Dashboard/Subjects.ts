// DB => API変換関数
export const SubjectConvertToAPIFormat = (rows: SubjectDB[]): SubjectAPI[] =>
  rows.map(({ sid, ...rest }) => ({
    id: sid,
    ...rest,
  }));

// API => DB変換関数
export const SubjectConvertToDBFormat = (rows: SubjectAPI[]): SubjectDB[] =>
  rows.map(({ id, ...rest }) => ({
    sid: id,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  }));

export interface SubjectAPI {
  id: string;              // sidをidとして扱う
  name: string;
  credits?: string;        // Decimalはstring
  unitNumber?: string;     // Decimalはstring
  courseType?: 'REQUIRED' | 'ELECTIVE';
  gradeYear?: number;
}

export interface SubjectDB {
  sid: string;
  name: string;
  credits?: string;
  unitNumber?: string;
  courseType?: 'REQUIRED' | 'ELECTIVE';
  gradeYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SubjectColumns = [
  { key: 'id', label: 'SID' },
  { key: 'title', label: 'Name' },
  { key: 'credits', label: 'Credits' },
  { key: 'unitNumber', label: 'Unit Number' },
  { key: 'courseType', label: 'Course Type' },
  { key: 'gradeYear', label: 'Grade Year' },
] as const;

export const subject_table_title = "科目一覧";
