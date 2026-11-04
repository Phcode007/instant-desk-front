import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from '@phosphor-icons/react';

export interface SidebarItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: ReactNode;
  end?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  mobileOpen?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
  brand?: ReactNode;
  footer?: ReactNode;
  label?: string;
  className?: string;
}

function Sidebar({
  items,
  mobileOpen = false,
  collapsed = false,
  onClose,
  brand,
  footer,
  label = 'Navegação principal',
  className = '',
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu de navegação"
          onClick={onClose}
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-950/40 md:hidden"
        />
      )}
      <aside
        aria-label={label}
        className={[
          'fixed bottom-0 left-0 top-16 z-40 flex h-[calc(100dvh-4rem)] flex-col border-r border-slate-200 bg-white transition-transform duration-200 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full md:visible md:translate-x-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {(brand || !collapsed) && (
          <div className={`flex min-h-14 items-center border-b border-slate-100 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && brand}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                  collapsed ? 'justify-center px-0' : '',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge}
            </NavLink>
          ))}
        </nav>
        {footer && <div className="border-t border-slate-200 p-3">{footer}</div>}
      </aside>
    </>
  );
}

export default Sidebar;
