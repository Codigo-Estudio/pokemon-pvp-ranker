export const leagueIconByKey = {
  little: "/custom-assets/little.png",
  great: "/custom-assets/super.png",
  ultra: "/custom-assets/ultra.png",
  master: "/custom-assets/master.png"
} as const;

export type LeagueAssetKey = keyof typeof leagueIconByKey;

export function getLeagueIconSrc(league: LeagueAssetKey): string {
  return leagueIconByKey[league];
}