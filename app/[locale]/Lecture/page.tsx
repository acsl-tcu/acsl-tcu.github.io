'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';

interface Lecture {
  year: number;
  id: string;
  title: string;
  term: string;
  teacher: string;
  etitle: string;
}

const LocaledTable: React.FC<{ locale: Locale, lectures: Lecture[], school: string }> = ({ locale, lectures, school }) => {
  return (
    <section className="mb-8">
      <h2 className="scroll-mt-30 text-xl font-semibold mb-2" id={school}>{school}</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr>
              <th className="p-3 border-b border-gray-200">Subject</th>
              <th className="p-3 border-b border-gray-200">Term</th>
              <th className="p-3 border-b border-gray-200">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture, index) => (
              <tr
              key={index}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => window.open(`https://webclass.tcu.ac.jp/webclass/course.php/${lecture.id}/manage/`, '_blank')}
            >
                <td className="p-3 border-b border-gray-100">
                  {locale === 'en' ? lecture.etitle : lecture.title}
                </td>
                <td className="p-3 border-b border-gray-100">
                  {lecture.term}
                </td>
                <td className="p-3 border-b border-gray-100">
                  {lecture.teacher}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const LectureTable: React.FC<{ year: number }> = ({ year }) => {
  const { locale } = useI18nContext();
  const { rows, error } = useDB(["lecture"], year);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!rows || rows.length === 0) return <div className="text-gray-500">Loading...</div>;

  // console.log(rows);
  const undergraduate = rows[0].filter((obj: Lecture) => !obj.id.includes("sm") && !obj.id.includes("sd"));
  const graduate = rows[0].filter((obj: Lecture) => obj.id.includes("sm") || obj.id.includes("sd"));

  return (
    <div className="prose max-w-none">
      {/* <h2 className="text-2xl font-bold mb-4" id={`publication_${year}`}>{year}</h2> */}
      <LocaledTable locale={locale} lectures={undergraduate} school="Undergraduate" />
      <LocaledTable locale={locale} lectures={graduate} school="Graduate School" />
    </div>
  );
};


const LecturePAGE: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div className="p-4 space-y-6">
      <YearSelector
        texts={["Undergraduate", "Graduate School"]}
        hrefs={["Undergraduate", "Graduate School"]}
        dispYear={dispYear}
        setDispYear={setDispYear}
      />
      <LectureTable year={dispYear} />
    </div>
  );
};

export default LecturePAGE;
