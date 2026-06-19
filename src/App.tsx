import { useState } from "react";

import CsvUploader
    from "./components/CsvUploader";

import ResultsTable
    from "./components/ResultsTable";

import DownloadButton
    from "./components/DownloadButton";

import ProgressBar
    from "./components/ProgressBar";

import { parseCsv }
    from "./services/csvService";

import {
    calculateRank
}
    from "./services/rankCalculator";

import {
    downloadCsv
}
    from "./utils/csvExport";

import {
    PokemonRecord
}
    from "./types/PokemonRecord";

import { RankResult } from "./types/RankResult";

import {
    getPokemonByDex
}
    from "./data/pokemonGoStats";

const DEFAULT_LEAGUE_CP = 1500;

type RankedPokemonRecord = PokemonRecord;

function mapRecordWithRank(
    row: PokemonRecord,
    pokemonName: string,
    rank: RankResult
): RankedPokemonRecord {
    return {
        ...row,
        name: pokemonName,
        rank: rank.rank,
        level: rank.level,
        cp: rank.cp
    };
}

export default function App() {

    const [rows, setRows] =
        useState<PokemonRecord[]>([]);

    const [progress, setProgress] =
        useState(0);

    const [leagueCp,
        setLeagueCp] =
        useState(DEFAULT_LEAGUE_CP);

    async function rankPokemonRecord(
        row: PokemonRecord,
        selectedLeagueCp: number
    ): Promise<RankedPokemonRecord | null> {
        const pokemon =
            getPokemonByDex(
                Number(row.dex)
            );

        if (!pokemon) {
            console.error(
                `Pokemon dex ${row.dex} not found`
            );
            return null;
        }

        const rankResult =
            await calculateRank(
                pokemon.attack,
                pokemon.defense,
                pokemon.stamina,
                Number(row.atk),
                Number(row.def),
                Number(row.hp),
                selectedLeagueCp
            );

        return mapRecordWithRank(
            row,
            pokemon.name,
            rankResult
        );
    }

    function updateProgress(
        currentIndex: number,
        total: number
    ) {
        setProgress(
            Math.round(
                ((currentIndex + 1) / total) * 100
            )
        );
    }

    async function processFile(
        file: File
    ) {

        setProgress(0);

        const records =
            await parseCsv(file);

        const total =
            records.length;

        const processed:
            PokemonRecord[] = [];

        for (
            let i = 0;
            i < total;
            i++
        ) {
            const rankedRecord =
                await rankPokemonRecord(
                    records[i],
                    leagueCp
                );

            if (rankedRecord) {
                processed.push(rankedRecord);
            }

            updateProgress(i, total);
        }

        setRows(processed);
    }

    return (

        <div>

            <h1>
                Pokemon PvP Ranker
            </h1>

            <select
                value={leagueCp}
                onChange={(e) =>
                    setLeagueCp(
                        Number(e.target.value)
                    )
                }
            >
                <option value={500}>
                    Little
                </option>

                <option value={1500}>
                    Great
                </option>

                <option value={2500}>
                    Ultra
                </option>

                <option value={-1}>
                    Master
                </option>
            </select>

            <CsvUploader
                onFileSelected={
                    processFile
                }
            />

            <ProgressBar
                value={progress}
            />

            <ResultsTable
                data={rows}
            />

            {
                rows.length > 0 &&
                (
                    <DownloadButton
                        onClick={() =>
                            downloadCsv(
                                rows,
                                "pokemon-ranked.csv"
                            )
                        }
                    />
                )
            }

        </div>

    );
}