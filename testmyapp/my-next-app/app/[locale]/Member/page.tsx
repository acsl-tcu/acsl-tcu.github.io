'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector'; // Tailwind化済のYearSelector
import Image from "next/image";

interface Member {
  jname: string;
  jsubject: string;
  name: string;
  subject: string;
  grade: string;
  url?: string;
}

const LocaledTable: React.FC<{ locale: Locale, members: Member[], grade: string }> = ({ locale, members, grade }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2" id={grade}>{grade}</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b border-gray-200">Name</th>
              <th className="p-3 border-b border-gray-200">Research Interests</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-100">
                  {locale === 'en' ? member.name : member.jname}
                </td>
                <td className="p-3 border-b border-gray-100">
                  {locale === 'en' ? member.subject : member.jsubject}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const MemberTable: React.FC<{ year: number }> = ({ year }) => {
  const { locale } = useI18nContext();
  const { rows, error } = useDB(["member"], year);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!rows || rows.length === 0) return <div className="text-gray-500">Loading...</div>;

  const all = rows[0];
  const isGrade = (grade: string) => (member: Member) => member.grade === grade;
  const isDoctor = (grade: string) => ["D1", "D2", "D3", "D4", "D5", "D6", "D7"].includes(grade);
  const isStaff = (grade: string) => !["B4", "M1", "M2", "D1", "D2", "D3", "D4", "D5", "D6", "D7"].includes(grade);

  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold mb-4" id={`publication_${year}`}>{year}</h1>
      <LocaledTable locale={locale} members={all.filter(m => isStaff(m.grade))} grade='Staff' />
      <LocaledTable locale={locale} members={all.filter(m => isDoctor(m.grade))} grade='Doctoral course' />
      <LocaledTable locale={locale} members={all.filter(isGrade('M2'))} grade='M2' />
      <LocaledTable locale={locale} members={all.filter(isGrade('M1'))} grade='M1' />
      <LocaledTable locale={locale} members={all.filter(isGrade('B4'))} grade='B4' />
    </div>
  );
};

const MemberPhoto: React.FC<{ year: number }> = ({ year }) => {
  return (
    <div className="mb-6">
      <Image src={`/images/member/${year}.png`} alt={`${year}`} width={800} height={600} />
    </div>
  );
};

const MemberPAGE: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div className="p-4 space-y-6">
      <MemberPhoto year={dispYear} />
      <YearSelector
        texts={["Staff", "Doctoral course", "M2", "M1", "B4"]}
        hrefs={["Staff", "Doctoral course", "M2", "M1", "B4"]}
        dispYear={dispYear}
        setDispYear={setDispYear}
      />
      <MemberTable year={dispYear} />
    </div>
  );
};

export default MemberPAGE;
