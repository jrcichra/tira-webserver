import { AvatarGroup, Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { Column, Filters, FilterTypes, IdType } from 'react-table';
import ProfilePicture from '../components/ProfilePicture';
import StatusColumnFilter from '../components/filters/StatusColumnFilter';
import DataTable from '../components/DataTable';
import { retrieveTickets } from '../services/TicketService';
import { getLocalTime } from '../utils/TimeUtils';
import { Category, TableOrder, Ticket } from '../utils/Types';
import { getDisplayName } from '../utils/UserUtils';
import CategoryColumnFilter from '../components/filters/CategoryColumnFilter';
import DateRangeColumnFilter from '../components/filters/DateRangeColumnFilter';

export default function TicketsPage({
  categories,
}: {
  categories: Category[] | undefined;
}) {
  const fetchTickets = async (
    limit: number,
    offset: number,
    sortBy?: IdType<Ticket>,
    orderBy?: TableOrder,
    filters?: Filters<Ticket>
  ) => {
    return await retrieveTickets(
      limit,
      offset,
      undefined,
      undefined,
      sortBy,
      orderBy
    );
  };

  const columns: Column<Ticket>[] = [
    {
      Header: 'Subject',
      accessor: 'subject',
      width: 2,
    },
    {
      Header: 'Category',
      accessor: (row) => (row.category ? row.category.name : 'N/A'),
      width: 1,
      Filter: (props) => (
        <CategoryColumnFilter {...props} categories={categories} />
      ),
      filter: 'array',
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: 1,
      Filter: (props) => <StatusColumnFilter {...props} />,
      filter: 'status',
    },
    {
      Header: 'Reported By',
      accessor: (row) => (
        <Box sx={{ display: 'flex' }}>
          <ProfilePicture user={row.reporter} />
          <Box component={'span'} style={{ marginLeft: 10 }}>
            {getDisplayName(row.reporter)}
          </Box>
        </Box>
      ),
      width: 1,
    },
    {
      Header: 'Assignees',
      accessor: (row) => (
        <Box sx={{ display: 'flex' }}>
          <AvatarGroup>
            {row.assignees.map((assignee) => (
              <ProfilePicture key={assignee.id} user={assignee} />
            ))}
          </AvatarGroup>
        </Box>
      ),
      width: 1,
    },
    {
      Header: 'Created',
      accessor: 'created',
      width: 1,
      Cell: (props) => <span>{getLocalTime(props.row.original.created)}</span>,
      Filter: (props) => <DateRangeColumnFilter {...props} />,
      filter: 'dateRange',
    },
  ];

  const filterTypes: FilterTypes<Ticket> = {
    array: (rows, ids, filterValue) => {
      return rows.filter((row) => {
        if (!Array.isArray(filterValue)) {
          return true;
        }

        return filterValue.includes(row.values[ids[0]]);
      });
    },
    status: (rows, ids, filterValue) => {
      return rows.filter((row) => filterValue[row.values[ids[0]]] || false);
    },
    user: (rows, ids, filterValue) => {
      return rows.filter((row) => filterValue[row.values[ids[0]]] || false);
    },
    dateRange: (rows, ids, filterValue) => {
      return rows.filter((row) => {
        const rowDate = new Date(row.values[ids[0]]);
        return rowDate > filterValue.startDate && rowDate < filterValue.endDate;
      });
    },
  };

  return (
    <Grid>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 740,
        }}
      >
        <Typography component='h2' variant='h6' color='primary' gutterBottom>
          List of tickets
        </Typography>
        <DataTable
          columns={columns}
          filterTypes={filterTypes}
          fetchData={fetchTickets}
        />
      </Paper>
    </Grid>
  );
}
