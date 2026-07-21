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
  observaciones: string;
}

// Orden de columnas editables de la grilla de Pedido, tal como aparecen
// visualmente (sin "Detalle", que es derivado del catálogo). Se usa para
// mapear filas/columnas al pegar o copiar bloques desde Excel.
export const FILAS_COLUMNAS = ["cant", "cod", "alto", "ancho", "prof", "observaciones"] as const;
export type FilaColumnaEditable = (typeof FILAS_COLUMNAS)[number];

export interface CabeceraPedido {
  cliente: string;
  proyecto: string;
  ciudad: string;
  domicilio: string;
  telefono: string;
  email: string;
  vendedor: string;
  fechaVenta: string;
  fechaVerificacion: string;
  fechaEntrega: string;
  importeCobrado: string;
  anticipo: string;
}

export const CABECERA_VACIA: CabeceraPedido = {
  cliente: "",
  proyecto: "",
  ciudad: "",
  domicilio: "",
  telefono: "",
  email: "",
  vendedor: "",
  fechaVenta: "",
  fechaVerificacion: "",
  fechaEntrega: "",
  importeCobrado: "",
  anticipo: "",
};

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
