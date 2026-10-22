'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import { Locale } from '@/types/i18n';
import { useState } from 'react';
import YearSelector from '@/components/lab/yeatSelector';

import type { Lecture, LectureYear } from '@/lib/content/lectures';

const LocaledTable: React.FC<{ locale: Locale, lectures: Lecture[], school: string }> = ({ locale, lectures, school }) => {
  const year = new Date().getFullYear() % 100;
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
                onClick={() => window.open(`https://webclass.tcu.ac.jp/webclass/course.php/${year}${lecture.id}/manage/`, '_blank')}
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

const LectureTable: React.FC<{ lectures: Lecture[] }> = ({ lectures }) => {
  const { locale } = useI18nContext();
  const undergraduate = lectures.filter((obj) => !obj.id.includes("sm") && !obj.id.includes("sd"));
  const graduate = lectures.filter((obj) => obj.id.includes("sm") || obj.id.includes("sd"));

  return (
    <div className="prose max-w-none">
      <LocaledTable locale={locale} lectures={undergraduate} school="Undergraduate" />
      <LocaledTable locale={locale} lectures={graduate} school="Graduate School" />
    </div>
  );
};

const LectureClient: React.FC<{ years: LectureYear[] }> = ({ years }) => {
  const [dispYear, setDispYear] = useState<number>(years[0]?.year ?? new Date().getFullYear());
  const current = years.find((y) => y.year === dispYear);

  if (!current) {
    return <div className="p-4 text-gray-500">No lecture data available.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <YearSelector
        texts={["Undergraduate", "Graduate School"]}
        hrefs={["Undergraduate", "Graduate School"]}
        dispYear={dispYear}
        setDispYear={setDispYear}
        years={years.map((y) => y.year)}
      />
      <LectureTable lectures={current.lectures} />
    </div>
  );
};

export default LectureClient;
