'use client';

import { useState, useLayoutEffect } from 'react';
import { TabPanel } from '../Assets/ForTabs';
// import { CRUDActions } from '../Assets/crudActions';
// import type { CRUDState, CRUDInfo } from '../Assets/types';

interface Props {
  table: string;
  value: number;
  index: number;
}

interface PhotoItem {
  img: string;
  title: string;
}

const SPAPhotoTab = ({ table, value, index }: Props) => {
  // const [crudState, setCrudState] = useState<CRUDState>({ C: [], U: [], D: [] });

  // const handleCRUD = async (info: CRUDInfo) => {
  //   const nextState = await CRUDActions(crudState, info);
  //   setCrudState(nextState);
  // };
  // const [CRUD, setCRUD] = useReducer(CRUDActions, { C: [], U: [], D: [] });
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([]);
  const [pageError, setError] = useState<number | string>(0);
  const [fScan, setScan] = useState(false);

  const toggleScan = () => {
    setScan(prev => !prev);
  };

  useLayoutEffect(() => {
    fetch(table)
      .then(res => {
        if (!res.ok) {
          console.error('response.ok:', res.ok);
          console.error('response.status:', res.status);
          console.error('response.statusText:', res.statusText);
          setError('サーバーエラー');
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((json: PhotoItem[]) => setPhotoItems(json))
      .catch(error => {
        console.error('通信に失敗しました', error, pageError);
      });
  }, [table]);

  return (
    <TabPanel value={value} index={index}>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleScan}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded border text-sm"
        >
          {fScan ? 'スキャン停止' : '連続スキャン'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[450px] overflow-y-auto">
        {photoItems.map((item) => (
          <div key={item.img} className="rounded overflow-hidden shadow-sm">
            <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              className="w-full h-auto object-cover aspect-square"
            />
            <p className="text-center text-xs text-gray-600 mt-1">{item.title}</p>
          </div>
        ))}
      </div>
    </TabPanel>
  );
};

export default SPAPhotoTab;
