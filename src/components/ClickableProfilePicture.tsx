import { IconButton, Menu, MenuItem } from '@mui/material';
import * as cookie from 'cookie';
import React from 'react';
import { API_BASE_URL } from '../EnvironmentVariables';
import { User } from '../utils/Types';
import ProfilePicture from './ProfilePicture';

export default function ProfilePictureMenu({
  user,
  setLoggedIn,
}: {
  user: User;
  setLoggedIn: (newLoggedIn: boolean) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
    })
      .then(() => {
        const cookies = cookie.parse(document.cookie);
        setLoggedIn('tirauth' in cookies);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <IconButton onClick={handleMenu}>
        <ProfilePicture user={user} />
      </IconButton>
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
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </>
  );
}
