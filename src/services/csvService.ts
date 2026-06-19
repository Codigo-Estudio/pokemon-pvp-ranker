import Papa from "papaparse";

import { PokemonRecord } from "../types/PokemonRecord";
import { ProcessingIssue } from "../types/ProcessingSummary";
import { findPokemon } from "../data/pokemonGoStats";

export type CsvParseResult = {
  records: PokemonRecord[];
  sourceRows: number[];
  issues: ProcessingIssue[];
  total: number;
};

const REQUIRED_COLUMNS = ["atk", "def", "hp"] as const;
const POKEMON_IDENTIFIER_COLUMNS = ["dex", "pokemon"] as const;
const DEX_OR_NAME_PATTERN = /^[A-Za-z0-9 ]+$/;

function normalizeColumnName(columnName: string): string {
  return columnName
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();
}

function isUnusedTemplateRow(row: Record<string, unknown>): boolean {
  return [...POKEMON_IDENTIFIER_COLUMNS, ...REQUIRED_COLUMNS].every((column) =>
    row[column] === undefined || row[column] === null || String(row[column]).trim() === ""
  );
}

function getPokemonIdentifier(
  row: Record<string, unknown>
): string {
  const dexValue = String(row.dex ?? "").trim();

  if (dexValue) {
    return dexValue;
  }

  return String(row.pokemon ?? "").trim();
}

function buildRowNumber(index: number): number {
  return index + 2;
}

function createIssue(
  index: number,
  column: string,
  detail: string
): ProcessingIssue {
  return {
    row: buildRowNumber(index),
    column,
    detail
  };
}

function validateRow(
  row: Record<string, unknown>,
  index: number
): ProcessingIssue | null {
  const pokemonIdentifier = getPokemonIdentifier(row);

  if (!pokemonIdentifier) {
    return createIssue(index, "dex", "Debes indicar un número de Dex o un nombre de Pokémon");
  }

  if (!DEX_OR_NAME_PATTERN.test(pokemonIdentifier)) {
    return createIssue(
      index,
      "dex",
      `Formato inválido: “${pokemonIdentifier}”. Solo se aceptan letras, números o espacios sin puntos ni comas`
    );
  }

  if (!findPokemon(pokemonIdentifier)) {
    return createIssue(index, "dex", `No existe un Pokémon para el valor “${pokemonIdentifier}”`);
  }

  for (const column of REQUIRED_COLUMNS) {
    const value = row[column];
    if (value === undefined || value === null || String(value).trim() === "") {
      return createIssue(index, column, "Valor vacío");
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || !Number.isInteger(numericValue)) {
      return createIssue(index, column, `Valor no numérico entero: “${String(value)}”`);
    }

    const maximum = 15;
    const minimum = 0;
    if (numericValue < minimum || numericValue > maximum) {
      return createIssue(index, column, `Valor fuera de rango (${minimum}-${maximum}): ${numericValue}`);
    }
  }

  return null;
}

export function parseCsv(
  file: File
): Promise<CsvParseResult> {

  return new Promise((resolve, reject) => {

    Papa.parse(file, {

      header: true,

      transformHeader: normalizeColumnName,

      skipEmptyLines: true,

      complete(results) {
        const rows = results.data as Array<Record<string, unknown>>;
        const fields = results.meta.fields ?? [];
        const missingColumn = REQUIRED_COLUMNS.find((column) => !fields.includes(column));

        if (!fields.includes("dex") && !fields.includes("pokemon")) {
          reject(new Error("El archivo debe contener la columna “dex” o la columna “pokemon”."));
          return;
        }

        if (missingColumn) {
          reject(new Error(`El archivo no contiene la columna obligatoria “${missingColumn}”.`));
          return;
        }

        const issues: ProcessingIssue[] = [];
        const records: PokemonRecord[] = [];
        const sourceRows: number[] = [];
        let total = 0;

        rows.forEach((row, index) => {
          if (isUnusedTemplateRow(row)) return;
          total += 1;

          const issue = validateRow(row, index);
          if (issue) {
            issues.push(issue);
            return;
          }

          const pokemonIdentifier = getPokemonIdentifier(row);
          const pokemon = findPokemon(pokemonIdentifier) as NonNullable<ReturnType<typeof findPokemon>>;

          records.push({
            dex: pokemon.dex,
            atk: Number(row.atk),
            def: Number(row.def),
            hp: Number(row.hp),
            shadow: Number(row.shadow ?? 0),
            gl_evo: row.gl_evo ? String(row.gl_evo) : undefined
          });
          sourceRows.push(buildRowNumber(index));
        });

        resolve({ records, sourceRows, issues, total });
      },

      error(error) {
        reject(error);
      }
    });

  });

}
