import { Plus, Trash2, AlertTriangle } from "lucide-react";
import type { FilaPedido, Modulo } from "../types";

export interface FilaCalculada extends FilaPedido {
  modulo: Modulo | undefined;
  encontrado: boolean;
}

interface Props {
  filas: FilaCalculada[];
  onActualizarFila: (id: number, campo: keyof FilaPedido, valor: string) => void;
  onAgregarFila: () => void;
  onBorrarFila: (id: number) => void;
}

export default function PedidoTab({ filas, onActualizarFila, onAgregarFila, onBorrarFila }: Props) {
  const filasConError = filas.filter((f) => f.cod && !f.encontrado).length;

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
                  />
                </td>
                <td>
                  <input
                    className="cell-input cell-input-code"
                    type="text"
                    placeholder="AL2P"
                    value={f.cod}
                    onChange={(e) => onActualizarFila(f.id, "cod", e.target.value)}
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
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    placeholder="cm"
                    value={f.ancho}
                    onChange={(e) => onActualizarFila(f.id, "ancho", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    placeholder="cm"
                    value={f.prof}
                    onChange={(e) => onActualizarFila(f.id, "prof", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    type="text"
                    placeholder="—"
                    value={f.observaciones}
                    onChange={(e) => onActualizarFila(f.id, "observaciones", e.target.value)}
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

      <button className="add-btn" onClick={onAgregarFila}>
        <Plus size={15} /> Agregar línea
      </button>

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
