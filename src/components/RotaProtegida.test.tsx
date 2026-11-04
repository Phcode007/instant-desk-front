import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import RotaProtegida from './RotaProtegida';
import { useAuthStore } from '../store/useAuthStore';

describe('RotaProtegida', () => {
  beforeEach(() => {
    useAuthStore.setState({ usuario: null });
  });

  it('sends an unauthenticated visitor to login', () => {
    render(
      <MemoryRouter initialEntries={['/tickets']}>
        <Routes>
          <Route path="/tickets" element={<RotaProtegida><p>Tickets</p></RotaProtegida>} />
          <Route path="/login" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('blocks USER from dashboard and redirects to their tickets', () => {
    useAuthStore.setState({
      usuario: { id: 1, nome: 'Solicitante', usuario: 'user@example.com', token: 'Bearer test', role: 'USER' },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<RotaProtegida roles={['ADMIN']}><p>Dashboard</p></RotaProtegida>} />
          <Route path="/tickets" element={<p>Tickets</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Tickets')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('rejects a persisted session without a valid role', () => {
    useAuthStore.setState({
      usuario: { id: 2, nome: 'Legacy', usuario: 'legacy@example.com', token: 'Bearer test', role: undefined as never },
    });

    render(
      <MemoryRouter initialEntries={['/tickets']}>
        <Routes>
          <Route path="/tickets" element={<RotaProtegida><p>Tickets</p></RotaProtegida>} />
          <Route path="/login" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
