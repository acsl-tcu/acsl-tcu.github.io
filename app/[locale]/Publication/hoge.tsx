// import React, { useEffect, useState } from 'react';
// import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// interface Member {
//   jname: string;
//   name: string;
// }

// interface Article {
//   author: string;
//   language: number;
//   title: string;
//   etitle: string;
//   magazine: string;
//   identifier: string;
//   page: string;
//   date: string;
// }


// const fetchArticles = async (limit: number | null, where: string): Promise<Article[]> => {
//   const connection = await mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'read_lab',
//     password: 'r32dLabData',
//     database: 'lab_db'
//   });

//   const query = limit
//     ? `SELECT author, language, title, etitle, magazine, identifier, page, date FROM (SELECT author, language, title, etitle, magazine, identifier, page, date FROM journal UNION SELECT author, date, title, title, meeting, identifier, page, date FROM international UNION SELECT author, date, title, etitle, meeting, identifier, page, date FROM domestic) tmp_name ORDER BY date DESC LIMIT ${limit}`
//     : `SELECT * FROM journal ${where} ORDER BY date DESC`;

//   const [articles] = await connection.execute(query);
//   await connection.end();

//   return articles as Article[];
// };

// const App: React.FC = () => {

//   return (
//     <Container>

//       <Typography variant="h4">Articles</Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Author</TableCell>
//               <TableCell>Title</TableCell>
//               <TableCell>Magazine</TableCell>
//               <TableCell>Page</TableCell>
//               <TableCell>Date</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {articles.map((article, index) => {
//               const author = article.author;
//               const magazine = article.magazine;
//               const identifier = article.identifier;
//               let title = <>article.title</>;
//               if (/http/.test(identifier)) {
//                 title = <a href={identifier}>{article.title}</a>;
//               } else if (identifier) {
//                 title = <a href={`http://doi.org/${identifier}`}>{article.title}</a>;
//               }
//               return (
//                 <TableRow key={index}>
//                   <TableCell>{author}</TableCell>
//                   <TableCell>{title}</TableCell>
//                   <TableCell>{magazine}</TableCell>
//                   <TableCell>{article.page}</TableCell> <TableCell>{new Date(article.date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</TableCell>
//                 </TableRow>);
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default App;
