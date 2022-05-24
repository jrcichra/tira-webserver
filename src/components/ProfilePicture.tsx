import { Avatar } from '@mui/material';
import React from 'react';
import { User } from '../utils/Types';
import { getDisplayInitials } from '../utils/UserUtils';

export default function ProfilePicture({ user }: { user: User }) {
  const initials = getDisplayInitials(user);

  return <Avatar src={user.profile_picture_url}>{initials}</Avatar>;
}
