import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from "@mui/material";
import React from 'react';
import ProfilePictureMenu from './ProfilePictureMenu';

export default function ProfilePicture() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                size='large'
                color='inherit'
                aria-label='account'
                onClick={handleMenu}
            >
                <AccountCircleIcon />
            </IconButton>
            <ProfilePictureMenu anchorEl={anchorEl} handleClose={handleClose} />
        </>
    )
}