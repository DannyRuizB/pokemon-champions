# 🏆 Champions Dex

Guía y herramientas competitivas de **Pokémon Champions**, en una sola página web que **funciona sin conexión** y en **móvil, tablet y PC**.

👉 **Web:** https://dannyruizb.github.io/pokemon-champions/

## Incluye
- 🎓 Guía para principiantes
- 🏅 Top 5 equipos del meta (Reg. M-B)
- ⚔️ Analizador de equipos ("¿qué saco?") — selección, leads, estrategia y matriz de enfrentamientos
- 💥 Calculadora de daño (fórmula Gen 9: EVs, naturaleza, objetos, clima...)
- 📊 Tabla de tipos completa
- 📖 Pokédex del roster con fichas (stats, debilidades/resistencias)

## Uso offline
Descarga `pokemon-champions.html` y ábrelo con cualquier navegador. Un solo archivo, sin instalar nada.

## Regenerar datos (opcional)
Requiere Node.js y `npm install sharp`:
```
node build-data.mjs    # Pokémon + imágenes (webp) -> data.json
node build-moves.mjs   # movimientos -> data.json
node build-html.mjs    # data.json + template.html -> index.html / pokemon-champions.html
```

## Licencia
Código, diseño y textos © 2026 Danny Ruiz — **CC BY-NC 4.0** (libre, no comercial). Ver [LICENSE](LICENSE).
Datos e imágenes de Pokémon © Nintendo · Game Freak · The Pokémon Company (vía PokéAPI). Proyecto fan sin ánimo de lucro.
