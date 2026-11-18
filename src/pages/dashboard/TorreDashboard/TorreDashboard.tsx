
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getRequisicoes,
  autorizarRequisicao,
  recusarRequisicao,
  concluirRequisicao,
} from '../../../services/requisicao/RequisicaoService';

import {
  Radio,
  AlertTriangle,
  PlaneLanding,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Plane,
  Users,
  ArrowRight,
  LogOut,
} from 'lucide-react';

import { logOffUsuario } from '../../../services/piloto/PilotoService';

// Tipagens alinhadas ao backend
export type TipoOperacao = 'POUSO' | 'DECOLAGEM';

export type PrioridadeRequisicao =
  | 'EMERGENCIAL'
  | 'EMERGENCIA'
  | 'ALTA'
  | 'NORMAL';

export type StatusRequisicao =
  | 'PENDENTE'
  | 'AUTORIZADA'
  | 'RECUSADA'
  | 'CONCLUIDA'
  | 'CANCELADA';

export interface RequisicaoResponse {
  id: number;
  aeronaveId: number;
  aeronavePrefixo: string;
  pilotoNome: string;
  tipoOperacao: TipoOperacao;
  prioridade: PrioridadeRequisicao;
  observacao: string;
  status: StatusRequisicao;
  solicitadaEm: string;
  autorizadaEm: string | null;
  concluidaEm: string | null;
}

// Formatação de data e hora
const formatarDataHora = (iso: string | null): string => {
  if (!iso) return '—';

  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) return iso;

  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Normalização de prioridade
type PrioridadeNormalizada = 'EMERGENCIAL' | 'ALTA' | 'NORMAL';

const normalizarPrioridade = (
  prioridade: string | null | undefined
): PrioridadeNormalizada => {
  const valor = (prioridade ?? 'NORMAL')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();

  if (valor === 'EMERGENCIAL' || valor === 'EMERGENCIA') {
    return 'EMERGENCIAL';
  }

  if (valor === 'ALTA') return 'ALTA';

  return 'NORMAL';
};

// Ordem de prioridade
const PRIORIDADE_ORDEM: Record<PrioridadeNormalizada, number> = {
  EMERGENCIAL: 0,
  ALTA: 1,
  NORMAL: 2,
};

// Cores de prioridade
const corPrioridade = (p: PrioridadeRequisicao) => {
  switch (normalizarPrioridade(p)) {
    case 'EMERGENCIAL':
      return {
        texto: 'text-red-400',
        fundo: 'bg-red-500/10',
        borda: 'border-red-500/30',
      };

    case 'ALTA':
      return {
        texto: 'text-amber-400',
        fundo: 'bg-amber-500/10',
        borda: 'border-amber-500/30',
      };

    default:
      return {
        texto: 'text-cyan-400',
        fundo: 'bg-cyan-500/10',
        borda: 'border-cyan-500/20',
      };
  }
};

const corBordaCard = (p: PrioridadeRequisicao) => {
  switch (normalizarPrioridade(p)) {
    case 'EMERGENCIAL':
      return 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]';

    case 'ALTA':
      return 'border-amber-500/50';

    default:
      return 'border-slate-700/60';
  }
};

const corBarraLateral = (p: PrioridadeRequisicao) => {
  switch (normalizarPrioridade(p)) {
    case 'EMERGENCIAL':
      return 'bg-red-500';

    case 'ALTA':
      return 'bg-amber-500';

    default:
      return 'bg-slate-600';
  }
};

