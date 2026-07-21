export interface Modulo {
  Cod: string;
  Detalle: string;
  "Piso/Techo": number;
  Laterales: number;
  Fajas: number;
  "Est AL": number;
  "Est BM": number;
  "Est DS": number;
  "Pie Estante": number;
  Fondo: number;
  Frentes: number;
  Parante: number;
  PF: number;
}

export const CAT_KEYS = [
  "Piso/Techo",
  "Laterales",
  "Fajas",
  "Est AL",
  "Est BM",
  "Est DS",
  "Pie Estante",
  "Fondo",
  "Frentes",
  "Parante",
  "PF",
] as const;

export interface FilaPedido {
  id: number;
  cant: number | string;
  cod: string;
  alto: number | string;
  ancho: number | string;
  prof: number | string;
}

export interface Piezas {
  pisoTecho: number;
  lateral: number;
  faja: number;
  estAL: number;
  estBM: number;
  estDS: number;
  pieEstante: number;
  fondo: number;
  frentes: number;
  parante: number;
  pf: number;
}

export const PIEZA_ORDER: (keyof Piezas)[] = [
  "pisoTecho",
  "lateral",
  "faja",
  "fondo",
  "frentes",
  "estAL",
  "estBM",
  "estDS",
  "pieEstante",
  "parante",
  "pf",
];

export const PIEZA_LABEL: Record<keyof Piezas, string> = {
  pisoTecho: "Piso / Techo",
  lateral: "Laterales",
  faja: "Fajas",
  estAL: "Estantes (Alacena)",
  estBM: "Estantes (Bajomesada)",
  estDS: "Estantes (Despensa)",
  pieEstante: "Pie de estante",
  fondo: "Fondo",
  frentes: "Frentes / Puertas",
  parante: "Parante",
  pf: "PF (esquinero)",
};
