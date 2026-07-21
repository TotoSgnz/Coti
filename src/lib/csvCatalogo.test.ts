import { describe, expect, it } from "vitest";
import { parseCatalogoCsv } from "./csvCatalogo";

describe("parseCatalogoCsv", () => {
  it("parsea un CSV con encabezados y filas válidas", () => {
    const csv =
      "Cod,Detalle,Piso/Techo,Laterales,Fajas,Est AL,Est BM,Est DS,Pie Estante,Fondo,Frentes,Parante,PF\n" +
      "AL2P,Alacena 2 Puertas,2,2,1,1,0,0,1,1,1,0,0\n" +
      "BM2P,BM 2 Puertas,1,2,2,0,1,0,1,1,1,0,0\n";

    const filas = parseCatalogoCsv(csv);
    expect(filas).toHaveLength(2);
    expect(filas[0]).toMatchObject({
      Cod: "AL2P",
      Detalle: "Alacena 2 Puertas",
      "Piso/Techo": 2,
      Laterales: 2,
      Fajas: 1,
      "Est AL": 1,
      Fondo: 1,
      Frentes: 1,
    });
  });

  it("ignora filas sin código y recorta espacios en los encabezados", () => {
    const csv = " Cod , Detalle \nAL2P,Alacena 2 Puertas\n,Fila sin código\n";
    const filas = parseCatalogoCsv(csv);
    expect(filas).toHaveLength(1);
    expect(filas[0].Cod).toBe("AL2P");
  });

  it("acepta coma decimal en los valores numéricos (hoja exportada con ; como separador)", () => {
    const csv = "Cod;Fondo\nALE1PD;0,7\n";
    const filas = parseCatalogoCsv(csv);
    expect(filas[0].Fondo).toBe(0.7);
  });

  it("lanza un error descriptivo si no hay filas con Cod", () => {
    const csv = "Cod,Detalle\n,Sin código\n";
    expect(() => parseCatalogoCsv(csv)).toThrow(/no encontré/i);
  });

  it("lanza un error descriptivo si el contenido está vacío", () => {
    expect(() => parseCatalogoCsv("")).toThrow();
  });
});
