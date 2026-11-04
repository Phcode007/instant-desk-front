import type { UserRole } from './UserRole';

export default interface UsuarioLogin {
  id: number;
  nome: string;
  usuario: string;
  token: string;
  role: UserRole;
}