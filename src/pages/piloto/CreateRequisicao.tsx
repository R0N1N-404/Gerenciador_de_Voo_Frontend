// CreateRequest.tsx
import React, { useState } from 'react';
import {ArrowLeft, Send, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { TipoOperacao, PrioridadeRequisicao } from "../../types/Requisicao";

interface Props {
  onCancel: () => void;
  onSubmit: (data: { aeronaveId: number; tipoOperacao: TipoOperacao; prioridade: PrioridadeRequisicao; observacao: string }) => void;
}

export default function CreateRequest({ onCancel, onSubmit }: Props) {
  // Estados do Formulário (Mapeando exatamente o seu backend)
  const [aeronaveId, setAeronaveId] = useState<string>('');
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacao>('POUSO');
  const [prioridade, setPrioridade] = useState<PrioridadeRequisicao>('NORMAL');
  const [observacao, setObservacao] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aeronaveId) return alert('Informe o ID da Aeronave.');
    
    onSubmit({
      aeronaveId: Number(aeronaveId),
      tipoOperacao,
      prioridade,
      observacao
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        
        {/* Header da Tela */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onCancel} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Nova Requisição</h1>
            <p className="text-xs text-slate-400 font-mono">Preencha os dados para solicitar autorização da Torre</p>
          </div>
        </div>

        {/* Card do Formulário */}
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo: ID da Aeronave */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                ID da Aeronave <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={aeronaveId}
                  onChange={(e) => setAeronaveId(e.target.value)}
                  placeholder="Ex: 8472"
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder-slate-600"
                />
              </div>
            </div>

            {/* Campo: Tipo de Operação (Radio Buttons customizados) */}
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
                  <ArrowDownRight className="w-5 h-5" /> POUSO
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
                  <ArrowUpRight className="w-5 h-5" /> DECOLAGEM
                </button>
              </div>
            </div>

            {/* Campo: Prioridade */}
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
                <option value="ALTA">Alta (Urgência / Baixo Combustível)</option>
                <option value="EMERGENCIAL">Emergencial (MAYDAY / Falha Crítica)</option>
              </select>
            </div>

            {/* Aviso caso seja EMERGENCIAL */}
            {prioridade === 'EMERGENCIAL' && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-400">Atenção: Declaração de Emergência</p>
                  <p className="text-xs text-red-300/80 mt-1">Ao enviar, a Torre será alertada imediatamente e sua requisição terá prioridade máxima sobre todas as outras.</p>
                </div>
              </div>
            )}

            {/* Campo: Observação */}
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

            {/* Botões de Ação */}
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
                <Send className="w-4 h-4" /> TRANSMITIR REQUISIÇÃO
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}