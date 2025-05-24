'use client';

import { Fragment, useState, createRef, useLayoutEffect, memo } from 'react';
import InputableCell from './InputableCell';

function min(a: number, b: number): number {
  return a > b ? b : a;
}

const useFunctionalRow = (props: any) => {
  const [item, setItem] = useState(props.data);
  const [edittingItem, setEdditingItem] = useState(props.data);
  const [fEdit, setFlag] = useState(0);
  const [fOpenSV, setOpenSV] = useState(0);
  const [fStyle, setStyle] = useState(props.GInfo.actions.length > 5 && props.index % 2 === 0);

  const N = props.GInfo.actions.length > 5
    ? min(10, Math.ceil(props.GInfo.actions.length / 2))
    : 5;

  return [item, setItem, N, fEdit, setFlag, edittingItem, setEdditingItem, fOpenSV, setOpenSV, fStyle];
};

const EditItemView = ({ item, GInfo, onChange, N, type }: any) => {
  return new Array(2).fill(null).map((_, i) => (
    <tr key={`${i}-${type}`} className="border-t">
      {GInfo.actions.slice(i * N, (i + 1) * N).map((act: string, index: number) => (
        <td key={index} className="p-1">
          <InputableCell
            id={`${type}-${i}-${index}`}
            fEdit={1}
            value={item[act]}
            default={GInfo.head[act]}
            onChange={(v: any) => onChange(act, v)}
            update={GInfo.fUpdate}
          />
        </td>
      ))}
    </tr>
  ));
};

export const Row = memo((props: any) => {
  const [item, setItem, N, fEdit, setFlag, edittingItem, setEdditingItem, fOpenSV, setOpenSV, fStyle] = useFunctionalRow(props);
  useLayoutEffect(() => setItem(props.data), [props.data]);

  const inputRefs = Object.fromEntries(
    Object.keys(props.GInfo.detailedItem).map((act) => [act, createRef()])
  );

  const handleEdit = () => setFlag(!fEdit);
  const handleUpdate = () => {
    setItem({ ...edittingItem });
    props.GInfo.setCRUD({ type: "U", id: item.id });
    const updated = [...props.GInfo.Data];
    updated.splice(updated.findIndex((i) => i.id === item.id), 1, edittingItem);
    props.GInfo.setData(updated);
    setFlag(0);
  };
  const handleQuit = () => setFlag(0);
  const handleDelete = () => {
    const filtered = props.GInfo.Data.filter((i) => i.id !== item.id);
    props.GInfo.setCRUD({ type: "D", id: item.id });
    props.GInfo.setData(filtered);
    props.GInfo.Update((v: any) => v + 1);
  };
  const onChange = (act: string, v: any) => {
    const list = { ...edittingItem };
    list[act] = v;
    setEdditingItem(list);
  };

  return (
    <Fragment>
      <tr className="border-t">
        <td rowSpan={fStyle ? 4 : 3} className="p-2 text-center">
          <button onClick={() => setOpenSV(!fOpenSV)} className="text-blue-600 font-bold">
            {item.id}
          </button>
          <div className="space-x-1 mt-1">
            <button onClick={fEdit ? handleUpdate : handleEdit} className="btn btn-xs btn-blue">
              {fEdit ? '更新' : '編集'}
            </button>
            <button onClick={fEdit ? handleQuit : handleDelete} className={`btn btn-xs ${fEdit ? 'btn-gray' : 'btn-red'}`}>
              {fEdit ? '中止' : '削除'}
            </button>
          </div>
        </td>
      </tr>
      {[0, 1].map((i) => (
        <tr key={i} className="border-t">
          {props.GInfo.actions.slice(i * N, (i + 1) * N).map((act: string, index: number) => (
            <td key={index} className="p-1">
              <InputableCell
                id={`${item.id}_${N * i}`}
                fEdit={fEdit && !fOpenSV}
                value={item[act]}
                default={props.GInfo.head[act]}
                onChange={(v: any) => onChange(act, v)}
                ref={inputRefs[act]}
                rowInRow={i}
                update={fEdit}
              />
            </td>
          ))}
        </tr>
      ))}
      {fOpenSV >= 1 && props.SV && (
        <tr>
          <td colSpan={N * 2}>
            <props.SV item={item} fEdit={fEdit} onChange={onChange} inputRefs={inputRefs} />
          </td>
        </tr>
      )}
    </Fragment>
  );
});

export const SearchRow = (props: any) => {
  const item0 = { ...props.data };
  Object.keys(item0).forEach((k) => (item0[k] = ""));
  const [item, setItem, N] = useFunctionalRow({ ...props, data: item0 });

  const ResetItem = () => {
    props.GInfo.setData(props.GInfo.Data0);
    props.GInfo.Update((v: any) => v + 1);
    setItem(item0);
  };

  const onChange = (act: string, v: any) => {
    const titem = { ...item, [act]: v };
    const filtered = props.GInfo.Data0.filter((row: any) =>
      Object.keys(titem)
        .filter((key) => titem[key] !== "")
        .every((key) => row[key]?.includes(titem[key]))
    );
    setItem(titem);
    props.GInfo.setData(filtered);
    props.GInfo.Update((v: any) => v + 1);
  };

  return (
    <Fragment>
      <tr>
        <td rowSpan={4} className="bg-black text-white text-center px-2 py-1">
          <button onClick={ResetItem} className="text-xs font-bold">
            REFRESH SEARCH 🔄
          </button>
        </td>
      </tr>
      <EditItemView item={item} GInfo={props.GInfo} onChange={onChange} N={N} type="search" />
    </Fragment>
  );
};

export const CreateRow = (props: any) => {
  const item0 = { ...props.data };
  Object.keys(item0).forEach((k) => (item0[k] = ""));
  const [item, setItem, N] = useFunctionalRow({ ...props, data: item0 });

  const onChange = (act: string, v: any) => {
    const titem = { ...item, [act]: v };
    setItem(titem);
    props.GInfo.Update((v: any) => v + 1);
  };

  const AddItem = async () => {
    let tmpitem = { ...item };
    const tmp = [...props.GInfo.Data0];
    tmpitem.id = tmp.length > 0 ? tmp[tmp.length - 1].id + 1 : 0;
    tmpitem = await props.GInfo.checker(tmpitem);
    if (tmpitem) {
      props.GInfo.setCRUD({ type: "C", id: tmpitem.id });
      tmp.push(tmpitem);
      props.GInfo.setData(tmp);
      props.GInfo.setData0(tmp);
      setItem(item0);
    }
    props.GInfo.Update((v: any) => v + 1);
  };

  return (
    <Fragment>
      <tr>
        <td rowSpan={3} className="text-center">
          <button onClick={AddItem} className="btn btn-outline btn-sm">追加</button>
        </td>
      </tr>
      <EditItemView item={item} GInfo={props.GInfo} onChange={onChange} N={N} type="create" />
    </Fragment>
  );
};
