# README funcional

## Objetivo

Esta aplicación permite calcular el ranking PvP de Pokémon a partir de un archivo CSV con IVs.

Está pensada para tomar registros de entrada, evaluar cada spread según la liga elegida y devolver una tabla con el resultado listo para revisar o exportar.

## Qué puede hacer el usuario

El usuario puede:

- elegir una liga
- subir un archivo CSV
- esperar el procesamiento
- revisar los resultados en pantalla
- descargar el resultado final en CSV

## Ligas disponibles

- `Little`: `500`
- `Great`: `1500`
- `Ultra`: `2500`
- `Master`: opción disponible en la interfaz actual

## Información mostrada en resultados

La tabla muestra:

- `Dex`
- `Name`
- `Atk`
- `Def`
- `HP`
- `Rank`
- `Level`
- `CP`

## Flujo de uso

1. abrir la aplicación
2. seleccionar la liga deseada
3. cargar un archivo CSV válido
4. esperar a que el progreso termine
5. revisar los resultados calculados
6. descargar el CSV si hace falta

## Formato esperado del archivo CSV

El archivo debe incluir encabezados.

Columnas requeridas:

- `dex`
- `atk`
- `def`
- `hp`

### Ejemplo

```csv
dex,atk,def,hp
1,0,15,15
1,1,14,15
4,0,13,15
```

## Cómo interpreta los datos

- `dex`: identifica la especie
- `atk`: IV de ataque
- `def`: IV de defensa
- `hp`: IV de stamina/PS

Con esa información, la aplicación busca internamente los stats base de la especie y calcula el ranking correspondiente para la liga seleccionada.

## Resultado esperado

Por cada fila válida del CSV, la app devuelve:

- nombre del Pokémon
- ranking PvP
- mejor nivel alcanzable bajo la liga elegida
- CP resultante

## Alcance actual

Actualmente la aplicación está enfocada en el flujo principal de ranking por IVs.

Hay campos del dominio que pueden existir en los datos, como `shadow` o `gl_evo`, pero no alteran el comportamiento principal mostrado en pantalla.

## Limitaciones funcionales actuales

- no hay validación visual avanzada del CSV antes de procesar
- no hay mensajes de error detallados en la interfaz
- el procesamiento puede tardar más con archivos grandes
- algunas variantes o reglas especiales todavía no forman parte del flujo principal