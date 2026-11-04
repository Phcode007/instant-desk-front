import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, alterarPerfilUsuario, AUTH_FORBIDDEN_EVENT, AUTH_UNAUTHORIZED_EVENT } from './Service';
import { useAuthStore } from '../store/useAuthStore';
import type User from '../models/User';

const originalAdapter = api.defaults.adapter;

function adapterWithStatus(status: number) {
  const adapter: AxiosAdapter = async (config) => {
    const response: AxiosResponse = {
      data: { message: 'forbidden' },
      status,
      statusText: 'error',
      headers: new AxiosHeaders(),
      config,
    };
    throw new AxiosError('request failed', 'ERR_BAD_REQUEST', config, undefined, response);
  };
  return adapter;
}

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  useAuthStore.setState({ usuario: null });
});

describe('API authorization handling', () => {
  it('clears session and notifies the app on HTTP 401', async () => {
    useAuthStore.setState({
      usuario: { id: 4, nome: 'User', usuario: 'user@example.com', token: 'Bearer old', role: 'USER' },
    });
    const unauthorized = vi.fn();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, unauthorized);
    api.defaults.adapter = adapterWithStatus(401);

    await expect(api.get('/private')).rejects.toBeInstanceOf(AxiosError);

    expect(useAuthStore.getState().usuario).toBeNull();
    expect(unauthorized).toHaveBeenCalledOnce();
    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, unauthorized);
  });

  it('preserves session and notifies the app on HTTP 403', async () => {
    const session = { id: 4, nome: 'User', usuario: 'user@example.com', token: 'Bearer old', role: 'USER' as const };
    useAuthStore.setState({ usuario: session });
    const forbidden = vi.fn();
    window.addEventListener(AUTH_FORBIDDEN_EVENT, forbidden);
    api.defaults.adapter = adapterWithStatus(403);

    await expect(api.get('/admin')).rejects.toBeInstanceOf(AxiosError);

    expect(useAuthStore.getState().usuario).toEqual(session);
    expect(forbidden).toHaveBeenCalledOnce();
    window.removeEventListener(AUTH_FORBIDDEN_EVENT, forbidden);
  });

  it('sends the expected role body when changing a user profile', async () => {
    let requestBody: unknown;
    api.defaults.adapter = async (config) => {
      requestBody = JSON.parse(String(config.data)) as unknown;
      return {
        data: { id: 5, nome: 'User', usuario: 'user@example.com', role: 'SUPPORT' } satisfies User,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    };

    await alterarPerfilUsuario(5, 'SUPPORT');
    expect(requestBody).toEqual({ role: 'SUPPORT' });
  });
});
