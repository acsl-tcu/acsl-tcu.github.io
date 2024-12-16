'use client';
import { useI18nContext } from '@/contexts/i18nContext';
// import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper } from '@mui/material';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';
import { MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
// import IconButton from '@mui/material/IconButton';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
      <ArticleTable articles={rows[0]} />
      <ArticleTable articles={rows[1]} />
      <ArticleTable articles={rows[2]} />
    </div>
  );
}

const Publication: React.FC = () => {
  const thisYear = new Date().getFullYear();
  const { messages } = useI18nContext();
  const [dispYear, setDispYear] = useState<number>(thisYear);
  const year_list = Array.from({ length: thisYear - 2012 }, (_, index) => thisYear - index);

  // const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // const open = Boolean(anchorEl);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
  //   if (event) {
  //     setAnchorEl(event.currentTarget);
  //   }
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  const handleChange = (event: SelectChangeEvent) => {
    setDispYear(Number(event.target.value));
  };
  // const handleMenuItemClick = (year: number) => {
  //   setDispYear(year);
  //   // handleClose();
  // };

  return (
    <div>
      {/* <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        aria-labelledby="with-menu-demo-breadcrumbs"
      >
        {year_list.map((year: number) => (
          <MenuItem key={year} onClick={() => handleMenuItemClick(year)}> {year} </MenuItem>
        ))}
      </Menu> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {/* <Typography variant="h2">
                  <Button variant="outlined" onClick={handleChange}>
                    {dispYear}
                  </Button>onClick={() => handleMenuItemClick(year)}
                </Typography> */}
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
              <TableCell><a href="#journal">{messages.publicationTab.journal}</a></TableCell>
              <TableCell>{messages.publicationTab.international}</TableCell>
              <TableCell>{messages.publicationTab.domestic}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <PublicationTable year={dispYear} />
    </div>);
}
export default Publication;

