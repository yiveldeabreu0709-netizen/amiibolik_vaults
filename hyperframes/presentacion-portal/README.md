# Presentación del portal Amiibo Vault (HyperFrames)

Video de 33 s, 1920x1080, 30 fps. Guion A: logo, franquicias, dashboard, registro, captura del llavero, cierre.

## Cómo se usa
- Vista previa: `npx hyperframes@0.8.190 preview`
- Validar: `npx hyperframes@0.8.190 check`
- Render: `npx hyperframes@0.8.190 render -o renders/amibo-vault-presentacion.mp4`

## Escenas (`compositions/`)
| Archivo | Tiempo | Qué muestra |
| --- | --- | --- |
| s1-intro.html | 0.0 - 3.7 s | Logo con destello; la marca crece y se vuelve el fondo |
| s2-franquicias.html | 3.5 - 9.7 s | 8 banners de franquicia con barridos distintos |
| s3-dashboard.html | 9.4 - 15.7 s | Tarjetas, cursor estilo Smash, clic y favorito |
| s4-registro.html | 15.4 - 20.8 s | Registrar un Amiibo: foto + .bin + Guardar |
| s5-captura.html | 20.6 - 29.2 s | Llavero absorbe a Sephiroth, 3 meneos, estrellitas |
| s6-cierre.html | 29.0 - 33.0 s | "Tu colección de Amiibos, siempre lista." |

## Sonido
- **Música:** original, chiptune suave, compuesta en código (`build/make_music.py`). Sin licencia de terceros.
- **Efectos:** biblioteca incluida en HyperFrames (Pixabay Content License, ver `assets/sfx/CREDITS.md`). Cada uno cae un fotograma después de su imagen; la lista está en `build/build_index.py`.
- Para cambiar tiempos o volúmenes de efectos: editar `build/build_index.py` y correr `python3 build/build_index.py` (regenera `index.html`).

## Nota sobre capture-core.js
HyperFrames no permite referenciar archivos fuera de la carpeta del proyecto, así que `assets/capture-core.js` es una **copia** de `../captura-amiibolink/capture-core.js`. Si cambias el original, vuelve a copiarlo aquí.
