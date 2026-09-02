import { Link } from 'react-router-dom';
import { Translate } from '@phosphor-icons/react';
import { useLanguageStore } from '../../store/useLanguageStore';
import logo from '../../assets/logo.png';

function Navbar() {
  const { t, language, toggleLanguage } = useLanguageStore();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-header-height max-w-7xl mx-auto px-gutter flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Instant Desk" className="h-8 w-auto" />
        </Link>

                <nav className="hidden md:flex items-center gap-xl">
          
    <a href="#features" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">{t.nav.features}</a>
      
          <Link
            to="/login"
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          >
            {t.nav.login}
          </Link>
        </nav>

        <div className="flex items-center gap-md">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm uppercase"
          >
            <Translate size={18} weight="bold" />
            {language === 'pt' ? 'EN' : 'PT'}
          </button>

          <Link
            to="/cadastro"
            className="hidden sm:flex bg-primary text-on-primary px-xl py-sm rounded-full font-label-md text-label-md shadow-md hover:opacity-90 transition-all"
          >
            {t.nav.getStarted}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;