import dexList from "./dexList.json";

import { PokemonStatsRecord } from "../types/PokemonBaseStats";

const pokemonStatsByDex =
  new Map<number, PokemonStatsRecord>();
const pokemonStatsByName =
  new Map<string, PokemonStatsRecord>();

const pokemonStatsList: PokemonStatsRecord[] = [];

type DexListEntry = {
  dex?: number;
  baseDex?: number;
  pokemonId?: string;
  displayName?: string;
  types?: string[];
  evolutionChain?: number[];
  stats?: {
    attack?: number;
    defense?: number;
    stamina?: number;
  };
};

export function normalizePokemonIdentifier(
  value: string
): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function parsePokemonStatsEntry(
  rawValue: DexListEntry
): PokemonStatsRecord | null {
  if (
    rawValue.dex === undefined ||
    rawValue.baseDex === undefined ||
    !rawValue.pokemonId ||
    !rawValue.displayName ||
    rawValue.stats?.attack === undefined ||
    rawValue.stats.defense === undefined ||
    rawValue.stats.stamina === undefined
  ) {
    return null;
  }

  return {
    dex: rawValue.dex,
    baseDex: rawValue.baseDex,
    pokemonId: rawValue.pokemonId,
    displayName: rawValue.displayName,
    types: rawValue.types ?? [],
    evolutionChain: rawValue.evolutionChain ?? [rawValue.dex],
    attack: rawValue.stats.attack,
    defense: rawValue.stats.defense,
    stamina: rawValue.stats.stamina
  };
}

Object.values(dexList as Record<string, DexListEntry>).forEach(
  (value) => {
    const parsedEntry =
      parsePokemonStatsEntry(
        value
      );

    if (parsedEntry) {
      pokemonStatsList.push(parsedEntry);
      pokemonStatsByDex.set(
        parsedEntry.dex,
        parsedEntry
      );
      pokemonStatsByName.set(
        normalizePokemonIdentifier(parsedEntry.pokemonId),
        parsedEntry
      );
    }

  }
);

export function getPokemonByDex(
  dex: number
): PokemonStatsRecord | null {

  return pokemonStatsByDex.get(dex) ?? null;

}

export function getPokemonByName(
  name: string
): PokemonStatsRecord | null {
  return pokemonStatsByName.get(
    normalizePokemonIdentifier(name)
  ) ?? null;
}

export function findPokemon(
  value: string | number
): PokemonStatsRecord | null {
  const rawValue = String(value).trim();

  if (!rawValue) {
    return null;
  }

  if (/^\d+(?:\.\d+)?$/.test(rawValue)) {
    const dexMatch = getPokemonByDex(Number(rawValue));

    if (dexMatch) {
      return dexMatch;
    }
  }

  return getPokemonByName(rawValue);
}

export function getAllPokemon(): PokemonStatsRecord[] {
  return [...pokemonStatsList].sort((first, second) =>
    first.displayName.localeCompare(second.displayName)
  );
}

export function getPokemonEvolutionChain(
  pokemon: PokemonStatsRecord
): PokemonStatsRecord[] {
  return pokemon.evolutionChain
    .map((dex) => getPokemonByDex(dex))
    .filter((entry): entry is PokemonStatsRecord => entry !== null);
}
