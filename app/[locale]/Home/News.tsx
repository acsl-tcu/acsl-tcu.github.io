'use client';
import useDB from '@/hooks/useDB';
interface Article {
    author: string;
    title: string;
    magazine: string;
    page: string;
    date: string;
  }

const ArticleTable: React.FC<{ articles: Article[] }> = ({ articles }) => {
  if (!articles) return null;
    console.log(articles);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <tbody>
          {articles.map((article, index) => {
            return (
              <tr key={index} className="border-b border-gray-200 even:bg-gray-100 even:dark:bg-gray-800 dark:bg-neutral-900 dark:text-gray-100">
                  <td className="p-2 text-sm font-mono w-8 text-right">
                     {index + 1}
                  </td>
                  <td className="p-2 text-sm">
                  {article.author}, <span className="italic">{"{article.title}"}</span>, {article.magazine}, {article.page}, {article.date}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const News: React.FC = () => {
    const year = new Date().getFullYear();
    const { rows, error } = useDB(["news"], year);
  
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!rows || rows.length === 0) return <div>Loading...</div>;
  
    return (
      <div className="space-y-6">
        <h2 id="latest-news" className="scroll-mt-30 mb-0 mt-3">Latest Publications</h2>
        <ArticleTable articles={rows[0]} />
      </div>
    );
};

export default News;
