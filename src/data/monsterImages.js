// ══ HATCHME MONSTER SVG ILLUSTRATIONS ══
// 30 unique designs × 5 element colourings = 150 unique images
// Variant 0-9 is derived from the monster's dex number within its element+set group

const C = {
  Fire:   { body:'#FF7043', head:'#FF8A65', accent:'#FFB74D', dark:'#BF360C', wing:'#FF7043' },
  Water:  { body:'#29B6F6', head:'#4FC3F7', accent:'#80DEEA', dark:'#0277BD', wing:'#29B6F6' },
  Earth:  { body:'#66BB6A', head:'#81C784', accent:'#C8E6C9', dark:'#2E7D32', wing:'#66BB6A' },
  Wind:   { body:'#90CAF9', head:'#BBDEFB', accent:'#E3F2FD', dark:'#1565C0', wing:'#B3E5FC' },
  Shadow: { body:'#7E57C2', head:'#9575CD', accent:'#CE93D8', dark:'#311B92', wing:'#7E57C2' },
}

// ── tiny helpers ──────────────────────────────────────────────────────────────
const ell  = (cx,cy,rx,ry,f,op='') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}"${op?` opacity="${op}"`:''}/>`
const circ = (cx,cy,r,f,op='')     => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"${op?` opacity="${op}"`:''}/>`
const eyes = (lx,ly,rx2,ry2,c,er=5,ey=5.5) =>
  `${ell(lx,ly,er,ey,'#0d0d1a')}${ell(rx2,ry2,er,ey,'#0d0d1a')}` +
  `${circ(lx+1.5,ly-1.5,2,'white')}${circ(rx2+1.5,ry2-1.5,2,'white')}`
const mouth  = (y,c) => `<path d="M44,${y} Q50,${y+5} 56,${y}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
const cheeks = (y,c) => `${ell(38,y,5,3,c,'0.5')}${ell(62,y,5,3,c,'0.5')}`
const nose   = (x,y,c) => ell(x,y,3,2,c)
const paws   = (c,y=80) => `${ell(36,y,9,5,c)}${ell(64,y,9,5,c)}`
const shade  = () => `${ell(50,91,22,4,'#111','0.15')}`
const wrap   = body => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${body}</svg>`

// ══ ANIMAL DESIGNS (10) ══════════════════════════════════════════════════════

