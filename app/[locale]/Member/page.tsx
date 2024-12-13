'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';
interface Member {
  jname: string;
  jsubject: string;
  name: string;
  subject: string;
  url?: string;
}

const LocaledTable: React.FC<{ locale: Locale, members: Member[], grade: string }> = ({ locale, members, grade }) => {
  const tables = members.map((member, index) => (
    <><Typography variant="h6">{grade}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name </TableCell>
              <TableCell>Research Interests </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={index}>
              <TableCell>
                <a href={member.url || '#'} target="_blank" rel="noopener noreferrer">
                  {locale === 'en' ? member.name : member.jname}
                </a>
              </TableCell>
              <TableCell>
                {locale === 'en' ? member.subject : member.jsubject}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>));
  return <>{tables}</>;
};

const MemberTable: React.FC<{ year: number }> = ({ year }) => {
  const { rows, error } = useDB(["member"], year);
  const { locale } = useI18nContext();
  if (error) {
    return <div>Error: {error}</div>;
  }
  // <pre>{JSON.stringify(rows, null, 2)}</pre>
  return (
    <div>
      <Typography variant="h4">{year}</Typography>
      {["Staff", "Doctoral course", "M2", "M1", "B4"].map((grade: string) => {
        return (
          <><LocaledTable locale={locale} members={rows.filter(member => member.grade === grade)} grade={grade} />
          </>);
      })}
    </div>
  );
}

const Member: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div>
      <YearSelector texts={["Staff", "Doctoral course", "M2", "M1", "B4"]} dispYear={dispYear} setDispYear={setDispYear} />
      <MemberTable year={dispYear} />
    </div>);
}
export default Member;

