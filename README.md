# Pokemon PvP Ranker

Aplicacion web hecha con React, TypeScript y Vite para calcular rankings PvP de Pokemon a partir de archivos CSV con IVs o historiales exportados.

Repositorio publicado en GitHub:

- https://github.com/Codigo-Estudio/pokemon-pvp-ranker

## Resumen

La aplicacion procesa lotes de registros, resuelve cada especie con un dataset local y calcula su mejor posicion PvP para la liga seleccionada. El flujo corre completamente del lado del cliente y no depende de APIs externas en tiempo de ejecucion.

## Caracteristicas principales

- carga de archivos `.csv`
- seleccion de liga: `Little League`, `Great League`, `Ultra League` y `Master League`
- soporte para busqueda de especie por `dex` o por nombre de Pokemon
- validacion de filas con detalle de errores por fila y columna
- calculo de ranking PvP por combinacion de IVs
- uso de cache de rankings por especie y liga
- tabla de resultados con filtros, ordenamiento y paginacion
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

Por cada fila valida, la aplicacion devuelve una tabla con:

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
