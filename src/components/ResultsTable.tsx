import { PokemonRecord }
from "../types/PokemonRecord";

type Props = {
  data: PokemonRecord[];
};

export default function ResultsTable({
  data
}: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Dex</th>
          <th>Name</th>

          <th>Atk</th>
          <th>Def</th>
          <th>HP</th>

          <th>Rank</th>
          <th>Level</th>
          <th>CP</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.dex}</td>
            <td>{row.name}</td>

            <td>{row.atk}</td>
            <td>{row.def}</td>
            <td>{row.hp}</td>

            <td>{row.rank}</td>
            <td>{row.level}</td>
            <td>{row.cp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}