import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface Assignment {
    id: number,
    category_id?: number,
    subject: string,
    description: string,
    status: string,
    priority: string,
    created: string,
    reporter_id: number,
}

const assignmentsColumns: GridColDef[] = [
    { field: 'ticket_id', headerName: 'Ticket ID', width: 130 },
    { field: 'assigned', headerName: 'Assigned', width: 130 },
]

export default function DashBoard() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/users/1/assignments")
            .then(response => response.json())
            .then(data => setAssignments(data))
            .then(() => setLoading(false));
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
                        loading={loading}
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
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <h1>wenny</h1>
                </Paper>
            </Grid>
        </Grid>
    )
}