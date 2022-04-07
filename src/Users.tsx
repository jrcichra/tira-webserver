import { Grid, Paper, Typography } from "@mui/material";
import { GridColDef, GridValueGetterParams, DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

const columns: GridColDef[] = [
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'password', headerName: 'Password', width: 230 },
    { field: 'email_address', headerName: 'Email Address', width: 130 },
    { field: 'name', headerName: 'Name', width: 130, valueGetter: (params: GridValueGetterParams) => `${params.row.first_name} ${params.row.last_name}` },
]

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/api/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .then(() => setLoading(false));
    }, []);

    return (
        <Grid spacing={3}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                }}
            >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    List of users
                </Typography>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                />
            </Paper>
        </Grid>
    )
}