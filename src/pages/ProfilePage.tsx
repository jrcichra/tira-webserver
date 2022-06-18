import { Box, Button, Paper, TextField } from '@mui/material';
import React from 'react';
import Heading from '../components/Heading';
import { fetchCurrentUser, updateUser } from '../utils/RestUtil';
import { User } from '../utils/Types';
import { uploadImage } from '../utils/UploadFilesUtils';

export default function ProfilePage({
  user,
  setCurrentUser,
}: {
  user?: User;
  setCurrentUser: (newCurrentUser: User) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);

  const [username, setUsername] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');

  const handleEditProfileInformation = async () => {
    if (user) {
      if (!editMode) {
        setEditMode(true);

        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmailAddress(user.email_address);
      } else {
        await updateUser(user.id, {
          username: username,
          firstName: firstName,
          lastName: lastName,
          emailAddress: emailAddress,
        });

        const currentUser = await fetchCurrentUser();
        setCurrentUser(currentUser);

        setEditMode(false);
      }
    }
  };

  const handleUploadProfilePictureClick = async () => {
    if (user) {
      await uploadImage(async (uploadedImageUrl: string) => {
        const patchUserBody = {
          profilePictureURL: uploadedImageUrl,
        };

        await updateUser(user.id, patchUserBody);

        const currentUser = await fetchCurrentUser();
        setCurrentUser(currentUser);
      });
    }
  };

  if (!user) {
    return (
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Heading gutterBottom>Profile Information</Heading>
        <Box>Could not find information for current user.</Box>
      </Paper>
    );
  }

  let usernameElement = <Box>Username: {user.username}</Box>;
  let firstNameElement = <Box>First Name: {user.first_name}</Box>;
  let lastNameElement = <Box>Last Name: {user.last_name}</Box>;
  let emailAddressElement = <Box>Email Address: {user.email_address}</Box>;

  let buttonText = 'Edit Profile Information';

  if (editMode) {
    usernameElement = (
      <TextField
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin='normal'
        id='outlined-basic'
        label='Username'
        variant='outlined'
      />
    );

    firstNameElement = (
      <TextField
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        margin='normal'
        id='outlined-basic'
        label='First Name'
        variant='outlined'
      />
    );

    lastNameElement = (
      <TextField
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        margin='normal'
        id='outlined-basic'
        label='LastName'
        variant='outlined'
      />
    );

    emailAddressElement = (
      <TextField
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        margin='normal'
        id='outlined-basic'
        label='Email Address'
        variant='outlined'
      />
    );

    buttonText = 'Change Profile Information';
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Heading gutterBottom>Profile Information</Heading>
      {usernameElement}
      {firstNameElement}
      {lastNameElement}
      {emailAddressElement}
      <Button
        onClick={handleEditProfileInformation}
        variant='contained'
        color='primary'
        sx={{
          mt: 2,
        }}
      >
        {buttonText}
      </Button>
      <Button
        onClick={handleUploadProfilePictureClick}
        variant='contained'
        color='primary'
      >
        Upload Profile Picture
      </Button>
    </Paper>
  );
}
