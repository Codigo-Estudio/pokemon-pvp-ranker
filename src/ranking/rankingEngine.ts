import { CPM } from "./calculateCore";

import { RankEntry } from "../types/RankEntry";

const LEGACY_MAX_LEVEL_INDEX = 100;
const INDIVIDUAL_VALUE_CAP = 15;
const MASTER_LEAGUE_CP = -1;

function getMaxLevelIndex(
  leagueCp: number
): number {
  return leagueCp === MASTER_LEAGUE_CP
    ? Math.min(LEGACY_MAX_LEVEL_INDEX, CPM.length - 1)
    : Math.min(LEGACY_MAX_LEVEL_INDEX, CPM.length - 1);
}

function calculateCp(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  atk: number,
  def: number,
  sta: number,
  cpm: number
): number {
  return Math.max(
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
}

function createRankEntry(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  atk: number,
  def: number,
  sta: number,
  level: number,
  cp: number,
  cpm: number
): RankEntry {
  const attackStat = (baseAtk + atk) * cpm;
  const defenseStat = (baseDef + def) * cpm;
  const hpStat = Math.max(
    10,
    Math.floor((baseSta + sta) * cpm)
  );
  const statProduct = Math.round(
    attackStat * defenseStat * hpStat
  );

  return {
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
}

function buildBucketKey(
  entry: RankEntry
): string {
  return `${entry.statProduct}.${Math.round(entry.attackStat * 100000)}`;
}

function shouldInsertBefore(
  candidate: RankEntry,
  current: RankEntry
): boolean {
  if (candidate.hpStat !== current.hpStat) {
    return candidate.hpStat > current.hpStat;
  }

  if (candidate.cp !== current.cp) {
    return candidate.cp > current.cp;
  }

  return candidate.hp > current.hp;
}

function insertEntry(
  bucket: RankEntry[],
  entry: RankEntry
): void {
  let insertAt = bucket.length;

  for (let index = 0; index < bucket.length; index++) {
    if (shouldInsertBefore(entry, bucket[index])) {
      insertAt = index;
      break;
    }
  }

  bucket.splice(insertAt, 0, entry);
}

function assignRanks(
  buckets: Record<string, RankEntry[]>
): RankEntry[] {
  const finalRows: RankEntry[] = [];
  let actualRank = 1;

  Object.keys(buckets)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      for (const row of buckets[key]) {
        row.rank = actualRank++;
        finalRows.push(row);
      }
    });

  return finalRows;
}

export function buildRanking(
  baseAtk: number,
  baseDef: number,
  baseSta: number,
  leagueCp: number
): RankEntry[] {
  const minLevelIndex = 0;
  const maxLevelIndex =
    getMaxLevelIndex(leagueCp);

  let currentMaxLevelIndex = maxLevelIndex;

  const ranks: Record<string, RankEntry[]> = {};

  for (let atk = 0; atk <= INDIVIDUAL_VALUE_CAP; atk++) {
    for (let def = 0; def <= INDIVIDUAL_VALUE_CAP; def++) {
      for (let sta = 0; sta <= INDIVIDUAL_VALUE_CAP; sta++) {
        for (let level = currentMaxLevelIndex; level >= minLevelIndex; level--) {
          const cpm = CPM[level];
          const cp = calculateCp(
            baseAtk,
            baseDef,
            baseSta,
            atk,
            def,
            sta,
            cpm
          );

          const isMaster = leagueCp === MASTER_LEAGUE_CP;

          if (!isMaster && cp > leagueCp) {
            continue;
          }

          if (atk === 0 && def === 0 && sta === 0) {
            currentMaxLevelIndex = level;
          }

          const entry = createRankEntry(
            baseAtk,
            baseDef,
            baseSta,
            atk,
            def,
            sta,
            level,
            cp,
            cpm
          );

          const bucketKey = buildBucketKey(entry);

          if (!ranks[bucketKey]) {
            ranks[bucketKey] = [entry];
          } else {
            insertEntry(ranks[bucketKey], entry);
          }

          break;
        }
      }
    }
  }

  return assignRanks(ranks);
}
