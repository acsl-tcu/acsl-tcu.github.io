'use client';

import { useState, useLayoutEffect, memo } from 'react';
import MyTable from '@/app/components/MyTable/MyTable';
import ReadCSVButton from '@/app/components/MyCSV/ReadCSVButton';
import { TabPanel } from '@/app/components/Assets/ForTabs';
import { CRUDActions } from '@/app/components/Assets/crudActions';
import DeleteItemsForItem from '@/app/components/Assets/DeleteItemsForItem';
import excelWrite from '@/app/components/MyCSV/excelWrite';
import { MyInput } from '@/app/components/MyTable/InputableCell';
import RenderImageList from '@/app/components/MyTable/PhotoUploadButton';
import type { CRUDState, CRUDInfo } from '../Assets/types';

interface GoodsTabProps {
  value: number;
  index: number;
}

interface GoodsItem {
  id: number;
  number: string;
  department: string;
  responsiblePerson: string;
  no: string;
  name: string;
  standard: string;
  shop: string;
  price: string;
  accountItem: string;
  date: string;
  disposal: string;
  disposalReason: string;
  place: string;
  comment: string;
}

const GoodsTab = memo(({ value, index }: GoodsTabProps) => {
  const table_name = 'goods';
  const [CRUD, setCrudState] = useState<CRUDState>({ C: [], U: [], D: [] });
  const [imageCRUD, setImageCrudState] = useState<CRUDState>({ C: [], U: [], D: [] });

  const setCRUD = async (info: CRUDInfo) => {
    const nextState = await CRUDActions(CRUD, info);
    setCrudState(nextState);
  };
  const setImageCRUD = async (info: CRUDInfo) => {
    const nextState = await CRUDActions(imageCRUD, info);
    setImageCrudState(nextState);
  };

  const [Goods, setGoods] = useState<GoodsItem[]>([]);
  const [Goods0, setGoods0] = useState<GoodsItem[]>([]);
  const [fUpdate, Update] = useState(0);
  const [pageError, setError] = useState(0);

  const goods_data: Omit<GoodsItem, 'id'> = {
    number: '備品番号',
    department: '所属名',
    responsiblePerson: '担当者名',
    no: '点数',
    name: '品名',
    standard: '型番',
    shop: '取引先',
    price: '取得金額',
    accountItem: '科目',
    date: '購入年月日',
    disposal: '廃棄チェック',
    disposalReason: '廃棄理由',
    place: 'B棟での設置場所',
    comment: '備考'
  };

  const goods_actions = [
    'number', 'responsiblePerson', 'name', 'standard', 'shop',
    'price', 'date', 'disposal', 'place', 'comment'
  ] as const;

  const goods_head_data = Object.fromEntries(
    goods_actions.map((k) => [k, goods_data[k]])
  );

  const goods_checker = (goods: GoodsItem): GoodsItem | false => {
    return (goods.name && goods.standard && goods.price && goods.date) ? goods : false;
  };

  useLayoutEffect(() => {
    setCRUD({
      type: 'push_R',
      table: table_name,
      set: (json: GoodsItem[]) => {
        setGoods(json);
        setGoods0(json);
        Update((v) => v + 1);
      },
      setError,
    });
  }, []);

  const ReadCSV2GoodsTable = (results: { data: string[][] }) => {
    const data = results.data.filter(row => row[0] !== '備品番号' && row[0]);
    const mapped: GoodsItem[] = data.map((row, i) => {
      const obj: Partial<GoodsItem> = { id: i };
      Object.keys(goods_data).forEach((key, j) => {
        obj[key as keyof GoodsItem] = row[j];
      });
      return obj as GoodsItem;
    });
    setCRUD({ type: 'C', id: mapped.map((item) => item.id) });
    setGoods(mapped);
    Update((v) => v + 1);
  };

  const registerData = () => {
    DeleteItemsForItem(CRUD.D, 'images', table_name, setImageCRUD);
    setCRUD({ type: 'push_C', table: table_name, Data: Goods });
  };

  const flistForGoods = {
    FunctionalButton2: () => (
      <button className="btn btn-blue" onClick={registerData}>データベースに登録</button>
    ),
    FunctionalButton3: () => (
      <>
        {ReadCSVButton((results) => ReadCSV2GoodsTable(results))}
        {excelWrite(goods_head_data, Goods)}
      </>
    )
  };

  const SingleView = ({ item, fEdit, onChange, inputRefs }: {
    item: GoodsItem;
    fEdit: boolean;
    onChange: (key: keyof GoodsItem, value: string) => void;
    inputRefs: Record<string, React.RefObject<HTMLInputElement>>;
  }) => (
    <tr className="border-t">
      <td></td>
      <td colSpan={goods_actions.length} className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Object.keys(goods_data).map((act, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">{goods_data[act as keyof typeof goods_data]}</label>
              <MyInput
                id={item.id}
                fEdit={fEdit}
                value={item[act as keyof GoodsItem]}
                default={goods_data[act as keyof typeof goods_data]}
                onChange={(v) => onChange(act as keyof GoodsItem, v)}
                ref={inputRefs[act]}
                update={fEdit}
              />
            </div>
          ))}
        </div>
        <RenderImageList item={item} table={table_name} Images={[]} />
      </td>
    </tr>
  );

  return (
    <TabPanel value={value} index={index}>
      <MyTable
        actions={goods_actions}
        head_data={goods_head_data}
        checker={goods_checker}
        setCRUD={setCRUD}
        flist={flistForGoods}
        Data={Goods}
        Data0={Goods0}
        Update={Update}
        fUpdate={fUpdate}
        setData={setGoods}
        setData0={setGoods0}
        pageError={pageError}
        detailedItem={goods_data}
        SV={SingleView}
      />
    </TabPanel>
  );
});

export default GoodsTab;
