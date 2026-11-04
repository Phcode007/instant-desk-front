import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SignOut } from '@phosphor-icons/react';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/logo.png';
import { Avatar, Button, Header } from '../ui';

function AppNavbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  function sair() {
    logout();
    navigate('/login');
  }

  const navigation = (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/tickets"
        end
        className={({ isActive }) =>
          `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`
        }
      >
        Meus Tickets
      </NavLink>
      <NavLink
        to="/tickets/novo"
        className={({ isActive }) =>
          `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`
        }
      >
        Novo Ticket
      </NavLink>
    </>
  );

  return (
    <Header
      position="fixed"
      brand={
        <Link to="/dashboard" aria-label="Instant Desk — Dashboard" className="shrink-0">
          <img src={logo} alt="Instant Desk" className="h-8 w-auto" />
        </Link>
      }
      navigation={navigation}
      mobileNavigation={navigation}
      actions={
        <>
          {usuario?.nome && (
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={usuario.nome} size="sm" />
              <span className="max-w-40 truncate text-sm font-medium text-slate-800">{usuario.nome}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={sair}
            aria-label="Sair"
            leadingIcon={<SignOut size={18} aria-hidden="true" />}
            className="!px-2"
          />
        </>
      }
    />
  );
}

export default AppNavbar;