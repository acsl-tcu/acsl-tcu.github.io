'use client';

import { useState, useLayoutEffect, useReducer } from 'react';
import { TabPanel } from '../Assets/ForTabs';
import CRUDActions from '../Assets/CRUD';
import { Button } from '@/components/ui/button';

interface Props {
  table: string;
  value: number;
  index: number;
}

interface PhotoItem {
  img: string;
  title: string;
}

const itemData: PhotoItem[] = [
  { img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'Breakfast' },
  { img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d', title: 'Burger' },
  { img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', title: 'Camera' },
  { img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c', title: 'Coffee' },
  { img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8', title: 'Hats' },
  { img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62', title: 'Honey' },
  { img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6', title: 'Basketball' },
  { img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f', title: 'Fern' },
  { img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25', title: 'Mushrooms' },
  { img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af', title: 'Tomato basil' },
  { img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1', title: 'Sea star' },
  { img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6', title: 'Bike' },
];

const SPAPhotoTab = ({ table, value, index }: Props) => {
  const [CRUD, setCRUD] = useReducer(CRUDActions, { C: [], U: [], D: [] });
  const [photoItems, setPhotoItems] = useState<any[]>([]);
  const [pageError, setError] = useState<number | string>(0);
  const [fScan, setScan] = useState(false);

  const toggleScan = () => {
    setScan(!fScan);
  };

  useLayoutEffect(() => {
    fetch(table)
      .then(res => {
        if (!res.ok) {
          console.error('response.ok:', res.ok);
          console.error('response.status:', res.status);
          console.error('response.statusText:', res.statusText);
          setError("サーバーエラー");
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(json => setPhotoItems(json))
      .catch(error => {
        console.error("通信に失敗しました", error);
      });
  }, [table]);

  return (
    <TabPanel value={value} index={index}>
      <div className="flex justify-end mb-4">
        <Button onClick={toggleScan}>{fScan ? 'スキャン停止' : '連続スキャン'}</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[450px] overflow-y-auto">
        {itemData.map((item) => (
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
