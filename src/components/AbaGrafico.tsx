import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { Despesa } from '../pages/Dashboard';

interface Props {
  despesas: Despesa[];
  custoTotal: number;
  totalJaPago: number;
  percentualPago: number;
}

const CORES_CATEGORIAS = [
  '#f43f5e',
  '#a855f7',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#6366f1',
];

const MESES_MOCK = [
  { mes: 'Jan', pago: 3000 },
  { mes: 'Fev', pago: 8000 },
  { mes: 'Mar', pago: 12000 },
  { mes: 'Abr', pago: 18000 },
  { mes: 'Mai', pago: 24000 },
  { mes: 'Jun', pago: 31200 },
];

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #fce7f3',
  borderRadius: '12px',
  fontSize: '13px',
};

// Recebe unknown para ser compatível com qualquer versão do Recharts
function fmtValor(v: unknown): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    typeof v === 'number' ? v : 0
  );
}

export function AbaGraficos({ despesas, custoTotal, totalJaPago, percentualPago }: Props) {
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const porCategoria = Object.values(
    despesas.reduce<Record<string, { name: string; value: number }>>((acc, d) => {
      if (!acc[d.categoria]) acc[d.categoria] = { name: d.categoria, value: 0 };
      acc[d.categoria].value += d.valorTotal;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-8">

      {/* Progresso geral */}
      <div className="bg-rose-50 rounded-2xl border border-pink-100 p-5">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-pink-400 font-semibold">
              Progresso de pagamento
            </p>
            <p className="text-2xl font-bold text-rose-700 mt-0.5">{percentualPago}% quitado</p>
          </div>
          <div className="text-right text-sm text-rose-700">
            <p>{fmt(totalJaPago)} pago</p>
            <p className="text-pink-400 text-xs">de {fmt(custoTotal)}</p>
          </div>
        </div>
        <div className="w-full bg-white rounded-full h-3 border border-pink-100">
          <div
            className="bg-rose-400 h-3 rounded-full transition-all duration-700"
            style={{ width: `${percentualPago}%` }}
          />
        </div>
        <p className="text-xs text-pink-400 mt-2">
          Faltam {fmt(custoTotal - totalJaPago)} para quitar tudo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Gráfico de pizza */}
        <div>
          <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wide mb-4">
            Gastos por categoria
          </h3>
          {porCategoria.length === 0 ? (
            <p className="text-pink-400 text-sm">Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={porCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {porCategoria.map((_, i) => (
                      <Cell key={i} fill={CORES_CATEGORIAS[i % CORES_CATEGORIAS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [fmtValor(value), String(name)]}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {porCategoria.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-1.5 text-xs text-rose-700">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-sm"
                      style={{ background: CORES_CATEGORIAS[i % CORES_CATEGORIAS.length] }}
                    />
                    {cat.name}
                    <span className="text-pink-400">
                      {Math.round((cat.value / custoTotal) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Gráfico de linha */}
        <div>
          <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wide mb-4">
            Pagamentos ao longo do tempo
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MESES_MOCK} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: '#f9a8d4' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#f9a8d4' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `R$${Math.round(v / 1000)}k`}
              />
              <Tooltip
                formatter={(value) => [fmtValor(value), 'Pago']}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="pago"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-pink-300 mt-2 text-center">
            * Dados mensais — conecte ao Firestore para valores reais
          </p>
        </div>
      </div>

      {/* Tabela por categoria */}
      <div>
        <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wide mb-3">
          Resumo por categoria
        </h3>
        <div className="rounded-xl border border-pink-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-rose-50/60 text-xs uppercase tracking-wide text-rose-700">
              <tr>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">% do orçamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {[...porCategoria]
                .sort((a, b) => b.value - a.value)
                .map((cat, i) => (
                  <tr key={cat.name} className="hover:bg-rose-50/30 transition">
                    <td className="p-3 flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ background: CORES_CATEGORIAS[i % CORES_CATEGORIAS.length] }}
                      />
                      {cat.name}
                    </td>
                    <td className="p-3 text-right font-medium text-rose-700">{fmt(cat.value)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-rose-100 rounded-full h-1.5">
                          <div
                            className="bg-rose-400 h-1.5 rounded-full"
                            style={{ width: `${Math.round((cat.value / custoTotal) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-pink-500 w-8 text-right">
                          {Math.round((cat.value / custoTotal) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}