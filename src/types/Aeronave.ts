export interface AeronaveResponse {
  id: number;
  prefixo: string;
  modelo: string;
  companhia: string;
}

export interface AeronaveCreate {
  prefixo: string;
  modelo: string;
  companhia: string;
}

export type AeronaveUpdate = AeronaveCreate;