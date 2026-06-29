// Descarga metadata + imágenes de PokéAPI y genera data.json (con imágenes en base64)
import fs from 'fs';
import sharp from 'sharp';

const SLUG_OVERRIDE = {
  "Wash Rotom":"rotom-wash","Frost Rotom":"rotom-frost","Heat Rotom":"rotom-heat",
  "Eternal Flower Floette":"floette-eternal","Hisuian Zoroark":"zoroark-hisui",
  "Alolan Ninetales":"ninetales-alola","Meowstic (Female)":"meowstic-female",
  "Basculegion (Male)":"basculegion-male","Basculegion (Female)":"basculegion-female",
  "Galarian Slowbro":"slowbro-galar","Hisuian Typhlosion":"typhlosion-hisui",
  "Hisuian Samurott":"samurott-hisui","Hisuian Goodra":"goodra-hisui",
  "Paldean Tauros (Blaze Breed)":"tauros-paldea-blaze-breed",
  "Paldean Tauros (Aqua Breed)":"tauros-paldea-aqua-breed",
  "Midday Form Lycanroc":"lycanroc-midday",
  "Aegislash":"aegislash-shield","Maushold":"maushold-family-of-four","Mimikyu":"mimikyu-disguised",
  "Pyroar":"pyroar-male"
};
const ROSTER = ["Ampharos","Abomasnow","Barbaracle","Vileplume","Falinks","Pyroar","Scolipede","Eelektross","Annihilape","Mawile","Staraptor","Musharna","Gholdengo","Grimmsnarl","Blaziken","Sceptile","Metagross","Swampert","Eternal Flower Floette","Incineroar","Whimsicott","Garchomp","Sinistcha","Delphox","Hawlucha","Gengar","Charizard","Tyranitar","Excadrill","Greninja","Hatterene","Pelipper","Sneasler","Froslass","Starmie","Meganium","Primarina","Wash Rotom","Hippowdon","Meowscarada","Dragonite","Kingambit","Glimmora","Weavile","Frost Rotom","Basculegion (Male)","Orthworm","Politoed","Corviknight","Dragapult","Clefable","Hydreigon","Kangaskhan","Scizor","Aerodactyl","Maushold","Aegislash","Lopunny","Farigiraf","Gardevoir","Sylveon","Milotic","Mamoswine","Gyarados","Talonflame","Chimecho","Hisuian Zoroark","Medicham","Blastoise","Gallade","Feraligatr","Meowstic (Female)","Mimikyu","Crabominable","Aggron","Chesnaught","Kommo-o","Victreebel","Torkoal","Volcarona","Heat Rotom","Vivillon","Skeledirge","Scovillain","Lucario","Espathra","Alolan Ninetales","Tinkaton","Azumarill","Ninetales","Manectric","Garganacl","Ceruledge","Drampa","Empoleon","Chandelure","Toxapex","Tsareena","Snorlax","Sableye","Hisuian Typhlosion","Espeon","Quaquaval","Conkeldurr","Leafeon","Flareon","Hisuian Samurott","Glaceon","Gliscor","Armarouge","Vaporeon","Serperior","Banette","Rhyperior","Ditto","Umbreon","Araquanid","Decidueye","Jolteon","Heliolisk","Spiritomb","Arcanine","Klefki","Basculegion (Female)","Galarian Slowbro","Slowbro","Oranguru","Samurott","Castform","Hisuian Goodra","Goodra","Simisear","Raichu","Zoroark","Simisage","Simipour","Emboar","Alcremie","Krookodile","Ariados","Alakazam","Vanilluxe","Liepard","Paldean Tauros (Blaze Breed)","Midday Form Lycanroc","Bellibolt","Cofagrigus","Paldean Tauros (Aqua Breed)","Aurorus","Audino"];

