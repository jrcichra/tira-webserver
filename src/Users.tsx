import { Button, Grid, Paper, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams, DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from './EnvironmentVariables';
import { UsersTable } from './tables/UsersTable';
import { User } from './utils/Types';
import { uploadImage } from './utils/UploadFilesUtils';

export default function Users({
  currentUser,
  setCurrentUser,
}: {
  currentUser: User | undefined;
  setCurrentUser: (newCurrentUser: User) => void;
}) {
  const [usersHasError, setUsersHasError] = React.useState<number | undefined>(
    1
  );

  const handleUploadProfilePictureClick = async () => {
    await uploadImage(async (uploadedImageUrl: String) => {
      const patchUser = {
        profile_picture_url: uploadedImageUrl,
      };

      let response = await fetch(`${API_BASE_URL}/users/${currentUser?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchUser),
      });

      if (response.ok) {
        let response2 = await fetch(`${API_BASE_URL}/users/${currentUser?.id}`);

        if (response2.ok) {
          response2.json().then((data: User) => setCurrentUser(data));
        }
      }
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 540,
          }}
        >
          <Typography component='h2' variant='h6' color='primary' gutterBottom>
            List of users
          </Typography>
          <UsersTable error={usersHasError} setError={setUsersHasError} />
        </Paper>
      </Grid>
      <Grid item lg={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Typography component='h2' variant='h6' color='primary' gutterBottom>
            User settings
          </Typography>
          {currentUser && (
            <Button
              onClick={handleUploadProfilePictureClick}
              variant='contained'
              color='primary'
            >
              Upload Profile Picture
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
