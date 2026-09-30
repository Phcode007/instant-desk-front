import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CircleNotch, PaperPlaneRight, WarningCircle } from '@phosphor-icons/react';
import { buscar, enviar } from '../../services/Service';
import type Category from '../../models/Category';
import type Priority from '../../models/Priority';
import type Ticket from '../../models/Ticket';
import AppNavbar from '../../components/navbar/AppNavbar';

interface Erros {
  titulo?: string;
  categoriaId?: string;
  prioridadeId?: string;
  descricao?: string;
}

function NewTicket() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Category[]>([]);
  const [prioridades, setPrioridades] = useState<Priority[]>([]);
  const [carregandoListas, setCarregandoListas] = useState<boolean>(true);

  const [titulo, setTitulo] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [prioridadeId, setPrioridadeId] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');

  const [erros, setErros] = useState<Erros>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<Ticket | null>(null);

  useEffect(() => {
    async function carregarListas() {
      setCarregandoListas(true);
      try {
        await Promise.all([
          buscar<Category[]>('/category', setCategorias),
          buscar<Priority[]>('/priorities', setPrioridades),
        ]);
      } catch {
        // listas ficam vazias — os selects mostram "nenhuma opção" naturalmente
      }
      setCarregandoListas(false);
    }
    carregarListas();
  }, []);

  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => navigate(`/tickets/${sucesso.id}`), 2000);
      return () => clearTimeout(timer);
    }
  }, [sucesso, navigate]);

  function validar(): boolean {
    const novosErros: Erros = {};

    if (!titulo.trim()) novosErros.titulo = 'O título do chamado é obrigatório.';
    if (!categoriaId) novosErros.categoriaId = 'Selecione uma categoria para direcionar o atendimento.';
    if (!prioridadeId) novosErros.prioridadeId = 'A seleção de prioridade é obrigatória.';
    if (descricao.trim().length < 10) novosErros.descricao = 'A descrição deve conter no mínimo 10 caracteres.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setIsSubmitting(true);
    try {
      await enviar<Ticket>(
        '/tickets',
        {
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          category: { id: Number(categoriaId) },
          priority: { id: Number(prioridadeId) },
        },
        setSucesso,
      );
    } catch {
      alert('Não foi possível criar o chamado. Tente novamente.');
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <AppNavbar />
      <main className="w-full pt-header-height bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-lg py-xl">

          <Link
            to="/tickets"
            className="inline-flex items-center gap-xs text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors mb-lg"
          >
            <ArrowLeft size={16} />
            Voltar para Meus Tickets
          </Link>

          <div className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Abrir novo chamado</h1>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              Descreva o problema com o máximo de detalhes possível para agilizar o atendimento.
            </p>
          </div>

          {sucesso && (
            <div className="mb-lg bg-emerald-50 border border-emerald-600/30 rounded-xl p-md flex items-center gap-sm">
              <CheckCircle size={24} weight="fill" className="text-emerald-700 shrink-0" />
              <div>
                <p className="font-label-md text-label-md text-emerald-800 font-semibold">
                  Chamado #{sucesso.id} criado com sucesso!
                </p>
                <p className="font-body-sm text-body-sm text-emerald-700">Redirecionando para o chamado...</p>
              </div>
            </div>
          )}

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-lg sm:p-xl shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg">

              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="titulo" className="font-label-md text-label-md text-on-surface font-semibold">
                    Título do chamado <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{titulo.length}/100</span>
                </div>
                <input
                  id="titulo"
                  type="text"
                  maxLength={100}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Ex: Erro ao exportar relatório mensal em PDF..."
                  className={`w-full px-md py-2.5 bg-surface border rounded-lg text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50 ${
                    erros.titulo ? 'border-error bg-error-container/20' : 'border-outline-variant'
                  }`}
                />
                {erros.titulo && (
                  <span className="flex items-center gap-xs text-error font-label-sm text-label-sm">
                    <WarningCircle size={14} weight="fill" />
                    {erros.titulo}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="categoria" className="font-label-md text-label-md text-on-surface font-semibold">
                    Categoria <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Categorias da sua organização</span>
                </div>
                {carregandoListas ? (
                  <div className="h-10 bg-surface-container-low border border-outline-variant/50 rounded-lg flex items-center px-md gap-sm">
                    <CircleNotch size={16} className="animate-spin text-primary" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Carregando categorias...</span>
                  </div>
                ) : (
                  <select
                    id="categoria"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    disabled={isSubmitting}
                    className={`w-full px-md py-2.5 bg-surface border rounded-lg text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50 ${
                      erros.categoriaId ? 'border-error bg-error-container/20' : 'border-outline-variant'
                    }`}
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                )}
                {erros.categoriaId && (
                  <span className="flex items-center gap-xs text-error font-label-sm text-label-sm">
                    <WarningCircle size={14} weight="fill" />
                    {erros.categoriaId}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="prioridade" className="font-label-md text-label-md text-on-surface font-semibold">
                    Prioridade <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Nível de criticidade</span>
                </div>
                {carregandoListas ? (
                  <div className="h-10 bg-surface-container-low border border-outline-variant/50 rounded-lg flex items-center px-md gap-sm">
                    <CircleNotch size={16} className="animate-spin text-primary" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Carregando prioridades...</span>
                  </div>
                ) : (
                  <select
                    id="prioridade"
                    value={prioridadeId}
                    onChange={(e) => setPrioridadeId(e.target.value)}
                    disabled={isSubmitting}
                    className={`w-full px-md py-2.5 bg-surface border rounded-lg text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50 ${
                      erros.prioridadeId ? 'border-error bg-error-container/20' : 'border-outline-variant'
                    }`}
                  >
                    <option value="">Selecione a prioridade...</option>
                    {prioridades.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                )}
                {erros.prioridadeId && (
                  <span className="flex items-center gap-xs text-error font-label-sm text-label-sm">
                    <WarningCircle size={14} weight="fill" />
                    {erros.prioridadeId}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="descricao" className="font-label-md text-label-md text-on-surface font-semibold">
                    Descrição detalhada <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{descricao.length}/2000</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Explique os passos para reproduzir o erro, mensagens exibidas ou o que você precisa.
                </p>
                <textarea
                  id="descricao"
                  rows={6}
                  maxLength={2000}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Descreva detalhadamente o ocorrido..."
                  className={`w-full px-md py-2.5 bg-surface border rounded-lg text-body-sm font-body-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50 ${
                    erros.descricao ? 'border-error bg-error-container/20' : 'border-outline-variant'
                  }`}
                />
                {erros.descricao && (
                  <span className="flex items-center gap-xs text-error font-label-sm text-label-sm">
                    <WarningCircle size={14} weight="fill" />
                    {erros.descricao}
                  </span>
                )}
              </div>

              <div className="pt-md border-t border-outline-variant/50 flex flex-col sm:flex-row items-center justify-between gap-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant order-2 sm:order-1">
                  Campos marcados com <span className="text-error font-semibold">*</span> são obrigatórios.
                </span>
                <div className="flex items-center gap-sm order-1 sm:order-2 w-full sm:w-auto">
                  <Link
                    to="/tickets"
                    className="flex-1 sm:flex-none text-center px-lg py-2.5 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-xs px-lg py-2.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-sm transition disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotch size={18} className="animate-spin" />
                        Criando chamado...
                      </>
                    ) : (
                      <>
                        Abrir Chamado
                        <PaperPlaneRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default NewTicket;