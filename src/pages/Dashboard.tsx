import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { GeradorConvites } from "../components/GeradorConvite";
import { AbaPresentes } from "../components/AbaPresentes";
import { AbaConvidados } from "../components/AbaConvidados";
import { AbaFinanceiro } from "../components/AbaFinanceiro";
import { AbaGraficos } from "../components/AbaGrafico";

export interface Convidado {
  id: string;
  nomeCompleto: string;
  confirmado: boolean;
  quantidadeAcompanhantes: number;
  mesa?: number;
  restricaoAlimentar?: string;
}

export interface Despesa {
  id: string;
  descricao: string;
  categoria: string;
  valorTotal: number;
  valorJaPago: number;
  statusPagamento: "Pago" | "Pendente" | "Parcial";
}

export interface Presente {
  id: string;
  nome: string;
  quem: string;
  status: "Recebido" | "Na lista";
  valor: number;
}

export function Dashboard() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState<
    "financeiro" | "graficos" | "convidados" | "presentes" | "convites"
  >("financeiro");

  useEffect(() => {
    const unsubConvidados = onSnapshot(collection(db, "convidados"), (snap) => {
      setConvidados(
        snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Convidado[],
      );
    });
    const unsubDespesas = onSnapshot(collection(db, "despesas"), (snap) => {
      setDespesas(
        snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Despesa[],
      );
      setLoading(false);
    });
    const unsubPresentes = onSnapshot(collection(db, "presentes"), (snap) => {
      setPresentes(
        snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Presente[],
      );
    });
    return () => {
      unsubConvidados();
      unsubDespesas();
      unsubPresentes();
    };
  }, []);

  const excluirDespesa = async (id: string, descricao: string) => {
    if (!window.confirm(`Excluir a despesa "${descricao}"?`)) return;
    try {
      await deleteDoc(doc(db, "despesas", id));
    } catch {
      alert("Erro ao excluir despesa.");
    }
  };

  const totalConfirmados = convidados
    .filter((c) => c.confirmado)
    .reduce((total, c) => total + 1 + c.quantidadeAcompanhantes, 0);

  const custoTotal = despesas.reduce((acc, d) => acc + d.valorTotal, 0);
  const totalJaPago = despesas.reduce((acc, d) => acc + d.valorJaPago, 0);
  const saldoDevedor = custoTotal - totalJaPago;
  const percentualPago =
    custoTotal > 0 ? Math.round((totalJaPago / custoTotal) * 100) : 0;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const abas = [
    { key: "financeiro" as const, label: "Financeiro", emoji: "💰" },
    { key: "graficos" as const, label: "Gráficos", emoji: "📊" },
    { key: "convidados" as const, label: "Convidados", emoji: "👥" },
    { key: "presentes" as const, label: "Presentes", emoji: "🎁" },
    { key: "convites" as const, label: "Convites", emoji: "💌" },
  ];

  const summaryCards = [
    {
      label: "Custo Total",
      value: fmt(custoTotal),
      sub: `${despesas.length} despesas`,
      color: "rose",
      emoji: "📋",
    },
    {
      label: "Já Pago",
      value: fmt(totalJaPago),
      sub: `${percentualPago}% do total`,
      color: "emerald",
      emoji: "✅",
    },
    {
      label: "Falta Pagar",
      value: fmt(saldoDevedor),
      sub: `${100 - percentualPago}% restante`,
      color: "orange",
      emoji: "⏳",
    },
    {
      label: "Confirmados",
      value: loading ? "..." : String(totalConfirmados),
      sub: `de ${convidados.length} convidados`,
      color: "purple",
      emoji: "🎉",
    },
  ];

  return (
    <div
      className="min-h-screen bg-rose-50 p-4 md:p-8"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
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
            <p className="text-xs text-pink-400 mt-0.5 uppercase tracking-widest">
              Área administrativa
            </p>
          </div>
          {/* Contagem regressiva simples */}
          <CountdownBadge weddingDate="2025-12-14" />
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map(({ label, value, sub, color, emoji }) => (
            <div
              key={label}
              className={`bg-white p-4 rounded-2xl border border-pink-100 shadow-sm overflow-hidden relative`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-${color}-400 rounded-t-2xl`}
              />
              <p
                className={`text-xs text-${color}-500 uppercase font-bold tracking-wide flex items-center gap-1 mt-1`}
              >
                <span>{emoji}</span> {label}
              </p>
              <p className={`text-2xl font-bold text-${color}-700 mt-1`}>
                {value}
              </p>
              <p className={`text-xs text-${color}-400 mt-0.5`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Barra de progresso global */}
        <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm">
          <div className="flex justify-between text-xs text-pink-500 font-medium mb-1.5">
            <span>Progresso de pagamento</span>
            <span>{percentualPago}%</span>
          </div>
          <div className="w-full bg-rose-100 rounded-full h-2">
            <div
              className="bg-rose-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentualPago}%` }}
            />
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-pink-100 overflow-x-auto">
            {abas.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setAbaSelecionada(key)}
                className={`flex-1 py-3.5 text-sm font-semibold transition flex items-center justify-center gap-2 whitespace-nowrap px-3 ${
                  abaSelecionada === key
                    ? "text-rose-700 border-b-2 border-rose-500 bg-rose-50/50"
                    : "text-pink-400 hover:text-rose-600 hover:bg-rose-50/30"
                }`}
              >
                <span>{emoji}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {abaSelecionada === "financeiro" && (
              <AbaFinanceiro despesas={despesas} onExcluir={excluirDespesa} />
            )}
            {abaSelecionada === "graficos" && (
              <AbaGraficos
                despesas={despesas}
                custoTotal={custoTotal}
                totalJaPago={totalJaPago}
                percentualPago={percentualPago}
              />
            )}
            {abaSelecionada === "convidados" && (
              <AbaConvidados convidados={convidados} />
            )}
            {abaSelecionada === "presentes" && (
              <AbaPresentes presentes={presentes} />
            )}
            {abaSelecionada === "convites" && <GeradorConvites />}
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownBadge({ weddingDate }: { weddingDate: string }) {
  const days = Math.ceil(
    (new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (days < 0) return null;
  return (
    <div className="text-center bg-rose-50 border border-pink-100 rounded-xl px-4 py-2">
      <p className="text-2xl font-bold text-rose-700">{days}</p>
      <p className="text-xs text-pink-400 uppercase tracking-wide">
        dias para o sim
      </p>
    </div>
  );
}
