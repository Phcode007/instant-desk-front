import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import RotaProtegida from './components/RotaProtegida';
import Tickets from './pages/tickets/Tickets';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route
  path="/tickets"
  element={
    <RotaProtegida>
      <Tickets />
    </RotaProtegida>
  }
/>
    </Routes>
  );
}

export default App;