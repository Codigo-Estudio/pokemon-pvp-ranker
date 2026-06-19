import Papa from "papaparse";

const TEMPLATE_COLUMNS = [
  "dex",
  "atk",
  "def",
  "hp"
] as const;

function buildTemplateCsv(): string {
  return Papa.unparse(
    [TEMPLATE_COLUMNS],
    {
      header: false,
      newline: "\r\n"
    }
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
  _rows: unknown[],
  filename: string
) {
  const csv = buildTemplateCsv();
  const blob = createCsvBlob(csv);
  const link = createDownloadLink(
    blob,
    ensureCsvExtension(filename)
  );

  link.click();
  URL.revokeObjectURL(link.href);
}