import { Plane, Clock, CheckCircle2, XCircle, Plus, Radio, Ban, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequisicaoResponse } from '../../../types/Requisicao';
import {
  cancelarRequisicao,
  getRequisicaoByToken,
} from '../../../services/requisicao/RequisicaoService';
import { logOffUsuario } from '../../../services/piloto/PilotoService';

export default function PilotDashboard() {
  const [requisicao, setRequisicao] = useState<RequisicaoResponse | null>(null);

  const navigate = useNavigate();

  const onNavigateToCreate = (): void => {
    navigate('/requisicao/create');
  };

  const logout = async () => {
    try{
    const token = localStorage.getItem('token');
      if (!token) {
          navigate('/login', { replace: true });
          return;
        }
    await logOffUsuario(token);
          alert('Logoff Realizado com sucesso');
          navigate(0);
    

    
    }catch (error) {
      console.error('Erro ao cancelar requisição:', error);
      alert('Erro ao tentar fazer logoff.');
    }
  }

  useEffect(() => {
    async function getRequisicao() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }
        const response = await getRequisicaoByToken(token);

        if (!response) {
          alert('Não foi possível buscar as requisições');
          return;
        }
        setRequisicao(response.length > 0 ? response[response.length - 1] : null);
      } catch {
        alert('Não foi possível buscar as requisições');
      }
    }

    getRequisicao();
  }, [navigate]);

  const onCancelar = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (!requisicao) return;

    try {
      const resposta = await cancelarRequisicao(token, requisicao.id);

      setRequisicao(resposta);

      alert('Requisição cancelada com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar requisição:', error);
      alert('Não foi possível cancelar a requisição.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-3">
            <Plane className="w-6 h-6 text-cyan-400 rotate-45" />
            <div>
              <h1 className="text-lg font-bold text-white">
                <span className="text-cyan-400">Painel do Piloto</span>
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

        {/* --- ESTADO SEM REQUISIÇÃO --- */}
        {!requisicao && (
          <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-12 text-center border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6">
              <Radio className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Nenhuma Requisição Ativa
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Você não possui solicitações de pouso ou decolagem em andamento.
              Crie uma nova requisição para entrar na fila da Torre.
            </p>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] font-bold rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" /> CRIAR NOVA REQUISIÇÃO
            </button>
          </div>
        )}

        {/* --- ESTADO COM REQUISIÇÃO PENDENTE --- */}
        {requisicao && requisicao.status === 'PENDENTE' && (
          <div className="bg-[#111827] border border-amber-500/30 rounded-xl overflow-hidden relative">
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 animate-pulse"></div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                    Aguardando Autorização
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-3 font-mono">
                    {requisicao.tipoOperacao}
                  </h2>
                </div>
                <Clock className="w-12 h-12 text-amber-400 opacity-50" />
              </div>

              {/* Detalhes da Requisição */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">
                    ID Aeronave
                  </p>
                  <p className="text-lg text-white font-mono">
                    {requisicao.aeronaveId}
                  </p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">
                    Prioridade
                  </p>
                  <p
                    className={`text-lg font-mono font-bold ${
                      requisicao.prioridade === 'EMERGENCIA'
                        ? 'text-red-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {requisicao.prioridade}
                  </p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">
                    Solicitado em
                  </p>
                  <p className="text-lg text-white font-mono">
                    {new Date(requisicao.solicitadaEm).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(requisicao.solicitadaEm).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">
                    Protocolo
                  </p>
                  <p className="text-lg text-white font-mono">
                    {requisicao.id}
                  </p>
                </div>
              </div>

              {/* Observações */}
              <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50 mb-6">
                <p className="text-xs text-slate-500 uppercase mb-2">
                  Observação
                </p>
                <p className="text-sm text-slate-300 italic">
                  "{requisicao.observacao || 'Nenhuma observação informada.'}"
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onCancelar}
                  className="text-sm text-red-400 hover:text-red-300 underline decoration-red-500/50 underline-offset-4 transition-colors"
                >
                  Cancelar Solicitação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ESTADO AUTORIZADO --- */}
        {requisicao && requisicao.status === 'AUTORIZADA' && (
          <div className="bg-[#111827] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-2">
              PISTA LIVRE
            </h2>
            <p className="text-lg text-white font-mono mb-8">
              Sua operação de {requisicao.tipoOperacao} foi autorizada pela
              Torre.
            </p>
            <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700 max-w-sm mx-auto">
              <p className="text-xs text-slate-500 mb-1">Pista Designada</p>
              <p className="text-2xl font-bold text-white font-mono">1</p>
            </div>
          </div>
        )}

        {/* --- ESTADO RECUSADA --- */}
        {requisicao && requisicao.status === 'RECUSADA' && (
          <div className="bg-[#111827] border border-red-500/50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">
              REQUISIÇÃO NEGADA
            </h2>
            <p className="text-slate-400 mb-8">
              A Torre negou sua solicitação de {requisicao.tipoOperacao}.
            </p>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] font-bold rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" /> CRIAR NOVA REQUISIÇÃO
            </button>
          </div>
        )}

        {/* --- ESTADO CONCLUÍDA --- */}
        {requisicao && requisicao.status === 'CONCLUIDA' && (
          <div className="bg-[#111827] border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.15)] rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-500/20 border-2 border-sky-500 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-sky-400" />
            </div>
            <h2 className="text-3xl font-bold text-sky-400 mb-2">
              OPERAÇÃO CONCLUÍDA
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              A operação de {requisicao.tipoOperacao} foi concluída com sucesso.
              Obrigado por utilizar o sistema de Gerenciamento Aéreo.
            </p>
            <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50 max-w-sm mx-auto mb-8">
              <p className="text-xs text-slate-500 uppercase mb-1">
                Protocolo
              </p>
              <p className="text-lg text-white font-mono">#{requisicao.id}</p>
            </div>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] font-bold rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" /> CRIAR NOVA REQUISIÇÃO
            </button>
          </div>
        )}

        {/* --- ESTADO CANCELADA --- */}
        {requisicao && requisicao.status === 'CANCELADA' && (
          <div className="bg-[#111827] border border-slate-600/50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-500/20 border-2 border-slate-500 rounded-full mb-6">
              <Ban className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-400 mb-2">
              REQUISIÇÃO CANCELADA
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Sua solicitação de {requisicao.tipoOperacao} foi cancelada. Você
              pode criar uma nova requisição quando estiver pronto.
            </p>
            <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50 max-w-sm mx-auto mb-8">
              <p className="text-xs text-slate-500 uppercase mb-1">
                Protocolo
              </p>
              <p className="text-lg text-white font-mono">#{requisicao.id}</p>
            </div>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] font-bold rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" /> CRIAR NOVA REQUISIÇÃO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}