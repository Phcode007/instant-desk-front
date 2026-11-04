export const USER_ROLES = ['USER', 'SUPPORT', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];
