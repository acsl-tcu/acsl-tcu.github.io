'use client';
// import { useI18nContext } from '@/contexts/i18nContext';
// import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
// Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
import { Typography } from '@mui/material';
import { useState } from 'react';
import YearSelector from '@/app/components/yeatSelector';
// interface Member {
//   jname: string;
//   jsubject: string;
//   name: string;
//   subject: string;
//   grade: string;
//   url?: string;
// }

// const LocaledTable: React.FC<{ locale: Locale, members: Member[], grade: string }> = ({ locale, members, grade }) => {
//   const tables = members.map((member, index) => (
//     <><Typography variant="h6">{grade}</Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name </TableCell>
//               <TableCell>Research Interests </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow key={index}>
//               <TableCell>
//                 <a href={member.url || '#'} target="_blank" rel="noopener noreferrer">
//                   {locale === 'en' ? member.name : member.jname}
//                 </a>
//               </TableCell>
//               <TableCell>
//                 {locale === 'en' ? member.subject : member.jsubject}
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>));
//   return <>{tables}</>;
// };

const MemberTable: React.FC<{ year: number }> = ({ year }) => {
  // const { locale } = useI18nContext();
  const { error } = useDB(["member"], year);
  if (error) {
    return <div>Error: {error}</div>;
  }
  // console.log("Member data: ", rows);

  // <pre>{JSON.stringify(rows, null, 2)}</pre>
  return (
    <div>
      <Typography variant="h4" id={`publication_${year}`}>{year}</Typography>
      {/* {["Staff", "Doctoral course", "M2", "M1", "B4"].map((grade: string) => {
        return (
          <><LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === grade)} grade={grade} />
          </>);
      })} */}
      {/* <LocaledTable locale={locale} members={rows} grade='Staff' /> */}
      {/* <LocaledTable locale={locale} members={staffs} grade='Staff' />
      <LocaledTable locale={locale} members={doctor_students} grade='Doctoral course' />
      <LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === 'M2')} grade='M2' />
      <LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === 'M1')} grade='M1' />
      <LocaledTable locale={locale} members={rows[0].filter((member: Member) => member.grade === 'B4')} grade='B4' /> */}
    </div>
  );
}

const MemberPAGE: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);

  return (
    <div>
      <YearSelector texts={["Staff", "Doctoral course", "M2", "M1", "B4"]} dispYear={dispYear} setDispYear={setDispYear} />
      <MemberTable year={dispYear} />
    </div>);
}
export default MemberPAGE;

