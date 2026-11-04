import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import RotaProtegida from './components/RotaProtegida';
import Tickets from './pages/tickets/Tickets';
import Dashboard from './pages/dashboard/Dashboard';
import TicketDetail from './pages/tickets/TicketDetail';
import NewTicket from './pages/tickets/NewTicket';
import { ToastProvider } from './components/ui';
import { useToast } from './components/ui/useToast';
import { AUTH_FORBIDDEN_EVENT, AUTH_UNAUTHORIZED_EVENT } from './services/Service';
import UsersAdmin from './pages/admin/UsersAdmin';
import CompanySettings from './pages/admin/CompanySettings';
import CatalogSettings from './pages/admin/CatalogSettings';
import { UserRole } from './models/UserRole';

function App() {
  return (
    <ToastProvider>
      <ApiFeedbackHandler />
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
              <RotaProtegida roles={[UserRole.ADMIN]}>
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <RotaProtegida>
                <TicketDetail />
              </RotaProtegida>
            }
          />
          <Route
            path="/tickets/novo"
            element={
              <RotaProtegida>
                <NewTicket />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RotaProtegida roles={[UserRole.ADMIN]}>
                <UsersAdmin />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/company"
            element={
              <RotaProtegida roles={[UserRole.ADMIN]}>
                <CompanySettings />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/catalogs"
            element={
              <RotaProtegida roles={[UserRole.ADMIN]}>
                <CatalogSettings />
              </RotaProtegida>
            }
          />
      </Routes>
    </ToastProvider>
  );
}

function ApiFeedbackHandler() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleUnauthorized = () => navigate('/login', { replace: true });
    const handleForbidden = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      showToast({
        title: 'Acesso negado',
        description: detail?.message ?? 'Você não tem permissão para realizar esta ação.',
        variant: 'error',
      });
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    window.addEventListener(AUTH_FORBIDDEN_EVENT, handleForbidden);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
      window.removeEventListener(AUTH_FORBIDDEN_EVENT, handleForbidden);
    };
  }, [navigate, showToast]);

  return null;
}

export default App;