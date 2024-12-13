import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectorProps {
  title: string;
  contents: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Selector: React.FC<SelectorProps> = ({ title, contents, setValue }) => {
  const [selectorValue, setSelectorValue] = React.useState(contents[0]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectorValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectorValue}
          onChange={handleChange}
          autoWidth
          label={title}
        >
          {contents.map((i, index) => (
            <MenuItem key={index} value={i}>
              {i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default Selector;