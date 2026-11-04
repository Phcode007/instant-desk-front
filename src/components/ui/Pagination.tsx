import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

type PageItem = number | 'left-ellipsis' | 'right-ellipsis';

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, 'right-ellipsis', totalPages];
  if (page >= totalPages - 3) {
    return [1, 'left-ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'left-ellipsis', page - 1, page, page + 1, 'right-ellipsis', totalPages];
}

function Pagination({ page, totalPages, onPageChange, label = 'Paginação', className = '' }: PaginationProps) {
  if (totalPages < 2) return null;

  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const buttonClass =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

  return (
    <nav aria-label={label} className={['flex flex-wrap items-center justify-between gap-3', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${buttonClass} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40`}
      >
        <CaretLeft size={16} aria-hidden="true" />
      </button>
      <div className="flex flex-wrap items-center gap-1" aria-label={`Página ${currentPage} de ${totalPages}`}>
        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              aria-current={item === currentPage ? 'page' : undefined}
              aria-label={`Página ${item}`}
              onClick={() => onPageChange(item)}
              className={[
                buttonClass,
                item === currentPage
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100',
              ].join(' ')}
            >
              {item}
            </button>
          ) : (
            <span key={item} aria-hidden="true" className="px-1 text-slate-400">
              …
            </span>
          ),
        )}
      </div>
      <button
        type="button"
        aria-label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${buttonClass} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40`}
      >
        <CaretRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
