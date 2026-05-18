import { useState } from "react";
import { useWeddingStore } from "../store/weddingStore";

export function NovaDespesa() {
  const { adicionarDespesa } = useWeddingStore();

  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("Lua de Mel");
  const [valorTotal, setValorTotal] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [status, setStatus] = useState<"Pago" | "Pendente" | "Parcial">(
    "Pendente",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || !valorTotal) {
      return;
    }

    setLoading(true);

    const novaDespesa = {
      descricao: descricao.trim(),
      categoria,
      valorTotal: Number(valorTotal),
      valorJaPago: Number(valorPago || 0),
      statusPagamento: status,
      dataCadastro: new Date().toISOString(),
    };

    await adicionarDespesa(novaDespesa);

    // Limpar formulário
    setDescricao("");
    setValorTotal("");
    setValorPago("");
    setStatus("Pendente");

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
      <h3 className="text-xl font-semibold text-rose-900 mb-5">
        Cadastrar Nova Despesa
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Descrição *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Passagens aéreas para Bariloche"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30"
          >
            <option value="Lua de Mel">Lua de Mel</option>
            <option value="Buffet">Buffet e Bebidas</option>
            <option value="Decoração">Decoração</option>
            <option value="Trajes">Trajes e Alianças</option>
            <option value="Foto/vídeo">Foto e Vídeo</option>
            <option value="Local">Local / Cerimônia</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "Pago" | "Pendente" | "Parcial")
            }
            className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30"
          >
            <option value="Pendente">Pendente</option>
            <option value="Parcial">Pago Parcialmente</option>
            <option value="Pago">Totalmente Pago</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Valor Total (R$) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Valor Já Pago (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30"
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3.5 rounded-xl transition disabled:opacity-70"
          >
            {loading ? "Salvando..." : "Adicionar Despesa"}
          </button>
        </div>
      </form>
    </div>
  );
}
