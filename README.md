# Pokemon PvP Ranker

Aplicacion web hecha con React, TypeScript y Vite para consultar y calcular rankings PvP de Pokemon desde una interfaz cliente con dataset local.

Repositorio publicado en GitHub:

- https://github.com/Codigo-Estudio/pokemon-pvp-ranker

## Resumen

La aplicacion corre completamente del lado del cliente y no depende de APIs externas en tiempo de ejecucion. Actualmente ofrece tres vistas principales: ranking masivo por CSV, ranking individual por especie y una Pokedex basica para exploracion del dataset.

## Caracteristicas principales

- navegacion entre `Ranking masivo`, `Ranking individual` y `Pokédex`
- carga de archivos `.csv` para procesamiento masivo
- seleccion de liga: `Little League`, `Great League`, `Ultra League` y `Master League`
- busqueda de especie por `dex` o por nombre en ranking individual y dataset local
- validacion de filas con detalle de errores por fila y columna
- calculo de ranking PvP por combinacion de IVs con cache en memoria
- tabla de resultados con filtros, ordenamiento y paginacion para ranking masivo y Pokedex
- vista por cards para ranking individual del Pokemon y sus evoluciones
- exportacion del resultado procesado a CSV
- descarga de plantilla de entrada

## Stack

- React 19
- TypeScript
- Vite 7
- PapaParse

## Uso rapido

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Generar build de produccion

```bash
npm run build
```

### Previsualizar la build

```bash
npm run preview
```

### Validar rankings

```bash
npm run validate:rankings
```

Nota: el script `validate:rankings` esta declarado en `package.json`, pero en el estado actual del workspace no existe la carpeta `scripts/` con `validate-rankings.mjs`. Si necesitas usarlo, primero hay que restaurar o agregar ese archivo.

## Vistas actuales

### Ranking masivo

Permite seleccionar una liga, cargar un CSV, procesar filas validas, revisar el resumen del procesamiento, inspeccionar incidencias y exportar los resultados calculados.

### Ranking individual

Permite buscar un Pokemon por nombre o `dex`, ajustar IVs y nivel actual, y ver el ranking del Pokemon y sus evoluciones en cards internas para `Little`, `Great`, `Ultra` y `Master League`.

Cada card interna muestra:

- liga
- limite de CP
- rank
- PC maximo
- nivel esperado
- estado `Aplica` o `No aplica`

### Pokédex

Muestra una tabla simple del dataset local con filtros por ID y nombre, ordenamiento y paginacion.

## Formato de entrada

El archivo CSV debe incluir encabezados. Actualmente el parser espera estas columnas:

- `dex`
- `iv_a`
- `iv_d`
- `iv_s`

La columna `dex` admite tanto un numero de Pokedex como el nombre de la especie. Filas vacias de plantilla se ignoran automaticamente.

### Ejemplo

```csv
dex,iv_a,iv_d,iv_s
1,0,15,15
bulbasaur,1,14,15
4,0,13,15
```

## Resultado

En ranking masivo, por cada fila valida la aplicacion devuelve una tabla con:

- `Dex`
- `Nombre`
- `Rank`
- `Nivel`
- `CP`
- `Atk`
- `Def`
- `HP`

Ademas muestra progreso, cantidad de registros exitosos, errores detectados y detalle ampliado de incidencias cuando corresponde.

## Documentacion adicional

- `README.funcional.md`: flujo funcional, reglas de entrada y comportamiento de la interfaz
- `README.tecnico.md`: arquitectura, estructura real del proyecto y logica de calculo

## Despliegue

Al ser una aplicacion estatica basada en Vite, puede desplegarse en:

- Vercel
- Netlify
- GitHub Pages

La build de produccion se genera con `npm run build` y queda en `dist`.
