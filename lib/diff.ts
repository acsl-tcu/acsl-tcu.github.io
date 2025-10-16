// lib/diff.ts
export type PatchOp = { offeringId: string; timeslotId: number };  // ← Prisma準拠
export type Placement = Record<string, number[]>;

export type PlacementDiff = {
  add: PatchOp[];
  remove: PatchOp[];
  addCount: number;
  removeCount: number;
  total: number;
};

// old/new の差分を timeslotId ベースで算出
export function computePlacementDiff(oldP: Placement, newP: Placement): PlacementDiff {
  const add: PatchOp[] = [];
  const remove: PatchOp[] = [];

  const keys = new Set([...Object.keys(oldP), ...Object.keys(newP)]);
  for (const k of keys) {
    const a = new Set(oldP[k] ?? []);
    const b = new Set(newP[k] ?? []);
    for (const id of b) if (!a.has(id)) add.push({ offeringId: k, timeslotId: id });
    for (const id of a) if (!b.has(id)) remove.push({ offeringId: k, timeslotId: id });
  }
  return { add, remove, addCount: add.length, removeCount: remove.length, total: add.length + remove.length };
}
