import { FormularioRSVP } from '../components/FormularioRSVP';
import { ListaPresentes } from '../components/ListaPresentes';

export function Home() {
  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4 md:px-8">
      
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Cabeçalho */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-rose-600 mb-6 font-serif">
            João Pedro e Geovana ❤️
          </h1>
          <p className="text-lg md:text-xl text-rose-800/80">
            Estamos muito felizes em celebrar este momento com você. 
          </p>
        </div>

        {/* Card do Formulário de RSVP */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-pink-100 mb-10">
          <FormularioRSVP />
        </div>

        {/* Linha Divisória */}
        <div className="w-full max-w-3xl h-px bg-pink-200 my-8"></div>

        {/* Módulo de Presentes */}
        <ListaPresentes />
      </div>
      
    </div>
  );
}