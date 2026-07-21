import Papa from "papaparse";
import { CAT_KEYS, type Modulo } from "../types";

export function parseCatalogoCsv(csvText: string): Modulo[] {
  const parsed = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors?.length) {
    const first = parsed.errors[0];
    throw new Error(`No se pudo interpretar el CSV (fila ${first.row ?? "?"}: ${first.message}).`);
  }

  if (!parsed.data?.length) {
    throw new Error("El contenido está vacío o no tiene formato de tabla.");
  }

  const filas: Modulo[] = [];
  for (const row of parsed.data) {
    const norm: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      norm[key.trim()] = row[key];
    }
    if (!norm.Cod) continue;

    const modulo = {
      Cod: String(norm.Cod).trim(),
      Detalle: norm.Detalle ?? "",
    } as Modulo;

    for (const k of CAT_KEYS) {
      const raw = norm[k];
      const n = parseFloat(String(raw ?? "0").replace(",", "."));
      (modulo as unknown as Record<string, number>)[k] = isNaN(n) ? 0 : n;
    }
    filas.push(modulo);
  }

  if (!filas.length) {
    throw new Error("No encontré ninguna fila con la columna 'Cod' cargada.");
  }

  return filas;
}
