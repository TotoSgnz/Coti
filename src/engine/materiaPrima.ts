import type { Modulo, Piezas } from "../types";

/**
 * Motor de cálculo de materia prima (m²) por módulo.
 * Fórmulas validadas línea por línea contra la hoja "Melamina" del Excel
 * original de la fábrica. Todas las medidas de entrada (alto/ancho/prof)
 * están en cm; los resultados son en m².
 *
 * Corrección intencional respecto al Excel original: la fórmula de
 * "Est AL" en el Excel usaba el Ancho/Prof de la primera fila cargada
 * (bug de referencia $ congelada). Acá se usa el Ancho/Prof de cada
 * línea, que es el comportamiento correcto.
 */

export function tramoEstAL(alto: number): number {
  if (alto < 43) return 0;
  if (alto < 65) return 1;
  if (alto < 77) return 2;
  if (alto < 110) return 3;
  return 4;
}

export function tramoEstDS(alto: number): number {
  if (alto > 200) return 4;
  if (alto > 155) return 3;
  if (alto > 80) return 3;
  return 2;
}

export function extraerNumeroPF(cod: string | undefined | null): number {
  if (!cod) return 0;
  const c = String(cod).toUpperCase();
  if (!c.startsWith("BMEPF")) return 0;
  const n = parseInt(c.substring(5, 7), 10);
  return isNaN(n) ? 0 : n;
}

export function calcularPiezas(
  modulo: Modulo,
  alto: number,
  ancho: number,
  prof: number
): Piezas {
  const A = Number(alto) || 0;
  const W = Number(ancho) || 0;
  const P = Number(prof) || 0;
  const g = (k: keyof Modulo) => Number(modulo[k]) || 0;

  const pisoTecho = (g("Piso/Techo") * W * P) / 10000;
  const lateral = (g("Laterales") * A * P) / 10000;
  const faja = (g("Fajas") * W * 8) / 10000;
  const fondo = (g("Fondo") * A * W) / 10000;
  const frentes = (g("Frentes") * A * W) / 10000;
  const parante = (g("Parante") * A * 8) / 10000;

  const estBM = (g("Est BM") * (W - 3.6) * (P - 4)) / 10000;
  const estAL = (g("Est AL") * tramoEstAL(A) * (W - 3.6) * (P - 4)) / 10000;
  const estDS = (g("Est DS") * tramoEstDS(A) * (W - 3.6) * (P - 4)) / 10000;

  const pieEstante =
    (g("Pie Estante") * (W > 100 ? 1 : 0) * (A / 3) * 2 * (P - 4)) / 10000;

  const pf = (g("PF") * extraerNumeroPF(modulo.Cod) * A) / 10000;

  return {
    pisoTecho,
    lateral,
    faja,
    estAL,
    estBM,
    estDS,
    pieEstante,
    fondo,
    frentes,
    parante,
    pf,
  };
}

export function totalPiezas(p: Piezas): number {
  return Object.values(p).reduce((a, b) => a + b, 0);
}
