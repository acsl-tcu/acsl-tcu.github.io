// components/Tabs/useGoodsTableLogic.ts

'use client';

import { useState, useLayoutEffect, useReducer } from 'react';
import { CRUDState, CRUDInfo } from '@/app/Assets/types';
import { CRUDActions } from '@/app/Assets/crudActions';

export function useGoodsTableLogic(initialTableName?: string) {
  const [table_name, setTableName] = useState(initialTableName || '');
  const [CRUD, dispatch] = useReducer(CRUDActions, { C: [], U: [], D: [] } as CRUDState);

  const [Goods, setGoods] = useState([]);
  const [Goods0, setGoods0] = useState([]);
  const [fUpdate, Update] = useState(0);
  const [pageError] = useState(0);

  const [sinfo, setServerInfo] = useState([]);
  const [dinfo, setDataInfo] = useState([]);
  const [pinfo, setPrintInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const [goods_data, setData] = useState({});
  const [goods_actions, setAction] = useState<string[]>([]);
  const [goods_head_data, setHeadData] = useState({});

  const [fDispCSV, setDispCSV] = useState(false);
  const [fCopy, setCopy] = useState(false);

  useLayoutEffect(() => {
    const tdata: any = {};
    const thead: any = {};
    const tactions: string[] = [];
    dinfo.forEach((item, i) => {
      tdata[item] = pinfo[i];
      tactions.push(item);
    });
    tactions.forEach((item) => {
      thead[item] = tdata[item];
    });
    setData(tdata);
    setAction(tactions);
    setHeadData(thead);
    Update((prev) => prev + 1);
  }, [dinfo]);

  const goods_checker = (goods: any) => true;

  const mapArrayToWorkItem = (keys: string[], data: any[][]) => {
    const transpose = (a: any[][]) => a[0].map((_, c) => a.map((r) => r[c]));
    return data
      .filter((row) => row.length === keys.length)
      .map((row, index) =>
        Object.assign({ id: index }, Object.fromEntries(transpose([keys, row])))
      );
  };

  const Action4CSV = (results: any) => {
    const tsinfo = results.data.splice(0, 1);
    const finfo = Object.values(tsinfo[0]);
    const ttsinfo = results.data.splice(0, 1);
    const sinfo = Object.values(ttsinfo[0]);

    setServerInfo(finfo);
    setDataInfo(finfo);
    setPrintInfo(sinfo);

    setGoods(mapArrayToWorkItem(finfo, results.data));
    dispatch({ type: 'C', id: [...Array(results.data.length).keys()] });
    Update((prev) => prev + 1);
  };

  const registerData = () => {
    dispatch({ type: 'push_C', all: 1, table: table_name, Data: Goods });
  };

  const SingleView = () => { };

  return {
    table_name,
    setTableName,
    Goods,
    setGoods,
    Goods0,
    setGoods0,
    fUpdate,
    Update,
    pageError,
    sinfo,
    setServerInfo,
    dinfo,
    setDataInfo,
    pinfo,
    setPrintInfo,
    loading,
    setLoading,
    goods_data,
    goods_actions,
    goods_head_data,
    setAction,
    setHeadData,
    fDispCSV,
    setDispCSV,
    fCopy,
    setCopy,
    Action4CSV,
    registerData,
    SingleView,
    goods_checker,
    setCRUD: dispatch
  };
}