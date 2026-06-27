import { PokemonRecord } from "../types/PokemonRecord";
import { classifyRank } from "../utils/rankClassification";
import { SortState, useTableControls } from "../hooks/useTableControls";
import DataTableToolbar from "./DataTableToolbar";
import DataTablePagination from "./DataTablePagination";
import DataTableHeader from "./DataTableHeader";

type Props = { data: PokemonRecord[]; leagueCp: number };
type Filters = Record<"dex" | "rank" | "level" | "cp" | "atk" | "def" | "hp", string> & { name: string };

const columns: Array<{ key: keyof Filters; label: string }> = [
  { key: "dex", label: "Dex" }, { key: "name", label: "Nombre" },
  { key: "rank", label: "Rank" }, { key: "level", label: "Nivel" },
  { key: "cp", label: "CP" }, { key: "atk", label: "Atk" },
  { key: "def", label: "Def" }, { key: "hp", label: "HP" }
];

const tableColumns = columns.map(({ key, label }) => ({
  key,
  label,
  filterAriaLabel: `Filtrar por ${key}`,
  filterPlaceholder: key === "name" ? "Buscar nombre..." : "Min - Máx",
  showSearchIcon: key === "name"
}));

const emptyFilters: Filters = { dex: "", name: "", rank: "", level: "", cp: "", atk: "", def: "", hp: "" };

function matchesNumericFilter(value: number | undefined, filter: string): boolean {
  if (!filter.trim()) return true;
  const [minimum, maximum] = filter.split("-").map((part) => Number(part.trim()));
  if (filter.includes("-")) {
    return (Number.isNaN(minimum) || Number(value) >= minimum) && (Number.isNaN(maximum) || Number(value) <= maximum);
  }
  return Number(value) === minimum;
}

function comparePokemonRows(first: PokemonRecord, second: PokemonRecord, sort: SortState<keyof PokemonRecord>) {
  const firstValue = first[sort.key] ?? "";
  const secondValue = second[sort.key] ?? "";
  const comparison = typeof firstValue === "string"
    ? firstValue.localeCompare(String(secondValue))
    : Number(firstValue) - Number(secondValue);

  return sort.direction === "asc" ? comparison : -comparison;
}

export default function ResultsTable({ data, leagueCp }: Props) {
  const {
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
  } = useTableControls<PokemonRecord, Filters, keyof PokemonRecord>({
    data,
    emptyFilters,
    initialSort: { key: "rank", direction: "asc" },
    applyFilters: (row, currentFilters) => (
      (row.name ?? "").toLowerCase().includes(currentFilters.name.toLowerCase()) &&
      columns.filter(({ key }) => key !== "name").every(({ key }) => matchesNumericFilter(row[key] as number | undefined, currentFilters[key]))
    ),
    compareRows: comparePokemonRows
  });

  return (
    <section className="results-section" aria-label="Resultados del ranking">
      <DataTableToolbar
        resultLabel={`${filteredRows.length.toLocaleString()} resultados`}
        hasActiveFilters={Object.values(filters).some(Boolean)}
        pageSize={pageSize}
        onResetFilters={resetFilters}
        onPageSizeChange={updatePageSize}
      />

      <div className="table-scroll">
        <table>
          <DataTableHeader
            columns={tableColumns}
            filters={filters}
            sort={sort}
            onToggleSort={(key) => toggleSort(key as keyof PokemonRecord)}
            onUpdateFilter={updateFilter}
          />
          <tbody>
            {visibleRows.map((row, index) => {
              const classification = classifyRank(row, leagueCp);
              return (
                <tr key={`${row.dex}-${row.atk}-${row.def}-${row.hp}-${index}`}>
                  <td>{row.dex}</td><td className="pokemon-name">{row.name ?? "-"}</td>
                  <td>
                    <span
                      className={`rank-badge rank-badge--${classification.colorClass}`}
                      title={`${classification.label} · Tier ${classification.tier}`}
                    >
                      <span>{row.rank ?? "-"}</span><b>{classification.tier}</b>
                    </span>
                  </td>
                  <td>{row.level?.toFixed(1) ?? "-"}</td><td>{row.cp ?? "-"}</td>
                  <td>{row.atk}</td><td>{row.def}</td><td>{row.hp}</td>
                </tr>
              );
            })}
            {!visibleRows.length && <tr><td className="empty-state" colSpan={columns.length}>No hay resultados que coincidan con los filtros.</td></tr>}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        firstVisible={firstVisible}
        lastVisible={lastVisible}
        totalRows={filteredRows.length}
        onPageChange={setPage}
      />
    </section>
  );
}
