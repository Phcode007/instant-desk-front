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
