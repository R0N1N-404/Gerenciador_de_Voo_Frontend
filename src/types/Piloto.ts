export type TipoUsuario = 'PILOTO' | 'CONTROLADOR' | 'ADMIN';

export interface PilotoResponse {
  id: number;          // = usuarioId
  nome: string;
  login: string;
  numeroLicenca: string;
  tipo: TipoUsuario;
  criado_em: string;
}

export interface PilotoCreate {
  nome: string;
  login: string;
  senha: string;
  numeroLicenca: string;
}

export interface PilotoUpdate {
  nome: string;
  login: string;
  numeroLicenca: string;
  senha?: string; // opcional na edição
}