import Papa from "papaparse";

export function downloadCsv(
  rows: any[],
  filename: string
) {

  const csv = Papa.unparse(rows);

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download = filename;

  link.click();
}