import type Ticket from './Ticket';
import type User from './User';
import type Attachment from './Attachment';

export default interface Comment {
  id: number;
  comentario: string;
  data: string;
  ticket: Ticket;
  user: User;
  attachment?: Attachment[] | null;
}