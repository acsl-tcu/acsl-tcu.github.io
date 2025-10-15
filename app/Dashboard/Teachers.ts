// DB => API変換関数
export const TeacherConvertToAPIFormat = (rows: TeacherDB[]): TeacherAPI[] =>
  rows.map(({ sid, name, ...rest }) => ({
    id: sid,
    title: name,
    ...rest,
  }));

// API => DB変換関数
export const TeacherConvertToDBFormat = (rows: TeacherAPI[]): TeacherDB[] =>
  rows.map(({ id, title, ...rest }) => ({
    sid: id,
    name: title,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  }));

export interface TeacherAPI {
  id: string;           // sidをidとして扱う
  title: string;
  readingKana?: string;
  birthYear?: number;
  position?: 'PROFESSOR' | 'ASSOCIATE_PROFESSOR' | 'LECTURER' | 'ASSISTANT_PROFESSOR' | 'RESEARCH_ASSISTANT' | 'PART_TIME_LECTURER' | 'STAFF' | 'OTHER';
  class?: string;
  committee?: string;
  room?: string;
  email?: string;
  lab?: string;
  webpage?: string;
}

export interface TeacherDB {
  sid: string;
  name: string;
  readingKana?: string;
  birthYear?: number;
  position?: 'PROFESSOR' | 'ASSOCIATE_PROFESSOR' | 'LECTURER' | 'ASSISTANT_PROFESSOR' | 'RESEARCH_ASSISTANT' | 'PART_TIME_LECTURER' | 'STAFF' | 'OTHER';
  class?: string;
  committee?: string;
  room?: string;
  email?: string;
  lab?: string;
  webpage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TeacherColumns = [
  { key: 'sid', label: 'SID' },
  { key: 'name', label: 'Name' },
  { key: 'readingKana', label: 'Reading Kana' },
  { key: 'birthYear', label: 'Birth Year' },
  { key: 'position', label: 'Position' },
  { key: 'class', label: 'Class' },
  { key: 'committee', label: 'Committee' },
  { key: 'room', label: 'Room' },
  { key: 'email', label: 'Email' },
  { key: 'lab', label: 'Lab' },
  { key: 'webpage', label: 'Webpage' },
] as const;

export const teacher_table_title = "教員一覧";
