# README funcional

## Objetivo

Esta aplicacion permite trabajar con rankings PvP de Pokemon desde tres flujos de uso complementarios:

- ranking masivo a partir de un archivo CSV con IVs
- ranking individual de una especie y su cadena evolutiva
- consulta basica del dataset local en la Pokedex

## Que puede hacer el usuario

El usuario puede:

- navegar entre `Ranking masivo`, `Ranking individual` y `Pokédex`
- elegir una liga para el flujo masivo
- subir un archivo CSV
- descargar una plantilla de carga
- esperar el procesamiento
- revisar el resumen del procesamiento
- inspeccionar errores por fila y columna
- revisar los resultados masivos en pantalla con filtros, ordenamiento y paginacion
- descargar el resultado final en CSV
- buscar un Pokemon por nombre o `dex` en ranking individual
- ajustar IVs y nivel actual del Pokemon seleccionado
- revisar cards por evolucion y por liga en ranking individual
- consultar el dataset local desde la Pokedex con filtros y paginacion

## Ligas disponibles

- `Little League`: `500 CP`
- `Great League`: `1500 CP`
- `Ultra League`: `2500 CP`
- `Master League`: sin limite de CP

## Informacion mostrada en ranking masivo

La tabla muestra:

- `Dex`
- `Nombre`
- `Rank`
- `Nivel`
- `CP`
- `Atk`
- `Def`
- `HP`

## Informacion mostrada en ranking individual

Cada evolucion del Pokemon se presenta en una card independiente.

Cada card interna de liga muestra unicamente:

- liga
- limite de CP
- `Rank`
- `PC max.`
- `Nivel esperado`
- `Estado`

El estado se representa solo como texto:

- `Aplica`
- `No aplica`

La validacion del estado se resuelve por cada card interna comparando el `Nivel actual` configurado por el usuario contra el `Nivel esperado` de esa liga.

## Informacion mostrada en Pokédex

La Pokedex muestra:

- `ID`
- `Nombre`

## Flujo de uso

### Ranking masivo

1. abrir la aplicacion
2. entrar en `Ranking masivo`
3. seleccionar la liga deseada
4. preparar un CSV valido o descargar la plantilla desde la interfaz
5. cargar el archivo CSV
6. esperar a que el progreso termine
7. revisar el resumen del procesamiento y los posibles errores
8. revisar los resultados calculados en la tabla
9. descargar el CSV final si hace falta

### Ranking individual

1. entrar en `Ranking individual`
2. escribir un nombre o `dex` en el buscador
3. seleccionar el Pokemon desde las coincidencias
4. ajustar los IVs si hace falta
5. ajustar el `Nivel actual`
6. revisar las cards del Pokemon y sus evoluciones
7. comparar el estado de cada liga segun el nivel esperado de esa card

### Pokédex

1. entrar en `Pokédex`
2. usar filtros por ID o nombre
3. ordenar o paginar para explorar el dataset

## Formato esperado del archivo CSV

El archivo debe incluir encabezados.

Columnas requeridas:

- `dex`
- `iv_a`
- `iv_d`
- `iv_s`

La columna `dex` puede contener:

- el numero de Pokedex
- el nombre del Pokemon

### Ejemplo

```csv
dex,iv_a,iv_d,iv_s
1,0,15,15
bulbasaur,1,14,15
4,0,13,15
```

## Como interpreta los datos

- `dex`: identifica la especie por numero o nombre segun el flujo
- `iv_a`: IV de ataque
- `iv_d`: IV de defensa
- `iv_s`: IV de stamina o PS

Con esa informacion, la aplicacion busca internamente los stats base de la especie y calcula el ranking correspondiente para la liga seleccionada o para las cards de ligas disponibles en ranking individual.

## Resultado esperado

Por cada fila valida del CSV, la app devuelve:

- nombre del Pokemon
- ranking PvP
- mejor nivel alcanzable bajo la liga elegida
- CP resultante

Si una fila no puede procesarse, la app no interrumpe todo el archivo: registra el error, indica fila y columna, y continua con el resto.

## Alcance actual

Actualmente la aplicacion cubre:

- procesamiento masivo por CSV
- consulta individual por especie y evoluciones
- exploracion simple del dataset local

## Limitaciones funcionales actuales

- la validacion ocurre durante el procesamiento, no en una vista previa previa a la carga
- el procesamiento puede tardar mas con archivos grandes
- el procesamiento es secuencial en la interfaz
- la Pokedex actual solo muestra `ID` y `Nombre`
- algunas variantes o reglas especiales todavia no forman parte del flujo principal