import type Ticket from './Ticket';
import type Comment from './Comment';
import type Company from './Company';

export default interface User {
  id: number;
  nome: string;
  usuario: string;
  senha: string;
  ticket?: Ticket[] | null;
  comment?: Comment[] | null;
  company?: Company | null;
}