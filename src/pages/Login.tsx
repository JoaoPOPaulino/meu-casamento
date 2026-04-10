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
    } catch {
      setErro('E-mail ou senha incorretos. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #fff5f7 0%, #fef9ec 60%, #fff0f5 100%)',
      }}
    >
      {/* Blobs decorativos */}
      <div aria-hidden className="fixed top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #fda4af, transparent)', transform: 'translate(-30%, -30%)' }} />
      <div aria-hidden className="fixed bottom-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f9a8d4, transparent)', transform: 'translate(30%, 30%)' }} />

      <div
        className="bg-white/90 backdrop-blur-sm w-full max-w-sm rounded-3xl border border-rose-100 overflow-hidden relative"
        style={{ boxShadow: '0 25px 80px -10px rgba(244,114,182,0.2), 0 0 0 1px rgba(244,114,182,0.08)' }}
      >
        {/* Faixa decorativa no topo */}
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg, #fda4af, #f9a8d4, #fde68a, #f9a8d4, #fda4af)' }}
        />

        <div className="p-8">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <p className="text-2xl mb-2">💍</p>
            <h2
              className="text-2xl font-bold text-rose-700"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Área dos Noivos
            </h2>
            <p
              className="text-xs text-rose-400/70 mt-2 uppercase tracking-widest"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Acesso restrito
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-semibold text-rose-800/80 mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition bg-rose-50/30 text-rose-900 placeholder:text-rose-300 text-sm"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-rose-800/80 mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition bg-rose-50/30 text-rose-900 placeholder:text-rose-300 text-sm"
              />
            </div>

            {erro && (
              <div className="p-3 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100 text-center animate-fade-in">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full text-white font-semibold py-3.5 rounded-xl shadow-md transition disabled:opacity-70 tracking-wide text-sm"
              style={{
                background: loading
                  ? '#fda4af'
                  : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {loading ? 'Acessando...' : 'Entrar no Painel →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}