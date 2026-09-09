import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Plus,
  CaretLeft,
  CaretRight,
  Tray,
} from '@phosphor-icons/react';
import { buscar } from '../../services/Service';
import type PaginatedTickets from '../../models/PaginatedTickets';
import AppNavbar from '../../components/navbar/AppNavbar';

type StatusFiltro = 'todos' | 'aberto' | 'em andamento' | 'resolvido' | 'fechado';

const statusEstilo: Record<string, string> = {
  aberto: 'bg-secondary-container text-on-secondary-fixed-variant',
  'em andamento': 'bg-surface-container text-on-surface-variant',
  resolvido: 'bg-success-fixed text-on-success-fixed',
  fechado: 'bg-surface-container-low text-on-surface-variant',
};

function formatarTempoRelativo(dataIso: string): string {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  const dias = Math.floor(horas / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

function Tickets() {
  const navigate = useNavigate();

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

  useEffect(() => {
    async function carregarTickets() {
      setIsLoading(true);
      try {
        await buscar<PaginatedTickets>(`/tickets?page=${pagina}&limit=10`, setResposta);
      } catch {
        // Falha ao carregar — a lista simplesmente permanece vazia,
        // o estado "Nenhum ticket encontrado" cobre esse caso na tela.
      }
      setIsLoading(false);
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
                Meus Tickets
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Acompanhe e filtre os chamados de suporte da sua organização.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-lg py-3 rounded-xl shadow-md transition-all"
            >
              <Plus size={20} weight="bold" />
              Novo Ticket
            </button>
          </div>

          <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm space-y-md">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={20}
                className="absolute left-md top-1/2 -translate-y-1/2 text-outline pointer-events-none"
              />
              <input
                type="text"
                value={busca}
                onChange={handleBusca}
                placeholder="Buscar por título ou descrição do chamado..."
                className="w-full pl-11 pr-md py-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:shadow-[0_0_0_2px_#003178] transition-all"
              />
            </div>

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

          <div className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="w-full p-lg space-y-sm animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-16 bg-surface-container-low rounded-lg w-full" />
                ))}
              </div>
            ) : ticketsFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-xl md:py-24 space-y-md">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-outline">
                  <Tray size={40} />
                </div>
                <div className="space-y-xs max-w-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Nenhum ticket encontrado</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Não há chamados com os filtros selecionados.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      <th className="py-md px-lg font-semibold">Ticket &amp; Título</th>
                      <th className="py-md px-md font-semibold hidden md:table-cell">Categoria</th>
                      <th className="py-md px-md font-semibold">Prioridade</th>
                      <th className="py-md px-md font-semibold">Status</th>
                      <th className="py-md px-md font-semibold hidden lg:table-cell">Solicitante</th>
                      <th className="py-md px-md font-semibold hidden sm:table-cell">Atualização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketsFiltrados.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="hover:bg-primary/[0.03] transition-colors cursor-pointer border-t border-outline-variant/30"
                      >
                        <td className="py-md px-lg">
                          <div className="flex items-start gap-sm">
                            <span className="font-label-sm text-label-sm font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded shrink-0">
                              #{ticket.id}
                            </span>
                            <p className="font-label-md text-label-md text-on-surface line-clamp-1">{ticket.titulo}</p>
                          </div>
                        </td>
                        <td className="py-md px-md hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">
                            {ticket.category.nome}
                          </span>
                        </td>
                        <td className="py-md px-md">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                            {ticket.priority.nome}
                          </span>
                        </td>
                        <td className="py-md px-md">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold capitalize ${statusEstilo[ticket.status] ?? 'bg-surface-container text-on-surface-variant'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-md px-md hidden lg:table-cell font-body-sm text-body-sm text-on-surface">
                          {ticket.user.nome}
                        </td>
                        <td className="py-md px-md hidden sm:table-cell font-body-sm text-body-sm text-on-surface-variant">
                          {formatarTempoRelativo(ticket.data)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && resposta.totalPages > 1 && (
              <div className="flex items-center justify-between gap-md p-lg border-t border-outline-variant">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Página {resposta.page} de {resposta.totalPages} — {resposta.total} tickets
                </span>
                <div className="flex items-center gap-xs">
                  <button
                    type="button"
                    disabled={pagina <= 1}
                    onClick={() => setPagina((p) => p - 1)}
                    className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <CaretLeft size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={pagina >= resposta.totalPages}
                    onClick={() => setPagina((p) => p + 1)}
                    className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <CaretRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Tickets;