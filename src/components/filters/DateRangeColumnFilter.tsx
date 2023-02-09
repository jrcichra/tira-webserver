import { IconButton, Menu } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React from 'react';
import { ColumnInstance, FilterProps, FilterValue, IdType } from 'react-table';
import {
  Calendar,
  DateRangePicker,
  Range,
  RangeKeyDict,
} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Category } from '../../utils/Types';

// Define a default UI for filtering
export default function DateRangeColumnFilter<T extends object>({
  column,
  setFilter,
}: {
  column: ColumnInstance<T>;
  setFilter: (
    columnId: IdType<T>,
    updater: ((filterValue: FilterValue) => FilterValue) | FilterValue
  ) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection;
    if (selection.endDate) {
      // selection.endDate is tied to selection.startDate so we have to make a new Date object
      const newEndDate = new Date(selection.endDate);
      newEndDate.setHours(23, 59, 59, 999);

      selection.endDate = newEndDate;
      setFilter(column.id, selection);
    }
  };

  const selectionRange = column.filterValue || {
    key: 'selection',
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
        <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
      </Menu>
    </>
  );
}
