'use client';
import { useI18nContext } from '@/contexts/i18nContext';
// import { Locale } from '@/types/i18n';
import useDB from '@/hooks/useDB';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Button, Menu, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (year: number) => {
    setDispYear(year);
    handleClose();
  };

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        aria-labelledby="with-menu-demo-breadcrumbs"
      >
        {year_list.map((year: number) => (
          <MenuItem key={year} onClick={() => handleMenuItemClick(year)}> {year} </MenuItem>
        ))}
      </Menu>
      <Breadcrumbs aria-label="breadcrumbs">
        {year_list.map((year: number) => {
          return (<>
            <Link color="primary" href="#condensed-with-menu" onClick={() => handleMenuItemClick(year)}>
              {year}
            </Link></>);
        })}
        <IconButton color="primary" size="small" onClick={handleClick}>
          <MoreHorizIcon />
        </IconButton>
      </Breadcrumbs>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography><Button onClick={() => { }}>
                {dispYear}</Button></Typography></TableCell>
              <TableCell>{messages.publicationTab.journal}</TableCell>
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

