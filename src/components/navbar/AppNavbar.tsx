import { Link, useNavigate } from 'react-router-dom';
import { SignOut } from '@phosphor-icons/react';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/logo.png';

function AppNavbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  function sair() {
    logout();
    navigate('/login');
  }

  const iniciais = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="h-header-height w-full px-lg flex items-center justify-between gap-md">
        <img src={logo} alt="Instant Desk" className="h-8 w-auto" />

        <nav className="hidden md:flex items-center gap-xs">
          <Link
            to="/dashboard"
            className="px-md py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/tickets"
            className="px-md py-sm rounded-lg font-label-md text-label-md bg-secondary-container text-on-secondary-fixed-variant transition-colors"
          >
            Meus Tickets
          </Link>
        </nav>

        <div className="flex items-center gap-md">
          <div className="hidden sm:flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-sm text-[12px]">
              {iniciais}
            </div>
            <span className="font-label-md text-label-md text-on-surface">{usuario?.nome}</span>
          </div>
          <button
            onClick={sair}
            aria-label="Sair"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <SignOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;