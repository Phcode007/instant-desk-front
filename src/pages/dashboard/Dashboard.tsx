import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tray,
  ClockCountdown,
  Timer,
  CheckCircle,
  ArrowRight,
  Headset,
  Ticket as TicketIcon,
} from '@phosphor-icons/react';
import { buscar } from '../../services/Service';
import { useAuthStore } from '../../store/useAuthStore';
import type TicketStats from '../../models/TicketStats';
import type PaginatedTickets from '../../models/PaginatedTickets';
import AppNavbar from '../../components/navbar/AppNavbar';

const statusEstilo: Record<string, { texto: string; ponto: string; cor: string }> = {
  aberto: { texto: 'text-primary', ponto: 'bg-primary', cor: '#001d4e' },
  'em andamento': { texto: 'text-[#d97706]', ponto: 'bg-[#d97706]', cor: '#d97706' },
  resolvido: { texto: 'text-[#059669]', ponto: 'bg-[#059669]', cor: '#059669' },
  fechado: { texto: 'text-[#64748b]', ponto: 'bg-[#64748b]', cor: '#64748b' },
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

function Dashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<TicketStats>({
    abertosHoje: 0,
    emAndamento: 0,
    total: 0,
    porStatus: [],
  });
  const [recentes, setRecentes] = useState<PaginatedTickets>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    async function carregar() {
      setIsLoading(true);
      try {
        await Promise.all([
          buscar<TicketStats>('/tickets/stats', setStats),
          buscar<PaginatedTickets>('/tickets?page=1&limit=5', setRecentes),
        ]);
      } catch {
        // Mantém os valores zerados/vazios — o estado visual de "sem dados"
        // já cobre tanto "empresa nova sem tickets" quanto "falha ao buscar".
      }
      setIsLoading(false);
    }
    carregar();
  }, []);

  const primeiroNome = usuario?.nome?.split(' ')[0] ?? '';
  const semTickets = !isLoading && stats.total === 0;

  return (
    <>
      <AppNavbar />
      <main className="w-full pt-header-height bg-background min-h-screen">
        <div className="w-full px-lg py-xl max-w-7xl mx-auto flex flex-col gap-xl">

          <div className="flex flex-col gap-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Dashboard</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Bem-vindo de volta, {primeiroNome}. Acompanhe a visão geral dos chamados de suporte.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-surface-container-lowest rounded-xl p-lg h-36" />
              ))}
            </div>
          ) : semTickets ? (
            <div className="flex flex-col items-center justify-center py-xl px-lg bg-surface-container-lowest rounded-xl shadow-sm min-h-[300px] text-center">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-primary mb-md">
                <TicketIcon size={40} />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Nenhum chamado registrado ainda</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Assim que os primeiros tickets forem abertos, os indicadores aparecem aqui.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">Abertos hoje</span>
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                      <Tray size={20} />
                    </div>
                  </div>
                  <span className="font-headline-xl text-headline-xl text-on-surface mt-md">
                    {String(stats.abertosHoje).padStart(2, '0')}
                  </span>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">Em andamento</span>
                    <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-fixed-variant">
                      <ClockCountdown size={20} />
                    </div>
                  </div>
                  <span className="font-headline-xl text-headline-xl text-on-surface mt-md">
                    {String(stats.emAndamento).padStart(2, '0')}
                  </span>
                </div>

                <div className="bg-surface-container-lowest/90 rounded-xl p-lg shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">Tempo médio</span>
                    <div className="flex items-center gap-xs">
                      <span className="px-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase font-semibold">Em breve</span>
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <Timer size={20} />
                      </div>
                    </div>
                  </div>
                  <span className="font-headline-md text-headline-md text-on-surface-variant mt-md">Em breve</span>
                </div>

                <div className="bg-surface-container-lowest/90 rounded-xl p-lg shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">Taxa de resolução</span>
                    <div className="flex items-center gap-xs">
                      <span className="px-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase font-semibold">Em breve</span>
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                  </div>
                  <span className="font-headline-md text-headline-md text-on-surface-variant mt-md">Em breve</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-lg shadow-sm flex flex-col gap-md">
                  <div className="flex items-center justify-between pb-sm">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Tickets recentes</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Últimos chamados movimentados</p>
                    </div>
                    <button
                      onClick={() => navigate('/tickets')}
                      className="inline-flex items-center gap-xs font-label-md text-label-md text-primary font-semibold"
                    >
                      Ver todos
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-xs">
                    {recentes.data.map((ticket) => {
                      const estilo = statusEstilo[ticket.status] ?? statusEstilo.fechado;
                      return (
                        <div
                          key={ticket.id}
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="p-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-md cursor-pointer"
                        >
                          <div className="flex flex-col gap-xs min-w-0">
                            <div className="flex items-center gap-sm flex-wrap">
                              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                                #{ticket.id} - {ticket.titulo}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-label-sm font-label-sm font-semibold ${estilo.texto}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${estilo.ponto}`} />
                                {ticket.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-md text-on-surface-variant font-label-sm text-label-sm">
                              <span>{ticket.category.nome}</span>
                              <span>•</span>
                              <span>{formatarTempoRelativo(ticket.data)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-lg">
                  <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex flex-col gap-md">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Distribuição por status</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Proporção de tickets no workspace</p>
                    </div>

                    <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
                      {stats.porStatus.map((item) => (
                        <div
                          key={item.status}
                          style={{
                            width: `${(item.total / stats.total) * 100}%`,
                            backgroundColor: statusEstilo[item.status]?.cor ?? '#64748b',
                          }}
                          title={`${item.status}: ${item.total}`}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col gap-md mt-xs">
                      {stats.porStatus.map((item) => {
                        const estilo = statusEstilo[item.status] ?? statusEstilo.fechado;
                        const percentual = Math.round((item.total / stats.total) * 100);
                        return (
                          <div key={item.status} className="flex flex-col gap-xs">
                            <div className="flex items-center justify-between font-label-md text-label-md">
                              <span className="flex items-center gap-xs text-on-surface capitalize">
                                <span className={`w-2.5 h-2.5 rounded-full ${estilo.ponto}`} />
                                {item.status}
                              </span>
                              <span className="text-on-surface font-semibold">
                                {item.total} <span className="font-normal text-on-surface-variant">({percentual}%)</span>
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${percentual}%`, backgroundColor: estilo.cor }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-xs p-md rounded-xl bg-surface-container-low flex items-center justify-between gap-sm">
                      <div className="flex items-center gap-sm">
                        <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                          <Headset size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-medium">Precisa de assistência?</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Abra um novo chamado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;