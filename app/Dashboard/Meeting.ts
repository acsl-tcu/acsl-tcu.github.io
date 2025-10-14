// DB => API変換関数
export const MeetingConvertToAPIFormat = (rows: MeetingDB[]): MeetingAPI[] =>
  rows.map(({ id, offeringId, timeslotId, roomId, note }) => ({
    id: id.toString(),
    offeringId,
    timeslotId,
    roomId: roomId ?? undefined,
    note: note ?? '',
  }));

// API => DB変換関数
export const MeetingConvertToDBFormat = (rows: MeetingAPI[]): MeetingDB[] =>
  rows.map(({ id, roomId, note, ...rest }) => ({
    id: Number(id),
    roomId: roomId ?? null,
    note: note || null,
    ...rest,
  }));

export interface MeetingAPI {
  id: string;
  offeringId: number;
  timeslotId: number;
  roomId?: number;
  note?: string;
}

export interface MeetingDB {
  id: number;
  offeringId: number;
  timeslotId: number;
  roomId?: number | null;
  note?: string | null;
}

export const MeetingColumns = [
  { key: 'id', label: 'ID' },
  { key: 'offeringId', label: 'Offering ID' },
  { key: 'timeslotId', label: 'TimeSlot ID' },
  { key: 'roomId', label: 'Room ID' },
  { key: 'note', label: 'Note' },
] as const;

export const meeting_table_title = "コマ一覧";
