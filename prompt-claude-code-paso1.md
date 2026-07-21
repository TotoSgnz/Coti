# Prompt para Claude Code — Paso 1: Web real de Materia Prima

Copiá y pegá esto como primer mensaje en Claude Code, en una carpeta nueva y vacía.

---

## CONTEXTO

Estoy construyendo un cotizador web para una fábrica de muebles a medida (melamina). Ya validé la lógica de negocio en un prototipo dentro de Claude.ai; ahora quiero pasar a una web real, hosteada, para probar la sincronización con Google Sheets (que en la vista previa de Claude no funciona por sandboxing, pero en una web normal sí).

**Alcance de ESTE paso, nada más:**
1. Pantalla "Pedido": grilla editable con columnas Cant, Cód, Alto, Ancho, Prof (una fila por módulo).
2. Pantalla "Materia Prima": desglose en m² por tipo de pieza para cada línea del pedido, más totales.
3. Catálogo de módulos (`BD`) cargado desde un Google Sheet publicado como CSV (link público tipo `.../pub?output=csv`), con un botón "Actualizar catálogo" que lo vuelve a leer SOLO cuando se lo toca (no automáticamente).
4. Deploy gratuito en Vercel (o Netlify/Cloudflare Pages si lo considerás mejor — explicá por qué).

**NO hacer todavía:** precios, herrajes, cantos, mano de obra, exportación de venta, multi-fábrica. Eso viene después, en pasos siguientes.

## STACK

- React + Vite + TypeScript.
- Sin backend propio por ahora: el catálogo se lee directo del CSV publicado de Google Sheets vía `fetch`, y el pedido se guarda en `localStorage` del navegador (no hace falta base de datos todavía).
- Deploy: Vercel, conectado a un repo de GitHub, plan gratuito.

## MOTOR DE CÁLCULO — YA VALIDADO, NO REINVENTAR

Estas fórmulas fueron extraídas y confirmadas línea por línea contra pedidos reales del Excel original de la fábrica (hoja `Melamina`). Van en un módulo aislado `/src/engine/materiaPrima.ts`, con tests unitarios que reproduzcan los casos de abajo.

Todas las medidas de entrada (Alto, Ancho, Prof) están en **cm**. Los resultados son en **m²**.

Cada código del catálogo (`BD`) tiene estas columnas (cantidades/fracciones fijas por módulo):
`Cod, Detalle, "Piso/Techo", Laterales, Fajas, "Est AL", "Est BM", "Est DS", "Pie Estante", Fondo, Frentes, Parante, PF`

Fórmulas (siendo A=Alto, W=Ancho, P=Prof, y `cant` la cantidad de esa pieza definida en el catálogo para ese Cod):

```
pisoTecho = cant("Piso/Techo") * W * P / 10000
lateral   = cant(Laterales)    * A * P / 10000
faja      = cant(Fajas)        * W * 8 / 10000          // faja siempre 8cm de alto, fijo
fondo     = cant(Fondo)        * A * W / 10000           // Fondo es fracción (0, 0.5, 0.7, 1, 2...)
frentes   = cant(Frentes)      * A * W / 10000           // ídem, fracción
parante   = cant(Parante)      * A * 8 / 10000            // parante siempre 8cm de ancho, fijo

estBM = cant("Est BM") * (W - 3.6) * (P - 4) / 10000

estAL = cant("Est AL") * tramoAL(A) * (W - 3.6) * (P - 4) / 10000
  donde tramoAL(A):
    A < 43   -> 0
    A < 65   -> 1
    A < 77   -> 2
    A < 110  -> 3
    si no    -> 4

estDS = cant("Est DS") * tramoDS(A) * (W - 3.6) * (P - 4) / 10000
  donde tramoDS(A):
    A > 200  -> 4
    A > 155  -> 3
    A > 80   -> 3
    si no    -> 2

pieEstante = cant("Pie Estante") * (W > 100 ? 1 : 0) * (A / 3) * 2 * (P - 4) / 10000

pf = cant(PF) * extraerNumeroPF(Cod) * A / 10000
  donde extraerNumeroPF(Cod): si Cod empieza con "BMEPF", tomar los 2 caracteres
  en las posiciones 6-7 del código (ej. "BMEPF45..." -> 45) y parsearlos como número.
  Si no empieza con "BMEPF", devuelve 0.
```