const TEAM_SLUGS = ["floette-eternal","charizard-mega-y","kingambit","whimsicott","basculegion-male","garchomp","swampert-mega","pelipper","archaludon","sinistcha","maushold-family-of-four","gholdengo","froslass-mega","scovillain-mega","lycanroc-midday","sneasler","aerodactyl","kangaskhan-mega","incineroar","primarina","arcanine-hisui"];

const TYPES18 = ["normal","fire","water","electric","grass","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"];

function slug(name){
  if(SLUG_OVERRIDE[name]) return SLUG_OVERRIDE[name];
  return name.toLowerCase().replace(/[.'’:]/g,"").replace(/\s+/g,"-");
}

// lista única de slugs: roster (con nombre visible) + miembros de equipo
const wanted = new Map(); // slug -> displayName (o null)
ROSTER.forEach(n=> wanted.set(slug(n), n));
TEAM_SLUGS.forEach(s=>{ if(!wanted.has(s)) wanted.set(s, null); });

async function getJSON(url){
  for(let i=0;i<3;i++){
    try{ const r=await fetch(url); if(r.ok) return await r.json(); }catch(e){}
    await new Promise(r=>setTimeout(r,400));
  }
  return null;
}
async function getB64(url){
  if(!url) return null;
  for(let i=0;i<3;i++){
    try{ const r=await fetch(url); if(r.ok){ const ab=Buffer.from(await r.arrayBuffer());
      const out=await sharp(ab).resize(220,220,{fit:'inside'}).webp({quality:78}).toBuffer();
      return "data:image/webp;base64,"+out.toString('base64'); } }catch(e){}
    await new Promise(r=>setTimeout(r,400));
  }
  return null;
}
async function pool(items, n, fn){
  const out=new Array(items.length); let i=0;
  await Promise.all(Array.from({length:n},async()=>{
    while(i<items.length){ const idx=i++; out[idx]=await fn(items[idx],idx); }
  }));
  return out;
}

const slugs=[...wanted.keys()];
console.log(`Descargando ${slugs.length} Pokémon...`);
let done=0, totalBytes=0;
const pokemon={};
await pool(slugs, 8, async s=>{
  const d=await getJSON(`https://pokeapi.co/api/v2/pokemon/${s}`);
  done++;
  if(!d){ console.log(`  ✗ ${s} (sin datos)`); return; }
  const artUrl = d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default;
  const img = await getB64(artUrl);
  if(img) totalBytes += img.length;
  const stats={}; d.stats.forEach(x=>stats[x.stat.name]=x.base_stat);
  pokemon[s]={
    id:d.id,
    name:d.name,
    types:d.types.map(t=>t.type.name),
    abilities:d.abilities.map(a=>a.ability.name),
    stats,
    img
  };
  if(done%20===0) console.log(`  ${done}/${slugs.length}...`);
});

console.log("Descargando tabla de tipos...");
const chart={};
await pool(TYPES18, 9, async t=>{
  const r=await getJSON(`https://pokeapi.co/api/v2/type/${t}`);
  if(!r) return;
  const d={}; TYPES18.forEach(a=>d[a]=1);
  r.damage_relations.double_damage_from.forEach(x=>{ if(d[x.name]!=null)d[x.name]*=2; });
  r.damage_relations.half_damage_from.forEach(x=>{ if(d[x.name]!=null)d[x.name]*=0.5; });
  r.damage_relations.no_damage_from.forEach(x=>{ if(d[x.name]!=null)d[x.name]*=0; });
  chart[t]=d;
});

const data={ pokemon, chart, roster: ROSTER.map(n=>({name:n, slug:slug(n)})) };
fs.writeFileSync('data.json', JSON.stringify(data));
console.log(`\nHecho. ${Object.keys(pokemon).length} Pokémon, imágenes ~${(totalBytes/1024/1024).toFixed(1)} MB en base64.`);
console.log(`data.json: ${(fs.statSync('data.json').size/1024/1024).toFixed(1)} MB`);
