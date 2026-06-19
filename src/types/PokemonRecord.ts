export interface PokemonRecord {
  dex: number;

  atk: number;
  def: number;
  hp: number;

  shadow: number;

  gl_evo?: string;

  name?: string;

  rank?: number;
  level?: number;
  cp?: number;
}
