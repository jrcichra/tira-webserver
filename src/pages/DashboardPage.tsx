import { Grid, Paper, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import { retrieveTickets } from '../services/TicketService';
import { retrieveAssignmentsByUserId } from '../services/UserService';
import { TicketsTable } from '../tables/TicketsTable';
import { Assignment, Ticket, User } from '../utils/Types';
import { getDisplayName } from '../utils/UserUtils';

const assignmentsColumns: GridColDef[] = [
  {
    field: 'subject',
    headerName: 'Subject',
    flex: 2,
    valueGetter: (params: GridValueGetterParams<string, Assignment>) =>
      params.row.ticket.subject,
    renderCell: (params: GridValueGetterParams<string, Assignment>) => (
      <Link to={`/tickets/${params.row.ticket.id}`}>{params.value}</Link>
    ),
  },
  {
    field: 'category_id',
    headerName: 'Category',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<string, Assignment>) =>
      params.row.ticket.category ? params.row.ticket.category.name : 'N/A',
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<string, Assignment>) =>
      params.row.ticket.status,
  },
  {
    field: 'reporter_id',
    headerName: 'Reported By',
    flex: 1,
    renderCell: (params: GridRenderCellParams<string, Assignment>) => {
      return (
        <>
          <ProfilePicture user={params.row.ticket.reporter} />
          <span style={{ marginLeft: 10 }}>
            {getDisplayName(params.row.ticket.reporter)}
          </span>
        </>
      );
    },
  },
];

const reportedTicketsColumns: GridColDef[] = [
  { field: 'category_id', headerName: 'Category', width: 130 },
  { field: 'subject', headerName: 'Subject', width: 130 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'priority', headerName: 'Priority', width: 130 },
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

  useEffect(() => {
    async function getTicketsReportedByCurrentUser(currentUserId: number) {
      try {
        const tickets: Ticket[] = await retrieveTickets({
          filterReporter: currentUserId,
        });

        setReportedTickets(tickets);
      } catch (error) {
        console.error(error);
      }
      setReportedTicketsLoading(false);
    }

    async function getAssignmentsForCurrentUser(currentUserId: number) {
      try {
        const assignments: Assignment[] = await retrieveAssignmentsByUserId(
          currentUserId
        );

        setAssignments(assignments);
      } catch (error) {
        console.error(error);
      }
      setAssignmentsLoading(false);
    }

    if (typeof currentUser !== 'undefined') {
      getAssignmentsForCurrentUser(currentUser.id);
      getTicketsReportedByCurrentUser(currentUser.id);
    }
  }, [currentUser]);

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
                  components={{ Toolbar: GridToolbar }}
                />
              </Paper>
            )}
          </Grid>
          {currentUser && (
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
                <TicketsTable reporter={currentUser.id} open={true} />
              </Paper>
            </Grid>
          )}
        </>
      )}
      <Grid item xs={12}>
        <Paper
          sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 700 }}
        >
          <Typography component='h2' variant='h6' color='primary' gutterBottom>
            All Open Tickets
          </Typography>
          <TicketsTable open={true} />
        </Paper>
      </Grid>
    </Grid>
  );
}
