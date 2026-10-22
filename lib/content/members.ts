// lib/content/members.ts
import { readYamlDir } from './load';

export interface MemberEntry {
  name: string;
  jname: string;
  grade: string;
  subject: string;
  jsubject: string;
  url?: string;
}

export interface MemberYear {
  year: number;
  photo: string;
  members: MemberEntry[];
}

// メンバーが登録された年を公開する（集合写真は未設定でもよい）
export function loadPublishedMemberYears(): MemberYear[] {
  return readYamlDir<MemberYear>('members')
    .map((data) => ({ ...data, photo: data.photo ?? '', members: data.members ?? [] }))
    .filter((y) => y.members.length > 0)
    .sort((a, b) => b.year - a.year);
}
