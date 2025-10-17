// lib/placement.ts（抜粋・例：ロジックは変更しない）

export const getSlots = (p: Record<string, number[]>, offeringId: number|string) =>
  p[String(offeringId)] ?? [];

export const setSlots = (p: Record<string, number[]>, offeringId: number|string, slots: number[]) => ({
  ...p,
  [String(offeringId)]: Array.from(new Set(slots.filter(Number.isFinite))),
});

// clonePlacement: 入=placement／出=ディープコピー（破壊的変更を避けるため）
export function clonePlacement(p: Record<string, number[]>): Record<string, number[]> {
  return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, [...v]]));
}

// addTimeslot: 入=p, offeringId, slotId／出=slotId を追加した新配置
export function addTimeslot(
  p: Record<string, number[]>,
  offeringId: string,
  slotId: number
) {
  const next = clonePlacement(p);
  const arr = new Set(next[Number(offeringId)] ?? []);
  arr.add(slotId);
  next[offeringId] = [...arr];
  return next;
}

// moveTimeslot: 入=p, offeringId, fromId, toId／出=from を外し to を追加した新配置
export function moveTimeslot(
  p: Record<string, number[]>,
  offeringId: string,
  fromId: number,
  toId: number
) {
  const next = clonePlacement(p);
  next[offeringId] = (next[offeringId] ?? []).filter((id) => id !== fromId);
  next[offeringId]!.push(toId);
  return next;
}

// clearAllTimeslots: 入=p, offeringId／出=対象 offering の全スロットを空にした新配置
export function clearAllTimeslots(p: Record<string, number[]>, offeringId: string) {
  const next = clonePlacement(p);
  next[offeringId] = [];
  return next;
}
