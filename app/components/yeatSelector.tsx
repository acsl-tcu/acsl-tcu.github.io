'use client';
import { Table, TableCell, TableContainer, TableRow, TableHead, Paper, Button } from '@mui/material';
import { MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
// プロパティの型定義 
interface TextProps {
  texts: string[];
  dispYear: number,
  setDispYear: React.Dispatch<React.SetStateAction<number>>
  hrefs?: string[];
}
const YearSelector: React.FC<TextProps> = ({ texts, dispYear, setDispYear, hrefs }) => {
  const thisYear = new Date().getFullYear();
  if (texts) {
    const year_list = Array.from({ length: thisYear - 2012 }, (_, index) => thisYear - index);

    const handleChange = (event: SelectChangeEvent) => {
      setDispYear(Number(event.target.value));
    };

    if (!hrefs || hrefs.length === 0) {
      hrefs = texts.map((text) => {
        return `${text} ${dispYear}`;
      });
    }

    return (<>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel id="select-label">Year</InputLabel>
                  <Select
                    labelId="select-label"
                    id="simple-select"
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
              {texts.map((text, index) => {
                return (<TableCell key={`${text}${dispYear}`} > <Button href={`#${hrefs[index]}`}>{text}</Button></TableCell>);
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