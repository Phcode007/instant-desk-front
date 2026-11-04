import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PaperPlaneRight } from '@phosphor-icons/react';
import { buscar, enviar } from '../../services/Service';
import type Category from '../../models/Category';
import type Priority from '../../models/Priority';
import type Ticket from '../../models/Ticket';
import AppNavbar from '../../components/navbar/AppNavbar';
import { Button, Card, Input, LoadingState, Select, Textarea } from '../../components/ui';

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

          <Card className="sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
              <Input
                id="titulo"
                label="Título do chamado"
                labelAdornment={<span className="text-xs text-slate-500">{titulo.length}/100</span>}
                error={erros.titulo}
                type="text"
                maxLength={100}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={isSubmitting}
                placeholder="Ex: Erro ao exportar relatório mensal em PDF..."
                required
              />

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="categoria" className="text-xs font-semibold text-slate-700">
                    Categoria<span className="ml-1 text-red-600">*</span>
                  </label>
                  <span className="text-xs text-slate-500">Categorias da sua organização</span>
                </div>
                {carregandoListas ? (
                  <LoadingState label="Carregando categorias..." />
                ) : (
                  <Select
                    id="categoria"
                    aria-label="Categoria"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    disabled={isSubmitting}
                    error={erros.categoriaId}
                    required
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="prioridade" className="text-xs font-semibold text-slate-700">
                    Prioridade<span className="ml-1 text-red-600">*</span>
                  </label>
                  <span className="text-xs text-slate-500">Nível de criticidade</span>
                </div>
                {carregandoListas ? (
                  <LoadingState label="Carregando prioridades..." />
                ) : (
                  <Select
                    id="prioridade"
                    aria-label="Prioridade"
                    value={prioridadeId}
                    onChange={(e) => setPrioridadeId(e.target.value)}
                    disabled={isSubmitting}
                    error={erros.prioridadeId}
                    required
                  >
                    <option value="">Selecione a prioridade...</option>
                    {prioridades.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </Select>
                )}
              </div>

              <Textarea
                id="descricao"
                label="Descrição detalhada"
                labelAdornment={<span className="text-xs text-slate-500">{descricao.length}/2000</span>}
                hint="Explique os passos para reproduzir o erro, mensagens exibidas ou o que você precisa."
                error={erros.descricao}
                rows={6}
                maxLength={2000}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={isSubmitting}
                placeholder="Descreva detalhadamente o ocorrido..."
                required
              />

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
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    leadingIcon={<PaperPlaneRight size={18} aria-hidden="true" />}
                    className="flex-1 sm:flex-none"
                  >
                    {isSubmitting ? 'Criando chamado...' : 'Abrir Chamado'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}

export default NewTicket;