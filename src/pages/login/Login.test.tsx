import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';
import { useAuthStore } from '../../store/useAuthStore';
import type UsuarioLogin from '../../models/UsuarioLogin';

vi.mock('../../services/Service', () => ({
  login: vi.fn(),
  getApiErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

import { login as loginService } from '../../services/Service';

const mockLogin = vi.mocked(loginService);

describe('Login', () => {
  beforeEach(() => {
    useAuthStore.setState({ usuario: null });
    mockLogin.mockReset();
  });

  it.each([
    ['USER', '/tickets'],
    ['SUPPORT', '/tickets'],
    ['ADMIN', '/dashboard'],
  ] as const)('stores role %s and navigates to %s', async (role, destination) => {
    const response: UsuarioLogin & { senha: string } = {
      id: 4,
      nome: 'Conta teste',
      usuario: 'test@example.com',
      token: 'Bearer test-token',
      role,
      senha: '',
    };
    mockLogin.mockImplementation(async (_url, _body, setData) => {
      setData(response);
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/tickets" element={<p>Tickets</p>} />
          <Route path="/dashboard" element={<p>Dashboard</p>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('E-mail corporativo'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(screen.getByText(destination === '/tickets' ? 'Tickets' : 'Dashboard')).toBeInTheDocument());
    expect(useAuthStore.getState().usuario?.role).toBe(role);
    expect(useAuthStore.getState().usuario).not.toHaveProperty('senha');
  });
});
