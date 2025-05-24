'use client';

import { useState, useLayoutEffect, useReducer, useMemo } from 'react';
import MyTable from '@/app/components/MyTable/MyTable';
import ReadCSVButton from '@/app/components/MyCSV/ReadCSVButton';
import { TabPanel } from '@/app/components/Assets/ForTabs';
import { CRUDActions } from '@/app/components/Assets/crudActions';
import excelWrite from '@/app/components/MyCSV/excelWrite';
import useInterval from '@/app/components/Assets/useInterval';
import { MyInput } from '@/app/components/MyTable/InputableCell';
import { RenderImageList, registerImages } from '@/app/components/MyTable/PhotoUploadButton';
import GetBookInfo from '@/app/components/MyBook/GetBookInfo';

interface BookTabProps {
  value: number;
  index: number;
  table: string;
}

const BookTab = ({ value, index, table }: BookTabProps) => {
  const [CRUD, setCRUD] = useReducer(CRUDActions, { C: [], U: [], D: [] });
  const [imageCRUD, setImageCRUD] = useReducer(CRUDActions, { C: [], U: [], D: [] });
  const [images, setImage] = useState<Record<string, any[]>>({});
  const [Book, setBook] = useState<any[]>([]);
  const [Book0, setBook0] = useState<any[]>([]);
  const [fUpdate, Update] = useState(0);
  const [pageError, setError] = useState(0);
  const [fScan, Scan] = useState(0);
  const delay = 1000;

  const book_data = {
    isbn: "ISBN(必須)",
    title: "書名",
    author: "著者",
    overview: "概要",
    publisher: "出版社"
  };

  const book_actions = Object.keys(book_data);
  const book_head_data = Object.fromEntries(
    book_actions.map((k) => [k, book_data[k]])
  );

  const book_checker = async (book: any) => {
    if (!book.isbn) return false;
    let tbook = { ...book };
    if (!book.title) {
      tbook = await GetBookInfo(book.isbn).then(json => {
        if (json.image) {
          setImage((prev) => ({ ...prev, [book.id]: [{ image: json.image, type: 'URL' }] }));
        }
        return json.book;
      });
    }
    return { ...tbook, id: book.id };
  };

  useLayoutEffect(() => {
    setCRUD({
      type: 'push_R',
      table,
      set: (json: any[]) => {
        setBook(json);
        setBook0(json);
      },
      setError,
    });
  }, [fScan]);

  const ReadCSV2GoodsTable = (results: any) => {
    const data = results.data.filter((row: string[]) => row[0] !== 'ISBN(必須)' && row[0]);
    const mapped = data.map((row: string[], i: number) => {
      const obj: any = { id: i };
      book_actions.forEach((k, j) => obj[k] = row[j]);
      return obj;
    });
    setCRUD({ type: 'C', id: mapped.map((_, i) => i) });
    setBook(mapped);
    Update((v) => v + 1);
  };

  useInterval(() => {
    const tmp = [...Book];
    tmp.forEach(async (item) => {
      if (!item.title) {
        setCRUD({ type: 'U', id: item.id });
        const updated = await book_checker(item);
        setBook((prev) =>
          prev.map((b) => (b.id === item.id ? updated : b))
        );
      }
    });
    Scan((v) => v + 1);
  }, delay, fScan);

  const registerData = () => {
    console.log('Delete item:', CRUD.D);
    setCRUD({ type: 'push_C', all: 1, table, Data: Book });
    Object.entries(images).forEach(([tid, imgs]) => {
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
      <button
        className="btn btn-success"
        onClick={() => (fScan ? Scan(0) : Scan(1))}
      >
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
        {ReadCSVButton((results) => ReadCSV2GoodsTable(results))}
        {excelWrite(book_head_data, Book)}
      </>
    )
  };

  const SingleView = ({ item, fEdit, onChange, inputRefs }: any) => (
    <tr className="border-t">
      <td></td>
      <td colSpan={book_actions.length} className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {book_actions.map((act, i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-1">{book_data[act]}</label>
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
        <RenderImageList item={item} table={table} Images={images[item.id] || []} />
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