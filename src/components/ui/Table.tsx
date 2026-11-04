import type { Key, ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  caption: string;
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => Key;
  emptyState?: ReactNode;
  className?: string;
}

function Table<T>({ caption, columns, rows, rowKey, emptyState, className = '' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={['w-full border-collapse text-left text-sm', className].filter(Boolean).join(' ')}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <tr className="border-b border-slate-200">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={['px-4 py-3', column.headerClassName, column.className].filter(Boolean).join(' ')}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-slate-50/80">
              {columns.map((column) => (
                <td key={column.key} className={['px-4 py-3', column.className].filter(Boolean).join(' ')}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && emptyState && (
            <tr>
              <td colSpan={Math.max(columns.length, 1)} className="px-4 py-8">
                {emptyState}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
