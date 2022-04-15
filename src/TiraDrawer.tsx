import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import GroupIcon from '@mui/icons-material/Group';
import NoteIcon from '@mui/icons-material/Note';
import PublicIcon from '@mui/icons-material/Public';
import FeedIcon from '@mui/icons-material/Feed';
import { drawerWidth } from './Base';
import CategoriesList from './categories/CategoriesList';
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Category } from './utils/Types';

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function TiraDrawer({
  open,
  toggleDrawer,
  categories,
  setCategories,
}: {
  open: boolean;
  toggleDrawer: () => void;
  categories: Category[];
  setCategories: (category: Category[]) => void;
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  return (
    <Drawer variant='permanent' open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton component={Link} to='/dashboard'>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItemButton>
        <ListItemButton component={Link} to='/tickets'>
          <ListItemIcon>
            <NoteIcon />
          </ListItemIcon>
          <ListItemText primary='Tickets' />
        </ListItemButton>
        <ListItemButton onClick={toggleCategories}>
          <ListItemIcon>
            <FeedIcon />
          </ListItemIcon>
          <ListItemText primary='Categories' />
          {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <CategoriesList
          open={categoriesOpen}
          categories={categories}
          setCategories={setCategories}
        />
        <ListItemButton component={Link} to='/users'>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary='Users' />
        </ListItemButton>
      </List>
      <Divider />
    </Drawer>
  );
}
