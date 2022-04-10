import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "./EnvironmentVariables";
import { Ticket } from "./utils/Types";

const columns: GridColDef[] = [
    {
        field: 'subject',
        headerName: 'Subject',
        width: 130,
        renderCell: (params: GridValueGetterParams<string, Ticket>) => (
            <Link to={`/tickets/${params.row.id}`}>{params.value}</Link>
        ),
    },
    { field: 'category_id', headerName: 'Category', width: 130, valueGetter: (params: GridValueGetterParams<string, Ticket>) => params.row.category_id ?? 'N/A' },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'reporter_id', headerName: 'Reported By', width: 130 },
]

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tickets`)
            .then(response => response.json())
            .then(data => setTickets(data))
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
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    List of tickets
                </Typography>
                <DataGrid
                    rows={tickets}
                    columns={columns}
                    loading={loading}
                    disableSelectionOnClick
                />
            </Paper>
        </Grid>
    )
}