export interface Assignment {
    id: number,
    category_id?: number,
    subject: string,
    description: string,
    status: string,
    priority: string,
    created: string,
    reporter_id: number,
}

export interface Category {
    id: number,
    name: string,
    description: string,
    creator_id: number,
    created: string,
    archived: boolean,
}

export interface Comment {
    id: number,
    ticket_id: number,
    commenter_id: number,
    content: string,
    commented: string
}

export interface Ticket {
    id: number,
    category_id?: number,
    subject: string,
    description: string,
    status: string,
    priority: string,
    created: string,
    reporter_id: number,
}

export interface CreatedTicket {
    id: number
}

export interface ErrorMessage {
    message: string
}

export interface User {
    id: number,
    username: string,
    email_address: string,
    first_name: string,
    last_name: string,
    created: string,
    archived: boolean,
}