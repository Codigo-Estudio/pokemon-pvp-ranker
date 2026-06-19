import { pokeListObj } from "./pokeListObj";

import { PokemonStatsRecord } from "../types/PokemonBaseStats";

const pokemonStatsByDex =
  new Map<number, PokemonStatsRecord>();
const pokemonStatsByName =
  new Map<string, PokemonStatsRecord>();

const pokemonStatsList: PokemonStatsRecord[] = [];

function formatPokemonName(
  name: string
): string {
  return name.replace(/_/g, " ");
}

function normalizePokemonName(
  name: string
): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ +/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function parsePokemonStatsEntry(
  name: string,
  rawValue: string
): PokemonStatsRecord | null {
  const parts =
    rawValue.split(",");

  const dex = Number(
    parts[0].match(/\d+/)?.[0]
  );

  if (Number.isNaN(dex)) {
    return null;
  }

  return {
    dex,
    name: formatPokemonName(name),
    attack: Number(parts[1]),
    defense: Number(parts[2]),
    stamina: Number(parts[3])
  };
}

Object.entries(pokeListObj).forEach(
  ([name, value]) => {
    const parsedEntry =
      parsePokemonStatsEntry(
        name,
        String(value)
      );

    if (parsedEntry) {
      pokemonStatsList.push(parsedEntry);
      pokemonStatsByDex.set(
        parsedEntry.dex,
        parsedEntry
      );
      pokemonStatsByName.set(
        normalizePokemonName(parsedEntry.name),
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
    normalizePokemonName(name)
  ) ?? null;
}

export function findPokemon(
  value: string | number
): PokemonStatsRecord | null {
  const rawValue = String(value).trim();

  if (!rawValue) {
    return null;
  }

  if (/^\d+$/.test(rawValue)) {
    return getPokemonByDex(Number(rawValue));
  }

  return getPokemonByName(rawValue);
}

export function getAllPokemon(): PokemonStatsRecord[] {
  return [...pokemonStatsList].sort((first, second) =>
    first.name.localeCompare(second.name)
  );
}
