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