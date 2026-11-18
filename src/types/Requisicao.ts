export type TipoOperacao = 'POUSO' | 'DECOLAGEM';
export type PrioridadeRequisicao = 'NORMAL' | 'EMERGENCIA';
export type StatusRequisicao = 'PENDENTE' | 'AUTORIZADA' | 'RECUSADA' | 'CONCLUIDA' | 'CANCELADA';

export interface RequisicaoResponse {
  id: number;
  aeronaveId: number;
  tipoOperacao: TipoOperacao;
  prioridade: PrioridadeRequisicao;
  observacao: string;
  status: StatusRequisicao;
  solicitadaEm: string;
}

export interface RequisicaoCreate {
  aeronaveId: number;
  tipoOperacao: TipoOperacao;
  prioridade: PrioridadeRequisicao;
  observacao: string;
}