import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React from 'react';
import { ColumnInstance, FilterProps, FilterValue, IdType } from 'react-table';
import { Category } from '../../utils/Types';

export default function CategoryColumnFilter<T extends object>({
  column,
  setFilter,
  categories,
}: {
  column: ColumnInstance<T>;
  setFilter: (
    columnId: IdType<T>,
    updater: ((filterValue: FilterValue) => FilterValue) | FilterValue
  ) => void;
  categories?: Category[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let filterValue = column.filterValue;
    if (!filterValue) {
      filterValue = [];
    }

    if (Array.isArray(filterValue)) {
      if (event.target.checked) {
        filterValue.push(event.target.name);
      } else {
        const index = filterValue.indexOf(event.target.name);
        filterValue.splice(index, 1);

        if (filterValue.length === 0) {
          filterValue = undefined;
        }
      }
      setFilter(column.id, filterValue);
    }
  };

  return (
    <>
      <IconButton onClick={handleMenu}>
        <FilterAltIcon />
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FormGroup>
          {categories &&
            categories.map((category) => (
              <MenuItem key={category.id} disableTouchRipple={true}>
                <FormControlLabel
                  control={
                    <Checkbox onChange={handleOnChange} name={category.name} />
                  }
                  label={category.name}
                />
              </MenuItem>
            ))}
          <MenuItem disableTouchRipple={true}>
            <FormControlLabel
              control={<Checkbox onChange={handleOnChange} name={'N/A'} />}
              label={'N/A'}
            />
          </MenuItem>
        </FormGroup>
      </Menu>
    </>
  );
}
