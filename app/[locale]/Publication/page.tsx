'use client';
import { useI18nContext } from '@/contexts/i18nContext';
import useDB from '@/hooks/useDB';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button } from '@mui/material';
import { MenuItem, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { useState } from 'react';

interface Article {
  author: string;
  title: string;
  magazine: string;
  identifier: string;
  page: string;
  date: string;
}

const ArticleTable: React.FC<{ articles: Article[] }> = ({ articles }) => {
  if (articles) {
    return (<><TableContainer component={Paper}>
      <Table>
        <TableBody>
          {articles.map((article, index) => {
            const author = article.author;
            const magazine = article.magazine;
            const identifier = article.identifier;
            let title = <>article.title</>;
            if (title) {
              if (/http/.test(identifier)) {
                title = <a href={identifier}>{title}</a>;
              } else if (identifier) {
                title = <a href={`http://doi.org/${identifier}`}>{title}</a>;
              }
              return (
                <TableRow key={index}>
                  <TableCell>{author}{title}{magazine}{article.page}{article.date}</TableCell>
                </TableRow>);
            }
            return null;
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </>);
  } else {
    return null;
  }
}

const PublicationTable: React.FC<{ year: number }> = ({ year }) => {

  const { rows, error } = useDB(["journal", "international", "domestic"], year);
  if (error) { return <div>Error: {error}</div>; }
  return (
    <div>
      <Typography variant="h2" id={`journal${year}`}>Journal</Typography>
      <ArticleTable articles={rows[0]} />
      <Typography variant="h2" id={`international${year}`}>International Conference</Typography>
      <ArticleTable articles={rows[1]} />
      <Typography variant="h2" id={`domestic${year}`}>Domestic Conference</Typography>
      <ArticleTable articles={rows[2]} />
    </div>
  );
}

const Publication: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const { messages } = useI18nContext();
  const [dispYear, setDispYear] = useState<number>(thisYear);
  const year_list = Array.from({ length: thisYear - 2012 }, (_, index) => thisYear - index);

  const handleChange = (event: SelectChangeEvent) => {
    setDispYear(Number(event.target.value));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Year</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={String(dispYear)}
                    label="year"
                    onChange={handleChange}
                  >
                    {year_list.map((year: number) => (
                      <MenuItem key={year} value={year} > {year} </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell><Button href={`#journal${dispYear}`}>{messages.publicationTab.journal}</Button></TableCell>
              <TableCell><Button href={`#international${dispYear}`}>{messages.publicationTab.international}</Button></TableCell>
              <TableCell><Button href={`#domestic${dispYear}`}>{messages.publicationTab.domestic}</Button></TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <PublicationTable year={dispYear} />
    </div>);
}
export default Publication;

