// lib/content/publications.ts
import { readYamlDir } from './load';
import type { Article } from '@/types/lab_db';

export interface PublicationYear {
  year: number;
  journal: Article[];
  international: Article[];
  domestic: Article[];
}

const byDateDesc = (a: Article, b: Article) => String(b.date).localeCompare(String(a.date));

export function loadPublicationYears(): PublicationYear[] {
  return readYamlDir<PublicationYear>('publications')
    .map((data) => ({
      year: data.year,
      journal: [...(data.journal ?? [])].sort(byDateDesc),
      international: [...(data.international ?? [])].sort(byDateDesc),
      domestic: [...(data.domestic ?? [])].sort(byDateDesc),
    }))
    .filter((y) => y.journal.length + y.international.length + y.domestic.length > 0)
    .sort((a, b) => b.year - a.year);
}

// トップページ用：全カテゴリから新しい順に n 件
export function loadLatestPublications(n = 20): Article[] {
  return loadPublicationYears()
    .flatMap((y) => [...y.journal, ...y.international, ...y.domestic])
    .sort(byDateDesc)
    .slice(0, n);
}
