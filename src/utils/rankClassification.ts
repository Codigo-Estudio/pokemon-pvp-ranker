import { PokemonRecord } from "../types/PokemonRecord";

export type RankClassification = {
  label: "Excepcional" | "Excelente" | "Bueno" | "Aceptable" | "Deficiente";
  tier: "SS" | "S" | "A" | "B" | "C";
  colorClass: string;
};

export function classifyRank(row: PokemonRecord, leagueCp: number): RankClassification {
  const isPerfectMasterLeague = leagueCp === -1 && row.atk === 15 && row.def === 15 && row.hp === 15;

  if (isPerfectMasterLeague) {
    return { label: "Excepcional", tier: "SS", colorClass: "exceptional" };
  }

  const rank = row.rank ?? Number.MAX_SAFE_INTEGER;
  if (rank <= 25) return { label: "Excelente", tier: "S", colorClass: "excellent" };
  if (rank <= 100) return { label: "Bueno", tier: "A", colorClass: "good" };
  if (rank <= 500) return { label: "Aceptable", tier: "B", colorClass: "acceptable" };
  return { label: "Deficiente", tier: "C", colorClass: "poor" };
}
