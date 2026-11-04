import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import UsersAdmin from './UsersAdmin';
import { useAuthStore } from '../../store/useAuthStore';
import * as Service from '../../services/Service';
import { ToastProvider } from '../../components/ui';

vi.mock('../../services/Service', () => ({
  listarUsuarios: vi.fn(),
  buscarUsuario: vi.fn(),
  alterarPerfilUsuario: vi.fn(),
  getApiErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock('../../components/ui/Modal', () => ({
  default: ({ open, title, children, footer }: {
    open: boolean;
    title: string;
    children: ReactNode;
    footer: ReactNode;
  }) => open ? <section role="dialog" aria-label={title}>{children}{footer}</section> : null,
}));

const rows = [
  { id: 10, nome: 'Admin atual', usuario: 'admin@example.com', role: 'ADMIN' as const },
  { id: 11, nome: 'Solicitante', usuario: 'user@example.com', role: 'USER' as const },
];

describe('UsersAdmin', () => {
  beforeEach(() => {
    vi.mocked(Service.listarUsuarios).mockResolvedValue(rows);
    vi.mocked(Service.buscarUsuario)
      .mockResolvedValueOnce(rows[1])
      .mockResolvedValueOnce({ ...rows[1], role: 'SUPPORT' });
    vi.mocked(Service.alterarPerfilUsuario)
      .mockResolvedValueOnce({ ...rows[1], role: 'SUPPORT' })
      .mockResolvedValueOnce(rows[1]);
    useAuthStore.setState({
      usuario: { id: 10, nome: 'Admin atual', usuario: 'admin@example.com', token: 'Bearer test', role: 'ADMIN' },
    });
  });

  it('loads users, excludes self-management and confirms role changes', async () => {
    render(
      <MemoryRouter>
        <ToastProvider><UsersAdmin /></ToastProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('row', { name: /Solicitante/ })).toBeInTheDocument();
    expect(screen.getByText('Seu usuário')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver e alterar perfil' }));

    await screen.findByRole('dialog');
    fireEvent.change(screen.getByLabelText('Perfil'), { target: { value: 'SUPPORT' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar alteração' }));

    await waitFor(() => expect(Service.alterarPerfilUsuario).toHaveBeenCalledWith(11, 'SUPPORT'));
    expect(await screen.findByText('Perfil atualizado')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver e alterar perfil' }));
    await screen.findByRole('dialog');
    fireEvent.change(screen.getByLabelText('Perfil'), { target: { value: 'USER' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar alteração' }));
    await waitFor(() => expect(Service.alterarPerfilUsuario).toHaveBeenLastCalledWith(11, 'USER'));
  });
});
