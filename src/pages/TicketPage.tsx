import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCommentInTicketByTicketId,
  retrieveCommentsByTicketId,
  retrieveTicketById,
} from '../services/TicketService';
import { Comment, Ticket } from '../utils/Types';
import Wysiwyg from '../Wysiwyg';
import ProfilePicture from '../components/ProfilePicture';
import CommentDisplay from '../components/CommentDisplay';
import { getDisplayName } from '../utils/UserUtils';
import { getLocalTime } from '../utils/TimeUtils';
import { updateComment } from '../services/CommentService';

export default function TicketPage({ loggedIn }: { loggedIn: boolean }) {
  const [ticket, setTicket] = React.useState<Ticket | undefined>();
  const [comments, setComments] = React.useState<Comment[] | undefined>();
  const [comment, setComment] = React.useState('');

  const [editingCommentId, setEditingCommentId] = React.useState<number | null>(
    null
  );
  const [editComment, setEditComment] = React.useState('');

  const params = useParams();
  const ticketIdStr = params.ticketId;

  useEffect(() => {
    if (!ticketIdStr) {
      return;
    }

    const ticketId = parseInt(ticketIdStr, 10);

    if (isNaN(ticketId)) {
      return;
    }

    async function getTickets(ticketId: number) {
      setTicket(await retrieveTicketById(ticketId));
      setComments(await retrieveCommentsByTicketId(ticketId));
    }

    getTickets(ticketId);
  }, [ticketIdStr]);

  const navigate = useNavigate();

  if (!ticketIdStr) {
    return <h1>Error: ticketId not found</h1>;
  }

  const ticketId = parseInt(ticketIdStr, 10);

  if (isNaN(ticketId)) {
    return <h1>Error: ticketId not a number</h1>;
  }

  const handleSubmitComment = async () => {
    const requestBody = {
      content: comment,
    };

    try {
      await createCommentInTicketByTicketId(ticketId, requestBody);

      setComment('');
      setComments(await retrieveCommentsByTicketId(ticketId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTicket = () => {
    navigate(`/tickets/edit/${ticketId}`);
  };

  const handleEditComment = (commentId: number) => {
    setEditingCommentId(commentId);
  };

  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
  };

  const isCommentButtonDisabled = () => {
    const contentWithoutTags = comment.replace(
      /(<\/?[^>]+(>|$)|&nbsp;|\s)/g,
      ''
    );
    return contentWithoutTags === '';
  };

  let commentElements = undefined;

  if (comments) {
    const handleEditCommentSubmit = async () => {
      if (!editingCommentId) {
        return;
      }

      const request = {
        content: editComment,
      };

      try {
        await updateComment(editingCommentId, request);

        setEditingCommentId(null);
        setComments(await retrieveCommentsByTicketId(ticketId));
      } catch (error) {
        console.error(error);
      }
    };

    commentElements = comments
      .sort((a, b) => b.commented.localeCompare(a.commented))
      .map((c: Comment) => (
        <Grid key={c.id} item xs={12}>
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
              editing={editingCommentId === c.id}
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
          <Grid item xs={8}>
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
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <span>
                Category: {ticket.category ? ticket.category.name : 'N/A'}
              </span>
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
              <span>
                Assignees:{' '}
                {ticket.assignees
                  .map((assignee) => getDisplayName(assignee))
                  .join(',')}
              </span>
              {loggedIn && (
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
              )}
            </Paper>
          </Grid>
        </>
      )}
      {loggedIn && (
        <Grid item xs={12}>
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
              disabled={isCommentButtonDisabled()}
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
