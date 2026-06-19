import { CPM } from "./calculateCore";

const LEGACY_MAX_LEVEL_INDEX = 100;

export interface RankEntry {
  rank: number;
  atk: number;
  def: number;
  hp: number;
  level: number;
  cp: number;
  statProduct: number;
  attackStat: number;
  defenseStat: number;
  hpStat: number;
}

export function buildRanking(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  leagueCp: number
): RankEntry[] {
  const minLevelIndex = 0;
  const maxLevelIndex =
    leagueCp === -1
      ? Math.min(LEGACY_MAX_LEVEL_INDEX, CPM.length - 1)
      : Math.min(100, CPM.length - 1);

  let currentMaxLevelIndex = maxLevelIndex;

  const ranks: Record<string, RankEntry[]> = {};

  for (let atk = 0; atk <= 15; atk++) {
    for (let def = 0; def <= 15; def++) {
      for (let sta = 0; sta <= 15; sta++) {
        for (let level = currentMaxLevelIndex; level >= minLevelIndex; level--) {
          const cpm = CPM[level];
          const cp = Math.max(
            10,
            Math.floor(
              ((baseAtk + atk) *
                Math.sqrt(baseDef + def) *
                Math.sqrt(baseSta + sta) *
                cpm *
                cpm) /
                10
            )
          );

          const isMaster = leagueCp === -1;

          if (!isMaster && cp > leagueCp) {
            continue;
          }

          if (atk === 0 && def === 0 && sta === 0) {
            currentMaxLevelIndex = level;
          }

          const attackStat = (baseAtk + atk) * cpm;
          const defenseStat = (baseDef + def) * cpm;
          const hpStat = Math.max(
            10,
            Math.floor((baseSta + sta) * cpm)
          );
          const statProduct = Math.round(
            attackStat * defenseStat * hpStat
          );

          const entry: RankEntry = {
            rank: 0,
            atk,
            def,
            hp: sta,
            level: level / 2 + 1,
            cp,
            statProduct,
            attackStat,
            defenseStat,
            hpStat
          };

          const newIndex =
            `${statProduct}.${Math.round(attackStat * 100000)}`;

          if (!ranks[newIndex]) {
            ranks[newIndex] = [entry];
          } else {
            let insertAt = ranks[newIndex].length;

            for (let i = 0; i < ranks[newIndex].length; i++) {
              const existing = ranks[newIndex][i];

              if (hpStat > existing.hpStat) {
                insertAt = i;
                break;
              }

              if (hpStat === existing.hpStat) {
                if (cp > existing.cp) {
                  insertAt = i;
                  break;
                }

                if (cp === existing.cp) {
                  if (sta > existing.hp) {
                    insertAt = i;
                    break;
                  }
                }
              }
            }

            ranks[newIndex].splice(insertAt, 0, entry);
          }

          break;
        }
      }
    }
  }

  const finalRows: RankEntry[] = [];
  let actualRank = 1;

  Object.keys(ranks)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      for (const row of ranks[key]) {
        row.rank = actualRank++;
        finalRows.push(row);
      }
    });

  return finalRows;
}
