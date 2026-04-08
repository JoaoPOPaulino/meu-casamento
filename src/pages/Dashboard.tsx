import { useEffect, useState } from 'react';
// Adicionamos doc e deleteDoc aqui
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { NovaDespesa } from '../components/NovaDespesa';

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

  useEffect(() => {
    const unsubConvidados = onSnapshot(collection(db, 'convidados'), (snapshot) => {
      const listaTemporaria = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Convidado[];
      setConvidados(listaTemporaria);
    });

    const unsubDespesas = onSnapshot(collection(db, 'despesas'), (snapshot) => {
      const listaTemporaria = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Despesa[];
      setDespesas(listaTemporaria);
      setLoading(false);
    });

    return () => {
      unsubConvidados();
      unsubDespesas();
    };
  }, []);

  // --- NOVA FUNÇÃO DE EXCLUIR ---
  const excluirDespesa = async (id: string, descricao: string) => {
    // Janela nativa de confirmação do navegador
    const confirmacao = window.confirm(`Tem certeza que deseja excluir a despesa "${descricao}"?`);
    
    if (confirmacao) {
      try {
        // Aponta para o documento exato e deleta
        const despesaRef = doc(db, 'despesas', id);
        await deleteDoc(despesaRef);
      } catch (error) {
        console.error("Erro ao excluir: ", error);
        alert("Ops! Ocorreu um erro ao excluir a despesa.");
      }
    }
  };

  const totalConfirmados = convidados
    .filter(c => c.confirmado)
    .reduce((total, c) => total + 1 + c.quantidadeAcompanhantes, 0);

  const custoTotal = despesas.reduce((acc, desp) => acc + desp.valorTotal, 0);
  const totalJaPago = despesas.reduce((acc, desp) => acc + desp.valorJaPago, 0);
  const saldoDevedor = custoTotal - totalJaPago;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="min-h-screen bg-rose-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
          <h1 className="text-2xl font-bold text-rose-900">Painel de Controle 💍</h1>
          <p className="text-pink-400 font-medium hidden md:block">Logado como Administrador</p>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 border-l-4 border-l-rose-400">
            <p className="text-sm text-rose-500 uppercase font-bold tracking-wide">Custo Total Previsto</p>
            <p className="text-3xl font-bold text-rose-900 mt-2">{formatarMoeda(custoTotal)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 border-l-4 border-l-emerald-400">
            <p className="text-sm text-emerald-600 uppercase font-bold tracking-wide">Total Já Pago</p>
            <p className="text-3xl font-bold text-emerald-700 mt-2">{formatarMoeda(totalJaPago)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 border-l-4 border-l-orange-400">
            <p className="text-sm text-orange-500 uppercase font-bold tracking-wide">Falta Pagar</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{formatarMoeda(saldoDevedor)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna Esquerda: Gestão Financeira */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-rose-900 px-2">Gestão Financeira</h2>
            <NovaDespesa />

            {/* Tabela de Despesas */}
            <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[400px]">
                <thead className="bg-rose-50/50 border-b border-pink-100">
                  <tr>
                    <th className="p-4 font-semibold text-rose-800">Descrição</th>
                    <th className="p-4 font-semibold text-rose-800">Total</th>
                    <th className="p-4 font-semibold text-rose-800">Status</th>
                    <th className="p-4 font-semibold text-rose-800 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {despesas.map((despesa) => (
                    <tr key={despesa.id} className="hover:bg-rose-50/30 transition">
                      <td className="p-4 text-rose-900">
                        <span className="block font-medium">{despesa.descricao}</span>
                        <span className="text-xs text-pink-400">{despesa.categoria}</span>
                      </td>
                      <td className="p-4 font-medium text-rose-700">{formatarMoeda(despesa.valorTotal)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${despesa.statusPagamento === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 
                            despesa.statusPagamento === 'Pendente' ? 'bg-orange-100 text-orange-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                          {despesa.statusPagamento}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => excluirDespesa(despesa.id, despesa.descricao)}
                          className="text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded transition bg-red-50 hover:bg-red-100"
                          title="Excluir Despesa"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                  {despesas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-pink-400">Nenhuma despesa cadastrada ainda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coluna Direita: Convidados (Mantida intacta) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-rose-900 px-2">Resumo de Convidados</h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 border-l-4 border-l-purple-400">
              <p className="text-4xl font-bold text-purple-500">{loading ? '...' : totalConfirmados}</p>
              <p className="text-sm text-purple-400 uppercase font-bold tracking-wide mt-1">Pessoas Confirmadas</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[300px]">
                <thead className="bg-rose-50/50 border-b border-pink-100">
                  <tr>
                    <th className="p-4 font-semibold text-rose-800">Nome</th>
                    <th className="p-4 font-semibold text-rose-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {convidados.map((convidado) => (
                    <tr key={convidado.id} className="hover:bg-rose-50/30 transition">
                      <td className="p-4 text-rose-900">
                        {convidado.nomeCompleto}
                        {convidado.quantidadeAcompanhantes > 0 && (
                          <span className="text-xs text-pink-400 block mt-0.5">+ {convidado.quantidadeAcompanhantes} acompanhante(s)</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${convidado.confirmado ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {convidado.confirmado ? 'Confirmado' : 'Não vai'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {convidados.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-6 text-center text-pink-400">Nenhum convidado respondeu ainda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}