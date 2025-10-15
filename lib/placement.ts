// /lib/placement.ts
// used in TimetableBoard and SubjectCardInCell
export type Placement = Record<string, number[]>;

/** 全 shallow copy（各配列はコピー） */
export function clonePlacement(src: Placement): Placement {
  const dst: Placement = {};
  for (const k of Object.keys(src)) dst[k] = [...src[k]];
  return dst;
}

/** offering に timeslot を重複なしで追加 */
export function addTimeslot(src: Placement, offeringId: string, tsId: number): Placement {
  const dst = clonePlacement(src);
  const arr = dst[offeringId] ?? [];
  dst[offeringId] = arr.includes(tsId) ? arr : [...arr, tsId];
  return dst;
}

/** offering から特定 timeslot を削除 */
export function removeTimeslot(src: Placement, offeringId: string, tsId: number): Placement {
  const dst = clonePlacement(src);
  if (!dst[offeringId]) return dst;
  dst[offeringId] = dst[offeringId].filter((x) => x !== tsId);
  return dst;
}

/** offering の timeslot を from→to へ移動（from を外して to を追加） */
export function moveTimeslot(src: Placement, offeringId: string, fromTsId: number, toTsId: number): Placement {
  if (fromTsId === toTsId) return src;
  return addTimeslot(removeTimeslot(src, offeringId, fromTsId), offeringId, toTsId);
}

/** offering の全 timeslot をクリア（＝未配当） */
export function clearAllTimeslots(src: Placement, offeringId: string): Placement {
  const dst = clonePlacement(src);
  dst[offeringId] = [];
  return dst;
}
