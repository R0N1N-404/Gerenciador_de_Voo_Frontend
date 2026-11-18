import { useState } from 'react';
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

import type {
  TipoOperacao,
  PrioridadeRequisicao
} from '../../types/Requisicao';

import { useNavigate } from 'react-router-dom';
import { createRequisicao } from '../../services/requisicao/RequisicaoService';

export default function CreateRequest() {
  const navigate = useNavigate();

  // Estados do formulário
  const [aeronaveId, setAeronaveId] = useState('');
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacao>('POUSO');
  const [prioridade, setPrioridade] = useState<PrioridadeRequisicao>('NORMAL');
  const [observacao, setObservacao] = useState('');

  // Voltar ao dashboard
  const onCancel = () => {
    navigate('/pilotoDashboard');
  };

  // Enviar formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!aeronaveId) {
      alert('Informe o ID da Aeronave.');
      return;
    }

    const data = {
      aeronaveId: Number(aeronaveId),
      tipoOperacao,
      prioridade,
      observacao
    };

    onSubmit(data);
  };

  // Processar dados
  const onSubmit = async (data: {
    aeronaveId: number;
    tipoOperacao: TipoOperacao;
    prioridade: PrioridadeRequisicao;
    observacao: string;
  }) => {
    console.log(data);
    try{
      const token = localStorage.getItem('token');
      if(!token){
        navigate('/login', {replace: true});
        return;
      }
      const response = await createRequisicao(token, data);
      
      if(!response){
        alert('Não foi possível criar uma nova requisição');
        navigate('/', {replace: true});
        return;
      }
        alert('Requisição criada com sucesso');
        navigate('/pilotoDashboard', {replace: true});
        return;
    } catch (error) {
  if (error instanceof Error) {
    alert(error.message);
  } else {
    alert('Erro inesperado ao criar requisição.');
  }
}
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onCancel}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-white">Nova Requisição</h1>
            <p className="text-xs text-slate-400 font-mono">
              Preencha os dados para solicitar autorização da Torre
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ID Aeronave */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                ID da Aeronave <span className="text-red-400">*</span>
              </label>

              <input
                type="number"
                value={aeronaveId}
                onChange={(e) => setAeronaveId(e.target.value)}
                placeholder="Ex: 8472"
                required
                min="1"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder-slate-600"
              />
            </div>

            {/* Tipo de Operação */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Tipo de Operação <span className="text-red-400">*</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTipoOperacao('POUSO')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-bold text-sm transition-all ${
                    tipoOperacao === 'POUSO'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                      : 'bg-[#0f172a] border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <ArrowDownRight className="w-5 h-5" />
                  POUSO
                </button>

                <button
                  type="button"
                  onClick={() => setTipoOperacao('DECOLAGEM')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-bold text-sm transition-all ${
                    tipoOperacao === 'DECOLAGEM'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                      : 'bg-[#0f172a] border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <ArrowUpRight className="w-5 h-5" />
                  DECOLAGEM
                </button>
              </div>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Prioridade da Requisição <span className="text-red-400">*</span>
              </label>

              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as PrioridadeRequisicao)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              >
                <option value="NORMAL">Normal (Fila Padrão)</option>
                <option value="EMERGENCIA">Emergencia (MAYDAY / Falha Crítica)</option>
              </select>
            </div>

            {/* Aviso Emergencial */}
            {prioridade === 'EMERGENCIA' && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

                <div>
                  <p className="text-sm font-bold text-red-400">
                    Atenção: Declaração de Emergência
                  </p>

                  <p className="text-xs text-red-300/80 mt-1">
                    Ao enviar, a Torre será alertada imediatamente e sua requisição terá prioridade máxima sobre todas as outras.
                  </p>
                </div>
              </div>
            )}

            {/* Observação */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Observação (Opcional)
              </label>

              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: Solicito pista 34L por condições de vento. / Passageiro enfermo a bordo."
                rows={4}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder-slate-600 resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4 border-t border-slate-700/50">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-lg text-sm font-bold transition-colors"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                className="flex-[2] flex justify-center items-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Send className="w-4 h-4" />
                TRANSMITIR REQUISIÇÃO
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
