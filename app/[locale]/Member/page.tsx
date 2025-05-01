'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography
} from '@mui/material';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';
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
    <><Typography variant="h6">{grade}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead id={grade}>
            <TableRow>
              <TableCell>Name </TableCell>
              <TableCell>Research Interests </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={index}>
                <TableCell>
                  {locale === 'en' ? member.name : member.jname}
                </TableCell>
                <TableCell>
                  {locale === 'en' ? member.subject : member.jsubject}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>);
};

const MemberTable: React.FC<{ year: number }> = ({ year }) => {
  const { locale } = useI18nContext();
  const { rows, error } = useDB(["member"], year);
  if (error) {
    return <div>Error: {error}</div>;
  }
  // nullチェック
  if (!rows || rows.length === 0) {
    return <div>Loading...</div>;
  }
  // console.log(`Member data:  ${rows}`); // 入れると無限ループ：なぜ？
  const staffs = rows[0].filter((member: Member) => !["B4", "M1", "M2", "D1", "D2", "D2", "D3", "D4", "D5", "D6", "D7"].includes(member.grade));
  const doctor_students = rows[0].filter((member: Member) => ["D1", "D2", "D2", "D3", "D4", "D5", "D6", "D7"].includes(member.grade));
  return (
    <div>
      {/* <pre>{JSON.stringify(rows, null, 2)}</pre> */}
      <Typography variant="h4" id={`publication_${year}`}>{year}</Typography>
      <LocaledTable locale={locale} members={staffs} grade='Staff' />
      <LocaledTable locale={locale} members={doctor_students} grade='Doctoral course' />
      <LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === 'M2')} grade='M2' />
      <LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === 'M1')} grade='M1' />
      <LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === 'B4')} grade='B4' />
    </div>
  );
}

const MemberPhoto: React.FC<{ year: number }> = ({ year }) => {
  return (
    <div><Image src={`/images/member/${year.toString}.png`} alt={year} />
    </div>
  );
}
const MemberPAGE: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div>
      <MemberPhoto year={dispYear} />
      <YearSelector texts={["Staff", "Doctoral course", "M2", "M1", "B4"]}
        hrefs={["Staff", "Doctoral course", "M2", "M1", "B4"]} dispYear={dispYear} setDispYear={setDispYear} />
      <MemberTable year={dispYear} />
    </div>);
}
export default MemberPAGE;

