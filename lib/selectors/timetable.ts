import { DAYS, PERIODS, Grade, Quarter, TimetablePayload } from "@/lib/types/timetable";
import { encodeGlobalLabel } from "@/lib/idcodec";

// makeByLabel: 入=payload／出=Map(globalLabel->id)
export const makeByLabel = (server: TimetablePayload) => {
  const m = new Map<string, number>();
  for (const ts of server.timeSlots) m.set(ts.label, ts.id);
  return m;
};

// makeById: 入=payload／出=Map(id->globalLabel) : 1->"Q"
export const makeById = (server: TimetablePayload) => {
  const m = new Map<number, string>();
  for (const ts of server.timeSlots) m.set(ts.id, ts.label);
  server.timeSlots.map((ts, i) => m.set(i, ts.label));
  return m;
};

// emptyGlobalGrid: 入=q,g／出=Map(globalLabel->[])
export const emptyGlobalGrid = (q: Quarter, g: Grade) => {
  const map = new Map<string, string[]>();
  for (const d of DAYS) for (const p of PERIODS) map.set(encodeGlobalLabel(q, g, d, p), []);
  return map;
};

// labelOfferings: 入=placement,byId, q,g／出=Map(globalLabel->offeringId[])
export const labelOfferings = (
  placement: Record<string, number[]>,
  byId: Map<number, string>,
  q: Quarter, g: Grade
) => {
  const map = emptyGlobalGrid(q, g);
  console.log("[labelOfferings] placement:", placement);
  for (const [offeringId, ids] of Object.entries(placement)) {
    for (const id of ids) {
      const gl = byId.get(id);
      if (gl && map.has(gl)) map.get(gl)!.push(offeringId);
    }
  }
  console.log("[labelOfferings]", map);
  return map;
};
