import { describe, expect, it } from "vitest";
import { filasATsv, parsePegado } from "./clipboardGrilla";
import type { FilaPedido } from "../types";

describe("parsePegado", () => {
  it("separa filas por salto de línea y columnas por tab", () => {
    const texto = "2\tAL2P\t108\t80\t32\tOjo con el color\n1\tBM2P\t72\t110\t59\t";
    expect(parsePegado(texto)).toEqual([
      ["2", "AL2P", "108", "80", "32", "Ojo con el color"],
      ["1", "BM2P", "72", "110", "59", ""],
    ]);
  });

  it("ignora saltos de línea finales vacíos (\\r\\n de Excel)", () => {
    const texto = "1\tAL2P\r\n2\tBM2P\r\n\r\n";
    expect(parsePegado(texto)).toEqual([
      ["1", "AL2P"],
      ["2", "BM2P"],
    ]);
  });

  it("una sola celda pegada da una matriz de 1x1", () => {
    expect(parsePegado("AL2P")).toEqual([["AL2P"]]);
  });
});

describe("filasATsv", () => {
  it("arma TSV en el orden Cant, Cód, Alto, Ancho, Prof, Observaciones", () => {
    const filas: FilaPedido[] = [
      { id: 1, cant: 2, cod: "AL2P", alto: 108, ancho: 80, prof: 32, observaciones: "Urgente" },
      { id: 2, cant: 1, cod: "", alto: "", ancho: "", prof: "", observaciones: "" },
    ];
    expect(filasATsv(filas)).toBe("2\tAL2P\t108\t80\t32\tUrgente\n1\t\t\t\t\t");
  });
});
