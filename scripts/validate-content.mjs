// scripts/validate-content.mjs
// content/ 以下の YAML と画像をチェックする（CI と手元で実行）: node scripts/validate-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = process.cwd();
const GRADES = ['B4', 'M1', 'M2', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'Prof.', 'Dr.', 'SEC'];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`);
const warn = (file, msg) => warnings.push(`${path.relative(ROOT, file)}: ${msg}`);
const isBlank = (v) => typeof v !== 'string' || !v.trim();

function readDir(name, check) {
  const dir = path.join(ROOT, 'content', name);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
    const full = path.join(dir, file);
    let data;
    try {
      data = parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      err(full, `YAML の書式エラー: ${e.message}`);
      continue;
    }
    check(full, file, data ?? {});
  }
}

function checkYearFile(full, file, data) {
  if (!Number.isInteger(data.year)) {
    err(full, 'year（年度）が整数ではありません');
    return false;
  }
  if (`${data.year}.yaml` !== file) err(full, `ファイル名と year (${data.year}) が一致しません`);
  return true;
}

function checkPublicFile(full, where, publicPath, prefix, report = err) {
  const target = path.join(ROOT, 'public', publicPath);
  if (!publicPath.startsWith(prefix) || !fs.existsSync(target)) {
    report(full, `${where}: ファイルが見つかりません: ${publicPath}`);
  } else if (fs.statSync(target).size > MAX_IMAGE_BYTES) {
    report(full, `${where}: ファイルが大きすぎます (${(fs.statSync(target).size / 1e6).toFixed(1)}MB > 8MB): ${publicPath}`);
  }
}

function checkList(full, data, key, each) {
  if (data[key] === undefined || data[key] === null) return;
  if (!Array.isArray(data[key])) {
    err(full, `${key} がリストではありません`);
    return;
  }
  data[key].forEach((item, i) => each(`${key}[${i + 1}]`, item ?? {}));
}

readDir('members', (full, file, data) => {
  checkYearFile(full, file, data);
  if (data.photo) checkPublicFile(full, 'photo', data.photo, '/images/member/');
  checkList(full, data, 'members', (where, m) => {
    where = `${where} ${m.jname ?? ''}`;
    for (const key of ['name', 'jname', 'grade']) if (isBlank(m[key])) err(full, `${where}: ${key} が空です`);
    if (m.grade && !GRADES.includes(m.grade)) err(full, `${where}: grade "${m.grade}" は不正です（${GRADES.join(', ')}）`);
    if (m.url && !/^https?:\/\//.test(m.url)) err(full, `${where}: url は http(s):// で始めてください`);
  });
});

const REQUIRED = { journal: ['author', 'title', 'magazine', 'date'], international: ['author', 'title', 'meeting', 'date'], domestic: ['author', 'title', 'meeting', 'date'] };
readDir('publications', (full, file, data) => {
  const ok = checkYearFile(full, file, data);
  for (const [key, required] of Object.entries(REQUIRED)) {
    checkList(full, data, key, (where, p) => {
      for (const k of required) if (isBlank(String(p[k] ?? ''))) err(full, `${where}: ${k} が空です`);
      const date = String(p.date ?? '');
      if (date && !/^\d{6}$/.test(date)) err(full, `${where}: date "${date}" は YYYYMM 形式にしてください`);
      else if (ok && date && Number(date.slice(0, 4)) !== data.year) err(full, `${where}: date "${date}" が ${data.year} 年ではありません`);
    });
  }
});

// 研究テーマは既存データに不備があるため、内容の不足は警告に留める
readDir('research', (full, file, data) => {
  for (const k of ['title', 'jtitle']) if (isBlank(data[k])) warn(full, `${k} が空です`);
  if (isBlank(data.area)) err(full, 'area が空です');
  if (!['method', 'application'].includes(data.type)) err(full, `type "${data.type}" は method / application のどちらかにしてください`);
  if (data.type === 'application' && data.area && !fs.existsSync(path.join(ROOT, 'public', 'images', `${data.area}.jpg`))) {
    warn(full, `応用分野のカード画像 /images/${data.area}.jpg がありません`);
  }
  checkList(full, data, 'figures', (where, f) => {
    if (isBlank(f.path)) warn(full, `${where}: ファイルが空です`);
    else checkPublicFile(full, where, f.path, '/images/', warn);
  });
});

readDir('lectures', (full, file, data) => {
  checkYearFile(full, file, data);
  checkList(full, data, 'lectures', (where, l) => {
    for (const k of ['id', 'title']) if (isBlank(l[k])) err(full, `${where}: ${k} が空です`);
  });
});

if (warnings.length > 0) {
  console.warn(`⚠ ${warnings.length} 件の警告（公開は可能）\n` + warnings.map((w) => `  - ${w}`).join('\n'));
}
if (errors.length > 0) {
  console.error(`✖ ${errors.length} 件のエラー\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('✔ content OK');
