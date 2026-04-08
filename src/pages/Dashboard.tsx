import { useEffect, useState } from 'react';
// Trocamos o getDocs pelo onSnapshot
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { NovaDespesa } from '../components/NovaDespesa';

interface Convidado {
  id: string;
  nomeCompleto: string;
  confirmado: boolean;
  quantidadeAcompanhantes: number;
}

// Criamos a interface para o TypeScript entender as Despesas
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
    // Escuta as mudanças na coleção de Convidados em tempo real
    const unsubConvidados = onSnapshot(collection(db, 'convidados'), (snapshot) => {
      const listaTemporaria = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Convidado[];
      setConvidados(listaTemporaria);
    });

    // Escuta as mudanças na coleção de Despesas em tempo real
    const unsubDespesas = onSnapshot(collection(db, 'despesas'), (snapshot) => {
      const listaTemporaria = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Despesa[];
      setDespesas(listaTemporaria);
      setLoading(false);
    });

    // Função de limpeza: fecha o túnel quando saímos da tela para economizar memória
    return () => {
      unsubConvidados();
      unsubDespesas();
    };
  }, []);

  // Cálculos Automáticos de Convidados
  const totalConfirmados = convidados
    .filter(c => c.confirmado)
    .reduce((total, c) => total + 1 + c.quantidadeAcompanhantes, 0);

  // Cálculos Automáticos Financeiros
  const custoTotal = despesas.reduce((acc, desp) => acc + desp.valorTotal, 0);
  const totalJaPago = despesas.reduce((acc, desp) => acc + desp.valorJaPago, 0);
  const saldoDevedor = custoTotal - totalJaPago;

  // Função nativa do JavaScript para formatar em Reais (R$)
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Painel de Controle 📊</h1>
          <p className="text-slate-500">Logado como Administrador</p>
        </div>

        {/* Resumo Financeiro no Topo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">Custo Total Previsto</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{formatarMoeda(custoTotal)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-green-500">
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">Total Já Pago</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{formatarMoeda(totalJaPago)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">Falta Pagar</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{formatarMoeda(saldoDevedor)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna Esquerda: Cadastro e Lista de Despesas */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-700">Gestão Financeira</h2>
            <NovaDespesa />

            {/* Tabela de Despesas Cadastradas */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold text-slate-600">Descrição</th>
                    <th className="p-4 font-semibold text-slate-600">Total</th>
                    <th className="p-4 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {despesas.map((despesa) => (
                    <tr key={despesa.id}>
                      <td className="p-4 text-slate-700">
                        <span className="block font-medium">{despesa.descricao}</span>
                        <span className="text-xs text-slate-400">{despesa.categoria}</span>
                      </td>
                      <td className="p-4 font-medium">{formatarMoeda(despesa.valorTotal)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${despesa.statusPagamento === 'Pago' ? 'bg-green-100 text-green-700' : 
                            despesa.statusPagamento === 'Pendente' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {despesa.statusPagamento}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {despesas.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-500">Nenhuma despesa cadastrada ainda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coluna Direita: Convidados (Mantida igual) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-700">Resumo de Convidados</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-purple-500">
              <p className="text-4xl font-bold text-purple-600">{loading ? '...' : totalConfirmados}</p>
              <p className="text-sm text-slate-500 uppercase tracking-wide mt-1">Pessoas Confirmadas</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold text-slate-600">Nome</th>
                    <th className="p-4 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {convidados.map((convidado) => (
                    <tr key={convidado.id}>
                      <td className="p-4 text-slate-700">
                        {convidado.nomeCompleto}
                        {convidado.quantidadeAcompanhantes > 0 && (
                          <span className="text-xs text-slate-400 block">+ {convidado.quantidadeAcompanhantes} acompanhante(s)</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${convidado.confirmado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {convidado.confirmado ? 'Confirmado' : 'Não vai'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {convidados.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-4 text-center text-slate-500">Nenhum convidado respondeu ainda.</td>
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