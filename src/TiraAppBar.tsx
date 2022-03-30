import { AppBar, Button, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import CreateMenu from './CreateMenu';
import { useState } from 'react';

export default function TiraAppBar({drawerWidth}: {drawerWidth: number}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Tira Dashboard
        </Typography>
        <Button
          variant="contained"
          color='secondary'
          startIcon={<AddIcon />}
          onClick={handleMenu}
          sx={{
            mr: 2,
            alignItems: 'flex-start'
          }}
        >
          Create
        </Button>
        <IconButton
          size='large'
          color='inherit'
          aria-label='account'
        >
          <AccountCircleIcon />
        </IconButton>
        <CreateMenu anchorEl={anchorEl} handleClose={handleClose} />
      </Toolbar>
    </AppBar>
  )
}