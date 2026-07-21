import React, { useState, useEffect, useCallback, useMemo } from "react";
import Papa from "papaparse";
import { RefreshCw, Plus, Trash2, ClipboardList, Layers, AlertTriangle, CheckCircle2, Settings2, Upload } from "lucide-react";

/* ============================================================
   CATÁLOGO SEMILLA (BD_Costos4.xlsx -> hoja "BD")
   Se usa hasta que se conecte y actualice un Google Sheet propio.
   ============================================================ */
const CATALOGO_SEMILLA = [{"Cod": "BM1PI", "Detalle": "BM 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM1PD", "Detalle": "BM 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM2P", "Detalle": "BM 2 Puertas", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM1PBB", "Detalle": "BM Bajobacha 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 3, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM2PBB", "Detalle": "BM Bajobacha 2 Puertas", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM2CBB", "Detalle": "BM Bajobacha 2 Cajones", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BMEPF351PI", "Detalle": "BM Esquinero PF 35 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF401PI", "Detalle": "BM Esquinero PF 40 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF451PI", "Detalle": "BM Esquinero PF 45 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF501PI", "Detalle": "BM Esquinero PF 50 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF551PI", "Detalle": "BM Esquinero PF 55 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF601PI", "Detalle": "BM Esquinero PF 60 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF651PI", "Detalle": "BM Esquinero PF 65 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF351PD", "Detalle": "BM Esquinero PF 35 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF401PD", "Detalle": "BM Esquinero PF 40 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF451PD", "Detalle": "BM Esquinero PF 45 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF501PD", "Detalle": "BM Esquinero PF 50 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF551PD", "Detalle": "BM Esquinero PF 55 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF601PD", "Detalle": "BM Esquinero PF 60 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BMEPF651PD", "Detalle": "BM Esquinero PF 45 1 Puerta Der", "Piso/Techo": 1, "Laterales": 2, "Fajas": 4, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 2, "PF": 1}, {"Cod": "BM3C", "Detalle": "BM 3 Cajones ", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM3CO", "Detalle": "BM 3 Cajones (1 Oculto)", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM2C", "Detalle": "BM 2 Cajones", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM2CE", "Detalle": "BM 2 Cajones Especiero (Guias ocultas)", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM1H", "Detalle": "BM 1 Herraje", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM1CG", "Detalle": "BM 1 Cajon Grande (2 telesc sin freno)", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM2P2C", "Detalle": "BM 2 Puertas 2 Cajones", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BM1P2C", "Detalle": "BM 1 Puertas 2 Cajones", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "BMA", "Detalle": "BM Abierto", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "BMAE", "Detalle": "BM Abierto con Estante", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "BMPH", "Detalle": "BM Porta Horno", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "CH1PI", "Detalle": "Columna Horno 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CH1PD", "Detalle": "Columna Horno 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 1, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CH2C", "Detalle": "Columna Horno 2 Cajones", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CH3C", "Detalle": "Columna Horno 3 Cajones", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CH3CO", "Detalle": "Columna Horno 3 Cajones Oculto", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CH2CC", "Detalle": "Columna Horno 2 Cajones Chico", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CH1C", "Detalle": "Columna Horno 1 Cajones", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0.5, "Frentes": 0.5, "Parante": 0, "PF": 0}, {"Cod": "CMS1PI", "Detalle": "Columna Microondas Superior 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "CMS1PD", "Detalle": "Columna Microondas Superior 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "LV1P", "Detalle": "Lavavajillas 1 Puerta", "Piso/Techo": 0, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "ALB", "Detalle": "Alacena Banderola", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AL1PI", "Detalle": "Alacena 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AL1PD", "Detalle": "Alacena 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AL2P", "Detalle": "Alacena 2 Puertas", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "ALAH", "Detalle": "Alacena Abierta Horizontal", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "ALAV", "Detalle": "Alacena Abierta Vertical", "Piso/Techo": 1, "Laterales": 1, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "ALAMIC", "Detalle": "Alacena Abierta Microondas", "Piso/Techo": 1, "Laterales": 1, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "ALE1PD", "Detalle": "Alacena Esquinera 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 0.7, "Parante": 2, "PF": 0}, {"Cod": "ALE1PI", "Detalle": "Alacena Esquinera 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 1, "Fondo": 1, "Frentes": 0.7, "Parante": 2, "PF": 0}, {"Cod": "ALC", "Detalle": "Alacena Colgado", "Piso/Techo": 1, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "ALV", "Detalle": "Alacena Vinero", "Piso/Techo": 2, "Laterales": 7, "Fajas": 0, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "CC2P", "Detalle": "Cubrecampana 2 Puertas", "Piso/Techo": 3, "Laterales": 4, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "SF1PI", "Detalle": "Sobrepurificador 1 Puerta Izq", "Piso/Techo": 1, "Laterales": 1, "Fajas": 0, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "SF1PD", "Detalle": "Sobrepurificador 1 Puerta Der", "Piso/Techo": 1, "Laterales": 1, "Fajas": 0, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AL721PISM133", "Detalle": "Alacena 1 Puerta Izq Sobremedida ", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "AL601PDSM60", "Detalle": "Alacena 1 Puerta Der Sobremedida", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 1, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "DS1PI", "Detalle": "Despensa 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DS1PD", "Detalle": "Despensa 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DSE1PI", "Detalle": "Despensa Escobero 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DSE1PD", "Detalle": "Despensa Escobero 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DS2PI", "Detalle": "Despensa 2 Puertas Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DS2PD", "Detalle": "Despensa 2 Puertas Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DSI2PI", "Detalle": "Despensa Invertido 2 Puertas Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DSI2PD", "Detalle": "Despensa Invertido 2 Puertas Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 1, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "DSA", "Detalle": "Despensa Abierta", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "ESCAF", "Detalle": "Estación Cafe", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 1, "Est BM": 1, "Est DS": 1, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "M1PI", "Detalle": "Marco 1 Puerta Izq", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "M1PD", "Detalle": "Marco 1 Puerta Der", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "M2P", "Detalle": "Marco 2 Puertas", "Piso/Techo": 2, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AJNP", "Detalle": "Ajuste Nivel Puerta", "Piso/Techo": 0, "Laterales": 1, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AJS", "Detalle": "Ajuste Simple", "Piso/Techo": 0, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AJU", "Detalle": "Ajuste en U", "Piso/Techo": 0, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AJALNP", "Detalle": "Alacena Ajuste Nivel Puerta", "Piso/Techo": 1, "Laterales": 1, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "AJALJS", "Detalle": "Alacena Ajuste Simple", "Piso/Techo": 1, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "CT", "Detalle": "Cierre Techo", "Piso/Techo": 1, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "CTM", "Detalle": "Cierre Techo con Marco", "Piso/Techo": 2, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "FV", "Detalle": "Fondo Visto", "Piso/Techo": 0, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "LAS", "Detalle": "Lateral Aplicado Simple", "Piso/Techo": 0, "Laterales": 1, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "LAD", "Detalle": "Lateral Aplicado Doble", "Piso/Techo": 0, "Laterales": 2, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "LAR", "Detalle": "Lateral Aplicado Doble con Regrueso", "Piso/Techo": 0, "Laterales": 1, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 4, "PF": 0}, {"Cod": "PA", "Detalle": "Piso Alacena", "Piso/Techo": 1, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "PALM", "Detalle": "Piso Alacena Led Moa", "Piso/Techo": 1, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "PAL", "Detalle": "Piso Alacena Led", "Piso/Techo": 1, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "TPS", "Detalle": "Tapa Simple", "Piso/Techo": 1, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "TPD", "Detalle": "Tapa Doble", "Piso/Techo": 2, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "TPR", "Detalle": "Tapa Doble con Regrueso", "Piso/Techo": 1, "Laterales": 2, "Fajas": 2, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 0, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "VAR", "Detalle": "Varillado", "Piso/Techo": 0, "Laterales": 0, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 2, "Frentes": 0, "Parante": 0, "PF": 0}, {"Cod": "ZV", "Detalle": "Zócalo Visto", "Piso/Techo": 0, "Laterales": 3, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}, {"Cod": "ZMDF", "Detalle": "Zócalo MDF", "Piso/Techo": 0, "Laterales": 3, "Fajas": 0, "Est AL": 0, "Est BM": 0, "Est DS": 0, "Pie Estante": 0, "Fondo": 1, "Frentes": 1, "Parante": 0, "PF": 0}];

const CAT_KEYS = ["Piso/Techo","Laterales","Fajas","Est AL","Est BM","Est DS","Pie Estante","Fondo","Frentes","Parante","PF"];

const PIEZA_LABEL = {
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
const PIEZA_ORDER = ["pisoTecho","lateral","faja","fondo","frentes","estAL","estBM","estDS","pieEstante","parante","pf"];

/* ============================================================
   MOTOR DE CÁLCULO — Materia Prima (m²)
   Replica las fórmulas de la hoja "Melamina" del Excel original,
   validadas contra pedidos reales, CON UNA CORRECCIÓN:
   el Excel original calculaba "Estantes Alacena" siempre con el
   Ancho/Prof de la fila 2 (bug de referencia $ congelada). Acá
   se usa el Ancho/Prof de cada línea, que es el comportamiento
   correcto.
   ============================================================ */
function tramoEstAL(alto) {
  if (alto < 43) return 0;
  if (alto < 65) return 1;
  if (alto < 77) return 2;
  if (alto < 110) return 3;
  return 4;
}
function tramoEstDS(alto) {
  if (alto > 200) return 4;
  if (alto > 155) return 3;
  if (alto > 80) return 3;
  return 2;
}
function extraerPF(cod) {
  if (!cod) return 0;
  const c = String(cod).toUpperCase();
  if (c.startsWith("BMEPF")) {
    const n = parseInt(c.substring(5, 7), 10);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function calcularPiezas(modulo, alto, ancho, prof) {
  const A = Number(alto) || 0;
  const W = Number(ancho) || 0;
  const P = Number(prof) || 0;
  const g = (k) => Number(modulo?.[k]) || 0;

  const pisoTecho = (g("Piso/Techo") * W * P) / 10000;
  const lateral = (g("Laterales") * A * P) / 10000;
  const faja = (g("Fajas") * W * 8) / 10000;
  const estAL = (g("Est AL") * tramoEstAL(A) * (W - 3.6) * (P - 4)) / 10000;
  const estBM = (g("Est BM") * (W - 3.6) * (P - 4)) / 10000;
  const estDS = (g("Est DS") * tramoEstDS(A) * (W - 3.6) * (P - 4)) / 10000;
  const pieEstante = (g("Pie Estante") * (W > 100 ? 1 : 0) * (A / 3) * 2 * (P - 4)) / 10000;
  const fondo = (g("Fondo") * A * W) / 10000;
  const frentes = (g("Frentes") * A * W) / 10000;
  const parante = (g("Parante") * A * 8) / 10000;
  const pf = (g("PF") * extraerPF(modulo?.Cod) * A) / 10000;

  return { pisoTecho, lateral, faja, estAL, estBM, estDS, pieEstante, fondo, frentes, parante, pf };
}

/* ============================================================ */

let uid = 1;
const nextId = () => uid++;
const filaVacia = () => ({ id: nextId(), cant: 1, cod: "", alto: "", ancho: "", prof: "" });

const fmt = (n, d = 3) => {
  if (!isFinite(n)) return "0";
  const r = Number(n.toFixed(d));
  return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function App() {
  const [tab, setTab] = useState("pedido");
  const [filas, setFilas] = useState([filaVacia(), filaVacia(), filaVacia()]);
  const [catalogo, setCatalogo] = useState(CATALOGO_SEMILLA);
  const [catalogoInfo, setCatalogoInfo] = useState({ fuente: "semilla", actualizado: null });
  const [sheetUrl, setSheetUrl] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorSync, setErrorSync] = useState("");
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [listo, setListo] = useState(false);
  const [modoManual, setModoManual] = useState(false);
  const [csvManual, setCsvManual] = useState("");

  // Cargar estado guardado
  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("pedido-filas");
        if (p?.value) {
          const parsed = JSON.parse(p.value);
          if (Array.isArray(parsed) && parsed.length) {
            uid = Math.max(...parsed.map((f) => f.id || 0)) + 1;
            setFilas(parsed);
          }
        }
      } catch (e) {}
      try {
        const c = await window.storage.get("catalogo-cache");
        if (c?.value) {
          const parsed = JSON.parse(c.value);
          if (parsed?.data?.length) {
            setCatalogo(parsed.data);
            setCatalogoInfo({ fuente: parsed.fuente || "sheet", actualizado: parsed.actualizado || null });
          }
        }
      } catch (e) {}
      try {
        const u = await window.storage.get("sheet-url");
        if (u?.value) setSheetUrl(u.value);
      } catch (e) {}
      setListo(true);
    })();
  }, []);

  // Guardar pedido cuando cambia
  useEffect(() => {
    if (!listo) return;
    window.storage.set("pedido-filas", JSON.stringify(filas)).catch(() => {});
  }, [filas, listo]);

  const catalogoPorCod = useMemo(() => {
    const map = {};
    for (const m of catalogo) {
      if (m.Cod) map[String(m.Cod).trim().toUpperCase()] = m;
    }
    return map;
  }, [catalogo]);

  const actualizarFila = (id, campo, valor) => {
    setFilas((prev) => prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)));
  };
  const agregarFila = () => setFilas((prev) => [...prev, filaVacia()]);
  const borrarFila = (id) => setFilas((prev) => prev.filter((f) => f.id !== id));

  const parseCsvYGuardar = useCallback(async (csvText, fuenteLabel) => {
    const parsed = Papa.parse(csvText.trim(), { header: true, skipEmptyLines: true, delimiter: "" });
    if (!parsed.data?.length) throw new Error("No se pudo interpretar el contenido como tabla.");
    const filasCsv = parsed.data
      .map((row) => {
        const norm = {};
        for (const key of Object.keys(row)) {
          norm[key.trim()] = row[key];
        }
        if (!norm.Cod) return null;
        const modulo = { Cod: String(norm.Cod).trim(), Detalle: norm.Detalle || "" };
        for (const k of CAT_KEYS) {
          const raw = norm[k];
          const n = parseFloat(String(raw ?? "0").replace(",", "."));
          modulo[k] = isNaN(n) ? 0 : n;
        }
        return modulo;
      })
      .filter(Boolean);
    if (!filasCsv.length) throw new Error("No encontré filas con la columna 'Cod' cargada.");

    setCatalogo(filasCsv);
    const info = { fuente: fuenteLabel, actualizado: new Date().toISOString() };
    setCatalogoInfo(info);
    await window.storage.set("catalogo-cache", JSON.stringify({ data: filasCsv, ...info }));
    return filasCsv.length;
  }, []);

  const sincronizarCatalogo = useCallback(async () => {
    if (!sheetUrl.trim()) {
      setErrorSync("Pegá primero el link CSV publicado del Google Sheet.");
      return;
    }
    setCargando(true);
    setErrorSync("");
    try {
      const res = await fetch(sheetUrl.trim());
      if (!res.ok) throw new Error("No se pudo leer la hoja (HTTP " + res.status + ")");
      const csvText = await res.text();
      await parseCsvYGuardar(csvText, "sheet");
      await window.storage.set("sheet-url", sheetUrl.trim());
    } catch (e) {
      setErrorSync(
        (e.message || "Error al sincronizar.") +
          " — Si este error persiste, usá 'Pegar CSV manualmente' abajo: es más confiable en esta vista previa."
      );
    } finally {
      setCargando(false);
    }
  }, [sheetUrl, parseCsvYGuardar]);

  const cargarCsvManual = useCallback(async () => {
    if (!csvManual.trim()) {
      setErrorSync("Pegá el contenido de tu hoja primero.");
      return;
    }
    setCargando(true);
    setErrorSync("");
    try {
      const n = await parseCsvYGuardar(csvManual, "manual");
      setErrorSync("");
      setCsvManual("");
    } catch (e) {
      setErrorSync(e.message || "Error al interpretar el contenido pegado.");
    } finally {
      setCargando(false);
    }
  }, [csvManual, parseCsvYGuardar]);

  const filasCalculadas = useMemo(() => {
    return filas.map((f) => {
      const codKey = String(f.cod || "").trim().toUpperCase();
      const modulo = catalogoPorCod[codKey];
      const cant = Number(f.cant) || 0;
      const encontrado = !!modulo;
      const piezasUnit = encontrado
        ? calcularPiezas(modulo, f.alto, f.ancho, f.prof)
        : Object.fromEntries(PIEZA_ORDER.map((k) => [k, 0]));
      const piezasTotal = Object.fromEntries(
        PIEZA_ORDER.map((k) => [k, (piezasUnit[k] || 0) * cant])
      );
      const totalUnit = Object.values(piezasUnit).reduce((a, b) => a + b, 0);
      const totalLinea = totalUnit * cant;
      return { ...f, modulo, encontrado, piezasUnit, piezasTotal, totalUnit, totalLinea };
    });
  }, [filas, catalogoPorCod]);

  const totalesPorPieza = useMemo(() => {
    const t = Object.fromEntries(PIEZA_ORDER.map((k) => [k, 0]));
    for (const f of filasCalculadas) {
      for (const k of PIEZA_ORDER) t[k] += f.piezasTotal[k] || 0;
    }
    return t;
  }, [filasCalculadas]);

  const totalGeneral = useMemo(
    () => Object.values(totalesPorPieza).reduce((a, b) => a + b, 0),
    [totalesPorPieza]
  );

  const filasConError = filasCalculadas.filter(
    (f) => f.cod && !f.encontrado
  ).length;

  return (
    <div style={S.app}>
      <style>{`
        * { box-sizing: border-box; }
        input[type=text], input[type=number] {
          font-family: inherit;
        }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        ::selection { background: #d9c9a8; }
      `}</style>

      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logoMark}>MP</div>
          <div>
            <div style={S.title}>Cotizador — Materia Prima</div>
            <div style={S.subtitle}>Paso 1: cálculo de m² por módulo, validado contra el Excel original</div>
          </div>
        </div>
        <button style={S.configBtn} onClick={() => setMostrarConfig((v) => !v)}>
          <Settings2 size={15} />
          Catálogo
        </button>
      </header>

      {mostrarConfig && (
        <div style={S.configPanel}>
          <div style={S.configRow}>
            <div style={{ flex: 1 }}>
              <div style={S.configLabel}>Link CSV publicado de tu Google Sheet (BD)</div>
              <input
                style={S.configInput}
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
            </div>
            <button style={S.syncBtn} onClick={sincronizarCatalogo} disabled={cargando}>
              <RefreshCw size={14} className={cargando ? "spin" : ""} style={cargando ? S.spinIcon : undefined} />
              {cargando ? "Actualizando…" : "Actualizar catálogo"}
            </button>
          </div>
          <div style={S.configHint}>
            En tu Sheet: Archivo → Compartir → Publicar en la Web → elegí la pestaña del catálogo → formato CSV → copiá ese link acá.
            El catálogo NO se vuelve a leer solo; se actualiza únicamente cuando tocás este botón.
          </div>

          <button style={S.manualToggle} onClick={() => setModoManual((v) => !v)}>
            {modoManual ? "Ocultar" : "¿No funciona el link? Pegar CSV manualmente"}
          </button>

          {modoManual && (
            <div style={S.manualBox}>
              <div style={S.configHint}>
                Abrí tu Sheet publicado (o cualquier hoja), seleccioná todas las celdas con datos (incluyendo encabezados), copialas (Ctrl/Cmd+C) y pegalas acá. También funciona pegar el contenido de un archivo .csv.
              </div>
              <textarea
                style={S.manualTextarea}
                placeholder="Cod,Detalle,Piso/Techo,Laterales,Fajas,Est AL,Est BM,Est DS,Pie Estante,Fondo,Frentes,Parante,PF&#10;AL2P,Alacena 2 Puertas,2,2,1,1,0,0,1,1,1,0,0&#10;..."
                value={csvManual}
                onChange={(e) => setCsvManual(e.target.value)}
                rows={6}
              />
              <button style={{ ...S.syncBtn, marginTop: 8 }} onClick={cargarCsvManual} disabled={cargando}>
                <Upload size={14} />
                {cargando ? "Cargando…" : "Cargar catálogo pegado"}
              </button>
            </div>
          )}

          <div style={S.configStatus}>
            {catalogoInfo.fuente === "semilla" ? (
              <span style={S.badgeNeutral}>
                <Upload size={13} /> Usando catálogo semilla ({catalogo.length} códigos) — todavía no conectaste tu Sheet
              </span>
            ) : (
              <span style={S.badgeOk}>
                <CheckCircle2 size={13} /> Catálogo del Sheet ({catalogo.length} códigos) — actualizado{" "}
                {catalogoInfo.actualizado ? new Date(catalogoInfo.actualizado).toLocaleString("es-AR") : ""}
              </span>
            )}
            {errorSync && (
              <span style={S.badgeError}>
                <AlertTriangle size={13} /> {errorSync}
              </span>
            )}
          </div>
        </div>
      )}

      <nav style={S.tabs}>
        <button style={{ ...S.tabBtn, ...(tab === "pedido" ? S.tabBtnActive : {}) }} onClick={() => setTab("pedido")}>
          <ClipboardList size={15} /> Pedido
        </button>
        <button style={{ ...S.tabBtn, ...(tab === "materia" ? S.tabBtnActive : {}) }} onClick={() => setTab("materia")}>
          <Layers size={15} /> Materia Prima
        </button>
      </nav>

      {tab === "pedido" && (
        <div style={S.panel}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={{ ...S.th, width: 44 }}>#</th>
                  <th style={{ ...S.th, width: 70 }}>Cant</th>
                  <th style={{ ...S.th, width: 150 }}>Cód</th>
                  <th style={S.th}>Detalle</th>
                  <th style={{ ...S.th, width: 90 }}>Alto</th>
                  <th style={{ ...S.th, width: 90 }}>Ancho</th>
                  <th style={{ ...S.th, width: 90 }}>Prof</th>
                  <th style={{ ...S.th, width: 44 }}></th>
                </tr>
              </thead>
              <tbody>
                {filasCalculadas.map((f, i) => (
                  <tr key={f.id} style={f.cod && !f.encontrado ? S.trWarn : undefined}>
                    <td style={S.tdIndex}>{i + 1}</td>
                    <td style={S.td}>
                      <input
                        style={S.cellInput}
                        type="number"
                        min="0"
                        value={f.cant}
                        onChange={(e) => actualizarFila(f.id, "cant", e.target.value)}
                      />
                    </td>
                    <td style={S.td}>
                      <input
                        style={{ ...S.cellInput, fontWeight: 600, textTransform: "uppercase" }}
                        type="text"
                        placeholder="AL2P"
                        value={f.cod}
                        onChange={(e) => actualizarFila(f.id, "cod", e.target.value)}
                      />
                    </td>
                    <td style={{ ...S.td, color: "#8a7a63", fontSize: 13 }}>
                      {f.cod ? (f.encontrado ? f.modulo.Detalle || "" : "código no encontrado en catálogo") : ""}
                    </td>
                    <td style={S.td}>
                      <input style={S.cellInput} type="number" placeholder="cm" value={f.alto} onChange={(e) => actualizarFila(f.id, "alto", e.target.value)} />
                    </td>
                    <td style={S.td}>
                      <input style={S.cellInput} type="number" placeholder="cm" value={f.ancho} onChange={(e) => actualizarFila(f.id, "ancho", e.target.value)} />
                    </td>
                    <td style={S.td}>
                      <input style={S.cellInput} type="number" placeholder="cm" value={f.prof} onChange={(e) => actualizarFila(f.id, "prof", e.target.value)} />
                    </td>
                    <td style={S.td}>
                      <button style={S.delBtn} onClick={() => borrarFila(f.id)} title="Quitar fila">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button style={S.addBtn} onClick={agregarFila}>
            <Plus size={15} /> Agregar línea
          </button>

          {filasConError > 0 && (
            <div style={S.warnBanner}>
              <AlertTriangle size={15} />
              {filasConError} {filasConError === 1 ? "línea tiene" : "líneas tienen"} un código que no está en el catálogo cargado. Revisá el nombre o actualizá el catálogo desde "Catálogo" arriba.
            </div>
          )}
        </div>
      )}

      {tab === "materia" && (
        <div style={S.panel}>
          <div style={S.summaryGrid}>
            {PIEZA_ORDER.map((k) => (
              <div key={k} style={S.summaryCard}>
                <div style={S.summaryLabel}>{PIEZA_LABEL[k]}</div>
                <div style={S.summaryValue}>{fmt(totalesPorPieza[k])} m²</div>
              </div>
            ))}
            <div style={{ ...S.summaryCard, ...S.summaryCardTotal }}>
              <div style={{ ...S.summaryLabel, color: "#fff8ee" }}>Total materia prima</div>
              <div style={{ ...S.summaryValue, color: "#fff8ee", fontSize: 22 }}>{fmt(totalGeneral)} m²</div>
            </div>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={{ ...S.th, width: 44 }}>#</th>
                  <th style={{ ...S.th, width: 90 }}>Cód</th>
                  <th style={{ ...S.th, width: 50 }}>Cant</th>
                  {PIEZA_ORDER.map((k) => (
                    <th key={k} style={{ ...S.th, textAlign: "right", minWidth: 78 }}>
                      {PIEZA_LABEL[k]}
                    </th>
                  ))}
                  <th style={{ ...S.th, textAlign: "right", width: 90 }}>Total m²</th>
                </tr>
              </thead>
              <tbody>
                {filasCalculadas
                  .filter((f) => f.cod)
                  .map((f, i) => (
                    <tr key={f.id} style={!f.encontrado ? S.trWarn : undefined}>
                      <td style={S.tdIndex}>{i + 1}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{f.cod}</td>
                      <td style={S.td}>{f.cant}</td>
                      {PIEZA_ORDER.map((k) => (
                        <td key={k} style={{ ...S.td, textAlign: "right", color: f.piezasTotal[k] ? "#3d3327" : "#c9bda3" }}>
                          {fmt(f.piezasTotal[k])}
                        </td>
                      ))}
                      <td style={{ ...S.td, textAlign: "right", fontWeight: 700 }}>{fmt(f.totalLinea)}</td>
                    </tr>
                  ))}
                {filasCalculadas.filter((f) => f.cod).length === 0 && (
                  <tr>
                    <td colSpan={PIEZA_ORDER.length + 4} style={S.emptyMsg}>
                      Cargá líneas en la pestaña "Pedido" para ver el desglose acá.
                    </td>
                  </tr>
                )}
              </tbody>
              {filasCalculadas.filter((f) => f.cod).length > 0 && (
                <tfoot>
                  <tr>
                    <td style={S.tfoot} colSpan={3}>
                      Total
                    </td>
                    {PIEZA_ORDER.map((k) => (
                      <td key={k} style={{ ...S.tfoot, textAlign: "right" }}>
                        {fmt(totalesPorPieza[k])}
                      </td>
                    ))}
                    <td style={{ ...S.tfoot, textAlign: "right" }}>{fmt(totalGeneral)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      <footer style={S.footer}>
        Motor de cálculo validado contra las líneas reales de tu Excel (AL2P, DS1PI, BM2P, BMEPF451PI, etc). Corrección aplicada: el estante de
        alacena usa el ancho/profundidad de cada línea, no el de la primera fila (bug detectado en la fórmula original).
      </footer>
    </div>
  );
}

const S = {
  app: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: "#f6f1e7",
    minHeight: "100%",
    color: "#3d3327",
    padding: "0 0 32px 0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 22px",
    borderBottom: "1px solid #e3d8c2",
    background: "#fbf8f1",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "#b5622f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: "0.02em",
  },
  title: { fontSize: 16, fontWeight: 700, lineHeight: 1.2 },
  subtitle: { fontSize: 12.5, color: "#8a7a63", marginTop: 2 },
  configBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    border: "1px solid #d9c9a8",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#3d3327",
  },
  configPanel: {
    background: "#fffdf8",
    borderBottom: "1px solid #e3d8c2",
    padding: "16px 22px",
  },
  configRow: { display: "flex", gap: 10, alignItems: "flex-end" },
  configLabel: { fontSize: 12, fontWeight: 600, color: "#6b5d47", marginBottom: 5 },
  configInput: {
    width: "100%",
    padding: "9px 11px",
    borderRadius: 7,
    border: "1px solid #d9c9a8",
    fontSize: 13,
    background: "#fff",
    color: "#3d3327",
  },
  syncBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#b5622f",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  spinIcon: { animation: "spin 1s linear infinite" },
  configHint: { fontSize: 12, color: "#8a7a63", marginTop: 9, lineHeight: 1.5 },
  manualToggle: {
    display: "inline-block",
    marginTop: 12,
    border: "none",
    background: "transparent",
    color: "#b5622f",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
  },
  manualBox: {
    marginTop: 10,
    padding: 12,
    background: "#f6f1e7",
    border: "1px solid #e3d8c2",
    borderRadius: 8,
  },
  manualTextarea: {
    width: "100%",
    marginTop: 8,
    padding: 10,
    borderRadius: 7,
    border: "1px solid #d9c9a8",
    fontSize: 12,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    background: "#fff",
    color: "#3d3327",
    resize: "vertical",
  },
  configStatus: { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" },
  badgeNeutral: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    background: "#f0e6d2",
    color: "#7a6a4f",
    padding: "5px 10px",
    borderRadius: 20,
  },
  badgeOk: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    background: "#e3efd9",
    color: "#3f6b2a",
    padding: "5px 10px",
    borderRadius: 20,
  },
  badgeError: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    background: "#f7dede",
    color: "#a13a3a",
    padding: "5px 10px",
    borderRadius: 20,
  },
  tabs: {
    display: "flex",
    gap: 4,
    padding: "14px 22px 0 22px",
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 16px",
    borderRadius: "8px 8px 0 0",
    border: "1px solid transparent",
    background: "transparent",
    fontSize: 13.5,
    fontWeight: 600,
    color: "#8a7a63",
    cursor: "pointer",
  },
  tabBtnActive: {
    background: "#fbf8f1",
    color: "#3d3327",
    border: "1px solid #e3d8c2",
    borderBottom: "1px solid #fbf8f1",
  },
  panel: {
    background: "#fbf8f1",
    margin: "0 22px",
    border: "1px solid #e3d8c2",
    borderRadius: "0 8px 8px 8px",
    padding: 18,
  },
  tableWrap: { overflowX: "auto", borderRadius: 8, border: "1px solid #e9e0cc" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    padding: "9px 10px",
    background: "#f0e6d2",
    color: "#6b5d47",
    fontWeight: 700,
    fontSize: 11.5,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    borderBottom: "1px solid #e3d8c2",
  },
  td: { padding: "6px 8px", borderBottom: "1px solid #f0e9d8", verticalAlign: "middle" },
  tdIndex: { padding: "6px 8px", borderBottom: "1px solid #f0e9d8", color: "#c9bda3", fontSize: 12 },
  trWarn: { background: "#fdf3e9" },
  cellInput: {
    width: "100%",
    border: "1px solid transparent",
    background: "transparent",
    padding: "6px 7px",
    borderRadius: 5,
    fontSize: 13.5,
    color: "#3d3327",
    outline: "none",
  },
  delBtn: {
    border: "none",
    background: "transparent",
    color: "#c98a6b",
    cursor: "pointer",
    padding: 4,
    display: "flex",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    border: "1px dashed #d9c9a8",
    background: "transparent",
    color: "#8a7a63",
    borderRadius: 7,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  warnBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    background: "#fdf3e9",
    border: "1px solid #eccba3",
    color: "#8a5a2c",
    padding: "10px 13px",
    borderRadius: 8,
    fontSize: 13,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    background: "#fff",
    border: "1px solid #e9e0cc",
    borderRadius: 9,
    padding: "12px 14px",
  },
  summaryCardTotal: {
    background: "#3d3327",
    border: "1px solid #3d3327",
  },
  summaryLabel: { fontSize: 11.5, color: "#8a7a63", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" },
  summaryValue: { fontSize: 17, fontWeight: 800, marginTop: 4 },
  emptyMsg: { padding: "26px 10px", textAlign: "center", color: "#b3a689", fontSize: 13 },
  tfoot: { padding: "9px 8px", fontWeight: 800, background: "#f0e6d2", borderTop: "2px solid #d9c9a8" },
  footer: {
    margin: "18px 22px 0 22px",
    fontSize: 11.5,
    color: "#a99b7f",
    lineHeight: 1.5,
  },
};
