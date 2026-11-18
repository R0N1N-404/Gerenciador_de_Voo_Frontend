import type {
  AeronaveResponse,
  AeronaveCreate,
  AeronaveUpdate
} from "../../types/Aeronave";

import { api } from "../api/api";

export async function getAeronaves(token: string): Promise<AeronaveResponse[]> {
  return api("/aeronave", {
    method: "GET",
    token
  });
}

export async function getAeronaveById(token: string, id: number): Promise<AeronaveResponse> {
  return api(`/aeronave/${id}`, {
    method: "GET",
    token
  });
}

export async function createAeronave(token: string, dados: AeronaveCreate): Promise<AeronaveResponse> {
  return api("/aeronave", {
    method: "POST",
    token,
    body: JSON.stringify(dados)
  });
}

export async function updateAeronave(token: string, id: number, dados: AeronaveUpdate): Promise<AeronaveResponse> {
  return api(`/aeronave/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(dados)
  });
}

export async function deleteAeronave(token: string, id: number): Promise<void> {
  return api(`/aeronave/${id}`, {
    method: "DELETE",
    token
  });
}