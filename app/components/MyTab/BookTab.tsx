'use client';

import { useState, useLayoutEffect } from 'react';
import MyTable from '@/app/components/MyTable/MyTable';
import ReadCSVButton from '@/app/components/MyCSV/ReadCSVButton';
import { TabPanel } from '@/app/components/Assets/ForTabs';
import { CRUDActions } from '@/app/components/Assets/crudActions';
import excelWrite from '@/app/components/MyCSV/excelWrite';
import useInterval from '@/app/components/Assets/useInterval';
import { MyInput } from '@/app/components/MyTable/InputableCell';
import { RenderImageList, registerImages } from '@/app/components/MyTable/PhotoUploadButton';
import GetBookInfo from '@/app/components/MyBook/GetBookInfo';
import type { CRUDState, CRUDInfo, DataItem } from '../Assets/types';


interface BookTabProps {
  value: number;
  index: number;
  table: string;
}

const BookTab = ({ value, index, table }: BookTabProps) => {
  const [crudState, setCrudState] = useState<CRUDState>({ C: [], U: [], D: [] });
  const [imageCrudState, setImageCrudState] = useState<CRUDState>({ C: [], U: [], D: [] });

  const [images, setImage] = useState<Record<number, { image: string; type: string }[]>>({});
  const [Book, setBook] = useState<DataItem[]>([]);
  const [Book0, setBook0] = useState<DataItem[]>([]);
  const [fUpdate, Update] = useState(0);
  const [pageError, setError] = useState<number | string>(0);
  const [fScan, Scan] = useState(0);
  const delay = 1000;

  const book_data: Omit<DataItem, 'id'> = {
    isbn: "ISBN(必須)",
    title: "書名",
    author: "著者",
    overview: "概要",
    publisher: "出版社"
  };

  const book_actions = Object.keys(book_data) as (keyof DataItem)[];
  const book_head_data = Object.fromEntries(book_actions.map(k => [k, book_data[k]])) as Record<string, string>;

  const setCRUD = async (info: CRUDInfo) => {
    const nextState = await CRUDActions(crudState, info);
    setCrudState(nextState);
  };
  const setImageCRUD = async (info: CRUDInfo) => {
    const nextState = await CRUDActions(imageCrudState, info);
    setImageCrudState(nextState);
  };

  const book_checker = async (book: DataItem): Promise<DataItem | false> => {
    if (!book.isbn) return false;
    let tbook = { ...book };
    if (!book.title) {
      const { book: info, image } = await GetBookInfo(book.isbn);
      if (image) {
        setImage(prev => ({ ...prev, [book.id]: [{ image, type: 'URL' }] }));
      }
      tbook = { ...info, id: book.id };
    }
    return tbook;
  };

  useLayoutEffect(() => {
    setCRUD({
      type: 'push_R',
      table,
      set: (json: DataItem[]) => {
        setBook(json);
        setBook0(json);
      },
      setError,
    });
  }, [fScan]);

  const ReadCSV2GoodsTable = (results: { data: string[][] }) => {
    const filtered = results.data.filter(row => row[0] !== 'ISBN(必須)' && row[0]);
    const mapped: DataItem[] = filtered.map((row, i) => {
      const item: Partial<DataItem> = { id: i };
      book_actions.forEach((k, j) => item[k] = row[j] ?? '');
      return item as DataItem;
    });
    setCRUD({ type: 'C', id: mapped.map(i => i.id) });
    setBook(mapped);
    Update(v => v + 1);
  };

  useInterval(() => {
    Book.forEach(async (item) => {
      if (!item.title) {
        setCRUD({ type: 'U', id: [item.id] });
        const updated = await book_checker(item);
        if (updated) {
          setBook(prev => prev.map(b => (b.id === item.id ? updated : b)));
        }
      }
    });
    Scan(v => v + 1);
  }, delay, fScan !== 0);

  const registerData = () => {
    setCRUD({ type: 'push_C', table, Data: Book });
    Object.entries(images).forEach(([tidStr, imgs]) => {
      const tid = parseInt(tidStr);
      registerImages(
        { preventDefault: () => { } },
        [{ file: imgs[0].image, id: 0, type: 'URL' }],
        { C: [0] },
        setImageCRUD,
        table,
        tid
      );
    });
  };

  const flistForBook = {
    FunctionalButton1: () => (
      <button className="btn btn-success" onClick={() => (fScan ? Scan(0) : Scan(1))}>
        {fScan ? 'スキャン停止' : '連続スキャン'}
      </button>
    ),
    FunctionalButton2: () => (
      <button className="btn btn-blue" onClick={registerData}>
        データベースに登録
      </button>
    ),
    FunctionalButton3: () => (
      <>
        {ReadCSVButton(results => ReadCSV2GoodsTable(results))}
        {excelWrite(book_head_data, Book)}
      </>
    )
  };

  const SingleView = ({
    item,
    fEdit,
    onChange,
    inputRefs
  }: {
    item: DataItem;
    fEdit: boolean;
    onChange: (key: string, value: string) => void;
    inputRefs: Record<string, React.RefObject<HTMLInputElement>>;
  }) => (
    <tr>
      <td />
      <td colSpan={book_actions.length}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {book_actions.map((act, i) => (
            <div key={i}>
              <label>{book_data[act]}</label>
              <MyInput
                id={item.id}
                fEdit={fEdit}
                value={item[act]}
                default={book_data[act]}
                onChange={(v) => onChange(act, v)}
                ref={inputRefs[act]}
                update={fEdit}
                maxRows={5}
              />
            </div>
          ))}
        </div>
        <RenderImageList item={item} table={table} Images={images[item.id] ?? []} />
      </td>
    </tr>
  );

  return (
    <TabPanel value={value} index={index}>
      <MyTable
        actions={book_actions}
        head_data={book_head_data}
        checker={book_checker}
        setCRUD={setCRUD}
        flist={flistForBook}
        Data={Book}
        Data0={Book0}
        Update={Update}
        fUpdate={fUpdate}
        setData={setBook}
        setData0={setBook0}
        pageError={pageError}
        detailedItem={book_data}
        SV={SingleView}
      />
    </TabPanel>
  );
};

export default BookTab;
