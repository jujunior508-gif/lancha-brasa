"use strict";
(()=>{const f=document.getElementById('fontCss');if(f)f.media='all'})();
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const brl = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const money = n => brl.format(n);

/* =====================================================================
   DADOS DA LOJA: troque pelos dados reais antes de publicar.
   whatsapp: código do país + DDD + número, só dígitos.
   Redes sociais: endereço completo do perfil; deixe '' para esconder o ícone.
   ===================================================================== */
const LOJA={
  whatsapp:'5511930621240', whatsappTexto:'(11) 93062-1240',
  telefone:'(11) 3062-1240', email:'ola@brasaepao.com.br',
  instagram:'', facebook:'', tiktok:''
};

/* ---------- Seeded randomness so each illustration is stable ---------- */
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const f1 = n => n.toFixed(1);

/* ---------- Texture patterns (crust speckle, crumb) painted once on canvas ---------- */
function speckle(size, n, colors, seed){
  const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');const R=rng(seed);
  for(let i=0;i<n;i++){x.fillStyle=colors[i%colors.length];x.globalAlpha=.25+R()*.6;x.beginPath();x.ellipse(R()*size,R()*size,.4+R()*1.5,.3+R()*1.1,R()*3,0,7);x.fill()}
  try{return c.toDataURL()}catch(e){return ''}
}
const defs=$('#sharedDefs');
[['pCrust',speckle(64,260,['#1A0904','#2A1208','#A0603A'],7)],['pCrumb',speckle(48,90,['#B97A3A','#FFF3D8'],3)],['pBatter',speckle(40,110,['#8E4E18','#FFE3A6'],9)],['pBun',speckle(64,170,['#7A3A10','#FFE6B8','#9C4E18'],11)]]
  .forEach(([id,u])=>{if(u)defs.insertAdjacentHTML('beforeend',`<pattern id="${id}" width="64" height="64" patternUnits="userSpaceOnUse"><image href="${u}" width="64" height="64"/></pattern>`)});

/* ---------- Burger layers (y = bottom edge of the layer, 300-wide stage) ---------- */
function band(x0,x1,yT,yB,amp,step,R){
  let d=`M${x0} ${yT}`;
  for(let x=x0;x<x1;x+=step)d+=`Q${x+step/2} ${f1(yT-amp+R()*amp*2)} ${Math.min(x+step,x1)} ${f1(yT+(R()-.5)*amp)}`;
  d+=`L${x1} ${yB}`;
  for(let x=x1;x>x0;x-=step)d+=`Q${x-step/2} ${f1(yB-amp+R()*amp*2)} ${Math.max(x-step,x0)} ${f1(yB+(R()-.5)*amp)}`;
  return d+'Z';
}
function pattyD(y,h,R){
  const top=y-h;let d=`M8 ${y-h/2}Q8 ${top} 26 ${top}`;
  for(let x=38;x<=274;x+=12)d+=`L${x} ${f1(top+(R()-.5)*3.2)}`;
  d+=`Q292 ${top} 292 ${y-h/2}Q292 ${y} 274 ${y}`;
  for(let x=262;x>=26;x-=12)d+=`L${x} ${f1(y+(R()-.5)*3.2)}`;
  return d+`Q8 ${y} 8 ${y-h/2}Z`;
}
function patty(y,R,h,grad,smash,tex='pCrust'){
  const d=pattyD(y,h,R);let s=`<path d="${d}" fill="url(#${grad})"/><path d="${d}" fill="url(#${tex})" opacity=".85"/>`;
  if(tex!=='pCrust')return s+`<path d="M30 ${y-h+4}Q150 ${y-h-1} 270 ${y-h+4}" stroke="#FFE7B0" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  for(let k=0;k<6;k++){const x=40+R()*200,w=14+R()*30;s+=`<path d="M${f1(x)} ${f1(y-h+3.5+R()*3)}q${f1(w/2)} -2 ${f1(w)} 0" stroke="#C07A4C" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/>`}
  if(smash)for(let k=0;k<10;k++){const right=k%2,x=right?290+R()*8:10-R()*8;s+=`<ellipse cx="${f1(x)}" cy="${f1(y-h/2+(R()-.5)*h*.8)}" rx="${f1(2+R()*4)}" ry="${f1(1.2+R()*2)}" fill="${R()>.5?'#4A2111':'#6A3218'}"/>`}
  return s;
}
function cheese(y,R,grad){
  const top=y-8,drips=[];for(let k=0;k<5;k++)drips.push([30+k*56+R()*26,8+R()*16,5+R()*4]);
  drips.sort((a,b)=>b[0]-a[0]);
  let d=`M-2 ${top+1}Q150 ${top-3} 302 ${top+1}L306 ${y+12}Q303 ${y+18} 297 ${y+9}L290 ${y}`;
  drips.forEach(([x,l,w])=>{d+=`L${f1(x+w)} ${y}C${f1(x+w)} ${f1(y+l*.6)} ${f1(x+w*.6)} ${f1(y+l)} ${f1(x)} ${f1(y+l)}C${f1(x-w*.6)} ${f1(y+l)} ${f1(x-w)} ${f1(y+l*.6)} ${f1(x-w)} ${y}`});
  d+=`L10 ${y}L3 ${y+9}Q-3 ${y+18} -6 ${y+12}Z`;
  return `<path d="${d}" fill="url(#${grad})"/><path d="M8 ${top+1.5}Q150 ${top-1.5} 292 ${top+1.5}" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`+
    drips.map(([x,l])=>`<ellipse cx="${f1(x-1.5)}" cy="${f1(y+l-4)}" rx="1.4" ry="2.4" fill="#fff" opacity=".5"/>`).join('');
}
function lettuce(y,R,grad){
  const top=y-12;let d=`M-10 ${y-4}`;
  for(let x=-10;x<310;x+=16)d+=`Q${x+8} ${f1(top-R()*8)} ${x+16} ${f1(top+2+R()*3)}`;
  d+=`L310 ${y-2}`;
  for(let x=310;x>-10;x-=16)d+=`Q${x-8} ${f1(y+3+R()*8)} ${x-16} ${f1(y-1+R()*2)}`;
  let s=`<path d="${d}Z" fill="url(#${grad})" stroke="#2F6512" stroke-width=".8"/>`;
  for(let k=0;k<9;k++){const x=R()*290;s+=`<path d="M${f1(x)} ${y-1}q${f1(4+R()*6)} -5 ${f1(10+R()*10)} -8" stroke="#E4F8AE" stroke-opacity=".55" stroke-width="1.2" fill="none"/>`}
  return s;
}
function tomato(y,R){
  let s='';[14,154].forEach(x0=>{s+=`<rect x="${x0}" y="${y-12}" width="132" height="12" rx="6" fill="#9E1D10"/><rect x="${x0+3}" y="${y-10}" width="126" height="8" rx="4" fill="url(#gTomato)"/>`;
    for(let k=0;k<3;k++){const cx=x0+24+k*42;s+=`<ellipse cx="${cx}" cy="${y-6}" rx="13" ry="2.6" fill="#F7A585" opacity=".85"/>`;for(let j=-1;j<=1;j++)s+=`<ellipse cx="${cx+j*5}" cy="${y-6}" rx="1.5" ry=".9" fill="#FCEBB0"/>`}
    s+=`<path d="M${x0+10} ${y-9.5}H${x0+60}" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" stroke-linecap="round"/>`});
  return s;
}
const onion=y=>[64,150,236].map(x=>`<ellipse cx="${x}" cy="${y-4}" rx="46" ry="4" fill="none" stroke="#F4EAF5" stroke-width="4.5"/><ellipse cx="${x}" cy="${y-4}" rx="48" ry="4.6" fill="none" stroke="#9E5B98" stroke-width="1.3"/><ellipse cx="${x}" cy="${y-4}" rx="33" ry="2.6" fill="none" stroke="#E2CCE6" stroke-width="2.2"/>`).join('');
function bacon(y,R){return `<path d="${band(-4,304,y-11,y,3.5,26,R)}" fill="url(#gBacon)"/><path d="${band(6,294,y-7,y-4.5,3,26,R)}" fill="#F7D2B8" opacity=".9"/>`+Array.from({length:10},()=>`<circle cx="${f1(R()*290+5)}" cy="${f1(y-2-R()*8)}" r="${f1(.8+R()*1.4)}" fill="#4A1209" opacity=".7"/>`).join('')}
const pickles=(y,R)=>[50,112,180,246].map(x=>{const r=f1((R()-.5)*8);return `<g transform="rotate(${r} ${x} ${y-4.5})"><ellipse cx="${x}" cy="${y-4.5}" rx="31" ry="5.6" fill="url(#gPickle)" stroke="#3E5A12" stroke-width="1.5"/><ellipse cx="${x}" cy="${y-4.5}" rx="20" ry="3.2" fill="none" stroke="#E5F0A8" stroke-width="1.1" stroke-dasharray="2 3"/></g>`}).join('');
function sauce(y,R,grad){return `<path d="${band(6,294,y-6,y,2.5,18,R)}" fill="url(#${grad})"/><path d="M${f1(60+R()*40)} ${y}q3 0 3 7a3 3 0 0 1-6 0q0-7 3-7z M${f1(200+R()*40)} ${y}q3 0 3 9a3 3 0 0 1-6 0q0-9 3-9z" fill="url(#${grad})"/><path d="M20 ${y-5}H120" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" stroke-linecap="round"/>`}
const jalapeno=(y,R)=>{let s='';for(let x=28;x<=272;x+=30){const yy=y-4-R()*2;s+=`<ellipse cx="${x}" cy="${f1(yy)}" rx="15" ry="3.8" fill="#3E7A22" stroke="#22500E" stroke-width="1.4"/><ellipse cx="${x}" cy="${f1(yy)}" rx="9" ry="2" fill="#D9EDA4"/><circle cx="${x-3}" cy="${f1(yy)}" r=".9" fill="#F8F2D0"/><circle cx="${x+3}" cy="${f1(yy)}" r=".9" fill="#F8F2D0"/>`}return s};
const avocado=(y,R)=>[46,112,178,244].map(x=>`<ellipse cx="${x}" cy="${y-5}" rx="35" ry="6" fill="url(#gAvo)" stroke="#3D5A14" stroke-width="1.8"/><path d="M${x-22} ${y-7}q22 -3 40 0" stroke="#fff" stroke-opacity=".4" stroke-width="1.2" fill="none"/>`).join('');
const mush=(y,R)=>[30,80,130,180,230,272].map(x=>{const w=24+R()*4;return `<path d="M${f1(x-w)} ${y}Q${f1(x-w)} ${y-13} ${x} ${y-13}Q${f1(x+w)} ${y-13} ${f1(x+w)} ${y}Z" fill="url(#gMush)"/><path d="M${f1(x-w*.55)} ${y-8}Q${x} ${y-12} ${f1(x+w*.4)} ${y-9}" stroke="#E9C9A6" stroke-opacity=".6" stroke-width="1.5" fill="none"/>`}).join('');
function bunBottom(y){const t=y-34;return `<path d="M16 ${t+5}Q16 ${t} 24 ${t}H276Q284 ${t} 284 ${t+5}L280 ${y-12}Q276 ${y} 258 ${y}H42Q24 ${y} 20 ${y-12}Z" fill="url(#gBunBot)"/><path d="M17 ${t+3}Q17 ${t} 25 ${t}H275Q283 ${t} 283 ${t+3}V${t+8}H17Z" fill="#F4DDB0"/><rect x="17" y="${t}" width="266" height="8" fill="url(#pCrumb)" opacity=".7"/><ellipse cx="96" cy="${y-15}" rx="56" ry="5" fill="url(#gShine)" opacity=".55"/>`}
function bunTop(y,R){
  const h=84,t=y-h,dome=`M10 ${y}C2 ${y-h*.45} 40 ${t+4} 150 ${t}C260 ${t+4} 298 ${y-h*.45} 290 ${y}Q150 ${y+7} 10 ${y}Z`;
  let s=`<path d="${dome}" fill="url(#gBunTop)"/><path d="${dome}" fill="url(#pBun)" opacity=".5"/><path d="M18 ${y-6}C14 ${y-h*.4} 46 ${t+10} 150 ${t+6}C254 ${t+10} 286 ${y-h*.4} 282 ${y-6}" fill="none" stroke="#6E300C" stroke-opacity=".22" stroke-width="5"/>`;
  s+=`<path d="M12 ${y-1}Q150 ${y+6} 288 ${y-1}Q150 ${y+11} 12 ${y-1}Z" fill="#F2D3A0"/>`;
  s+=`<ellipse cx="108" cy="${t+h*.27}" rx="72" ry="22" fill="url(#gShine)" transform="rotate(-8 108 ${t+h*.27})"/><ellipse cx="92" cy="${t+h*.2}" rx="16" ry="5" fill="#fff" opacity=".35" transform="rotate(-14 92 ${t+h*.2})"/>`;
  for(let i=0;i<24;i++){const x=34+R()*232,fx=1-Math.pow((x-150)/140,2),yy=y-12-R()*(h*fx-22),r=f1((R()-.5)*80);
    s+=`<ellipse cx="${f1(x)}" cy="${f1(yy)}" rx="4.8" ry="2.2" fill="url(#gSeed)" stroke="#8A4512" stroke-opacity=".35" stroke-width=".8" transform="rotate(${r} ${f1(x)} ${f1(yy)})"/>`}
  return s;
}
const LAYERS={
  bunBottom:{h:34,d:(y,R)=>bunBottom(y)},
  patty:{h:30,d:(y,R)=>patty(y,R,30,'gPatty',false),label:'Blend 180 g',sub:'Acém e peito moídos às 6h'},
  smash:{h:22,d:(y,R)=>patty(y,R,22,'gPatty',true)},
  veg:{h:30,d:(y,R)=>patty(y,R,30,'gBeet',false)},
  chicken:{h:32,d:(y,R)=>patty(y,R,32,'gChicken',false,'pBatter')},
  cheese:{h:8,d:(y,R)=>cheese(y,R,'gCheese')},
  swiss:{h:8,d:(y,R)=>cheese(y,R,'gSwiss')},
  jack:{h:8,d:(y,R)=>cheese(y,R,'gJack')},
  lettuce:{h:12,d:(y,R)=>lettuce(y,R,'gLettuce')},
  arugula:{h:12,d:(y,R)=>lettuce(y,R,'gArugula')},
  tomato:{h:12,d:(y,R)=>tomato(y,R)},
  onion:{h:8,d:y=>onion(y)},
  bacon:{h:11,d:(y,R)=>bacon(y,R)},
  pickles:{h:9,d:(y,R)=>pickles(y,R)},
  sauce:{h:6,d:(y,R)=>sauce(y,R,'gSauce')},
  bbq:{h:6,d:(y,R)=>sauce(y,R,'gBBQ')},
  crema:{h:6,d:(y,R)=>sauce(y,R,'gCrema')},
  jalapeno:{h:8,d:(y,R)=>jalapeno(y,R)},
  avocado:{h:10,d:(y,R)=>avocado(y,R)},
  mush:{h:12,d:(y,R)=>mush(y,R)},
  bunTop:{h:84,d:(y,R)=>bunTop(y,R)}
};
function burgerSVG(layers,seed=1,spread=0,cls='',board=false){
  const R=rng(seed),OV=3,n=layers.length;
  const total=layers.reduce((a,k)=>a+LAYERS[k].h,0)-OV*(n-1);
  const H=total+34;let y=H-24,out='';const centers=[];
  layers.forEach((k,i)=>{const L=LAYERS[k];centers.push(y-L.h/2);
    out+=`<g class="layer" style="--i:${i}" data-i="${i}">${i?`<ellipse cx="150" cy="${y+2}" rx="138" ry="4.5" fill="#1A0A04" opacity=".42" filter="url(#fBlurS)"/>`:''}${L.d(y,R)}</g>`;
    y-=L.h-OV});
  const extra=(n-1)*spread,vb=`-14 ${-extra/2} 328 ${H+extra}`;
  const ground=board?`<ellipse cx="150" cy="${H-10}" rx="170" ry="15" fill="#5A3414" opacity=".35" filter="url(#fBlur)"/><ellipse cx="150" cy="${H-17}" rx="164" ry="14" fill="url(#gBoard)"/><ellipse cx="150" cy="${H-18.5}" rx="160" ry="12" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/><ellipse cx="150" cy="${H-22}" rx="140" ry="7" fill="#000" opacity=".55" filter="url(#fBlurS)"/>`
    :`<ellipse cx="150" cy="${H-16}" rx="150" ry="10" fill="#000" opacity=".5" filter="url(#fBlur)"/>`;
  return {html:`<svg class="burger ${cls}" viewBox="${vb}" aria-hidden="true">${ground}${out}</svg>`,H,centers,extra};
}

