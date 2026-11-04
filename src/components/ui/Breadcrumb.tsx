import { CaretRight, House } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

function Breadcrumb({ items, className = '', showHomeIcon = false }: BreadcrumbProps) {
  return (
    <nav aria-label="Navegação estrutural" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-2">
              {index > 0 && <CaretRight aria-hidden="true" size={14} className="shrink-0 text-slate-400" />}
              {item.href && !current ? (
                <Link
                  to={item.href}
                  className="inline-flex min-w-0 items-center gap-1.5 truncate text-slate-500 transition-colors hover:text-brand-700"
                >
                  {showHomeIcon && index === 0 && <House aria-hidden="true" size={15} />}
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? 'page' : undefined}
                  className={current ? 'truncate font-medium text-slate-900' : 'truncate text-slate-500'}
                >
                  {showHomeIcon && index === 0 && <House aria-hidden="true" size={15} className="mr-1 inline" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
