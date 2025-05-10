'use client';
import React, { useEffect, useState } from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import MediaDisplay from '@/app/components/MediaDisplay';

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

interface Rdata {
  application_name: string,
  type: string,
  role: string,
  title: string,
  jtitle: string,
  abst: string,
  jabst: string,
  keyword1: string,
  keyword2: string,
  keyword3: string,
  keyword4: string,
  figure1: string,
  figure1_caption: string,
  jfigure1_caption: string,
  figure2: string,
  figure2_caption: string,
  jfigure2_caption: string,
  figure3: string,
  figure3_caption: string,
  jfigure3_caption: string,
  figure4: string,
  figure4_caption: string,
  jfigure4_caption: string,
  figure5: string,
  figure5_caption: string,
  jfigure5_caption: string,
  figure6: string,
  figure6_caption: string,
  jfigure6_caption: string,
  figure7: string,
  figure7_caption: string,
  jfigure7_caption: string,
  figure8: string,
  figure8_caption: string,
  jfigure8_caption: string,
  figure9: string,
  figure9_caption: string,
  jfigure9_caption: string,
  figure10: string,
  figure10_caption: string,
  jfigure10_caption: string
}

const adjustData = (table: string) => {
  const year = new Date().getFullYear();
  const { rows, error } = useDB([table], year);
  const { locale } = useI18nContext();
  const lang = locale === 'en' ? '' : 'j';
  if (!rows || rows.length === 0)
    return { error };

  const data: MediaData[] = rows.map((row: Record<string, string>) => ({
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

const ApplicationTable: React.FC = () => {
  const { data, error } = adjustData("application");

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;

  const { messages } = useI18nContext();

  const renderFigure = (fig: Figure, index: number) => {
    const ext = fig.src?.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'tiff'].includes(ext);
    const isVideo = ['mp4', 'avi', 'webm'].includes(ext);

    if (isImage) {
      return (
        <figure className="w-full">
          <img src={`/img/${fig.src}`} alt={fig.caption} className="rounded shadow w-full h-auto" />
          <figcaption className="text-sm text-gray-600 mt-2 text-justify">
            Fig. {index + 1}: {fig.caption}
          </figcaption>
        </figure>
      );
    } else if (isVideo) {
      return (
        <figure className="w-full">
          <video
            controls
            className="rounded shadow w-full max-h-[400px] object-contain bg-black"
          >
            <source src={`/img/${fig.src}`} type={`video/${ext}`} />
            <p>動画を再生するには video タグをサポートしたブラウザが必要です。</p>
          </video>
          <figcaption className="text-sm text-gray-600 mt-2">
            Movie {index + 1}: {fig.caption}
          </figcaption>
        </figure>
      );
    }

    return null;
  };

  // const figArea1 = data.figures.slice(0, 2);
  // const figArea2 = data.figures.slice(2, 4);
  {/* レスポンシブ対応: sm では縦積み、md 以上では横並び */ }
  //   < div className="flex flex-col md:flex-row gap-4" >
  //     {
  //       figArea1.map((fig, idx) => (
  //         <div key={idx} className="flex-1">
  //           {renderFigure(fig, idx)}
  //         </div>
  //       ))
  //     }
  //   </ >

  //   <div className="flex flex-col md:flex-row gap-4 mt-6">
  //     {figArea2.map((fig, idx) => (
  //       <div key={idx + 2} className="flex-1">
  //         {renderFigure(fig, idx + 2)}
  //       </div>
  //     ))}
  //   </div>
  // </div >

  return (
    <>
      {data.map((item: MediaData) => {
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="mb-6 whitespace-pre-line text-gray-700">{item.abstract}</p>
            <MediaDisplay figures={item.figures} />
          </div>
        );
      })
      }
    </>
  );

}

const MethodTable: React.FC = () => {
  const { data, error } = adjustData("method");

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;

  return (
    <>
      {data.map((item: MediaData) =>
        <MediaDisplay figures={item.figures} />
      )};
    </>
  )
}

const ResearchPAGE: React.FC = () => {

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-2" id="Method">Method</h2>
      <MethodTable />
      <h2 className="text-xl font-semibold mb-2" id="Application">Application</h2>
      <ApplicationTable />
    </div>
  );
};

export default ResearchPAGE;