import fs from 'fs';
const tpl=fs.readFileSync('template.html','utf8');
const data=fs.readFileSync('data.json','utf8');
const safe=data.replace(/<\/script>/gi,'<\\/script>'); // por si acaso
const html=tpl.replace('__DATA__', safe);
fs.writeFileSync('pokemon-champions.html', html);
const mb=(Buffer.byteLength(html)/1024/1024).toFixed(2);
console.log(`pokemon-champions.html generado: ${mb} MB`);
