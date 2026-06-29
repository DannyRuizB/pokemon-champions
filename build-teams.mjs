// Normaliza 20 equipos reales (Pikalytics) y los embebe en data.json como teamsDB.
// Descarga los Pokémon que aún no estén en data.json.
import fs from 'fs';
import sharp from 'sharp';

const TEAMS_RAW = [
  ["burningblazer","14-2","Floette-Eternal-Mega, Charizard-Mega-Y, Kingambit, Whimsicott, Basculegion, Garchomp"],
  ["DaniVGC03","13-1","Swampert-Mega, Pelipper, Archaludon, Sinistcha, Maushold, Gholdengo"],
  ["ege","9-0","Froslass-Mega, Scovillain-Mega, Lycanroc, Kingambit, Basculegion, Sneasler"],
  ["DonVGC","7-0","Basculegion, Aerodactyl, Sinistcha, Kangaskhan-Mega, Floette-Eternal-Mega, Incineroar"],
  ["MysticRy","10-1","Froslass-Mega, Kingambit, Primarina, Sneasler, Arcanine-Hisui, Pelipper"],
  ["Snorlaxpikachu1","9-1","Pyroar-Mega, Whimsicott, Ninetales, Farigiraf, Basculegion, Floette-Eternal-Mega"],
  ["Joshua De Jose","8-1","Raichu-Mega-Y, Mawile-Mega, Sinistcha, Ceruledge, Milotic, Incineroar"],
  ["2cake","6-0","Pelipper, Archaludon, Sinistcha, Swampert-Mega, Maushold, Overqwil"],
  ["Chinese Spy","8-1","Charizard-Mega-Y, Metagross-Mega, Samurott-Hisui, Sylveon, Garchomp, Aerodactyl"],
  ["adilor232","5-0","Lycanroc, Basculegion, Kingambit, Scizor-Mega, Sableye, Archaludon"],
  ["Gotou","9-2","Metagross-Mega, Floette-Eternal-Mega, Talonflame, Garchomp, Ceruledge, Ninetales-Alola"],
  ["MrAwesome","5-0","Rotom-Wash, Vanilluxe, Whimsicott, Floette-Eternal-Mega, Incineroar, Ceruledge"],
  ["averagememer57","9-2","Charizard-Mega-Y, Aerodactyl-Mega, Farigiraf, Garchomp, Sylveon, Kingambit"],
  ["Silo","10-0","Gholdengo, Garchomp, Whimsicott, Incineroar, Sylveon, Staraptor-Mega"],
  ["Rodrigo Javier","5-0","Charizard-Mega-Y, Floette-Eternal-Mega, Whimsicott, Garchomp, Kingambit, Basculegion"],
  ["jiholee32","6-0","Floette-Eternal-Mega, Incineroar, Garchomp, Charizard-Mega-Y, Sinistcha, Venusaur"],
  ["TenkiPK","8-1","Charizard-Mega-Y, Floette-Eternal-Mega, Garchomp, Whimsicott, Basculegion, Kingambit"],
  ["Altkyle","11-1","Dragonite-Mega, Basculegion, Scizor-Mega, Archaludon, Pelipper, Incineroar"],
  ["naibot2814","7-1","Metagross-Mega, Sneasler, Incineroar, Hydreigon, Aerodactyl, Floette-Eternal-Mega"],
  ["GielBakker","8-2","Gengar-Mega, Incineroar, Sneasler, Kommo-o, Swampert-Mega, Politoed"],
];

const SPECIES_FIX={pyroar:'pyroar-male',lycanroc:'lycanroc-midday',maushold:'maushold-family-of-four',
  aegislash:'aegislash-shield',mimikyu:'mimikyu-disguised',basculegion:'basculegion-male'};

const data=JSON.parse(fs.readFileSync('data.json','utf8'));

async function getJSON(u){ for(let i=0;i<3;i++){ try{const r=await fetch(u); if(r.ok)return await r.json(); if(r.status===404)return null;}catch(e){} await new Promise(r=>setTimeout(r,300)); } return null; }
async function getImg(u){ if(!u)return null; for(let i=0;i<3;i++){ try{const r=await fetch(u); if(r.ok){const b=Buffer.from(await r.arrayBuffer());
  return "data:image/webp;base64,"+(await sharp(b).resize(220,220,{fit:'inside'}).webp({quality:78}).toBuffer()).toString('base64');}}catch(e){} await new Promise(r=>setTimeout(r,300)); } return null; }

function candidates(name){
  const s=name.toLowerCase().replace(/[.'’]/g,'').replace(/\s+/g,'-');
  const base=s.replace(/-mega(-[xy])?$/,'');
  const sp=base.split('-')[0];
  const list=[s,base];
  if(SPECIES_FIX[base]) list.push(SPECIES_FIX[base]);
  if(SPECIES_FIX[sp]) list.push(SPECIES_FIX[sp]);
  list.push(sp);
  return [...new Set(list)];
}

const resolvedCache=new Map();
async function resolve(name){
  if(resolvedCache.has(name)) return resolvedCache.get(name);
  for(const c of candidates(name)){
    if(data.pokemon[c]){ resolvedCache.set(name,c); return c; }       // ya está embebido
  }
  for(const c of candidates(name)){
    const d=await getJSON(`https://pokeapi.co/api/v2/pokemon/${c}`);
    if(d){
      const stats={}; d.stats.forEach(x=>stats[x.stat.name]=x.base_stat);
      data.pokemon[c]={ id:d.id, name:d.name, types:d.types.map(t=>t.type.name),
        abilities:d.abilities.map(a=>a.ability.name), stats,
        img: await getImg(d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default) };
      console.log("  + nuevo:",c);
      resolvedCache.set(name,c); return c;
    }
  }
  console.log("  ✗ no resuelto:",name);
  resolvedCache.set(name,null); return null;
}

const teamsDB=[];
for(const [n,rec,monsStr] of TEAMS_RAW){
  const mons=[];
  for(const raw of monsStr.split(',').map(x=>x.trim())){
    const s=await resolve(raw); if(s) mons.push(s);
  }
  teamsDB.push({n, rec, mons});
}
data.teamsDB=teamsDB;
fs.writeFileSync('data.json', JSON.stringify(data));
console.log(`\nHecho. ${teamsDB.length} equipos, ${Object.keys(data.pokemon).length} Pokémon en total.`);
console.log(`data.json: ${(fs.statSync('data.json').size/1024/1024).toFixed(2)} MB`);
