import { useMemo, useState } from "react";
import { useWeddingStore } from "../store/weddingStore";
import { NovaDespesa } from "./NovaDespesa";

type FiltroStatus = "Todos" | "Pago" | "Pendente" | "Parcial";

const CATEGORIAS = [
  "Todas",
  "Lua de Mel",
  "Buffet",
  "Decoração",
  "Trajes",
  "Foto/vídeo",
  "Local",
  "Música",
  "Outros",
];

export function AbaFinanceiro() {
  const { despesas, excluirDespesa } = useWeddingStore();

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const despesasFiltradas = useMemo(() => {
    return despesas.filter((d) => {
      const matchStatus =
        filtroStatus === "Todos" || d.statusPagamento === filtroStatus;
      const matchCat =
        filtroCategoria === "Todas" || d.categoria === filtroCategoria;
      const matchBusca =
        d.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        d.categoria.toLowerCase().includes(busca.toLowerCase());

      return matchStatus && matchCat && matchBusca;
    });
  }, [despesas, filtroStatus, filtroCategoria, busca]);

  const totalFiltrado = despesasFiltradas.reduce(
    (acc, d) => acc + (d.valorTotal || 0),
    0,
  );
  const pagoFiltrado = despesasFiltradas.reduce(
    (acc, d) => acc + (d.valorJaPago || 0),
    0,
  );

  const statusStyle: Record<string, string> = {
    Pago: "bg-emerald-100 text-emerald-700",
    Pendente: "bg-orange-100 text-orange-700",
    Parcial: "bg-blue-100 text-blue-700",
  };

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition border ${
      active
        ? "bg-rose-100 text-rose-700 border-rose-300"
        : "bg-white text-pink-400 border-pink-100 hover:bg-rose-50"
    }`;

  return (
    <div className="space-y-5">
      <NovaDespesa />

      {/* Filtros */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
        />

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-pink-400 font-medium self-center mr-1">
            Status:
          </span>
          {(["Todos", "Pago", "Pendente", "Parcial"] as FiltroStatus[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFiltroStatus(f)}
                className={filterBtnClass(filtroStatus === f)}
              >
                {f}
              </button>
            ),
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-pink-400 font-medium self-center mr-1">
            Categoria:
          </span>
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

      <p className="text-xs text-pink-400">
        {despesasFiltradas.length} despesa
        {despesasFiltradas.length !== 1 ? "s" : ""} encontrada
        {despesasFiltradas.length !== 1 ? "s" : ""}
      </p>

      {/* Tabela */}
      <div className="rounded-xl border border-pink-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead className="bg-rose-50/50 border-b border-pink-100">
            <tr>
              {[
                "Descrição",
                "Categoria",
                "Total",
                "Já Pago",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  className="p-4 font-semibold text-rose-800 text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {despesasFiltradas.map((d) => (
              <tr key={d.id} className="hover:bg-rose-50/30 transition">
                <td className="p-4 font-medium text-rose-900">{d.descricao}</td>
                <td className="p-4">
                  <span className="text-xs bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full">
                    {d.categoria}
                  </span>
                </td>
                <td className="p-4 font-medium text-rose-700">
                  {fmt(d.valorTotal)}
                </td>
                <td className="p-4 text-emerald-600 font-medium">
                  {fmt(d.valorJaPago)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[d.statusPagamento] || "bg-gray-100 text-gray-600"}`}
                  >
                    {d.statusPagamento}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => excluirDespesa(d.id, d.descricao)}
                    className="text-red-500 hover:text-red-600 text-xs px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {despesasFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-pink-400">
                  Nenhuma despesa encontrada com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totais Filtrados */}
      {despesasFiltradas.length > 0 && (
        <div className="flex justify-end gap-8 bg-rose-50 border border-pink-100 rounded-xl p-4 text-sm text-rose-800">
          <div>
            Total Filtrado: <strong>{fmt(totalFiltrado)}</strong>
          </div>
          <div>
            Pago:{" "}
            <strong className="text-emerald-600">{fmt(pagoFiltrado)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
