# Cotizador — Materia Prima (Paso 1)

Web para cargar un pedido de módulos de melamina y calcular el desglose de materia prima (m² por tipo de pieza), con el catálogo de módulos sincronizado desde un Google Sheet publicado como CSV.

**Este paso NO incluye:** precios, herrajes, cantos, mano de obra, exportación de venta ni catálogo editable desde la web. Eso viene en pasos siguientes.

## Qué hay acá

- **Pantalla "Pedido"**: grilla editable (Cant, Cód, Alto, Ancho, Prof), una fila por módulo. El pedido se guarda solo en el navegador (`localStorage`), no hay base de datos ni backend.
- **Pantalla "Materia Prima"**: desglose en m² por tipo de pieza (piso/techo, laterales, fajas, fondo, frentes, estantes, parante, PF) para cada línea del pedido, más totales.
- **Catálogo de módulos**: 90 códigos semilla incluidos (`src/data/catalogoSemilla.ts`, generado desde `catalogo_BD.csv`). Botón "Actualizar catálogo" para leer un Google Sheet publicado como CSV — nunca se actualiza solo, solo cuando lo tocás.
- **Motor de cálculo**: `src/engine/materiaPrima.ts`, con 16 tests unitarios (`npm test`) que reproducen los 7 casos reales validados contra el Excel original de la fábrica, más los tramos de estantes y la extracción de PF.

## 1. Correr en tu computadora (local)

Necesitás [Node.js](https://nodejs.org) instalado (versión 18 o superior; en esta compu ya está la v24).

```bash
# 1. Instalar las dependencias (una sola vez, o cuando cambie package.json)
npm install

# 2. Correr los tests del motor de cálculo
npm test

# 3. Levantar la web en modo desarrollo
npm run dev
```

El paso 3 va a mostrar algo como `Local: http://localhost:5173/` — abrí esa URL en el navegador. Los cambios que hagas en el código se ven al instante (hot reload).

Para generar la versión de producción (lo que se sube a internet):

```bash
npm run build     # genera la carpeta dist/ optimizada
npm run preview   # la sirve localmente para revisarla antes de publicar
```

## 2. Conectar tu Google Sheet como catálogo

1. En tu Google Sheet, andá a **Archivo → Compartir → Publicar en la Web**.
2. Elegí la pestaña que tiene el catálogo (columnas: `Cod, Detalle, Piso/Techo, Laterales, Fajas, Est AL, Est BM, Est DS, Pie Estante, Fondo, Frentes, Parante, PF`).
3. En "Formato" elegí **Valores separados por comas (.csv)** y publicá.
4. Copiá el link que te da Google (termina en `pub?output=csv` o similar).
5. En la web, apretá el botón **"Catálogo"** (arriba a la derecha), pegá el link, y tocá **"Actualizar catálogo"**.
6. Si algo falla, el mensaje de error te va a decir el motivo (link mal copiado, hoja no publicada, falta la columna `Cod`, etc.).

El catálogo actualizado queda guardado en el navegador — no hace falta volver a pegarlo cada vez que abrís la web, y no se vuelve a leer solo del Sheet a menos que aprietes el botón de nuevo.

## 3. Subir el código a GitHub

Si nunca usaste GitHub desde la terminal, seguí estos pasos exactos desde la carpeta del proyecto:

```bash
# Si es la primera vez que usás git en esta compu, configurá tu nombre y mail (una sola vez):
git config --global user.name "Tu Nombre"
git config --global user.email "tu-mail@ejemplo.com"

# Inicializar el repositorio (si todavía no lo es)
git init
git add .
git commit -m "Cotizador materia prima - paso 1"
```

Después:

1. Entrá a [github.com](https://github.com) y creá una cuenta si no tenés.
2. Hacé clic en **New repository** (botón verde), poné un nombre (ej: `cotizador-materia-prima`), dejalo **público o privado** (da igual para Vercel), y **no** marques "Add a README" (ya tenemos uno). Creá el repo.
3. GitHub te va a mostrar unos comandos para conectar tu carpeta local. Van a ser parecidos a:

```bash
git remote add origin https://github.com/TU-USUARIO/cotizador-materia-prima.git
git branch -M main
git push -u origin main
```

Ejecutalos en la terminal, en la carpeta del proyecto. Te va a pedir que inicies sesión en GitHub la primera vez (se abre el navegador).

## 4. Desplegar gratis en Vercel

Elegimos **Vercel** porque detecta automáticamente que es un proyecto Vite + React (no hay que configurar nada a mano), tiene el plan gratuito más simple para este caso, y cada vez que hagas `git push` vuelve a publicar solo. (Netlify y Cloudflare Pages también sirven y son gratis, pero Vercel tiene el flujo más directo para Vite sin tocar configuración.)

1. Entrá a [vercel.com](https://vercel.com) y creá una cuenta gratis — el botón **"Continue with GitHub"** es el más simple, así queda conectado de una.
2. En el dashboard, hacé clic en **"Add New..." → "Project"**.
3. Elegí el repositorio `cotizador-materia-prima` que subiste en el paso anterior (si no aparece, tocá "Adjust GitHub App Permissions" y dale acceso).
4. Vercel va a detectar solo **"Vite"** como framework. No hace falta cambiar nada:
   - Build Command: `npm run build` (ya viene solo)
   - Output Directory: `dist` (ya viene solo)
5. Hacé clic en **"Deploy"** y esperá 1-2 minutos.
6. Cuando termina, te da una URL pública tipo `https://cotizador-materia-prima.vercel.app` — esa es tu web real, ya hosteada.

De ahí en más, cada vez que quieras publicar un cambio:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel detecta el push y vuelve a desplegar solo, en general en menos de 2 minutos.

## Estructura del proyecto

```
├── src/
│   ├── engine/
│   │   ├── materiaPrima.ts        # motor de cálculo (fórmulas)
│   │   └── materiaPrima.test.ts   # tests con los 7 casos validados
│   ├── data/
│   │   └── catalogoSemilla.ts     # catálogo semilla (90 códigos, desde catalogo_BD.csv)
│   ├── lib/
│   │   ├── csvCatalogo.ts         # parseo del CSV del Google Sheet
│   │   ├── csvCatalogo.test.ts
│   │   ├── storage.ts             # helpers de localStorage
│   │   └── format.ts
│   ├── components/
│   │   ├── CatalogoPanel.tsx      # UI de sincronización del catálogo
│   │   ├── PedidoTab.tsx
│   │   └── MateriaPrimaTab.tsx
│   ├── types.ts
│   ├── App.tsx
│   └── main.tsx
├── catalogo_BD.csv                # catálogo original (referencia, no se usa en runtime)
└── cotizador-materia-prima.jsx    # prototipo original (referencia visual, no se usa en runtime)
```

## Notas técnicas

- No hay backend propio: el catálogo se lee directo del CSV publicado vía `fetch` desde el navegador, y el pedido vive en `localStorage`. Si limpiás los datos del navegador (o entrás desde otra compu), el pedido se pierde — eso es esperado en este paso.
- `npm audit` puede marcar vulnerabilidades moderadas en `esbuild`/`vite` (herramientas de desarrollo, no del código que se publica) — no afectan la web ya construida en `dist/`.
