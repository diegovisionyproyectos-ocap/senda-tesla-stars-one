# Senda · TESLA STARS ONE

**NASA Space Apps Challenge 2026** — Del dato abierto a la primera huella.

Senda es un atlas y planificador para la primera caminata humana en **Arcadia Planitia**, Marte. Combina datos de varias misiones de NASA en una vista por capas que ayuda a un astronauta a planear una caminata segura de 2 km y a hacer ciencia en el camino.

## Qué incluye

| Pestaña | Contenido |
|---|---|
| Mapa | Relieve 3D de la región de la Base Ártemis, tres travesías, destinos, peligros y zonas con hielo |
| EVA 2 km | Planificador de la caminata: capas (óptico, pendiente, hielo, percloratos, radiación…), ruta automática segura, consumibles, ventana térmica, clima espacial, vista en primera persona, modo visera (HUD) y relieve 3D con simulación del astronauta |
| Consola | Fuentes reales de NASA y NOAA: posición de Curiosity, clima REMS, clima espacial, enlace Tierra–Marte, imágenes del rover |
| Ciencia · Aterrizaje · Módulo 3D · Riesgos | Plan de la misión, secuencia de aterrizaje y módulo de aterrizaje en 3D |
| Candidatos | Globo 3D de Marte con los sitios candidatos (Arcadia, Gusev, Meridiani) y las reglas del camino de NASA |

El planificador corre en dos sitios: **Base Ártemis (Arcadia)**, el sitio de la misión, y **Gale**, donde se valida con la posición y el recorrido reales de Curiosity.

## Datos

- Posición y recorrido de Curiosity: MMGIS `MSL_waypoints` (NASA/JPL)
- Clima: REMS de Curiosity (Centro de Astrobiología)
- Imágenes: Navcam, Hazcam y ChemCam de Curiosity, sol 5073 (NASA/JPL-Caltech)
- Clima espacial: NOAA SWPC
- Globo: mosaico Viking MDIM2.1 (NASA/JPL/USGS, dominio público)
- Referencias de capas: HiRISE, CTX, MOLA, THEMIS, CRISM, SHARAD, GRS, Phoenix

Los datos reales son una instantánea del 14 de noviembre de 2026. El terreno de la caminata y el relieve del atlas son modelos que reproducen la escala y los rasgos de cada sitio; en una misión real se reemplazan por los productos indicados en cada capa.

## Uso

La app es un solo archivo, sin dependencias externas: `public/index.html`. Funciona sin internet en computadora, tablet y celular.

Para volver a armarla después de editar el código:

```bash
cd src
python build.py
```

Genera `dist/senda-tesla-stars-one.html` y el sitio en `public/`.

## Estructura

```
src/
  arcadia-original.html   Atlas de Arcadia Planitia (versión original del equipo)
  senda/                  Planificador EVA y consola (HTML, CSS, JS, imágenes)
  globe/                  Globo 3D de Marte
  brand-svg.js            Generador de logos y piezas de la marca
  vendor/                 Three.js r128 (MIT), fuentes Unbounded e IBM Plex (OFL), textura de Marte
  build.py                Une todo en un solo archivo
public/                   Sitio publicado en Vercel (app + manual de marca)
logo/ · piezas/           Identidad visual de TESLA STARS ONE
```

## Use of AI (Super Intelligence) · Uso de IA

We used **Claude (Anthropic)**, a large language model, as an assistant. It helped write and debug much of the code in `src/` (web app, data feeds, 3D views and build script), generate the Tesla Stars One logo and brand pieces as SVG code (`src/brand-svg.js`), write the demo deck in `demo/`, and draft the English texts. The team defined the concept, the mission scenario and the safety rules, and reviewed the results. No AI-generated images or audio are used: the photos come from NASA and the slide images are screenshots of the app. The app makes no AI calls at runtime, and no NASA logos or branding are used.

Usamos **Claude (Anthropic)** como asistente para el código, la marca, la presentación y los textos en inglés. El concepto, el escenario de misión y las reglas de seguridad son del equipo.

## Equipo

TESLA STARS ONE · Escuela Cristiana Nikola Tesla
