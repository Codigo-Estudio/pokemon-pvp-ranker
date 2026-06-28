import { CPM, DEFAULT_MAX_LEVEL, getLevelIndex } from "./calculateCore";
import { calculateCp } from "./cpCalculator";

import { RankEntry } from "../types/RankEntry";

const INDIVIDUAL_VALUE_CAP = 15;
const MASTER_LEAGUE_CP = -1;
const MAX_LEVEL_INDEX = Math.min(getLevelIndex(DEFAULT_MAX_LEVEL), CPM.length - 1);

function createRankEntry(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  atk: number,
  def: number,
  sta: number,
  levelIndex: number,
  cp: number,
  cpm: number
): RankEntry {
  const attackStat = (baseAtk + atk) * cpm;
  const defenseStat = (baseDef + def) * cpm;
  const hpStat = Math.floor((baseSta + sta) * cpm);
  const statProduct =
    attackStat * defenseStat * hpStat
    ;

  return {
    rank: 0,
    atk,
    def,
    hp: sta,
    level: levelIndex / 2 + 1,
    cp,
    statProduct,
    attackStat,
    defenseStat,
    hpStat
  };
}

function compareRankEntries(
  first: RankEntry,
  second: RankEntry
): boolean {
  if (first.statProduct !== second.statProduct) {
    return first.statProduct > second.statProduct;
  }

  if (first.attackStat !== second.attackStat) {
    return first.attackStat > second.attackStat;
  }

  if (first.hpStat !== second.hpStat) {
    return first.hpStat > second.hpStat;
  }

  if (first.cp !== second.cp) {
    return first.cp > second.cp;
  }

  return first.hp > second.hp;
}

function findBestLevelIndex(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  atk: number,
  def: number,
  sta: number,
  leagueCp: number
): number {
  if (leagueCp === MASTER_LEAGUE_CP) {
    return MAX_LEVEL_INDEX;
  }

  for (let levelIndex = MAX_LEVEL_INDEX; levelIndex >= 0; levelIndex--) {
    const cp = calculateCp(baseAtk, baseDef, baseSta, atk, def, sta, CPM[levelIndex]);

    if (cp <= leagueCp) {
      return levelIndex;
    }
  }

  return 0;
}

export function buildRanking(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  leagueCp: number
): RankEntry[] {
  const ranks: RankEntry[] = [];

  for (let atk = 0; atk <= INDIVIDUAL_VALUE_CAP; atk++) {
    for (let def = 0; def <= INDIVIDUAL_VALUE_CAP; def++) {
      for (let sta = 0; sta <= INDIVIDUAL_VALUE_CAP; sta++) {
        const levelIndex = findBestLevelIndex(
          baseAtk,
          baseDef,
          baseSta,
          atk,
          def,
          sta,
          leagueCp
        );
        const cpm = CPM[levelIndex];
        const cp = calculateCp(baseAtk, baseDef, baseSta, atk, def, sta, cpm);

        ranks.push(
          createRankEntry(
            baseAtk,
            baseDef,
            baseSta,
            atk,
            def,
            sta,
            levelIndex,
            cp,
            cpm
          )
        );
      }
    }
  }

  ranks.sort((first, second) => {
    if (compareRankEntries(first, second)) {
      return -1;
    }

    if (compareRankEntries(second, first)) {
      return 1;
    }

    return 0;
  });

  ranks.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return ranks;
}
