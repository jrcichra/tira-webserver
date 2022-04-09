import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface Ticket {
    id: number,
    category_id?: number,
    subject: string,
    description: string,
    status: string,
    priority: string,
    created: string,
    reporter_id: number,
}

const columns: GridColDef[] = [
    { field: 'subject', headerName: 'Subject', width: 130 },
    { field: 'category_id', headerName: 'Category', width: 130, valueGetter: (params: GridValueGetterParams<string, Ticket>) => params.row.category_id ?? 'N/A' },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'reporter_id', headerName: 'Reported By', width: 130 },
]

export default function Tickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/tickets")
            .then(response => response.json())
            .then(data => setTickets(data))
            .then(() => setLoading(false));
    }, []);

    return (
        <Grid>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                }}
            >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    List of tickets
                </Typography>
                <DataGrid
                    rows={tickets}
                    columns={columns}
                    loading={loading}
                />
            </Paper>
        </Grid>
    )
}