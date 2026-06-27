import { useRef, useState } from "react";
import { getPokemonByDex } from "../data/pokemonGoStats";
import { calculateRank } from "../services/rankCalculator";
import { parseCsv } from "../services/csvService";
import { PokemonRecord } from "../types/PokemonRecord";
import { ProcessingIssue, ProcessingSummary } from "../types/ProcessingSummary";
import { RankResult } from "../types/RankResult";

export const DEFAULT_LEAGUE_CP = 1500;

export const leagues = [
  { cp: 500, name: "Little League", detail: "500 CP", className: "little" },
  { cp: 1500, name: "Great League", detail: "1500 CP", className: "great" },
  { cp: 2500, name: "Ultra League", detail: "2500 CP", className: "ultra" },
  { cp: -1, name: "Master League", detail: "Sin l\u00edmite", className: "master" }
] as const;

function mapRecordWithRank(row: PokemonRecord, pokemonName: string, rank: RankResult): PokemonRecord {
  return { ...row, name: pokemonName, rank: rank.rank, level: rank.level, cp: rank.cp };
}

async function rankPokemonRecord(row: PokemonRecord, selectedLeagueCp: number): Promise<PokemonRecord> {
  const pokemon = getPokemonByDex(Number(row.dex));
  if (!pokemon) throw new Error(`No existe un Pok\u00e9mon con Dex ${row.dex}`);
  const rank = await calculateRank(pokemon.attack, pokemon.defense, pokemon.stamina, row.atk, row.def, row.hp, selectedLeagueCp);
  return mapRecordWithRank(row, pokemon.displayName, rank);
}

export function useMassRanking() {
  const [rows, setRows] = useState<PokemonRecord[]>([]);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [leagueCp, setLeagueCp] = useState(DEFAULT_LEAGUE_CP);
  const [summary, setSummary] = useState<ProcessingSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const lastFileRef = useRef<File | null>(null);
  const processingRunRef = useRef(0);

  async function processFile(file: File, selectedLeagueCp = leagueCp, rememberFile = true) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Selecciona un archivo con extensi\u00f3n .csv.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("El archivo supera el tama\u00f1o m\u00e1ximo de 50 MB.");
      return;
    }

    if (rememberFile) lastFileRef.current = file;
    const processingRun = ++processingRunRef.current;
    const startedAt = performance.now();
    setRows([]);
    setProgress(0);
    setProcessedCount(0);
    setTotalCount(0);
    setSummary(null);
    setErrorMessage("");
    setIsProcessing(true);

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

  return {
    rows,
    progress,
    processedCount,
    totalCount,
    leagueCp,
    summary,
    errorMessage,
    isProcessing,
    elapsedSeconds: summary?.elapsedSeconds ?? 0,
    selectedLeague: leagues.find((league) => league.cp === leagueCp) ?? leagues[1],
    processFile,
    changeLeague
  };
}