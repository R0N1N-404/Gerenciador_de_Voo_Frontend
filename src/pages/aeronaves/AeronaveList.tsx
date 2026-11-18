import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Plus, Pencil, Trash2, ArrowLeft, Search } from 'lucide-react';
import type { AeronaveResponse } from '../../types/Aeronave';
import {
  deleteAeronave,
  getAeronaves,
} from '../../services/aeronave/aeronaveService';

export default function AeronaveList() {
  const [aeronaves, setAeronaves] = useState<AeronaveResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function carregar() {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const dados = await getAeronaves(token);
        setAeronaves(dados);
      } catch (e) {
        console.error(e);
        setErro('Não foi possível carregar as aeronaves.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [navigate, token]);

  const handleDeletar = async (aeronave: AeronaveResponse) => {
    if (!token) return;
    const confirmado = window.confirm(
      `Deseja realmente excluir a aeronave ${aeronave.prefixo}?`,
    );
    if (!confirmado) return;

    try {
      await deleteAeronave(token, aeronave.id);
      setAeronaves((prev) => prev.filter((a) => a.id !== aeronave.id));
    } catch (e) {
      console.error(e);
      alert('Não foi possível excluir a aeronave.');
    }
  };

  const filtrados = aeronaves.filter((a) => {
    const termo = busca.toLowerCase();
    return (
      a.prefixo.toLowerCase().includes(termo) ||
      a.modelo.toLowerCase().includes(termo) ||
      a.companhia.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <Plane className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Aeronaves <span className="text-amber-400">Cadastradas</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Total: {aeronaves.length}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/tower')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button
              onClick={() => navigate('/aeronave/criar/')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0b1120] rounded-lg text-sm font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Nova Aeronave
            </button>
          </div>
        </header>

        {/* Busca */}
        <div className="mb-4 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por prefixo, modelo ou companhia..."
            className="w-full bg-[#111827] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Tabela */}
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-slate-500 font-mono">
              Carregando aeronaves...
            </div>
          ) : erro ? (
            <div className="p-12 text-center text-red-400 font-mono">
              {erro}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono">
              Nenhuma aeronave encontrada.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#0f172a] border-b border-slate-700/60">
                <tr className="text-left text-xs uppercase text-slate-400 tracking-wider">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Prefixo</th>
                  <th className="px-4 py-3">Modelo</th>
                  <th className="px-4 py-3">Companhia</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-700/40 last:border-0 hover:bg-[#0f172a]/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-400">
                      #{a.id}
                    </td>
                    <td className="px-4 py-3 font-mono text-amber-400 font-bold">
                      {a.prefixo}
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">
                      {a.modelo}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{a.companhia}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/aeronave/editar/${a.id}`)}
                          className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletar(a)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
