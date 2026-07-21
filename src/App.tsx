import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Layers, Settings2 } from "lucide-react";
import { CABECERA_VACIA, PIEZA_ORDER, type CabeceraPedido, type FilaPedido, type Modulo, type Piezas } from "./types";
import { calcularPiezas } from "./engine/materiaPrima";
import { CATALOGO_SEMILLA } from "./data/catalogoSemilla";
import { loadJSON, saveJSON } from "./lib/storage";
import CatalogoPanel, { type CatalogoInfo } from "./components/CatalogoPanel";
import CabeceraPedidoForm from "./components/CabeceraPedidoForm";
import PedidoTab, { type FilaCalculada } from "./components/PedidoTab";
import MateriaPrimaTab from "./components/MateriaPrimaTab";

const STORAGE_KEYS = {
  filas: "pedido-filas",
  cabecera: "pedido-cabecera",
  catalogo: "catalogo-cache",
  sheetUrl: "sheet-url",
};

let uid = 1;
const nextId = () => uid++;
const filaVacia = (): FilaPedido => ({
  id: nextId(),
  cant: 1,
  cod: "",
  alto: "",
  ancho: "",
  prof: "",
  observaciones: "",
});

function filasIniciales(): FilaPedido[] {
  const guardadas = loadJSON<Array<Partial<FilaPedido> & { id: number }>>(STORAGE_KEYS.filas);
  if (guardadas?.length) {
    uid = Math.max(...guardadas.map((f) => f.id || 0)) + 1;
    return guardadas.map((f) => ({ ...filaVacia(), ...f, id: f.id }));
  }
  return [filaVacia(), filaVacia(), filaVacia()];
}

function piezasVacias(): Piezas {
  return Object.fromEntries(PIEZA_ORDER.map((k) => [k, 0])) as unknown as Piezas;
}

