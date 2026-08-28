import type Category from './Category';
import type Priority from './Priority';
import type User from './User';
import type Comment from './Comment';

export default interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data: string;
  category: Category;
  priority: Priority;
  user: User;
  comment?: Comment[] | null;
}