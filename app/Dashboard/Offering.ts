// DB => API変換関数
export const OfferingConvertToAPIFormat = (rows: OfferingDB[]): OfferingAPI[] =>
  rows.map(({ id, subjectId, termId,  ...rest }) => ({
    id: id.toString(),
    subjectId,
    termId,
    ...rest,
  }));

// API => DB変換関数
export const OfferingConvertToDBFormat = (rows: OfferingAPI[]): OfferingDB[] =>
  rows.map(({ id, ...rest }) => ({
    id: Number(id),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  }));

export interface OfferingAPI {
  id: string;          // idはstringに変換
  subjectId: number;
  termId: number;
  section?: string;
  targetYear: number;
}

export interface OfferingDB {
  id: number;
  subjectId: number;
  termId: number;
  section?: string;
  targetYear: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const OfferingColumns = [
  { key: 'id', label: 'ID' },
  { key: 'subjectId', label: 'Subject ID' },
  { key: 'termId', label: 'Term ID' },
  { key: 'section', label: 'Section' },
  { key: 'targetYear', label: 'Target Year' },
] as const;

export const offering_table_title = "開講枠一覧";