/* ---------- Sides & drinks ---------- */
const wrapSide=inner=>`<svg class="side" viewBox="0 0 320 260" aria-hidden="true"><ellipse cx="160" cy="252" rx="150" ry="12" fill="#000" opacity=".6" filter="url(#fBlur)"/><ellipse cx="160" cy="246" rx="146" ry="14" fill="url(#gBoard)"/><path d="M30 244q130 -6 260 0M44 249q116 -5 232 0" stroke="#3A2414" stroke-opacity=".45" stroke-width="1" fill="none"/><ellipse cx="160" cy="243" rx="142" ry="11" fill="none" stroke="#C99766" stroke-opacity=".25" stroke-width="1"/>${inner}</svg>`;
function fries(loaded,seed,grad='gFry',w=14){
  const R=rng(seed);let s=`<path d="M86 104L234 104L244 122L76 122Z" fill="#6E1E06"/>`;const n=Math.round(20*14/w);
  for(let i=0;i<n;i++){const x=88+R()*(144-w),top=26+R()*50,h=150-top+R()*20,r=f1((R()-.5)*30);
    s+=`<g transform="rotate(${r} ${f1(x+w/2)} 220)"><rect x="${f1(x)}" y="${f1(top)}" width="${w}" height="${f1(h)}" rx="3" fill="url(#${grad})"/><rect x="${f1(x)}" y="${f1(top)}" width="${w}" height="7" rx="3" fill="#8A4A16" opacity=".4"/><rect x="${f1(x+3)}" y="${f1(top+10)}" width="2.5" height="${f1(h*.5)}" rx="1" fill="#fff" opacity=".35"/></g>`}
  if(loaded){s+=`<path d="M84 96Q98 70 118 84T152 74T188 82T238 96L236 118H86Z" fill="url(#gCheese)"/><path d="M104 84q14-8 26-2" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    for(let i=0;i<12;i++)s+=`<rect x="${f1(92+R()*136)}" y="${f1(78+R()*22)}" width="${f1(7+R()*5)}" height="5" rx="2" fill="${R()>.5?'#9B3420':'#C2563A'}" transform="rotate(${f1(R()*60-30)} 160 90)"/>`;
    for(let i=0;i<16;i++)s+=`<ellipse cx="${f1(90+R()*140)}" cy="${f1(76+R()*26)}" rx="3" ry="2" fill="none" stroke="#5FA02E" stroke-width="1.6"/>`}
  s+=`<path d="M76 122L244 122L226 246L94 246Z" fill="url(#gCarton)"/><path d="M76 122L244 122L242 136L78 136Z" fill="#000" opacity=".18"/>`;
  if(loaded)s+=`<path d="M120 122q4 0 4 14a4 4 0 0 1-8 0q0-14 4-14z M196 122q4 0 4 20a4 4 0 0 1-8 0q0-20 4-20z" fill="url(#gCheese)"/>`;
  s+=`<circle cx="160" cy="184" r="24" fill="#17110E" opacity=".9"/><path d="M160 166c2 4 6 6 6 11a6 6 0 0 1-12 0c0-2.6 1.4-4 2.6-5.2 0 2 .6 3.2 2 3.2-.6-3.2 0-6.6 1.4-9z" fill="#E8A63A"/><text x="160" y="200" text-anchor="middle" font-family="Big Shoulders Display, Arial Narrow, sans-serif" font-weight="800" font-size="9" letter-spacing="1.5" fill="#F6EDE6">BRASA&amp;PÃO</text>`;
  s+=`<path d="M100 124L112 244" stroke="#fff" stroke-opacity=".18" stroke-width="10"/>`;
  return wrapSide(s);
}
function rings(seed){
  const R=rng(seed);let s=`<ellipse cx="248" cy="214" rx="38" ry="12" fill="url(#gDish)"/><ellipse cx="248" cy="210" rx="30" ry="8" fill="#D9662A"/><ellipse cx="240" cy="208" rx="10" ry="2.5" fill="#fff" opacity=".4"/>`;
  [[146,206,0],[126,172,-8],[160,140,9],[136,106,-5]].forEach(([x,y,r])=>{
    s+=`<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y+4}" rx="72" ry="27" fill="none" stroke="#3A1A08" stroke-opacity=".35" stroke-width="24" filter="url(#fBlurS)"/><ellipse cx="${x}" cy="${y}" rx="70" ry="26" fill="none" stroke="url(#gRing)" stroke-width="24"/><ellipse cx="${x}" cy="${y}" rx="70" ry="26" fill="none" stroke="url(#pBatter)" stroke-width="24" opacity=".75"/><ellipse cx="${x}" cy="${y-6}" rx="66" ry="20" fill="none" stroke="#FFE6AE" stroke-opacity=".55" stroke-width="3" stroke-dasharray="3 7"/></g>`});
  return wrapSide(s);
}
function shake(grad,drz,salt){const dulce=!!drz;
  let s=`<g transform="rotate(14 196 120)"><rect x="190" y="0" width="12" height="110" rx="3" fill="#CF2E2E"/>${[8,30,52,74].map(y=>`<rect x="190" y="${y}" width="12" height="10" fill="#fff"/>`).join('')}</g>`;
  s+=`<path d="M100 96L220 96L206 240Q160 250 114 240Z" fill="url(#${grad})"/>`;
  if(dulce)s+=`<path d="M112 110q8 30 0 60M206 108q-6 40 2 70M150 100q4 20-2 38" stroke="${drz}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>`;
  s+=`<path d="M100 96L220 96L206 240Q160 250 114 240Z" fill="url(#gGlass)"/><path d="M110 104L120 232" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/><ellipse cx="160" cy="96" rx="60" ry="6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
  s+=[[116,88,22],[148,78,28],[184,88,22],[132,62,20],[168,60,19],[150,44,16]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gCream)"/>`).join('');
  if(dulce)s+=`<path d="M110 82q14 12 26-4t30 4 26-6M124 64q12 8 22-2t24 2" stroke="${drz}" stroke-width="5" fill="none" stroke-linecap="round"/>${[[130,70],[160,74],[176,62],[144,56],[192,84]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3" height="3" fill="${salt?'#fff':'#3A1A0A'}" transform="rotate(30 ${x} ${y})"/>`).join('')}`;
  s+=`<path d="M152 28Q158 10 172 4" stroke="#3C6A1E" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="150" cy="32" r="13" fill="url(#gCherry)"/><ellipse cx="145" cy="27" rx="4" ry="2.6" fill="#fff" opacity=".7"/>`;
  return wrapSide(s);
}
function suica(){
  let s=`<g transform="rotate(10 186 120)"><rect x="182" y="2" width="11" height="120" rx="3" fill="#3C7A2A"/></g>`;
  s+=`<path d="M106 70L214 70L204 240Q160 248 116 240Z" fill="url(#gSuica)"/><path d="M106 70L214 70L212 96L108 96Z" fill="#FBFDF0"/>`;
  s+=[[120,90],[134,86],[150,92],[170,88],[188,92],[200,86],[160,82]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${3+((x*7)%4)}" fill="#fff" opacity=".7"/>`).join('');
  s+=`<path d="M106 70L214 70L204 240Q160 248 116 240Z" fill="url(#gGlass)"/><path d="M114 80L124 232" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>`;
  s+=[[130,140],[192,120],[178,190],[140,206],[200,170],[122,176]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#fff" opacity=".55"/>`).join('');
  s+=`<g transform="rotate(-12 210 74)"><circle cx="210" cy="74" r="30" fill="url(#gLime)"/>${[0,40,80,120,160].map(a=>{const c=Math.cos(a*Math.PI/180)*22,d=Math.sin(a*Math.PI/180)*22;return `<path d="M${f1(210-c)} ${f1(74-d)}L${f1(210+c)} ${f1(74+d)}" stroke="#F7FCD8" stroke-width="1.6"/>`}).join('')}<circle cx="210" cy="74" r="3" fill="#F7FCD8"/></g>`;
  return wrapSide(s);
}

