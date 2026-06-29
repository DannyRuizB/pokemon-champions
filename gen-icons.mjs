import sharp from 'sharp';
const ball=(size,pad)=>{ const c=size/2, r=size*(0.5-pad);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#0f1320"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="#fff"/>
    <path d="M ${c-r} ${c} A ${r} ${r} 0 0 1 ${c+r} ${c} Z" fill="#3b6cff"/>
    <rect x="${c-r}" y="${c-r*0.13}" width="${r*2}" height="${r*0.26}" fill="#0c1019"/>
    <circle cx="${c}" cy="${c}" r="${r*0.30}" fill="#0c1019"/>
    <circle cx="${c}" cy="${c}" r="${r*0.20}" fill="#fff"/>
    <circle cx="${c}" cy="${c}" r="${r*0.11}" fill="#ffcb05"/>
  </svg>`; };
for(const [name,size,pad] of [["icon-192.png",192,0.06],["icon-512.png",512,0.06],["icon-maskable.png",512,0.16]]){
  await sharp(Buffer.from(ball(size,pad))).png().toFile(name);
  console.log("✓",name);
}
