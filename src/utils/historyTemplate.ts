import Papa from "papaparse";

const TEMPLATE_COLUMNS = ["dex", "atk", "def", "hp"];

export function downloadHistoryTemplate() {
  const content = Papa.unparse([TEMPLATE_COLUMNS], {
    header: false,
    newline: "\r\n"
  });
  const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "history.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
