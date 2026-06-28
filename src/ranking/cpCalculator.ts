export function calculateCp(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  atk: number,
  def: number,
  sta: number,
  cpm: number
): number {
  return Math.floor(
    ((baseAtk + atk) *
      Math.sqrt(baseDef + def) *
      Math.sqrt(baseSta + sta) *
      cpm *
      cpm) /
    10
  );
}