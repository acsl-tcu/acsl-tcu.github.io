'use client';
import React from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import MediaDisplay from '@/app/components/MediaDisplay';
import { useState } from 'react';

interface Figure {
  src: string;
  caption: string;
};

interface MediaData {
  name: string;
  type: string;
  role: string;
  title: string;
  abstract: string;
  figures: Figure[];
};

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

const MethodTopic: React.FC<{ item: MediaData }> = ({ item }) => {
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
const MethodTable: React.FC = () => {
  const { data, error } = useAdjustData("method");

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;
  console.log("=================");
  console.log(data);
  return (
    <>
      {data.map((item: MediaData) => <MethodTopic item={item} />)
      }
    </>
  );
}


const ApplicationTopic: React.FC<{ item: MediaData }> = ({ item }) => {
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
const ApplicationTable: React.FC = () => {
  const { data, error } = useAdjustData("application");

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;
  console.log("=================");
  console.log(data);
  return (
    <>
      {data.map((item: MediaData) => <MethodTopic item={item} />)
      }
    </>
  );
}


const ResearchPAGE: React.FC = () => {

  return (
    <div className="p-4 space-y-6">
      <h2 id="Method">Method</h2>
      <MethodTable />
      <h2 id="Application">Application</h2>
      <ApplicationTable />
    </div>
  );
};

export default ResearchPAGE;