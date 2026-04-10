import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login';
import { RotaProtegida } from './components/RotaProtegida';
import { PaginaConvite } from './pages/PaginaConvite';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública*/}
        <Route path="/" element={<Home />} />
         <Route path="/convite/:codigo" element={<PaginaConvite />} />
        <Route path="/login" element={<Login />} />
        {/* Rota Privada - Dashboard */}
        <Route path="/admin" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
