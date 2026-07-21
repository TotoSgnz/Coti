import { describe, expect, it } from "vitest";
import { calcularPiezas, extraerNumeroPF, tramoEstAL, tramoEstDS } from "./materiaPrima";
import type { Modulo, Piezas } from "../types";

function modulo(overrides: Partial<Modulo>): Modulo {
  return {
    Cod: "",
    Detalle: "",
    "Piso/Techo": 0,
    Laterales: 0,
    Fajas: 0,
    "Est AL": 0,
    "Est BM": 0,
    "Est DS": 0,
    "Pie Estante": 0,
    Fondo: 0,
    Frentes: 0,
    Parante: 0,
    PF: 0,
    ...overrides,
  };
}

function expectClose(got: Piezas, expected: Partial<Piezas>) {
  for (const key of Object.keys(expected) as (keyof Piezas)[]) {
    expect(got[key]).toBeCloseTo(expected[key] as number, 3);
  }
}

describe("calcularPiezas — casos validados contra el Excel original", () => {
  it("ALB — Alacena Banderola", () => {
    const m = modulo({
      Cod: "ALB",
      "Piso/Techo": 2,
      Laterales: 2,
      Fajas: 1,
      "Est AL": 1,
      "Pie Estante": 1,
      Fondo: 1,
      Frentes: 1,
    });
    const piezas = calcularPiezas(m, 36, 100, 32);
    expectClose(piezas, {
      pisoTecho: 0.64,
      lateral: 0.2304,
      faja: 0.08,
      estAL: 0,
      estBM: 0,
      estDS: 0,
      pieEstante: 0,
      fondo: 0.36,
      frentes: 0.36,
      parante: 0,
      pf: 0,
    });
  });

  it("AL1PI — Alacena 1 Puerta Izq", () => {
    const m = modulo({
      Cod: "AL1PI",
      "Piso/Techo": 2,
      Laterales: 2,
      Fajas: 1,
      "Est AL": 1,
      "Pie Estante": 1,
      Fondo: 1,
      Frentes: 1,
    });
    const piezas = calcularPiezas(m, 30, 100, 32);
    expectClose(piezas, {
      pisoTecho: 0.64,
      lateral: 0.192,
      faja: 0.08,
      estAL: 0,
      pieEstante: 0,
      fondo: 0.3,
      frentes: 0.3,
    });
  });

  it("AL2P — Alacena 2 Puertas (usa Ancho/Prof de la propia línea, no el bug del Excel)", () => {
    const m = modulo({
      Cod: "AL2P",
      "Piso/Techo": 2,
      Laterales: 2,
      Fajas: 1,
      "Est AL": 1,
      "Pie Estante": 1,
      Fondo: 1,
      Frentes: 1,
    });
    const piezas = calcularPiezas(m, 108, 80, 32);
    expectClose(piezas, {
      pisoTecho: 0.512,
      lateral: 0.6912,
      faja: 0.064,
      estAL: 0.64176,
      fondo: 0.864,
      frentes: 0.864,
    });
  });

  it("BM2P — BM 2 Puertas", () => {
    const m = modulo({
      Cod: "BM2P",
      "Piso/Techo": 1,
      Laterales: 2,
      Fajas: 2,
      "Est BM": 1,
      "Pie Estante": 1,
      Fondo: 1,
      Frentes: 1,
    });
    const piezas = calcularPiezas(m, 72, 110, 59);
    expectClose(piezas, {
      pisoTecho: 0.649,
      lateral: 0.8496,
      faja: 0.176,
      estBM: 0.5852,
      pieEstante: 0.264,
      fondo: 0.792,
      frentes: 0.792,
    });
  });

  it("BM1PI — BM 1 Puerta Izq", () => {
    const m = modulo({
      Cod: "BM1PI",
      "Piso/Techo": 1,
      Laterales: 2,
      Fajas: 2,
      "Est BM": 1,
      Fondo: 1,
      Frentes: 1,
    });
    const piezas = calcularPiezas(m, 30, 60, 59);
    expectClose(piezas, {
      pisoTecho: 0.354,
      lateral: 0.354,
      faja: 0.096,
      estBM: 0.3102,
      pieEstante: 0,
      fondo: 0.18,
      frentes: 0.18,
    });
  });

  it("DS1PI — Despensa 1 Puerta Izq", () => {
    const m = modulo({
      Cod: "DS1PI",
      "Piso/Techo": 2,
      Laterales: 2,
      Fajas: 1,
      "Est DS": 1,
      Fondo: 1,
      Frentes: 1,
    });
    const piezas = calcularPiezas(m, 205, 40, 59);
    expectClose(piezas, {
      pisoTecho: 0.472,
      lateral: 2.419,
      faja: 0.032,
      estDS: 0.8008,
      fondo: 0.82,
      frentes: 0.82,
    });
  });

  it("BMEPF451PI — BM Esquinero PF 45 1 Puerta Izq", () => {
    const m = modulo({
      Cod: "BMEPF451PI",
      "Piso/Techo": 1,
      Laterales: 2,
      Fajas: 4,
      "Est BM": 1,
      "Pie Estante": 1,
      Fondo: 1,
      Frentes: 1,
      Parante: 2,
      PF: 1,
    });
    const piezas = calcularPiezas(m, 72, 100, 59);
    expectClose(piezas, {
      pisoTecho: 0.59,
      lateral: 0.8496,
      faja: 0.32,
      estBM: 0.5302,
      pieEstante: 0,
      fondo: 0.72,
      frentes: 0.72,
      parante: 0.1152,
      pf: 0.324,
    });
  });
});

describe("tramoEstAL", () => {
  it("devuelve el tramo correcto según el alto", () => {
    expect(tramoEstAL(42)).toBe(0);
    expect(tramoEstAL(43)).toBe(1);
    expect(tramoEstAL(64)).toBe(1);
    expect(tramoEstAL(65)).toBe(2);
    expect(tramoEstAL(76)).toBe(2);
    expect(tramoEstAL(77)).toBe(3);
    expect(tramoEstAL(109)).toBe(3);
    expect(tramoEstAL(110)).toBe(4);
  });
});

describe("tramoEstDS", () => {
  it("devuelve el tramo correcto según el alto", () => {
    expect(tramoEstDS(80)).toBe(2);
    expect(tramoEstDS(81)).toBe(3);
    expect(tramoEstDS(155)).toBe(3);
    expect(tramoEstDS(156)).toBe(3);
    expect(tramoEstDS(200)).toBe(3);
    expect(tramoEstDS(201)).toBe(4);
  });
});

describe("extraerNumeroPF", () => {
  it("extrae el número de las posiciones 6-7 en códigos BMEPF", () => {
    expect(extraerNumeroPF("BMEPF451PI")).toBe(45);
    expect(extraerNumeroPF("BMEPF351PD")).toBe(35);
    expect(extraerNumeroPF("BMEPF651PI")).toBe(65);
  });

  it("devuelve 0 para códigos que no empiezan con BMEPF", () => {
    expect(extraerNumeroPF("AL2P")).toBe(0);
    expect(extraerNumeroPF("")).toBe(0);
    expect(extraerNumeroPF(undefined)).toBe(0);
    expect(extraerNumeroPF(null)).toBe(0);
  });
});
