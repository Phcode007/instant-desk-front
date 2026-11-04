import type { BadgeVariant } from '../components/ui/Badge';

const ticketStatusVariants: Record<string, BadgeVariant> = {
  aberto: 'open',
  'em andamento': 'inProgress',
  pendente: 'pending',
  resolvido: 'resolved',
  fechado: 'closed',
};

const ticketStatusColorTokens: Record<string, string> = {
  aberto: '--status-open',
  'em andamento': '--status-progress',
  pendente: '--status-pending',
  resolvido: '--status-resolved',
  fechado: '--status-closed',
};

const ticketPriorityVariants: Record<string, BadgeVariant> = {
  baixa: 'low',
  low: 'low',
  média: 'medium',
  media: 'medium',
  medium: 'medium',
  alta: 'high',
  high: 'high',
};

function normalizeStatus(status: string) {
  return status.trim().toLocaleLowerCase('pt-BR');
}

export function getTicketStatusVariant(status: string): BadgeVariant {
  return ticketStatusVariants[normalizeStatus(status)] ?? 'neutral';
}

export function getTicketStatusColor(status: string) {
  const token = ticketStatusColorTokens[normalizeStatus(status)] ?? '--neutral-500';
  return `rgb(var(${token}))`;
}

export function getTicketPriorityVariant(priority: string): BadgeVariant {
  return ticketPriorityVariants[normalizeStatus(priority)] ?? 'neutral';
}
