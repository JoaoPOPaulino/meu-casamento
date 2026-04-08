import { FormularioRSVP } from '../components/FormularioRSVP';

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      
      {/* Cabeçalho bonitão */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
          Nosso Casamento ❤️
        </h1>
        <p className="text-lg text-slate-600">
          Bem-vindos ao nosso site! Por favor, confirme sua presença abaixo.
        </p>
      </div>

      {/* Card branco com sombra ao redor do formulário */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
        <FormularioRSVP />
      </div>
      
    </div>
  );
}