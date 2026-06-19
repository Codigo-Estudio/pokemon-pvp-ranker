import { useEffect, useRef } from "react";
import { ProcessingIssue } from "../types/ProcessingSummary";
import Icon from "./Icon";

type Props = {
  issues: ProcessingIssue[];
  onClose: () => void;
};

export default function ProcessingIssuesModal({ issues, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        aria-labelledby="processing-issues-title"
        aria-modal="true"
        className="issues-modal"
        role="dialog"
      >
        <header className="issues-modal__header">
          <div>
            <h3 id="processing-issues-title">Detalle de errores</h3>
            <p>{issues.length.toLocaleString()} registros con errores</p>
          </div>
          <button
            aria-label="Cerrar detalle de errores"
            className="issues-modal__close"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="issues-modal__table" tabIndex={0}>
          <div className="issue-list__header"><span>Fila</span><span>Columna</span><span>Detalle</span></div>
          {issues.map((issue, index) => (
            <div className="issue-list__row" key={`${issue.row}-${issue.column}-${index}`}>
              <span>{issue.row}</span><span>{issue.column}</span><span>{issue.detail}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
