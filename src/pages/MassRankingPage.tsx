import CsvUploader from "../components/CsvUploader";
import ResultsTable from "../components/ResultsTable";
import DownloadButton from "../components/DownloadButton";
import ProgressBar from "../components/ProgressBar";
import ProcessingSummary from "../components/ProcessingSummary";
import Icon from "../components/Icon";
import { downloadCsv } from "../utils/csvExport";
import { downloadHistoryTemplate } from "../utils/historyTemplate";
import { leagues, useMassRanking } from "../hooks/useMassRanking";

export default function MassRankingPage() {
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
  } = useMassRanking();

  return (
    <>
      <section className="dashboard-grid">
        <div className="dashboard-column">
          <article className="panel league-panel">
            <h2><span>1.</span> Selecciona la liga PvP</h2>
            <div className="league-select-wrap">
              <span className={`league-emblem league-emblem--${selectedLeague.className}`}>◆</span>
              <select value={leagueCp} onChange={(event) => changeLeague(Number(event.target.value))} disabled={isProcessing}>
                {leagues.map((league) => <option key={league.cp} value={league.cp}>{league.name} ({league.detail})</option>)}
              </select>
              <Icon name="chevronDown" />
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
    </>
  );
}