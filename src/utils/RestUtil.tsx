import { API_BASE_URL } from '../EnvironmentVariables';
import { Ticket } from './Types';

export const fetchTicketById = async (
  ticketId: number,
  queryParam?: string[][]
) => {
  let response = await fetch(
    `${API_BASE_URL}/tickets/${ticketId}` + new URLSearchParams(queryParam)
  );

  if (!response.ok) {
    throw `Failed to retrieve tickets for ticket id ${ticketId}`;
  }

  let data: Ticket = await response.json();

  return data;
};

export const fetchTickets = async (queryParam?: string[][]) => {
  let response = await fetch(
    `${API_BASE_URL}/tickets` + new URLSearchParams(queryParam)
  );

  if (!response.ok) {
    throw 'Failed to retrieve tickets';
  }

  let data: Ticket[] = await response.json();

  return data;
};
