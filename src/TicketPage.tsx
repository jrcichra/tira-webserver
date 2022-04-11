import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "./EnvironmentVariables";
import { Comment, Ticket, User } from "./utils/Types";
import Wysiwyg from "./Wysiwyg";

export default function TicketPage({ user }: { user: User }) {
    const [ticket, setTicket] = useState<Ticket | undefined>();
    const [comments, setComments] = useState<Comment[] | undefined>();
    const [comment, setComment] = useState('');

    let params = useParams();
    let ticketIdStr = params.ticketId;

    if (!ticketIdStr) {
        return <h1>Error: ticketId not found</h1>;
    }

    let ticketId = parseInt(ticketIdStr, 10);

    if (isNaN(ticketId)) {
        return <h1>Error: ticketId not a number</h1>
    }

    useEffect(() => {
        async function getTickets() {
            let ticketsResponse = await fetch(`${API_BASE_URL}/tickets/${ticketId}`)
            if (!ticketsResponse.ok) {
                return;
            }
            setTicket(await ticketsResponse.json());
            let commentsResponse = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`)
            setComments(await commentsResponse.json());
        }

        getTickets();
    }, []);

    const handleSubmitComment = () => {
        console.log(comment);
        const request = {
            content: comment
        };

        fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
            method: 'POST',
            body: JSON.stringify(request)
        }).then(response => {
            setComment('')
            fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`).then(response => response.json()).then((data) => setComments(data))
        })

        
        // .then(data => setTicket(data));
    };

    let commentElements = undefined;

    if(comments) {
        commentElements = comments.sort((a, b) => b.commented.localeCompare(a.commented)).map((c: Comment) => (
            <Grid key={c.id} item lg={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {`${c.commenter_id} ${c.commented}`}
                    <Divider />
                    <div dangerouslySetInnerHTML={{ __html: c.content }} />
                </Paper>
            </Grid>
        ));
    }

    return (
        <Grid container spacing={3}>
            <Grid item lg={8}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        {ticket?.subject}
                    </Typography>
                    <br />
                    {
                        ticket && <div dangerouslySetInnerHTML={{ __html: ticket?.description }} />
                    }
                </Paper>
            </Grid>
            <Grid item lg={4}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    Category:
                    <br />
                    {ticket?.category_id ?? 'N/A'}
                    <br />
                    {ticket?.created}
                    <br />
                    {ticket?.priority}
                    <br />
                    {ticket?.status}
                    <br />
                    {ticket?.reporter_id}
                </Paper>
            </Grid>
            <Grid item lg={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Comments
                    </Typography>
                    <Wysiwyg value={comment} onChange={setComment} placeholder='Comment' />
                    <Button
                        onClick={handleSubmitComment}
                        variant="contained"
                        color='primary'
                        sx={{
                            mt: 2
                        }}
                    >
                        Comment
                    </Button>
                    <Divider />
                </Paper>
            </Grid>
            {commentElements}
        </Grid>
    )
}