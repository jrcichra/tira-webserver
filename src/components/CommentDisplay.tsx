import {
  Box,
  IconButton,
  Divider,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { Comment } from '../utils/Types';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import Wysiwyg from '../Wysiwyg';
import ProfilePicture from './ProfilePicture';
import { getDisplayName } from '../utils/UserUtils';

export default function CommentDisplay({
  comment,
  loggedIn,
  editing,
  editComment,
  setEditComment,
  handleEditCommentSubmit,
  handleEditCommentCancel,
}: {
  comment: Comment;
  loggedIn: boolean;
  editing: boolean;
  editComment: string;
  setEditComment: (newEditComment: string) => void;
  handleEditComment: () => void;
  handleEditCommentSubmit: () => void;
  handleEditCommentCancel: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  let commentDisplay = (
    <div dangerouslySetInnerHTML={{ __html: comment.content }} />
  );

  if (editing) {
    commentDisplay = (
      <>
        <Wysiwyg
          value={editComment}
          onChange={setEditComment}
          placeholder='Comment'
        />
        <Button
          onClick={handleEditCommentSubmit}
          variant='contained'
          color='primary'
        >
          Edit Comment
        </Button>
        <Button
          onClick={handleEditCommentCancel}
          variant='contained'
          color='primary'
        >
          Cancel
        </Button>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <ProfilePicture user={comment.commenter} />
        <span>{`${getDisplayName(comment.commenter)}`}</span>
        {loggedIn && !editing && (
          <IconButton
            onClick={handleMenu}
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
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>Edit Comment</MenuItem>
        <MenuItem>Delete Comment</MenuItem>
      </Menu>
    </>
  );
}
