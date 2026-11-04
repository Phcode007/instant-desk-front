# Instant Desk Frontend

Frontend React + TypeScript do Instant Desk, desenvolvido com Vite, Tailwind CSS, React Router, Axios e Zustand.

## Desenvolvimento

```bash
npm install
npm run dev
```

Validações disponíveis:

```bash
npm run build
npm run lint
npm test
```

Configure `VITE_API_URL` no ambiente local para apontar para o backend existente. Os serviços e contratos HTTP ficam em `src/services/` e não são alterados pelo Design System.

## Design System

O Design System fica em `src/components/ui/` e exporta seus componentes e tipos pelo barrel `src/components/ui/index.ts`. Os tokens globais são definidos como custom properties em `src/index.css` e expostos como cores, fontes, raios e espaçamentos em `tailwind.config.js`.

- **Tipografia:** Inter, pesos 300–700.
- **Identidade:** escala azul `brand` de `#F0F7FF` a `#0A294B`, com `brand-500` em `#168FF5`.
- **Superfícies:** neutros slate, fundo `#F8FAFC`, superfície branca e borda `#E2E8F0`.
- **Estados:** cores semânticas para status de ticket e prioridades.
- **Acessibilidade:** estados de foco visíveis, controles nativos, rótulos e mensagens de validação associadas, e landmarks/labels em navegação, tabelas, diálogos e notificações.

Componentes disponíveis: `Button`, `Input`, `Select`, `Textarea`, `Card`, `Badge`, `Avatar`, `Modal`, `Table`, `Pagination`, `Breadcrumb`, `Sidebar`, `Header`, `Toast`/`ToastProvider`, `EmptyState`, `LoadingState` e `ErrorState`.

Exemplo:

```tsx
import { Badge, Button, Input } from './components/ui';

function Example() {
  return (
    <section className="space-y-ds-4">
      <Input label="Título" hint="Use um resumo objetivo." />
      <Badge variant="open" dot>Aberto</Badge>
      <Button variant="primary">Salvar</Button>
    </section>
  );
}
```

`useToast()` deve ser usado dentro do `ToastProvider`, já instalado na aplicação:

```tsx
import { useToast } from './components/ui';

function SaveButton() {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast({ title: 'Alterações salvas', variant: 'success' })}>
      Salvar
    </button>
  );
}
```

## Perfis de acesso

Os valores de perfil (`USER`, `SUPPORT`, `ADMIN`) estão tipados em `src/models/UserRole.ts`. O endpoint `POST /users/logar` retorna o usuário, o token `Bearer ...` e `role`; o frontend mantém esses dados na sessão do Zustand. A senha não é necessária na sessão e não é persistida.

| Perfil | Funcionalidades exibidas |
| --- | --- |
| `USER` | Criar chamados, consultar os próprios chamados e interagir com eles. |
| `SUPPORT` | Consultar a fila da empresa, responder chamados e atualizar status/prioridade. |
| `ADMIN` | Acessar as funcionalidades anteriores, o dashboard, gerenciar usuários e editar os dados da empresa. |

O cadastro público não envia um perfil selecionável e o backend continua responsável por criar `USER`. A interface esconde rotas e ações incompatíveis com o perfil, mas isso não é uma fronteira de segurança: cada operação continua sendo autorizada pelo backend. Em respostas HTTP 401, a sessão local é limpa e o usuário é enviado ao login; em 403, a sessão é preservada e a interface exibe acesso negado.

## Integração administrativa

O gerenciamento de usuários usa os endpoints existentes `GET /users/all`, `GET /users/:id` e `PUT /users/:id/role`, enviando `{ "role": "USER" | "SUPPORT" | "ADMIN" }`. A própria conta não tem ação de alteração de perfil na interface. O backend valida novamente o papel ADMIN, o vínculo empresarial, a regra contra autoalteração e a integridade do último administrador.

A tela **Empresa** utiliza `GET /companies` e `PUT /companies` para editar os dados da empresa associada à sessão. O escopo e as permissões são determinados pelo backend; o frontend não envia um `company_id` escolhido pelo usuário.

Os testes automatizados são executados com `npm test` (Vitest e Testing Library).