export default function TowerDashboard() {
  const [requisicoes, setRequisicoes] = useState<RequisicaoResponse[]>([]);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  // Buscar requisições
  useEffect(() => {
    async function buscarRequisicoes() {
      const token = localStorage.getItem('token');

      if (!token) {
        setCarregando(false);
        navigate('/login', { replace: true });
        return;
      }

      try {
        const dados = await getRequisicoes(token);

        console.log('Requisições recebidas:', dados);

        setRequisicoes(dados);
      } catch (error) {
        console.error('Erro ao buscar requisições:', error);
      } finally {
        setCarregando(false);
      }
    }

    buscarRequisicoes();
  }, [navigate]);

  // Logoff
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        await logOffUsuario(token);
      }
    } catch (error) {
      console.error('Erro ao realizar logoff:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  };

  // Atualizar status localmente
  const atualizarStatus = (
    id: number,
    status: StatusRequisicao
  ) => {
    setRequisicoes((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    );
  };

  // Atualizar requisição completa
  const atualizarLista = (atualizada: RequisicaoResponse) => {
    setRequisicoes((anteriores) =>
      anteriores.map((r) =>
        r.id === atualizada.id ? atualizada : r
      )
    );
  };

  // Autorizar
  const autorizar = async (id: number, pistaId: number = 1) => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const resposta = await autorizarRequisicao(token, id, pistaId);

      if (resposta) {
        atualizarLista(resposta);
      } else {
        atualizarStatus(id, 'AUTORIZADA');
      }
    } catch (error) {
      console.error('Erro ao autorizar requisição:', error);
      alert('Não foi possível autorizar a requisição.');
    }
  };

  // Recusar
  const recusar = async (
    id: number,
    motivo: string = 'Não autorizado pela torre'
  ) => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const resposta = await recusarRequisicao(token, id, motivo);

      if (resposta) {
        atualizarLista(resposta);
      } else {
        atualizarStatus(id, 'RECUSADA');
      }
    } catch (error) {
      console.error('Erro ao recusar requisição:', error);
      alert('Não foi possível recusar a requisição.');
    }
  };

  // Concluir
  const concluir = async (id: number) => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const resposta = await concluirRequisicao(token, id);

      if (resposta) {
        atualizarLista(resposta);
      } else {
        atualizarStatus(id, 'CONCLUIDA');
      }
    } catch (error) {
      console.error('Erro ao concluir requisição:', error);
      alert('Não foi possível concluir a requisição.');
    }
  };

  // Fila de pendentes ordenada por prioridade e horário
  const fila = [...requisicoes]
    .filter((r) => r.status === 'PENDENTE')
    .sort((a, b) => {
      const prioridadeA =
        PRIORIDADE_ORDEM[normalizarPrioridade(a.prioridade)];

      const prioridadeB =
        PRIORIDADE_ORDEM[normalizarPrioridade(b.prioridade)];

      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }

      return (
        new Date(a.solicitadaEm).getTime() -
        new Date(b.solicitadaEm).getTime()
      );
    });

  // Requisições autorizadas
  const emEspera = requisicoes.filter(
    (r) => r.status === 'AUTORIZADA'
  );

  // Contadores
  const emergencias = fila.filter(
    (r) => normalizarPrioridade(r.prioridade) === 'EMERGENCIAL'
  ).length;

  const totalAlta = fila.filter(
    (r) => normalizarPrioridade(r.prioridade) === 'ALTA'
  ).length;

  const totalNormal = fila.filter(
    (r) => normalizarPrioridade(r.prioridade) === 'NORMAL'
  ).length;

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
      <div className="w-full max-w-5xl mx-auto">

        {/* Header da Torre */}
        <header className="flex justify-between items-center mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <Radio className="w-6 h-6 text-amber-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                Torre de Controle
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Sistema de Gerenciamento de Pista
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Sair"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </header>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Fila de Requisições
              </p>
              <p className="text-3xl font-bold text-white font-mono">
                {fila.length}
              </p>
            </div>
            <PlaneLanding className="w-8 h-8 text-cyan-400" />
          </div>

          <div className={`bg-[#111827] border rounded-xl p-4 flex items-center justify-between ${
            emergencias > 0
              ? 'border-red-500/60'
              : 'border-slate-700/60'
          }`}>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Emergências
              </p>
              <p className="text-3xl font-bold text-red-400 font-mono">
                {emergencias}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Autorizadas (em espera)
              </p>
              <p className="text-3xl font-bold text-emerald-400 font-mono">
                {emEspera.length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        {/* Contagem por prioridade */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
            Emergenciais: {emergencias}
          </span>
          <span className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold">
            Normal: {totalNormal}
          </span>
        </div>

        {/* Alerta de emergência */}
        {emergencias > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/50 bg-red-500/10 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>

            <div>
              <h3 className="text-red-400 font-bold text-lg">
                ATENÇÃO: EMERGÊNCIA NA FILA
              </h3>

              <p className="text-red-300/80 text-sm">
                Existem {emergencias} requisição(ões) emergencial(is)
                aguardando autorização.
              </p>
            </div>
          </div>
        )}

        {/* Fila de requisições */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Fila de Requisições (Pendentes)
          </h2>

          {carregando ? (
            <div className="bg-[#111827] border border-slate-700/60 border-dashed rounded-xl p-12 text-center text-slate-500 font-mono">
              Carregando requisições...
            </div>
          ) : fila.length === 0 ? (
            <div className="bg-[#111827] border border-slate-700/60 border-dashed rounded-xl p-12 text-center text-slate-500 font-mono">
              Nenhuma requisição pendente na fila da torre.
            </div>
          ) : (
            fila.map((req, index) => {
              const prio = corPrioridade(req.prioridade);
              const emergencial =
                normalizarPrioridade(req.prioridade) === 'EMERGENCIAL';

              return (
                <div
                  key={req.id}
                  className={`relative overflow-hidden bg-[#111827] border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${corBordaCard(
                    req.prioridade
                  )}`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${corBarraLateral(
                      req.prioridade
                    )}`}
                  />

                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border font-mono text-xl font-bold ml-2 ${
                    emergencial
                      ? 'bg-red-500/10 border-red-500/40 text-red-400'
                      : 'bg-[#0f172a] border-slate-700 text-slate-300'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white font-mono">
                        {req.aeronavePrefixo}
                      </h3>

                      <span className="text-sm text-slate-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        {req.tipoOperacao}
                      </span>

                      <span className={`text-xs font-bold px-2 py-1 rounded border ${prio.texto} ${prio.fundo} ${prio.borda}`}>
                        {normalizarPrioridade(req.prioridade)}
                      </span>

                      {emergencial && (
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          MAYDAY
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-slate-400 font-mono mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Solicitada em:
                        <strong className="text-white">
                          {formatarDataHora(req.solicitadaEm)}
                        </strong>
                      </span>

                      <span>
                        Piloto:{' '}
                        <strong className="text-white">
                          {req.pilotoNome}
                        </strong>
                      </span>

                      <span>
                        Protocolo:{' '}
                        <strong className="text-white">
                          #{req.id}
                        </strong>
                      </span>
                    </div>

                    {req.observacao && (
                      <p className="text-sm text-slate-300 italic mt-2 max-w-xl">
                        "{req.observacao}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => autorizar(req.id, 1)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg font-bold text-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      AUTORIZAR
                    </button>

                    <button
                      onClick={() =>
                        recusar(req.id, 'Não autorizado pela torre')
                      }
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg font-bold text-sm transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      RECUSAR
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Requisições autorizadas */}
        {emEspera.length > 0 && (
          <div className="space-y-4 mt-10">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Autorizadas (aguardando conclusão)
            </h2>

            {emEspera.map((req) => {
              const prio = corPrioridade(req.prioridade);

              return (
                <div
                  key={req.id}
                  className="relative overflow-hidden bg-[#111827] border border-emerald-500/40 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />

                  <div className="flex-1 ml-2">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white font-mono">
                        {req.aeronavePrefixo}
                      </h3>

                      <span className="text-sm text-slate-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        {req.tipoOperacao}
                      </span>

                      <span className={`text-xs font-bold px-2 py-1 rounded border ${prio.texto} ${prio.fundo} ${prio.borda}`}>
                        {normalizarPrioridade(req.prioridade)}
                      </span>

                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        AUTORIZADA
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-slate-400 font-mono mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Solicitada em:
                        <strong className="text-white">
                          {formatarDataHora(req.solicitadaEm)}
                        </strong>
                      </span>

                      <span>
                        Autorizada em:{' '}
                        <strong className="text-white">
                          {formatarDataHora(req.autorizadaEm)}
                        </strong>
                      </span>

                      <span>
                        Piloto:{' '}
                        <strong className="text-white">
                          {req.pilotoNome}
                        </strong>
                      </span>

                      <span>
                        Protocolo:{' '}
                        <strong className="text-white">
                          #{req.id}
                        </strong>
                      </span>
                    </div>

                    {req.observacao && (
                      <p className="text-sm text-slate-300 italic mt-2 max-w-xl">
                        "{req.observacao}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => concluir(req.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/50 text-sky-400 rounded-lg font-bold text-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      CONCLUIR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Navegação */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/pilotos')}
            className="group flex items-center justify-between bg-[#111827] hover:bg-[#1a2332] border border-slate-700/60 hover:border-cyan-500/50 rounded-xl p-6 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-white">
                  Pilotos
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Visualizar cadastros de pilotos
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>

          <button
            onClick={() => navigate('/aeronaves/')}
            className="group flex items-center justify-between bg-[#111827] hover:bg-[#1a2332] border border-slate-700/60 hover:border-amber-500/50 rounded-xl p-6 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <Plane className="w-6 h-6 text-amber-400" />
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-white">
                  Aeronaves
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Visualizar frota cadastrada
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

      </div>
    </div>
  );
}
