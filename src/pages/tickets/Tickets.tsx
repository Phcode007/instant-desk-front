import { useState, useEffect, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, Plus, Tray } from '@phosphor-icons/react';
import { buscar } from '../../services/Service';
import type PaginatedTickets from '../../models/PaginatedTickets';
import type Ticket from '../../models/Ticket';
import AppNavbar from '../../components/navbar/AppNavbar';
import { Badge, EmptyState, Input, LoadingState, Pagination, Table } from '../../components/ui';
import type { TableColumn } from '../../components/ui';
import { getTicketPriorityVariant, getTicketStatusVariant } from '../../utils/ticketPresentation';
import { useAuthStore } from '../../store/useAuthStore';
import { getApiErrorMessage } from '../../services/Service';
import { UserRole } from '../../models/UserRole';

type StatusFiltro = 'todos' | 'aberto' | 'em andamento' | 'resolvido' | 'fechado';

function formatarTempoRelativo(dataIso: string): string {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  const dias = Math.floor(horas / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

const colunasTickets: TableColumn<Ticket>[] = [
  {
    key: 'ticket',
    header: 'Ticket & Título',
    render: (ticket) => (
      <Link
        to={`/tickets/${ticket.id}`}
        aria-label={`Abrir chamado ${ticket.id}: ${ticket.titulo}`}
        className="flex items-start gap-2 hover:text-brand-700"
      >
        <span className="shrink-0 rounded bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-700">
          #{ticket.id}
        </span>
        <span className="line-clamp-1 font-medium text-slate-900">{ticket.titulo}</span>
      </Link>
    ),
  },
  {
    key: 'category',
    header: 'Categoria',
    className: 'hidden md:table-cell',
    render: (ticket) => <Badge variant="neutral">{ticket.category.nome}</Badge>,
  },
  {
    key: 'priority',
    header: 'Prioridade',
    render: (ticket) => <Badge variant={getTicketPriorityVariant(ticket.priority.nome)}>{ticket.priority.nome}</Badge>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (ticket) => <Badge variant={getTicketStatusVariant(ticket.status)} dot>{ticket.status}</Badge>,
  },
  {
    key: 'requester',
    header: 'Solicitante',
    className: 'hidden lg:table-cell',
    render: (ticket) => ticket.user.nome,
  },
  {
    key: 'updated',
    header: 'Atualização',
    className: 'hidden sm:table-cell',
    headerClassName: 'text-right',
    render: (ticket) => <span className="text-slate-500">{formatarTempoRelativo(ticket.data)}</span>,
  },
];

function Tickets() {
  const role = useAuthStore((state) => state.usuario?.role);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resposta, setResposta] = useState<PaginatedTickets>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [pagina, setPagina] = useState<number>(1);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('todos');
  const [busca, setBusca] = useState<string>('');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarTickets() {
      setIsLoading(true);
      setErro(null);
      try {
        await buscar<PaginatedTickets>(`/tickets?page=${pagina}&limit=10`, setResposta);
      } catch (error) {
        setErro(getApiErrorMessage(error, 'Não foi possível carregar os chamados.'));
      } finally {
        setIsLoading(false);
      }
    }
    carregarTickets();
  }, [pagina]);

  const ticketsFiltrados = resposta.data.filter((ticket) => {
    const bateStatus = statusFiltro === 'todos' || ticket.status === statusFiltro;
    const bateBusca =
      busca.trim() === '' ||
      ticket.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      ticket.descricao.toLowerCase().includes(busca.toLowerCase());
    return bateStatus && bateBusca;
  });

  function handleBusca(e: ChangeEvent<HTMLInputElement>) {
    setBusca(e.target.value);
  }

  return (
    <>
      <AppNavbar />
      <main className="w-full pt-header-height bg-background min-h-screen">
        <div className="w-full px-lg md:px-xl py-xl max-w-7xl mx-auto space-y-xl">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg">
            <div className="space-y-xs">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                {role === UserRole.USER ? 'Meus Tickets' : 'Fila de Tickets'}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                {role === UserRole.USER
                  ? 'Acompanhe e filtre os chamados de suporte da sua organização.'
                  : 'Consulte e acompanhe os chamados da sua empresa.'}
              </p>
            </div>
            <Link
  to="/tickets/novo"
  className="flex items-center gap-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-lg py-3 rounded-xl shadow-md transition-all"
>
  <Plus size={20} weight="bold" />
  Novo Ticket
</Link>
          </div>

          <div className="space-y-md rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <Input
              type="search"
              aria-label="Buscar por título ou descrição do chamado"
              value={busca}
              onChange={handleBusca}
              placeholder="Buscar por título ou descrição do chamado..."
              leadingIcon={<MagnifyingGlass size={18} aria-hidden="true" />}
            />

            <div className="flex items-center gap-xs overflow-x-auto pb-xs">
              {(['todos', 'aberto', 'em andamento', 'resolvido', 'fechado'] as StatusFiltro[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFiltro(status)}
                  className={`px-md py-2 rounded-full font-label-md text-label-md capitalize whitespace-nowrap transition-all ${
                    statusFiltro === status
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            {isLoading ? (
              <div className="space-y-5 p-6">
                <LoadingState variant="skeleton" label="Carregando chamados" lines={6} />
              </div>
            ) : erro ? (
              <div role="alert" className="p-6 text-sm text-red-700">{erro}</div>
            ) : (
              <Table
                caption="Chamados da organização"
                columns={colunasTickets}
                rows={ticketsFiltrados}
                rowKey={(ticket) => ticket.id}
                emptyState={
                  <EmptyState
                    icon={<Tray size={24} aria-hidden="true" />}
                    title="Nenhum ticket encontrado"
                    description="Não há chamados com os filtros selecionados."
                    className="border-0 bg-transparent py-10"
                  />
                }
              />
            )}

            {!isLoading && resposta.totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
                <span className="text-xs text-slate-500">
                  Página {resposta.page} de {resposta.totalPages} — {resposta.total} tickets
                </span>
                <Pagination
                  page={pagina}
                  totalPages={resposta.totalPages}
                  onPageChange={setPagina}
                  label="Páginas de chamados"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Tickets;