import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React from 'react';
import { FilterProps } from 'react-table';

const validStatuses = [
  'Backlog',
  'In Progress',
  'Not Deployed Yet',
  'Done',
  'Closed',
];

// Define a default UI for filtering
export default function StatusColumnFilter<T extends object>(
  props: FilterProps<T>
) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxStatus = props.column.filterValue || {};
    if (typeof checkboxStatus === 'object') {
      checkboxStatus[event.target.name] = event.target.checked;
      props.setFilter(props.column.id, checkboxStatus);
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
          {validStatuses.map((status, index) => (
            <MenuItem key={index} disableTouchRipple={true}>
              <FormControlLabel
                control={<Checkbox onChange={handleOnChange} name={status} />}
                label={status}
              />
            </MenuItem>
          ))}
        </FormGroup>
      </Menu>
    </>
  );
}
