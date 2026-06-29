import { useEffect, useRef, useState } from "react";

import CsvUploader from "../components/CsvUploader";
import ResultsTable from "../components/ResultsTable";
import DownloadButton from "../components/DownloadButton";
import ProgressBar from "../components/ProgressBar";
import ProcessingSummary from "../components/ProcessingSummary";
import Icon from "../components/Icon";
import { downloadCsv } from "../utils/csvExport";
import { downloadHistoryTemplate } from "../utils/historyTemplate";
import { getLeagueIconSrc } from "../utils/leagueAssets";
import { leagues, useMassRanking } from "../hooks/useMassRanking";

type MassRankingPageProps = {
  maxLevel: number;
};

export default function MassRankingPage({ maxLevel }: MassRankingPageProps) {
  const [isLeagueMenuOpen, setIsLeagueMenuOpen] = useState(false);
  const leagueMenuRef = useRef<HTMLDivElement | null>(null);
  const {
    rows,
    progress,
    processedCount,
    totalCount,
    leagueCp,
    summary,
    errorMessage,
    isProcessing,
    elapsedSeconds,
    selectedLeague,
    processFile,
    changeLeague
  } = useMassRanking(maxLevel);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!leagueMenuRef.current?.contains(event.target as Node)) {
        setIsLeagueMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLeagueSelection(selectedLeagueCp: number) {
    changeLeague(selectedLeagueCp);
    setIsLeagueMenuOpen(false);
  }

  return (
    <section className="mass-ranking-page" aria-label="Ranking masivo">
      <header className="mass-ranking-page__header">
        <div>
          <h2>Ranking masivo</h2>
          <p>Procesa archivos CSV para calcular rankings PvP por lote usando la liga y configuración activas.</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-column">
          <article className="panel league-panel">
            <h2><span>1.</span> Selecciona la liga PvP</h2>
            <div className="league-select-wrap" ref={leagueMenuRef}>
              <button
                type="button"
                className="league-select-button"
                aria-haspopup="listbox"
                aria-expanded={isLeagueMenuOpen}
                aria-label="Seleccionar liga PvP"
                disabled={isProcessing}
                onClick={() => setIsLeagueMenuOpen((current) => !current)}
              >
                <img
                  className="league-emblem"
                  src={getLeagueIconSrc(selectedLeague.className)}
                  alt=""
                  aria-hidden="true"
                />
                <span className="league-select-button__label">{selectedLeague.name} ({selectedLeague.detail})</span>
                <Icon name="chevronDown" />
              </button>
              {isLeagueMenuOpen && (
                <div className="league-select-menu" role="listbox" aria-label="Ligas PvP disponibles">
                  {leagues.map((league) => (
                    <button
                      key={league.cp}
                      type="button"
                      role="option"
                      aria-selected={league.cp === leagueCp}
                      className={`league-select-option${league.cp === leagueCp ? " is-selected" : ""}`}
                      onClick={() => handleLeagueSelection(league.cp)}
                    >
                      <img className="league-select-option__icon" src={getLeagueIconSrc(league.className)} alt="" aria-hidden="true" />
                      <span>{league.name}</span>
                      <small>{league.detail}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>

          <article className="panel upload-panel">
            <h2><span>2.</span> Carga tu archivo CSV</h2>
            <CsvUploader onFileSelected={processFile} />
            <div className="upload-meta">
              <p className="upload-help">Formato soportado: .csv <b>•</b> Tamaño máximo: 50 MB</p>
              <button className="template-link" onClick={downloadHistoryTemplate} type="button">
                <Icon name="download" size={16} /> Descargar plantilla
              </button>
            </div>
          </article>
        </div>

        <div className="dashboard-column">
          <article className="panel progress-panel">
            <h2><span>3.</span> {isProcessing ? "Procesando archivo..." : progress === 100 ? "Archivo procesado" : "Progreso del archivo"}</h2>
            <ProgressBar value={progress} processed={processedCount} total={totalCount} elapsedSeconds={elapsedSeconds} />
          </article>
          <article className="panel summary-panel">
            <h2><span>4.</span> Resumen del procesamiento</h2>
            <ProcessingSummary summary={summary} errorMessage={errorMessage} />
          </article>
        </div>
      </section>

      {rows.length > 0 && <div className="export-row"><DownloadButton onClick={() => downloadCsv(rows, "pokemon-ranked.csv")} /></div>}
      <ResultsTable data={rows} leagueCp={leagueCp} />
    </section>
  );
}