export default function App() {
  const [tab, setTab] = useState<"pedido" | "materia">("pedido");
  const [filas, setFilas] = useState<FilaPedido[]>(filasIniciales);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const [catalogo, setCatalogo] = useState<Modulo[]>(() => {
    const cache = loadJSON<{ data: Modulo[]; fuente: CatalogoInfo["fuente"]; actualizado: string | null }>(
      STORAGE_KEYS.catalogo
    );
    return cache?.data?.length ? cache.data : CATALOGO_SEMILLA;
  });
  const [catalogoInfo, setCatalogoInfo] = useState<CatalogoInfo>(() => {
    const cache = loadJSON<{ fuente: CatalogoInfo["fuente"]; actualizado: string | null }>(STORAGE_KEYS.catalogo);
    return cache ? { fuente: cache.fuente, actualizado: cache.actualizado } : { fuente: "semilla", actualizado: null };
  });
  const [sheetUrl, setSheetUrl] = useState(() => loadJSON<string>(STORAGE_KEYS.sheetUrl) ?? "");
  const [cabecera, setCabecera] = useState<CabeceraPedido>(
    () => ({ ...CABECERA_VACIA, ...loadJSON<CabeceraPedido>(STORAGE_KEYS.cabecera) })
  );

  useEffect(() => {
    saveJSON(STORAGE_KEYS.filas, filas);
  }, [filas]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.sheetUrl, sheetUrl);
  }, [sheetUrl]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.cabecera, cabecera);
  }, [cabecera]);

  const catalogoPorCod = useMemo(() => {
    const map: Record<string, Modulo> = {};
    for (const m of catalogo) {
      if (m.Cod) map[String(m.Cod).trim().toUpperCase()] = m;
    }
    return map;
  }, [catalogo]);

  const actualizarFila = (id: number, campo: keyof FilaPedido, valor: string) => {
    setFilas((prev) => prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)));
  };
  const agregarFila = () => setFilas((prev) => [...prev, filaVacia()]);
  const borrarFila = (id: number) => setFilas((prev) => prev.filter((f) => f.id !== id));

  const actualizarCabecera = (campo: keyof CabeceraPedido, valor: string) => {
    setCabecera((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleCatalogoActualizado = (nuevasFilas: Modulo[], fuente: "sheet") => {
    setCatalogo(nuevasFilas);
    const info: CatalogoInfo = { fuente, actualizado: new Date().toISOString() };
    setCatalogoInfo(info);
    saveJSON(STORAGE_KEYS.catalogo, { data: nuevasFilas, ...info });
  };

  const filasCalculadas = useMemo(() => {
    return filas.map((f) => {
      const codKey = String(f.cod || "").trim().toUpperCase();
      const modulo = catalogoPorCod[codKey];
      const cant = Number(f.cant) || 0;
      const encontrado = !!modulo;
      const piezasUnit = encontrado ? calcularPiezas(modulo, Number(f.alto), Number(f.ancho), Number(f.prof)) : piezasVacias();
      const piezasTotal = Object.fromEntries(
        PIEZA_ORDER.map((k) => [k, (piezasUnit[k] || 0) * cant])
      ) as unknown as Piezas;
      const totalUnit = Object.values(piezasUnit).reduce((a, b) => a + b, 0);
      const totalLinea = totalUnit * cant;
      return { ...f, modulo, encontrado, piezasUnit, piezasTotal, totalLinea } satisfies FilaCalculada & {
        piezasUnit: Piezas;
        piezasTotal: Piezas;
        totalLinea: number;
      };
    });
  }, [filas, catalogoPorCod]);

  const totalesPorPieza = useMemo(() => {
    const t = piezasVacias();
    for (const f of filasCalculadas) {
      for (const k of PIEZA_ORDER) t[k] += f.piezasTotal[k] || 0;
    }
    return t;
  }, [filasCalculadas]);

  const totalGeneral = useMemo(
    () => Object.values(totalesPorPieza).reduce((a, b) => a + b, 0),
    [totalesPorPieza]
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">MP</div>
          <div>
            <div className="title">Cotizador — Materia Prima</div>
            <div className="subtitle">Paso 1: cálculo de m² por módulo, validado contra el Excel original</div>
          </div>
        </div>
        <button className="config-btn" onClick={() => setMostrarConfig((v) => !v)}>
          <Settings2 size={15} />
          Catálogo
        </button>
      </header>

      {mostrarConfig && (
        <CatalogoPanel
          catalogo={catalogo}
          catalogoInfo={catalogoInfo}
          sheetUrl={sheetUrl}
          onSheetUrlChange={setSheetUrl}
          onCatalogoActualizado={handleCatalogoActualizado}
        />
      )}

      <nav className="tabs">
        <button className={`tab-btn ${tab === "pedido" ? "tab-btn-active" : ""}`} onClick={() => setTab("pedido")}>
          <ClipboardList size={15} /> Pedido
        </button>
        <button className={`tab-btn ${tab === "materia" ? "tab-btn-active" : ""}`} onClick={() => setTab("materia")}>
          <Layers size={15} /> Materia Prima
        </button>
      </nav>

      {tab === "pedido" && (
        <>
          <div className="panel cabecera-panel">
            <CabeceraPedidoForm cabecera={cabecera} onCambiarCampo={actualizarCabecera} />
          </div>
          <PedidoTab
            filas={filasCalculadas}
            onActualizarFila={actualizarFila}
            onAgregarFila={agregarFila}
            onBorrarFila={borrarFila}
          />
        </>
      )}

      {tab === "materia" && (
        <MateriaPrimaTab filas={filasCalculadas} totalesPorPieza={totalesPorPieza} totalGeneral={totalGeneral} />
      )}

      <footer className="footer">
        Motor de cálculo validado contra las líneas reales del Excel (AL2P, DS1PI, BM2P, BMEPF451PI, etc). Corrección
        aplicada: el estante de alacena usa el ancho/profundidad de cada línea, no el de la primera fila (bug
        detectado en la fórmula original).
      </footer>
    </div>
  );
}
