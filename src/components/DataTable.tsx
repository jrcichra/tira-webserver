import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  TablePagination,
  TableSortLabel,
  CircularProgress,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import {
  Column,
  Filters,
  FilterTypes,
  HeaderGroup,
  IdType,
  Row,
  TableBodyPropGetter,
  TableBodyProps,
  useFilters,
  useTable,
} from 'react-table';
import { CountResponse, TableOrder } from '../utils/Types';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

function DataTableHeader<T extends object>({
  headerGroups,
  sortBy,
  order,
  handleSortOnClick,
}: {
  headerGroups: HeaderGroup<T>[];
  sortBy?: IdType<T>;
  order?: TableOrder;
  handleSortOnClick: (newOrderBy: IdType<T>) => () => void;
}) {
  return (
    <TableHead>
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <TableCell {...column.getHeaderProps()}>
              <TableSortLabel
                active={sortBy === column.id}
                direction={sortBy === column.id ? order : 'asc'}
                onClick={handleSortOnClick(column.id)}
              >
                {column.render('Header')}
                {sortBy === column.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
              {column.render('Filter')}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
}

function DataTableBody<T extends object>({
  getTableBodyProps,
  loading,
  rows,
  prepareRow,
}: {
  getTableBodyProps: (
    propGetter?: TableBodyPropGetter<T> | undefined
  ) => TableBodyProps;
  loading: boolean;
  rows: Row<T>[];
  prepareRow: (row: Row<T>) => void;
}) {
  return (
    <TableBody {...getTableBodyProps()}>
      {loading ? (
        <CircularProgress />
      ) : (
        rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow
              {...row.getRowProps()}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      )}
    </TableBody>
  );
}

export default function DataTable<T extends object>({
  columns,
  filterTypes,
  fetchData,
}: {
  columns: Column<T>[];
  filterTypes: FilterTypes<T>;
  fetchData: (
    limit: number,
    offset: number,
    sortBy?: IdType<T>,
    orderBy?: TableOrder,
    filters?: Filters<T>
  ) => Promise<CountResponse<T>>;
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    ROWS_PER_PAGE_OPTIONS[1]
  );
  const [totalRows, setTotalRows] = React.useState(-1);

  const [sortBy, setSortBy] = React.useState<IdType<T>>();
  const [order, setOrder] = React.useState<TableOrder>();

  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const defaultColumn: Partial<Column<T>> = {
    Filter: () => null,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { filters },
    setFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters
  );

  const retrieveData = React.useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchData(
        rowsPerPage,
        rowsPerPage * page,
        sortBy,
        order,
        filters
      );

      setData(response.data);
      setTotalRows(response.total_count);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [fetchData, order, page, rowsPerPage, sortBy]);

  React.useEffect(() => {
    retrieveData();
  }, [retrieveData]);

  const handleDelete = (id: IdType<T>) => {
    setFilter(id, undefined);
  };

  const chips = filters.map((filter) => {
    return (
      <Chip
        sx={{ mt: 2, mr: 1 }}
        key={filter.id}
        label={`${filter.id}: ${filter.value}`}
        onDelete={() => handleDelete(filter.id)}
      />
    );
  });

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortOnClick = (newOrderBy: IdType<T>) => () => {
    const isAsc = sortBy === newOrderBy && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortBy(newOrderBy);
    fetchData(rowsPerPage, rowsPerPage * page, sortBy, order, filters);
  };

  return (
    <Paper>
      <TableContainer>
        <Box sx={{ ml: 1 }}>{chips}</Box>
        <Table {...getTableProps()} aria-label='simple table'>
          <DataTableHeader
            headerGroups={headerGroups}
            sortBy={sortBy}
            order={order}
            handleSortOnClick={handleSortOnClick}
          />
          <DataTableBody
            getTableBodyProps={getTableBodyProps}
            loading={loading}
            rows={rows}
            prepareRow={prepareRow}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component='div'
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
