'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';
import Link from "next/link";
//import GroupedSelectTailwind from '@/app/components/groupedSelector';
interface Article {
  author: string;
  title: string;
  magazine: string;
  identifier: string;
  page: string;
  date: string;
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
              <tr key={index} className="border-b border-gray-200">
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
  const { messages } = useI18nContext();
  const { rows, error } = useDB(["journal", "international", "domestic"], year);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!rows || rows.length === 0) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 id={`${messages.publicationTab.journal}${year}`}>Journal</h2>
      <ArticleTable articles={rows[0]} />

      <h2 id={`${messages.publicationTab.international}${year}`}>International Conference</h2>
      <ArticleTable articles={rows[1]} />

      <h2 id={`${messages.publicationTab.domestic}${year}`}>Domestic Conference</h2>
      <ArticleTable articles={rows[2]} />
    </div>
  );
};

const PublicationPAGE: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const { messages } = useI18nContext();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div className="p-4">
      {/* <GroupedSelectTailwind /> */}
      <YearSelector
        texts={[
          messages.publicationTab.journal,
          messages.publicationTab.international,
          messages.publicationTab.domestic,
        ]}
        dispYear={dispYear}
        setDispYear={setDispYear}
      />
      <PublicationTable year={dispYear} />
    </div>
  );
};

export default PublicationPAGE;
