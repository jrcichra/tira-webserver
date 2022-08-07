import { SHA256 } from 'crypto-js';
import { User } from '../utils/Types';

export const performLogin = async (props: {
  username: string;
  password: string;
  rememberMe: boolean;
}) => {
  const requestBody = {
    username: props.username,
    password: SHA256(props.password).toString(),
    remember_me: props.rememberMe,
  };

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw 'Failed to log in';
  }
};

export const performLogout = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw 'Failed to log out';
  }
};
