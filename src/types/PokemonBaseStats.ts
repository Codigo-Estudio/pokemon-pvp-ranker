export interface PokemonBaseStats {
  attack: number;
  defense: number;
  stamina: number;
}

export interface PokemonStatsRecord
  extends PokemonBaseStats {
  dex: number;
  baseDex: number;
  pokemonId: string;
  displayName: string;
}