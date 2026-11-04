import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import AppNavbar from './AppNavbar';
import { useAuthStore } from '../../store/useAuthStore';

describe('AppNavbar', () => {
  beforeEach(() => {
    useAuthStore.setState({ usuario: null });
  });

  it('shows administrative links only to ADMIN', () => {
    useAuthStore.setState({
      usuario: { id: 1, nome: 'Suporte', usuario: 'support@example.com', token: 'Bearer test', role: 'SUPPORT' },
    });
    const { rerender } = render(<MemoryRouter><AppNavbar /></MemoryRouter>);

    expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Empresa' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Categorias e prioridades' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Fila de Tickets' }).length).toBeGreaterThan(0);

    useAuthStore.setState({
      usuario: { id: 2, nome: 'Admin', usuario: 'admin@example.com', token: 'Bearer test', role: 'ADMIN' },
    });
    rerender(<MemoryRouter><AppNavbar /></MemoryRouter>);
    expect(screen.getAllByRole('link', { name: 'Usuários' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Empresa' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Categorias e prioridades' }).length).toBeGreaterThan(0);
  });

  it('clears the authentication state on logout', () => {
    useAuthStore.setState({
      usuario: { id: 1, nome: 'Solicitante', usuario: 'user@example.com', token: 'Bearer test', role: 'USER' },
    });
    render(<MemoryRouter><AppNavbar /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(useAuthStore.getState().usuario).toBeNull();
  });
});
