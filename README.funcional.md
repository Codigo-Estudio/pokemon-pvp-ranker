# README funcional

## Objetivo

Esta aplicacion permite calcular el ranking PvP de Pokemon a partir de un archivo CSV con IVs.

Esta pensada para tomar registros de entrada, evaluar cada spread segun la liga elegida y devolver una tabla con el resultado listo para revisar o exportar.

## Que puede hacer el usuario

El usuario puede:

- elegir una liga
- subir un archivo CSV
- descargar una plantilla de carga
- esperar el procesamiento
- revisar el resumen del procesamiento
- inspeccionar errores por fila y columna
- revisar los resultados en pantalla con filtros, ordenamiento y paginacion
- descargar el resultado final en CSV

## Ligas disponibles

- `Little League`: `500 CP`
- `Great League`: `1500 CP`
- `Ultra League`: `2500 CP`
- `Master League`: sin limite de CP

## Informacion mostrada en resultados

La tabla muestra:

- `Dex`
- `Nombre`
- `Rank`
- `Nivel`
- `CP`
- `Atk`
- `Def`
- `HP`

## Flujo de uso

1. abrir la aplicacion
2. seleccionar la liga deseada
3. preparar un CSV valido o descargar la plantilla desde la interfaz
4. cargar el archivo CSV
5. esperar a que el progreso termine
6. revisar el resumen del procesamiento y los posibles errores
7. revisar los resultados calculados en la tabla
8. descargar el CSV final si hace falta

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

- `dex`: identifica la especie por numero o nombre
- `iv_a`: IV de ataque
- `iv_d`: IV de defensa
- `iv_s`: IV de stamina o PS

Con esa informacion, la aplicacion busca internamente los stats base de la especie y calcula el ranking correspondiente para la liga seleccionada.

## Resultado esperado

Por cada fila valida del CSV, la app devuelve:

- nombre del Pokemon
- ranking PvP
- mejor nivel alcanzable bajo la liga elegida
- CP resultante

Si una fila no puede procesarse, la app no interrumpe todo el archivo: registra el error, indica fila y columna, y continua con el resto.

## Alcance actual

Actualmente la aplicacion esta enfocada en el flujo principal de ranking por IVs.

## Limitaciones funcionales actuales

- la validacion ocurre durante el procesamiento, no en una vista previa previa a la carga
- el procesamiento puede tardar mas con archivos grandes
- el procesamiento es secuencial en la interfaz
- algunas variantes o reglas especiales todavia no forman parte del flujo principal