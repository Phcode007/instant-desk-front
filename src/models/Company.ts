import type  User  from './User';
import type  Category  from './Category';
import type  Priority  from './Priority';

export default interface Company {
  id: number;
  nome: string;
  cnpj?: string;
  user?: User[] | null;
  category?: Category[] | null;
  priority?: Priority[] | null;
}