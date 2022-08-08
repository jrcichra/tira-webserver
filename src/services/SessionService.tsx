export const performLogin = async (props: {
  username: string;
  password: string;
  rememberMe: boolean;
}) => {
  const requestBody = {
    username: props.username,
    password: props.password,
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
