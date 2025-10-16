// lib/diff.ts
// 変数・関数には短い意図コメント（変数1行/関数3行）

export type PatchOp = { offeringId: string; timeSlotId: number }; // 1行：単一Meeting変更の原子単位
export type Placement = Record<string, number[]>;                  // 1行：offeringId -> timeSlotId[]

export type PlacementDiff = {
  add: PatchOp[];   // 1行：新規追加する (offeringId, timeSlotId)
  remove: PatchOp[];// 1行：削除する (offeringId, timeSlotId)
  addCount: number; // 1行：add の件数
  removeCount: number;// 1行：remove の件数
  total: number;    // 1行：add+remove
};

// computePlacementDiff: 入=old,next／出=追加と削除のリスト
export function computePlacementDiff(oldP: Placement, newP: Placement): PlacementDiff {
  const add: PatchOp[] = [];
  const remove: PatchOp[] = [];

  const keys = new Set([...Object.keys(oldP), ...Object.keys(newP)]);
  for (const k of keys) {
    const a = new Set(oldP[k] ?? []);
    const b = new Set(newP[k] ?? []);
    for (const id of b) if (!a.has(id)) add.push({ offeringId: k, timeSlotId: id });
    for (const id of a) if (!b.has(id)) remove.push({ offeringId: k, timeSlotId: id });
  }

  return { add, remove, addCount: add.length, removeCount: remove.length, total: add.length + remove.length };
}
