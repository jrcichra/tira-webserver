import { API_BASE_URL } from '../EnvironmentVariables';
import { Ticket } from './Types';

export const fetchTicketById = async (
  ticketId: number,
  queryParam?: string[][]
) => {
  const response = await fetch(
    `${API_BASE_URL}/tickets/${ticketId}` + new URLSearchParams(queryParam)
  );

  if (!response.ok) {
    throw `Failed to retrieve tickets for ticket id ${ticketId}`;
  }

  const data: Ticket = await response.json();

  return data;
};

export const fetchTickets = async (props?: {
  reporter?: number;
  open?: boolean;
}) => {
  const url = new URL(`${API_BASE_URL}/tickets`);

  if (props != undefined) {
    if (props.reporter != undefined) {
      url.searchParams.append('reporter', String(props.reporter));
    }

    if (props.open != undefined) {
      url.searchParams.append('open', String(open));
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw 'Failed to retrieve tickets';
  }

  const data: Ticket[] = await response.json();

  return data;
};

export const updateUser = async (
  userId: number,
  props: {
    username?: string;
    password?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
    profilePictureURL?: string;
    archived?: boolean;
  }
) => {
  const url = `${API_BASE_URL}/users/${userId}`;

  const body = {
    username: props.username,
    password: props.password,
    email_address: props.emailAddress,
    first_name: props.firstName,
    last_name: props.lastName,
    profile_picture_url: props.profilePictureURL,
    archived: props.archived,
  };

  console.log(JSON.stringify(body));

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw 'Failed to update user';
  }
};
