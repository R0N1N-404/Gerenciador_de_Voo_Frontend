import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Search,
} from 'lucide-react';
import type { PilotoResponse } from '../../types/Piloto';
import { deletePiloto, getPilotos } from '../../services/piloto/PilotoService';

const formatarData = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR');
};

export default function PilotoList() {
  const [pilotos, setPilotos] = useState<PilotoResponse[]>([]);
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
        const dados = await getPilotos(token);
        console.log(dados);
        setPilotos(dados);
      } catch (e) {
        console.error(e);
        setErro('Não foi possível carregar os pilotos.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [navigate, token]);

  const handleDeletar = async (piloto: PilotoResponse) => {
    if (!token) return;
    const confirmado = window.confirm(
      `Deseja realmente excluir o piloto ${piloto.nome}?`,
    );
    if (!confirmado) return;

    try {
      await deletePiloto(token, piloto.id);
      setPilotos((prev) => prev.filter((p) => p.id !== piloto.id));
    } catch (e) {
      console.error(e);
      alert('Não foi possível excluir o piloto.');
    }
  };

  const filtrados = pilotos.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      p.login.toLowerCase().includes(termo) ||
      p.numeroLicenca.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Pilotos <span className="text-cyan-400">Cadastrados</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Total: {pilotos.length}
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
              onClick={() => navigate('/piloto/criar')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] rounded-lg text-sm font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Novo Piloto
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
            placeholder="Buscar por nome, login ou licença..."
            className="w-full bg-[#111827] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        {/* Tabela */}
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-slate-500 font-mono">
              Carregando pilotos...
            </div>
          ) : erro ? (
            <div className="p-12 text-center text-red-400 font-mono">{erro}</div>
          ) : filtrados.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono">
              Nenhum piloto encontrado.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#0f172a] border-b border-slate-700/60">
                <tr className="text-left text-xs uppercase text-slate-400 tracking-wider">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Login</th>
                  <th className="px-4 py-3">Licença</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-700/40 last:border-0 hover:bg-[#0f172a]/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-400">
                      #{p.id}
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">
                      {p.nome}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {p.login}
                    </td>
                    <td className="px-4 py-3 font-mono text-cyan-400">
                      {p.numeroLicenca}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono">
                      {formatarData(p.criado_em)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/piloto/editar/${p.id}`)}
                          className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletar(p)}
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