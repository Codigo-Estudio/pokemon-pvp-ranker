import { useState } from "react";
import { ProcessingSummary as Summary } from "../types/ProcessingSummary";
import Icon from "./Icon";
import ProcessingIssuesModal from "./ProcessingIssuesModal";

type Props = { summary: Summary | null; errorMessage: string };

const VISIBLE_ISSUE_LIMIT = 4;

export default function ProcessingSummary({ summary, errorMessage }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const successful = summary?.successful ?? 0;
  const issues = summary?.issues ?? [];

  return (
    <div className="summary">
      <div className="summary__cards">
        <article className="summary-card summary-card--success">
          <Icon name="check" size={28} />
          <div><strong>Procesamiento correcto</strong><b>{successful.toLocaleString()}</b><span>registros procesados correctamente</span></div>
        </article>
        <article className="summary-card summary-card--error">
          <Icon name="warning" size={28} />
          <div><strong>Error al procesar</strong><b>{issues.length.toLocaleString()}</b><span>registros con errores</span></div>
        </article>
      </div>
      {errorMessage && <p className="file-error"><Icon name="warning" /> {errorMessage}</p>}
      {!!issues.length && (
        <div className="issue-list">
          <div className="issue-list__header"><span>Fila</span><span>Columna</span><span>Detalle</span></div>
          {issues.slice(0, VISIBLE_ISSUE_LIMIT).map((issue, index) => (
            <div className="issue-list__row" key={`${issue.row}-${issue.column}-${index}`}>
              <span>{issue.row}</span><span>{issue.column}</span><span>{issue.detail}</span>
            </div>
          ))}
          {issues.length > VISIBLE_ISSUE_LIMIT && (
            <p className="issue-list__footer">
              Se muestran {VISIBLE_ISSUE_LIMIT} de {issues.length.toLocaleString()} errores.
              <button className="link-button" onClick={() => setIsModalOpen(true)} type="button">Ver más</button>
            </p>
          )}
        </div>
      )}
      {!summary && !errorMessage && <p className="summary__empty">El resumen aparecerá al procesar un archivo.</p>}
      {isModalOpen && <ProcessingIssuesModal issues={issues} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
