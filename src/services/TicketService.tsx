import {
  Comment,
  CreatedTicket,
  ErrorMessage,
  Ticket,
  TicketAssignment,
} from '../utils/Types';

export const createTicket = async (props: {
  categoryId: number | null;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  assigneeIds: number[];
}) => {
  const requestBody = {
    category_id: props.categoryId,
    subject: props.subject,
    description: props.description,
    status: props.status,
    priority: props.priority,
    assignee_ids: props.assigneeIds,
  };

  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error.message;
  }

  const reponseBody: CreatedTicket = await response.json();
  return reponseBody.id;
};

export const createCommentInTicketByTicketId = async (
  ticketId: number,
  props: { content: string }
) => {
  const requestBody = {
    content: props.content,
  };

  const response = await fetch(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error.message;
  }

  const reponseBody: CreatedTicket = await response.json();
  return reponseBody.id;
};

export const retrieveAssignmentsByTicketId = async (
  ticketId: number
): Promise<TicketAssignment[]> => {
  const response = await fetch(`/api/tickets/${ticketId}/assignments`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw `Failed to retrieve assignments for ticket id ${ticketId}`;
  }

  return await response.json();
};

export const retrieveCommentsByTicketId = async (
  ticketId: number
): Promise<Comment[]> => {
  const response = await fetch(`/api/tickets/${ticketId}/comments`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw `Failed to retrieve comments for ticket id ${ticketId}`;
  }

  return await response.json();
};

export const retrieveTicketById = async (
  ticketId: number,
  queryParam?: string[][]
): Promise<Ticket> => {
  const response = await fetch(
    `/api/tickets/${ticketId}` + new URLSearchParams(queryParam),
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw `Failed to retrieve tickets for ticket id ${ticketId}`;
  }

  return await response.json();
};

export const retrieveTickets = async (props?: {
  reporter?: number;
  open?: boolean;
}): Promise<Ticket[]> => {
  const url = new URL(`/api/tickets`, window.location.href);

  if (props != undefined) {
    if (props.reporter != undefined) {
      url.searchParams.append('reporter', String(props.reporter));
    }

    if (props.open != undefined) {
      url.searchParams.append('open', String(props.open));
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw 'Failed to retrieve tickets';
  }

  return await response.json();
};

export const updateTicket = async (
  ticketId: number,
  props?: {
    categoryId?: number | null;
    subject?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeIds?: number[];
  }
) => {
  const requestBody = {
    category_id: props?.categoryId,
    subject: props?.subject,
    description: props?.description,
    status: props?.status,
    priority: props?.priority,
    assignee_ids: props?.assigneeIds,
  };

  const response = await fetch(`/api/tickets/${ticketId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw `Failed to update ticket #${ticketId}`;
  }
};
