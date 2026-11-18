import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plane, ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { AeronaveUpdate } from '../../types/Aeronave';
import {
  getAeronaveById,
  updateAeronave,
} from '../../services/aeronave/aeronaveService';

export default function AeronaveEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const aeronaveId = Number(id);

  const [form, setForm] = useState<AeronaveUpdate>({
    prefixo: '',
    modelo: '',
    companhia: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    async function carregar() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      if (Number.isNaN(aeronaveId)) {
        setNaoEncontrado(true);
        setCarregando(false);
        return;
      }

      try {
        const aeronave = await getAeronaveById(token, aeronaveId);
        setForm({
          prefixo: aeronave.prefixo,
          modelo: aeronave.modelo,
          companhia: aeronave.companhia,
        });
      } catch (e) {
        console.error(e);
        setNaoEncontrado(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [navigate, aeronaveId]);

  const onChange = (campo: keyof AeronaveUpdate, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!form.prefixo || !form.modelo || !form.companhia) {
      setErro('Preencha todos os campos.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setSalvando(true);
    try {
      await updateAeronave(token, aeronaveId, form);
      navigate('/aeronaves');
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ??
        'Não foi possível atualizar a aeronave. Verifique se o prefixo já não pertence a outra aeronave.';
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando aeronave...
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
              Aeronave não encontrada.
            </p>
            <button
              onClick={() => navigate('/aeronaves')}
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
              <Plane className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Editar <span className="text-amber-400">Aeronave</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                ID: #{aeronaveId}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/aeronaves')}
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
              Prefixo
            </label>
            <input
              type="text"
              value={form.prefixo}
              onChange={(e) => onChange('prefixo', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500/60"
              placeholder="PT-ABC"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={form.modelo}
                onChange={(e) => onChange('modelo', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                placeholder="A320"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">
                Companhia
              </label>
              <input
                type="text"
                value={form.companhia}
                onChange={(e) => onChange('companhia', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                placeholder="LATAM"
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-3">
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/aeronaves')}
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
