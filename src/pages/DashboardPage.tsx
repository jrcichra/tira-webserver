import { Grid, Paper, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import { TicketsTable } from '../tables/TicketsTable';
import { Assignment, Ticket, User } from '../utils/Types';
import { getDisplayName } from '../utils/UserUtils';

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
    if (typeof currentUser !== 'undefined') {
      fetch(`/api/users/${currentUser.id}/assignments`)
        .then((response) => response.json())
        .then((data: Assignment[]) => setAssignments(data))
        .finally(() => setAssignmentsLoading(false));

      fetch(`/api/tickets?reporter=${currentUser.id}`)
        .then((response) => response.json())
        .then((data: Ticket[]) => setReportedTickets(data))
        .finally(() => setReportedTicketsLoading(false));
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
