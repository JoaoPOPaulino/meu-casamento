import { useMemo, useState } from 'react';
import { useWeddingStore } from '../store/weddingStore';
import type { Convidado } from '../types';

type FiltroStatus = 'Todos' | 'Confirmado' | 'Não vai';

const RESTRICOES = ['—', 'Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose', 'Outra'];

export function AbaConvidados() {
  const { 
    convidados, 
    adicionarConvidado, 
    atualizarConvidado, 
    excluirConvidado 
  } = useWeddingStore();

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('Todos');
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Convidado | null>(null);

  const [form, setForm] = useState({
    nomeCompleto: '',
    confirmado: false,
    quantidadeAcompanhantes: 0,
    mesa: 1,
    restricaoAlimentar: '—' as string,
  });

  const convidadosFiltrados = useMemo(() => {
    return convidados.filter((c) => {
      const matchStatus =
        filtroStatus === 'Todos' ||
        (filtroStatus === 'Confirmado' && c.confirmado) ||
        (filtroStatus === 'Não vai' && !c.confirmado);

      const matchBusca = c.nomeCompleto.toLowerCase().includes(busca.toLowerCase());
      return matchStatus && matchBusca;
    });
  }, [convidados, filtroStatus, busca]);

  const abrirNovo = () => {
    setEditando(null);
    setForm({
      nomeCompleto: '',
      confirmado: false,
      quantidadeAcompanhantes: 0,
      mesa: 1,
      restricaoAlimentar: '—',
    });
    setMostrarForm(true);
  };

  const abrirEdicao = (c: Convidado) => {
    setEditando(c);
    setForm({
      nomeCompleto: c.nomeCompleto,
      confirmado: c.confirmado,
      quantidadeAcompanhantes: c.quantidadeAcompanhantes,
      mesa: c.mesa ?? 1,
      restricaoAlimentar: c.restricaoAlimentar ?? '—',
    });
    setMostrarForm(true);
  };

  const salvar = async () => {
    if (!form.nomeCompleto.trim()) return;

    if (editando) {
      await atualizarConvidado(editando.id, form);
    } else {
      await adicionarConvidado(form);
    }

    setMostrarForm(false);
  };

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition border ${
      active
        ? 'bg-rose-100 text-rose-700 border-rose-300'
        : 'bg-white text-pink-400 border-pink-100 hover:bg-rose-50'
    }`;

  return (
    <div className="space-y-5">
      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Confirmados', value: convidados.filter(c => c.confirmado).reduce((t, c) => t + 1 + c.quantidadeAcompanhantes, 0), color: 'emerald' },
          { label: 'Não vão', value: convidados.filter(c => !c.confirmado).length, color: 'rose' },
          { label: 'Total cadastrados', value: convidados.length, color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className={`text-xs text-${color}-500 mt-0.5`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Busca e Filtros */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar convidado..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <button
            onClick={abrirNovo}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            + Adicionar
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['Todos', 'Confirmado', 'Não vai'] as FiltroStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltroStatus(f)}
              className={filterBtnClass(filtroStatus === f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-rose-50 border border-pink-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-rose-800">
            {editando ? 'Editar Convidado' : 'Novo Convidado'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Nome completo *</label>
              <input
                type="text"
                value={form.nomeCompleto}
                onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Mesa</label>
              <input
                type="number"
                min={1}
                value={form.mesa}
                onChange={(e) => setForm({ ...form, mesa: Number(e.target.value) })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Acompanhantes</label>
              <input
                type="number"
                min={0}
                value={form.quantidadeAcompanhantes}
                onChange={(e) => setForm({ ...form, quantidadeAcompanhantes: Number(e.target.value) })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Restrição alimentar</label>
              <select
                value={form.restricaoAlimentar}
                onChange={(e) => setForm({ ...form, restricaoAlimentar: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-rose-200"
              >
                {RESTRICOES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.confirmado}
              onChange={(e) => setForm({ ...form, confirmado: e.target.checked })}
              className="accent-rose-500 w-4 h-4"
            />
            <label className="text-sm text-rose-700">Confirmou presença</label>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setMostrarForm(false)}
              className="px-5 py-2 text-pink-400 hover:bg-rose-50 rounded-xl border border-pink-100"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-semibold"
            >
              {editando ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-xl border border-pink-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-rose-50/70 border-b border-pink-100">
            <tr>
              {['Nome', 'Mesa', 'Acomp.', 'Restrição', 'Status', 'Ações'].map(h => (
                <th key={h} className="p-4 text-xs font-semibold text-rose-800 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {convidadosFiltrados.map((c) => (
              <tr key={c.id} className="hover:bg-rose-50/50 transition">
                <td className="p-4 font-medium text-rose-900">{c.nomeCompleto}</td>
                <td className="p-4 text-center text-rose-700">{c.mesa ?? '—'}</td>
                <td className="p-4 text-center text-rose-700">
                  {c.confirmado ? c.quantidadeAcompanhantes : '—'}
                </td>
                <td className="p-4 text-pink-500 text-sm">{c.restricaoAlimentar ?? '—'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.confirmado ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {c.confirmado ? 'Confirmado' : 'Não vai'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirEdicao(c)}
                      className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-xs transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirConvidado(c.id, c.nomeCompleto)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-xs transition"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {convidadosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-pink-400">
                  Nenhum convidado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}