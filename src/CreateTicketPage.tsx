import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { MouseEvent, useState, useRef, useEffect, useMemo, ChangeEvent } from "react";
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./EnvironmentVariables";

export default function CreateTicketPage() {
    const [fields, setFields] = useState({
        subject: '',
        description: '',
        priority: ''
    });

    const handleDescriptionChange = (value: string) => {
        setFields({...fields, description: value});
    }

    const handleTextFieldChange = (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFields({...fields, [key]: event.target.value});
    }

    const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
        const ticket = {
            status: 'OPEN',
            ...fields
        };

        fetch(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket)
        })
        .then(response => {
            if(response.ok) {
                navigate('/')
            }
        });
    }

    let navigate = useNavigate();

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
                    Create new ticket
                </Typography>
                <TextField value={fields.subject} onChange={handleTextFieldChange('subject')} id="outlined-basic" label="Subject" variant="outlined" />
                <Box sx={{ mt: 2 }}>
                    <ReactQuill
                        value={fields.description}
                        onChange={handleDescriptionChange}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline','strike', 'blockquote'],
                                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />
                </Box>
                <TextField value={fields.priority} onChange={handleTextFieldChange('priority')} margin="normal" id="outlined-basic" label="Priority" variant="outlined" />
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