import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewTicket from './NewTicket';
import * as Service from '../../services/Service';

const apiMocks = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('../../services/Service', () => ({
  api: apiMocks,
  enviar: vi.fn(),
  getApiErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

const categories = [{ id: 11, nome: 'Acesso' }];
const priorities = [{ id: 22, nome: 'Alta' }];

function renderForm() {
  return render(
    <MemoryRouter>
      <NewTicket />
    </MemoryRouter>,
  );
}

function mockCatalogs() {
  apiMocks.get.mockImplementation(async (url: string) => ({
    data: url === '/category' ? categories : priorities,
  }));
}

function fillTicketFields() {
  fireEvent.change(screen.getByLabelText(/Título do chamado/), {
    target: { value: 'Não consigo acessar' },
  });
  fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: '11' } });
  fireEvent.change(screen.getByLabelText('Prioridade'), { target: { value: '22' } });
  fireEvent.change(screen.getByLabelText(/Descrição detalhada/), {
    target: { value: 'O acesso ao sistema falha desde hoje.' },
  });
}

describe('NewTicket catalog states', () => {
  beforeEach(() => {
    apiMocks.get.mockReset();
    vi.mocked(Service.enviar).mockReset();
    mockCatalogs();
  });

  it('loads categories and priorities from their existing endpoints', async () => {
    renderForm();

    expect(await screen.findByRole('option', { name: 'Acesso' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alta' })).toBeInTheDocument();
    expect(apiMocks.get).toHaveBeenCalledWith('/category');
    expect(apiMocks.get).toHaveBeenCalledWith('/priorities');
  });

  it('shows loading indicators and blocks submission until both lists load', async () => {
    let resolveCategory: ((data: typeof categories) => void) | undefined;
    let resolvePriority: ((data: typeof priorities) => void) | undefined;
    apiMocks.get.mockImplementation((url: string) => new Promise((resolve) => {
      if (url === '/category') resolveCategory = (data) => resolve({ data });
      if (url === '/priorities') resolvePriority = (data) => resolve({ data });
    }));

    renderForm();

    expect(screen.getByText('Carregando categorias...')).toBeInTheDocument();
    expect(screen.getByText('Carregando prioridades...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Chamado' })).toBeDisabled();
    fireEvent.submit(screen.getByRole('button', { name: 'Abrir Chamado' }).closest('form')!);
    expect(Service.enviar).not.toHaveBeenCalled();

    resolveCategory?.(categories);
    resolvePriority?.(priorities);
    expect(await screen.findByRole('option', { name: 'Acesso' })).toBeInTheDocument();
  });

  it('shows a clear message when categories are empty', async () => {
    apiMocks.get.mockImplementation(async (url: string) => ({
      data: url === '/category' ? [] : priorities,
    }));
    renderForm();

    expect(await screen.findByText(/Não há categorias cadastradas/)).toBeInTheDocument();
    expect(screen.queryByLabelText('Categoria')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Chamado' })).toBeDisabled();
  });

  it('shows a clear message when priorities are empty', async () => {
    apiMocks.get.mockImplementation(async (url: string) => ({
      data: url === '/priorities' ? [] : categories,
    }));
    renderForm();

    expect(await screen.findByText(/Não há prioridades cadastradas/)).toBeInTheDocument();
    expect(screen.queryByLabelText('Prioridade')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Chamado' })).toBeDisabled();
  });

  it.each([
    [401, 'Sua sessão expirou'],
    [403, 'Você não tem permissão'],
    [404, 'não foi encontrado'],
    [500, 'O servidor encontrou um erro'],
  ])('explains HTTP %s when categories cannot be loaded', async (status, message) => {
    apiMocks.get.mockImplementation(async (url: string) => {
      if (url === '/category') throw { response: { status } };
      return { data: priorities };
    });
    renderForm();

    expect(await screen.findByText(new RegExp(message, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar carregar categorias novamente' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alta' })).toBeInTheDocument();
  });

  it('explains connection failures and offers retry', async () => {
    apiMocks.get.mockImplementation(async (url: string) => {
      if (url === '/priorities') throw new Error('Network Error');
      return { data: categories };
    });
    renderForm();

    expect(await screen.findByText(/Falha de conexão ao carregar as prioridades/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar carregar prioridades novamente' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Acesso' })).toBeInTheDocument();
  });

  it('retries a failed list without clearing the other entered fields', async () => {
    let categoryAttempts = 0;
    apiMocks.get.mockImplementation(async (url: string) => {
      if (url === '/category') {
        categoryAttempts += 1;
        if (categoryAttempts === 1) throw { response: { status: 500 } };
        return { data: categories };
      } else {
        return { data: priorities };
      }
    });
    renderForm();

    await screen.findByRole('option', { name: 'Alta' });
    fireEvent.change(screen.getByLabelText(/Título do chamado/), {
      target: { value: 'Não consigo acessar' },
    });
    fireEvent.change(screen.getByLabelText('Prioridade'), { target: { value: '22' } });
    fireEvent.change(screen.getByLabelText(/Descrição detalhada/), {
      target: { value: 'O acesso ao sistema falha desde hoje.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tentar carregar categorias novamente' }));

    expect(await screen.findByRole('option', { name: 'Acesso' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Título do chamado/)).toHaveValue('Não consigo acessar');
    expect(screen.getByLabelText('Prioridade')).toHaveValue('22');
    expect(screen.getByLabelText(/Descrição detalhada/)).toHaveValue('O acesso ao sistema falha desde hoje.');
    expect(categoryAttempts).toBe(2);
  });

  it.each(['/category', '/priorities'])('blocks submission when %s is unavailable', async (failedEndpoint) => {
    apiMocks.get.mockImplementation(async (url: string) => ({
      data: url === failedEndpoint ? [] : url === '/category' ? categories : priorities,
    }));
    renderForm();

    await screen.findByRole('status');
    expect(screen.getByRole('button', { name: 'Abrir Chamado' })).toBeDisabled();
    fireEvent.submit(screen.getByRole('button', { name: 'Abrir Chamado' }).closest('form')!);
    expect(Service.enviar).not.toHaveBeenCalled();
  });

  it('submits the real selected category and priority IDs', async () => {
    vi.mocked(Service.enviar).mockImplementation(async (_url, _body, setData) => {
      setData({ id: 99 } as never);
    });
    renderForm();

    await screen.findByRole('option', { name: 'Acesso' });
    fillTicketFields();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Chamado' }));

    await waitFor(() => {
      expect(Service.enviar).toHaveBeenCalledWith(
        '/tickets',
        {
          titulo: 'Não consigo acessar',
          descricao: 'O acesso ao sistema falha desde hoje.',
          category: { id: 11 },
          priority: { id: 22 },
        },
        expect.any(Function),
      );
    });
  });

  it('does not submit category or priority IDs absent from the loaded lists', async () => {
    renderForm();

    await screen.findByRole('option', { name: 'Acesso' });
    fillTicketFields();
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: '999' } });
    fireEvent.change(screen.getByLabelText('Prioridade'), { target: { value: '888' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Abrir Chamado' }).closest('form')!);

    expect(await screen.findByText('Selecione uma categoria para direcionar o atendimento.')).toBeInTheDocument();
    expect(screen.getByText('A seleção de prioridade é obrigatória.')).toBeInTheDocument();
    expect(Service.enviar).not.toHaveBeenCalled();
  });
});