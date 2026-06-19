import Papa from "papaparse";

import { PokemonRecord } from "../types/PokemonRecord";

const CSV_COLUMNS: Array<keyof PokemonRecord | "name"> = [
  "dex",
  "name",
  "rank",
  "level",
  "cp",
  "atk",
  "def",
  "hp"
];

function buildCsvRows(
  rows: PokemonRecord[]
): Array<Record<string, string | number | undefined>> {
  return rows.map((row) =>
    CSV_COLUMNS.reduce<
      Record<string, string | number | undefined>
    >(
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

export function downloadCsv(
  rows: PokemonRecord[],
  filename: string
) {
  const csv = Papa.unparse(buildCsvRows(rows), {
    columns: CSV_COLUMNS
  });
  const blob = createCsvBlob(csv);
  const link = createDownloadLink(
    blob,
    filename
  );

  link.click();
  URL.revokeObjectURL(link.href);
}