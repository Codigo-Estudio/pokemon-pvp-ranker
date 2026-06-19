# Pokemon PvP Ranker

Aplicación web hecha con `React + TypeScript + Vite` para calcular el ranking PvP de Pokémon a partir de un archivo CSV con IVs.

Repositorio publicado en GitHub:

- `https://github.com/Codigo-Estudio/pokemon-pvp-ranker`

La app:

- carga un archivo `.csv`
- obtiene los stats base del Pokémon usando `PokeAPI`
- calcula el mejor nivel posible bajo un límite de CP
- busca el ranking del spread de IVs dentro de las 4096 combinaciones posibles
- muestra los resultados en tabla
- permite exportar el resultado a un nuevo CSV

## Funcionalidad principal

Actualmente la interfaz permite:

- seleccionar liga por límite de CP
	- `Little`: `500`
	- `Great`: `1500`
	- `Ultra`: `2500`
- subir un archivo CSV con registros de Pokémon
- ver el progreso del procesamiento
- visualizar resultados con:
	- `Dex`
	- `Name`
	- `Atk`
	- `Def`
	- `HP`
	- `Rank`
	- `Level`
	- `CP`
- descargar el resultado procesado en CSV

## Requisitos

- `Node.js` 18 o superior recomendado
- conexión a internet para consultar `https://pokeapi.co`

## Instalación

```bash
npm install
```

## Repositorio y despliegue

El código fuente está versionado en GitHub y listo para seguir con un despliegue en plataformas estáticas como GitHub Pages, Vercel o Netlify.

### Repositorio remoto

- `origin`: `https://github.com/Codigo-Estudio/pokemon-pvp-ranker.git`

### Estado actual

- repositorio Git inicializado
- rama principal: `main`
- build de producción validada con `npm run build`
- archivo `.gitignore` agregado para excluir `node_modules`, `dist` y otros archivos generados

### Opciones de despliegue recomendadas

#### GitHub Pages

Recomendado si quiere alojar el proyecto directamente desde GitHub.

Pasos generales:

1. instalar una estrategia de despliegue para Vite, por ejemplo con `gh-pages`
2. configurar `base` en `vite.config.js` si el sitio se publicará bajo el nombre del repositorio
3. generar la carpeta `dist` con `npm run build`
4. publicar la build en la rama usada por GitHub Pages

Ideal para:

- proyectos estáticos
- portafolios
- demos simples

#### Vercel

Recomendado si quiere un flujo más automático y simple.

Pasos generales:

1. importar el repositorio desde Vercel
2. detectar el proyecto como `Vite`
3. usar la configuración por defecto:
	- build command: `npm run build`
	- output directory: `dist`
4. desplegar

Ideal para:

- despliegue rápido
- previews automáticos por commit
- configuración mínima

#### Netlify

También es una muy buena opción para sitios estáticos.

Pasos generales:

1. importar el repositorio desde Netlify
2. configurar:
	- build command: `npm run build`
	- publish directory: `dist`
3. desplegar

Ideal para:

- frontends estáticos
- previews por rama o pull request
- configuración sencilla desde interfaz web

### Recomendación práctica

Para este proyecto con `React + Vite`, la opción más simple suele ser:

1. `Vercel`
2. `Netlify`
3. `GitHub Pages`

`GitHub Pages` funciona bien, pero normalmente requiere un poco más de configuración en Vite si el sitio no vive en la raíz del dominio.

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo de Vite.

### Build de producción

```bash
npm run build
```

Compila TypeScript y genera la build final.

### Vista previa de producción

```bash
npm run preview
```

Sirve localmente la build generada.

## Formato esperado del CSV

El parser usa `PapaParse` con `header: true`, por lo que el archivo debe incluir encabezados.

Las columnas esperadas por la lógica actual son:

- `dex`
- `atk`
- `def`
- `hp`

También existe soporte en el tipo `PokemonRecord` para campos como:

- `shadow`
- `gl_evo`

pero esos campos no participan actualmente en el cálculo mostrado en pantalla.

### Ejemplo mínimo

```csv
dex,atk,def,hp
1,0,15,15
1,1,14,15
4,0,13,15
```

## Cómo funciona el cálculo

El cálculo principal se realiza en `src/ranking/rankingEngine.ts`.

Para cada Pokémon:

1. se toman los stats base desde `PokeAPI`
2. se generan todas las combinaciones de IVs de `0` a `15`
3. para cada combinación se busca el nivel máximo permitido según el límite de CP de la liga
4. se calcula el `statProduct`
5. se ordenan los resultados de mayor a menor
6. se asigna el `rank` final

Además, se usa una caché en `src/ranking/rankingCache.ts` para reutilizar rankings ya construidos para una combinación de:

- `base attack`
- `base defense`
- `base stamina`
- `leagueCp`

## Flujo de uso

1. iniciar la app
2. elegir la liga
3. seleccionar un archivo CSV
4. esperar a que termine el procesamiento
5. revisar la tabla resultante
6. descargar el CSV generado si hace falta

## Estructura del proyecto

```text
src/
	components/
		CsvUploader.tsx
		DownloadButton.tsx
		ProgressBar.tsx
		ResultsTable.tsx
	ranking/
		calculateCore.ts
		rankingCache.ts
		rankingEngine.ts
	services/
		csvService.ts
		pokeApi.ts
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

## Tecnologías usadas

- `React 19`
- `TypeScript`
- `Vite`
- `PapaParse`
- `PokeAPI`

## Limitaciones actuales

- el procesamiento del archivo es secuencial
- cada fila consulta `PokeAPI` durante el procesamiento
- no hay manejo visual de errores todavía
- no hay validación estricta del formato del CSV en la UI
- el campo `shadow` todavía no afecta el cálculo
- las evoluciones como `gl_evo` no se usan en el flujo principal

## Posibles mejoras

- agregar manejo de errores y mensajes al usuario
- cachear respuestas de `PokeAPI`
- evitar consultas repetidas para el mismo `dex`
- permitir más ligas o límites personalizados
- soportar formas, evoluciones y variantes especiales
- mejorar estilos de la interfaz
- validar el CSV antes de iniciar el cálculo

## Archivos clave

- `src/App.tsx`: flujo principal de carga, procesamiento y renderizado
- `src/services/csvService.ts`: lectura del CSV
- `src/services/rankCalculator.ts`: integración entre caché y ranking
- `src/ranking/rankingEngine.ts`: cálculo de ranking PvP
- `src/utils/csvExport.ts`: exportación del resultado

## Cambios recientes

- se corrigieron errores de TypeScript para permitir una build exitosa
- se agregó `src/data/pokeListObj.d.ts` para tipar el archivo `pokeListObj.js`
- se ajustó `src/services/rankCalculator.ts` para tipado estricto en la búsqueda del ranking

## Nota

Este proyecto calcula rankings en función del `stat product` y del límite de CP configurado, siguiendo un enfoque típico de PvP IV ranking.
