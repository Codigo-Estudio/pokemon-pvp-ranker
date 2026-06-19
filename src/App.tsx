import { useRef, useState } from "react";
import CsvUploader from "./components/CsvUploader";
import ResultsTable from "./components/ResultsTable";
import DownloadButton from "./components/DownloadButton";
import ProgressBar from "./components/ProgressBar";
import ProcessingSummary from "./components/ProcessingSummary";
import Icon from "./components/Icon";
import { parseCsv } from "./services/csvService";
import { calculateRank } from "./services/rankCalculator";
import { downloadCsv } from "./utils/csvExport";
import { PokemonRecord } from "./types/PokemonRecord";
import { RankResult } from "./types/RankResult";
import { ProcessingIssue, ProcessingSummary as Summary } from "./types/ProcessingSummary";
import { getPokemonByDex } from "./data/pokemonGoStats";
import { downloadHistoryTemplate } from "./utils/historyTemplate";

const DEFAULT_LEAGUE_CP = 1500;

const leagues = [
  { cp: 500, name: "Little League", detail: "500 CP", className: "little" },
  { cp: 1500, name: "Great League", detail: "1500 CP", className: "great" },
  { cp: 2500, name: "Ultra League", detail: "2500 CP", className: "ultra" },
  { cp: -1, name: "Master League", detail: "Sin límite", className: "master" }
];

function mapRecordWithRank(row: PokemonRecord, pokemonName: string, rank: RankResult): PokemonRecord {
  return { ...row, name: pokemonName, rank: rank.rank, level: rank.level, cp: rank.cp };
}

export default function App() {
  const [rows, setRows] = useState<PokemonRecord[]>([]);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [leagueCp, setLeagueCp] = useState(DEFAULT_LEAGUE_CP);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const lastFileRef = useRef<File | null>(null);
  const processingRunRef = useRef(0);

  async function rankPokemonRecord(row: PokemonRecord, selectedLeagueCp: number): Promise<PokemonRecord> {
    const pokemon = getPokemonByDex(Number(row.dex));
    if (!pokemon) throw new Error(`No existe un Pokémon con Dex ${row.dex}`);
    const rank = await calculateRank(pokemon.attack, pokemon.defense, pokemon.stamina, row.atk, row.def, row.hp, selectedLeagueCp);
    return mapRecordWithRank(row, pokemon.name, rank);
  }

  async function processFile(file: File, selectedLeagueCp = leagueCp, rememberFile = true) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Selecciona un archivo con extensión .csv.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("El archivo supera el tamaño máximo de 50 MB.");
      return;
    }

    if (rememberFile) lastFileRef.current = file;
    const processingRun = ++processingRunRef.current;
    const startedAt = performance.now();
    setRows([]); setProgress(0); setProcessedCount(0); setSummary(null); setErrorMessage(""); setIsProcessing(true);

    try {
      const parsed = await parseCsv(file);
      if (processingRun !== processingRunRef.current) return;
      setTotalCount(parsed.total);
      const processed: PokemonRecord[] = [];
      const issues: ProcessingIssue[] = [...parsed.issues];

      for (let index = 0; index < parsed.records.length; index++) {
        const record = parsed.records[index];
        try {
          processed.push(await rankPokemonRecord(record, selectedLeagueCp));
        } catch (error) {
          issues.push({
            row: parsed.sourceRows[index],
            column: "dex",
            detail: error instanceof Error ? error.message : "No fue posible calcular el ranking"
          });
        }
        if (processingRun !== processingRunRef.current) return;
        const current = index + 1 + parsed.issues.length;
        setProcessedCount(Math.min(current, parsed.total));
        setProgress(parsed.total ? Math.round((current / parsed.total) * 100) : 100);
        if (index % 50 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const elapsedSeconds = Math.max(1, Math.round((performance.now() - startedAt) / 1000));
      setRows(processed);
      setProcessedCount(parsed.total);
      setProgress(100);
      setSummary({ total: parsed.total, successful: processed.length, issues, elapsedSeconds });
    } catch (error) {
      if (processingRun !== processingRunRef.current) return;
      setErrorMessage(error instanceof Error ? error.message : "No fue posible leer el archivo.");
      setTotalCount(0);
    } finally {
      if (processingRun === processingRunRef.current) setIsProcessing(false);
    }
  }

  function changeLeague(selectedLeagueCp: number) {
    setLeagueCp(selectedLeagueCp);
    if (lastFileRef.current) void processFile(lastFileRef.current, selectedLeagueCp, false);
  }

  const elapsedSeconds = summary?.elapsedSeconds ?? 0;
  const selectedLeague = leagues.find((league) => league.cp === leagueCp) ?? leagues[1];

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true"><span>GO</span></div>
        <div><h1>Pokémon PvP Rank Simulator</h1><p>Calcula el ranking de posición según IVs y especie de Pokémon de forma masiva.</p></div>
      </header>

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
    </main>
  );
}
