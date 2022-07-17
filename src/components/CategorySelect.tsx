import RefreshIcon from '@mui/icons-material/Refresh';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import React from 'react';
import { fetchCategories } from '../services/CategoryService';
import { Category } from '../utils/Types';

export default function CategorySelect({
  categories,
  setCategories,
  selectedIndex,
  onChange,
}: {
  categories: Category[];
  setCategories: (category: Category[]) => void;
  selectedIndex: number;
  onChange: (event: SelectChangeEvent<number>) => void;
}) {
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleRefreshButtonClick = async () => {
    setErrorMessage('');
    try {
      const categories = await fetchCategories({
        archived: false,
      });

      setCategories(categories);
    } catch (e) {
      console.error(e);
      if (typeof e === 'string') {
        setErrorMessage(e);
      }
    }
  };

  const error = errorMessage != '';

  const categoryElements = categories.map((c: Category) => (
    <MenuItem key={c.id} value={c.id}>
      {c.name}
    </MenuItem>
  ));

  categoryElements.unshift(
    <MenuItem key={0} value={0}>
      N/A
    </MenuItem>
  );

  return (
    <FormControl margin='normal' fullWidth>
      <InputLabel>Category</InputLabel>
      <Select
        value={selectedIndex}
        label='Category'
        onChange={onChange}
        error={error}
        endAdornment={
          <InputAdornment position='end' sx={{ mr: 3 }}>
            <IconButton onClick={handleRefreshButtonClick} edge='end'>
              <RefreshIcon />
            </IconButton>
          </InputAdornment>
        }
      >
        {categoryElements}
      </Select>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}