// 0 – Fox: pointed ears, triangular muzzle, 3-layer bushy tail
const A = [
c => wrap(`${shade()}
  <path d="M70,58 C84,43 87,24 76,12 C88,22 92,9 82,3 C95,16 90,40 80,54 C76,60 73,66 70,70" fill="${c.dark}"/>
  <path d="M72,60 C84,47 86,31 77,20 C87,29 90,18 82,10 C93,22 89,43 81,56 C77,63 74,68 72,71" fill="${c.body}"/>
  <path d="M74,63 C83,53 84,40 79,30 C87,37 88,28 83,19 C91,30 89,47 83,58 C80,64 77,69 74,72" fill="${c.accent}"/>
  ${ell(48,65,22,17,c.body)}${ell(48,66,13,10,c.accent,'0.45')}
  ${circ(48,40,20,c.head)}
  <polygon points="32,24 24,4 42,16" fill="${c.body}"/><polygon points="64,24 72,4 54,16" fill="${c.body}"/>
  <polygon points="34,22 28,9 41,17" fill="${c.accent}"/><polygon points="62,22 68,9 55,17" fill="${c.accent}"/>
  ${ell(48,48,11,7,c.accent)}
  ${eyes(40,36,56,36,c)}${nose(48,46,c.dark)}${mouth(49,c.dark)}${cheeks(43,c.accent)}${paws(c.body)}`),

// 1 – Bear: huge wide round head, round ears, round snout
c => wrap(`${shade()}
  ${ell(50,66,23,17,c.body)}${ell(50,67,14,10,c.accent,'0.4')}
  ${circ(50,40,24,c.head)}
  ${circ(32,20,9,c.body)}${circ(68,20,9,c.body)}
  ${circ(32,20,6,c.accent)}${circ(68,20,6,c.accent)}
  ${ell(50,50,13,8,c.accent)}
  ${eyes(41,35,59,35,c,6,6)}${nose(50,48,c.dark)}${mouth(51,c.dark)}${cheeks(45,c.accent)}${paws(c.body)}`),

// 2 – Rabbit: giant tall ears, round fluffy body
c => wrap(`${shade()}
  ${circ(78,68,8,c.accent,'0.5')}
  ${ell(50,65,22,17,c.body)}${ell(50,66,13,9,c.accent,'0.4')}
  ${circ(50,42,20,c.head)}
  ${ell(38,18,7,22,c.body)}${ell(62,18,7,22,c.body)}
  ${ell(38,18,4,18,c.accent)}${ell(62,18,4,18,c.accent)}
  ${eyes(42,39,58,39,c,5,5)}${nose(50,48,c.dark)}${mouth(50,c.dark)}${cheeks(45,c.accent)}${paws(c.body)}`),

// 3 – Dragon: curved horns, wing nubs, angular snout
c => wrap(`${shade()}
  <path d="M30,52 C20,44 18,30 26,20 C20,28 14,22 18,14 C10,24 14,42 22,52Z" fill="${c.dark}" opacity="0.7"/>
  <path d="M70,52 C80,44 82,30 74,20 C80,28 86,22 82,14 C90,24 86,42 78,52Z" fill="${c.dark}" opacity="0.7"/>
  ${ell(50,64,22,16,c.body)}
  <path d="M50,22 C40,14 34,6 36,2 C40,6 44,12 50,18 C56,12 60,6 64,2 C66,6 60,14 50,22Z" fill="${c.dark}"/>
  ${ell(50,40,20,19,c.head)}
  ${ell(50,52,12,8,c.dark,'0.4')}
  ${eyes(40,35,60,35,c,5,5)}${nose(50,50,c.dark)}${mouth(52,c.dark)}${cheeks(43,c.accent)}${paws(c.body)}`),

// 4 – Cat: small triangle ears, almond eyes, whiskers, curled tail
c => wrap(`${shade()}
  <path d="M72,80 C88,70 90,50 78,42 C84,52 80,68 72,80Z" fill="${c.body}"/>
  ${ell(50,65,20,16,c.body)}${ell(50,66,12,9,c.accent,'0.4')}
  ${circ(50,40,19,c.head)}
  <polygon points="34,26 30,8 44,20" fill="${c.body}"/><polygon points="66,26 70,8 56,20" fill="${c.body}"/>
  <polygon points="36,24 33,13 43,21" fill="${c.accent}"/><polygon points="64,24 67,13 57,21" fill="${c.accent}"/>
  <line x1="27" y1="43" x2="39" y2="42" stroke="${c.dark}" stroke-width="1.2" opacity="0.6"/>
  <line x1="27" y1="46" x2="39" y2="45" stroke="${c.dark}" stroke-width="1.2" opacity="0.6"/>
  <line x1="27" y1="49" x2="39" y2="47" stroke="${c.dark}" stroke-width="1.2" opacity="0.6"/>
  <line x1="73" y1="43" x2="61" y2="42" stroke="${c.dark}" stroke-width="1.2" opacity="0.6"/>
  <line x1="73" y1="46" x2="61" y2="45" stroke="${c.dark}" stroke-width="1.2" opacity="0.6"/>
  <line x1="73" y1="49" x2="61" y2="47" stroke="${c.dark}" stroke-width="1.2" opacity="0.6"/>
  ${ell(42,37,5,4,c.dark)}${ell(58,37,5,4,c.dark)}
  ${circ(43.5,35.5,1.8,'white')}${circ(59.5,35.5,1.8,'white')}
  ${nose(50,44,c.dark)}${mouth(46,c.dark)}${cheeks(43,c.accent)}${paws(c.body)}`),

// 5 – Wolf: tall pointed ears, elongated forward snout
c => wrap(`${shade()}
  <path d="M73,60 C86,47 88,28 78,15 C85,26 86,15 80,8 C90,20 88,44 78,58 C75,63 73,67 72,71" fill="${c.dark}"/>
  ${ell(50,64,21,16,c.body)}${ell(50,65,12,9,c.accent,'0.4')}
  ${ell(50,38,20,22,c.head)}
  <polygon points="33,22 27,2 44,14" fill="${c.body}"/><polygon points="67,22 73,2 56,14" fill="${c.body}"/>
  <polygon points="35,20 30,8 43,15" fill="${c.accent}"/><polygon points="65,20 70,8 57,15" fill="${c.accent}"/>
  ${ell(50,52,10,9,c.accent)}
  ${eyes(40,33,60,33,c,5,5)}${nose(50,50,c.dark)}${mouth(52,c.dark)}${cheeks(44,c.accent)}${paws(c.body)}`),

// 6 – Deer: forked antlers, long neck, slim elegant body
c => wrap(`${shade()}
  <path d="M38,22 Q32,12 28,6 M38,22 Q34,10 36,4 M38,22 Q40,12 38,6" stroke="${c.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M62,22 Q68,12 72,6 M62,22 Q66,10 64,4 M62,22 Q60,12 62,6" stroke="${c.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${ell(50,68,18,20,c.body)}${ell(50,45,8,18,c.head)}
  ${circ(50,32,16,c.head)}
  ${ell(50,68,10,12,c.accent,'0.4')}
  ${eyes(43,29,57,29,c,4.5,5.5)}${nose(50,37,c.dark)}${mouth(39,c.dark)}${cheeks(35,c.accent)}
  ${ell(38,83,7,4,c.dark)}${ell(62,83,7,4,c.dark)}`),

// 7 – Bird: round body+head merged, beak, wing-arms, tail fan
c => wrap(`${shade()}
  <path d="M32,72 Q22,80 18,88 Q30,84 38,78Z" fill="${c.body}"/>
  <path d="M68,72 Q78,80 82,88 Q70,84 62,78Z" fill="${c.body}"/>
  <path d="M50,88 Q38,94 28,92 Q36,88 44,86Z" fill="${c.dark}"/>
  <path d="M50,88 Q62,94 72,92 Q64,88 56,86Z" fill="${c.dark}"/>
  <path d="M50,88 Q48,96 50,94 Q52,96 50,88Z" fill="${c.dark}"/>
  ${circ(50,55,28,c.body)}
  <path d="M16,54 C10,44 14,32 22,28 C16,36 18,48 26,56Z" fill="${c.body}"/>
  <path d="M84,54 C90,44 86,32 78,28 C84,36 82,48 74,56Z" fill="${c.body}"/>
  ${circ(50,42,18,c.head)}
  <polygon points="50,43 42,50 58,50" fill="${c.dark}"/>
  ${eyes(41,36,59,36,c,5.5,6)}${cheeks(42,c.accent)}`),

// 8 – Panda: black eye patches, round ears, white face over element body
c => wrap(`${shade()}
  ${ell(50,65,23,17,c.body)}${ell(50,66,14,10,'white','0.5')}
  ${circ(50,40,23,c.head)}
  ${circ(32,20,9,c.dark)}${circ(68,20,9,c.dark)}
  ${ell(40,37,9,10,c.dark)}${ell(60,37,9,10,c.dark)}
  ${ell(50,50,12,7,c.accent,'0.6')}
  ${eyes(40,36,60,36,c,4,5)}${nose(50,48,c.dark)}${mouth(50,c.dark)}${cheeks(44,c.accent)}
  ${ell(36,80,9,5,c.body)}${ell(64,80,9,5,c.body)}
  <line x1="30" y1="83" x2="30" y2="87" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="34" y1="84" x2="34" y2="88" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="38" y1="83" x2="38" y2="87" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="58" y1="83" x2="58" y2="87" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="62" y1="84" x2="62" y2="88" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="66" y1="83" x2="66" y2="87" stroke="${c.dark}" stroke-width="1.5"/>`),

// 9 – Tiger: stripe marks on face, flat brow, fierce look
c => wrap(`${shade()}
  ${ell(50,65,22,17,c.body)}
  <path d="M34,68 Q50,62 66,68 Q50,73 34,68Z" fill="${c.accent}" opacity="0.3"/>
  <line x1="38" y1="60" x2="34" y2="72" stroke="${c.dark}" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
  <line x1="50" y1="58" x2="50" y2="72" stroke="${c.dark}" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
  <line x1="62" y1="60" x2="66" y2="72" stroke="${c.dark}" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
  ${circ(50,40,21,c.head)}
  ${circ(32,22,8,c.body)}${circ(68,22,8,c.body)}
  ${circ(32,22,5,c.dark,'0.3')}${circ(68,22,5,c.dark,'0.3')}
  <line x1="38" y1="29" x2="34" y2="32" stroke="${c.dark}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="44" y1="26" x2="42" y2="30" stroke="${c.dark}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="62" y1="29" x2="66" y2="32" stroke="${c.dark}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="56" y1="26" x2="58" y2="30" stroke="${c.dark}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  ${ell(50,48,10,7,c.accent)}
  ${eyes(40,36,60,36,c,5,5)}${nose(50,46,c.dark)}${mouth(49,c.dark)}${cheeks(43,c.accent)}${paws(c.body)}`)
]

