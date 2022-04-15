import { Grid, Paper, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './EnvironmentVariables';
import { Ticket } from './utils/Types';

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
      params.row.category_id ?? 'N/A',
  },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'reporter_id', headerName: 'Reported By', flex: 1 },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tickets`)
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

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
        <div style={{ flexGrow: 1, flexDirection: 'row' }}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            rows={tickets}
            columns={columns}
            loading={loading}
            disableSelectionOnClick
          />
        </div>
      </Paper>
    </Grid>
  );
}
