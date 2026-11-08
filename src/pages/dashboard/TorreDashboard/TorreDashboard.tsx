import { useState } from 'react';
import { Radio, AlertTriangle, PlaneLanding, Clock, CheckCircle2, XCircle, Activity } from 'lucide-react';

// Tipagem da Requisição
type Priority = 'EMERGENCY' | 'URGENT' | 'NORMAL';

interface LandingRequest {
  id: string;
  callsign: string;
  type: string;
  fuel: string;
  priority: Priority;
  requestedAt: string;
  waitTime: string;
}

// Dados Mockados (Simulando a fila da torre)
const initialRequests: LandingRequest[] = [
  { id: '1', callsign: 'TAM3345', type: 'A320', fuel: 'LOW', priority: 'EMERGENCY', requestedAt: '10:42', waitTime: '02:15' },
  { id: '2', callsign: 'COPA102', type: 'B738', fuel: 'NORMAL', priority: 'URGENT', requestedAt: '10:35', waitTime: '09:40' },
  { id: '3', callsign: 'LATAM890', type: 'B789', fuel: 'NORMAL', priority: 'NORMAL', requestedAt: '10:30', waitTime: '14:10' },
  { id: '4', callsign: 'AZUL4401', type: 'E195', fuel: 'NORMAL', priority: 'NORMAL', requestedAt: '10:28', waitTime: '16:25' },
];

export default function TowerDashboard() {
  const [requests, setRequests] = useState<LandingRequest[]>(initialRequests);

  // Função para autorizar pouso (remove da fila)
  const authorizeLanding = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
      {/* Header da Torre */}
      <header className="flex justify-between items-center mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <Radio className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tower Control <span className="text-amber-400">ATC</span></h1>
            <p className="text-xs text-slate-400 font-mono">Runway: 34L • Freq: 118.1 • Weather: CAVOK</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Pista Status</p>
            <p className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              LIVRE / CLEAR
            </p>
          </div>
        </div>
      </header>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Fila de Pouso</p>
            <p className="text-3xl font-bold text-white font-mono">{requests.length}</p>
          </div>
          <PlaneLanding className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Emergências</p>
            <p className="text-3xl font-bold text-red-400 font-mono">
              {requests.filter(r => r.priority === 'EMERGENCY').length}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Tempo Médio Espera</p>
            <p className="text-3xl font-bold text-white font-mono">10:45</p>
          </div>
          <Clock className="w-8 h-8 text-slate-500" />
        </div>
      </div>

      {/* Lista de Requisições (Priority Queue) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" /> Landing Requests Queue
        </h2>
        
        {requests.length === 0 ? (
          <div className="bg-[#111827] border border-slate-700/60 border-dashed rounded-xl p-12 text-center text-slate-500 font-mono">
            Nenhuma aeronave na fila de espera.
          </div>
        ) : (
          requests.map((req, index) => (
            <div 
              key={req.id} 
              className={`relative overflow-hidden bg-[#111827] border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all
                ${req.priority === 'EMERGENCY' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                  req.priority === 'URGENT' ? 'border-amber-500/50' : 'border-slate-700/60'}`}
            >
              {/* Indicador visual de prioridade lateral */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                ${req.priority === 'EMERGENCY' ? 'bg-red-500' : 
                  req.priority === 'URGENT' ? 'bg-amber-500' : 'bg-slate-600'}`}>
              </div>

              {/* Posição na fila */}
              <div className="flex items-center justify-center w-12 h-12 bg-[#0f172a] rounded-full border border-slate-700 font-mono text-xl font-bold text-slate-300 ml-2">
                {index + 1}
              </div>

              {/* Dados do Voo */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-white font-mono">{req.callsign}</h3>
                  <span className="text-sm text-slate-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700">{req.type}</span>
                  {req.priority === 'EMERGENCY' && (
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> MAYDAY
                    </span>
                  )}
                  {req.priority === 'URGENT' && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                      URGENT
                    </span>
                  )}
                </div>
                <div className="flex gap-6 text-sm text-slate-400 font-mono mt-2">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Wait: <strong className="text-white">{req.waitTime}</strong></span>
                  <span>Fuel: <strong className={req.fuel === 'LOW' ? 'text-red-400' : 'text-emerald-400'}>{req.fuel}</strong></span>
                  <span>Req at: {req.requestedAt}</span>
                </div>
              </div>

              {/* Ações do Controlador */}
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => authorizeLanding(req.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg font-bold text-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> CLEAR TO LAND
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg font-bold text-sm transition-all">
                  <XCircle className="w-4 h-4" /> HOLD
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}