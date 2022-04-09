import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "./EnvironmentVariables";
import { Ticket } from "./TicketsPage";

export default function TicketPage() {
    const [ticket, setTicket] = useState<Ticket|undefined>();

    let params = useParams();
    let ticketIdStr = params.ticketId;

    if(!ticketIdStr) {
        return <h1>Error: ticketId not found</h1>;
    }

    let ticketId = parseInt(ticketIdStr, 10);

    if(isNaN(ticketId)) {
        return <h1>Error: ticketId not a number</h1>
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/tickets/${ticketId}`)
            .then(response => response.json())
            .then(data => setTicket(data));
    }, []);

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
                    SUBJECT: {ticket?.subject}
                </Typography>
                Description:
                <br/>
                {ticket && <div dangerouslySetInnerHTML={{ __html: ticket?.description }} />}
                <br/>
                Category:
                <br/>
                {ticket?.category_id ?? 'N/A'}
                <br/>
                {ticket?.created}
                <br/>
                {ticket?.priority}
                <br/>
                {ticket?.status}
                <br/>
                {ticket?.reporter_id}
            </Paper>
        </Grid>
    )
}