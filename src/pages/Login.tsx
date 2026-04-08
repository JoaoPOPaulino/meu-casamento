import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (error) {
      setErro('E-mail ou senha incorretos. Verifique e tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-pink-100">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-rose-600">Área dos Noivos 💍</h2>
          <p className="text-sm text-pink-400 mt-2">Acesso restrito à organização</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-rose-900 mb-1">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-rose-50/30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-900 mb-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-rose-50/30"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-lg shadow-md transition disabled:opacity-70"
          >
            {loading ? 'Acessando...' : 'Entrar no Painel'}
          </button>
        </form>

        {erro && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {erro}
          </div>
        )}
      </div>
    </div>
  );
}