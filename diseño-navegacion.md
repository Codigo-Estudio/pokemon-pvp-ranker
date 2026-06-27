# Especificación de Diseño UI - Menú de Navegación Horizontal

## 1. Objetivo

Diseñar un menú de navegación horizontal moderno, limpio y escalable para la aplicación **Pokémon PvP Rank Simulator**, priorizando la experiencia de escritorio. El menú deberá servir como navegación principal entre los diferentes módulos de la aplicación y adaptarse posteriormente a un diseño responsive.

---

# 2. Ubicación

* Posición: Superior de la aplicación.
* Ancho: 100%.
* Altura: **72 px**.
* Debe permanecer fijo en la parte superior (Sticky Header) para facilitar la navegación cuando existan tablas largas.
* Separación inferior respecto al contenido principal: **24 px**.

---

# 3. Distribución

La barra se divide en tres zonas:

| Zona      | Contenido                                | Alineación |
| --------- | ---------------------------------------- | ---------- |
| Izquierda | Logo + Nombre de la aplicación           | Izquierda  |
| Centro    | Menú principal                           | Centrado   |
| Derecha   | Acciones (Ayuda, Configuración, Usuario) | Derecha    |

Ejemplo:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ GO  Pokémon PvP Rank Simulator                                               │
│                                                                              │
│      📊 Ranking masivo  👤 Ranking individual  📖 Pokédex      ❓ ⚙ 👤        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Menú Principal

Las opciones del menú deberán representarse como **Tabs de navegación** y no como botones tradicionales.

Opciones iniciales:

1. 📊 Ranking masivo
2. 👤 Ranking individual
3. 📖 Pokédex

---

# 5. Dimensiones de cada Tab

| Propiedad             | Valor         |
| --------------------- | ------------- |
| Altura                | 60 px         |
| Padding vertical      | 14 px         |
| Padding horizontal    | 22 px         |
| Separación entre Tabs | 8 px          |
| Border Radius         | 10px 10px 0 0 |

---

# 6. Estado Normal

### Fondo

```css
background: transparent;
```

### Texto

```css
color: #D2D7E5;
font-size: 16px;
font-weight: 500;
```

### Icono

```css
color: #9AA4B2;
width: 20px;
height: 20px;
```

---

# 7. Estado Hover

Al pasar el cursor sobre una opción del menú se aplicarán los siguientes efectos:

### Fondo

```css
background: rgba(70,120,255,.08);
```

### Texto

```css
color: #FFFFFF;
```

### Icono

```css
color: #61A8FF;
```

### Movimiento

```css
transform: translateY(-1px);
```

### Transición

```css
transition:
background-color .18s ease,
color .18s ease,
transform .12s ease;
```

---

# 8. Estado Activo

La opción seleccionada deberá destacarse mediante tres indicadores visuales.

## Fondo

```css
background: #10294A;
```

## Texto

```css
color: #FFFFFF;
font-weight: 600;
```

## Icono

```css
color: #4EA1FF;
```

## Indicador inferior

```css
height: 3px;
background: #2E8BFF;
border-radius: 3px;
```

Ejemplo:

```text
 __________________________
|                          |
| 📊 Ranking masivo        |
|__________________________|
████████████████████████████
```

---

# 9. Estado Focus

Para accesibilidad, nunca deberá eliminarse el indicador de foco.

```css
outline: 2px solid #3B82F6;
outline-offset: 2px;
```

---

# 10. Iconografía

Se recomienda utilizar una librería consistente (Lucide, Heroicons o Font Awesome).

| Propiedad            | Valor             |
| -------------------- | ----------------- |
| Tamaño               | 20 x 20 px        |
| Separación del texto | 10 px             |
| Alineación           | Vertical centrada |

---

# 11. Tipografía

| Propiedad   | Valor          |
| ----------- | -------------- |
| Fuente      | Inter / Roboto |
| Tamaño      | 16 px          |
| Peso normal | 500            |
| Peso activo | 600            |

---

# 12. Paleta de Colores

| Elemento     | Color                |
| ------------ | -------------------- |
| Navbar       | #091624              |
| Fondo activo | #10294A              |
| Hover        | rgba(58,130,246,.08) |
| Línea activa | #2E8BFF              |
| Texto normal | #D2D7E5              |
| Texto activo | #FFFFFF              |
| Icono normal | #9AA4B2              |
| Icono activo | #55A8FF              |

---

# 13. Animaciones

Las animaciones deberán ser rápidas y discretas.

```css
transition:
background-color .18s ease,
color .18s ease,
border-color .18s ease,
transform .12s ease;
```

No deberán utilizarse animaciones de larga duración ni efectos excesivos.

---

# 14. Comportamiento Responsive

## Escritorio (≥1200 px)

* Menú horizontal completo.
* Todas las opciones visibles.

## Tablet (992 px - 1199 px)

* Menú horizontal con menor separación entre opciones.
* El texto puede reducir ligeramente su tamaño.

## Móvil (<992 px)

* El menú horizontal se reemplazará por un botón hamburguesa.
* El menú aparecerá como panel lateral deslizable (Off-Canvas).
* Se conservará el mismo orden de navegación.

---

# 15. Recomendaciones de UX

* Mantener siempre visible el módulo seleccionado.
* No utilizar más de un color de acento para evitar ruido visual.
* Utilizar iconos descriptivos para facilitar el reconocimiento rápido.
* Mantener consistencia visual entre todos los módulos.
* Evitar botones excesivamente grandes para maximizar el espacio disponible para las tablas de datos.

---

# 16. Escalabilidad

El diseño debe permitir incorporar nuevos módulos sin modificar la estructura principal de la navegación.

Ejemplo futuro:

```text
📊 Ranking masivo
👤 Ranking individual
📖 Pokédex
📈 Estadísticas
🕒 Historial
⚙ Configuración
```

La incorporación de nuevas opciones deberá conservar la misma apariencia visual, comportamiento, espaciado y estados definidos en esta especificación.
