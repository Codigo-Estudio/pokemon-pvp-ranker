# README tecnico

## Objetivo tecnico

Este proyecto procesa registros de Pokemon desde un CSV y tambien permite consultar rankings individuales y explorar el dataset local desde una interfaz React.

La aplicacion usa un dataset local para resolver nombre y stats base por `dex` o nombre, y luego genera rankings a partir de todas las combinaciones de IVs posibles.

## Stack tecnico

- `React 19`
- `TypeScript`
- `Vite 7`
- `PapaParse`

## Scripts

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Validacion de rankings

```bash
npm run validate:rankings
```

Observacion: en el estado actual del workspace, `package.json` declara este script pero no existe la carpeta `scripts/` con `validate-rankings.mjs`, por lo que hoy no es ejecutable sin restaurar ese archivo.

## Arquitectura general

### UI

- `src/App.tsx`: shell principal y enrutamiento interno entre paginas
- `src/components/PageLayout.tsx`: layout comun de aplicacion
- `src/components/AppNavigation.tsx`: navegacion principal y estado visual de pagina activa
- `src/components/CsvUploader.tsx`: carga del archivo
- `src/components/ProgressBar.tsx`: estado de avance
- `src/components/ProcessingSummary.tsx`: resumen de exito y errores
- `src/components/ProcessingIssuesModal.tsx`: detalle ampliado de incidencias
- `src/components/ResultsTable.tsx`: tabla de resultados
- `src/components/DataTableToolbar.tsx`: toolbar de tablas con contador, paginacion por pagina y reset
- `src/components/DataTableHeader.tsx`: encabezado reusable con filtros y ordenamiento
- `src/components/DataTablePagination.tsx`: paginacion reusable
- `src/components/DownloadButton.tsx`: exportacion
- `src/components/Icon.tsx`: iconos de la interfaz
- `src/pages/MassRankingPage.tsx`: flujo de ranking masivo
- `src/pages/SingleRankingPage.tsx`: flujo de ranking individual con cards por evolucion y liga
- `src/pages/PokedexPage.tsx`: tabla de consulta del dataset local

### Hooks

- `src/hooks/useMassRanking.ts`: estado y flujo del procesamiento masivo
- `src/hooks/useTableControls.ts`: filtros, ordenamiento y paginacion reutilizable para tablas

### Datos

- `src/data/dexList.json`: fuente local de especies y stats base
- `src/data/CpmLvl.json`: tabla local de multiplicadores por nivel
- `src/data/pokemonGoStats.ts`: acceso por `dex`, nombre y busqueda normalizada

### Servicios

- `src/services/csvService.ts`: parseo y validacion del CSV
- `src/services/rankCalculator.ts`: integracion entre datos base, cache y ranking

### Ranking

- `src/ranking/calculateCore.ts`: acceso a tabla de CPM y utilidades de nivel
- `src/ranking/rankingEngine.ts`: construccion del ranking completo
- `src/ranking/rankingCache.ts`: cache de rankings por especie y liga

### Tipos y utilidades

- `src/types/*`: contratos tipados del dominio
- `src/utils/csvExport.ts`: exportacion del resultado
- `src/utils/historyTemplate.ts`: generacion de plantilla CSV
- `src/utils/rankClassification.ts`: clasificacion visual de tiers para la tabla

## Flujo tecnico

### Flujo de ranking masivo

1. el usuario carga un CSV desde `MassRankingPage`
2. `useMassRanking.ts` valida extension y tamano del archivo
3. `csvService.ts` parsea el archivo con `PapaParse`
4. `pokemonGoStats.ts` resuelve stats base y nombre a partir de `dex`
5. `rankCalculator.ts` solicita el ranking para esa especie y liga
6. `rankingCache.ts` reutiliza rankings previos si ya existen
7. `rankingEngine.ts` construye el ranking si todavia no esta cacheado
8. se obtiene `rank`, `level` y `cp` del spread solicitado
9. la UI actualiza progreso, resumen, incidencias, tabla y exportacion

### Flujo de ranking individual

1. el usuario busca una especie desde `SingleRankingPage`
2. `pokemonGoStats.ts` filtra coincidencias por nombre normalizado o `dex`
3. al seleccionar una especie se obtiene su cadena evolutiva con `getPokemonEvolutionChain`
4. por cada evolucion y por cada liga se invoca `calculateRank`
5. la vista renderiza cards por evolucion con cards internas por liga
6. el estado `Aplica` o `No aplica` se calcula por card comparando el `Nivel actual` del usuario contra el `level` esperado de esa liga

### Flujo de Pokédex

1. `PokedexPage.tsx` obtiene todas las especies con `getAllPokemon`
2. `useTableControls.ts` aplica filtros, ordenamiento y paginacion
3. la tabla renderiza `ID` y `Nombre`

## Logica de calculo

Para cada especie y liga:

1. se generan las `4096` combinaciones de IVs posibles
2. para cada combinacion se calcula el mejor nivel permitido por el limite de CP
3. se calcula el `stat product`
4. se ordenan los resultados por `stat product` y criterios de desempate
5. se asigna el `rank` final

En `Master League` se usa un valor especial sin limite de CP y se toma directamente el nivel maximo soportado por la tabla de CPM.

La cache usa como clave:

- `base attack`
- `base defense`
- `base stamina`
- `leagueCp`

## Formato de entrada

Columnas necesarias:

- `dex`
- `iv_a`
- `iv_d`
- `iv_s`

Detalles de validacion actuales:

- `dex` acepta numero o nombre de Pokemon
- `iv_a`, `iv_d` e `iv_s` deben ser enteros entre `0` y `15`
- filas vacias de plantilla se ignoran
- los errores se registran con `row`, `column` y `detail`

## Estructura del proyecto

```text
src/
	components/
		AppNavigation.tsx
		CsvUploader.tsx
		DataTableHeader.tsx
		DataTablePagination.tsx
		DataTableToolbar.tsx
		DownloadButton.tsx
		Icon.tsx
		PageLayout.tsx
		ProcessingIssuesModal.tsx
		ProcessingSummary.tsx
		ProgressBar.tsx
		ResultsTable.tsx
	data/
		CpmLvl.json
		dexList.json
		pokemonGoStats.ts
	hooks/
		useMassRanking.ts
		useTableControls.ts
	pages/
		MassRankingPage.tsx
		PokedexPage.tsx
		SingleRankingPage.tsx
	ranking/
		calculateCore.ts
		cpCalculator.ts
		rankingCache.ts
		rankingEngine.ts
	services/
		csvService.ts
		rankCalculator.ts
	types/
		PokemonBaseStats.ts
		PokemonRecord.ts
		ProcessingSummary.ts
		RankEntry.ts
		RankResult.ts
	utils/
		csvExport.ts
		historyTemplate.ts
		rankClassification.ts
	App.tsx
	index.css
	main.tsx
```

## Limitaciones tecnicas actuales

- procesamiento secuencial en la UI
- el calculo ocurre en el hilo principal del navegador
- la cache vive en memoria y se reinicia al recargar la app
- dependencia de que la especie exista en el dataset local

## Posibles mejoras tecnicas

- paralelizar o desacoplar parte del procesamiento
- mover el calculo pesado a Web Workers
- mejorar validacion de entrada
- agregar metricas o profiling para archivos grandes
- ampliar dataset local de especies y variantes
- cubrir mas casos especiales del ecosistema PvP