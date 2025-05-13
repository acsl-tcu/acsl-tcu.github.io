'use client';
import React from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import MediaDisplay from '@/app/components/MediaDisplay';
import { useState } from 'react';
// import dynamic from 'next/dynamic';

// const LazyContent = dynamic(() => import('./LazyContent'), {
//   loading: () => <p>Loading...</p>,
// });

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

// interface Rdata {
//   application_name: string,
//   type: string,
//   role: string,
//   title: string,
//   jtitle: string,
//   abst: string,
//   jabst: string,
//   keyword1: string,
//   keyword2: string,
//   keyword3: string,
//   keyword4: string,
//   figure1: string,
//   figure1_caption: string,
//   jfigure1_caption: string,
//   figure2: string,
//   figure2_caption: string,
//   jfigure2_caption: string,
//   figure3: string,
//   figure3_caption: string,
//   jfigure3_caption: string,
//   figure4: string,
//   figure4_caption: string,
//   jfigure4_caption: string,
//   figure5: string,
//   figure5_caption: string,
//   jfigure5_caption: string,
//   figure6: string,
//   figure6_caption: string,
//   jfigure6_caption: string,
//   figure7: string,
//   figure7_caption: string,
//   jfigure7_caption: string,
//   figure8: string,
//   figure8_caption: string,
//   jfigure8_caption: string,
//   figure9: string,
//   figure9_caption: string,
//   jfigure9_caption: string,
//   figure10: string,
//   figure10_caption: string,
//   jfigure10_caption: string
// }

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
      src: row[`figure${n}`].replace("img", "images"),
      caption: row[`${lang}figure${n}_caption`],
    })).filter(f => f.src)
  })
  );
  return { data, error }
}

const ResearchTable: React.FC<{ table: string }> = ({ table }) => {
  const { data, error } = useAdjustData(table);
  const [showContent, setShowContent] = useState(false);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;
  console.log("=================");
  console.log(data);
  return (
    <>
      {data.map((item: MediaData) => {
        return (
          <div key={item.title} className="max-w-4xl mx-auto p-4">
            <h3 className="text-xl font-semibold cursor-pointer hover:underline"
              onClick={() => setShowContent((prev) => !prev)}>{item.title}</h3>
            {showContent && (<>
              <p className="mb-6 whitespace-pre-line text-gray-700">{item.abstract}</p>
              <MediaDisplay figures={item.figures} />
            </>)}
          </div>
        );
      })
      }
    </>
  );
}

const ResearchPAGE: React.FC = () => {

  return (
    <div className="p-4 space-y-6">
      <h2 id="Method">Method</h2>
      <ResearchTable table="method" />
      <h2 id="Application">Application</h2>
      <ResearchTable table="application" />
    </div>
  );
};

export default ResearchPAGE;