// ══ PLANT DESIGNS (10) ═══════════════════════════════════════════════════════

const stem = c => `
  <rect x="47" y="62" width="6" height="22" rx="3" fill="${c.dark}"/>
  <path d="M47,84 Q40,91 34,89" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M53,84 Q60,91 66,89" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M50,84 L50,92" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
`
const plantFace = (c,y=40) =>
  `${eyes(43,y-4,57,y-4,c,4.5,5.5)}${mouth(y+5,c.dark)}${cheeks(y+1,c.accent)}`

const P = [
// 0 – Sunflower: oval petals radiating
c => wrap(`${stem(c)}
  ${ell(50,26,9,14,c.body)}${ell(50,26,9,14,c.body,'',`transform="rotate(45,50,40)"`)}
  ${ell(50,26,9,14,c.body,'',`transform="rotate(90,50,40)"`)}${ell(50,26,9,14,c.body,'',`transform="rotate(135,50,40)"`)}
  ${ell(50,26,9,14,c.body,'',`transform="rotate(180,50,40)"`)}${ell(50,26,9,14,c.body,'',`transform="rotate(225,50,40)"`)}
  ${ell(50,26,9,14,c.body,'',`transform="rotate(270,50,40)"`)}${ell(50,26,9,14,c.body,'',`transform="rotate(315,50,40)"`)}
  ${circ(50,40,18,c.head)}${plantFace(c)}`),

// 1 – Mushroom: dome cap, spots, squat stem-body
c => wrap(`
  ${ell(50,70,16,12,c.accent,'0.5')}
  ${ell(50,60,18,14,c.dark,'0.15')}
  ${ell(50,58,22,18,c.body)}
  <path d="M28,58 Q14,46 20,26 Q34,10 50,10 Q66,10 80,26 Q86,46 72,58Z" fill="${c.head}"/>
  ${circ(40,36,5,c.accent,'0.7')}${circ(55,30,4,c.accent,'0.7')}${circ(62,42,3.5,c.accent,'0.7')}
  ${eyes(42,52,58,52,c,4.5,5)}${mouth(56,c.dark)}${cheeks(53,c.accent)}`),

// 2 – Cactus: oval spiky body, arm stubs, spines
c => wrap(`
  ${ell(50,92,18,4,c.dark,'0.15')}
  ${ell(28,52,10,18,c.body)}${ell(72,52,10,18,c.body)}
  <line x1="18" y1="44" x2="14" y2="40" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="18" y1="50" x2="14" y2="48" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="82" y1="44" x2="86" y2="40" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="82" y1="50" x2="86" y2="48" stroke="${c.dark}" stroke-width="1.5"/>
  ${ell(50,55,18,34,c.body)}
  <line x1="36" y1="30" x2="31" y2="24" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="42" y1="22" x2="40" y2="15" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="50" y1="20" x2="50" y2="12" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="58" y1="22" x2="60" y2="15" stroke="${c.dark}" stroke-width="1.5"/>
  <line x1="64" y1="30" x2="69" y2="24" stroke="${c.dark}" stroke-width="1.5"/>
  ${eyes(42,46,58,46,c,4.5,5)}${mouth(50,c.dark)}${cheeks(47,c.accent)}
  ${ell(50,86,12,6,c.dark,'0.3')}`),

// 3 – Tree: round fluffy crown, trunk with face
c => wrap(`
  ${ell(50,92,18,4,c.dark,'0.15')}
  ${ell(50,75,10,20,c.dark,'0.3')}
  ${circ(36,36,20,c.body)}${circ(64,36,20,c.body)}${circ(50,28,22,c.head)}${circ(50,50,16,c.body)}
  ${plantFace(c,36)}`),

// 4 – Tulip: 3 cupped petals, long curving stem
c => wrap(`
  ${ell(50,80,7,16,c.dark,'0.3')}
  <path d="M43,84 Q36,76 38,66" stroke="${c.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M57,84 Q64,76 62,66" stroke="${c.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M50,84 Q50,76 50,66" stroke="${c.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M28,38 C22,24 32,10 40,18 C36,26 34,38 34,46Z" fill="${c.body}"/>
  <path d="M72,38 C78,24 68,10 60,18 C64,26 66,38 66,46Z" fill="${c.body}"/>
  <path d="M50,26 C50,12 58,8 62,16 C58,22 54,32 54,40Z" fill="${c.body}"/>
  <path d="M50,26 C50,12 42,8 38,16 C42,22 46,32 46,40Z" fill="${c.body}"/>
  ${circ(50,42,16,c.head)}${plantFace(c,42)}`),

// 5 – Vine: coiling serpentine body with leaves
c => wrap(`
  <path d="M50,92 C34,86 24,72 30,58 C36,44 52,42 56,30 C60,18 52,8 50,4" stroke="${c.body}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M30,58 Q16,52 14,40" stroke="${c.body}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M56,30 Q68,26 72,14" stroke="${c.body}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M30,72 Q16,70 14,60" stroke="${c.body}" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${circ(14,40,7,c.head)}${circ(72,14,7,c.head)}${circ(14,60,5,c.head)}
  ${circ(50,4,18,c.head)}${plantFace(c,4)}`),

// 6 – Pitcher plant: wide funnel mouth, tubular body, lid
c => wrap(`${stem(c)}
  ${ell(50,60,14,20,c.body)}
  <path d="M32,30 C28,22 30,12 38,10 C34,16 32,24 36,28Z" fill="${c.body}"/>
  <path d="M68,30 C72,22 70,12 62,10 C66,16 68,24 64,28Z" fill="${c.body}"/>
  <path d="M32,30 Q50,18 68,30 Q72,42 68,52 Q50,60 32,52 Q28,42 32,30Z" fill="${c.head}"/>
  <path d="M32,30 Q50,24 68,30" stroke="${c.dark}" stroke-width="2" fill="none"/>
  <path d="M36,38 Q50,34 64,38" stroke="${c.dark}" stroke-width="1.5" fill="none" opacity="0.4"/>
  ${eyes(42,38,58,38,c,4.5,5)}${mouth(43,c.dark)}`),

// 7 – Dandelion: many thin spike petals, round centre
c => wrap(`${stem(c)}
  ${[0,18,36,54,72,90,108,126,144,162,180,198,216,234,252,270,288,306,324,342].map(a=>{
    const rad=a*Math.PI/180, x1=50+14*Math.cos(rad), y1=40+14*Math.sin(rad), x2=50+26*Math.cos(rad), y2=40+26*Math.sin(rad)
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c.body}" stroke-width="2" stroke-linecap="round"/>${circ(x2.toFixed(1),y2.toFixed(1),2.5,c.body)}`
  }).join('')}
  ${circ(50,40,14,c.head)}${plantFace(c)}`),

// 8 – Rose: layered petals
c => wrap(`
  <rect x="47" y="64" width="6" height="24" rx="3" fill="${c.dark}"/>
  <path d="M47,80 Q40,87 34,85" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M53,80 Q60,87 66,85" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M42,72 Q34,68 32,58" stroke="${c.dark}" stroke-width="1.5" fill="none"/>
  <path d="M42,72 L38,66" stroke="${c.dark}" stroke-width="1" fill="none"/>
  ${ell(36,56,10,15,c.body)}${ell(64,56,10,15,c.body)}
  ${ell(50,50,16,20,c.body)}
  ${ell(42,38,12,16,c.head)}${ell(58,38,12,16,c.head)}
  ${ell(50,32,14,14,c.head)}
  ${circ(50,38,10,c.accent,'0.5')}
  ${eyes(43,35,57,35,c,4,5)}${mouth(40,c.dark)}`),

// 9 – Coral: branching fan
c => wrap(`
  ${ell(50,92,20,4,c.dark,'0.15')}
  <path d="M50,88 L50,60" stroke="${c.body}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M50,78 Q36,66 26,58" stroke="${c.body}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M50,78 Q64,66 74,58" stroke="${c.body}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M50,68 Q40,56 34,44" stroke="${c.body}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M50,68 Q60,56 66,44" stroke="${c.body}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M50,60 Q44,48 40,34" stroke="${c.body}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M50,60 Q56,48 60,34" stroke="${c.body}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M26,58 Q18,50 16,38" stroke="${c.body}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M74,58 Q82,50 84,38" stroke="${c.body}" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${circ(50,60,12,c.head)}${eyes(44,57,56,57,c,3.5,4)}${mouth(62,c.dark)}`)
]

// Fix transform attribute issue – replace the hacky 3rd arg; rewrite p0 properly
P[0] = c => wrap(`${stem(c)}
  ${['0','45','90','135','180','225','270','315'].map(a=>`<ellipse cx="50" cy="26" rx="9" ry="14" fill="${c.body}" transform="rotate(${a},50,40)"/>`).join('')}
  ${circ(50,40,18,c.head)}${plantFace(c)}`)

// ══ INSECT DESIGNS (10) ══════════════════════════════════════════════════════

const antennae = (c) => `
  <path d="M43,22 Q36,12 31,6" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M57,22 Q64,12 69,6" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${circ(31,6,3.5,c.accent)}${circ(69,6,3.5,c.accent)}`
