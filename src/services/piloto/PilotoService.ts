import type {
  PilotoCreate,
  PilotoResponse,
  PilotoUpdate,
} from '../../types/Piloto';

import { api } from '../api/api';

// Buscar todos os pilotos
export async function getPilotos(
  token: string,
): Promise<PilotoResponse[]> {
  return api<PilotoResponse[]>('/pilotos', {
    method: 'GET',
    token,
  });
}

// Buscar um piloto pelo ID
export async function getPilotoById(
  token: string,
  id: number,
): Promise<PilotoResponse> {
  return api<PilotoResponse>(`/pilotos/${id}`, {
    method: 'GET',
    token,
  });
}

// Criar piloto
export async function createPiloto(
  token: string,
  piloto: PilotoCreate,
): Promise<PilotoResponse> {
  return api<PilotoResponse>('/pilotos', {
    method: 'POST',
    token,
    body: JSON.stringify(piloto),
  });
}

// Editar piloto
export async function updatePiloto(
  token: string,
  id: number,
  piloto: PilotoUpdate,
): Promise<PilotoResponse> {
  return api<PilotoResponse>(`/pilotos/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(piloto),
  });
}

// Excluir piloto
export async function deletePiloto(
  token: string,
  id: number,
): Promise<void> {
  return api<void>(`/pilotos/${id}`, {
    method: 'DELETE',
    token,
  });
}

export async function logOffUsuario(token:string) {

  return api<void>(`/usuario/logoff`,{
    method: 'POST',
    token
  });
  
}