import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import CatalogSettings from './CatalogSettings';
import { ToastProvider } from '../../components/ui';
import { useAuthStore } from '../../store/useAuthStore';

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../services/Service', () => ({
  api: apiMocks,
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

describe('CatalogSettings', () => {
  beforeEach(() => {
    apiMocks.get.mockImplementation((url: string) => Promise.resolve({
      data: url === '/category'
        ? [{ id: 1, nome: 'Acesso' }]
        : [{ id: 2, nome: 'Alta' }],
    }));
    apiMocks.post.mockResolvedValue({ data: { id: 3, nome: 'Nova' } });
    apiMocks.put.mockResolvedValue({ data: { id: 1, nome: 'Acesso técnico' } });
    apiMocks.delete.mockResolvedValue({ data: undefined });
    useAuthStore.setState({
      usuario: { id: 9, nome: 'Admin', usuario: 'admin@example.com', token: 'Bearer test', role: 'ADMIN' },
    });
  });

  it('uses the existing tenant-scoped endpoints for catalog CRUD', async () => {
    render(
      <MemoryRouter>
        <ToastProvider><CatalogSettings /></ToastProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Acesso')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Nome da nova categoria'), {
      target: { value: 'Nova' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar categoria' }));
    await waitFor(() => expect(apiMocks.post).toHaveBeenCalledWith('/category', { nome: 'Nova' }));

    fireEvent.click(screen.getByRole('button', { name: 'Editar categoria Acesso' }));
    await screen.findByRole('dialog');
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Acesso técnico' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    await waitFor(() => {
      expect(apiMocks.put).toHaveBeenCalledWith('/category', { id: 1, nome: 'Acesso técnico' });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Excluir prioridade Alta' }));
    await screen.findByRole('dialog');
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    await waitFor(() => expect(apiMocks.delete).toHaveBeenCalledWith('/priorities/2'));
  });
});
