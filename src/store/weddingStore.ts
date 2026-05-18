import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { db } from "../config/firebase";
import type { Convidado, Convite, Despesa, Presente } from "../types";

interface WeddingState {
  convidados: Convidado[];
  despesas: Despesa[];
  presentes: Presente[];
  convites: Convite[];
  loading: boolean;

  setConvidados: (data: Convidado[]) => void;
  setDespesas: (data: Despesa[]) => void;
  setPresentes: (data: Presente[]) => void;
  setConvites: (data: Convite[]) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  totalConfirmados: number;
  custoTotal: number;
  totalJaPago: number;
  percentualPago: number;
  saldoDevedor: number;

  // === CRUD Convidado ===
  adicionarConvidado: (novo: Omit<Convidado, "id">) => Promise<void>;
  atualizarConvidado: (id: string, dados: Partial<Convidado>) => Promise<void>;
  excluirConvidado: (id: string, nome: string) => Promise<void>;

  // === CRUD Despesa ===
  adicionarDespesa: (nova: Omit<Despesa, "id">) => Promise<void>;
  excluirDespesa: (id: string, descricao: string) => Promise<void>;

  // === CRUD Presente ===
  adicionarPresente: (novo: Omit<Presente, "id">) => Promise<void>;
  atualizarPresente: (id: string, dados: Partial<Presente>) => Promise<void>;
  excluirPresente: (id: string, nome: string) => Promise<void>;
}

export const useWeddingStore = create<WeddingState>()(
  subscribeWithSelector((set) => ({
    convidados: [],
    despesas: [],
    presentes: [],
    convites: [],
    loading: true,

    setConvidados: (data) => set({ convidados: data }),
    setDespesas: (data) => set({ despesas: data }),
    setPresentes: (data) => set({ presentes: data }),
    setConvites: (data) => set({ convites: data }),
    setLoading: (loading) => set({ loading }),

    totalConfirmados: 0,
    custoTotal: 0,
    totalJaPago: 0,
    percentualPago: 0,
    saldoDevedor: 0,

    // ====================== ACTIONS ======================

    adicionarConvidado: async (novo) => {
      try {
        await addDoc(collection(db, "convidados"), novo);
        toast.success("Convidado adicionado com sucesso!");
      } catch (err) {
        toast.error("Erro ao adicionar convidado.");
        console.error(err);
      }
    },

    atualizarConvidado: async (id, dados) => {
      try {
        await updateDoc(doc(db, "convidados", id), dados);
        toast.success("Convidado atualizado!");
      } catch (err) {
        toast.error("Erro ao atualizar convidado.");
      }
    },

    excluirConvidado: async (id, nome) => {
      if (!window.confirm(`Excluir "${nome}" da lista?`)) return;
      try {
        await deleteDoc(doc(db, "convidados", id));
        toast.success("Convidado excluído.");
      } catch (err) {
        toast.error("Erro ao excluir convidado.");
      }
    },

    adicionarDespesa: async (nova) => {
      try {
        await addDoc(collection(db, "despesas"), nova);
        toast.success("Despesa cadastrada com sucesso! ✅");
      } catch (err) {
        toast.error("Erro ao cadastrar despesa.");
      }
    },

    excluirDespesa: async (id, descricao) => {
      if (!window.confirm(`Excluir despesa "${descricao}"?`)) return;
      try {
        await deleteDoc(doc(db, "despesas", id));
        toast.success("Despesa excluída.");
      } catch (err) {
        toast.error("Erro ao excluir despesa.");
      }
    },

    adicionarPresente: async (novo) => {
      try {
        await addDoc(collection(db, "presentes"), novo);
        toast.success("Presente adicionado!");
      } catch (err) {
        toast.error("Erro ao adicionar presente.");
      }
    },

    atualizarPresente: async (id, dados) => {
      try {
        await updateDoc(doc(db, "presentes", id), dados);
        toast.success("Status atualizado!");
      } catch (err) {
        toast.error("Erro ao atualizar presente.");
      }
    },

    excluirPresente: async (id, nome) => {
      if (!window.confirm(`Excluir "${nome}"?`)) return;
      try {
        await deleteDoc(doc(db, "presentes", id));
        toast.success("Presente excluído.");
      } catch (err) {
        toast.error("Erro ao excluir presente.");
      }
    },
  })),
);

// Atualiza valores computados automaticamente
// Atualiza valores computados automaticamente
useWeddingStore.subscribe(
  (state) => ({ convidados: state.convidados, despesas: state.despesas }),
  ({ convidados, despesas }) => {
    const totalConfirmados = convidados
      .filter((c) => c.confirmado)
      .reduce((acc, c) => acc + 1 + (c.quantidadeAcompanhantes || 0), 0);

    const custoTotal = despesas.reduce(
      (acc, d) => acc + (d.valorTotal || 0),
      0,
    );
    const totalJaPago = despesas.reduce(
      (acc, d) => acc + (d.valorJaPago || 0),
      0,
    );
    const percentualPago =
      custoTotal > 0 ? Math.round((totalJaPago / custoTotal) * 100) : 0;

    useWeddingStore.setState({
      totalConfirmados,
      custoTotal,
      totalJaPago,
      percentualPago,
      saldoDevedor: custoTotal - totalJaPago,
    });
  },
  {
    equalityFn: (a, b) =>
      a.convidados === b.convidados && a.despesas === b.despesas,
  },
);
