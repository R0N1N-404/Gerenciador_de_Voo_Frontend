import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import type { PilotoCreate as PilotoCreateDTO } from '../../types/Piloto';
import { createPiloto } from '../../services/piloto/PilotoService';

export default function PilotoCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PilotoCreateDTO>({
    nome: '',
    login: '',
    senha: '',
    numeroLicenca: '',
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const onChange = (campo: keyof PilotoCreateDTO, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!form.nome || !form.login || !form.senha || !form.numeroLicenca) {
      setErro('Preencha todos os campos.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setSalvando(true);
    console.log(form);
    try {
      await createPiloto(token, form);
      navigate('/pilotos');
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ??
        'Não foi possível criar o piloto. Verifique se o login e a licença já não existem.';
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <UserPlus className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Novo <span className="text-cyan-400">Piloto</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Cadastro de piloto no sistema
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/pilotos')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111827] border border-slate-700/60 rounded-xl p-6 space-y-5"
        >
          <div>
            <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => onChange('nome', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/60"
              placeholder="Cristiano Ronaldo dos Santos Aveiro"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">
                Login
              </label>
              <input
                type="text"
                value={form.login}
                onChange={(e) => onChange('login', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/60"
                placeholder="GOAT"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">
                Senha
              </label>
              <input
                type="password"
                value={form.senha}
                onChange={(e) => onChange('senha', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/60"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">
              Número da Licença
            </label>
            <input
              type="text"
              value={form.numeroLicenca}
              onChange={(e) => onChange('numeroLicenca', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500/60"
              placeholder="12345"
            />
          </div>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-3">
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/pilotos')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0b1120] rounded-lg text-sm font-bold transition-all"
            >
              <Save className="w-4 h-4" />
              {salvando ? 'Salvando...' : 'Cadastrar Piloto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}