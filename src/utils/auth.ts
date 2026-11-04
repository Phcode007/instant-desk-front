import { USER_ROLES, UserRole, type UserRole as UserRoleType } from '../models/UserRole';

export function isUserRole(value: unknown): value is UserRoleType {
  return USER_ROLES.some((role) => role === value);
}

export function getRoleHome(role: UserRoleType): string {
  return role === UserRole.ADMIN ? '/dashboard' : '/tickets';
}
