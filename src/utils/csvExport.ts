import Papa from "papaparse";

import { PokemonRecord } from "../types/PokemonRecord";

const RESULT_COLUMNS: Array<keyof PokemonRecord | "name"> = [
  "dex",
  "name",
  "rank",
  "level",
  "cp",
  "atk",
  "def",
  "hp"
] as const;

function buildResultRows(
  rows: PokemonRecord[]
): Array<Record<string, string | number | undefined>> {
  return rows.map((row) =>
    RESULT_COLUMNS.reduce<Record<string, string | number | undefined>>(
      (result, column) => {
        result[column] = row[column];
        return result;
      },
      {}
    )
  );
}

function createCsvBlob(
  csvContent: string
): Blob {
  return new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;"
    }
  );
}

function createDownloadLink(
  blob: Blob,
  filename: string
): HTMLAnchorElement {
  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);
  link.download = filename;

  return link;
}

function ensureCsvExtension(
  filename: string
): string {
  return filename.toLowerCase().endsWith(".csv")
    ? filename
    : filename.replace(/\.xlsx$/i, "") + ".csv";
}

export function downloadCsv(
  rows: PokemonRecord[],
  filename: string
) {
  const csv = Papa.unparse(buildResultRows(rows), {
    columns: RESULT_COLUMNS,
    newline: "\r\n"
  });
  const blob = createCsvBlob(csv);
  const link = createDownloadLink(
    blob,
    ensureCsvExtension(filename)
  );

  link.click();
  URL.revokeObjectURL(link.href);
}