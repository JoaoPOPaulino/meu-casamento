import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function NovaDespesa() {
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Lua de Mel');
  const [valorTotal, setValorTotal] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'despesas'), {
        descricao,
        categoria,
        valorTotal: Number(valorTotal),
        valorJaPago: Number(valorPago),
        statusPagamento: status,
        dataCadastro: new Date().toISOString()
      });

      alert('Despesa cadastrada com sucesso!');
      setDescricao(''); setValorTotal(''); setValorPago('');
    } catch (error) {
      console.error("Erro ao salvar despesa: ", error);
      alert("Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Cadastrar Nova Despesa</h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Descrição ocupa a linha toda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
          <input 
            type="text" 
            required 
            placeholder="Ex: Passagens aéreas para Bariloche"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
          <select 
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg outline-none"
          >
            <option value="Lua de Mel">Lua de Mel</option>
            <option value="Buffet">Buffet e Bebidas</option>
            <option value="Decoração">Decoração</option>
            <option value="Trajes">Trajes e Alianças</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg outline-none"
          >
            <option value="Pendente">Pendente</option>
            <option value="Parcial">Pago Parcialmente</option>
            <option value="Pago">Totalmente Pago</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Valor Total (R$)</label>
          <input 
            type="number" 
            required 
            min="0" step="0.01"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Valor Já Pago (R$)</label>
          <input 
            type="number" 
            required 
            min="0" step="0.01"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg outline-none"
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Salvando...' : 'Adicionar Despesa'}
          </button>
        </div>
      </form>
    </div>
  );
}