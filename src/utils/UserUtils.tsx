import { User } from './Types';

export const getDisplayName = (user: User) => {
  let displayName = '';

  if (user.first_name) {
    displayName += user.first_name;
    if (user.last_name) {
      displayName += ' ';
    }
  }

  if (user.last_name) {
    displayName += user.last_name;
  }

  if (!displayName) {
    displayName += user.username;
  }

  return displayName;
};

export const getDisplayInitials = (user: User) => {
  let displayInitials = '';

  if (user.first_name) {
    displayInitials += user.first_name.charAt(0).toUpperCase();
  }

  if (user.last_name) {
    displayInitials += user.last_name.charAt(0).toUpperCase();
  }

  if (!displayInitials) {
    displayInitials += user.username.substring(0, 2).toUpperCase();
  }

  return displayInitials;
};
