// components/Tabs/FunctionalButtons.tsx

'use client';

import DispCSVInfo from '@/app/components/MyCSV/DispCSVInfo';
import { translateArrayText } from '@/app/components/Assets/translateText';

export function FunctionalButton1({ Action4CSV, goods_head_data, Goods }: any) {
  return (
    <>
      {/* {ReadCSVButton((results: any) => Action4CSV(results))} */}
      {/* {excelWrite(goods_head_data, Goods)} */}
    </>
  );
}

export function FunctionalButton2({ fDispCSV, setDispCSV, loading, table_name, pinfo, setTableName, setServerInfo, Update, fCopy, setCopy, fUpdate, sinfo }: any) {
  return (
    <aside className="space-y-2">
      <button onClick={() => setDispCSV(!fDispCSV)} className="btn btn-blue">
        {fDispCSV ? '非表示' : 'header 表示'}
      </button>
      <button
        onClick={async () => {
          const res = await translateArrayText([table_name].concat(pinfo));
          setTableName(res.splice(0, 1)[0]);
          setServerInfo(res);
          Update(fUpdate + 10);
        }}
        className="btn btn-gray"
      >
        英訳
        {loading && <div className="ml-2 h-1 w-24 bg-blue-300 animate-pulse" />}
      </button>
      <button onClick={() => setCopy(true)} className="btn btn-outline">
        📋
      </button>
      {fDispCSV && (
        <DispCSVInfo
          info={sinfo}
          jinfo={pinfo}
          table_name={table_name || 'table_name'}
          setTableName={setTableName}
          fCopy={fCopy}
          fUpdate={fUpdate}
        />
      )}
    </aside>
  );
}

export function FunctionalButton3({ registerData }: any) {
  return (
    <button onClick={registerData} className="btn btn-green">
      3⃣ データベースに登録
    </button>
  );
}