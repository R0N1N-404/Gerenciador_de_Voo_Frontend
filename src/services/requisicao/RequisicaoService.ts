import type { RequisicaoResponse } from "../../types/Requisicao";
import { api } from "../api/api";

export async function getRequisicaoByToken(token: string): Promise<RequisicaoResponse>{

  return api("/requisicoes/usuario", {
    method: "GET",
    token
  })
  
  
}