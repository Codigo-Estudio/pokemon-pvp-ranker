export interface PokemonBaseStats {
  attack: number;
  defense: number;
  stamina: number;
}

export const pokemonStats: Record<
  string,
  PokemonBaseStats
> = {
  pikachu: {
    attack: 112,
    defense: 96,
    stamina: 111
  },

  pichu: {
    attack: 77,
    defense: 53,
    stamina: 85
  }
};