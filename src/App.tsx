import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import RotaProtegida from './components/RotaProtegida';
import Tickets from './pages/tickets/Tickets';
import Dashboard from './pages/dashboard/Dashboard';

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
<Route
  path="/dashboard"
  element={
    <RotaProtegida>
      <Dashboard />
    </RotaProtegida>
  }
/>
    </Routes>
  );
}

export default App;