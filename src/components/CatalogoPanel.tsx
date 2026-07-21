import { useCallback, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Upload } from "lucide-react";
import type { Modulo } from "../types";
import { parseCatalogoCsv } from "../lib/csvCatalogo";

export interface CatalogoInfo {
  fuente: "semilla" | "sheet";
  actualizado: string | null;
}

interface Props {
  catalogo: Modulo[];
  catalogoInfo: CatalogoInfo;
  sheetUrl: string;
  onSheetUrlChange: (url: string) => void;
  onCatalogoActualizado: (filas: Modulo[], fuente: "sheet") => void;
}

export default function CatalogoPanel({
  catalogo,
  catalogoInfo,
  sheetUrl,
  onSheetUrlChange,
  onCatalogoActualizado,
}: Props) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const sincronizar = useCallback(async () => {
    if (!sheetUrl.trim()) {
      setError("Pegá primero el link CSV publicado del Google Sheet.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const res = await fetch(sheetUrl.trim());
      if (!res.ok) {
        throw new Error(`No se pudo leer la hoja (HTTP ${res.status}).`);
      }
      const csvText = await res.text();
      const filas = parseCatalogoCsv(csvText);
      onCatalogoActualizado(filas, "sheet");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al sincronizar.";
      setError(
        `${msg} — Revisá que el link sea el de "Publicar en la Web" en formato CSV y que la hoja tenga la columna "Cod".`
      );
    } finally {
      setCargando(false);
    }
  }, [sheetUrl, onCatalogoActualizado]);

  return (
    <div className="config-panel">
      <div className="config-row">
        <div style={{ flex: 1 }}>
          <div className="config-label">Link CSV publicado de tu Google Sheet (BD)</div>
          <input
            className="config-input"
            type="text"
            placeholder="https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv"
            value={sheetUrl}
            onChange={(e) => onSheetUrlChange(e.target.value)}
          />
        </div>
        <button className="sync-btn" onClick={sincronizar} disabled={cargando}>
          <RefreshCw size={14} className={cargando ? "spin" : undefined} />
          {cargando ? "Actualizando…" : "Actualizar catálogo"}
        </button>
      </div>

      <div className="config-hint">
        En tu Sheet: Archivo → Compartir → Publicar en la Web → elegí la pestaña del catálogo → formato CSV → copiá
        ese link acá. El catálogo NO se vuelve a leer solo; se actualiza únicamente cuando tocás este botón.
      </div>

      <div className="config-status">
        {catalogoInfo.fuente === "semilla" ? (
          <span className="badge badge-neutral">
            <Upload size={13} /> Usando catálogo semilla ({catalogo.length} códigos) — todavía no conectaste tu Sheet
          </span>
        ) : (
          <span className="badge badge-ok">
            <CheckCircle2 size={13} /> Catálogo del Sheet ({catalogo.length} códigos) — actualizado{" "}
            {catalogoInfo.actualizado ? new Date(catalogoInfo.actualizado).toLocaleString("es-AR") : ""}
          </span>
        )}
        {error && (
          <span className="badge badge-error">
            <AlertTriangle size={13} /> {error}
          </span>
        )}
      </div>
    </div>
  );
}
