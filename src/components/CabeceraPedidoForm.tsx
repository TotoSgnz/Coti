import type { CabeceraPedido } from "../types";
import { fmt } from "../lib/format";

interface Campo {
  key: keyof CabeceraPedido;
  label: string;
  type?: "text" | "date" | "number" | "email" | "tel";
}

const CAMPOS_PROYECTO: Campo[] = [
  { key: "cliente", label: "Cliente" },
  { key: "proyecto", label: "Proyecto" },
  { key: "ciudad", label: "Ciudad" },
  { key: "domicilio", label: "Domicilio" },
  { key: "telefono", label: "Teléfono", type: "tel" },
  { key: "email", label: "Email", type: "email" },
];

const CAMPOS_VENTA: Campo[] = [
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

function Fila({
  campo,
  cabecera,
  onCambiarCampo,
}: {
  campo: Campo;
  cabecera: CabeceraPedido;
  onCambiarCampo: (campo: keyof CabeceraPedido, valor: string) => void;
}) {
  return (
    <div className="cabecera-fila">
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
  );
}

export default function CabeceraPedidoForm({ cabecera, onCambiarCampo }: Props) {
  const saldo = (Number(cabecera.importeCobrado) || 0) - (Number(cabecera.anticipo) || 0);

  return (
    <div className="cabecera-columnas">
      <div className="cabecera-columna">
        <div className="cabecera-columna-titulo">Proyecto</div>
        {CAMPOS_PROYECTO.map((campo) => (
          <Fila key={campo.key} campo={campo} cabecera={cabecera} onCambiarCampo={onCambiarCampo} />
        ))}
      </div>
      <div className="cabecera-columna">
        <div className="cabecera-columna-titulo">Vendedor y venta</div>
        {CAMPOS_VENTA.map((campo) => (
          <Fila key={campo.key} campo={campo} cabecera={cabecera} onCambiarCampo={onCambiarCampo} />
        ))}
        <div className="cabecera-fila">
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
    </div>
  );
}
