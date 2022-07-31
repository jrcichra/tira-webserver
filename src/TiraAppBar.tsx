import { Button, IconButton, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import CreateMenu from './CreateMenu';
import React, { useState } from 'react';
import { drawerWidth } from './Base';
import { Link } from 'react-router-dom';
import { User } from './utils/Types';
import ClickableProfilePicture from './components/ClickableProfilePicture';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function TiraAppBar({
  user,
  drawerOpen,
  toggleDrawer,
  loggedIn,
  setLoggedIn,
  setLoginModalOpen,
}: {
  user?: User;
  drawerOpen: boolean;
  toggleDrawer: () => void;
  loggedIn: boolean;
  setLoggedIn: (newLoggedIn: boolean) => void;
  setLoginModalOpen: (loginModalOpen: boolean) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickLoginButton = () => {
    setLoginModalOpen(true);
  };

  let rightSection;

  if (loggedIn) {
    rightSection = (
      <>
        <Button
          variant='contained'
          color='secondary'
          startIcon={<AddIcon />}
          onClick={handleMenu}
          sx={{
            mr: 2,
            alignItems: 'flex-start',
          }}
        >
          Create
        </Button>
        {user && (
          <ClickableProfilePicture user={user} setLoggedIn={setLoggedIn} />
        )}
        <CreateMenu anchorEl={anchorEl} handleClose={handleClose} />
      </>
    );
  } else {
    rightSection = (
      <Button
        onClick={handleOnClickLoginButton}
        variant='contained'
        color='secondary'
        sx={{
          mr: 2,
          alignItems: 'flex-start',
        }}
      >
        Login
      </Button>
    );
  }

  return (
    <AppBar position='absolute' open={drawerOpen}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(drawerOpen && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component='h1'
          variant='h6'
          color='inherit'
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Tira
        </Typography>
        {rightSection}
      </Toolbar>
    </AppBar>
  );
}
