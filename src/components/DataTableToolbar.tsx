import Icon from "./Icon";

type DataTableToolbarProps = {
  resultLabel: string;
  hasActiveFilters: boolean;
  pageSize: number;
  onResetFilters: () => void;
  onPageSizeChange: (size: number) => void;
};

export default function DataTableToolbar({
  resultLabel,
  hasActiveFilters,
  pageSize,
  onResetFilters,
  onPageSizeChange
}: DataTableToolbarProps) {
  return (
    <div className="results-toolbar">
      <span>{resultLabel}</span>
      <button className="button button--muted" disabled={!hasActiveFilters} onClick={onResetFilters}>
        <Icon name="filter" /> Limpiar filtros
      </button>
      <label>Registros por página:
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {[10, 25, 50, 100].map((size) => <option key={size}>{size}</option>)}
        </select>
      </label>
    </div>
  );
}