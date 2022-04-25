import { User } from './Types';

export const getDisplayRealName = (user: User) => {
  let displayRealName = '';

  if (user.first_name) {
    displayRealName += user.first_name;
    if (user.last_name) {
      displayRealName += ' ';
    }
  }

  if (user.last_name) {
    displayRealName += user.last_name;
  }

  return displayRealName;
};

export const getDisplayName = (user: User) => {
  let displayName = getDisplayRealName(user);

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
