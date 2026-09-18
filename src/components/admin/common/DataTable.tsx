import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Inbox } from 'lucide-react';
import type { PaginationMeta } from '../../../types/admin';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((item: T) => string);
  meta?: PaginationMeta;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSort?: (columnKey: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  selectable?: boolean;
  selectedIds?: string[];
  onSelectIds?: (ids: string[]) => void;
  bulkActions?: React.ReactNode;
  filters?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  meta,
  isLoading = false,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSort,
  sortBy,
  sortOrder,
  selectable = false,
  selectedIds = [],
  onSelectIds,
  bulkActions,
  filters,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search terms or filters.',
  emptyAction
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState(searchValue);

  const getItemKey = (item: T): string => {
    if (typeof keyField === 'function') {
      return keyField(item);
    }
    return String(item[keyField]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectIds) return;
    if (e.target.checked) {
      const allIds = data.map(getItemKey);
      onSelectIds(allIds);
    } else {
      onSelectIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectIds) return;
    if (selectedIds.includes(id)) {
      onSelectIds(selectedIds.filter((item) => item !== id));
    } else {
      onSelectIds([...selectedIds, id]);
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="bg-white border border-[#E8E0D2] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Top Filter & Search Bar */}
      {(onSearch || filters || bulkActions) && (
        <div className="p-4 border-b border-[#E8E0D2] bg-[#FAF7F1]/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {onSearch && (
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8478]" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={internalSearch}
                  onChange={(e) => {
                    setInternalSearch(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="w-full pl-9.5 pr-4 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] placeholder-[#9E9689] focus:outline-none focus:border-[#1C4CB8] focus:ring-2 focus:ring-[#1C4CB8]/10 transition-all"
                />
              </div>
            )}
            {filters}
          </div>

          {selectedIds.length > 0 && bulkActions && (
            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8E0D2]">
              <span className="text-xs font-semibold text-[#1C4CB8] bg-[#E7EDFB] px-2.5 py-1 rounded-full">
                {selectedIds.length} selected
              </span>
              {bulkActions}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E8E0D2] bg-[#FAF7F1] text-[#635E55] uppercase text-[11px] font-bold tracking-wider">
              {selectable && (
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    className="w-4 h-4 rounded-sm border-[#D0C8BA] text-[#1C4CB8] focus:ring-[#1C4CB8]/20 cursor-pointer accent-[#1C4CB8]"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 select-none ${col.className || ''} ${
                    col.sortable ? 'cursor-pointer hover:text-[#24221F]' : ''
                  }`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        className={`w-3 h-3 transition-transform ${
                          sortBy === col.key
                            ? sortOrder === 'asc'
                              ? 'text-[#1C4CB8] rotate-180'
                              : 'text-[#1C4CB8]'
                            : 'text-[#A8A092]'
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4EFE6]">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: meta?.limit || 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="w-4 h-4 bg-[#F4EFE6] rounded" />
                    </td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={`skel-col-${cIdx}`} className="px-4 py-4">
                      <div className="h-3.5 bg-[#F4EFE6] rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-16 text-center text-[#7D766C]"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] text-[#8C8478] flex items-center justify-center mb-3">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#24221F] mb-1">{emptyTitle}</h4>
                    <p className="text-xs text-[#8C8478] mb-4">{emptyDescription}</p>
                    {emptyAction}
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((item) => {
                const key = getItemKey(item);
                const isSelected = selectedIds.includes(key);

                return (
                  <tr
                    key={key}
                    className={`transition-colors hover:bg-[#FAF7F1]/70 ${
                      isSelected ? 'bg-[#FAF7F1]' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          aria-label={`Select item ${key}`}
                          className="w-4 h-4 rounded-sm border-[#D0C8BA] text-[#1C4CB8] focus:ring-[#1C4CB8]/20 cursor-pointer accent-[#1C4CB8]"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3.5 text-[#24221F] ${col.className || ''}`}>
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {meta && (
        <div className="p-4 border-t border-[#E8E0D2] bg-[#FAF7F1]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7D766C]">
          <div>
            Showing <span className="font-semibold text-[#24221F]">{data.length}</span> of{' '}
            <span className="font-semibold text-[#24221F]">{meta.total}</span> records
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8C8478] mr-2">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              onClick={() => onPageChange && onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="p-1.5 rounded-lg border border-[#E8E0D2] bg-white text-[#24221F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F1] transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPageChange && onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="p-1.5 rounded-lg border border-[#E8E0D2] bg-white text-[#24221F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F1] transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
