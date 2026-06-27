import cpmLevels from "../data/CpmLvl.json";

export const DEFAULT_MAX_LEVEL = 40;

export const CPM = cpmLevels.map((entry) => entry.CPM);

export function getLevelIndex(level: number): number {
	return Math.max(0, Math.round((level - 1) * 2));
}