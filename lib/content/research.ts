// lib/content/research.ts
import { readYamlDir } from './load';

export interface ResearchFigure {
  path: string;
  caption: string;
  jcaption: string;
}

export interface ResearchTopic {
  order: number;
  type: 'method' | 'application';
  area: string;
  role: string;
  title: string;
  jtitle: string;
  abst: string;
  jabst: string;
  keywords: string[];
  figures: ResearchFigure[];
}

export function loadResearchTopics(): ResearchTopic[] {
  return readYamlDir<ResearchTopic>('research')
    .map((t) => ({ ...t, keywords: t.keywords ?? [], figures: t.figures ?? [] }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
