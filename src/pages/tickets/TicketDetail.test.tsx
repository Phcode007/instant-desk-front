import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TicketDetail from './TicketDetail';
import { useAuthStore } from '../../store/useAuthStore';
import * as Service from '../../services/Service';
import { ToastProvider } from '../../components/ui';
import type Ticket from '../../models/Ticket';

vi.mock('../../services/Service', () => ({
  buscar: vi.fn(),
  enviar: vi.fn(),
  atualizar: vi.fn(),
  getApiErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

const priority = { id: 2, nome: 'Alta' };
const ticket: Ticket = {
  id: 1,
  criadoEm: '2026-01-01T10:00:00.000Z',
  data: '2026-01-01T10:00:00.000Z',
  titulo: 'Falha ao acessar o sistema',
  descricao: 'O acesso ao sistema está indisponível para o usuário.',
  status: 'aberto',
  category: { id: 3, nome: 'Acesso' },
  priority,
  user: { id: 20, nome: 'Solicitante', usuario: 'user@example.com', role: 'USER' },
};

function renderDetail(role: 'USER' | 'SUPPORT') {
  useAuthStore.setState({
    usuario: { id: 20, nome: 'Solicitante', usuario: 'user@example.com', token: 'Bearer test', role },
  });
  return render(
    <MemoryRouter initialEntries={['/tickets/1']}>
      <ToastProvider>
        <Routes>
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('TicketDetail role controls', () => {
  beforeEach(() => {
    vi.mocked(Service.buscar).mockImplementation(async (url, setData) => {
      if (url === '/tickets/1') setData(ticket);
      if (url === '/comments/ticket/1') setData([]);
      if (url === '/priorities') setData([priority]);
    });
    vi.mocked(Service.atualizar).mockImplementation(async (_url, _body, setData) => setData(ticket));
  });

  it('lets SUPPORT update status and priority', async () => {
    renderDetail('SUPPORT');
    await screen.findByRole('heading', { name: 'Falha ao acessar o sistema' });

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'resolvido' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar atendimento' }));

    await waitFor(() => {
      expect(Service.atualizar).toHaveBeenCalledWith(
        '/tickets',
        { id: 1, status: 'resolvido', priority: { id: 2 } },
        expect.any(Function),
      );
    });
  });

  it('does not expose ticket administration controls to USER', async () => {
    renderDetail('USER');
    await screen.findByRole('heading', { name: 'Falha ao acessar o sistema' });

    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Prioridade')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar atendimento' })).not.toBeInTheDocument();
  });
});
