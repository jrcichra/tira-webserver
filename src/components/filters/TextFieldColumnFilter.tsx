import { IconButton, Menu, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { FilterProps } from 'react-table';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function TextFieldColumnFilter<T extends object>(
  props: FilterProps<T>
) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const filterRef = React.useRef<HTMLInputElement>();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const moveFocusToInput = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Tab') {
      event.stopPropagation();
      event.preventDefault();
      if (filterRef && filterRef.current) {
        filterRef.current.focus();
      }
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
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disableTouchRipple={true} onKeyDown={moveFocusToInput}>
          <TextField
            inputRef={filterRef}
            label='Filter'
            value={props.column.filterValue}
            onChange={(e) => props.setFilter(props.column.id, e.target.value)}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
