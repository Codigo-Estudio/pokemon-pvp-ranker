import {
  buildRanking
} from "../ranking/rankingEngine";

import {
  rankingCache
} from "../ranking/rankingCache";

import {
  type RankEntry
} from "../types/RankEntry";

import { RankResult } from "../types/RankResult";

export async function calculateRank(

  attack: number,
  defense: number,
  stamina: number,

  atk: number,
  def: number,
  hp: number,

  leagueCp: number

): Promise<RankResult> {

  const ranking =
    getOrBuildRanking(
      attack,
      defense,
      stamina,
      leagueCp
    );

  const row =
    findRankEntry(
      ranking,
      atk,
      def,
      hp
    );

  if (!row) {
    throw new Error(
      "Ranking not found"
    );
  }

  return mapRankEntryToResult(row);
}

function getRankingCacheKey(
  attack: number,
  defense: number,
  stamina: number,
  leagueCp: number
): string {

  const key =
    `${attack}_${defense}_${stamina}_${leagueCp}`;

  return key;
}

function getOrBuildRanking(
  attack: number,
  defense: number,
  stamina: number,
  leagueCp: number
): RankEntry[] {
  const key =
    getRankingCacheKey(
      attack,
      defense,
      stamina,
      leagueCp
    );

  let ranking =
    rankingCache.get(key);

  if (!ranking) {

    ranking =
      buildRanking(
        attack,
        defense,
        stamina,
        leagueCp
      );

    rankingCache.set(
      key,
      ranking
    );
  }

  return ranking;
}

function findRankEntry(
  ranking: RankEntry[],
  atk: number,
  def: number,
  hp: number
): RankEntry | undefined {
  return ranking.find(
    (entry: RankEntry) =>
      entry.atk === Number(atk) &&
      entry.def === Number(def) &&
      entry.hp === Number(hp)
  );
}

function mapRankEntryToResult(
  row: RankEntry
): RankResult {
  return {
    rank: row.rank,
    level: row.level,
    cp: row.cp,
    statProduct: row.statProduct
  };
}