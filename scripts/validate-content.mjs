// scripts/validate-content.mjs
// content/ 以下の YAML と画像をチェックする（CI と手元で実行）: node scripts/validate-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = process.cwd();
const MEMBERS_DIR = path.join(ROOT, 'content', 'members');
const GRADES = ['B4', 'M1', 'M2', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'Prof.', 'Dr.', 'SEC'];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const errors = [];
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`);

for (const file of fs.readdirSync(MEMBERS_DIR).filter((f) => f.endsWith('.yaml'))) {
  const full = path.join(MEMBERS_DIR, file);
  let data;
  try {
    data = parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    err(full, `YAML の書式エラー: ${e.message}`);
    continue;
  }
  if (!Number.isInteger(data?.year)) {
    err(full, 'year（年度）が整数ではありません');
  } else if (`${data.year}.yaml` !== file) {
    err(full, `ファイル名と year (${data.year}) が一致しません`);
  }
  if (data?.photo) {
    const img = path.join(ROOT, 'public', data.photo);
    if (!data.photo.startsWith('/images/member/') || !fs.existsSync(img)) {
      err(full, `photo の画像が見つかりません: ${data.photo}`);
    } else if (fs.statSync(img).size > MAX_IMAGE_BYTES) {
      err(full, `photo が大きすぎます (${(fs.statSync(img).size / 1e6).toFixed(1)}MB > 8MB): ${data.photo}`);
    }
  }
  if (!Array.isArray(data?.members)) {
    err(full, 'members がリストではありません');
    continue;
  }
  data.members.forEach((m, i) => {
    const where = `members[${i + 1}] ${m?.jname ?? ''}`;
    for (const key of ['name', 'jname', 'grade']) {
      if (typeof m?.[key] !== 'string' || !m[key].trim()) err(full, `${where}: ${key} が空です`);
    }
    if (m?.grade && !GRADES.includes(m.grade)) err(full, `${where}: grade "${m.grade}" は不正です（${GRADES.join(', ')}）`);
    if (m?.url && !/^https?:\/\//.test(m.url)) err(full, `${where}: url は http(s):// で始めてください`);
  });
}

if (errors.length > 0) {
  console.error(`✖ ${errors.length} 件のエラー\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('✔ content OK');
