import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

export default function CreateMenu({anchorEl, handleClose}: {anchorEl: null | HTMLElement, handleClose: () => void}) {
    return (
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={handleClose} component={Link} to='/tickets/new'>New Ticket</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to='/categories/new'>New Category</MenuItem>
        </Menu>
    );
}