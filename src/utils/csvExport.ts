import Papa from "papaparse";

import { PokemonRecord } from "../types/PokemonRecord";

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
  const csv = Papa.unparse(rows);
  const blob = createCsvBlob(csv);
  const link = createDownloadLink(
    blob,
    filename
  );

  link.click();
  URL.revokeObjectURL(link.href);
}