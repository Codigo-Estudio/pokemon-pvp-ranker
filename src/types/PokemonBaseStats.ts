export interface PokemonBaseStats {
  attack: number;
  defense: number;
  stamina: number;
}

export interface PokemonStatsRecord
  extends PokemonBaseStats {
  dex: number;
  name: string;
}