import { PokemonRecord }
from "../types/PokemonRecord";

type Props = {
  data: PokemonRecord[];
};

type ColumnDefinition = {
  key: keyof PokemonRecord | "name";
  label: string;
};

const RESULT_COLUMNS: ColumnDefinition[] = [
  { key: "dex", label: "Dex" },
  { key: "name", label: "Name" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "hp", label: "HP" },
  { key: "rank", label: "Rank" },
  { key: "level", label: "Level" },
  { key: "cp", label: "CP" }
];

function buildRowKey(
  row: PokemonRecord,
  index: number
): string {
  return `${row.dex}-${row.atk}-${row.def}-${row.hp}-${index}`;
}

function renderCellValue(
  row: PokemonRecord,
  columnKey: ColumnDefinition["key"]
): React.ReactNode {
  return row[columnKey] ?? "-";
}

export default function ResultsTable({
  data
}: Props) {
  return (
    <table>
      <thead>
        <tr>
          {RESULT_COLUMNS.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={buildRowKey(row, index)}>
            {RESULT_COLUMNS.map((column) => (
              <td key={column.key}>
                {renderCellValue(row, column.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}