import { Plane, Clock, CheckCircle2, XCircle, Plus, Radio } from 'lucide-react';

export default function PilotDashboard() {

  


  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-3">
            <Plane className="w-6 h-6 text-cyan-400 rotate-45" />
            <div>
              <h1 className="text-lg font-bold text-white">EFB <span className="text-cyan-400">Status Panel</span></h1>
              <p className="text-xs text-slate-400 font-mono">Sistema de Gerenciamento de Pista</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">CONECTADO À TORRE</span>
          </div>
        </header>

        {/* --- ESTADO SEM REQUISIÇÃO --- */}
        {!requisicao && (
          <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-12 text-center border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6">
              <Radio className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nenhuma Requisição Ativa</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Você não possui solicitações de pouso ou decolagem em andamento. Crie uma nova requisição para entrar na fila da Torre.
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
                  <h2 className="text-3xl font-bold text-white mt-3 font-mono">{requisicao.tipoOperacao}</h2>
                </div>
                <Clock className="w-12 h-12 text-amber-400 opacity-50" />
              </div>

              {/* Detalhes da Requisição */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">ID Aeronave</p>
                  <p className="text-lg text-white font-mono">#{requisicao.aeronaveId}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">Prioridade</p>
                  <p className={`text-lg font-mono font-bold ${
                    requisicao.prioridade === 'EMERGENCIAL' ? 'text-red-400' : 
                    requisicao.prioridade === 'ALTA' ? 'text-amber-400' : 'text-cyan-400'
                  }`}>{requisicao.prioridade}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">Solicitado em</p>
                  <p className="text-lg text-white font-mono">{requisicao.dataHoraSolicitacao}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase mb-1">Protocolo</p>
                  <p className="text-lg text-white font-mono">#{requisicao.id}</p>
                </div>
              </div>

              {/* Observações */}
              <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700/50 mb-6">
                <p className="text-xs text-slate-500 uppercase mb-2">Observação</p>
                <p className="text-sm text-slate-300 italic">"{requisicao.observacao || 'Nenhuma observação informada.'}"</p>
              </div>

              <div className="flex justify-end">
                <button className="text-sm text-red-400 hover:text-red-300 underline decoration-red-500/50 underline-offset-4 transition-colors">
                  Cancelar Solicitação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ESTADO AUTORIZADO --- */}
        {requisicao && requisicao.status === 'AUTORIZADO' && (
          <div className="bg-[#111827] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-2">CLEARED</h2>
            <p className="text-lg text-white font-mono mb-8">Sua operação de {requisicao.tipoOperacao} foi autorizada pela Torre.</p>
            <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700 max-w-sm mx-auto">
              <p className="text-xs text-slate-500 mb-1">Pista Designada</p>
              <p className="text-2xl font-bold text-white font-mono">34L</p>
            </div>
          </div>
        )}

        {/* --- ESTADO NEGADO --- */}
        {requisicao && requisicao.status === 'NEGADO' && (
          <div className="bg-[#111827] border border-red-500/50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">REQUISIÇÃO NEGADA</h2>
            <p className="text-slate-400 mb-8">A Torre negou sua solicitação de {requisicao.tipoOperacao}. Entre em contato via rádio 118.1.</p>
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