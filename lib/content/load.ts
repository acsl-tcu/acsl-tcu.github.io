// lib/content/load.ts
// content/ 以下の YAML をビルド時に読み込む（Pages CMS で編集）
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export function contentDir(name: string): string {
  return path.join(process.cwd(), 'content', name);
}

export function readYamlDir<T>(name: string): T[] {
  const dir = contentDir(name);
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => parse(fs.readFileSync(path.join(dir, file), 'utf8')) as T);
}
