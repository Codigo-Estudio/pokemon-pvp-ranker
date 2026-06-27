import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";
export type SortState<TKey extends string> = { key: TKey; direction: SortDirection };

type UseTableControlsOptions<TRow, TFilters extends Record<string, string>, TKey extends string> = {
  data: TRow[];
  emptyFilters: TFilters;
  initialSort: SortState<TKey>;
  applyFilters: (row: TRow, filters: TFilters) => boolean;
  compareRows: (first: TRow, second: TRow, sort: SortState<TKey>) => number;
};

export function createPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const candidates = new Set([1, total, current - 1, current, current + 1].filter((page) => page > 0 && page <= total));
  const sorted = [...candidates].sort((first, second) => first - second);
  return sorted.flatMap((page, index) => index > 0 && page - sorted[index - 1] > 1 ? ["ellipsis", page] : [page]);
}

export function useTableControls<TRow, TFilters extends Record<string, string>, TKey extends string>({
  data,
  emptyFilters,
  initialSort,
  applyFilters,
  compareRows
}: UseTableControlsOptions<TRow, TFilters, TKey>) {
  const [filters, setFilters] = useState<TFilters>(emptyFilters);
  const [sort, setSort] = useState<SortState<TKey>>(initialSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRows = useMemo(() => data
    .filter((row) => applyFilters(row, filters))
    .sort((first, second) => compareRows(first, second, sort)), [data, filters, sort, applyFilters, compareRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisible = filteredRows.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisible = Math.min(currentPage * pageSize, filteredRows.length);

  function updateFilter(key: keyof TFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function toggleSort(key: TKey) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setPage(1);
  }

  function updatePageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return {
    filters,
    sort,
    pageSize,
    currentPage,
    filteredRows,
    visibleRows,
    totalPages,
    firstVisible,
    lastVisible,
    updateFilter,
    toggleSort,
    resetFilters,
    setPage,
    updatePageSize
  };
}