import { FILAS_COLUMNAS, type FilaPedido } from "../types";

/** Parsea texto pegado desde Excel (TSV: filas por salto de línea, columnas por tab). */
export function parsePegado(texto: string): string[][] {
  const limpio = texto.replace(/\r/g, "");
  const lineas = limpio.split("\n");
  while (lineas.length && lineas[lineas.length - 1] === "") lineas.pop();
  return lineas.map((linea) => linea.split("\t"));
}

/** Arma el mismo formato TSV a partir de las filas de la grilla, para copiar a Excel. */
export function filasATsv(filas: FilaPedido[]): string {
  return filas.map((f) => FILAS_COLUMNAS.map((col) => String(f[col] ?? "")).join("\t")).join("\n");
}
