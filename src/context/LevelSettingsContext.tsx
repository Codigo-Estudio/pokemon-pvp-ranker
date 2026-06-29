import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { DEFAULT_MAX_LEVEL } from "../ranking/calculateCore";

type LevelSettingsState = {
  enableXL: boolean;
  bestBuddy: boolean;
};

type LevelSettingsContextValue = LevelSettingsState & {
  maxLevel: number;
  setEnableXL: (value: boolean) => void;
  setBestBuddy: (value: boolean) => void;
};

const STORAGE_KEY = "poke-pvp-level-settings";

const defaultState: LevelSettingsState = {
  enableXL: false,
  bestBuddy: false
};

const LevelSettingsContext = createContext<LevelSettingsContextValue | null>(null);

function parseStoredSettings(value: string | null): LevelSettingsState {
  if (!value) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(value) as Partial<LevelSettingsState>;
    const enableXL = Boolean(parsed.enableXL);
    const bestBuddy = enableXL ? Boolean(parsed.bestBuddy) : false;

    return {
      enableXL,
      bestBuddy
    };
  } catch {
    return defaultState;
  }
}

function resolveMaxLevel({ enableXL, bestBuddy }: LevelSettingsState): number {
  if (!enableXL) {
    return DEFAULT_MAX_LEVEL;
  }

  return bestBuddy ? 51 : 50;
}

export function LevelSettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LevelSettingsState>(() => parseStoredSettings(sessionStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<LevelSettingsContextValue>(() => ({
    ...state,
    maxLevel: resolveMaxLevel(state),
    setEnableXL: (enableXL) => {
      setState((current) => ({
        enableXL,
        bestBuddy: enableXL ? current.bestBuddy : false
      }));
    },
    setBestBuddy: (bestBuddy) => {
      setState((current) => ({
        enableXL: current.enableXL,
        bestBuddy: current.enableXL ? bestBuddy : false
      }));
    }
  }), [state]);

  return <LevelSettingsContext.Provider value={value}>{children}</LevelSettingsContext.Provider>;
}

export function useLevelSettings() {
  const context = useContext(LevelSettingsContext);

  if (!context) {
    throw new Error("useLevelSettings must be used within LevelSettingsProvider");
  }

  return context;
}