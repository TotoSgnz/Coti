import { useState, type ClipboardEvent } from "react";
import { Plus, Trash2, AlertTriangle, Copy, Check } from "lucide-react";
import { FILAS_COLUMNAS, type FilaPedido, type Modulo } from "../types";
import { filasATsv, parsePegado } from "../lib/clipboardGrilla";

export interface FilaCalculada extends FilaPedido {
  modulo: Modulo | undefined;
  encontrado: boolean;
}

interface Props {
  filas: FilaCalculada[];
  onActualizarFila: (id: number, campo: keyof FilaPedido, valor: string) => void;
  onAgregarFila: () => void;
  onBorrarFila: (id: number) => void;
  onPegarBloque: (filaIndex: number, colIndex: number, matriz: string[][]) => void;
}

export default function PedidoTab({
  filas,
  onActualizarFila,
  onAgregarFila,
  onBorrarFila,
  onPegarBloque,
}: Props) {
  const [copiado, setCopiado] = useState(false);
  const [errorCopiar, setErrorCopiar] = useState("");
  const filasConError = filas.filter((f) => f.cod && !f.encontrado).length;

  const manejarPegado = (e: ClipboardEvent<HTMLInputElement>, filaIndex: number, colIndex: number) => {
    const texto = e.clipboardData.getData("text/plain");
    if (!texto.includes("\t") && !texto.includes("\n")) return; // celda única: paste normal del input
    e.preventDefault();
    onPegarBloque(filaIndex, colIndex, parsePegado(texto));
  };

  const copiarGrilla = async () => {
    try {
      await navigator.clipboard.writeText(filasATsv(filas));
      setErrorCopiar("");
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      setErrorCopiar("No se pudo copiar — el navegador denegó el permiso de portapapeles.");
    }
  };

  return (
    <div className="panel">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>#</th>
              <th style={{ width: 70 }}>Cant</th>
              <th style={{ width: 150 }}>Cód</th>
              <th>Detalle</th>
              <th style={{ width: 90 }}>Alto</th>
              <th style={{ width: 90 }}>Ancho</th>
              <th style={{ width: 90 }}>Prof</th>
              <th style={{ width: 160 }}>Observaciones</th>
              <th style={{ width: 44 }}></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.id} className={f.cod && !f.encontrado ? "tr-warn" : undefined}>
                <td className="td-index">{i + 1}</td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    min="0"
                    value={f.cant}
                    onChange={(e) => onActualizarFila(f.id, "cant", e.target.value)}
                    onPaste={(e) => manejarPegado(e, i, FILAS_COLUMNAS.indexOf("cant"))}
                  />
                </td>
                <td>
                  <input
                    className="cell-input cell-input-code"
                    type="text"
                    placeholder="AL2P"
                    value={f.cod}
                    onChange={(e) => onActualizarFila(f.id, "cod", e.target.value)}
                    onPaste={(e) => manejarPegado(e, i, FILAS_COLUMNAS.indexOf("cod"))}
                  />
                </td>
                <td className="td-detalle">
                  {f.cod ? (f.encontrado ? f.modulo?.Detalle ?? "" : "código no encontrado en catálogo") : ""}
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    placeholder="cm"
                    value={f.alto}
                    onChange={(e) => onActualizarFila(f.id, "alto", e.target.value)}
                    onPaste={(e) => manejarPegado(e, i, FILAS_COLUMNAS.indexOf("alto"))}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    placeholder="cm"
                    value={f.ancho}
                    onChange={(e) => onActualizarFila(f.id, "ancho", e.target.value)}
                    onPaste={(e) => manejarPegado(e, i, FILAS_COLUMNAS.indexOf("ancho"))}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    placeholder="cm"
                    value={f.prof}
                    onChange={(e) => onActualizarFila(f.id, "prof", e.target.value)}
                    onPaste={(e) => manejarPegado(e, i, FILAS_COLUMNAS.indexOf("prof"))}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="text"
                    placeholder="—"
                    value={f.observaciones}
                    onChange={(e) => onActualizarFila(f.id, "observaciones", e.target.value)}
                    onPaste={(e) => manejarPegado(e, i, FILAS_COLUMNAS.indexOf("observaciones"))}
                  />
                </td>
                <td>
                  <button className="del-btn" onClick={() => onBorrarFila(f.id)} title="Quitar fila">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pedido-acciones">
        <button className="add-btn" onClick={onAgregarFila}>
          <Plus size={15} /> Agregar línea
        </button>
        <button className="add-btn" onClick={copiarGrilla}>
          {copiado ? <Check size={15} /> : <Copy size={15} />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
        {errorCopiar && <span className="copiar-error">{errorCopiar}</span>}
      </div>

      <div className="config-hint" style={{ marginTop: 10 }}>
        Podés pegar directamente celdas copiadas desde Excel (seleccioná el rango y Ctrl/Cmd+V sobre cualquier
        celda de la grilla) — llena Cant, Cód, Alto, Ancho, Prof y Observaciones en ese orden, agregando filas si
        hacen falta.
      </div>

      {filasConError > 0 && (
        <div className="warn-banner">
          <AlertTriangle size={15} />
          {filasConError} {filasConError === 1 ? "línea tiene" : "líneas tienen"} un código que no está en el
          catálogo cargado. Revisá el nombre o actualizá el catálogo desde "Catálogo" arriba.
        </div>
      )}
    </div>
  );
}
