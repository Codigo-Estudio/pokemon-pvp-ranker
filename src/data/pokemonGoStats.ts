import { pokeListObj } from "./pokeListObj";

export interface PokemonGoStats {
  name: string;
  attack: number;
  defense: number;
  stamina: number;
}

const cache = new Map<number, PokemonGoStats>();

Object.entries(pokeListObj).forEach(
  ([name, value]) => {

    const parts =
      String(value).split(",");

    const dexRaw =
      parts[0];

    const attack =
      Number(parts[1]);

    const defense =
      Number(parts[2]);

    const stamina =
      Number(parts[3]);

    const dex =
      Number(
        dexRaw.match(/\d+/)?.[0]
      );

    cache.set(dex, {
      name,
      attack,
      defense,
      stamina
    });

  }
);

export function getPokemonByDex(
  dex: number
): PokemonGoStats | null {

  return cache.get(dex) ?? null;

}