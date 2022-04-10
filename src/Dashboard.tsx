import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./EnvironmentVariables";
import { Ticket } from "./TicketsPage";
import { Assignment } from "./utils/Types";

const assignmentsColumns: GridColDef[] = [
    { field: 'ticket_id', headerName: 'Ticket ID', width: 130 },
    { field: 'assigned', headerName: 'Assigned', width: 130 },
]

const reportedTicketsColumns: GridColDef[] = [
    { field: 'category_id', headerName: 'Category', width: 130 },
    { field: 'subject', headerName: 'Subject', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'priority', headerName: 'Priority', width: 130 },
]

export default function DashBoard() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [reportedTickets, setReportedTickets] = useState<Ticket[]>([]);
    const [reportedTicketsLoading, setReportedTicketsLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/users/assignments`)
            .then(response => response.json())
            .then((data: Assignment[]) => setAssignments(data))
            .finally(() => setAssignmentsLoading(false));
        
        fetch(`${API_BASE_URL}/users/tickets/reported`)
            .then(response => response.json())
            .then((data: Ticket[]) => setReportedTickets(data))
            .finally(() => setReportedTicketsLoading(false));
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Open Tickets Assigned To You
                    </Typography>
                    <DataGrid
                        rows={assignments}
                        columns={assignmentsColumns}
                        loading={assignmentsLoading}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Open Tickets Reported By You
                    </Typography>
                    <DataGrid
                        rows={reportedTickets}
                        columns={reportedTicketsColumns}
                        loading={reportedTicketsLoading}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        All Open Tickets
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}