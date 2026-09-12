export interface TicketStatusCount {
  status: string;
  total: number;
}

export default interface TicketStats {
  abertosHoje: number;
  emAndamento: number;
  total: number;
  porStatus: TicketStatusCount[];
}
