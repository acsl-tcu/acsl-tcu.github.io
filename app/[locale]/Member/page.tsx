'use client';
import { useI18nContext } from '@/contexts/i18nContext';
// import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';
import Image from "next/image";

interface Member {
  // localed member data
  name: string;
  subject: string;
  grade: string;
  url?: string;
}

function useLocaledData(table: string, year: number) {
  const { rows, error } = useDB([table], year);
  const { locale } = useI18nContext();
  const lang = locale === 'en' ? '' : 'j';
  if (!rows || rows.length === 0)
    return { error };

  const data: Member[] = rows[0].map((row: Record<string, string>) => ({
    name: row[`${lang}name`],
    subject: row[`${lang}subject`],
    grade: row.grade,
    url: row.url,
  })
  );
  return { data, error }
}

const GradeTable: React.FC<{ members: Member[], grade: string }> = ({ members, grade }) => {
  return (
    <section className="scroll-mt-40 mb-8">
      <h3 className="text-xl font-semibold mb-2" id={grade}>{grade}</h3>
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
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-100">
                <td className="p-3 border-b border-gray-100">
                  {member.name}
                </td>
                <td className="p-3 border-b border-gray-100">
                  {member.subject}
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
  const { data, error } = useLocaledData("member", year);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!data || data.length === 0) return <div className="text-gray-500">Loading...</div>;

  const all = data;
  const isGrade = (grade: string) => (member: Member) => member.grade === grade;
  const isDoctor = (grade: string) => ["D1", "D2", "D3", "D4", "D5", "D6", "D7"].includes(grade);
  const isStaff = (grade: string) => !["B4", "M1", "M2", "D1", "D2", "D3", "D4", "D5", "D6", "D7"].includes(grade);

  return (
    <div className="prose max-w-none">
      {/* <h2 className="text-2xl font-bold mb-4" id={`publication_${year}`}>{year} Members</h2> */}
      <GradeTable members={all.filter((m: Member) => isStaff(m.grade))} grade='Staff' />
      <GradeTable members={all.filter((m: Member) => isDoctor(m.grade))} grade='Doctoral course' />
      <GradeTable members={all.filter(isGrade('M2'))} grade='M2' />
      <GradeTable members={all.filter(isGrade('M1'))} grade='M1' />
      <GradeTable members={all.filter(isGrade('B4'))} grade='B4' />
    </div>
  );
};

const MemberPhoto: React.FC<{ year: number }> = ({ year }) => {
  return (
    <Image src={`/images/member/${year}.png`} alt={`${year}`} width={800}
      height={200}
      className="w-full" />
  );
};

const MemberPAGE: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div className="p-4">
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
