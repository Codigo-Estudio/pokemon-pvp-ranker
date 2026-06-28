import { useEffect, useMemo, useRef, useState } from "react";

import Icon from "../components/Icon";
import { CPM, DEFAULT_MAX_LEVEL, getLevelIndex } from "../ranking/calculateCore";
import { calculateCp } from "../ranking/cpCalculator";
import { getAllPokemon, getPokemonEvolutionChain, normalizePokemonIdentifier } from "../data/pokemonGoStats";
import { calculateRank } from "../services/rankCalculator";
import { PokemonStatsRecord } from "../types/PokemonBaseStats";

const DEFAULT_IV = 10;
const DEFAULT_LEVEL = 10;
const SEARCH_LIMIT = 10;
const IV_OPTIONS = Array.from({ length: 16 }, (_, value) => value);
const MAX_LEVEL = DEFAULT_MAX_LEVEL + 10;

const leagues = [
  { key: "little", name: "Little League", cpLimit: 500, colorClass: "little", accent: "#0B6C4A", icon: "○", detail: "Máx. 500 PC" },
  { key: "great", name: "Great League", cpLimit: 1500, colorClass: "great", accent: "#1658C4", icon: "△", detail: "Máx. 1500 PC" },
  { key: "ultra", name: "Ultra League", cpLimit: 2500, colorClass: "ultra", accent: "#927400", icon: "▽", detail: "Máx. 2500 PC" },
  { key: "master", name: "Máster League", cpLimit: -1, colorClass: "master", accent: "#4A2A82", icon: "M", detail: "Sin límite" }
] as const;

type LeagueKey = typeof leagues[number]["key"];
type LeagueResult = {
  rank: number;
  cp: number;
  level: number;
  eligible: boolean;
};

type RankingRow = {
  pokemon: PokemonStatsRecord;
  leagues: Record<LeagueKey, LeagueResult>;
};

const allPokemon = getAllPokemon();

function normalizeSearchValue(value: string): string {
  return normalizePokemonIdentifier(value).replace(/_/g, "");
}

function formatTypes(types: string[]): string {
  return types.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(" / ");
}