const insectHead = (c,cy=36) => `
  ${circ(50,cy,17,c.head)}
  ${ell(40,cy-3,7,8,'#0d0d1a')}${ell(60,cy-3,7,8,'#0d0d1a')}
  ${circ(42,cy-5,3,c.wing,'0.55')}${circ(62,cy-5,3,c.wing,'0.55')}
  ${circ(43,cy-6,1.5,'white')}${circ(63,cy-6,1.5,'white')}
  <path d="M44,${cy+8} Q50,${cy+12} 56,${cy+8}" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${ell(35,cy+2,5,3,c.accent,'0.5')}${ell(65,cy+2,5,3,c.accent,'0.5')}`
const legs3 = (c,thoraxCy=58) => `
  <path d="M40,${thoraxCy} Q30,${thoraxCy-4} 22,${thoraxCy-8}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,${thoraxCy+5} Q28,${thoraxCy+4} 20,${thoraxCy+2}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M42,${thoraxCy+10} Q32,${thoraxCy+12} 26,${thoraxCy+14}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60,${thoraxCy} Q70,${thoraxCy-4} 78,${thoraxCy-8}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60,${thoraxCy+5} Q72,${thoraxCy+4} 80,${thoraxCy+2}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M58,${thoraxCy+10} Q68,${thoraxCy+12} 74,${thoraxCy+14}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>`

