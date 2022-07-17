export interface Assignment {
  id: number;
  ticket_id: number;
  assignee_id: number;
  assigner_id: number;
  assigned: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  creator_id: number;
  created: string;
  archived: boolean;
}

export interface Comment {
  id: number;
  commenter: User;
  content: string;
  commented: string;
}

export interface Ticket {
  id: number;
  category?: Category;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created: string;
  reporter: User;
  assignees: User[];
}

export interface TicketAssignment {
  id: number;
  ticket_id: number;
  assignee_id: number;
  assigner_id: number;
  assigned: string;
}

export interface CreatedTicket {
  message: string;
  id: number;
}

export interface ErrorMessage {
  message: string;
}

export interface User {
  id: number;
  username: string;
  email_address: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  created: string;
  archived: boolean;
}
