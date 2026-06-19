import { pokeListObj } from "./pokeListObj";

import { PokemonStatsRecord } from "../types/PokemonBaseStats";

const pokemonStatsByDex =
  new Map<number, PokemonStatsRecord>();

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
    name,
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
      pokemonStatsByDex.set(
        parsedEntry.dex,
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