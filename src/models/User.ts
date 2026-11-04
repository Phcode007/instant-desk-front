import type Ticket from './Ticket';
import type Comment from './Comment';
import type Company from './Company';
import type { UserRole } from './UserRole';

export default interface User {
  id: number;
  nome: string;
  usuario: string;
  senha?: string;
  role: UserRole;
  ticket?: Ticket[] | null;
  comment?: Comment[] | null;
  company?: Company | null;
}