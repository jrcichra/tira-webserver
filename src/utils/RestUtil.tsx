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

export const fetchTickets = async ({
  reporter,
  open,
}: {
  reporter?: number;
  open?: boolean;
}) => {
  const url = new URL(`${API_BASE_URL}/tickets`);

  if (reporter != undefined) {
    url.searchParams.append('reporter', String(reporter));
  }

  if (open != undefined) {
    url.searchParams.append('open', String(open));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw 'Failed to retrieve tickets';
  }

  const data: Ticket[] = await response.json();

  return data;
};
