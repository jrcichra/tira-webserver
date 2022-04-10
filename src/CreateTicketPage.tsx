import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowId, GridSelectionModel, GridValueGetterParams } from "@mui/x-data-grid";
import React from "react";
import { MouseEvent, useState, useRef, useEffect, useMemo, ChangeEvent } from "react";
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import CategorySelect from "./CategorySelect";
import { API_BASE_URL } from "./EnvironmentVariables";
import { Category, CreatedTicket, ErrorMessage, User } from "./utils/Types";

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

export default function CreateTicketPage({categories, setCategories}: {categories: Category[], setCategories: (category: Category[]) => void }) {
    const [fields, setFields] = React.useState({
        subject: '',
        description: '',
        priority: 'Low',
    });
    const [error, setError] = React.useState<string | undefined>();
    const [selectedCategoryId, setSelectedCategoryId] = React.useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);

    const handleFieldChange = (key: string) => (value: string) => {
        setFields({ ...fields, [key]: value });
    }

    const handleTextFieldChange = (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleFieldChange(key)(event.target.value);
    }

    const handleSelectFieldChange = (key: string) => (event: SelectChangeEvent) => {
        handleFieldChange(key)(event.target.value);
    }

    const handleCategorySelectChange = (event: SelectChangeEvent<number>) => {
        let value = event.target.value;
        if(typeof value === 'string') {
            value = parseInt(value);
        }

        setSelectedCategoryId(value);
    }

    let navigate = useNavigate();

    const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
        const ticket = {
            ...fields,
            status: 'Backlog',
            category_id: selectedCategoryId === 0 ? null : selectedCategoryId
        };

        fetch(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket)
        })
            .then(response => {
                if (response.ok) {
                    response.json().then((data: CreatedTicket) => {
                        navigate(`/tickets/${data.id}`);
                    })
                } else {
                    response.json().then((data: ErrorMessage) => {
                        setError(data.message);
                    })
                }
            })
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/users`)
            .then(response => response.json())
            .then((data: User[]) => setUsers(data))
            .then(() => setUsersLoading(false));
    }, []);

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    return (
        <Grid>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Create New Ticket
                </Typography>
                <TextField value={fields.subject} onChange={handleTextFieldChange('subject')} margin='normal' id="outlined-basic" label="Subject" variant="outlined" />
                <Box sx={{ mt: 2, mb: 2 }}>
                    <ReactQuill
                        value={fields.description}
                        onChange={handleFieldChange('description')}
                        placeholder='Description'
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />
                </Box>
                <FormControl margin="normal" fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={fields.priority}
                        label="Priority"
                        onChange={handleSelectFieldChange('priority')}
                    >
                        <MenuItem value={'Low'}>Low</MenuItem>
                        <MenuItem value={'Medium'}>Medium</MenuItem>
                        <MenuItem value={'High'}>High</MenuItem>
                    </Select>
                </FormControl>
                <CategorySelect categories={categories} selectedIndex={selectedCategoryId} onChange={handleCategorySelectChange} />
                <Box sx={{ height: 280 }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        checkboxSelection
                        selectionModel={selectionModel}
                        onSelectionModelChange={(newSelectionModel: GridSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                        }}
                    />
                </Box>
                {error &&
                    <Typography align="center" component="h2" variant="h6" color="error">
                        ERROR: {error}
                    </Typography>
                }
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color='primary'
                    sx={{
                        mt: 2,
                    }}
                    fullWidth
                >
                    Create Ticket
                </Button>
            </Paper>
        </Grid>
    )
}