const I = [
// 0 – Butterfly: large rounded wings dominate, tiny body
c => wrap(`
  ${ell(26,40,22,18,c.wing,'0.6',`transform="rotate(-15,26,40)"`)}
  ${ell(74,40,22,18,c.wing,'0.6',`transform="rotate(15,74,40)"`)}
  ${ell(24,60,15,12,c.wing,'0.45',`transform="rotate(10,24,60)"`)}
  ${ell(76,60,15,12,c.wing,'0.45',`transform="rotate(-10,76,60)"`)}
  <line x1="26" y1="40" x2="8" y2="30" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  <line x1="26" y1="40" x2="6" y2="44" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  <line x1="74" y1="40" x2="92" y2="30" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  <line x1="74" y1="40" x2="94" y2="44" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  ${ell(50,62,5,26,c.dark)}${antennae(c)}${insectHead(c,36)}`),

// 1 – Beetle: wide dome shell, small head below
c => wrap(`
  <path d="M18,66 Q14,50 20,36 Q34,18 50,18 Q66,18 80,36 Q86,50 82,66Z" fill="${c.head}"/>
  <path d="M18,66 Q14,50 20,36 Q34,18 50,18 Q66,18 80,36 Q86,50 82,66Z" fill="${c.dark}" opacity="0.15"/>
  ${circ(36,36,5,c.accent,'0.5')}${circ(60,32,4,c.accent,'0.5')}${circ(70,48,4,c.accent,'0.5')}
  <line x1="50" y1="18" x2="50" y2="66" stroke="${c.dark}" stroke-width="1.5" opacity="0.3"/>
  ${ell(50,74,18,10,c.body)}
  ${antennae(c)}${insectHead(c,36)}
  <path d="M20,66 Q10,72 8,80" stroke="${c.body}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M18,72 Q8,76 6,84" stroke="${c.body}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M80,66 Q90,72 92,80" stroke="${c.body}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M82,72 Q92,76 94,84" stroke="${c.body}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),

// 2 – Bee: striped oval abdomen, fuzzy thorax
c => wrap(`
  ${ell(50,74,12,18,c.dark)}
  <path d="M38,62 Q50,58 62,62" stroke="${c.accent}" stroke-width="4" fill="none"/>
  <path d="M37,68 Q50,64 63,68" stroke="${c.accent}" stroke-width="4" fill="none"/>
  <path d="M38,74 Q50,70 62,74" stroke="${c.accent}" stroke-width="4" fill="none"/>
  <path d="M40,80 Q50,76 60,80" stroke="${c.accent}" stroke-width="3" fill="none"/>
  ${ell(50,52,14,12,c.body)}
  ${ell(22,44,16,10,c.wing,'0.55',`transform="rotate(-25,22,44)"`)}
  ${ell(78,44,16,10,c.wing,'0.55',`transform="rotate(25,78,44)"`)}
  ${ell(22,58,10,7,c.wing,'0.4',`transform="rotate(-10,22,58)"`)}
  ${ell(78,58,10,7,c.wing,'0.4',`transform="rotate(10,78,58)"`)}
  ${antennae(c)}${insectHead(c,33)}
  ${legs3(c,54)}`),

// 3 – Dragonfly: long thin body, 4 elongated wings spread
c => wrap(`
  ${ell(26,44,20,10,c.wing,'0.55',`transform="rotate(-10,26,44)"`)}
  ${ell(74,44,20,10,c.wing,'0.55',`transform="rotate(10,74,44)"`)}
  ${ell(24,58,16,8,c.wing,'0.45',`transform="rotate(8,24,58)"`)}
  ${ell(76,58,16,8,c.wing,'0.45',`transform="rotate(-8,76,58)"`)}
  ${ell(50,68,6,26,c.dark)}
  <path d="M46,72 Q50,70 54,72" stroke="${c.body}" stroke-width="1.5" fill="none"/>
  <path d="M45,76 Q50,74 55,76" stroke="${c.body}" stroke-width="1.5" fill="none"/>
  <path d="M45,80 Q50,78 55,80" stroke="${c.body}" stroke-width="1.5" fill="none"/>
  ${ell(50,52,8,10,c.body)}
  ${antennae(c)}${insectHead(c,34)}
  ${legs3(c,52)}`),

// 4 – Ant: 3 clear segments, 6 legs, thin waist
c => wrap(`
  ${circ(50,80,12,c.dark)}
  ${ell(50,60,9,10,c.body)}
  ${antennae(c)}${insectHead(c,34)}
  <path d="M40,56 Q30,50 22,46" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,60 Q28,58 20,56" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,64 Q30,66 22,70" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60,56 Q70,50 78,46" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60,60 Q72,58 80,56" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60,64 Q70,66 78,70" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M44,48 Q50,44 56,48" stroke="${c.dark}" stroke-width="2.5" fill="none"/>
  <path d="M44,70 Q50,66 56,70" stroke="${c.dark}" stroke-width="2.5" fill="none"/>`),

// 5 – Caterpillar: 6 round segments in a row
c => wrap(`
  ${circ(14,65,11,c.head)}
  ${eyes(9,61,19,61,c,3.5,4)}
  <path d="M8,68 Q14,72 20,68" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${circ(34,60,12,c.body)}${circ(52,56,13,c.head)}${circ(70,56,12,c.body)}${circ(87,60,11,c.head)}
  ${[14,34,52,70,87].map((x,i)=>`
    <path d="M${x},${i%2?72:74} Q${x},${i%2?80:82} ${x},${i%2?78:80}" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M${x-4},${i%2?72:74} Q${x-4},${i%2?78:80} ${x-4},${i%2?76:78}" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M${x+4},${i%2?72:74} Q${x+4},${i%2?78:80} ${x+4},${i%2?76:78}" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `).join('')}
  <path d="M8,62 Q6,56 8,52" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M20,60 Q22,54 20,50" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${circ(8,52,3,c.accent)}${circ(20,50,3,c.accent)}`),

// 6 – Moth: wide triangular wings, thick fuzzy body
c => wrap(`
  <path d="M50,60 L14,28 Q10,16 20,16 L50,60Z" fill="${c.wing}" opacity="0.55"/>
  <path d="M50,60 L86,28 Q90,16 80,16 L50,60Z" fill="${c.wing}" opacity="0.55"/>
  <path d="M50,68 L22,60 Q16,54 22,50 L50,68Z" fill="${c.wing}" opacity="0.4"/>
  <path d="M50,68 L78,60 Q84,54 78,50 L50,68Z" fill="${c.wing}" opacity="0.4"/>
  <path d="M14,28 Q18,40 50,60" stroke="${c.dark}" stroke-width="0.8" opacity="0.3"/>
  <path d="M86,28 Q82,40 50,60" stroke="${c.dark}" stroke-width="0.8" opacity="0.3"/>
  ${ell(50,64,8,22,c.body)}
  <path d="M43,24 Q38,14 34,8" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M57,24 Q62,14 66,8" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M34,8 Q30,4 28,6" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M66,8 Q70,4 72,6" stroke="${c.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${insectHead(c,34)}${legs3(c,62)}`),

// 7 – Spider: round abdomen, 8 legs spreading out
c => wrap(`
  ${ell(50,68,18,18,c.dark)}
  ${circ(40,62,4,c.accent,'0.5')}${circ(56,58,3.5,c.accent,'0.5')}${circ(60,70,3,c.accent,'0.5')}
  <path d="M34,62 Q24,54 16,46" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M34,66 Q22,62 14,60" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M36,72 Q26,72 18,76" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M38,76 Q30,80 24,86" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M66,62 Q76,54 84,46" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M66,66 Q78,62 86,60" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M64,72 Q74,72 82,76" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M62,76 Q70,80 76,86" stroke="${c.dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  ${antennae(c)}${insectHead(c,36)}`),

// 8 – Grasshopper: elongated wedge body, huge hind legs
c => wrap(`
  <path d="M24,74 Q18,60 26,48 Q40,28 50,26 Q60,28 70,40 Q72,50 70,62 Q60,80 50,82 Q38,82 24,74Z" fill="${c.body}"/>
  <path d="M30,74 Q26,62 30,52" stroke="${c.dark}" stroke-width="1.5" fill="none" opacity="0.3"/>
  <path d="M40,78 Q38,64 40,52" stroke="${c.dark}" stroke-width="1.5" fill="none" opacity="0.3"/>
  <path d="M24,74 Q10,86 6,92" stroke="${c.dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M6,92 Q10,80 16,72 Q22,64 24,74" stroke="${c.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M70,62 Q80,68 90,80" stroke="${c.dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M90,80 Q86,68 82,60 Q76,52 70,62" stroke="${c.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M34,56 Q26,50 18,44" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M34,62 Q24,60 16,60" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M62,52 Q70,46 78,42" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M64,58 Q74,58 82,58" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M43,22 Q40,14 36,8" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M54,22 Q56,14 58,8" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${circ(36,8,3,c.accent)}${circ(58,8,3,c.accent)}
  ${circ(50,34,14,c.head)}${eyes(44,30,56,30,c,4,5)}${mouth(36,c.dark)}`),

// 9 – Firefly: glowing round abdomen, small wings, glow aura
c => wrap(`
  ${circ(50,78,14,c.accent,'0.3')}${circ(50,78,9,c.accent,'0.5')}
  ${ell(50,78,8,12,c.dark)}
  ${ell(50,78,7,11,'#FFFF88','0.4')}
  ${ell(30,55,14,9,c.wing,'0.5',`transform="rotate(-20,30,55)"`)}
  ${ell(70,55,14,9,c.wing,'0.5',`transform="rotate(20,70,55)"`)}
  ${ell(50,56,9,10,c.body)}
  ${antennae(c)}${insectHead(c,34)}
  <path d="M40,58 Q30,54 22,50" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M40,63 Q28,62 20,60" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M60,58 Q70,54 78,50" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M60,63 Q72,62 80,60" stroke="${c.dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`)
]

// Fix butterfly wing transform (same issue as P[0])
I[0] = c => wrap(`
  <ellipse cx="26" cy="40" rx="22" ry="18" fill="${c.wing}" opacity="0.6" transform="rotate(-15,26,40)"/>
  <ellipse cx="74" cy="40" rx="22" ry="18" fill="${c.wing}" opacity="0.6" transform="rotate(15,74,40)"/>
  <ellipse cx="24" cy="60" rx="15" ry="12" fill="${c.wing}" opacity="0.45" transform="rotate(10,24,60)"/>
  <ellipse cx="76" cy="60" rx="15" ry="12" fill="${c.wing}" opacity="0.45" transform="rotate(-10,76,60)"/>
  <line x1="26" y1="40" x2="8" y2="30" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  <line x1="26" y1="40" x2="6" y2="44" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  <line x1="74" y1="40" x2="92" y2="30" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  <line x1="74" y1="40" x2="94" y2="44" stroke="${c.dark}" stroke-width="0.8" opacity="0.35"/>
  ${ell(50,62,5,26,c.dark)}${antennae(c)}${insectHead(c,36)}`)

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Get SVG string for a monster.
 * @param {string} element  Fire | Water | Earth | Wind | Shadow
 * @param {string} set      Animal | Plant | Insect
 * @param {number} variant  0–9 (which design within the set)
 */
export function getMonsterSVG(element, set, variant = 0) {
  const c = C[element] || C.Fire
  const v = ((variant || 0) % 10 + 10) % 10
  if (set === 'Animal') return A[v](c)
  if (set === 'Plant')  return P[v](c)
  if (set === 'Insect') return I[v](c)
  return A[0](c)
}

// ── PNG image filename maps (matches public/monsters/{set}/{element}/*.png) ──
const PNG_NAMES = {
  Fire: {
    Animal: ['flamelion','pyrotiger','emberfox','ashbear','blazewolf','scorchrabbit','infernopanda','cinderdeer','flarehorse','emberpup'],
    Plant:  ['blazecactus','suncrown','pepperling','embershrub','torchfern','ashrose','lavalily','scorchorchid','kindlemaple','pyrosprout'],
    Insect: ['glofly','emberbeetle','blazemoth','lavabee','ashcricket','torchant','scaldspider','emberwing','charbutterfly','sizzlewasp'],
  },
  Water: {
    Animal: ['bubbotter','aquaseal','wavedolphin','frostpenguin','puddleduck','dewtoad','tideturtle','misthippo','streambeaver','rainplatypus'],
    Plant:  ['pondlily','kelpling','lotusling','dewleaf','mistfern','cattailsplash','reedripple','algaeblob','mangrootling','bubblemoss'],
    Insect: ['ripplebug','divebeetle','mistmosquito','seamoth','bubblefly','dewcicada','rainant','dropspider','tidedragonfly','wavebutterfly'],
  },
  Earth: {
    Animal: ['boulderphant','stonerhino','mossgorilla','mudboar','digmole','shellarmadillo','rootbadger','granitebuffalo','pebblepangolin','crystalox'],
    Plant:  ['acornling','mushroomcap','bambootot','vinewrap','mossrock','rootbuddy','bonsaikin','fernling','dandylion','pebblevine'],
    Insect: ['staghorn','bouldergrub','rhinobug','mudbeetle','stoneweaver','cavecricket','soilant','claymoth','pebbleworm','mudwasp'],
  },
  Wind: {
    Animal: ['gusteagle','breezeowl','skyparrot','driftbat','galefalcon','cloudpeacock','mistswiftswan','zephyrhummingbird','aircrane','cyclonehawk'],
    Plant:  ['puffball','willowisp','petalsprite','cloudbloom','breezebloom','featherfern','skyreed','driftweed','gustshrub','zephyrbloom'],
    Insect: ['driftbutterfly','breezefly','gustdamsel','skylunamoth','airbeetle','zephyrhopper','cloudpollinator','whirlcricket','gustwasp','mistfly'],
  },
  // Shadow slot uses lightning-themed images
  Shadow: {
    Animal: ['zapcheetah','boltferret','staticcat','shockmongoose','voltsquirrel','thunderraccoon','sparkhamster','zapweasel','voltmeerkat','boltlynx'],
    Plant:  ['thundershroom','boltcactus','sparkflower','voltberry','stormfern','plasmaorchid','zapvine','staticgrass','thunderbud','boltsprout'],
    Insect: ['sparkant','thunderbeetle','boltmoth','stormfly','staticglow','voltbutterfly','zaphopper','thunderwasp','chargespider','boltcricket'],
  },
}
const EL_FOLDER  = { Fire:'fire', Water:'water', Earth:'earth', Wind:'wind', Shadow:'lightning' }
const SET_FOLDER = { Animal:'animal', Plant:'plant', Insect:'insect' }

/**
 * Convenience: pass the monster object directly.
 * Returns an <img> pointing to the PNG artwork, or SVG fallback.
 */
export function getMonsterImage(monster) {
  const dexNum  = parseInt((monster?.dex || '#001').replace('#', '')) || 1
  const variant = (dexNum - 1) % 10
  const element = monster?.element || 'Fire'
  const set     = monster?.set     || 'Animal'

  const names = PNG_NAMES[element]?.[set]
  if (names) {
    const file   = names[variant]
    const folder = `${SET_FOLDER[set]}/${EL_FOLDER[element]}`
    return `<img src="/monsters/${folder}/${file}.png" style="width:100%;height:100%;object-fit:contain" loading="lazy" />`
  }
  return getMonsterSVG(element, set, variant)
}

export function getMonsterDataUrl(element, set, variant = 0) {
  return 'data:image/svg+xml,' + encodeURIComponent(getMonsterSVG(element, set, variant))
}
