import { Grid, Paper, Typography } from "@mui/material";
import { GridColDef, GridValueGetterParams, DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

interface User {
    id: number,
    username: string,
    email_address: string,
    first_name: string,
    last_name: string,
    created: string,
    archived: boolean,
}

const columns: GridColDef<User>[] = [
    { field: 'username', headerName: 'Username', width: 130 },
    {
        field: 'name',
        headerName: 'Name',
        width: 130,
        valueGetter: (params: GridValueGetterParams<string, User>) => `${params.row.first_name} ${params.row.last_name}`,
    },
    {
        field: 'email_address',
        headerName: 'Email Address',
        width: 130,        
        renderCell: (params: GridValueGetterParams<string, User>) => (
            <a href={"mailto:" + params.value}>{params.value}</a>
        ),
    },
    { field: 'created', headerName: 'Created', width: 230 },
]

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .then(() => setLoading(false))
            .catch(() => console.log("tim"));
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
                    List of users
                </Typography>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    disableSelectionOnClick
                />
            </Paper>
        </Grid>
    )
}