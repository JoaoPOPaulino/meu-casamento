import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { NovaDespesa } from '../components/NovaDespesa';
import { GeradorConvites } from '../components/GeradorConvite';

interface Convidado {
  id: string;
  nomeCompleto: string;
  confirmado: boolean;
  quantidadeAcompanhantes: number;
}

interface Despesa {
  id: string;
  descricao: string;
  categoria: string;
  valorTotal: number;
  valorJaPago: number;
  statusPagamento: string;
}

export function Dashboard() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState<'financeiro' | 'convidados' | 'convites'>('financeiro');

  useEffect(() => {
    const unsubConvidados = onSnapshot(collection(db, 'convidados'), (snapshot) => {
      setConvidados(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Convidado[]);
    });
    const unsubDespesas = onSnapshot(collection(db, 'despesas'), (snapshot) => {
      setDespesas(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Despesa[]);
      setLoading(false);
    });
    return () => { unsubConvidados(); unsubDespesas(); };
  }, []);

  const excluirDespesa = async (id: string, descricao: string) => {
    if (!window.confirm(`Excluir a despesa "${descricao}"?`)) return;
    try {
      await deleteDoc(doc(db, 'despesas', id));
    } catch {
      alert('Erro ao excluir despesa.');
    }
  };

  const totalConfirmados = convidados
    .filter(c => c.confirmado)
    .reduce((total, c) => total + 1 + c.quantidadeAcompanhantes, 0);

  const custoTotal = despesas.reduce((acc, d) => acc + d.valorTotal, 0);
  const totalJaPago = despesas.reduce((acc, d) => acc + d.valorJaPago, 0);
  const saldoDevedor = custoTotal - totalJaPago;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const abas = [
    { key: 'financeiro' as const, label: 'Financeiro', emoji: '💰' },
    { key: 'convidados' as const, label: 'Convidados', emoji: '👥' },
    { key: 'convites' as const, label: 'Convites', emoji: '💌' },
  ];

  return (
    <div className="min-h-screen bg-rose-50 p-4 md:p-8" style={{ fontFamily: "'Lato', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-pink-100">
          <div>
            <h1
              className="text-2xl font-bold text-rose-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Painel dos Noivos 💍
            </h1>
            <p className="text-xs text-pink-400 mt-0.5 uppercase tracking-widest">Área administrativa</p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Custo Total', value: fmt(custoTotal), color: 'rose', emoji: '📋' },
            { label: 'Já Pago', value: fmt(totalJaPago), color: 'emerald', emoji: '✅' },
            { label: 'Falta Pagar', value: fmt(saldoDevedor), color: 'orange', emoji: '⏳' },
            { label: 'Confirmados', value: loading ? '...' : String(totalConfirmados), color: 'purple', emoji: '🎉' },
          ].map(({ label, value, color, emoji }) => (
            <div
              key={label}
              className={`bg-white p-4 rounded-2xl border border-pink-100 border-l-4 border-l-${color}-400 shadow-sm`}
            >
              <p className={`text-xs text-${color}-500 uppercase font-bold tracking-wide flex items-center gap-1`}>
                <span>{emoji}</span> {label}
              </p>
              <p className={`text-2xl font-bold text-${color}-700 mt-1`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Abas de navegação */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-pink-100">
            {abas.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setAbaSelecionada(key)}
                className={`flex-1 py-3.5 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  abaSelecionada === key
                    ? 'text-rose-700 border-b-2 border-rose-500 bg-rose-50/50'
                    : 'text-pink-400 hover:text-rose-600 hover:bg-rose-50/30'
                }`}
              >
                <span>{emoji}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── ABA: FINANCEIRO ─────────────────────────── */}
            {abaSelecionada === 'financeiro' && (
              <div className="space-y-6">
                <NovaDespesa />
                <div className="rounded-xl border border-pink-100 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[400px]">
                    <thead className="bg-rose-50/50 border-b border-pink-100">
                      <tr>
                        {['Descrição', 'Total', 'Status', 'Ações'].map(h => (
                          <th key={h} className="p-4 font-semibold text-rose-800">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50">
                      {despesas.map((d) => (
                        <tr key={d.id} className="hover:bg-rose-50/30 transition">
                          <td className="p-4">
                            <span className="block font-medium text-rose-900">{d.descricao}</span>
                            <span className="text-xs text-pink-400">{d.categoria}</span>
                          </td>
                          <td className="p-4 font-medium text-rose-700">{fmt(d.valorTotal)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.statusPagamento === 'Pago' ? 'bg-emerald-100 text-emerald-700' :
                              d.statusPagamento === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {d.statusPagamento}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => excluirDespesa(d.id, d.descricao)}
                              className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                      {despesas.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-pink-400">
                            Nenhuma despesa cadastrada ainda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ABA: CONVIDADOS ──────────────────────────── */}
            {abaSelecionada === 'convidados' && (
              <div className="rounded-xl border border-pink-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[300px]">
                  <thead className="bg-rose-50/50 border-b border-pink-100">
                    <tr>
                      <th className="p-4 font-semibold text-rose-800">Nome</th>
                      <th className="p-4 font-semibold text-rose-800">Acomp.</th>
                      <th className="p-4 font-semibold text-rose-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    {convidados.map((c) => (
                      <tr key={c.id} className="hover:bg-rose-50/30 transition">
                        <td className="p-4 text-rose-900 font-medium">{c.nomeCompleto}</td>
                        <td className="p-4 text-rose-700 text-center">
                          {c.confirmado ? c.quantidadeAcompanhantes : '—'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.confirmado ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {c.confirmado ? 'Confirmado' : 'Não vai'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {convidados.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-pink-400">
                          Nenhum convidado respondeu ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── ABA: CONVITES ────────────────────────────── */}
            {abaSelecionada === 'convites' && (
              <GeradorConvites />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}