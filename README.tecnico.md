# README tecnico

## Objetivo tecnico

Este proyecto procesa registros de Pokemon desde un CSV y calcula su ranking PvP en funcion del limite de CP de la liga seleccionada.

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

## Arquitectura general

### UI

- `src/App.tsx`: coordina carga, procesamiento, progreso y renderizado
- `src/components/CsvUploader.tsx`: carga del archivo
- `src/components/ProgressBar.tsx`: estado de avance
- `src/components/ProcessingSummary.tsx`: resumen de exito y errores
- `src/components/ProcessingIssuesModal.tsx`: detalle ampliado de incidencias
- `src/components/ResultsTable.tsx`: tabla de resultados
- `src/components/DownloadButton.tsx`: exportacion
- `src/components/Icon.tsx`: iconos de la interfaz

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

1. el usuario carga un CSV
2. `csvService` parsea el archivo con `PapaParse`
3. `App.tsx` recorre cada fila valida
4. `pokemonGoStats.ts` resuelve stats base y nombre a partir de `dex` o nombre
5. `rankCalculator.ts` solicita el ranking para esa especie y liga
6. `rankingCache.ts` reutiliza rankings previos si ya existen
7. `rankingEngine.ts` construye el ranking si todavia no esta cacheado
8. se obtiene el `rank`, `level` y `cp` del spread solicitado
9. la UI actualiza progreso, resumen, incidencias, tabla y exportacion

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
		CsvUploader.tsx
		DownloadButton.tsx
		Icon.tsx
		ProcessingIssuesModal.tsx
		ProcessingSummary.tsx
		ProgressBar.tsx
		ResultsTable.tsx
	data/
		CpmLvl.json
		dexList.json
		pokemonGoStats.ts
	ranking/
		calculateCore.ts
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