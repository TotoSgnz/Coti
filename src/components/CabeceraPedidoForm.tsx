import type { CabeceraPedido } from "../types";
import { fmt } from "../lib/format";

interface Campo {
  key: keyof CabeceraPedido;
  label: string;
  type?: "text" | "date" | "number" | "email" | "tel";
}

const CAMPOS: Campo[] = [
  { key: "cliente", label: "Cliente" },
  { key: "proyecto", label: "Proyecto" },
  { key: "ciudad", label: "Ciudad" },
  { key: "domicilio", label: "Domicilio" },
  { key: "telefono", label: "Teléfono", type: "tel" },
  { key: "email", label: "Email", type: "email" },
  { key: "vendedor", label: "Vendedor" },
  { key: "fechaVenta", label: "Fecha de Venta", type: "date" },
  { key: "fechaVerificacion", label: "Fecha de Verificación", type: "date" },
  { key: "fechaEntrega", label: "Fecha de Entrega", type: "date" },
  { key: "importeCobrado", label: "Importe cobrado", type: "number" },
  { key: "anticipo", label: "Anticipo", type: "number" },
];

interface Props {
  cabecera: CabeceraPedido;
  onCambiarCampo: (campo: keyof CabeceraPedido, valor: string) => void;
}

export default function CabeceraPedidoForm({ cabecera, onCambiarCampo }: Props) {
  const saldo = (Number(cabecera.importeCobrado) || 0) - (Number(cabecera.anticipo) || 0);

  return (
    <div className="cabecera-grid">
      {CAMPOS.map((campo) => (
        <div key={campo.key} className="cabecera-field">
          <label className="cabecera-label" htmlFor={`cabecera-${campo.key}`}>
            {campo.label}
          </label>
          <input
            id={`cabecera-${campo.key}`}
            className="cabecera-input"
            type={campo.type ?? "text"}
            value={cabecera[campo.key]}
            onChange={(e) => onCambiarCampo(campo.key, e.target.value)}
          />
        </div>
      ))}
      <div className="cabecera-field">
        <label className="cabecera-label" htmlFor="cabecera-saldo">
          Saldo
        </label>
        <input
          id="cabecera-saldo"
          className="cabecera-input cabecera-input-calculado"
          type="text"
          readOnly
          value={`$ ${fmt(saldo, 0)}`}
          title="Se calcula solo: Importe cobrado − Anticipo"
        />
      </div>
    </div>
  );
}
