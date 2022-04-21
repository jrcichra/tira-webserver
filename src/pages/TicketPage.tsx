import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../EnvironmentVariables';
import { fetchTicketById } from '../utils/RestUtil';
import { Comment, Ticket, User } from '../utils/Types';
import Wysiwyg from '../Wysiwyg';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TicketPage({
  loggedIn,
  user,
}: {
  loggedIn: boolean;
  user: User | undefined;
}) {
  const [ticket, setTicket] = React.useState<Ticket | undefined>();
  const [comments, setComments] = React.useState<Comment[] | undefined>();
  const [comment, setComment] = React.useState('');

  const [editingCommentId, setEditingCommentId] = React.useState<number | null>(
    null
  );
  const [editingComment, setEditingComment] = React.useState('');

  let params = useParams();
  let ticketIdStr = params.ticketId;

  if (!ticketIdStr) {
    return <h1>Error: ticketId not found</h1>;
  }

  let ticketId = parseInt(ticketIdStr, 10);

  if (isNaN(ticketId)) {
    return <h1>Error: ticketId not a number</h1>;
  }

  useEffect(() => {
    async function getTickets() {
      let ticket = await fetchTicketById(ticketId);
      setTicket(ticket);
      let commentsResponse = await fetch(
        `${API_BASE_URL}/tickets/${ticketId}/comments`
      );
      setComments(await commentsResponse.json());
    }

    getTickets();
  }, []);

  let navigate = useNavigate();

  const handleSubmitComment = () => {
    const request = {
      content: comment,
    };

    fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(request),
    }).then((response) => {
      setComment('');
      fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`)
        .then((response) => response.json())
        .then((data) => setComments(data));
    });

    // .then(data => setTicket(data));
  };

  const handleEditTicket = () => {
    navigate(`/tickets/edit/${ticketId}`);
  };

  const handleEditComment = (commentContent: string, commentId: number) => {
    setEditingComment(commentContent);
    setEditingCommentId(commentId);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
  };

  const handleSubmitEditComment = (commentId: number) => {
    const request = {
      content: editingComment,
    };

    fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }).then((response) => {
      if (response.ok) {
        setEditingCommentId(null);
        fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`)
          .then((response) => response.json())
          .then((data) => setComments(data));
      }
    });
  };

  let commentElements = undefined;

  if (comments) {
    commentElements = comments
      .sort((a, b) => b.commented.localeCompare(a.commented))
      .map((c: Comment) => {
        let commentDisplay = (
          <div dangerouslySetInnerHTML={{ __html: c.content }} />
        );

        if (editingCommentId && editingCommentId === c.id) {
          commentDisplay = (
            <>
              <Wysiwyg
                value={editingComment}
                onChange={setEditingComment}
                placeholder='Description'
              />
              <Button
                onClick={() => handleSubmitEditComment(c.id)}
                variant='contained'
                color='primary'
              >
                Edit Comment
              </Button>
              <Button
                onClick={handleCancelEditComment}
                variant='contained'
                color='primary'
              >
                Cancel
              </Button>
            </>
          );
        }

        return (
          <Grid key={c.id} item lg={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Avatar>TC</Avatar>
                {`${c.commenter_id} ${c.commented}`}
                {loggedIn && !editingCommentId && (
                  <IconButton
                    onClick={() => handleEditComment(c.content, c.id)}
                    sx={{
                      marginLeft: 'auto',
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>
              <Divider />
              {commentDisplay}
            </Paper>
          </Grid>
        );
      });
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={8}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography component='h2' variant='h6' color='primary' gutterBottom>
            {ticket?.subject}
          </Typography>
          <br />
          {ticket && (
            <div dangerouslySetInnerHTML={{ __html: ticket?.description }} />
          )}
        </Paper>
      </Grid>
      <Grid item lg={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
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
          <br />
          <Button
            onClick={handleEditTicket}
            variant='contained'
            color='primary'
            sx={{
              mt: 2,
            }}
          >
            Edit Ticket
          </Button>
        </Paper>
      </Grid>
      {loggedIn && (
        <Grid item lg={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              component='h2'
              variant='h6'
              color='primary'
              gutterBottom
            >
              Comments
            </Typography>
            <Wysiwyg
              value={comment}
              onChange={setComment}
              placeholder='Comment'
            />
            <Button
              onClick={handleSubmitComment}
              variant='contained'
              color='primary'
              sx={{
                mt: 2,
              }}
            >
              Comment
            </Button>
            <Divider />
          </Paper>
        </Grid>
      )}
      {commentElements}
    </Grid>
  );
}
