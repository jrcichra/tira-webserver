import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, IconButton } from "@mui/material";
import React from 'react';
import ProfilePictureMenu from './ProfilePictureMenu';
import { User } from './utils/Types';

export default function ProfilePicture({user}: {user: User}) {
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
                <Avatar></Avatar>
            </IconButton>
            <ProfilePictureMenu anchorEl={anchorEl} handleClose={handleClose} />
        </>
    )
}