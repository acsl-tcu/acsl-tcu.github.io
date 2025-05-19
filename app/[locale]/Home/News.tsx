'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';
import Link from "next/link";

interface Article {
  author: string;
  title: string;
  magazine: string;
  identifier: string;
  page: string;
  date: string;
  type: 'journal' | 'international' | 'domestic'; // 区別したい場合
}

const ArticleTable: React.FC<{ articles: Article[] }> = ({ articles }) => {
  if (!articles) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <tbody>
          {articles.map((article, index) => {
            const author = article.author;
            const magazine = article.magazine;
            const identifier = article.identifier;
            let title = <>{article.title}</>;

            if (/http/.test(identifier)) {
              title = <Link href={identifier} className="text-blue-500 underline hover:text-blue-700">{article.title}</Link>;
            } else if (identifier) {
              title = <Link href={`http://doi.org/${identifier}`} className="text-blue-500 underline hover:text-blue-700">{article.title}</Link>;
            }

            return (
              <tr key={index} className="border-b border-gray-200 even:bg-gray-100 even:dark:bg-gray-800 dark:bg-neutral-900 dark:text-gray-100">
                <td className="p-2 text-sm">
                  {author} {title} {magazine} {article.page} {article.date}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PublicationTable: React.FC<{ year: number }> = ({ year }) => {
  const { rows, error } = useDB(["journal", "international", "domestic"], year);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!rows || rows.length === 0) return <div>Loading...</div>;

  // 3つの配列を統合して新しい順にソートし、20件だけ取得
  const allArticles = [...rows[0], ...rows[1], ...rows[2]];
  const sorted = allArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <h2 id="latest-news" className="scroll-mt-30 mb-0 mt-3">Latest Publications</h2>
      <ArticleTable articles={sorted} />
    </div>
  );
};

const News: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const { messages } = useI18nContext();
  const [dispYear, setDispYear] = useState<number>(thisYear-1);

  return (
    <div className="p-4">
      <YearSelector
        texts={[
          messages.publicationTab.journal,
          messages.publicationTab.international,
          messages.publicationTab.domestic,
        ]}
        hrefs={["journal", "international", "domestic"]}
        dispYear={dispYear}
        setDispYear={setDispYear}
      />
      <PublicationTable year={dispYear} />
    </div>
  );
};

export default News;
