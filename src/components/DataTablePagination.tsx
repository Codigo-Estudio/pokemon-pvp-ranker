import Icon from "./Icon";
import { createPageNumbers } from "../hooks/useTableControls";

type DataTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  firstVisible: number;
  lastVisible: number;
  totalRows: number;
  onPageChange: (page: number) => void;
};

export default function DataTablePagination({
  currentPage,
  totalPages,
  firstVisible,
  lastVisible,
  totalRows,
  onPageChange
}: DataTablePaginationProps) {
  return (
    <div className="pagination">
      <span>Mostrando {firstVisible} a {lastVisible} de {totalRows.toLocaleString()} registros</span>
      <nav aria-label="Paginación">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><Icon name="chevronLeft" size={16} /> Anterior</button>
        {createPageNumbers(currentPage, totalPages).map((item, index) => item === "ellipsis"
          ? <span key={`ellipsis-${index}`}>…</span>
          : <button key={item} className={item === currentPage ? "active" : ""} onClick={() => onPageChange(item)}>{item}</button>)}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Siguiente <Icon name="chevronRight" size={16} /></button>
      </nav>
    </div>
  );
}