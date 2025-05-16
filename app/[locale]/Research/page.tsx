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
    <div key={item.title} className="border border-gray-200 rounded-md shadow-sm"><button className="w-full flex justify-between items-center px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors duration-300"
      onClick={() => setShowContent((prev) => !prev)}><span className="text-lg font-semibold text-gray-800">{item.title}</span>
      <svg
        className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${showContent ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
      <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${showContent ? 'max-h-screen mb-2' : 'max-h-0'
        }`}>
        {
          showContent && 
          (<div className={`mt-0 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <p className="px-4 py-3 bg-gray-200 text-gray-700">{item.abstract}</p>
            <MediaDisplay figures={item.figures} />
          </div>)
        }
      </div>
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
    <div
    id="app_content"
    key={items[0].name}
    className="scroll-mt-15 min-h-[calc(100vh-60px)] pb-15 mx-auto p-6"
  >
    <table className="w-full table-auto border-collapse rounded-2xl overflow-hidden shadow-md bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="relative w-1/5 p-0 border-b border-gray-200">
            <div className="relative w-full h-full">
              <Image
                className="object-cover w-full aspect-square rounded-tl-2xl"
                fill
                src={`/images/${items[0].name}.jpg`}
                alt={items[0].name}
              />
            </div>
          </th>
          <th className="p-4 border-b border-gray-200 text-xl font-semibold text-gray-800">
          <h3 >{items[0].name.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
            <td colSpan={2} className="p-4 border-b border-gray-100">
              <Topic key={item.title} item={item} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>  
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
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {Object.entries(groupedData).map(([name, items]) => (
          <>
            <Card key={name} items={items} set={setContents} />
          </>
        ))}
      </ul>
      <ApplicationContents items={contents} />
    </>
  );
}


const ResearchPAGE: React.FC = () => {

  return (
    <div>
      <h2 id="Method">Methods</h2>
      <MethodList />
      <h2 id="Application">Applications</h2>
      <ApplicationList />
    </div>
  );
};

export default ResearchPAGE;

