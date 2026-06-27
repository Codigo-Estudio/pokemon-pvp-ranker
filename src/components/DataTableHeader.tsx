import Icon from "./Icon";
import { SortState } from "../hooks/useTableControls";

type DataTableColumn<TKey extends string> = {
  key: TKey;
  label: string;
  filterAriaLabel?: string;
  filterPlaceholder?: string;
  showSearchIcon?: boolean;
};

type DataTableHeaderProps<TKey extends string, TFilters extends Record<string, string>> = {
  columns: Array<DataTableColumn<TKey>>;
  filters: TFilters;
  sort: SortState<TKey>;
  onToggleSort: (key: TKey) => void;
  onUpdateFilter: (key: keyof TFilters, value: string) => void;
};

export default function DataTableHeader<TKey extends string, TFilters extends Record<string, string>>({
  columns,
  filters,
  sort,
  onToggleSort,
  onUpdateFilter
}: DataTableHeaderProps<TKey, TFilters>) {
  return (
    <thead>
      <tr>{columns.map(({ key, label }) => (
        <th key={key} aria-sort={sort.key === key ? `${sort.direction}ending` : "none"}>
          <button className="sort-button" onClick={() => onToggleSort(key)}>{label}<span>⇅</span></button>
        </th>
      ))}</tr>
      <tr className="filter-row">{columns.map(({ key, label, filterAriaLabel, filterPlaceholder, showSearchIcon }) => (
        <th key={key}>
          <div className="filter-control">
            <input
              aria-label={filterAriaLabel ?? `Filtrar por ${label}`}
              placeholder={filterPlaceholder ?? "Filtrar"}
              value={filters[key] ?? ""}
              onChange={(event) => onUpdateFilter(key as keyof TFilters, event.target.value)}
            />
            {showSearchIcon && <Icon name="search" size={17} />}
          </div>
        </th>
      ))}</tr>
    </thead>
  );
}