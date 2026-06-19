import Papa from "papaparse";

import { PokemonRecord } from "../types/PokemonRecord";

export function parseCsv(
  file: File
): Promise<PokemonRecord[]> {

  return new Promise((resolve, reject) => {

    Papa.parse(file, {

      header: true,

      skipEmptyLines: true,

      complete(results) {
        resolve(results.data as PokemonRecord[]);
      },

      error(error) {
        reject(error);
      }
    });

  });

}