import { PIEZA_LABEL, PIEZA_ORDER, type Piezas } from "../types";
import { fmt } from "../lib/format";
import type { FilaCalculada } from "./PedidoTab";

interface FilaConPiezas extends FilaCalculada {
  piezasUnit: Piezas;
  piezasTotal: Piezas;
  totalLinea: number;
}

interface Props {
  filas: FilaConPiezas[];
  totalesPorPieza: Piezas;
  totalGeneral: number;
}

export default function MateriaPrimaTab({ filas, totalesPorPieza, totalGeneral }: Props) {
  const filasConCodigo = filas.filter((f) => f.cod);

  return (
    <div className="panel">
      <div className="summary-grid">
        {PIEZA_ORDER.map((k) => (
          <div key={k} className="summary-card">
            <div className="summary-label">{PIEZA_LABEL[k]}</div>
            <div className="summary-value">{fmt(totalesPorPieza[k])} m²</div>
          </div>
        ))}
        <div className="summary-card summary-card-total">
          <div className="summary-label" style={{ color: "#fff8ee" }}>
            Total materia prima
          </div>
          <div className="summary-value" style={{ color: "#fff8ee", fontSize: 22 }}>
            {fmt(totalGeneral)} m²
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>#</th>
              <th style={{ width: 90 }}>Cód</th>
              <th style={{ width: 50 }}>Cant</th>
              {PIEZA_ORDER.map((k) => (
                <th key={k} style={{ textAlign: "right", minWidth: 78 }}>
                  {PIEZA_LABEL[k]}
                </th>
              ))}
              <th style={{ textAlign: "right", width: 90 }}>Total m²</th>
            </tr>
          </thead>
          <tbody>
            {filasConCodigo.map((f, i) => (
              <tr key={f.id} className={!f.encontrado ? "tr-warn" : undefined}>
                <td className="td-index">{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{f.cod}</td>
                <td>{f.cant}</td>
                {PIEZA_ORDER.map((k) => (
                  <td key={k} style={{ textAlign: "right", color: f.piezasTotal[k] ? "#3d3327" : "#c9bda3" }}>
                    {fmt(f.piezasTotal[k])}
                  </td>
                ))}
                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(f.totalLinea)}</td>
              </tr>
            ))}
            {filasConCodigo.length === 0 && (
              <tr>
                <td colSpan={PIEZA_ORDER.length + 4} className="empty-msg">
                  Cargá líneas en la pestaña "Pedido" para ver el desglose acá.
                </td>
              </tr>
            )}
          </tbody>
          {filasConCodigo.length > 0 && (
            <tfoot>
              <tr>
                <td className="tfoot" colSpan={3}>
                  Total
                </td>
                {PIEZA_ORDER.map((k) => (
                  <td key={k} className="tfoot" style={{ textAlign: "right" }}>
                    {fmt(totalesPorPieza[k])}
                  </td>
                ))}
                <td className="tfoot" style={{ textAlign: "right" }}>
                  {fmt(totalGeneral)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