const dish=(cx,cy,rx,ry,fill)=>`<ellipse cx="${cx}" cy="${cy+4}" rx="${rx+2}" ry="${ry+3}" fill="#000" opacity=".3" filter="url(#fBlurS)"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#gDish)"/><ellipse cx="${cx}" cy="${cy-2}" rx="${rx*.78}" ry="${ry*.62}" fill="${fill}"/><ellipse cx="${cx-rx*.3}" cy="${cy-4}" rx="${rx*.22}" ry="${ry*.16}" fill="#fff" opacity=".4"/>`;
const plate=()=>`<ellipse cx="160" cy="214" rx="128" ry="28" fill="url(#gDish)"/><ellipse cx="160" cy="212" rx="96" ry="18" fill="none" stroke="#B9AEA3" stroke-opacity=".6" stroke-width="1.5"/>`;
function nuggets(seed){
  const R=rng(seed);let s=`<path d="M62 150L258 150L240 238L80 238Z" fill="url(#gCarton)"/><path d="M62 150L258 150L256 160L64 160Z" fill="#000" opacity=".2"/>`;
  s+=`<path d="M70 152${Array.from({length:12},(_,i)=>`L${76+i*16} ${f1(140+R()*10)}`).join('')}L252 152Z" fill="#FFF8EC"/>`;
  [[100,138],[146,132],[194,136],[232,144],[120,112],[170,108],[212,116],[146,88],[92,154],[188,152]].forEach(([x,y])=>{const rx=24+R()*6,ry=16+R()*4,r=f1((R()-.5)*30);
    s+=`<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y+4}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#3A1A08" opacity=".35" filter="url(#fBlurS)"/><ellipse cx="${x}" cy="${y}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#gChicken)"/><ellipse cx="${x}" cy="${y}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#pBatter)" opacity=".8"/><ellipse cx="${f1(x-rx*.3)}" cy="${f1(y-ry*.45)}" rx="${f1(rx*.4)}" ry="${f1(ry*.2)}" fill="#FFE9B8" opacity=".55"/></g>`});
  return wrapSide(s+dish(268,214,30,9,'#9A3B12'));
}
function iced(grad,wheel){
  let s=`<g transform="rotate(10 186 120)"><rect x="182" y="2" width="11" height="120" rx="3" fill="#2E2E2E"/></g>`;
  s+=`<path d="M106 70L214 70L204 240Q160 248 116 240Z" fill="url(#${grad})" opacity=".92"/>`;
  s+=[[118,96,-12],[160,90,8],[136,126,20],[180,132,-6],[150,168,14]].map(([x,y,r])=>`<rect x="${x}" y="${y}" width="28" height="26" rx="5" fill="#fff" opacity=".38" stroke="#fff" stroke-opacity=".6" transform="rotate(${r} ${x+14} ${y+13})"/>`).join('');
  s+=`<path d="M106 70L214 70L204 240Q160 248 116 240Z" fill="url(#gGlass)"/><path d="M114 80L124 232" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/><ellipse cx="160" cy="70" rx="54" ry="5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
  s+=[[130,140],[192,120],[178,190],[140,206],[200,170]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#fff" opacity=".55"/>`).join('');
  s+=`<g transform="rotate(-12 210 74)"><circle cx="210" cy="74" r="30" fill="url(#${wheel})"/>${[0,40,80,120,160].map(a=>{const c=Math.cos(a*Math.PI/180)*22,d=Math.sin(a*Math.PI/180)*22;return `<path d="M${f1(210-c)} ${f1(74-d)}L${f1(210+c)} ${f1(74+d)}" stroke="#FFFCE6" stroke-width="1.6"/>`}).join('')}<circle cx="210" cy="74" r="3" fill="#FFFCE6"/></g>`;
  return wrapSide(s);
}
function beer(seed){
  const R=rng(seed);let s=`<path d="M108 62L212 62L201 240Q160 248 119 240Z" fill="url(#gBeer)"/>`;
  for(let i=0;i<26;i++)s+=`<circle cx="${f1(122+R()*76)}" cy="${f1(96+R()*136)}" r="${f1(.8+R()*1.6)}" fill="none" stroke="#FFF6D0" stroke-opacity=".75"/>`;
  s+=`<path d="M108 62L212 62L210 88L110 88Z" fill="#FFFBEF"/>`+[[116,60,12],[134,54,14],[156,52,15],[178,54,14],[198,58,13],[146,62,10],[188,64,10]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gCream)"/>`).join('');
  s+=`<path d="M108 62L212 62L201 240Q160 248 119 240Z" fill="url(#gGlass)"/><path d="M116 90L126 232" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>`;
  s+=[[134,150],[190,128],[176,196],[146,214],[196,180],[126,186]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#fff" opacity=".6"/>`).join('');
  return wrapSide(s);
}
function brownie(){
  let s=plate()+`<path d="M90 152L214 152L216 206L88 206Z" fill="url(#gBrownie)"/><path d="M90 152L214 152L238 130L116 130Z" fill="#6E4026"/><path d="M90 152L214 152L238 130L116 130Z" fill="url(#pCrust)" opacity=".7"/><path d="M214 152L238 130L238 184L216 206Z" fill="#1E0E06"/>`;
  s+=`<path d="M120 170q20 4 40-2t44 2" stroke="#7A4A2C" stroke-opacity=".5" stroke-width="2" fill="none"/>`;
  s+=`<ellipse cx="168" cy="132" rx="40" ry="10" fill="#F4EBDB" opacity=".9"/><path d="M144 134q2 16 6 18q4-2 4-14M188 134q0 12 4 14q4-2 2-14" fill="#F4EBDB"/>`;
  s+=[[150,112,22],[184,112,22],[168,94,26]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gCream)"/>`).join('');
  s+=`<path d="M140 100q14 10 28-2t30 4M150 84q10 6 20-2" stroke="#3A1A0A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M170 72q10-14 22-10q-6 12-22 10z" fill="#5E9A2E"/><path d="M172 70q8-6 18-7" stroke="#3E7A1A" stroke-width="1.2" fill="none"/>`;
  return wrapSide(s);
}
function churros(seed){
  const R=rng(seed);let s=plate();
  [[92,174,-24],[110,160,-14],[128,150,-4],[96,190,-30]].forEach(([x,y,r])=>{s+=`<g transform="rotate(${r} ${x} ${y})"><rect x="${x}" y="${y-12}" width="150" height="24" rx="12" fill="url(#gChurro)"/>`;
    for(let k=-1;k<=1;k++)s+=`<path d="M${x+10} ${y+k*6}H${x+140}" stroke="#7E3E10" stroke-opacity=".45" stroke-width="1.5"/>`;
    for(let k=0;k<18;k++)s+=`<rect x="${f1(x+6+R()*140)}" y="${f1(y-10+R()*20)}" width="2" height="2" fill="#FFF8E8" opacity=".9"/>`;s+=`</g>`});
  return wrapSide(s+dish(246,204,34,11,'url(#gDulce)'));
}
function pudim(){
  let s=plate()+`<ellipse cx="160" cy="208" rx="92" ry="16" fill="#8E3A0C" opacity=".9"/><ellipse cx="140" cy="204" rx="30" ry="4" fill="#fff" opacity=".25"/>`;
  s+=`<path d="M92 206L110 132Q160 120 210 132L228 206Q160 222 92 206Z" fill="url(#gFlan)"/><path d="M100 196L114 140" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>`;
  s+=`<path d="M110 132Q160 120 210 132L212 140Q206 162 202 142Q194 150 190 140Q176 172 170 142Q160 148 150 142Q142 160 134 142Q122 156 116 142Q112 152 110 140Z" fill="url(#gCaramel)"/>`;
  s+=`<ellipse cx="160" cy="130" rx="50" ry="11" fill="url(#gCaramel)"/><ellipse cx="160" cy="130" rx="14" ry="3.6" fill="#2E1004"/><ellipse cx="140" cy="126" rx="16" ry="2.6" fill="#fff" opacity=".45"/>`;
  return wrapSide(s);
}

/* ---------- Menu data ---------- */
const A_BUN='Contém glúten, lactose, ovo e gergelim.';
/* =====================================================================
   COMO EDITAR O CARDÁPIO
   Cada item abaixo é um bloco { ... }. Para mudar:
   - preço:      price:36.9        (use ponto, sem "R$")
   - nome:       name:'Brasa Clássico'
   - descrição:  desc:'...'
   - selo:       badge:'Mais pedido'  (apague a linha para tirar o selo)
   - categoria:  cat:'burgers' | 'sides' | 'drinks' | 'desserts'
   - foto:       foto:'fotos/classico.jpg'  (coloque o arquivo na pasta fotos/ do site;
                 sem esta linha aparece a ilustração)
   - filtros:    tags:['veg','hot','gf','share']  (vegetariano, picante, sem glúten, para dividir)
   Para tirar um item do cardápio, apague o bloco inteiro dele.
   Para criar um item novo, copie um bloco parecido e troque o id (sem espaços nem acentos).
   ===================================================================== */
const MENU=[
  {id:'classico',cat:'burgers',name:'Brasa Clássico',price:36.9,kcal:780,spec:'Blend 180 g · cheddar inglês · brioche',badge:'Mais pedido',tags:[],
   desc:'Nosso blend com crosta bem marcada, cheddar inglês maturado, alface americana, tomate italiano, picles da casa e molho Brasa.',notes:['Suculento','Equilibrado','Clássico'],allerg:A_BUN,
   layers:['bunBottom','sauce','lettuce','tomato','patty','cheese','pickles','onion','bunTop']},
  {id:'smash',cat:'burgers',name:'Smash Duplo',price:39.9,kcal:860,spec:'2 × 90 g smash · queijo prato duplo',tags:[],
   desc:'Dois smashes finos com bordas rendadas e caramelizadas, queijo prato em dobro, cebola na chapa, picles e mostarda amarela.',notes:['Bordas crocantes','Derretido'],allerg:A_BUN,
   layers:['bunBottom','pickles','smash','cheese','smash','cheese','onion','bunTop']},
  {id:'bacon',cat:'burgers',name:'Bacon Defumado',price:42.9,kcal:940,spec:'Blend 180 g · gouda defumado · barbecue de rapadura',badge:'Escolha da casa',tags:[],
   desc:'Bacon de barriga defumado aqui na casa, gouda defumado, cebola crispy e barbecue de rapadura com um toque de cachaça.',notes:['Defumado','Agridoce','Intenso'],allerg:A_BUN,
   layers:['bunBottom','bbq','patty','cheese','bacon','onion','bunTop']},
  {id:'costela',cat:'burgers',name:'Costela BBQ',price:44.9,kcal:980,spec:'Blend de costela 180 g · cebola caramelizada',badge:'Novo',tags:[],
   desc:'Blend de costela bovina defumada por 6 horas, cheddar derretido, cebola caramelizada no açúcar mascavo e barbecue de rapadura.',notes:['Defumado','Untuoso','Agridoce'],allerg:A_BUN,
   layers:['bunBottom','bbq','patty','cheese','onion','bbq','bunTop']},
  {id:'triplo',cat:'burgers',name:'Smash Triplo',price:49.9,kcal:1180,spec:'3 × 90 g smash · triplo queijo prato',badge:'Para os fortes',tags:[],
   desc:'Três smashes rendados, três fatias de queijo prato, cebola na chapa e picles. Não recomendamos dividir, mas entendemos.',notes:['Gigante','Crocante','Derretido'],allerg:A_BUN,
   layers:['bunBottom','pickles','smash','cheese','smash','cheese','smash','cheese','onion','bunTop']},
  {id:'fogo',cat:'burgers',name:'Fogo na Chapa',price:39.9,kcal:810,spec:'Blend 180 g · pepper jack · jalapeño tostado',badge:'Picante',hot:true,tags:['hot'],
   desc:'Jalapeños tostados na chapa sob pepper jack derretido, maionese de limão-cravo e alface para refrescar.',notes:['Picante','Cítrico','Cremoso'],allerg:A_BUN,
   layers:['bunBottom','crema','lettuce','patty','jack','jalapeno','bunTop']},
  {id:'frango',cat:'burgers',name:'Frango Crispy',price:34.9,kcal:760,spec:'Sobrecoxa empanada · maionese de sriracha',tags:['hot'],
   desc:'Sobrecoxa marinada no leitelho por 12 horas, empanada duas vezes e frita na hora. Alface, picles e maionese de sriracha.',notes:['Crocante','Picante leve','Suculento'],allerg:A_BUN,
   layers:['bunBottom','crema','lettuce','chicken','pickles','bunTop']},
  {id:'cogumelo',cat:'burgers',name:'Cogumelo & Gruyère',price:41.9,kcal:820,spec:'Blend 180 g · gruyère · cogumelos na manteiga',tags:[],
   desc:'Cogumelos paris e shimeji salteados na manteiga com tomilho, gruyère gratinado e maionese de alho negro.',notes:['Terroso','Umami','Amanteigado'],allerg:A_BUN,
   layers:['bunBottom','sauce','patty','swiss','mush','bunTop']},
  {id:'horta',cat:'burgers',name:'Horta',price:34.9,kcal:620,spec:'Grão-de-bico e beterraba · vegetariano',badge:'Vegetariano',veg:true,tags:['veg'],
   desc:'Hambúrguer de grão-de-bico, beterraba e arroz integral selado na chapa, com abacate, tomate, rúcula e aioli de ervas.',notes:['Fresco','Leve','Herbáceo'],allerg:'Contém glúten, ovo e gergelim.',
   layers:['bunBottom','crema','tomato','veg','avocado','arugula','bunTop']},

  {id:'batata',cat:'sides',name:'Batata Rústica',price:18.9,kcal:420,spec:'Cortada à mão · frita duas vezes',tags:['veg','gf'],
   desc:'Batata cortada toda manhã, pré-cozida e frita de novo na hora. Flor de sal e uma porção de molho Brasa.',notes:['Crocante','Salgada'],allerg:'Sem glúten. Contém ovo (molho).',svg:()=>fries(false,11)},
  {id:'batatabrasa',cat:'sides',name:'Batata Brasa',price:29.9,kcal:780,spec:'Cheddar cremoso · bacon · cebolinha',badge:'Para dividir',tags:['gf','share'],
   desc:'Nossa batata coberta com cheddar cremoso, bacon picado e cebolinha. Serve bem duas pessoas.',notes:['Generosa','Cremosa'],allerg:'Sem glúten. Contém lactose.',svg:()=>fries(true,21)},
  {id:'batatadoce',cat:'sides',name:'Batata-Doce Rústica',price:19.9,kcal:390,spec:'Com casca · páprica defumada',tags:['veg','gf'],
   desc:'Batata-doce em palitos grossos com casca, páprica defumada e flor de sal. Acompanha maionese de alho assado.',notes:['Adocicada','Defumada'],allerg:'Sem glúten. Contém ovo (maionese).',svg:()=>fries(false,31,'gSweet',16)},
  {id:'mandioca',cat:'sides',name:'Mandioca Frita',price:21.9,kcal:450,spec:'Manteiga de garrafa · queijo coalho',tags:['veg','gf'],
   desc:'Mandioca cozida e frita até ficar crocante por fora e macia por dentro, com manteiga de garrafa e queijo coalho ralado.',notes:['Crocante','Brasileira'],allerg:'Sem glúten. Contém lactose.',svg:()=>fries(false,41,'gCassava',22)},
  {id:'aneis',cat:'sides',name:'Anéis de Cebola',price:22.9,kcal:510,spec:'Empanados na cerveja artesanal',tags:['veg'],
   desc:'Cebola doce em rodelas grossas, numa massa leve feita com pilsen artesanal paulistana. Acompanha maionese chipotle.',notes:['Crocante','Adocicado'],allerg:'Contém glúten e ovo.',svg:()=>rings(5)},
  {id:'nuggets',cat:'sides',name:'Nuggets da Casa',price:26.9,kcal:540,spec:'10 unidades · peito de frango empanado na hora',badge:'Para dividir',tags:['share'],
   desc:'Peito de frango cortado à mão e empanado na farinha panko. Escolha barbecue de rapadura ou mostarda e mel.',notes:['Crocante','Suculento'],allerg:'Contém glúten e ovo.',svg:()=>nuggets(8)},

  {id:'baunilha',cat:'drinks',name:'Milkshake de Baunilha',price:24.9,kcal:560,spec:'400 ml · sorvete artesanal',tags:['veg','gf'],
   desc:'Batido bem espesso com fava de baunilha de verdade, chantilly fresco e uma cereja no topo.',notes:['Cremoso','Clássico'],allerg:'Contém lactose.',svg:()=>shake('gVanilla',null)},
  {id:'docedeleite',cat:'drinks',name:'Shake de Doce de Leite',price:26.9,kcal:640,spec:'400 ml · doce de leite mineiro · flor de sal',badge:'Novo',tags:['veg','gf'],
   desc:'Doce de leite de Minas batido com sorvete e escorrido por dentro do copo, com uma pitada de flor de sal.',notes:['Doce e salgado','Intenso'],allerg:'Contém lactose.',svg:()=>shake('gDulce','#8A4A18',true)},
  {id:'chocolate',cat:'drinks',name:'Milkshake de Chocolate',price:25.9,kcal:620,spec:'400 ml · chocolate 70% cacau',tags:['veg','gf'],
   desc:'Sorvete de chocolate meio amargo batido com calda de chocolate 70%, chantilly e raspas de chocolate.',notes:['Chocolatudo','Cremoso'],allerg:'Contém lactose.',svg:()=>shake('gChoc','#2E1206',false)},
  {id:'suica',cat:'drinks',name:'Limonada Suíça',price:14.9,kcal:210,spec:'500 ml · limão tahiti · feita na hora',tags:['veg','gf'],
   desc:'Limão tahiti batido com casca, gelo e leite condensado. Peça sem açúcar se preferir.',notes:['Refrescante','Cítrica'],allerg:'Contém lactose.',svg:()=>suica()},
  {id:'mate',cat:'drinks',name:'Mate Gelado com Limão',price:11.9,kcal:120,spec:'500 ml · mate tostado · refil por R$ 5',tags:['veg','gf'],
   desc:'Chá mate tostado gelado, adoçado de leve e com limão espremido na hora, do jeito da praia.',notes:['Leve','Refrescante'],allerg:'Sem glúten e sem lactose.',svg:()=>iced('gMate','gLemon')},
  {id:'chope',cat:'drinks',name:'Chope Pilsen Artesanal',price:16.9,kcal:150,spec:'300 ml · cervejaria de SP · 4,8% teor alcoólico',tags:['veg'],
   desc:'Pilsen leve e bem gelada de uma cervejaria artesanal da Zona Oeste. Venda proibida para menores de 18 anos.',notes:['Gelada','Leve'],allerg:'Contém glúten.',svg:()=>beer(4)},

  {id:'brownie',cat:'desserts',name:'Brownie com Sorvete',price:24.9,kcal:690,spec:'Chocolate 70% · sorvete de creme',tags:['veg'],
   desc:'Brownie quente de chocolate meio amargo com casquinha crocante, bola de sorvete de creme e calda de chocolate.',notes:['Quente e gelado','Intenso'],allerg:'Contém glúten, lactose e ovo.',svg:()=>brownie()},
  {id:'churros',cat:'desserts',name:'Churros com Doce de Leite',price:22.9,kcal:580,spec:'4 unidades · açúcar e canela',badge:'Para dividir',tags:['veg','share'],
   desc:'Churros fritos na hora, passados no açúcar com canela, com potinho de doce de leite mineiro para mergulhar.',notes:['Crocante','Doce'],allerg:'Contém glúten, lactose e ovo.',svg:()=>churros(6)},
  {id:'pudim',cat:'desserts',name:'Pudim de Leite',price:16.9,kcal:410,spec:'Receita da vó · calda de caramelo',badge:'Clássico',tags:['veg','gf'],
   desc:'Pudim de leite condensado lisinho, sem furinhos, com calda de caramelo bem escura.',notes:['Cremoso','Caseiro'],allerg:'Sem glúten. Contém lactose e ovo.',svg:()=>pudim()}
];
const byId=Object.fromEntries(MENU.map(m=>[m.id,m]));
const COMBO=22.9,COMBO_SAVE=byId.batata.price+byId.suica.price-COMBO;
/* cart keys are "id" or "id|combo" */
/* ---------- Monte o seu: ingredientes (preço em R$, calorias em kcal) ---------- */
const B_BASE={n:'Brioche com gergelim',p:12,c:280};
const ING=[
  {k:'patty',n:'Carne 180 g',p:14,c:320,max:3,prot:1},
  {k:'veg',n:'Grão-de-bico',p:12,c:220,max:2,prot:1},
  {k:'cheese',n:'Cheddar',p:4,c:90,max:3},
  {k:'bacon',n:'Bacon',p:6,c:120,max:2},
  {k:'lettuce',n:'Alface',p:1,c:5,max:2},
  {k:'tomato',n:'Tomate',p:2,c:10,max:2},
  {k:'onion',n:'Cebola roxa',p:2,c:15,max:2},
  {k:'pickles',n:'Picles',p:2,c:5,max:2},
  {k:'jalapeno',n:'Jalapeño',p:3,c:5,max:2},
  {k:'mush',n:'Cogumelos',p:5,c:40,max:2},
  {k:'sauce',n:'Molho Brasa',p:0,c:60,max:1},
  {k:'bbq',n:'Barbecue',p:2,c:50,max:1}
];
const INGK=Object.fromEntries(ING.map(i=>[i.k,i]));
const B_PRESETS=[
  {n:'Clássico',q:{patty:1,cheese:1,lettuce:1,tomato:1,pickles:1,onion:1,sauce:1}},
  {n:'Duplo',q:{patty:2,cheese:2,onion:1,pickles:1,sauce:1}},
  {n:'Bacon',q:{patty:1,cheese:1,bacon:2,onion:1,bbq:1}},
  {n:'Picante',q:{patty:1,cheese:1,jalapeno:2,lettuce:1,sauce:1}},
  {n:'Vegetariano',q:{veg:1,cheese:1,lettuce:1,tomato:1,onion:1,sauce:1}}
];
const encQ=q=>ING.filter(i=>q[i.k]>0).map(i=>i.k+q[i.k]).join('.');
const decQ=str=>{const q={};for(const part of String(str).split('.')){const m=/^([a-z]+)([1-9])$/.exec(part);if(!m||!INGK[m[1]]||+m[2]>INGK[m[1]].max||q[m[1]])return null;q[m[1]]=+m[2]}return q};
const qProt=q=>ING.filter(i=>i.prot).reduce((a,i)=>a+(q[i.k]||0),0);
const qPrice=q=>B_BASE.p+ING.reduce((a,i)=>a+i.p*(q[i.k]||0),0);
const qKcal=q=>B_BASE.c+ING.reduce((a,i)=>a+i.c*(q[i.k]||0),0);
function qName(q){const p=q.patty||0,v=q.veg||0;if(!p&&!v)return 'Monte seu lanche';
  if(p>=3)return 'Brasa Monstro';if(!p&&v)return 'Horta da Casa';if(q.jalapeno)return 'Brasa Pegando Fogo';
  if(q.bacon)return p>1?'Duplo Bacon da Brasa':'Brasa com Bacon';if(q.mush)return 'Brasa da Floresta';if(p===2)return 'Duplo da Brasa';return 'Brasa da Chapa'}
const qDesc=q=>ING.filter(i=>q[i.k]).map(i=>(q[i.k]>1?q[i.k]+'x ':'')+i.n.toLowerCase()).join(', ');
function layersFor(q){const L=['bunBottom'];const rep=(k,n)=>{for(let i=0;i<(n||0);i++)L.push(k)};
  rep('sauce',q.sauce);rep('bbq',q.bbq);rep('lettuce',q.lettuce);rep('tomato',q.tomato);
  const prot=[...Array(q.patty||0).fill('patty'),...Array(q.veg||0).fill('veg')];let ch=q.cheese||0;
  prot.forEach(k=>{L.push(k);if(ch>0){L.push('cheese');ch--}});rep('cheese',ch);
  rep('bacon',q.bacon);rep('mush',q.mush);rep('onion',q.onion);rep('pickles',q.pickles);rep('jalapeno',q.jalapeno);L.push('bunTop');return L}
function customItem(key){const q=decQ(String(key).slice(7));if(!q||!qProt(q))return null;
  return {m:{id:'custom'},name:`${qName(q)} (montado: ${qDesc(q)})`,price:qPrice(q)}}
const item=key=>{if(String(key).startsWith('custom|'))return customItem(key);const [id,c]=String(key).split('|');const m=byId[id];if(!m||(c&&(c!=='combo'||m.cat!=='burgers')))return null;
  return c?{m,name:m.name+' + combo',price:m.price+COMBO}:{m,name:m.name,price:m.price}};
const norm=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const artCache={};
/* Desenhos entregues como imagem (<img>): o modo escuro forçado de alguns celulares
   (Samsung Internet, Chrome) repinta desenhos feitos em código, mas não mexe em imagens. */
const toImg=(svg,cls='')=>{const ids=[...new Set([...svg.matchAll(/url\(#([\w-]+)\)/g)].map(m=>m[1]))];
  const defs=ids.map(id=>{const el=document.getElementById(id);return el?el.outerHTML:''}).join('');
  const full=svg.replace(/^<svg /,'<svg xmlns="http://www.w3.org/2000/svg" ').replace(/(<svg[^>]*>)/,'$1<defs>'+defs+'</defs>');
  return `<img class="art ${cls}" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(full)}" alt="" decoding="async">`};
const art=m=>artCache[m.id]||(artCache[m.id]=toImg(m.layers?burgerSVG(m.layers,m.id.length*13+7,0,'',true).html:m.svg(),m.layers?'burger':'side'));
/* Converte os desenhos em imagem rasterizada (WebP/PNG), como uma foto:
   o modo escuro forçado do celular escurece desenhos vetoriais, mas não fotos. */
const rasterCache=new Map(),webpOK=(()=>{try{return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')}catch(e){return false}})();
function rasterize(img){const src=img.getAttribute('src');if(!src||!src.startsWith('data:image/svg'))return;
  if(rasterCache.has(src)){const r=rasterCache.get(src);if(typeof r==='string')img.src=r;else r.then(u=>{if(u)img.src=u});return}
  const job=new Promise(res=>{const im=new Image();im.decoding='async';im.onload=()=>{try{
      const w=640,h=Math.round(w*(im.naturalHeight||im.height)/(im.naturalWidth||im.width||1))||480,c=document.createElement('canvas');c.width=w;c.height=h;
      c.getContext('2d').drawImage(im,0,0,w,h);const u=c.toDataURL(webpOK?'image/webp':'image/png',.9);rasterCache.set(src,u);res(u)}catch(e){rasterCache.set(src,'');res('')}};
    im.onerror=()=>{rasterCache.set(src,'');res('')};im.src=src});
  rasterCache.set(src,job);job.then(u=>{if(u)img.src=u})}
const rasterizeIn=root=>{const run=()=>root.querySelectorAll('img.art').forEach(rasterize);('requestIdleCallback' in window)?requestIdleCallback(run,{timeout:800}):setTimeout(run,60)};
/* Foto real quando o item tem "foto"; se o arquivo faltar, volta para a ilustração */
const safeSrc=u=>/^(fotos\/[\w.-]+\.(jpe?g|png|webp|avif)|data:image\/(jpeg|png|webp|avif);base64,[A-Za-z0-9+\/=]+)$/i.test(u||'')?u:'';
const picHTML=m=>{const src=safeSrc(m.foto);if(!src)return art(m);
  return `<img class="photo" src="${src}" alt="Foto do ${m.name}" loading="lazy" decoding="async" width="1200" height="960" data-id="${m.id}">`};
/* Foto que não carregou volta para a ilustração (sem atributo onerror, que a CSP rígida bloquearia) */
document.addEventListener('error',e=>{const t=e.target;if(!(t instanceof HTMLImageElement)||!t.classList.contains('photo'))return;
  const m=byId[t.dataset.id],pic=t.closest('.pic');if(!m||!pic)return;pic.classList.remove('has-photo');t.outerHTML=art(m)},true);

/* ---------- Hero burger ---------- */
const heroLayers=['bunBottom','sauce','lettuce','tomato','patty','cheese','bacon','pickles','onion','bunTop'];
const hero=$('#heroBurger');
function stackHero(){const b=burgerSVG(heroLayers,42,0,reduce?'':'assemble');hero.style.aspectRatio=`328/${b.H}`;hero.innerHTML=b.html}
stackHero();
$('#restack').addEventListener('click',stackHero);
const stageInner=$('#stageInner');
if(finePointer&&!reduce){
  const heroEl=$('.hero');
  heroEl.addEventListener('pointermove',e=>{const r=heroEl.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    stageInner.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translate(${x*14}px,${y*10}px)`});
  heroEl.addEventListener('pointerleave',()=>stageInner.style.transform='');
}

/* ---------- Marquee ---------- */
const tk=['Moído todo dia','Brioche assado às 4h','Batata cortada à mão','Picles da casa','Sorvete artesanal','Chapa de ferro a 230 °C','Barbecue de rapadura'];
$('#ticker').innerHTML=[...tk,...tk].map(t=>`<span>${t}</span>`).join('');

/* ---------- Embers (canvas particles) ---------- */
function embers(cv){
  const ctx=cv.getContext('2d'),N=+cv.dataset.embers;let W,H,dpr,parts=[],running=false,raf;
  const size=()=>{dpr=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
  const spawn=(p,init)=>{p.x=Math.random()*W;p.y=init?Math.random()*H:H+10;p.vy=.35+Math.random()*1.1;p.vx=(Math.random()-.5)*.4;p.r=.8+Math.random()*2.2;p.life=0;p.max=200+Math.random()*320;p.hue=18+Math.random()*28;p.w=Math.random()*6.28;return p};
  size();for(let i=0;i<N;i++)parts.push(spawn({},true));
  const tick=()=>{ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
    for(const p of parts){p.life++;p.w+=.03;p.x+=p.vx+Math.sin(p.w)*.35;p.y-=p.vy;const a=Math.max(0,Math.sin(Math.PI*p.life/p.max));
      if(p.life>p.max||p.y<-10)spawn(p,false);
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,`hsla(${p.hue},100%,70%,${a})`);g.addColorStop(1,`hsla(${p.hue},100%,50%,0)`);
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*4,0,7);ctx.fill()}
    if(running)raf=requestAnimationFrame(tick)};
  addEventListener('resize',size);
  new IntersectionObserver(([e])=>{if(e.isIntersecting&&!running){running=true;tick()}else if(!e.isIntersecting){running=false;cancelAnimationFrame(raf)}}).observe(cv);
}
if(!reduce){const go=()=>$$('canvas.embers').forEach(embers);('requestIdleCallback' in window)?requestIdleCallback(go,{timeout:1500}):setTimeout(go,600)}

/* ---------- Cart state ---------- */
let cart={},mode='retirada',placed=null;
try{const s=JSON.parse(localStorage.getItem('bp-cart')||'{}');if(s&&typeof s==='object')for(const k in s){const q=Math.min(99,Math.floor(+s[k]||0));if(item(k)&&q>0)cart[k]=q}}catch(e){}
try{const m=localStorage.getItem('bp-mode');if(m==='entrega'||m==='retirada')mode=m}catch(e){}
const save=()=>{try{localStorage.setItem('bp-cart',JSON.stringify(cart));localStorage.setItem('bp-mode',mode)}catch(e){}};
const qtyTotal=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const subtotal=()=>Object.keys(cart).reduce((a,id)=>a+item(id).price*cart[id],0);
const inCart=id=>(cart[id]||0)+(cart[id+'|combo']||0);
const FEE=7.9,FREE_AT=120;

/* ---------- Menu render: lista por categoria + barra fixa ---------- */
const grid=$('#grid'),tabInd=$('#tabInd'),tabsEl=$('#tabs'),menuNav=$('#menuNav');let query='',activeCat='burgers';const comboOn=new Set();
const CATS=[['burgers','Burgers'],['sides','Porções'],['drinks','Bebidas'],['desserts','Sobremesas']];
const matches=m=>{if(!query)return true;return norm([m.name,m.desc,m.spec,m.notes.join(' '),m.badge||''].join(' ')).includes(query)};
const keyFor=id=>comboOn.has(id)?id+'|combo':id;
function rowHTML(m){const k=keyFor(m.id),q=cart[k]||0,price=item(k).price;
  if(!q)return `<button class="add" data-add="${m.id}"><svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Adicionar</span><b class="add-price">${money(price)}</b><span class="sr"> ${m.name}</span></button>`;
  return `<div class="stepper" role="group" aria-label="Quantidade de ${m.name}"><button data-step="-1" data-id="${m.id}" aria-label="Tirar um">${q===1?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg>':'−'}</button><span class="q" aria-live="polite">${q}</span><button data-step="1" data-id="${m.id}" aria-label="Pôr mais um">+</button></div><b class="row-total">${money(price*q)}</b>`}
function cardHTML(m,n){return `
    <article class="card${comboOn.has(m.id)?' expanded':''}" style="--n:${n%3}" data-card="${m.id}">
      <div class="pic${safeSrc(m.foto)?' has-photo':''}">${m.badge?`<span class="badge${m.veg?' veg':''}${m.hot?' hot':''}">${m.badge}</span>`:''}<span class="kcal">≈ ${m.kcal} kcal</span>${picHTML(m)}</div>
      <div class="body">
        <div class="title-row"><h3>${m.name}</h3><span class="price">${money(m.price)}</span></div>
        <p class="spec">${m.spec}</p>
        <p class="desc">${m.desc}</p>
        <details class="info"><summary>Sabor e alérgenos</summary><div class="notes" aria-label="Notas de sabor">${m.notes.map(t=>`<span>${t}</span>`).join('')}</div><p class="allerg">${m.allerg}</p></details>
        ${m.cat==='burgers'?`<button class="opts-toggle" type="button" aria-expanded="${comboOn.has(m.id)}">Transformar em combo</button><div class="opts"><label class="combo"><input type="checkbox" id="combo-${m.id}" data-combo="${m.id}"${comboOn.has(m.id)?' checked':''}><span>Fazer combo com <b>Batata Rústica + Limonada Suíça</b> por <b>+ ${money(COMBO)}</b> <em>(economize ${money(COMBO_SAVE)})</em></span></label></div>`:''}
        <div class="add-row" data-row="${m.id}">${rowHTML(m)}</div>
      </div>
    </article>`}
function renderMenu(animate){
  const pool=MENU.filter(matches),filtered=!!query;
  $$('.tab').forEach(t=>{const n=pool.filter(m=>m.cat===t.dataset.cat).length;t.querySelector('small').textContent=n;t.disabled=!n});
  $('#resultCount').textContent=filtered?`${pool.length} ${pool.length===1?'item encontrado':'itens encontrados'}${query?` para “${$('#menuSearch').value.trim()}”`:''}`:`${pool.length} itens no cardápio`;
  if(!pool.length){grid.innerHTML=`<div class="no-results"><b>Nada por aqui</b><p>Nenhum item combina com a busca.</p><button id="clearFilters">Limpar busca</button></div>`;
    $('#clearFilters').onclick=()=>{query='';$('#menuSearch').value='';renderMenu(true)};return}
  grid.innerHTML=CATS.map(([c,label])=>{const its=pool.filter(m=>m.cat===c);if(!its.length)return '';
    return `<section class="cat-group" id="cat-${c}" data-cat="${c}" aria-label="${label}"><h3 class="cat-title">${label} <small>${its.length}</small></h3><div class="grid">${its.map(cardHTML).join('')}</div></section>`}).join('');
  if(animate&&!reduce)$$('#grid .card').forEach((c,i)=>{if(c.getBoundingClientRect().top<innerHeight){c.style.setProperty('--n',i%6);c.classList.add('enter')}});
  watchCards();spyMenu(true);rasterizeIn(grid);
}
function updateRows(){const f=document.activeElement,row=f&&f.closest&&f.closest('[data-row]'),fid=row&&row.dataset.row,fstep=f&&f.dataset&&f.dataset.step;
  $$('[data-row]').forEach(r=>{const m=byId[r.dataset.row];if(m)r.innerHTML=rowHTML(m)});
  if(fid){const r=$(`[data-row="${fid}"]`);const t=r&&(r.querySelector(`[data-step="${fstep||1}"]`)||r.querySelector('[data-step="1"]')||r.querySelector('[data-add]'));t&&t.focus({preventScroll:true})}}
function moveInd(){const t=$('.tab[aria-current="true"]');if(!t)return;tabInd.style.width=t.offsetWidth+'px';tabInd.style.transform=`translateX(${t.offsetLeft}px)`}
function setActive(cat,scrollTab){if(cat===activeCat&&!scrollTab)return;activeCat=cat;
  $$('.tab').forEach(x=>x.setAttribute('aria-current',x.dataset.cat===cat));moveInd();
  const t=$(`.tab[data-cat="${cat}"]`);if(t&&tabsEl.scrollWidth>tabsEl.clientWidth)tabsEl.scrollTo({left:t.offsetLeft-16,behavior:reduce?'auto':'smooth'})}
const navOffset=()=>(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr'))||68)+menuNav.offsetHeight+8;
let spyLockUntil=0;
function spyMenu(force){const groups=$$('.cat-group');if(!groups.length)return;const off=navOffset();
  const r=grid.getBoundingClientRect();menuNav.classList.toggle('stuck',r.top<off&&r.bottom>off);
  if(!force&&Date.now()<spyLockUntil)return;
  let cur=groups[0].dataset.cat;for(const g of groups){if(g.getBoundingClientRect().top<=off+40)cur=g.dataset.cat;else break}
  if(force||cur!==activeCat)setActive(cur,true)}
$$('.tab').forEach(t=>t.addEventListener('click',()=>{const g=$('#cat-'+t.dataset.cat);if(!g)return;
  setActive(t.dataset.cat,true);if(!reduce){spyLockUntil=Infinity;const release=()=>{spyLockUntil=Date.now()+150;removeEventListener('scrollend',release)};addEventListener('scrollend',release);setTimeout(release,1600)}scrollTo({top:g.getBoundingClientRect().top+scrollY-navOffset()+4,behavior:reduce?'auto':'smooth'})}));
let cardIO=null;
function watchCards(){if(reduce||!('IntersectionObserver' in window))return;cardIO&&cardIO.disconnect();
  cardIO=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('enter');cardIO.unobserve(en.target)}}),{rootMargin:'0px 0px -6% 0px'});
  $$('#grid .card').forEach(c=>{if(c.getBoundingClientRect().top>innerHeight)cardIO.observe(c)})}
renderMenu(false);
moveInd();addEventListener('resize',moveInd);document.fonts&&document.fonts.ready.then(moveInd);
let qt;$('#menuSearch').addEventListener('input',e=>{clearTimeout(qt);qt=setTimeout(()=>{query=norm(e.target.value.trim());renderMenu(!reduce)},180)});
grid.addEventListener('change',e=>{const c=e.target.closest('[data-combo]');if(!c)return;const id=c.dataset.combo;c.checked?comboOn.add(id):comboOn.delete(id);
  const r=$(`[data-row="${id}"]`);if(r)r.innerHTML=rowHTML(byId[id])});
grid.addEventListener('click',e=>{const t=e.target.closest('.opts-toggle');if(!t)return;const c=t.closest('.card');const on=c.classList.toggle('expanded');t.setAttribute('aria-expanded',on)});

/* 3D tilt on cards */
if(finePointer&&!reduce){
  grid.addEventListener('pointermove',e=>{const c=e.target.closest('.card');if(!c)return;const r=c.getBoundingClientRect();
    c.classList.add('tilting');c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');c.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*8+'deg')});
  grid.addEventListener('pointerout',e=>{const c=e.target.closest('.card');if(c&&!c.contains(e.relatedTarget)){c.classList.remove('tilting');c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});
}

/* Add to cart + flying item */
const cartBtn=$('#openCart'),countEl=$('#count');
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}};
grid.addEventListener('click',e=>{
  const st=e.target.closest('[data-step]');
  if(st){const id=st.dataset.id,k=keyFor(id);if(!item(k))return;const q=(cart[k]||0)+(+st.dataset.step);
    if(q<=0)delete cart[k];else cart[k]=Math.min(99,q);placed=null;buzz();sync(true);
    const r=$(`[data-row="${id}"] .q`);if(r&&!reduce){r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop')}return}
  const b=e.target.closest('[data-add]');if(!b)return;
  const id=b.dataset.add,key=keyFor(id);if(!item(key))return;cart[key]=Math.min(99,(cart[key]||0)+1);placed=null;buzz();
  const land=()=>{sync(true);cartBtn.classList.remove('shake');void cartBtn.offsetWidth;cartBtn.classList.add('shake')};
  const pic=b.closest('.card').querySelector('.pic');updateRows();
  if(reduce||!pic||!pic.animate){land();toast(`<i>+1</i> ${item(key).name}`);return}
  const a=pic.getBoundingClientRect(),z=cartBtn.getBoundingClientRect();
  const fl=document.createElement('div');fl.className='flyer';fl.innerHTML=art(byId[id]);fl.querySelectorAll('img.art').forEach(rasterize);document.body.appendChild(fl);
  const sx=a.left+a.width/2-45,sy=a.top+a.height/2-45,ex=z.left+z.width/2-45,ey=z.top+z.height/2-45;
  fl.animate([{transform:`translate(${sx}px,${sy}px) scale(1.2)`,opacity:1},{transform:`translate(${(sx+ex)/2}px,${Math.min(sy,ey)-120}px) scale(.8) rotate(-20deg)`,opacity:1,offset:.5},{transform:`translate(${ex}px,${ey}px) scale(.2) rotate(-40deg)`,opacity:.3}],{duration:850,easing:'cubic-bezier(.5,0,.3,1)'}).onfinish=()=>{fl.remove();land()};
  toast(`<i>+1</i> ${item(key).name}`);
});

/* ---------- Monte o seu: lógica ---------- */
(()=>{const stage=$('#bBurger'),ingsEl=$('#bIngs'),presetsEl=$('#bPresets');let bq={},prevLayers=[];
  const icon=k=>{const L=LAYERS[k],R=rng(7),y=L.h+20;return `<svg viewBox="50 ${y-L.h-12} 200 ${L.h+26}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${L.d(y,R)}</svg>`};
  ingsEl.innerHTML=ING.map(i=>`<div class="ing" data-k="${i.k}"><button class="ing-add" type="button" data-ing="${i.k}"><span class="sr">Pôr </span>${icon(i.k)}<span class="ing-n">${i.n}</span><span class="ing-p">${i.p?'+ '+money(i.p):'grátis'}</span></button><button class="ing-rm" type="button" data-ing-rm="${i.k}" aria-label="Tirar ${i.n}">−</button><span class="ing-q" aria-hidden="true"></span></div>`).join('');
  presetsEl.innerHTML=B_PRESETS.map((pr,i)=>`<button class="b-pre" type="button" data-pre="${i}">${pr.n}</button>`).join('');
  let shownPrice=qPrice({}),shownKcal=qKcal({}),numRaf=0;
  function animateNums(){cancelAnimationFrame(numRaf);const tp=qPrice(bq),tk=qKcal(bq),fp=shownPrice,fk=shownKcal,t0=performance.now();
    const step=t=>{const k=reduce?1:Math.min(1,(t-t0)/450),e=1-Math.pow(1-k,3);shownPrice=fp+(tp-fp)*e;shownKcal=fk+(tk-fk)*e;
      $('#bPrice').textContent=money(shownPrice);$('#bKcal').textContent=Math.round(shownKcal)+' kcal';if(k<1)numRaf=requestAnimationFrame(step)};numRaf=requestAnimationFrame(step)}
  function render(){
    const layers=layersFor(bq);stage.innerHTML=burgerSVG(layers,99).html;
    let d=0;while(d<layers.length&&d<prevLayers.length&&layers[d]===prevLayers[d])d++;
    if(!reduce&&prevLayers.length&&layers.length>prevLayers.length){const g=stage.querySelectorAll('.layer')[d];g&&g.classList.add('drop-new')}
    prevLayers=layers;
    $$('#bIngs .ing').forEach(el=>{const n=bq[el.dataset.k]||0,i=INGK[el.dataset.k];el.classList.toggle('on',n>0);el.classList.toggle('full',n>=i.max);el.querySelector('.ing-q').textContent=n||''});
    const enc=encQ(bq);$$('.b-pre').forEach((b,i)=>b.setAttribute('aria-pressed',encQ(B_PRESETS[i].q)===enc));
    const name=qName(bq),nameEl=$('#bName');if(nameEl.textContent!==name){nameEl.textContent=name;if(!reduce){nameEl.classList.remove('swap');void nameEl.offsetWidth;nameEl.classList.add('swap')}}
    $('#bList').innerHTML=`<li>${B_BASE.n}</li>`+ING.filter(i=>bq[i.k]).map(i=>`<li>${bq[i.k]>1?`<b>${bq[i.k]}x</b> `:''}${i.n}</li>`).join('');
    const ok=qProt(bq)>0;$('#bAdd').disabled=!ok;$('#bAdd').textContent=ok?`Adicionar · ${money(qPrice(bq))}`:'Adicionar ao pedido';
    $('#bHint').hidden=Object.keys(bq).length>0;$('#bMsg').textContent=ok||!Object.keys(bq).length?'':'Escolha uma carne ou o grão-de-bico para fechar o lanche.';
    animateNums();
  }
  ingsEl.addEventListener('click',e=>{const a=e.target.closest('[data-ing]'),r=e.target.closest('[data-ing-rm]');
    if(a){const k=a.dataset.ing,i=INGK[k];if((bq[k]||0)>=i.max){toast(`Máximo de ${i.max} ${i.n.toLowerCase()}`);return}bq[k]=(bq[k]||0)+1;buzz()}
    else if(r){const k=r.dataset.ingRm;if(bq[k]>1)bq[k]--;else delete bq[k]}else return;render()});
  presetsEl.addEventListener('click',e=>{const b=e.target.closest('[data-pre]');if(!b)return;bq={...B_PRESETS[+b.dataset.pre].q};prevLayers=['bunBottom','bunTop'];render()});
  $('#bClear').addEventListener('click',()=>{bq={};prevLayers=[];render()});
  $('#bAdd').addEventListener('click',()=>{if(!qProt(bq))return;const key='custom|'+encQ(bq);if(!item(key))return;
    cart[key]=Math.min(99,(cart[key]||0)+1);placed=null;buzz();
    const land=()=>{sync(true);cartBtn.classList.remove('shake');void cartBtn.offsetWidth;cartBtn.classList.add('shake')};
    toast(`<i>+1</i> ${qName(bq)}`);
    const a=stage.getBoundingClientRect(),z=cartBtn.getBoundingClientRect();
    if(reduce||!document.body.animate){land();return}
    const fl=document.createElement('div');fl.className='flyer';fl.innerHTML=burgerSVG(layersFor(bq),99).html;document.body.appendChild(fl);
    const sx=a.left+a.width/2-45,sy=a.top+a.height/2-45,ex=z.left+z.width/2-45,ey=z.top+z.height/2-45;
    fl.animate([{transform:`translate(${sx}px,${sy}px) scale(1.4)`},{transform:`translate(${(sx+ex)/2}px,${Math.min(sy,ey)-120}px) scale(.8) rotate(-20deg)`,offset:.5},{transform:`translate(${ex}px,${ey}px) scale(.2) rotate(-40deg)`,opacity:.3}],{duration:850,easing:'cubic-bezier(.5,0,.3,1)'}).onfinish=()=>{fl.remove();land()}});
  render();
})();

/* ---------- Comanda + pedido pelo WhatsApp ---------- */
/* Troque pelo número de WhatsApp da loja: código do país + DDD + número, só dígitos. */
const WHATSAPP=LOJA.whatsapp;
const ticket=$('#ticket'),waBtn=$('#waBtn'),seg=$('#seg'),free=$('#free'),checkout=$('#checkout'),coMsg=$('#checkoutMsg');
const cName=$('#cName'),cAddr=$('#cAddr'),cPay=$('#cPay'),cNote=$('#cNote'),addrField=$('#addrField');
const ticketNo='BP-'+String(400+Math.floor(Math.random()*500)).padStart(4,'0');
const emptyArt=toImg(burgerSVG(['bunBottom','bunTop'],3).html);
const clean=(v,max)=>String(v||'').replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
try{const d=JSON.parse(localStorage.getItem('bp-checkout')||'{}');if(d&&typeof d==='object'){cName.value=clean(d.n,60);cAddr.value=clean(d.a,160);if(['Pix','Cartão (na entrega ou retirada)','Dinheiro'].includes(d.p))cPay.value=d.p}}catch(e){}
const saveCheckout=()=>{try{localStorage.setItem('bp-checkout',JSON.stringify({n:clean(cName.value,60),a:clean(cAddr.value,160),p:cPay.value}))}catch(e){}};
const fees=()=>{const sub=subtotal(),fee=mode==='entrega'?(sub>=FREE_AT?0:FEE):0;return {sub,fee,total:sub+fee}};
function orderText(){
  const {sub,fee,total}=fees();
  const L=[`*Novo pedido · Brasa & Pão*`,`Comanda ${ticketNo}`,``,`*Tipo:* ${mode==='entrega'?'Entrega':'Retirada no balcão'}`,`*Nome:* ${clean(cName.value,60)}`];
  if(mode==='entrega')L.push(`*Endereço:* ${clean(cAddr.value,160)}`);
  L.push(``,`*Itens*`);
  Object.keys(cart).forEach(id=>{const m=item(id);L.push(`${cart[id]}x ${m.name} · ${money(m.price*cart[id])}`)});
  L.push(``,`Subtotal: ${money(sub)}`);if(mode==='entrega')L.push(`Entrega: ${fee?money(fee):'Grátis'}`);
  L.push(`*Total: ${money(total)}*`,`*Pagamento:* ${cPay.value}`);
  const note=clean(cNote.value,200);if(note)L.push(`*Observações:* ${note}`);
  return L.join('\n');
}
function renderTicket(){
  const time=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  seg.dataset.mode=mode;$$('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
  addrField.hidden=mode!=='entrega';
  if(placed){free.hidden=true;checkout.hidden=true;waBtn.hidden=true;
    ticket.innerHTML=`<div class="done"><svg viewBox="0 0 80 80" fill="none" stroke="var(--herb)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 21-23"/></svg><b>Quase lá!</b><p>Abrimos o WhatsApp com o pedido ${placed.no} já escrito. Envie a mensagem para a loja confirmar o pedido e o tempo de ${placed.mode==='entrega'?'entrega':'retirada'}.</p><p class="demo">Total ${money(placed.total)} · O pagamento é combinado na conversa.</p><div class="done-actions"><a class="btn btn-wa" href="${placed.url}" target="_blank" rel="noopener noreferrer">Abrir o WhatsApp de novo</a><button class="link-btn" id="copyOrder">Copiar mensagem do pedido</button><button class="link-btn" id="newOrder">Fazer um novo pedido</button></div></div>`;
    $('#copyOrder').onclick=e=>{const b=e.currentTarget;const ok=()=>b.textContent='Mensagem copiada';try{navigator.clipboard.writeText(placed.text).then(ok,()=>{b.textContent='Não foi possível copiar'})}catch(err){b.textContent='Não foi possível copiar'}};
    $('#newOrder').onclick=()=>{placed=null;sync(true)};return}
  const ids=Object.keys(cart),{sub,fee,total}=fees();
  const head=`<div class="t-head"><b>Brasa &amp; Pão</b><div>Comanda ${ticketNo} · ${mode==='entrega'?'Entrega':'Retirada'} · ${time}</div></div>`;
  if(mode==='entrega'&&ids.length){free.hidden=false;const left=FREE_AT-sub;free.innerHTML=(left>0?`Faltam <b>${money(left)}</b> para a entrega grátis`:`<b>Entrega grátis liberada!</b>`)+`<div class="bar"><i style="width:${Math.min(100,sub/FREE_AT*100).toFixed(1)}%"></i></div>`}else free.hidden=true;
  checkout.hidden=!ids.length;waBtn.hidden=false;waBtn.classList.toggle('disabled',!ids.length);waBtn.setAttribute('aria-disabled',!ids.length);
  if(!ids.length){ticket.innerHTML=head+`<div class="empty">${emptyArt}<p>Sua comanda está vazia. Adicione um burger do cardápio para começar.</p></div>`;return}
  const lines=ids.map((id,k)=>{const m=item(id),q=cart[id];return `<div class="line" style="animation-delay:${k*40}ms"><span class="nm">${m.name}</span><span class="amt">${money(m.price*q)}</span>
    <div class="qty"><button data-dec="${id}" aria-label="Remover um ${m.name}">−</button><span>${q}</span><button data-inc="${id}" aria-label="Adicionar um ${m.name}">+</button><span class="unit">× ${money(m.price)}</span><button class="rm" data-rm="${id}">Remover</button></div></div>`}).join('');
  ticket.innerHTML=head+lines+`<div class="sum"><div><span>Subtotal</span><span>${money(sub)}</span></div><div><span>${mode==='entrega'?'Taxa de entrega':'Retirada no balcão'}</span><span>${fee?money(fee):'Grátis'}</span></div><div class="tot"><span>Total</span><span>${money(total)}</span></div></div>`;
}
ticket.addEventListener('click',e=>{
  const t=e.target.closest('button[data-inc],button[data-dec],button[data-rm]');if(!t)return;
  const k=t.dataset.inc||t.dataset.dec||t.dataset.rm;if(!item(k)||!(k in cart))return;
  if(t.dataset.inc)cart[k]=Math.min(99,cart[k]+1);
  if(t.dataset.dec){cart[k]--;if(cart[k]<=0)delete cart[k]}
  if(t.dataset.rm)delete cart[k];
  sync(true);
});
seg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;mode=b.dataset.mode;placed=null;coMsg.textContent='';sync(false)});
[cName,cAddr,cPay].forEach(el=>el.addEventListener('change',saveCheckout));
[cName,cAddr].forEach(el=>el.addEventListener('input',()=>{el.removeAttribute('aria-invalid');coMsg.textContent=''}));
waBtn.addEventListener('click',e=>{
  if(!Object.keys(cart).length){e.preventDefault();return}
  const errs=[];if(clean(cName.value,60).length<2)errs.push(cName);if(mode==='entrega'&&clean(cAddr.value,160).length<8)errs.push(cAddr);
  [cName,cAddr].forEach(el=>el.setAttribute('aria-invalid',errs.includes(el)));
  if(errs.length){e.preventDefault();coMsg.textContent=errs[0]===cName?'Digite seu nome para a loja saber de quem é o pedido.':'Digite o endereço completo: rua, número e bairro.';errs[0].focus();
    checkout.classList.remove('shake-x');void checkout.offsetWidth;checkout.classList.add('shake-x');return}
  coMsg.textContent='';saveCheckout();
  const text=orderText(),url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  waBtn.href=url;
  placed={no:ticketNo,total:fees().total,mode,url,text};
  setTimeout(()=>{cart={};sync(false)},50);
});
function sync(bump){
  save();countEl.textContent=qtyTotal();
  if(bump&&!reduce){countEl.classList.remove('bump');void countEl.offsetWidth;countEl.classList.add('bump')}
  updateRows();renderTicket();updateMbar(bump);
}
let lastTotal=0;
function updateMbar(bump){const mb=$('#mbar');if(!mb)return;const q=qtyTotal(),open=$('#drawer')?.classList.contains('open'),total=fees().total;
  mb.hidden=!q||open;document.body.classList.toggle('has-mbar',!mb.hidden);$('#mbarCount').textContent=q;$('#mbarTotal').textContent=money(total);
  if(bump&&total!==lastTotal&&!reduce){mb.classList.remove('bump');void mb.offsetWidth;mb.classList.add('bump')}lastTotal=total}
sync(false);

/* Drawer */
const drawer=$('#drawer'),scrim=$('#scrim');let lastFocus=null;drawer.inert=true;
const behind=()=>['#hdr','main','#contato','#mbar'].map(q=>$(q)).filter(Boolean);
const openCart=()=>{lastFocus=document.activeElement;renderTicket();rasterizeIn(ticket);drawer.inert=false;behind().forEach(el=>el.inert=true);drawer.classList.add('open');updateMbar();scrim.classList.add('show');$('#closeCart').focus()};
const closeCart=()=>{drawer.inert=true;behind().forEach(el=>el.inert=false);drawer.classList.remove('open');updateMbar();scrim.classList.remove('show');lastFocus&&lastFocus.focus()};
cartBtn.addEventListener('click',openCart);$('#mbar').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);scrim.addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open'))closeCart()});
$$('[data-cta="order"]').forEach(a=>a.addEventListener('click',()=>{if(qtyTotal()>0)setTimeout(openCart,0)}));

/* Header + nav */
const hdr=$('#hdr'),nav=$('#nav'),mt=$('#menuToggle');
mt.addEventListener('click',()=>{const o=nav.classList.toggle('open');mt.setAttribute('aria-expanded',o)});
nav.addEventListener('click',e=>{if(e.target.tagName==='A'){nav.classList.remove('open');mt.setAttribute('aria-expanded','false')}});
const secs=['inicio','cardapio','sobre','contato'].map(id=>document.getElementById(id));
$('#toTop').addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

/* Toast */
const toastEl=$('#toast');let tt;
function toast(html){toastEl.innerHTML=html;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),1900)}

/* ---------- Steps rail fill ---------- */
const steps=$('#steps');
function onScrollSteps(){if(reduce)return;const r=steps.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight*.75-r.top)/r.height));steps.style.setProperty('--fill',p.toFixed(3))}

/* ---------- Scroll handler (header, nav active, scenes) ---------- */
let ticking=false;
function onScroll(){
  hdr.classList.toggle('scrolled',scrollY>10);
  const mid=innerHeight*.35;let act=secs[0];secs.forEach(s=>{if(s.getBoundingClientRect().top<mid)act=s});
  $$('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+act.id));
  onScrollSteps();spyMenu();ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* ---------- Reviews carousel ---------- */
const star=(f,i)=>`<svg viewBox="0 0 24 24" style="--s:${i}" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="${f?'var(--gold)':'var(--line)'}"/></svg>`;
const stars=n=>`<div class="stars" role="img" aria-label="${n} de 5 estrelas">${[1,2,3,4,5].map(i=>star(i<=n,i)).join('')}</div>`;
/* AVALIAÇÕES: coloque aqui só avaliações reais de clientes (Google, iFood, Instagram), com autorização.
   Formato: {n:5, q:'texto da avaliação', who:'Nome S.', what:'O que pediu', item:'id do item do cardápio', c:'#CF4E1A'}
   Com a lista vazia, a seção de avaliações não aparece no site. */
const REV=[];
if(!REV.length){$('#avaliacoes')?.remove()}else{
const track=$('#track'),dots=$('#dots'),car=$('#carousel');const DUR=6500;
track.innerHTML=REV.map((r,i)=>`<div class="slide" role="group" aria-roledescription="slide" aria-label="${i+1} de ${REV.length}"><div class="slide-main"><span class="q" aria-hidden="true">“</span>${stars(r.n)}<blockquote>${r.q}</blockquote><div class="who"><span class="avatar" style="background:${r.c}">${r.who[0]}</span><div><b>${r.who}</b><span>${r.what}</span></div></div></div><div class="slide-side">${art(byId[r.item])}<span>Pediu: ${byId[r.item].name}</span></div></div>`).join('');
dots.innerHTML=REV.map((_,i)=>`<button class="dot" style="--dur:${DUR}ms" aria-label="Mostrar avaliação ${i+1}"><i></i></button>`).join('');
const slides=[...track.children],dotEls=[...dots.children];let idx=0,timer=null;
function go(i){idx=(i+REV.length)%REV.length;track.style.transform=`translateX(-${idx*100}%)`;
  slides.forEach((s,k)=>{s.classList.toggle('active',k===idx);s.setAttribute('aria-hidden',k!==idx)});
  dotEls.forEach((d,k)=>{d.classList.remove('on');d.classList.toggle('past',k<idx);d.setAttribute('aria-current',k===idx)});
  void dots.offsetWidth;if(!reduce)dotEls[idx].classList.add('on');else dotEls[idx].classList.add('past')}
function restart(){clearTimeout(timer);if(!reduce)schedule()}
let remaining=DUR,startedAt=0,paused=false;
function schedule(){remaining=DUR;startedAt=Date.now();timer=setTimeout(()=>{go(idx+1);schedule()},remaining)}
function pause(){if(paused||reduce)return;paused=true;car.classList.add('paused');clearTimeout(timer);remaining-=Date.now()-startedAt}
function resume(){if(!paused||reduce)return;paused=false;car.classList.remove('paused');startedAt=Date.now();timer=setTimeout(()=>{go(idx+1);schedule()},Math.max(200,remaining))}
go(0);restart();
$('#prev').onclick=()=>{go(idx-1);paused=false;car.classList.remove('paused');restart()};
$('#next').onclick=()=>{go(idx+1);paused=false;car.classList.remove('paused');restart()};
dotEls.forEach((d,k)=>d.onclick=()=>{go(k);paused=false;car.classList.remove('paused');restart()});
car.addEventListener('mouseenter',pause);car.addEventListener('mouseleave',resume);
let sx=null;track.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
track.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){go(idx+(dx<0?1:-1));restart()}sx=null});
}

/* ---------- Hours: highlight today + open now ---------- */
(()=>{const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
  const d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday),m=(+parts.hour)*60+(+parts.minute);
  $$('#hours li').forEach(li=>li.classList.toggle('today',li.dataset.days.split(',').includes(String(d))));
  const H={0:[720,1320],2:[690,1380],3:[690,1380],4:[690,1380],5:[690,1440],6:[690,1440]}[d];
  const open=H&&m>=H[0]&&m<H[1];const el=$('#openNow');el.classList.toggle('closed',!open);el.querySelector('span').textContent=open?'Aberto agora':'Fechado agora';})();

/* ---------- Dados da loja no rodapé ---------- */
$$('[data-loja]').forEach(el=>{const v=LOJA[el.dataset.loja];if(v)el.textContent=v});
$$('[data-copy-from]').forEach(b=>b.dataset.copy=LOJA[b.dataset.copyFrom]||'');
$$('[data-social]').forEach(a=>{const k=a.dataset.social,v=k==='whatsapp'?(LOJA.whatsapp?'https://wa.me/'+LOJA.whatsapp:''):LOJA[k];
  if(/^https:\/\//.test(v||''))a.href=v;else a.remove()});

/* ---------- Copy buttons ---------- */
$$('.copy-btn').forEach(b=>b.addEventListener('click',()=>{
  const v=b.dataset.copy,ok=()=>{b.textContent='Copiado';setTimeout(()=>b.textContent='Copiar',1400)};
  const sel=()=>{const r=document.createRange();r.selectNodeContents(b.parentNode.firstChild);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selecionado'};
  try{navigator.clipboard.writeText(v).then(ok,sel)}catch(e){sel()}
}));

/* ---------- Reveal on scroll (visible at rest; animates only once it enters) ---------- */
if('IntersectionObserver' in window && !reduce){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const t=en.target;io.unobserve(t);
    t.classList.add('in')}),{threshold:0});
  $$('.reveal,.reveal-l').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight)io.observe(el)});
}
})();
