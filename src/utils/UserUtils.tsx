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
