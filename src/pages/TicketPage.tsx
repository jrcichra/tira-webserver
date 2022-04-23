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
import ProfilePicture from '../components/ProfilePicture';
import CommentDisplay from '../components/CommentDisplay';
import { getDisplayName } from '../utils/UserUtils';
import { getLocalTime } from '../utils/TimeUtils';

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

  const [editCommentId, setEditCommentId] = React.useState<number | null>(null);
  const [editComment, setEditComment] = React.useState('');

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

  const handleEditComment = (commentId: number) => {
    setEditCommentId(commentId);
  };

  const handleEditCommentCancel = () => {
    setEditCommentId(null);
  };

  let commentElements = undefined;

  if (comments) {
    const handleEditCommentSubmit = () => {
      if (!editCommentId) {
        return;
      }

      const request = {
        content: editComment,
      };

      fetch(`${API_BASE_URL}/comments/${editCommentId}`, {
        method: 'PATCH',
        body: JSON.stringify(request),
      }).then((response) => {
        if (response.ok) {
          setEditCommentId(null);
          fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`)
            .then((response) => response.json())
            .then((data) => setComments(data));
        }
      });
    };

    commentElements = comments
      .sort((a, b) => b.commented.localeCompare(a.commented))
      .map((c: Comment) => (
        <Grid key={c.id} item lg={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CommentDisplay
              comment={c}
              loggedIn={loggedIn}
              editing={editCommentId === c.id}
              editComment={editComment}
              setEditComment={setEditComment}
              handleEditComment={() => handleEditComment(c.id)}
              handleEditCommentSubmit={handleEditCommentSubmit}
              handleEditCommentCancel={handleEditCommentCancel}
            />
          </Paper>
        </Grid>
      ));
  }

  return (
    <Grid container spacing={3}>
      {ticket && (
        <>
          <Grid item lg={8}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Typography
                component='h2'
                variant='h6'
                color='primary'
                gutterBottom
              >
                {ticket?.subject}
              </Typography>
              <br />
              {ticket && (
                <div
                  dangerouslySetInnerHTML={{ __html: ticket?.description }}
                />
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
              <span>Category: {ticket.category_id ?? 'N/A'}</span>
              <span>Created: {getLocalTime(ticket.created)}</span>
              <span>Piority: {ticket.priority}</span>
              <span>Status: {ticket.status}</span>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <span>Reporter:</span>
                <ProfilePicture user={ticket.reporter} />
                <span>{getDisplayName(ticket.reporter)}</span>
              </Box>
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
        </>
      )}
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
