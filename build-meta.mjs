// Embebe sets reales del meta (Pikalytics) en data.pokemon[slug].meta
import fs from 'fs';
const data=JSON.parse(fs.readFileSync('data.json','utf8'));

// [usage, moves[[n,%]], items[[n,%]], ability[n,%], teammates[[n,%]], spread]
const RAW={
 "kingambit":[41,[["Golpe Bajo",99],["Baza Tramposa",96],["Protección",73],["Patada Baja",60],["Cabeza de Hierro",60]],[["Baya Chople",64],["Gafas de Oscuridad",25],["Banda Focus",9]],["Funesto",92],[["Basculegion",64],["Garchomp",54],["Charizard-Mega-Y",44],["Sneasler",37]],"Firme · 32/32/0/0/2/0"],
 "garchomp":[41,[["Terremoto",91],["Garra Dragón",76],["Avalancha",68],["Protección",62]],[["Cinta Elección",30],["Baya Zidra",28]],["Piel Tosca",98],[["Charizard-Mega-Y",62],["Basculegion",56],["Kingambit",54]],"Firme · 2/32/0/0/0/32"],
 "incineroar":[26,[["Sorpresa",100],["Última Palabra",97],["Envite Ígneo",87],["Golpe Garganta",49]],[["Baya Zidra",42],["Baya Chople",22],["Baya Pasio",13]],["Intimidación",100],[["Sinistcha",46],["Garchomp",35],["Floette-Mega",34]],"Cauta · 32/0/14/0/20/0"],
 "whimsicott":[18,[["Viento Afín",99],["Vozarrón",95],["Otra Vez",91],["Protección",76]],[["Banda Focus",38],["Pluma Hada",29]],["Bromista",100],[["Charizard-Mega-Y",68],["Basculegion",68],["Garchomp",65]],"Tímida · 2/0/0/32/0/32"],
 "basculegion-male":[52,[["Última Baza",100],["Acua Jet",97],["Rompeolas",68],["Protección",61]],[["Cinta Elección",35],["Banda Focus",33]],["Adaptable",93],[["Kingambit",50],["Garchomp",44],["Charizard-Mega-Y",39]],"Alegre · 0/32/2/0/0/32"],
 "floette-eternal":[1,[["Luz Aniquiladora",92],["Vozarrón",88],["Brillo Mágico",81],["Protección",44]],[["Cinta Elección",56],["Pluma Hada",37]],["Velo Flor",94],[["Basculegion",74],["Kingambit",61],["Charizard-Mega-Y",58]],"Tímida · 2/0/0/32/0/32"],
 "charizard-mega-y":[32,[["Onda Ígnea",100],["Protección",100],["Rayo Solar",87],["Bola Clima",84]],[["Charizarita Y",100]],["Sequía",100],[["Garchomp",79],["Basculegion",63],["Kingambit",56]],"Modesta · 24/0/14/11/0/17"],
 "sinistcha":[20,[["Matcha Servido",96],["Polvo Ira",96],["Espacio Raro",71],["Rocío Vital",58]],[["Baya Kasib",39],["Baya Zidra",32]],["Hospitalidad",99],[["Incineroar",58],["Floette-Mega",35],["Garchomp",27]],"Osada · 32/0/14/0/20/0"],
 "pelipper":[12,[["Vendaval",98],["Bola Clima",91],["Viento Afín",83],["Vasta Guardia",58]],[["Baya Zidra",50],["Banda Focus",38]],["Chorro",100],[["Archaludon",84],["Basculegion",71],["Sableye",29]],null],
 "archaludon":[17,[["Foco Resplandor",93],["Protección",88],["Electrodisparo",88],["Pulso Dragón",60]],[["Restos",76],["Cinta Elección",8]],["Firmeza",86],[["Basculegion",68],["Pelipper",59],["Sableye",35]],"Modesta · 2/0/0/32/0/32"],
 "sneasler":[29,[["A Bocajarro",100],["Garra Vil",93],["Sorpresa",89],["Protección",67]],[["Hierba Blanca",71],["Banda Focus",23]],["Liviano",87],[["Kingambit",52],["Basculegion",52],["Garchomp",35]],"Alegre · 2/32/0/0/0/32"],
 "aerodactyl":[7,[["Avalancha",99],["Viento Afín",99],["Protección",78],["Doble Ala",58]],[["Banda Focus",91],["Baya Zidra",4]],["Nerviosismo",93],[["Garchomp",58],["Kingambit",54],["Charizard-Mega-Y",50]],"Alegre · 2/32/0/0/0/32"],
 "ceruledge":[1,[["Hoja Aguda",99],["Sombra Vil",93],["Protección",73],["Danza Espada",44]],[["Baya Coba",37],["Banda Focus",24]],["Absorbe Fuego",90],[["Lopunny-Mega",32],["Kingambit",30],["Ninetales-Alola",29]],"Alegre · 2/32/0/0/0/32"],
 "sylveon":[18,[["Vozarrón",100],["Ataque Rápido",79],["Detección",50],["Protección",49]],[["Pluma Hada",94],["Restos",3]],["Piel Feérica",100],[["Basculegion",61],["Garchomp",48],["Charizard-Mega-Y",47]],"Modesta · 9/0/22/20/0/15"],
 "maushold-family-of-four":[8,[["Señuelo",99],["Protección",94],["Superdiente",82],["Amago",42]],[["Baya Chople",51],["Banda Focus",33]],["Cuidado Amigo",99],[["Basculegion",54],["Floette-Mega",43],["Incineroar",35]],"Alegre · 32/0/2/0/0/32"],
 "froslass-mega":[6,[["Ventisca",100],["Protección",98],["Bola Sombra",92],["Velo Aurora",76]],[["Froslassita",100]],["Nevada",100],[["Sneasler",74],["Basculegion",57],["Kingambit",57]],"Modesta · 32/0/2/32/0/0"],
 "lycanroc-midday":[1,[["Avalancha",98],["Protección",94],["A Bocajarro",91],["Colmillo Psíquico",75]],[["Banda Focus",99]],["Ímpetu Arena",100],[["Tyranitar",66],["Floette-Mega",64],["Farigiraf",63]],"Firme · 0/32/0/0/2/32"],
 "farigiraf":[16,[["Espacio Raro",96],["Psíquico",62],["Refuerzo",60],["Protección",43]],[["Baya Zidra",61],["Baya Coba",25]],["Cola Armadura",99],[["Basculegion",43],["Kingambit",36],["Torkoal",29]],"Mansa · 17/0/19/10/20/0"],
 "scizor":[1,[["Puño Bala",100],["Protección",76],["Picadura",52],["Danza Espada",48]],[["Recubr. Metálico",62],["Baya Zidra",28]],["Tecnico",100],[["Garchomp",34],["Sinistcha",29],["Incineroar",29]],"Firme · 32/32/0/0/2/0"]
};

let n=0;
for(const slug in RAW){
  if(!data.pokemon[slug]) { console.log("  (sin slug en data:",slug,")"); continue; }
  const [u,m,i,a,t,s]=RAW[slug];
  data.pokemon[slug].meta={
    usage:u, moves:m.map(([n,p])=>({n,p})), items:i.map(([n,p])=>({n,p})),
    ability:{n:a[0],p:a[1]}, mates:t.map(([n,p])=>({n,p})), spread:s
  };
  n++;
}
fs.writeFileSync('data.json', JSON.stringify(data));
console.log(`\nHecho. Sets reales embebidos en ${n} Pokémon del meta.`);
console.log(`data.json: ${(fs.statSync('data.json').size/1024/1024).toFixed(2)} MB`);
