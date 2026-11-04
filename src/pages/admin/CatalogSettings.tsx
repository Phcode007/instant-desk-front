import { useEffect, useState, type FormEvent } from 'react';
import type Category from '../../models/Category';
import type Priority from '../../models/Priority';
import { api, getApiErrorMessage } from '../../services/Service';
import AppNavbar from '../../components/navbar/AppNavbar';
import { Button, Modal, useToast } from '../../components/ui';

type CatalogType = 'category' | 'priority';
type DialogState = {
  type: CatalogType;
  item: Category | Priority;
  action: 'edit' | 'delete';
};

const endpoints: Record<CatalogType, string> = {
  category: '/category',
  priority: '/priorities',
};

const labels: Record<CatalogType, string> = {
  category: 'categoria',
  priority: 'prioridade',
};

function CatalogSettings() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [priorityName, setPriorityName] = useState('');
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [dialogName, setDialogName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get<Category[]>('/category'),
      api.get<Priority[]>('/priorities'),
    ])
      .then(([categoryResponse, priorityResponse]) => {
        if (!active) return;
        setCategories(categoryResponse.data);
        setPriorities(priorityResponse.data);
      })
      .catch((error: unknown) => {
        if (active) setErro(getApiErrorMessage(error, 'Não foi possível carregar as configurações.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function createItem(type: CatalogType, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = type === 'category' ? categoryName.trim() : priorityName.trim();
    if (!nome) return;

    setIsSaving(true);
    try {
      if (type === 'category') {
        const { data } = await api.post<Category>(endpoints[type], { nome });
        setCategories((items) => [...items, data]);
        setCategoryName('');
      } else {
        const { data } = await api.post<Priority>(endpoints[type], { nome });
        setPriorities((items) => [...items, data]);
        setPriorityName('');
      }
      showToast({
        title: `${labels[type][0].toUpperCase()}${labels[type].slice(1)} criada`,
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: `Não foi possível criar ${labels[type]}`,
        description: getApiErrorMessage(error, 'Tente novamente.'),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  function openDialog(type: CatalogType, item: Category | Priority, action: DialogState['action']) {
    setDialog({ type, item, action });
    setDialogName(item.nome);
  }

  async function confirmDialog() {
    if (!dialog) return;
    setIsSaving(true);
    try {
      if (dialog.action === 'edit') {
        if (dialog.type === 'category') {
          const { data } = await api.put<Category>(endpoints.category, {
            id: dialog.item.id,
            nome: dialogName.trim(),
          });
          setCategories((items) => items.map((item) => item.id === data.id ? data : item));
        } else {
          const { data } = await api.put<Priority>(endpoints.priority, {
            id: dialog.item.id,
            nome: dialogName.trim(),
          });
          setPriorities((items) => items.map((item) => item.id === data.id ? data : item));
        }
        showToast({ title: `${labels[dialog.type][0].toUpperCase()}${labels[dialog.type].slice(1)} atualizada`, variant: 'success' });
      } else {
        await api.delete(`${endpoints[dialog.type]}/${dialog.item.id}`);
        if (dialog.type === 'category') {
          setCategories((items) => items.filter((item) => item.id !== dialog.item.id));
        } else {
          setPriorities((items) => items.filter((item) => item.id !== dialog.item.id));
        }
        showToast({ title: `${labels[dialog.type][0].toUpperCase()}${labels[dialog.type].slice(1)} removida`, variant: 'success' });
      }
      setDialog(null);
    } catch (error) {
      showToast({
        title: `Não foi possível ${dialog.action === 'edit' ? 'alterar' : 'remover'} ${labels[dialog.type]}`,
        description: getApiErrorMessage(error, 'Tente novamente.'),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  function renderCatalog(type: CatalogType, items: (Category | Priority)[], name: string, setName: (value: string) => void) {
    return (
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">
          {type === 'category' ? 'Categorias' : 'Prioridades'}
        </h2>
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => void createItem(type, event)}>
          <label className="sr-only" htmlFor={`new-${type}`}>Nova {labels[type]}</label>
          <input
            id={`new-${type}`}
            required
            maxLength={type === 'category' ? 255 : 100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={`Nome da nova ${labels[type]}`}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <Button type="submit" loading={isSaving}>Adicionar {labels[type]}</Button>
        </form>

        {items.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">Nenhuma {labels[type]} cadastrada.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="text-sm font-medium text-slate-800">{item.nome}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openDialog(type, item, 'edit')}>
                    Editar {labels[type]} {item.nome}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => openDialog(type, item, 'delete')}>
                    Excluir {labels[type]} {item.nome}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background pt-header-height">
        <div className="mx-auto w-full max-w-5xl space-y-6 px-lg py-xl">
          <header>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Categorias e prioridades</h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Configure as opções usadas nos chamados da sua empresa.
            </p>
          </header>

          {erro ? (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
          ) : isLoading ? (
            <p role="status" className="text-sm text-slate-600">Carregando configurações...</p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {renderCatalog('category', categories, categoryName, setCategoryName)}
              {renderCatalog('priority', priorities, priorityName, setPriorityName)}
            </div>
          )}
        </div>
      </main>

      <Modal
        open={dialog !== null}
        title={dialog?.action === 'delete' ? 'Confirmar exclusão' : 'Editar configuração'}
        description={
          dialog?.action === 'delete'
            ? `Deseja excluir esta ${dialog ? labels[dialog.type] : 'configuração'}?`
            : 'Confirme o novo nome antes de salvar.'
        }
        onOpenChange={(open) => {
          if (!open && !isSaving) setDialog(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" disabled={isSaving} onClick={() => setDialog(null)}>Cancelar</Button>
            <Button
              variant={dialog?.action === 'delete' ? 'danger' : 'primary'}
              loading={isSaving}
              disabled={dialog?.action === 'edit' && dialogName.trim().length === 0}
              onClick={() => void confirmDialog()}
            >
              {dialog?.action === 'delete' ? 'Excluir' : 'Salvar'}
            </Button>
          </div>
        }
      >
        {dialog?.action === 'edit' && (
          <label className="block space-y-1 text-sm font-medium text-slate-700" htmlFor="catalog-name">
            Nome
            <input
              id="catalog-name"
              maxLength={100}
              autoFocus
              value={dialogName}
              onChange={(event) => setDialogName(event.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </label>
        )}
      </Modal>
    </>
  );
}

export default CatalogSettings;
