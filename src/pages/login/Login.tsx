import React, { useState } from 'react';
import { Plane, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Login } from '../../services/login/Login';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await Login({
            login: email,
            senha: password,
        });
        
        if(response.tipo == "PILOTO"){
          navigate("/pilotoDashboard");
        }else if(response.tipo == "TORRE"){
          navigate("/torreDashboard");
        }
    } catch (error) {
        console.error(error);
    }
};

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans flex items-center justify-center relative overflow-hidden">
      
      {/* Fundo decorativo (Gradiente sutil para não ficar 100% plano) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-[#0b1120] to-[#0b1120]"></div>

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-md p-8">
        
        {/* Cabeçalho / Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#1e293b] rounded-lg border border-slate-700">
              <Plane className="w-8 h-8 text-cyan-400 rotate-45" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Airport<span className="text-cyan-400">COCKPIT</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 font-mono uppercase tracking-widest mt-2">
            System Access
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-[#111827]/80 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-2xl p-8">
          
          {/* Status do Sistema (Mimetizando o header do print) */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">System Online</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">UTC 07:45</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Campo Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Operational ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0f172a] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm"
                  placeholder="operator@airport.com"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Access Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0f172a] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Opções Extras */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-300">
                <input type="checkbox" className="mr-2 rounded border-slate-700 bg-[#0f172a] text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0" />
                Remember Device
              </label>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Reset Access?
              </a>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#0b1120] bg-cyan-500 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827] focus:ring-cyan-500 transition-all duration-200"
            >
              INITIATE SESSION
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Rodapé do Card */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Restricted Access • CAT III Certified</span>
          </div>
        </div>

        {/* Footer Global */}
        <div className="mt-8 text-center text-xs text-slate-600 font-mono">
          <p>© 2026 AirportCOCKPIT System v2.4.1</p>
        </div>
      </div>
    </div>
  );
}