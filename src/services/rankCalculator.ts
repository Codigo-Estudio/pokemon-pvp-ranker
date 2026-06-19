import {
  buildRanking
} from "../ranking/rankingEngine";

import {
  rankingCache
} from "../ranking/rankingCache";

import {
  type RankEntry
} from "../ranking/rankingEngine";

export interface RankResult {
  rank: number;
  level: number;
  cp: number;
}

export async function calculateRank(

  attack: number,
  defense: number,
  stamina: number,

  atk: number,
  def: number,
  hp: number,

  leagueCp: number

): Promise<RankResult> {

  const key =
    `${attack}_${defense}_${stamina}_${leagueCp}`;

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

  const row =
    ranking.find(
      (x: RankEntry) =>
        Number(x.atk) === Number(atk) &&
        Number(x.def) === Number(def) &&
        Number(x.hp) === Number(hp)
    );
  if (!row) {
    throw new Error(
      "Ranking not found"
    );
  }
  return {
    rank: row.rank,
    level: row.level,
    cp: row.cp
  };

}