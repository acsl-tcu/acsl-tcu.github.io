'use client';
import { Box, Container, Typography, Paper } from '@mui/material';
import Navigation from '@/app/components/Navigation';
import type { Publication } from '@/types';

const publications: Publication[] = [
  {
    id: '1',
    title: 'Example Publication Title',
    authors: ['Author 1', 'Author 2'],
    year: 2024,
    journal: 'Journal Name',
    doi: '10.1234/example',
  },
  // Add more publications
];

export default function Publications() {
  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h1" gutterBottom>
          Publications
        </Typography>
        {publications.map((pub) => (
          <Paper key={pub.id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {pub.title}
            </Typography>
            <Typography variant="body1">
              {pub.authors.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pub.journal} ({pub.year})
            </Typography>
            {pub.doi && (
              <Typography variant="body2">
                DOI: {pub.doi}
              </Typography>
            )}
          </Paper>
        ))}
      </Container>
    </Box>
  );
}

// 'use client';
// import { useI18nContext } from '@/contexts/i18nContext';
// import useDB from '@/hooks/useDB';
// import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
// import { Typography } from '@mui/material';
// import { useState } from 'react';
// import YearSelector from '@/app/components/yeatSelector';

// interface Article {
//   author: string;
//   title: string;
//   magazine: string;
//   identifier: string;
//   page: string;
//   date: string;
// }

// const ArticleTable: React.FC<{ articles: Article[] }> = ({ articles }) => {
//   if (articles) {
//     return (<><TableContainer component={Paper}>
//       <Table>
//         <TableBody>
//           {articles.map((article, index) => {
//             const author = article.author;
//             const magazine = article.magazine;
//             const identifier = article.identifier;
//             let title = <>{article.title}</>;
//             if (title) {
//               if (/http/.test(identifier)) {
//                 title = <a href={identifier}>{title}</a>;
//               } else if (identifier) {
//                 title = <a href={`http://doi.org/${identifier}`}>{title}</a>;
//               }
//               return (
//                 <TableRow key={index}>
//                   <TableCell>{author}{title}{magazine}{article.page}{article.date}</TableCell>
//                 </TableRow>);
//             }
//             return null;
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     </>);
//   } else {
//     return null;
//   }
// }

// const PublicationTable: React.FC<{ year: number }> = ({ year }) => {
//   const { messages } = useI18nContext();
//   const { rows, error } = useDB(["journal", "international", "domestic"], year);
//   if (error) { return <div>Error: {error}</div>; }
//   // nullチェック
//   if (!rows || rows.length === 0) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <div>
//       <Typography variant="h4" id={`${messages.publicationTab.journal}${year}`}>Journal</Typography>
//       <ArticleTable articles={rows[0]} />
//       <Typography variant="h4" id={`${messages.publicationTab.international}${year}`}>International Conference</Typography>
//       <ArticleTable articles={rows[1]} />
//       <Typography variant="h4" id={`${messages.publicationTab.domestic}${year}`}>Domestic Conference</Typography>
//       <ArticleTable articles={rows[2]} />
//     </div>
//   );
// }

// const PublicationPAGE: React.FC = () => {
//   const thisYear = new Date().getFullYear();
//   const { messages } = useI18nContext();
//   const [dispYear, setDispYear] = useState<number>(thisYear);
//   return (
//     <div>
//       <YearSelector texts={[messages.publicationTab.journal, messages.publicationTab.international, messages.publicationTab.domestic]} dispYear={dispYear} setDispYear={setDispYear} />
//       <PublicationTable year={dispYear} />
//     </div>);
// }
// export default PublicationPAGE;

