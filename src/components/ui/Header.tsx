import { useState, type ReactNode } from 'react';
import { List, X } from '@phosphor-icons/react';

export interface HeaderProps {
  brand: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  mobileNavigation?: ReactNode;
  position?: 'sticky' | 'fixed' | 'static';
  className?: string;
}

const positionClasses = {
  sticky: 'sticky',
  fixed: 'fixed',
  static: 'static',
} as const;

function Header({ brand, navigation, actions, mobileNavigation, position = 'sticky', className = '' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={[
        `${positionClasses[position]} top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">{brand}</div>
        {navigation && <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">{navigation}</nav>}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {actions}
          {mobileNavigation && (
            <button
              type="button"
              aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'}
              aria-expanded={menuOpen}
              aria-controls="header-mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
      {mobileNavigation && (
        <nav
          id="header-mobile-navigation"
          aria-label="Navegação móvel"
          onClick={() => setMenuOpen(false)}
          className={[
            'gap-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden',
            menuOpen ? 'grid' : 'hidden',
          ].join(' ')}
        >
          {mobileNavigation}
        </nav>
      )}
    </header>
  );
}

export default Header;