⚠️ **Nota importante sobre un bug del Excel original:** la fórmula de `estAL` en el Excel de la fábrica usaba el Ancho/Prof de la PRIMERA fila cargada en vez de los de cada línea (bug de referencia `$` congelada). Acá la implementación usa el Ancho/Prof de CADA línea, que es el comportamiento correcto. Dejalo así, es intencional.

### Casos de prueba (validados contra el Excel real — usar como tests unitarios)

| Cod | Alto | Ancho | Prof | pisoTecho | lateral | faja | estAL | estBM | estDS | pieEstante | fondo | frentes | parante | pf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ALB | 36 | 100 | 32 | 0.64 | 0.2304 | 0.08 | 0 | 0 | 0 | 0 | 0.36 | 0.36 | 0 | 0 |
| AL1PI | 30 | 100 | 32 | 0.64 | 0.192 | 0.08 | 0 | 0 | 0 | 0 | 0.3 | 0.3 | 0 | 0 |
| AL2P | 108 | 80 | 32 | 0.512 | 0.6912 | 0.064 | 0.64176* | 0 | 0 | 0 | 0.864 | 0.864 | 0 | 0 |
| BM2P | 72 | 110 | 59 | 0.649 | 0.8496 | 0.176 | 0 | 0.5852 | 0 | 0.264 | 0.792 | 0.792 | 0 | 0 |
| BM1PI | 30 | 60 | 59 | 0.354 | 0.354 | 0.096 | 0 | 0.3102 | 0 | 0 | 0.18 | 0.18 | 0 | 0 |
| DS1PI | 205 | 40 | 59 | 0.472 | 2.419 | 0.032 | 0 | 0 | 0.8008 | 0 | 0.82 | 0.82 | 0 | 0 |
| BMEPF451PI | 72 | 100 | 59 | 0.59 | 0.8496 | 0.32 | 0 | 0.5302 | 0 | 0 | 0.72 | 0.72 | 0.1152 | 0.324 |

*El valor de `estAL` para AL2P es 0.64176 con la fórmula CORREGIDA (usando el Ancho/Prof propio de esa línea). En el Excel original, con el bug, ese mismo caso daba 0.8098 (usando 100×32 en vez de 80×32) — si al testear ves 0.8098 en algún lado, es el bug viejo, no lo repliques.

Catálogo semilla (`modulos.json`, 90 códigos) y el ejemplo funcional de la UI están en los archivos adjuntos a este mensaje — usalos como base, no hace falta pedirle los datos de nuevo a la fábrica.

## SINCRONIZACIÓN CON GOOGLE SHEETS

- Un input de texto donde se pega el link CSV publicado (`Archivo → Compartir → Publicar en la Web → pestaña específica → formato CSV`).
- Botón "Actualizar catálogo": hace `fetch` a ese link, parsea el CSV (usar `papaparse`), y reemplaza el catálogo en memoria + `localStorage`. Nunca se hace fetch automático al cargar la página, solo cuando se toca el botón.
- Manejo de error claro si el fetch falla (link mal copiado, hoja no publicada, etc.) — mostrar el motivo, no solo "error".

## ENTREGABLE QUE QUIERO DE VOS (Claude Code)

1. Estructura de carpetas del repo (Vite + React + TS).
2. `/src/engine/materiaPrima.ts` con las fórmulas de arriba + tests unitarios con los 7 casos de la tabla.
3. Pantallas "Pedido" y "Materia Prima" (podés tomar como referencia visual el artifact `cotizador-materia-prima.jsx` adjunto, pero no hace falta copiarlo literal — mejorá lo que veas necesario).
4. Sincronización de catálogo vía link CSV publicado, con botón manual.
5. `README.md` con los pasos para: correr en local, subir a GitHub, y desplegar en Vercel gratis (paso a paso, asumí que no tengo experiencia previa con deploys).
6. Dejalo andando en Vercel si tenés forma de hacerlo vos mismo; si no, dejame los pasos exactos para que yo lo haga en 5 minutos.

No implementes catálogo editable desde la web todavía (eso sigue viviendo en el Google Sheet), ni precios, ni herrajes. Primero quiero confirmar que el link de Google Sheets funciona de verdad en una web hosteada y que la Materia Prima calcula igual que en el prototipo.
