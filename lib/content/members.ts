// lib/content/members.ts
// content/members/{year}.yaml をビルド時に読み込む（Pages CMS で編集）
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

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

export const MEMBERS_DIR = path.join(process.cwd(), 'content', 'members');

export function readMemberYears(): MemberYear[] {
  return fs
    .readdirSync(MEMBERS_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => parse(fs.readFileSync(path.join(MEMBERS_DIR, file), 'utf8')) as MemberYear)
    .map((data) => ({ ...data, photo: data.photo ?? '', members: data.members ?? [] }))
    .sort((a, b) => b.year - a.year);
}

// 集合写真とメンバーが揃った年だけ公開する
export function loadPublishedMemberYears(): MemberYear[] {
  return readMemberYears().filter((y) => y.photo && y.members.length > 0);
}
