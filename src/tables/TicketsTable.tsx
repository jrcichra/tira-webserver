import { AvatarGroup } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import { fetchTickets } from '../utils/RestUtil';
import { Ticket } from '../utils/Types';
import { getDisplayName } from '../utils/UserUtils';

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
  {
    field: 'reporter_id',
    headerName: 'Reported By',
    flex: 1,
    renderCell: (params: GridRenderCellParams<string, Ticket>) => {
      return (
        <>
          <ProfilePicture user={params.row.reporter} />
          <span style={{ marginLeft: 10 }}>
            {getDisplayName(params.row.reporter)}
          </span>
        </>
      );
    },
  },
  {
    field: 'assignees',
    headerName: 'Assignees',
    flex: 1,
    renderCell: (params: GridValueGetterParams<string, Ticket>) => (
      <AvatarGroup>
        {params.row.assignees.map((assignee) => (
          <ProfilePicture key={assignee.id} user={assignee} />
        ))}
      </AvatarGroup>
    ),
  },
];

export function TicketsTable({
  reporter,
  open,
}: {
  reporter?: number;
  open?: boolean;
}) {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const retrieveTickets = async () => {
      const tickets = await fetchTickets({ reporter, open });
      setTickets(tickets);
      setLoading(false);
    };
    retrieveTickets();
  }, [open, reporter]);

  return (
    <DataGrid
      rows={tickets}
      columns={columns}
      loading={loading}
      components={{ Toolbar: GridToolbar }}
    />
  );
}
