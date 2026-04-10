import { useState } from 'react';
import { NovaDespesa } from './NovaDespesa';
import type { Despesa } from '../pages/Dashboard';

interface Props {
  despesas: Despesa[];
  onExcluir: (id: string, descricao: string) => void;
}

type FiltroStatus = 'Todos' | 'Pago' | 'Pendente' | 'Parcial';

const CATEGORIAS = ['Todas', 'Alimentação', 'Foto/vídeo', 'Local', 'Decoração', 'Música', 'Indumentária'];

export function AbaFinanceiro({ despesas, onExcluir }: Props) {
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busca, setBusca] = useState('');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const despesasFiltradas = despesas.filter((d) => {
    const matchStatus = filtroStatus === 'Todos' || d.statusPagamento === filtroStatus;
    const matchCat = filtroCategoria === 'Todas' || d.categoria === filtroCategoria;
    const matchBusca =
      d.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      d.categoria.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchCat && matchBusca;
  });

  const statusStyle: Record<string, string> = {
    Pago: 'bg-emerald-100 text-emerald-700',
    Pendente: 'bg-orange-100 text-orange-700',
    Parcial: 'bg-blue-100 text-blue-700',
  };

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition border ${
      active
        ? 'bg-rose-100 text-rose-700 border-rose-300'
        : 'bg-white text-pink-400 border-pink-100 hover:bg-rose-50 hover:text-rose-600'
    }`;

  return (
    <div className="space-y-5">
      <NovaDespesa />

      {/* Filtros */}
      <div className="space-y-3">
        {/* Busca */}
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm text-rose-900 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />

        {/* Filtro de status */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-pink-400 font-medium self-center mr-1">Status:</span>
          {(['Todos', 'Pago', 'Pendente', 'Parcial'] as FiltroStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltroStatus(f)}
              className={filterBtnClass(filtroStatus === f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Filtro de categoria */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-pink-400 font-medium self-center mr-1">Categoria:</span>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={filterBtnClass(filtroCategoria === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contador de resultados */}
      <p className="text-xs text-pink-400">
        {despesasFiltradas.length} despesa{despesasFiltradas.length !== 1 ? 's' : ''} encontrada
        {despesasFiltradas.length !== 1 ? 's' : ''}
      </p>

      {/* Tabela */}
      <div className="rounded-xl border border-pink-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[500px]">
          <thead className="bg-rose-50/50 border-b border-pink-100">
            <tr>
              {['Descrição', 'Categoria', 'Total', 'Já Pago', 'Status', 'Ações'].map((h) => (
                <th key={h} className="p-4 font-semibold text-rose-800 text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {despesasFiltradas.map((d) => (
              <tr key={d.id} className="hover:bg-rose-50/30 transition">
                <td className="p-4">
                  <span className="block font-medium text-rose-900">{d.descricao}</span>
                </td>
                <td className="p-4">
                  <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full">
                    {d.categoria}
                  </span>
                </td>
                <td className="p-4 font-medium text-rose-700">{fmt(d.valorTotal)}</td>
                <td className="p-4 text-emerald-600">{fmt(d.valorJaPago)}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusStyle[d.statusPagamento] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {d.statusPagamento}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onExcluir(d.id, d.descricao)}
                    className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {despesasFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-pink-400">
                  Nenhuma despesa encontrada com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subtotal filtrado */}
      {despesasFiltradas.length > 0 && (
        <div className="flex justify-end gap-6 text-sm text-rose-800 bg-rose-50 rounded-xl p-3 border border-pink-100">
          <span>
            <span className="text-pink-400 mr-1">Total filtrado:</span>
            <strong>{fmt(despesasFiltradas.reduce((a, d) => a + d.valorTotal, 0))}</strong>
          </span>
          <span>
            <span className="text-pink-400 mr-1">Pago:</span>
            <strong className="text-emerald-600">
              {fmt(despesasFiltradas.reduce((a, d) => a + d.valorJaPago, 0))}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}