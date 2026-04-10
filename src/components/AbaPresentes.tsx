import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Presente } from '../pages/Dashboard';

interface Props {
  presentes: Presente[];
}

type FiltroPresente = 'Todos' | 'Recebido' | 'Na lista';

export function AbaPresentes({ presentes }: Props) {
  const [filtro, setFiltro] = useState<FiltroPresente>('Todos');
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    quem: '',
    status: 'Na lista' as 'Recebido' | 'Na lista',
    valor: 0,
  });

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const totalRecebidos = presentes.filter((p) => p.status === 'Recebido').length;
  const totalNaLista = presentes.filter((p) => p.status === 'Na lista').length;
  const valorEstimado = presentes.reduce((acc, p) => acc + p.valor, 0);

  const presentesFiltrados = presentes.filter((p) => {
    const matchFiltro = filtro === 'Todos' || p.status === filtro;
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.quem.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const salvar = async () => {
    if (!form.nome.trim()) return alert('Informe o nome do presente.');
    try {
      await addDoc(collection(db, 'presentes'), { ...form });
      setForm({ nome: '', quem: '', status: 'Na lista', valor: 0 });
      setMostrarForm(false);
    } catch {
      alert('Erro ao salvar presente.');
    }
  };

  const excluir = async (id: string, nome: string) => {
    if (!window.confirm(`Excluir "${nome}" da lista?`)) return;
    try {
      await deleteDoc(doc(db, 'presentes', id));
    } catch {
      alert('Erro ao excluir presente.');
    }
  };

  const marcarRecebido = async (p: Presente) => {
    try {
      await updateDoc(doc(db, 'presentes', p.id), {
        status: p.status === 'Recebido' ? 'Na lista' : 'Recebido',
      });
    } catch {
      alert('Erro ao atualizar presente.');
    }
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
          { label: 'Na lista', value: totalNaLista, color: 'purple' },
          { label: 'Recebidos', value: totalRecebidos, color: 'emerald' },
          { label: 'Valor estimado', value: fmt(valorEstimado), color: 'rose' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold text-${color}-700`}>{value}</p>
            <p className={`text-xs text-${color}-500 mt-0.5`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Busca e filtros */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar presente ou presenteador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 border border-pink-100 rounded-xl px-4 py-2.5 text-sm text-rose-900 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            + Adicionar
          </button>
        </div>
        <div className="flex gap-2">
          {(['Todos', 'Recebido', 'Na lista'] as FiltroPresente[]).map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className={filterBtnClass(filtro === f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-rose-50 border border-pink-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-rose-800 text-sm">Adicionar presente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Nome do presente *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Ex: Jogo de panelas"
              />
            </div>
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Presenteado por</label>
              <input
                type="text"
                value={form.quem}
                onChange={(e) => setForm({ ...form, quem: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Nome do convidado (opcional)"
              />
            </div>
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Valor estimado (R$)</label>
              <input
                type="number"
                min={0}
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="text-xs text-pink-500 font-medium block mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'Recebido' | 'Na lista' })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="Na lista">Na lista</option>
                <option value="Recebido">Recebido</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setMostrarForm(false)}
              className="text-pink-400 text-sm px-4 py-2 rounded-xl border border-pink-100 hover:bg-rose-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Lista de presentes */}
      <div className="space-y-2">
        {presentesFiltrados.length === 0 && (
          <p className="text-center text-pink-400 py-8">Nenhum presente encontrado.</p>
        )}
        {presentesFiltrados.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-white border border-pink-100 rounded-xl px-4 py-3 hover:bg-rose-50/30 transition"
          >
            <div className="flex items-center gap-3">
              {/* Checkbox visual de recebido */}
              <button
                onClick={() => marcarRecebido(p)}
                title={p.status === 'Recebido' ? 'Marcar como pendente' : 'Marcar como recebido'}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                  p.status === 'Recebido'
                    ? 'bg-emerald-400 border-emerald-400 text-white'
                    : 'border-pink-200 hover:border-rose-400'
                }`}
              >
                {p.status === 'Recebido' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div>
                <p className={`font-medium text-sm ${p.status === 'Recebido' ? 'line-through text-pink-300' : 'text-rose-900'}`}>
                  {p.nome}
                </p>
                {p.quem && (
                  <p className="text-xs text-pink-400">
                    {p.status === 'Recebido' ? 'Presenteado por' : 'Sugerido por'} {p.quem}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {p.valor > 0 && (
                <span className="text-sm font-medium text-rose-600">{fmt(p.valor)}</span>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.status === 'Recebido' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {p.status}
              </span>
              <button
                onClick={() => excluir(p.id, p.nome)}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}