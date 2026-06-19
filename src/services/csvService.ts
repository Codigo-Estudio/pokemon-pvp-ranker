import Papa from "papaparse";

import { PokemonRecord } from "../types/PokemonRecord";
import { ProcessingIssue } from "../types/ProcessingSummary";

export type CsvParseResult = {
  records: PokemonRecord[];
  sourceRows: number[];
  issues: ProcessingIssue[];
  total: number;
};

const REQUIRED_COLUMNS = ["dex", "atk", "def", "hp"] as const;

function normalizeColumnName(columnName: string): string {
  return columnName
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();
}

function isUnusedTemplateRow(row: Record<string, unknown>): boolean {
  return ["atk", "def", "hp"].every((column) =>
    row[column] === undefined || row[column] === null || String(row[column]).trim() === ""
  );
}

function validateRow(
  row: Record<string, unknown>,
  index: number
): ProcessingIssue | null {
  for (const column of REQUIRED_COLUMNS) {
    const value = row[column];
    if (value === undefined || value === null || String(value).trim() === "") {
      return { row: index + 2, column, detail: "Valor vacío" };
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || !Number.isInteger(numericValue)) {
      return { row: index + 2, column, detail: `Valor no numérico entero: “${String(value)}”` };
    }

    const maximum = column === "dex" ? Number.MAX_SAFE_INTEGER : 15;
    const minimum = column === "dex" ? 1 : 0;
    if (numericValue < minimum || numericValue > maximum) {
      return { row: index + 2, column, detail: `Valor fuera de rango (${minimum}-${maximum === Number.MAX_SAFE_INTEGER ? "∞" : maximum}): ${numericValue}` };
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

          records.push({
            dex: Number(row.dex),
            atk: Number(row.atk),
            def: Number(row.def),
            hp: Number(row.hp),
            shadow: Number(row.shadow ?? 0),
            gl_evo: row.gl_evo ? String(row.gl_evo) : undefined
          });
          sourceRows.push(index + 2);
        });

        resolve({ records, sourceRows, issues, total });
      },

      error(error) {
        reject(error);
      }
    });

  });

}
