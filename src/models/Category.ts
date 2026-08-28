import type Ticket from './Ticket';
import type Company from './Company';

export default interface Category {
  id: number;
  nome: string;
  ticket?: Ticket[] | null;
  company?: Company | null;
}