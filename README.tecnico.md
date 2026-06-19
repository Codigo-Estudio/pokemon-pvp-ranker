# README técnico

## Objetivo técnico

Este proyecto procesa registros de Pokémon desde un CSV y calcula su ranking PvP en función del límite de CP de la liga seleccionada.

La aplicación usa un dataset local para resolver nombre y stats base por `dex`, y luego genera rankings a partir de todas las combinaciones de IVs posibles.

## Stack técnico

- `React 19`
- `TypeScript`
- `Vite`
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

### Validación de rankings

```bash
npm run validate:rankings
```

## Arquitectura general

### UI

- `src/App.tsx`: coordina carga, procesamiento, progreso y renderizado
- `src/components/CsvUploader.tsx`: carga del archivo
- `src/components/ProgressBar.tsx`: estado de avance
- `src/components/ResultsTable.tsx`: tabla de resultados
- `src/components/DownloadButton.tsx`: exportación

### Datos

- `src/data/pokeListObj.js`: fuente local de especies y stats
- `src/data/pokeListObj.d.ts`: tipado del archivo JS
- `src/data/pokemonGoStats.ts`: adaptación a un acceso por `dex`

### Servicios

- `src/services/csvService.ts`: parseo del CSV
- `src/services/rankCalculator.ts`: integración entre datos base, caché y ranking

### Ranking

- `src/ranking/calculateCore.ts`: lógica base de cálculo
- `src/ranking/rankingEngine.ts`: construcción del ranking completo
- `src/ranking/rankingCache.ts`: caché de rankings por especie y liga

### Tipos y utilidades

- `src/types/*`: contratos tipados del dominio
- `src/utils/csvExport.ts`: exportación del resultado
- `src/utils/pokemonMapper.ts`: utilidades auxiliares relacionadas con mapeo

## Flujo técnico

1. el usuario carga un CSV
2. `csvService` parsea el archivo con `PapaParse`
3. `App.tsx` recorre cada fila
4. `pokemonGoStats.ts` resuelve stats base y nombre a partir de `dex`
5. `rankCalculator.ts` solicita el ranking para esa especie y liga
6. `rankingCache.ts` reutiliza rankings previos si ya existen
7. `rankingEngine.ts` construye el ranking si todavía no está cacheado
8. se obtiene el `rank`, `level` y `cp` del spread solicitado
9. la UI actualiza progreso, tabla y exportación

## Lógica de cálculo

Para cada especie y liga:

1. se generan las `4096` combinaciones de IVs posibles
2. para cada combinación se calcula el mejor nivel permitido por el límite de CP
3. se calcula el `stat product`
4. se ordenan los resultados de mayor a menor
5. se asigna el `rank` final

La caché usa como clave:

- `base attack`
- `base defense`
- `base stamina`
- `leagueCp`

## Formato de entrada

Columnas necesarias:

- `dex`
- `atk`
- `def`
- `hp`

Campos soportados por tipos pero no usados actualmente en el cálculo principal:

- `shadow`
- `gl_evo`

## Estructura del proyecto

```text
src/
	components/
		CsvUploader.tsx
		DownloadButton.tsx
		ProgressBar.tsx
		ResultsTable.tsx
	data/
		pokeListObj.d.ts
		pokeListObj.js
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
		RankEntry.ts
		RankResult.ts
	utils/
		csvExport.ts
		pokemonMapper.ts
	App.tsx
	main.tsx
	index.css
```

## Limitaciones técnicas actuales

- procesamiento secuencial en la UI
- sin manejo visual robusto de errores
- validación de CSV todavía básica
- `shadow` y `gl_evo` no participan del cálculo
- dependencia de que el `dex` exista en el dataset local

## Posibles mejoras técnicas

- paralelizar o desacoplar parte del procesamiento
- mejorar validación de entrada
- agregar manejo de errores de dominio y de interfaz
- ampliar dataset local de especies y variantes
- cubrir más casos especiales del ecosistema PvP