// Descarga datos de movimientos (potencia, tipo, físico/especial) y los fusiona en data.json
import fs from 'fs';

async function getJSON(url){
  for(let i=0;i<3;i++){
    try{ const r=await fetch(url); if(r.ok) return await r.json(); }catch(e){}
    await new Promise(r=>setTimeout(r,300));
  }
  return null;
}
async function pool(items,n,fn){
  const out=new Array(items.length); let i=0;
  await Promise.all(Array.from({length:n},async()=>{
    while(i<items.length){ const idx=i++; out[idx]=await fn(items[idx],idx); }
  }));
  return out;
}

console.log("Listando movimientos...");
const list=await getJSON("https://pokeapi.co/api/v2/move?limit=2000");
const names=list.results.map(r=>r.name);
console.log(`${names.length} movimientos. Descargando detalles...`);

const moves={};
let done=0, kept=0;
await pool(names, 14, async name=>{
  const m=await getJSON(`https://pokeapi.co/api/v2/move/${name}`);
  done++;
  if(done%150===0) console.log(`  ${done}/${names.length}...`);
  if(!m) return;
  const cls=m.damage_class?.name; // physical | special | status
  if(cls==='status' || !m.power) return; // solo movimientos que hacen daño
  // nombre legible en español si está disponible
  const es=(m.names||[]).find(x=>x.language.name==='es');
  moves[name]={
    n: es?es.name:m.name.replace(/-/g,' '),
    p: m.power,
    t: m.type.name,
    c: cls==='physical'?'phys':'spec'
  };
  kept++;
});

const data=JSON.parse(fs.readFileSync('data.json','utf8'));
data.moves=moves;
fs.writeFileSync('data.json', JSON.stringify(data));
console.log(`\nHecho. ${kept} movimientos de daño guardados.`);
console.log(`data.json: ${(fs.statSync('data.json').size/1024/1024).toFixed(2)} MB`);
