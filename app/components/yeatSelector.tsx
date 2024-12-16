'use client';
import { Table, TableCell, TableContainer, TableRow, TableHead, Paper, Button } from '@mui/material';
import { MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { useState } from 'react';
// プロパティの型定義 
interface TextProps { texts: string[]; }
const YearSelector: React.FC<TextProps> = ({ texts }) => {
  const thisYear = new Date().getFullYear();
  const [dispYear, setDispYear] = useState<number>(thisYear);
  if (texts) {
    const year_list = Array.from({ length: thisYear - 2012 }, (_, index) => thisYear - index);

    const handleChange = (event: SelectChangeEvent) => {
      setDispYear(Number(event.target.value));
    };

    return (<>
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
              {texts.map((text) => {
                return (<TableCell key={`${text}${dispYear}`} > <Button href={`#${text}${dispYear}`}>{text}</Button></TableCell>);
              })}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer >
    </>);
  } else {
    return (<></>);
  }
}

export default YearSelector;