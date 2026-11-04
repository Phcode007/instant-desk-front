export const UserRole = {
  USER: 'USER',
  SUPPORT: 'SUPPORT',
  ADMIN: 'ADMIN',
} as const;

export const USER_ROLES = [UserRole.USER, UserRole.SUPPORT, UserRole.ADMIN] as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
