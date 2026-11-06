# HG Growth Lab · Cola de carruseles

Rama de contenido para Instagram (@hg_growthlab). La web vive en `main`; esta rama no se despliega.

- `engine/render.js`: arma los slides (1080×1350 JPEG) desde `queue/AAAA-MM-DD/post.json`.
- `queue/AAAA-MM-DD/`: un carrusel por día (`post.json` + `slideN.jpg` + imágenes opcionales `img_*.jpg`; en el JSON, `"img": "img_portada.jpg"` en una slide cover o point; una slide con foto debe tener poco texto).
- `historial.md`: temas ya publicados, para no repetir.

Estados de `post.json`: `pendiente` (se publica si pasaron 24 h desde que se generó), `aprobado`, `saltar`, `publicado`, `error`.
