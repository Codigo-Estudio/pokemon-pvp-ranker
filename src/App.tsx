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

import {
    getPokemonByDex
}
    from "./data/pokemonGoStats";

export default function App() {

    const [rows, setRows] =
        useState<PokemonRecord[]>([]);

    const [progress, setProgress] =
        useState(0);

    const [leagueCp,
        setLeagueCp] =
        useState(1500);

    async function processFile(
        file: File
    ) {

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

            const row =
                records[i];

            const pokemon =
                getPokemonByDex(
                    Number(row.dex)
                );
            if (!pokemon) {

                console.error(
                    `Pokemon dex ${row.dex} not found`
                );

                continue;

            }
            const rankResult =
                await calculateRank(

                    pokemon.attack,
                    pokemon.defense,
                    pokemon.stamina,

                    Number(row.atk),
                    Number(row.def),
                    Number(row.hp),

                    leagueCp
                );
            
            processed.push({

                ...row,

                name: pokemon.name,

                rank:
                    rankResult.rank,

                level:
                    rankResult.level,

                cp:
                    rankResult.cp

            });
            
            setProgress(
                Math.round(
                    ((i + 1) / total)
                    * 100
                )
            );
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