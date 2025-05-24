// utils/types.ts

export interface CRUDState {
  C: any[];
  U: any[];
  D: any[];
}

export interface CRUDInfo {
  type: 'C' | 'U' | 'D' | 'push_C' | 'push_U' | 'push_D' | 'push_R';
  id?: number;
  C?: any[];
  U?: any[];
  D?: any[];
  Data?: any;
  table?: string;
  route?: string;
  Where?: string;
  set?: (data: any) => void;
  setError?: (msg: string) => void;
}
