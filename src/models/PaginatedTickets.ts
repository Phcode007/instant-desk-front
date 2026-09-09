import type Ticket from './Ticket';

export default interface PaginatedTickets{
    data: Ticket[];
    total: number;
    page: number;
    totalPages: number;
}