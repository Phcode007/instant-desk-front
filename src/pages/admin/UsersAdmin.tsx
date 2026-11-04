import { useEffect, useState } from 'react';
import type User from '../../models/User';
import { USER_ROLES, UserRole, type UserRole as UserRoleType } from '../../models/UserRole';
import {
  alterarPerfilUsuario,
  buscarUsuario,
  getApiErrorMessage,
  listarUsuarios,
} from '../../services/Service';
import { useAuthStore } from '../../store/useAuthStore';
import { isUserRole } from '../../utils/auth';
import AppNavbar from '../../components/navbar/AppNavbar';
import { Badge, Button, LoadingState, Modal, Table, useToast } from '../../components/ui';
import type { TableColumn } from '../../components/ui';

const roleLabels: Record<UserRoleType, string> = {
  [UserRole.USER]: 'Solicitante',
  [UserRole.SUPPORT]: 'Atendimento',
  [UserRole.ADMIN]: 'Administrador',
};

function UsersAdmin() {
  const { usuario: usuarioAtual } = useAuthStore();
  const { showToast } = useToast();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<User | null>(null);
  const [perfilDestino, setPerfilDestino] = useState<UserRoleType>(UserRole.USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarUsuarios()
      .then((dados) => {
        if (active) setUsuarios(dados);
      })
      .catch((error: unknown) => {
        if (active) setErro(getApiErrorMessage(error, 'Não foi possível carregar os usuários.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function abrirDetalhes(id: number) {
    setErro(null);
    try {
      const detalhes = await buscarUsuario(id);
      setUsuarioSelecionado(detalhes);
      setPerfilDestino(detalhes.role);
    } catch (error) {
      showToast({
        title: 'Falha ao consultar usuário',
        description: getApiErrorMessage(error, 'Não foi possível carregar os dados deste usuário.'),
        variant: 'error',
      });
    }
  }

  async function confirmarAlteracao() {
    if (!usuarioSelecionado || perfilDestino === usuarioSelecionado.role) {
      setUsuarioSelecionado(null);
      return;
    }

    setIsSaving(true);
    try {
      const atualizado = await alterarPerfilUsuario(usuarioSelecionado.id, perfilDestino);
      setUsuarios((atuais) =>
        atuais.map((usuario) => (usuario.id === atualizado.id ? atualizado : usuario)),
      );
      setUsuarioSelecionado(null);
      showToast({
        title: 'Perfil atualizado',
        description: `${atualizado.nome} agora tem o perfil ${roleLabels[atualizado.role]}.`,
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Não foi possível alterar o perfil',
        description: getApiErrorMessage(error, 'Tente novamente.'),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'Nome',
      render: (user) => <span className="font-medium text-slate-900">{user.nome}</span>,
    },
    {
      key: 'email',
      header: 'E-mail',
      render: (user) => user.usuario,
    },
    {
      key: 'role',
      header: 'Perfil',
      render: (user) => <Badge variant={user.role === UserRole.ADMIN ? 'brand' : 'neutral'}>{roleLabels[user.role]}</Badge>,
    },
    {
      key: 'action',
      header: 'Ações',
      className: 'text-right',
      render: (user) =>
        user.id === usuarioAtual?.id ? (
          <span className="text-xs text-slate-500">Seu usuário</span>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => void abrirDetalhes(user.id)}>
            Ver e alterar perfil
          </Button>
        ),
    },
  ];

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background pt-header-height">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-lg py-xl">
          <header>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Gerenciamento de usuários</h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Consulte os usuários da sua empresa e ajuste seus perfis de acesso.
            </p>
          </header>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            {isLoading ? (
              <div className="p-6"><LoadingState variant="skeleton" label="Carregando usuários" lines={4} /></div>
            ) : erro ? (
              <div role="alert" className="p-6 text-sm text-red-700">{erro}</div>
            ) : (
              <Table
                caption="Usuários da empresa"
                columns={columns}
                rows={usuarios}
                rowKey={(user) => user.id}
                emptyState={<p className="text-center text-slate-500">Nenhum usuário encontrado.</p>}
              />
            )}
          </section>
        </div>
      </main>

      <Modal
        open={usuarioSelecionado !== null}
        title="Alterar perfil do usuário"
        description="A alteração será validada pelo servidor e pode revogar permissões existentes."
        onOpenChange={(open) => {
          if (!open && !isSaving) setUsuarioSelecionado(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" disabled={isSaving} onClick={() => setUsuarioSelecionado(null)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={isSaving}
              disabled={!usuarioSelecionado || perfilDestino === usuarioSelecionado.role}
              onClick={() => void confirmarAlteracao()}
            >
              Confirmar alteração
            </Button>
          </div>
        }
      >
        {usuarioSelecionado && (
          <div className="space-y-4">
            <div>
              <p className="font-medium text-slate-900">{usuarioSelecionado.nome}</p>
              <p className="text-sm text-slate-600">{usuarioSelecionado.usuario}</p>
            </div>
            <label className="block space-y-1 text-sm font-medium text-slate-700" htmlFor="perfil-destino">
              Perfil
              <select
                id="perfil-destino"
                value={perfilDestino}
                onChange={(event) => {
                  if (isUserRole(event.target.value)) setPerfilDestino(event.target.value);
                }}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>{roleLabels[role]}</option>
                ))}
              </select>
            </label>
            {usuarioSelecionado.id === usuarioAtual?.id && (
              <p role="alert" className="text-sm text-red-700">Não é permitido alterar seu próprio perfil.</p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

export default UsersAdmin;
