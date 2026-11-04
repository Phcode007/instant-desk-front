import { describe, expect, it } from 'vitest';
import { getRoleHome, isUserRole } from './auth';

describe('authorization helpers', () => {
  it('recognizes only the supported roles', () => {
    expect(isUserRole('USER')).toBe(true);
    expect(isUserRole('SUPPORT')).toBe(true);
    expect(isUserRole('ADMIN')).toBe(true);
    expect(isUserRole(undefined)).toBe(false);
    expect(isUserRole('OWNER')).toBe(false);
  });

  it('redirects each role to an appropriate landing page', () => {
    expect(getRoleHome('USER')).toBe('/tickets');
    expect(getRoleHome('SUPPORT')).toBe('/tickets');
    expect(getRoleHome('ADMIN')).toBe('/dashboard');
  });
});
