export interface DataItem {
  id: number;
  [key: string]: unknown; // 必要に応じて詳細型に置き換えても良い
}

export interface CRUDState {
  C: number[]; // 作成対象のIDリスト
  U: number[]; // 更新対象のIDリスト
  D: number[]; // 削除対象のIDリスト
}

export interface CRUDInfo {
  type: 'C' | 'U' | 'D' | 'push_C' | 'push_U' | 'push_D' | 'push_R';
  id?: number[];
  C?: number[];
  U?: number[];
  D?: number[];
  Data?: DataItem[] | {
    data: DataItem[];
    files: File[];
  };
  table?: string;
  route?: string;
  Where?: Record<string, string | number | boolean>;
  set?: (data: DataItem[]) => void;
  setError?: (msg: string) => void;
}

