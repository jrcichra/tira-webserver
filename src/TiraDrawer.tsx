import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import FeedIcon from '@mui/icons-material/Feed';

export default function TiraDrawer({ drawerWidth }: { drawerWidth: number }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FeedIcon />
          </ListItemIcon>
          <ListItemText primary='Categories' />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  )
}