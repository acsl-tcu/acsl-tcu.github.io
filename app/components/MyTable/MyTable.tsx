'use client';

import { useState, useMemo } from 'react';
import { Row, SearchRow, CreateRow } from './FunctionalRow';
import MyTablePagination from './MyPagination';

interface MyTableProps {
  actions: string[];
  head_data: any;
  checker: (arg: any) => boolean;
  setCRUD: React.Dispatch<any>;
  flist: Record<string, () => JSX.Element>;
  Data: any[];
  setData: (v: any[]) => void;
  Data0: any[];
  setData0: (v: any[]) => void;
  fUpdate: number;
  Update: React.Dispatch<React.SetStateAction<number>>;
  pageError: number;
  detailedItem: any;
  SV: any;
}

export default function MyTable({
  actions,
  head_data,
  checker,
  setCRUD,
  flist,
  Data,
  setData,
  Data0,
  setData0,
  fUpdate,
  Update,
  pageError,
  detailedItem,
  SV
}: MyTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const GInfo = {
    actions,
    flist,
    checker,
    setCRUD,
    head: head_data,
    Update,
    fUpdate,
    Data,
    Data0,
    setData,
    setData0,
    detailedItem,
    SV,
  };

  const RenderTableHead = useMemo(
    () => <SearchRow key="search-row" data={detailedItem} GInfo={GInfo} />, [fUpdate]
  );

  const RenderTable = useMemo(() => {
    if (Data.length === 0 || pageError !== 0) return null;
    return (rowsPerPage > 0
      ? Data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : Data
    ).map((item, index) => (
      <Row key={`BasicRow_${item.id}_${index}`} index={index} data={item} GInfo={GInfo} SV={SV} />
    ));
  }, [fUpdate, Data]);

  const RenderAddItemRow = useMemo(() => (
    <>
      <CreateRow key="new-item" data={detailedItem} GInfo={GInfo} />
      {pageError !== 0 && (
        <tr>
          <td colSpan={6} className="text-center text-red-600 font-semibold py-2">
            サーバーエラー: {pageError}
          </td>
        </tr>
      )}
    </>
  ), [pageError]);

  const RenderTableFooter = useMemo(() => (
    <MyTablePagination
      count={Data.length}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={(e: any, newPage: number) => {
        Update((prev) => prev + 1);
        setPage(newPage);
      }}
      handleChangeRowsPerPage={(e: React.ChangeEvent<HTMLSelectElement>) => {
        Update((prev) => prev + 1);
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
  ), [rowsPerPage, page, fUpdate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>{flist.FunctionalButton1?.()}</div>
        <div>{flist.FunctionalButton2?.()}</div>
        <div>{flist.FunctionalButton3?.()}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded shadow bg-white">
          <thead className="bg-gray-100 border-b">
            {RenderTableHead}
          </thead>
          <tbody>
            {RenderTable}
            {RenderAddItemRow}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        {RenderTableFooter}
      </div>
    </div>
  );
}