'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import { useState } from 'react';
import YearSelector from '@/components/lab/yeatSelector';
import Image from "next/image";
import type { MemberEntry, MemberYear } from '@/lib/content/members';

interface Member {
  // localed member data
  name: string;
  subject: string;
  grade: string;
  url?: string;
}

function toTitleCase(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(/\s+/) // 空白で分割（複数空白も対応）
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function useLocaledData(members: MemberEntry[]): Member[] {
  const { locale } = useI18nContext();
  const isEn = locale === 'en';
  return members.map((m) => ({
    name: toTitleCase(isEn ? m.name : m.jname),
    subject: isEn ? m.subject : m.jsubject,
    grade: m.grade,
    url: m.url,
  }));
}

const GradeTable: React.FC<{ members: Member[], grade: string }> = ({ members, grade }) => {
  return (
    <section className="mb-8">
      <h3 className="scroll-mt-30 text-xl font-semibold mb-2" id={grade}>{grade}</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr>
              <th className="p-3 border-b border-gray-200">Name</th>
              <th className="p-3 border-b border-gray-200">Research Interests</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
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

const MemberTable: React.FC<{ members: MemberEntry[] }> = ({ members }) => {
  const all = useLocaledData(members);
  const isGrade = (grade: string) => (member: Member) => member.grade === grade;
  const isDoctor = (grade: string) => ["D1", "D2", "D3", "D4", "D5", "D6", "D7"].includes(grade);
  const isStaff = (grade: string) => !["B4", "M1", "M2", "D1", "D2", "D3", "D4", "D5", "D6", "D7"].includes(grade);

  return (
    <div className="prose max-w-none">
      <GradeTable members={all.filter((m: Member) => isStaff(m.grade))} grade='Staff' />
      <GradeTable members={all.filter((m: Member) => isDoctor(m.grade))} grade='Doctoral course' />
      <GradeTable members={all.filter(isGrade('M2'))} grade='M2' />
      <GradeTable members={all.filter(isGrade('M1'))} grade='M1' />
      <GradeTable members={all.filter(isGrade('B4'))} grade='B4' />
    </div>
  );
};

const MemberPhoto: React.FC<{ year: number, photo: string }> = ({ year, photo }) => {
  return (
    <Image src={photo} alt={`${year}`} width={800}
      height={200}
      className="w-full" />
  );
};

const MemberClient: React.FC<{ years: MemberYear[] }> = ({ years }) => {
  const [dispYear, setDispYear] = useState<number>(years[0]?.year ?? new Date().getFullYear());
  const current = years.find((y) => y.year === dispYear);

  if (!current) {
    return <div className="p-4 text-gray-500">No member data available.</div>;
  }

  return (
    <div className="p-4">
      {current.photo && <MemberPhoto year={current.year} photo={current.photo} />}
      <YearSelector
        texts={["Staff", "Doctoral course", "M2", "M1", "B4"]}
        hrefs={["Staff", "Doctoral course", "M2", "M1", "B4"]}
        dispYear={dispYear}
        setDispYear={setDispYear}
        years={years.map((y) => y.year)}
      />
      <MemberTable members={current.members} />
    </div>
  );
};

export default MemberClient;
