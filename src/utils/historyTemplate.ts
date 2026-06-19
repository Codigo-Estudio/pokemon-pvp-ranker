import Papa from "papaparse";
import { getAllPokemon } from "../data/pokemonGoStats";

const TEMPLATE_COLUMNS = ["pokemon", "dex", "atk", "def", "hp"];

function createTemplateRows() {
  return getAllPokemon().map((pokemon) => ({
    pokemon: pokemon.name,
    dex: pokemon.dex,
    atk: "",
    def: "",
    hp: ""
  }));
}

export function downloadHistoryTemplate() {
  const content = Papa.unparse(createTemplateRows(), {
    columns: TEMPLATE_COLUMNS,
    newline: "\r\n"
  });
  const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "history.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
