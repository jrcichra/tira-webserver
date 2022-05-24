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

export const fetchTickets = async (queryParam?: string[][]) => {
  const response = await fetch(
    `${API_BASE_URL}/tickets` + new URLSearchParams(queryParam)
  );

  if (!response.ok) {
    throw 'Failed to retrieve tickets';
  }

  const data: Ticket[] = await response.json();

  return data;
};
