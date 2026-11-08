export type LoginRequest = {
  login: string;
  senha: string;
};

export type LoginResponse = {
  nome: string;
  tipo: string;
  criado_em: string;
  token: string;
};

export type checkAuth = LoginResponse & {
  autenticado: boolean;
};
