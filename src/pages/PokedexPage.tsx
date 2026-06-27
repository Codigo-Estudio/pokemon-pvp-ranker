import { getAllPokemon } from "../data/pokemonGoStats";
import { SortState, useTableControls } from "../hooks/useTableControls";
import DataTableToolbar from "../components/DataTableToolbar";
import DataTablePagination from "../components/DataTablePagination";
import DataTableHeader from "../components/DataTableHeader";

const allPokemon = getAllPokemon();

type PokedexColumnKey = "dex" | "displayName";
type Filters = { dex: string; displayName: string };

const columns: Array<{ key: PokedexColumnKey; label: string }> = [
  { key: "dex", label: "ID" },
  { key: "displayName", label: "Nombre" }
];

const tableColumns = columns.map(({ key, label }) => ({
  key,
  label,
  filterAriaLabel: key === "dex" ? "Filtrar por ID" : "Filtrar por nombre",
  filterPlaceholder: key === "dex" ? "Filtrar ID" : "Buscar nombre...",
  showSearchIcon: key === "displayName"
}));

const emptyFilters: Filters = { dex: "", displayName: "" };

function matchesDexFilter(dex: number, filter: string): boolean {
  const normalizedFilter = filter.trim();

  if (!normalizedFilter) {
    return true;
  }

  return String(dex).includes(normalizedFilter);
}

function comparePokemonRows(
  first: { dex: number; displayName: string },
  second: { dex: number; displayName: string },
  sort: SortState<PokedexColumnKey>
) {
  const firstValue = first[sort.key];
  const secondValue = second[sort.key];
  const comparison = typeof firstValue === "string"
    ? firstValue.localeCompare(String(secondValue))
    : Number(firstValue) - Number(secondValue);

  return sort.direction === "asc" ? comparison : -comparison;
}

export default function PokedexPage() {
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
  } = useTableControls<(typeof allPokemon)[number], Filters, PokedexColumnKey>({
    data: allPokemon,
    emptyFilters,
    initialSort: { key: "dex", direction: "asc" },
    applyFilters: (pokemon, currentFilters) => (
      matchesDexFilter(pokemon.dex, currentFilters.dex) &&
      pokemon.displayName.toLowerCase().includes(currentFilters.displayName.trim().toLowerCase())
    ),
    compareRows: comparePokemonRows
  });

  return (
    <section className="results-section" aria-label="Pokédex">
      <DataTableToolbar
        resultLabel={`${filteredRows.length.toLocaleString()} Pokémon`}
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
            onToggleSort={toggleSort}
            onUpdateFilter={updateFilter}
          />
          <tbody>
            {visibleRows.map((pokemon) => (
              <tr key={`${pokemon.dex}-${pokemon.pokemonId}`}>
                <td>{pokemon.dex}</td>
                <td className="pokemon-name">{pokemon.displayName}</td>
              </tr>
            ))}
            {!filteredRows.length && (
              <tr>
                <td className="empty-state" colSpan={2}>No hay Pokémon que coincidan con los filtros.</td>
              </tr>
            )}
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