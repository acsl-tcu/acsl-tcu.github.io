// DB => API変換関数
export const TeacherAssignmentConvertToAPIFormat = (rows: TeacherAssignmentDB[]): TeacherAssignmentAPI[] =>
  rows.map(({ id, offeringId, teacherId, role, order }) => ({
    id: id.toString(),
    offeringId,
    teacherId,
    role: role ?? '',
    order: order ?? null,
  }));

// API => DB変換関数
export const TeacherAssignmentConvertToDBFormat = (rows: TeacherAssignmentAPI[]): TeacherAssignmentDB[] =>
  rows.map(({ id, role, order, ...rest }) => ({
    id: Number(id),
    role: role || null,
    order: order ?? null,
    ...rest,
  }));

export interface TeacherAssignmentAPI {
  id: string;
  offeringId: number;
  teacherId: number;
  role?: string;
  order?: number | null;
}

export interface TeacherAssignmentDB {
  id: number;
  offeringId: number;
  teacherId: number;
  role?: string | null;
  order?: number | null;
}

export const TeacherAssignmentColumns = [
  { key: 'id', label: 'ID' },
  { key: 'offeringId', label: 'Offering ID' },
  { key: 'teacherId', label: 'Teacher ID' },
  { key: 'role', label: 'Role' },
  { key: 'order', label: 'Display Order' },
] as const;

export const teacherAssignment_table_title = "教員割当一覧";
