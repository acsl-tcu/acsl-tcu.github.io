'use client';
import React from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import MediaDisplay from '@/app/components/MediaDisplay';
import { useState } from 'react';
import Image from "next/image";
import { MediaData } from "./ResearchInterface";

import Card from "./ApplicationCard";




function useAdjustData(table: string) {
  const year = new Date().getFullYear();
  console.log(table);
  const { rows, error } = useDB([table], year);
  const { locale } = useI18nContext();
  const lang = locale === 'en' ? '' : 'j';
  if (!rows || rows.length === 0)
    return { error };

  const data: MediaData[] = rows[0].map((row: Record<string, string>) => ({
    name: row.application_name,
    type: row.type,
    role: row.role,
    title: row[`${lang}title`],
    abstract: row[`${lang}abst`],
    figures: Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
      src: row[`figure${n}`],
      caption: row[`${lang}figure${n}_caption`],
    })).filter(f => f.src)
  })
  );
  return { data, error }
}

const Topic: React.FC<{ item: MediaData }> = ({ item }) => {
  const [showContent, setShowContent] = useState(false);
  return (
    <div key={item.title} className="max-w-4xl mx-auto p-4"><button className="text-xl font-semibold hover:underline  focus:outline-none"
      onClick={() => setShowContent((prev) => !prev)}>{item.title}</button>
      {
        showContent && (<div className={`mt-4 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <p className="mb-6 whitespace-pre-line text-gray-700">{item.abstract}</p>
          <MediaDisplay figures={item.figures} />
        </div>)
      }
    </div>
  );
}

const MethodList: React.FC = () => {
  const { data, error } = useAdjustData("method");

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;
  return (
    <>
      {data.map((item: MediaData) => <Topic key={item.title} item={item} />)
      }
    </>
  );
}

const ApplicationContents: React.FC<{ items: MediaData[] }> = ({ items }) => {

  if (!items || items.length === 0) return <div className="text-gray-500"></div>;

  return (
    <div id="app_content"
      key={items[0].name} className="max-w-4xl mx-auto p-4">
      <table className="min-w-full table-auto text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="relative w-1/5 h-auto p-3 border-b border-gray-200">
              <Image className="object-contain " fill src={`/images/${items[0].name}.jpg`} alt={items[0].name} /></th>
            <th className="p-3 border-b border-gray-200">{items[0].name}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td colSpan={2} className="p-3 border-b border-gray-100" >
                <Topic key={item.title} item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

const ApplicationList: React.FC = () => {
  const { data, error } = useAdjustData("application");
  const [contents, setContents] = useState<MediaData[]>([]);
  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;


  const groupedData: { [key: string]: MediaData[] } = data.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {} as { [key: string]: MediaData[] });

  return (
    <>
      {/* {Object.entries(groupedData).map(([name, items]) => (
        <>
          <ApplicationTable key={name} items={items} />
        </>
      ))} */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Object.entries(groupedData).map(([name, items]) => (
          <>
            <Card key={name} items={items} set={setContents} />
            <ApplicationContents key={name} items={contents} />
          </>
        ))}
      </ul>
    </>
  );
}


const ResearchPAGE: React.FC = () => {

  return (
    <div className="p-4 space-y-6">
      <h1 id="Method">Method</h1>
      <MethodList />
      <h1 id="Application">Application</h1>
      <ApplicationList />
    </div>
  );
};

export default ResearchPAGE;

