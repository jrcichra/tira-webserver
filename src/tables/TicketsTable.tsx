import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React from 'react';
import { Link } from 'react-router-dom';
import { fetchTickets } from '../utils/RestUtil';
import { Ticket } from '../utils/Types';

const columns: GridColDef[] = [
  {
    field: 'subject',
    headerName: 'Subject',
    flex: 2,
    renderCell: (params: GridValueGetterParams<string, Ticket>) => (
      <Link to={`/tickets/${params.row.id}`}>{params.value}</Link>
    ),
  },
  {
    field: 'category_id',
    headerName: 'Category',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<string, Ticket>) =>
      params.row.category ? params.row.category.name : 'N/A',
  },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'reporter_id', headerName: 'Reported By', flex: 1 },
];

export function TicketsTable() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const retrieveTickets = async () => {
      const tickets = await fetchTickets();
      setTickets(tickets);
      setLoading(false);
    };
    retrieveTickets();
  }, []);

  return (
    <DataGrid
      rows={tickets}
      columns={columns}
      loading={loading}
      components={{ Toolbar: GridToolbar }}
    />
  );
}
