import { User } from '../utils/Types';

export const retrieveCurrentUser = async (): Promise<User> => {
  const response = await fetch('/api/users/current');

  if (!response.ok) {
    throw 'Failed to retrieve current user';
  }

  return await response.json();
};

export const retrieveUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw `Failed to retrieve user #${userId}`;
  }

  return await response.json();
};

export const updateUser = async (
  userId: number,
  props?: {
    username?: string;
    password?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    archived?: boolean;
  }
) => {
  const requestBody = {
    username: props?.username,
    password: props?.password,
    email_address: props?.emailAddress,
    first_name: props?.firstName,
    last_name: props?.lastName,
    profile_picture_url: props?.profilePictureUrl,
    archived: props?.archived,
  };

  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw `Failed to update user #${userId}`;
  }
};
