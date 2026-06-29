# Pokémon Champions — Pokédex y herramientas

Página web local (un solo archivo, funciona sin internet) con:
- Guía para principiantes
- Top 5 equipos del meta (Reg. M-B)
- Analizador de equipos ("¿qué saco?")
- Calculadora de daño
- Tabla de tipos
- Pokédex del roster con fichas (stats, debilidades/resistencias)

## Archivo listo para usar
`pokemon-champions.html` — ábrelo con cualquier navegador.

## Cómo regenerar (datos e imágenes desde PokéAPI)
Requiere Node.js y `npm install sharp`:
```
node build-data.mjs    # descarga Pokémon + imágenes (webp) -> data.json
node build-moves.mjs   # añade los movimientos a data.json
node build-html.mjs    # inyecta data.json en template.html -> pokemon-champions.html
```

Datos: PokéAPI · Roster: Game8 · Equipos: Pikalytics. Proyecto fan sin ánimo de lucro.
