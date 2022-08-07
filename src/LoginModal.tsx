import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import * as cookie from 'cookie';
import PasswordTextField from './PasswordTextField';
import SHA256 from 'crypto-js/sha256';
import { performLogin } from './services/SessionService';

const loginModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function LoginModal({
  setLoggedIn,
  loginModalOpen,
  setLoginModalOpen,
}: {
  setLoggedIn: (newLoggedIn: boolean) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (loginModalOpen: boolean) => void;
}) {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loginFailure, setLoginFailure] = useState(false);

  const clearFields = () => {
    setUsername('');
    setUsernameError(false);
    setPassword('');
    setPasswordError(false);
    setRememberMe(false);
    setLoginFailure(false);
  };

  const handleOnCloseLoginModal = () => {
    setLoginModalOpen(false);
    clearFields();
  };

  const handleUsernameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newUsername = event.target.value;
    setUsernameError(!newUsername);
    setUsername(newUsername);
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newPassword = event.target.value;
    setPasswordError(!newPassword);
    setPassword(newPassword);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const verifyFields = () => {
    if (!username || !password) {
      setUsernameError(!username);
      setPasswordError(!password);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginFailure(false);

    if (!verifyFields()) {
      return;
    }

    try {
      await performLogin({
        username,
        password: SHA256(password).toString(),
        rememberMe,
      });

      const cookies = cookie.parse(document.cookie);

      setLoggedIn('tirauth' in cookies);
      setLoginModalOpen(false);

      clearFields();
    } catch (error) {
      console.error(error);
      setLoginFailure(true);
    }
  };

  return (
    <Modal
      open={loginModalOpen}
      onClose={handleOnCloseLoginModal}
      aria-labelledby='login-modal-title'
      aria-describedby='login-modal-description'
    >
      <Box sx={loginModalStyle}>
        <Typography id='login-modal-title' variant='h6' component='h2'>
          Login
        </Typography>
        <form id='login-modal-description' onSubmit={handleSubmit}>
          <Box sx={{ mt: 1 }}>
            <TextField
              value={username}
              onChange={handleUsernameChange}
              error={usernameError}
              helperText={usernameError ? 'Username is required' : ''}
              margin='normal'
              id='outlined-basic'
              label='Username'
              variant='outlined'
              fullWidth
            />
            <PasswordTextField
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
            />
          </Box>
          <FormGroup sx={{ alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onClick={handleRememberMeChange}
                />
              }
              label='Remember me'
            />
          </FormGroup>
          {loginFailure && <span>Login Failed</span>}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{
              mt: 2,
              alignItems: 'flex-start',
            }}
            fullWidth
          >
            Log in
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
