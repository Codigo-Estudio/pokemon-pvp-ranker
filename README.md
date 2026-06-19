# Pokemon PvP Ranker

Aplicación web hecha con `React + TypeScript + Vite` para calcular rankings PvP de Pokémon a partir de archivos CSV con IVs.

Repositorio publicado en GitHub:

- `https://github.com/Codigo-Estudio/pokemon-pvp-ranker`

## Resumen

La aplicación permite procesar archivos CSV con spreads de IVs para obtener su ranking PvP por liga usando datos locales del proyecto, sin depender de servicios externos en tiempo de ejecución.

## Características principales

- carga de archivos `.csv`
- selección de liga (`Little`, `Great`, `Ultra`, `Master`)
- cálculo de ranking PvP por combinación de IVs
- uso de dataset local para nombre y stats base del Pokémon
- visualización tabular de resultados
- exportación del resultado a CSV

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `PapaParse`

## Uso rápido

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Generar build

```bash
npm run build
```

## Documentación adicional

- `README.funcional.md`: descripción funcional de la app, flujo de uso y formato de entrada
- `README.tecnico.md`: arquitectura, cálculo, estructura del proyecto y detalles técnicos

## Despliegue

Al ser una aplicación estática basada en `Vite`, puede desplegarse en:

- `Vercel`
- `Netlify`
- `GitHub Pages`

La build de producción se genera con `npm run build` y queda en `dist`.
