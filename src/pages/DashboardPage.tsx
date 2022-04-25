import { Grid, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../EnvironmentVariables';
import { Assignment, Ticket, User } from '../utils/Types';

const assignmentsColumns: GridColDef[] = [
  { field: 'ticket_id', headerName: 'Ticket ID', width: 130 },
  { field: 'assigned', headerName: 'Assigned', width: 130 },
];

const reportedTicketsColumns: GridColDef[] = [
  { field: 'category_id', headerName: 'Category', width: 130 },
  { field: 'subject', headerName: 'Subject', width: 130 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'priority', headerName: 'Priority', width: 130 },
];

const ticketsColumns: GridColDef[] = [
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

export default function DashBoard({
  loggedIn,
  currentUser,
}: {
  loggedIn: boolean;
  currentUser: User | undefined;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [reportedTickets, setReportedTickets] = useState<Ticket[]>([]);
  const [reportedTicketsLoading, setReportedTicketsLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  useEffect(() => {
    if (typeof currentUser !== 'undefined') {
      fetch(`${API_BASE_URL}/users/${currentUser.id}/assignments`)
        .then((response) => response.json())
        .then((data: Assignment[]) => setAssignments(data))
        .finally(() => setAssignmentsLoading(false));

      fetch(`${API_BASE_URL}/tickets?reporter=${currentUser.id}`)
        .then((response) => response.json())
        .then((data: Ticket[]) => setReportedTickets(data))
        .finally(() => setReportedTicketsLoading(false));
    }
  }, [currentUser]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tickets?open`)
      .then((response) => response.json())
      .then((data: Ticket[]) => setTickets(data))
      .finally(() => setTicketsLoading(false));
  }, []);

  return (
    <Grid container spacing={3}>
      {loggedIn && (
        <>
          <Grid item xs={6}>
            {assignments && (
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 500,
                }}
              >
                <Typography
                  component='h2'
                  variant='h6'
                  color='primary'
                  gutterBottom
                >
                  Open Tickets Assigned To You
                </Typography>
                <DataGrid
                  rows={assignments}
                  columns={assignmentsColumns}
                  loading={assignmentsLoading}
                />
              </Paper>
            )}
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 500,
              }}
            >
              <Typography
                component='h2'
                variant='h6'
                color='primary'
                gutterBottom
              >
                Open Tickets Reported By You
              </Typography>
              <DataGrid
                rows={reportedTickets}
                columns={reportedTicketsColumns}
                loading={reportedTicketsLoading}
              />
            </Paper>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Paper
          sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 700 }}
        >
          <Typography component='h2' variant='h6' color='primary' gutterBottom>
            All Open Tickets
          </Typography>
          <DataGrid
            rows={tickets}
            columns={ticketsColumns}
            loading={ticketsLoading}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
