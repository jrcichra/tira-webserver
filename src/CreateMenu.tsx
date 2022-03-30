import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

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
            <MenuItem>New Ticket</MenuItem>
            <MenuItem>New Category</MenuItem>
        </Menu>
    );
}