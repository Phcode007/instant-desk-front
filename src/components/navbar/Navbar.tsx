import { Link } from 'react-router-dom';
import { Translate } from '@phosphor-icons/react';
import { useLanguageStore } from '../../store/useLanguageStore';
import logo from '../../assets/logo.png';
import { Button, Header } from '../ui';

function Navbar() {
  const { t, language, toggleLanguage } = useLanguageStore();

  const navigation = (
    <>
      <a
        href="#features"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        {t.nav.features}
      </a>
      <Link
        to="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        {t.nav.login}
      </Link>
    </>
  );

  return (
    <Header
      position="fixed"
      brand={
        <Link to="/" aria-label="Instant Desk — início" className="shrink-0">
          <img src={logo} alt="Instant Desk" className="h-8 w-auto" />
        </Link>
      }
      navigation={navigation}
      mobileNavigation={navigation}
      actions={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label={language === 'pt' ? 'Mudar idioma para inglês' : 'Switch language to Portuguese'}
            leadingIcon={<Translate size={18} weight="bold" aria-hidden="true" />}
            className="uppercase"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </Button>
          <Link
            to="/cadastro"
            className="hidden min-h-9 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 sm:inline-flex"
          >
            {t.nav.getStarted}
          </Link>
        </>
      }
    />
  );
}

export default Navbar;