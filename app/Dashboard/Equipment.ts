// | 日本語カラム名 | 英語カラム名（snake\_case）        |
// | ------- | -------------------------- |
// | 備品番号 | item\_number |
// | 部門名 | division\_name |
// | 所属名 | affiliation\_name |
// | 部署名 | department\_name |
// | 担当者名 | person\_in\_charge |
// | 点数 | quantity |
// | 品名 | item\_name |
// | 型番 | model\_number |
// | 取引先 | vendor |
// | 取得金額 | acquisition\_amount |
// | 科目 | account\_category |
// | 年号 | era |
// | 年度(和暦) | fiscal\_year\_japanese |
// | 年度(西暦) | fiscal\_year\_western |
// | 購入年月日 | purchase\_date |
// | 耐用年数 | useful\_life |
// | 期 | term |
// | 予算 | budget |
// | 予算（補足）  | budget\_note |
// | 審議書No | approval\_document\_number |
interface Column<T> {
  key: keyof T;
  label: string;
}
export const EquipmentColumns: Column<Equipment>[] = [
  { key: 'itemNumber', label: '備品番号' },
  { key: 'divisionName', label: '部門名' },
  { key: 'affiliationName', label: '所属名' },
  { key: 'departmentName', label: '部署名' },
  { key: 'personInCharge', label: '担当者名' },
  { key: 'quantity', label: '点数' },
  { key: 'itemName', label: '品名' },
  { key: 'modelNumber', label: '型番' },
  { key: 'vendor', label: '取引先' },
  { key: 'acquisitionAmount', label: '取得金額' },
  { key: 'accountCategory', label: '科目' },
  { key: 'era', label: '年号' },
  { key: 'fiscalYearJapanese', label: '年度(和暦)' },
  { key: 'fiscalYearWestern', label: '年度(西暦)' },
  { key: 'purchaseDate', label: '購入年月日' },
  { key: 'usefulLife', label: '耐用年数' },
  { key: 'term', label: '期' },
  { key: 'budget', label: '予算' },
  { key: 'budgetNote', label: '予算（補足）' },
  { key: 'approvalDocumentNumber', label: '審議書No' },
  { key: 'imageUrl', label: '画像URL' },
  { key: 'place', label: '設置場所' },
  { key: 'responsiblePerson', label: '担当者名' },
  { key: 'date', label: '日付' },
  { key: 'disposal', label: '廃棄チェック' },
  { key: 'disposalReason', label: '廃棄理由' },
  { key: 'comment', label: '備考' }
];
export const equipment_table_title = '備品一覧';

export interface Equipment {
  itemNumber: string;                    // 備品番号
  divisionName: string;                 // 部門名
  affiliationName: string;             // 所属名
  departmentName: string;              // 部署名
  personInCharge: string;              // 担当者名
  quantity: number;                    // 点数
  itemName: string;                    // 品名
  modelNumber: string;                 // 型番
  vendor: string;                      // 取引先
  acquisitionAmount: number;          // 取得金額
  accountCategory: string;            // 科目
  era?: string;                        // 年号
  fiscalYearJapanese?: string;        // 年度(和暦)
  fiscalYearWestern: string;          // 年度(西暦)
  purchaseDate: string;               // 購入年月日
  usefulLife: number;                 // 耐用年数
  term: string;                       // 期
  budget: number;                     // 予算
  budgetNote?: string;                // 予算（補足）
  approvalDocumentNumber?: string;    // 審議書No
  imageUrl?: string;                  // 画像URL
  place?: string;                     // 設置場所（オプション）
  responsiblePerson?: string;         // 担当者名（オプション）
  date?: string;                      // 日付（オプション）
  disposal?: boolean;                 // 廃棄チェック（オプション）
  disposalReason?: string;            // 廃棄理由（オプション）
  comment?: string;                   // 備考（オプション）
}

export const equipmentKeys = ['itemNumber', 'divisionName', 'affiliationName', 'departmentName', 'personInCharge', 'quantity', 'itemName', 'modelNumber', 'vendor', 'acquisitionAmount', 'accountCategory', 'era', 'fiscalYearJapanese', 'fiscalYearWestern', 'purchaseDate', 'usefulLife', 'term', 'budget', 'budgetNote', 'approvalDocumentNumber', 'imageUrl', 'place', 'responsiblePerson', 'date', 'disposal', 'disposalReason', 'comment'
] as const;


const EquipmentColumnsStaff = [
  'itemNumber',
  'quantity',
  'itemName',
  'modelNumber',
  'vendor',
  'acquisitionAmount',
  'accountCategory',
  'purchaseDate',
  'budget',
  'budgetNote',
  'place',
  'responsiblePerson',
  'date',
  'disposal',
  'disposalReason',
  'comment'
];
export const EquipmentColumnsStaffHide = equipmentKeys.filter(key => !EquipmentColumnsStaff.includes(key));

const EquipmentColumnsStudent = [
  'itemNumber',
  'quantity',
  'itemName',
  'modelNumber',
  'purchaseDate',
  'budget',
  'place',
  'responsiblePerson',
  'date',
  'disposal',
  'comment'
];
export const EquipmentColumnsStudentHide = equipmentKeys.filter(key => !EquipmentColumnsStudent.includes(key));
