import type {
  RequisicaoCreate,
  RequisicaoResponse,
} from '../../types/Requisicao';
import { api } from '../api/api';

export async function getRequisicaoByToken(
  token: string,
): Promise<RequisicaoResponse[]> {
  return api<RequisicaoResponse[]>('/requisicoes/usuario', {
    method: 'GET',
    token,
  });
}

export async function getRequisicoes(
  token: string,
): Promise<RequisicaoResponse[]> {
  return api<RequisicaoResponse[]>('/requisicoes/', {
    method: 'GET',
    token,
  });
}

export async function createRequisicao(
  token: string,
  req: RequisicaoCreate,
): Promise<RequisicaoResponse> {
  return api<RequisicaoResponse>('/requisicoes', {
    method: 'POST',
    token,
    body: JSON.stringify(req),
  });
}

export async function cancelarRequisicao(
  token: string,
  id: number,
): Promise<RequisicaoResponse> {
  return api<RequisicaoResponse>(`/requisicoes/${id}/cancelar`, {
    method: 'GET',
    token,
  });
}

export async function autorizarRequisicao(
  token: string,
  id: number,
  pistaId: number,
): Promise<RequisicaoResponse> {
  return api<RequisicaoResponse>(`/requisicoes/${id}/autorizar`, {
    method: 'POST',
    token,
    body: JSON.stringify({ pistaId }),
  });
}

export async function recusarRequisicao(
  token: string,
  id: number,
  motivo: string,
): Promise<RequisicaoResponse> {
  return api<RequisicaoResponse>(`/requisicoes/${id}/recusar`, {
    method: 'POST',
    token,
    body: JSON.stringify({ motivo }),
  });
}

export async function concluirRequisicao(
  token: string,
  id: number,
): Promise<RequisicaoResponse> {
  return api<RequisicaoResponse>(`/requisicoes/${id}/concluir`, {
    method: 'POST',
    token,
  });
}