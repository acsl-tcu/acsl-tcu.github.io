// lib/content/lectures.ts
import { readYamlDir } from './load';

export interface Lecture {
  id: string;
  title: string;
  etitle: string;
  term: string;
  teacher: string;
}

export interface LectureYear {
  year: number;
  lectures: Lecture[];
}

export function loadLectureYears(): LectureYear[] {
  return readYamlDir<LectureYear>('lectures')
    .map((data) => ({ year: data.year, lectures: data.lectures ?? [] }))
    .filter((y) => y.lectures.length > 0)
    .sort((a, b) => b.year - a.year);
}
