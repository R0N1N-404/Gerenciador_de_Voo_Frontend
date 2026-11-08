export type TipoOperacao = 'POUSO' | 'DECOLAGEM';
export type PrioridadeRequisicao = 'NORMAL' | 'ALTA' | 'EMERGENCIAL';
export type StatusRequisicao = 'PENDENTE' | 'AUTORIZADO' | 'NEGADO' | 'CONCLUIDO';

export interface RequisicaoResponse {
  id: number;
  aeronaveId: number;
  tipoOperacao: TipoOperacao;
  prioridade: PrioridadeRequisicao;
  observacao: string;
  status: StatusRequisicao;
  dataHoraSolicitacao: string;
}