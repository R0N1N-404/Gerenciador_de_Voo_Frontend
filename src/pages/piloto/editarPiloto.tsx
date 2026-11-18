import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserCog,
  ArrowLeft,
  Save,
  Loader2,
  KeyRound,
} from 'lucide-react';
import type { PilotoUpdate } from '../../types/Piloto';
import { getPilotoById, updatePiloto } from '../../services/piloto/PilotoService';

export default function PilotoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pilotoId = Number(id);

  const [form, setForm] = useState<PilotoUpdate>({
    nome: '',
    login: '',
    numeroLicenca: '',
    senha: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Carrega os dados do piloto
  useEffect(() => {
    async function carregar() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      if (Number.isNaN(pilotoId)) {
        setNaoEncontrado(true);
        setCarregando(false);
        return;
      }

      try {
        const piloto = await getPilotoById(token, pilotoId);
        setForm({
          nome: piloto.nome,
          login: piloto.login,
          numeroLicenca: piloto.numeroLicenca,
          senha: '',
        });
      } catch (e) {
        console.error(e);
        setNaoEncontrado(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [navigate, pilotoId]);

  const onChange = (campo: keyof PilotoUpdate, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!form.nome || !form.login || !form.numeroLicenca) {
      setErro('Nome, login e número de licença são obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    // Remove a senha se estiver vazia (mantém a atual no backend)
    const payload: PilotoUpdate = {
      nome: form.nome,
      login: form.login,
      numeroLicenca: form.numeroLicenca,
      ...(form.senha ? { senha: form.senha } : {}),
    };

    setSalvando(true);
    try {
      await updatePiloto(token, pilotoId, payload);
      navigate('/pilotos');
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ??
        'Não foi possível atualizar o piloto. Verifique se o login e a licença já não pertencem a outro piloto.';
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Estados de carregamento / não encontrado
  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando piloto...
        </div>
      </div>
    );
  }

  if (naoEncontrado) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-[#111827] border border-red-500/40 rounded-xl p-12 text-center">
            <p className="text-red-400 font-bold mb-4">
              Piloto não encontrado.
            </p>
            <button
              onClick={() => navigate('/pilotos')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para a lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-[#111827] p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <UserCog className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Editar <span className="text-amber-400">Piloto</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Protocolo: #{pilotoId}
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
                Nova senha
                <span className="text-slate-500 normal-case ml-1">
                  (deixe vazio para manter)
                </span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={form.senha ?? ''}
                  onChange={(e) => onChange('senha', e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/60"
                  placeholder="••••••••"
                />
              </div>
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
              placeholder="ANAC-12345"
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
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0b1120] rounded-lg text-sm font-bold transition-all"
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}