export default function SingleRankingPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonStatsRecord | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [atk, setAtk] = useState(DEFAULT_IV);
  const [def, setDef] = useState(DEFAULT_IV);
  const [hp, setHp] = useState(DEFAULT_IV);
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [rankingRows, setRankingRows] = useState<RankingRow[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    const trimmedSearch = searchValue.trim();
    const normalizedSearch = normalizeSearchValue(trimmedSearch);

    if (!normalizedSearch) {
      return [];
    }

    return allPokemon
      .filter((pokemon) => {
        const normalizedName = normalizeSearchValue(pokemon.displayName);
        return normalizedName.includes(normalizedSearch) || String(pokemon.dex).includes(trimmedSearch);
      })
      .slice(0, SEARCH_LIMIT);
  }, [searchValue]);

  const currentCp = useMemo(() => {
    if (!selectedPokemon) {
      return 0;
    }

    const levelIndex = Math.min(getLevelIndex(level), CPM.length - 1);

    return calculateCp(
      selectedPokemon.attack,
      selectedPokemon.defense,
      selectedPokemon.stamina,
      atk,
      def,
      hp,
      CPM[levelIndex]
    );
  }, [selectedPokemon, atk, def, hp, level]);

  const evolutionChain = useMemo(() => {
    if (!selectedPokemon) {
      return [];
    }

    return getPokemonEvolutionChain(selectedPokemon);
  }, [selectedPokemon]);

  const sliderProgress = `${((level - 1) / (MAX_LEVEL - 1)) * 100}%`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedPokemon) {
      setRankingRows([]);
      setRankingError(null);
      return;
    }

    let isCancelled = false;

    async function loadRankings() {
      setIsLoadingRankings(true);
      setRankingError(null);

      try {
        const rows = await Promise.all(
          evolutionChain.map(async (pokemon) => {
            const leagueEntries = await Promise.all(
              leagues.map(async (league) => {
                const result = await calculateRank(
                  pokemon.attack,
                  pokemon.defense,
                  pokemon.stamina,
                  atk,
                  def,
                  hp,
                  league.cpLimit
                );

                return [league.key, {
                  rank: result.rank,
                  cp: result.cp,
                  level: result.level,
                  eligible: level <= result.level
                }] as const;
              })
            );

            return {
              pokemon,
              leagues: Object.fromEntries(leagueEntries) as Record<LeagueKey, LeagueResult>
            };
          })
        );

        if (!isCancelled) {
          setRankingRows(rows);
        }
      } catch (error) {
        if (!isCancelled) {
          setRankingRows([]);
          setRankingError(error instanceof Error ? error.message : "No se pudo calcular el ranking.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingRankings(false);
        }
      }
    }

    void loadRankings();

    return () => {
      isCancelled = true;
    };
  }, [selectedPokemon, evolutionChain, atk, def, hp, level]);

  function handlePokemonSelection(pokemon: PokemonStatsRecord) {
    setSelectedPokemon(pokemon);
    setSearchValue(pokemon.displayName);
    setAtk(DEFAULT_IV);
    setDef(DEFAULT_IV);
    setHp(DEFAULT_IV);
    setLevel(DEFAULT_LEVEL);
    setIsSuggestionsOpen(false);
  }

  return (
    <section className="single-ranking-page" aria-label="Ranking individual">
      <header className="single-ranking-page__header">
        <div>
          <h2>Pokédex</h2>
          <p>Consulta el ranking de un Pokémon, sus evoluciones y rendimiento en cada liga.</p>
        </div>
      </header>

      <div className="single-ranking-grid">
        <article className="panel single-ranking-search-panel">
          <h3><span>1.</span> Busca tu Pokémon</h3>
          <div className="single-ranking-search" ref={searchContainerRef}>
            <label className="visually-hidden" htmlFor="single-ranking-search-input">Buscar Pokémon</label>
            <div className="single-ranking-search__input-wrap">
              <Icon name="search" size={18} />
              <input
                id="single-ranking-search-input"
                type="text"
                value={searchValue}
                placeholder="Buscar Pokémon..."
                autoComplete="off"
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setIsSuggestionsOpen(Boolean(event.target.value.trim()));
                }}
                onFocus={() => setIsSuggestionsOpen(Boolean(searchValue.trim()))}
              />
              {searchValue && (
                <button
                  type="button"
                  className="single-ranking-search__clear"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    setSearchValue("");
                    setSelectedPokemon(null);
                    setIsSuggestionsOpen(false);
                  }}
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>

            {isSuggestionsOpen && suggestions.length > 0 && (
              <div className="single-ranking-search__suggestions" role="listbox" aria-label="Coincidencias de Pokémon">
                {suggestions.map((pokemon) => (
                  <button
                    key={`${pokemon.dex}-${pokemon.pokemonId}`}
                    type="button"
                    className={`single-ranking-search__option${selectedPokemon?.dex === pokemon.dex ? " is-selected" : ""}`}
                    onClick={() => handlePokemonSelection(pokemon)}
                  >
                    <strong>{pokemon.displayName}</strong>
                    <span>#{String(pokemon.dex).padStart(4, "0")} · {formatTypes(pokemon.types)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </article>

        <article className="panel single-ranking-ivs-panel">
          <h3><span>2.</span> Selecciona los IVs del Pokémon <small>(opcional)</small></h3>
          <div className="single-ranking-ivs-grid">
            <label>
              <span>Ataque (IV)</span>
              <select value={atk} onChange={(event) => setAtk(Number(event.target.value))}>
                {IV_OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>Defensa (IV)</span>
              <select value={def} onChange={(event) => setDef(Number(event.target.value))}>
                {IV_OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>PS (IV)</span>
              <select value={hp} onChange={(event) => setHp(Number(event.target.value))}>
                {IV_OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
        </article>
      </div>

      <article className="panel single-ranking-level-panel">
        <div className="single-ranking-level-layout">
          <div className="single-ranking-level-controls">
            <h3><span>3.</span> Define el nivel del Pokémon</h3>
            <p>Arrastra el control para ajustar el nivel.</p>
            <div className="single-ranking-slider-wrap" style={{ "--slider-progress": sliderProgress, "--slider-value": String(level) } as React.CSSProperties}>
              <output>{level.toFixed(1)}</output>
              <input
                type="range"
                min={1}
                max={MAX_LEVEL}
                step={0.5}
                value={level}
                onChange={(event) => setLevel(Number(event.target.value))}
                aria-label="Nivel actual del Pokémon"
                disabled={!selectedPokemon}
              />
              <div className="single-ranking-slider-scale" aria-hidden="true">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
              </div>
            </div>
          </div>

          <div className="single-ranking-metrics">
            <article className="single-ranking-metric-card">
              <span>Nivel actual</span>
              <strong>{selectedPokemon ? level.toFixed(1) : "-"}</strong>
              <small>de {MAX_LEVEL.toFixed(1)}</small>
            </article>
            <article className="single-ranking-metric-card">
              <span>PC actual</span>
              <strong>{selectedPokemon ? currentCp : "-"}</strong>
            </article>
            <article className="single-ranking-metric-card">
              <span>IVs actuales</span>
              <strong>{selectedPokemon ? `${atk} / ${def} / ${hp}` : "-"}</strong>
              <small>Ata / Def / PS</small>
            </article>
          </div>
        </div>
      </article>

      <section className="results-section single-ranking-results" aria-label="Ranking del Pokémon y sus evoluciones">
        <div className="single-ranking-results__header">
          <h3><span>4.</span> Ranking del Pokémon y sus evoluciones</h3>
          <div className="single-ranking-results__legend" aria-hidden="true">
            {leagues.map((league) => (
              <div key={league.key} className={`single-ranking-results__legend-item single-ranking-results__legend-item--${league.colorClass}`}>
                <span className="single-ranking-results__legend-icon">{league.icon}</span>
                <div>
                  <strong>{league.name}</strong>
                  <small>{league.detail}</small>
                </div>
              </div>
            ))}
          </div>
          {isLoadingRankings && <p>Calculando rankings...</p>}
          {rankingError && <p className="single-ranking-results__error">{rankingError}</p>}
        </div>

        {!selectedPokemon && (
          <div className="single-ranking-results__empty empty-state">Selecciona un Pokémon para ver su ranking individual.</div>
        )}

        {selectedPokemon && (
          <div className="single-ranking-evolution-list">
            {rankingRows.map((row) => (
              <article key={row.pokemon.dex} className="single-ranking-evolution-card">
                <header className="single-ranking-evolution-card__header">
                  <h4>{row.pokemon.displayName}</h4>
                </header>

                <div className="single-ranking-league-grid">
                  {leagues.map((league) => {
                    const leagueResult = row.leagues[league.key];

                    return (
                      <article
                        key={`${row.pokemon.dex}-${league.key}`}
                        className={`single-ranking-league-card single-ranking-league-card--${league.colorClass}`}
                      >
                        <header className="single-ranking-league-card__header">
                          <div className="single-ranking-league-card__title-row">
                            <span
                              className="single-ranking-league-card__icon"
                              style={{ "--league-accent": league.accent } as React.CSSProperties}
                              aria-hidden="true"
                            >
                              {league.icon}
                            </span>
                            <div>
                              <h5>{league.name}</h5>
                              <p>{league.cpLimit === -1 ? "Sin límite" : `Máx. ${league.cpLimit} PC`}</p>
                            </div>
                          </div>
                        </header>

                        <div className="single-ranking-league-card__body">
                          <div className="single-ranking-league-card__metric">
                            <span>Rank</span>
                            <strong>#{leagueResult.rank}</strong>
                          </div>
                          <div className="single-ranking-league-card__metric">
                            <span>PC máx.</span>
                            <strong>{leagueResult.cp}</strong>
                          </div>
                          <div className="single-ranking-league-card__metric">
                            <span>Nivel</span>
                            <strong>{leagueResult.level.toFixed(1)}</strong>
                          </div>
                          <div className="single-ranking-league-card__metric single-ranking-league-card__metric--status">
                            <span>Estado</span>
                            <strong className={leagueResult.eligible ? "is-success" : "is-error"}>
                              {leagueResult.eligible ? "Aplica" : "No aplica"}
                            </strong>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}