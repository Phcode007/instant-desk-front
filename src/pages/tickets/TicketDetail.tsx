import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share,
  CalendarBlank,
  ArrowClockwise,
  Receipt,
  WarningCircle,
  FileText,
  ChatCircleDots,
  PaperPlaneRight,
  Clock,
  ChatCircle,
} from '@phosphor-icons/react';
import { buscar, enviar } from '../../services/Service';
import type Ticket from '../../models/Ticket';
import type Comment from '../../models/Comment';
import { useAuthStore } from '../../store/useAuthStore';
import AppNavbar from '../../components/navbar/AppNavbar';

interface ComentarioOtimista extends Comment {
  enviando?: boolean;
}

const statusEstilo: Record<string, string> = {
  aberto: 'bg-secondary-container text-on-secondary-fixed-variant',
  'em andamento': 'bg-amber-50 text-amber-900',
  resolvido: 'bg-emerald-50 text-emerald-800',
  fechado: 'bg-surface-container text-on-surface-variant',
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

function formatarDataCompleta(dataIso: string): string {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comentarios, setComentarios] = useState<ComentarioOtimista[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [novaMensagem, setNovaMensagem] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function carregar() {
      setIsLoading(true);
      try {
        await Promise.all([
          buscar<Ticket>(`/tickets/${id}`, setTicket),
          buscar<Comment[]>(`/comments/ticket/${id}`, setComentarios),
        ]);
      } catch {
        // ticket permanece null — a tela cobre esse caso com "Ticket não encontrado"
      }
      setIsLoading(false);
    }
    carregar();
  }, [id]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [comentarios]);

  async function enviarMensagem(e: FormEvent) {
    e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto || !usuario || !ticket) return;

    const idTemporario = Date.now();
    const otimista: ComentarioOtimista = {
      id: idTemporario,
      comentario: texto,
      data: new Date().toISOString(),
      ticket,
      user: { id: usuario.id, nome: usuario.nome, usuario: usuario.usuario, senha: '' },
      enviando: true,
    };

    setComentarios((atual) => [...atual, otimista]);
    setNovaMensagem('');

    try {
      await enviar<Comment>(
        '/comments',
        { comentario: texto, ticket: { id: ticket.id }, user: { id: usuario.id } },
        (comentarioSalvo) => {
          setComentarios((atual) =>
            atual.map((c) => (c.id === idTemporario ? comentarioSalvo : c)),
          );
        },
      );
    } catch {
      setComentarios((atual) => atual.filter((c) => c.id !== idTemporario));
      alert('Não foi possível enviar a mensagem. Tente novamente.');
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem(e as unknown as FormEvent);
    }
  }

  function compartilhar() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link do chamado copiado!');
  }

  if (isLoading) {
    return (
      <>
        <AppNavbar />
        <main className="w-full pt-header-height bg-background min-h-screen">
          <div className="w-full max-w-5xl mx-auto px-lg py-xl animate-pulse space-y-lg">
            <div className="h-8 w-64 bg-surface-container-low rounded" />
            <div className="h-40 bg-surface-container-lowest rounded-xl" />
            <div className="h-96 bg-surface-container-lowest rounded-xl" />
          </div>
        </main>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <AppNavbar />
        <main className="w-full pt-header-height bg-background min-h-screen flex items-center justify-center">
          <p className="text-on-surface-variant">Ticket não encontrado.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <main className="w-full pt-header-height bg-background min-h-screen">
        <div className="w-full max-w-5xl mx-auto px-lg py-xl flex flex-col gap-lg">

          <div className="flex items-center justify-between gap-md">
            <button
              onClick={() => navigate('/tickets')}
              className="group inline-flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
            >
              <span className="w-8 h-8 rounded-full bg-surface-container-low group-hover:bg-secondary-container flex items-center justify-center transition-colors">
                <ArrowLeft size={18} />
              </span>
              Voltar para Meus Tickets
            </button>
            <button
              onClick={compartilhar}
              className="inline-flex items-center gap-xs px-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors"
            >
              <Share size={18} />
              <span className="hidden md:inline">Compartilhar</span>
            </button>
          </div>

          <section className="bg-surface-container-lowest rounded-xl p-lg sm:p-xl shadow-sm flex flex-col gap-lg">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-md">
              <div className="flex flex-col gap-xs min-w-0">
                <div className="flex flex-wrap items-center gap-sm">
                  <span className="font-headline-sm text-headline-sm text-primary font-semibold">#{ticket.id}</span>
                  <span className="text-on-surface-variant/40">•</span>
                  <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">{ticket.titulo}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-y-xs gap-x-sm text-label-sm font-label-sm text-on-surface-variant">
                  <span>Solicitado por <strong className="text-on-surface font-medium">{ticket.user.nome}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-xs">
                    <CalendarBlank size={16} />
                    Criado em {formatarDataCompleta(ticket.criadoEm)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-xs text-primary font-medium">
                    <ArrowClockwise size={16} />
                    Atualizado {formatarTempoRelativo(ticket.data)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-sm shrink-0">
                <span className={`inline-flex items-center px-md py-1 rounded-full font-label-md text-label-md capitalize ${statusEstilo[ticket.status] ?? statusEstilo.fechado}`}>
                  {ticket.status}
                </span>
                <span className="inline-flex items-center gap-xs px-md py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
                  <Receipt size={16} />
                  {ticket.category.nome}
                </span>
                <span className="inline-flex items-center gap-xs px-md py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md">
                  <WarningCircle size={16} />
                  {ticket.priority.nome}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-sm">
              <div className="flex items-center gap-xs text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wide">
                <FileText size={18} />
                Descrição inicial relatada pelo usuário
              </div>
              <p className="text-on-surface font-body-md text-body-md leading-relaxed">{ticket.descricao}</p>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
            <header className="px-lg py-md bg-surface-container-low flex items-center gap-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <ChatCircleDots size={20} />
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Discussão do Chamado</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Comentários trocados sobre este chamado</p>
              </div>
            </header>

            <div ref={chatRef} className="bg-surface p-lg sm:p-xl flex flex-col gap-lg overflow-y-auto max-h-[560px] min-h-[300px]">
              {comentarios.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-xl">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-sm">
                    <ChatCircle size={24} />
                  </div>
                  <p className="text-on-surface-variant font-body-md text-body-md max-w-sm">
                    Nenhuma mensagem ainda. Inicie a conversa.
                  </p>
                </div>
              ) : (
                comentarios.map((comentario) => {
                  const ehMinha = comentario.user.id === usuario?.id;
                  const iniciais = comentario.user.nome
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={comentario.id}
                      className={`flex items-start gap-sm max-w-2xl ${ehMinha ? 'self-end justify-end' : 'self-start'} ${comentario.enviando ? 'opacity-70' : ''}`}
                    >
                      {!ehMinha && (
                        <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface font-headline-sm font-bold text-xs flex items-center justify-center shrink-0">
                          {iniciais}
                        </div>
                      )}
                      <div className={`flex flex-col gap-xs ${ehMinha ? 'items-end' : 'items-start'} min-w-0`}>
                        <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant px-1">
                          {!ehMinha && <span className="font-semibold text-on-surface">{comentario.user.nome}</span>}
                          {comentario.enviando ? (
                            <span className="flex items-center gap-xs text-primary">
                              <Clock size={14} className="animate-spin" />
                              Enviando...
                            </span>
                          ) : (
                            <span>{formatarTempoRelativo(comentario.data)}</span>
                          )}
                        </div>
                        <div
                          className={`font-body-md text-body-md rounded-2xl p-md leading-relaxed ${
                            ehMinha
                              ? 'bg-primary text-on-primary rounded-tr-sm'
                              : 'bg-surface-container-low text-on-surface rounded-tl-sm'
                          }`}
                        >
                          {comentario.comentario}
                        </div>
                      </div>
                      {ehMinha && (
                        <div className="w-9 h-9 rounded-full bg-primary text-on-primary font-headline-sm font-bold text-xs flex items-center justify-center shrink-0">
                          {iniciais}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <footer className="p-lg bg-surface-container-lowest border-t border-outline-variant">
              <form onSubmit={enviarMensagem} className="flex flex-col gap-sm">
                <textarea
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreva uma resposta para este chamado..."
                  rows={3}
                  className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-xl p-md resize-none focus:outline-none focus:bg-surface-container transition-all"
                />
                <div className="flex items-center justify-between gap-sm">
                  <span className="text-on-surface-variant text-label-sm font-label-sm">
                    Pressione <strong>Shift + Enter</strong> para quebra de linha
                  </span>
                  <button
                    type="submit"
                    disabled={novaMensagem.trim().length === 0}
                    className="inline-flex items-center gap-xs px-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-md hover:bg-primary-container disabled:opacity-45 disabled:cursor-not-allowed transition-all"
                  >
                    Enviar resposta
                    <PaperPlaneRight size={18} />
                  </button>
                </div>
              </form>
            </footer>
          </section>

        </div>
      </main>
    </>
  );
}

export default TicketDetail;