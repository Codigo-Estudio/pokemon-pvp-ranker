import { useMemo, useState } from "react";
import { PokemonRecord } from "../types/PokemonRecord";
import Icon from "./Icon";
import { classifyRank } from "../utils/rankClassification";

type Props = { data: PokemonRecord[]; leagueCp: number };
type SortDirection = "asc" | "desc";
type SortState = { key: keyof PokemonRecord; direction: SortDirection };
type Filters = Record<"dex" | "rank" | "level" | "cp" | "atk" | "def" | "hp", string> & { name: string };

const columns: Array<{ key: keyof Filters; label: string }> = [
  { key: "dex", label: "Dex" }, { key: "name", label: "Nombre" },
  { key: "rank", label: "Rank" }, { key: "level", label: "Nivel" },
  { key: "cp", label: "CP" }, { key: "atk", label: "Atk" },
  { key: "def", label: "Def" }, { key: "hp", label: "HP" }
];

const emptyFilters: Filters = { dex: "", name: "", rank: "", level: "", cp: "", atk: "", def: "", hp: "" };

function matchesNumericFilter(value: number | undefined, filter: string): boolean {
  if (!filter.trim()) return true;
  const [minimum, maximum] = filter.split("-").map((part) => Number(part.trim()));
  if (filter.includes("-")) {
    return (Number.isNaN(minimum) || Number(value) >= minimum) && (Number.isNaN(maximum) || Number(value) <= maximum);
  }
  return Number(value) === minimum;
}

function createPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const candidates = new Set([1, total, current - 1, current, current + 1].filter((page) => page > 0 && page <= total));
  const sorted = [...candidates].sort((a, b) => a - b);
  return sorted.flatMap((page, index) => index > 0 && page - sorted[index - 1] > 1 ? ["ellipsis", page] : [page]);
}

export default function ResultsTable({ data, leagueCp }: Props) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortState>({ key: "rank", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRows = useMemo(() => data.filter((row) =>
    (row.name ?? "").toLowerCase().includes(filters.name.toLowerCase()) &&
    columns.filter(({ key }) => key !== "name").every(({ key }) => matchesNumericFilter(row[key] as number | undefined, filters[key]))
  ).sort((first, second) => {
    const firstValue = first[sort.key] ?? "";
    const secondValue = second[sort.key] ?? "";
    const comparison = typeof firstValue === "string"
      ? firstValue.localeCompare(String(secondValue))
      : Number(firstValue) - Number(secondValue);
    return sort.direction === "asc" ? comparison : -comparison;
  }), [data, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisible = filteredRows.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisible = Math.min(currentPage * pageSize, filteredRows.length);

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function toggleSort(key: keyof PokemonRecord) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  }

  return (
    <section className="results-section" aria-label="Resultados del ranking">
      <div className="results-toolbar">
        <span>{filteredRows.length.toLocaleString()} resultados</span>
        <button className="button button--muted" disabled={!Object.values(filters).some(Boolean)} onClick={() => { setFilters(emptyFilters); setPage(1); }}>
          <Icon name="filter" /> Limpiar filtros
        </button>
        <label>Registros por página:
          <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>
            {[10, 25, 50, 100].map((size) => <option key={size}>{size}</option>)}
          </select>
        </label>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>{columns.map(({ key, label }) => (
              <th key={key} aria-sort={sort.key === key ? `${sort.direction}ending` : "none"}>
                <button className="sort-button" onClick={() => toggleSort(key as keyof PokemonRecord)}>{label}<span>⇅</span></button>
              </th>
            ))}</tr>
            <tr className="filter-row">{columns.map(({ key }) => (
              <th key={key}>
                <div className="filter-control">
                  <input
                    aria-label={`Filtrar por ${key}`}
                    placeholder={key === "name" ? "Buscar nombre..." : "Min - Máx"}
                    value={filters[key]}
                    onChange={(event) => updateFilter(key, event.target.value)}
                  />
                  {key === "name" && <Icon name="search" size={17} />}
                </div>
              </th>
            ))}</tr>
          </thead>
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

      <div className="pagination">
        <span>Mostrando {firstVisible} a {lastVisible} de {filteredRows.length.toLocaleString()} registros</span>
        <nav aria-label="Paginación">
          <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><Icon name="chevronLeft" size={16} /> Anterior</button>
          {createPageNumbers(currentPage, totalPages).map((item, index) => item === "ellipsis"
            ? <span key={`ellipsis-${index}`}>…</span>
            : <button key={item} className={item === currentPage ? "active" : ""} onClick={() => setPage(item)}>{item}</button>)}
          <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Siguiente <Icon name="chevronRight" size={16} /></button>
        </nav>
      </div>
    </section>
  );
}
