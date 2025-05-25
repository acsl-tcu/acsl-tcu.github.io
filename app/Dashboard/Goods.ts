export interface Good {
  id: string,
  number: string,
  department: string,
  responsiblePerson: string,
  no: string,
  name: string,
  standard: string,
  shop: string,
  price: string,
  accountItem: string,
  date: string,
  disposal: string,
  disposalReason: string,
  place: string,
  comment: string
}
// export const Good = {
//   number: "備品番号",
//   department: "所属名",
//   responsiblePerson: "担当者名",
//   no: "点数",
//   name: "品名",
//   standard: "型番",
//   shop: "取引先",
//   price: "取得金額",
//   accountItem: "科目",
//   date: "購入年月日",
//   disposal: "廃棄チェック",
//   disposalReason: "廃棄理由",
//   place: "B棟での設置場所",
//   comment: "備考"
// };
// const goods_actions = [
//   "number", //"department",
//   "responsiblePerson", //"no",
//   "name", "standard", "shop", "price", //"accountItem",
//   "date", "disposal", //"disposalReason",
//   "place", "comment"
// ];

export const GoodsColumns = [
  { key: 'number', label: "備品番号" },
  { key: 'department', label: "所属名" },
  { key: 'responsiblePerson', label: "担当者名" },
  { key: 'no', label: "点数" },
  { key: 'name', label: "品名" },
  { key: 'standard', label: "型番" },
  { key: 'shop', label: "取引先" },
  { key: 'price', label: "取得金額" },
  { key: 'accountItem', label: "科目" },
  { key: 'date', label: "購入年月日" },
  { key: 'disposal', label: "廃棄チェック" },
  { key: 'disposalReason', label: "廃棄理由" },
  { key: 'place', label: "B棟での設置場所" },
  { key: 'comment', label: "備考" },
] as const;

export const goods_table_title = '物品一覧';
