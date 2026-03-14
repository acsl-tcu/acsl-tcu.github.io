'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import { useEffect, useState } from 'react';
import YearSelector from '@/components/lab/yeatSelector';
import Link from "next/link";
import { Article } from '@/types/lab_db';

const START_YEAR = 2013;

function getCandidateYears() {
  const thisYear = new Date().getFullYear();
  return Array.from({ length: thisYear - START_YEAR + 1 }, (_, index) => thisYear - index);
}

async function hasPublicationData(year: number) {
  const query = new URLSearchParams({ year: String(year) });
  ["journal", "international", "domestic"].forEach((table) => query.append('tables', table));

  const response = await fetch(`https://acsl-hp.vercel.app/api/read-database-psql?${query.toString()}`, {
    method: 'GET',
  });
  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  const rows = Array.isArray(result?.message) ? result.message : [];
  return rows.some((tableRows: unknown) => Array.isArray(tableRows) && tableRows.length > 0);
}

const ArticleTable: React.FC<{ articles: Article[] }> = ({ articles }) => {
  if (!articles) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <tbody>
          {articles.map((article, index) => {
            const author = article.author;
            const magazine = (article.magazine ? article.magazine : article.meeting);
            const volume = (article.volume ? article.volume : '');
            const number = (article.number ? article.number : '');
            const page = (article.page ? article.page : '');
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
                  {author} {title} {magazine} {volume} {number} {page} {article.date}
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
      <h2 id="journal" className="scroll-mt-30 mb-0 mt-3">{messages.publicationTab.journal}</h2>
      <ArticleTable articles={rows[0]} />

      <h2 id="international" className="scroll-mt-30 mb-0 mt-3">{messages.publicationTab.international}</h2>
      <ArticleTable articles={rows[1]} />

      <h2 id="domestic" className="scroll-mt-30 mb-0 mt-3">{messages.publicationTab.domestic}</h2>
      <ArticleTable articles={rows[2]} />
    </div>
  );
};

const PublicationPAGE: React.FC = () => {
  const { messages } = useI18nContext();
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [dispYear, setDispYear] = useState<number>(new Date().getFullYear());
  const [isLoadingYears, setIsLoadingYears] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailableYears() {
      try {
        const candidateYears = getCandidateYears();
        const results = await Promise.all(
          candidateYears.map(async (year) => ({
            year,
            visible: await hasPublicationData(year),
          }))
        );

        if (cancelled) return;

        const years = results.filter((result) => result.visible).map((result) => result.year);
        setAvailableYears(years);
        if (years.length > 0) {
          setDispYear((currentYear) => (years.includes(currentYear) ? currentYear : years[0]));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingYears(false);
        }
      }
    }

    void loadAvailableYears();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoadingYears) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (availableYears.length === 0) {
    return <div className="p-4 text-gray-500">No publications available.</div>;
  }

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
        years={availableYears}
      />
      <PublicationTable year={dispYear} />
    </div>
  );
};

export default PublicationPAGE;
