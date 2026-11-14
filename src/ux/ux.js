/* SENDA · capa de experiencia: navegación por etapas, sub-pestañas, inicio y textos bilingües */
(function(){
"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LANG=()=>document.documentElement.lang==='en'?'en':'es';
const ICON={
 home:'<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
 globe:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.6 2.5 13.4 0 16M12 4c-2.5 2.6-2.5 13.4 0 16"/>',
 land:'<path d="M12 3v9M8 8l4 4 4-4M5 20l3-6h8l3 6M4 20h16"/>',
 walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M9 12l2-4 4 1 2 4M11 8l-2 5"/>',
 live:'<circle cx="12" cy="12" r="2"/><path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>'};
const GROUPS=[
 {id:'inicio',es:'Inicio',en:'Home',icon:'home',pages:['inicio']},
 {id:'sitio',es:'Sitio',en:'Site',icon:'globe',pages:['candidatos','mapa','ciencia','riesgos'],sub:{candidatos:['Candidatos','Candidates'],mapa:['Mapa 3D','3D map'],ciencia:['Ciencia','Science'],riesgos:['Riesgos','Risks']}},
 {id:'aterrizaje',es:'Aterrizaje',en:'Landing',icon:'land',pages:['aterrizaje','modulo'],sub:{aterrizaje:['Secuencia','Sequence'],modulo:['Módulo 3D','3D module']}},
 {id:'caminata',es:'Caminata',en:'Walk',icon:'walk',pages:['eva']},
 {id:'vivo',es:'En vivo',en:'Live',icon:'live',pages:['consola']}];
const groupOf=p=>GROUPS.find(g=>g.pages.includes(p))||GROUPS[0];
const cur=()=>{const h=location.hash.slice(1);return GROUPS.some(g=>g.pages.includes(h))?h:'inicio'};

// --- barra de navegación
const nav=document.createElement('nav');nav.className='ux-nav';nav.setAttribute('aria-label','Etapas');
nav.innerHTML=`<a class="ux-brand" href="#inicio" aria-label="Senda · Tesla Stars One">${window.TSO?TSO.icon('dark',34):''}<span>Senda</span></a>
 <div class="ux-tabs" role="tablist">${GROUPS.map(g=>`<a href="#${g.pages[0]}" data-g="${g.id}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[g.icon]}</svg><span></span></a>`).join('')}</div>
 <div class="ux-right"><span class="ux-chip" id="uxChip"></span></div>`;
document.body.prepend(nav);
const lang=$('.brandbar .lang');if(lang)$('.ux-right').appendChild(lang);
// --- sub-pestañas
const w=$('.w'),sub=document.createElement('div');sub.className='ux-sub';sub.id='uxSub';w.insertBefore(sub,w.firstChild);
// --- textos bilingües del shell
function i18n(){const l=LANG();$$('[data-es]').forEach(e=>{e.innerHTML=e.dataset[l]});
  $$('.ux-tabs a').forEach(a=>{const g=GROUPS.find(x=>x.id===a.dataset.g);a.querySelector('span').textContent=g[l]});render()}
// --- reloj compacto
function msd(ms){return (ms/86400000+2440587.5+69.184/86400-2405522.0028779)/1.0274912517}
function live(){const m=msd(Date.now()),sol=Math.floor(m+137.389/360-49269),l=LANG(),lmst=((m%1)*24+191.4/15)%24,hh=String(Math.floor(lmst)).padStart(2,'0')+':'+String(Math.floor(lmst%1*60)).padStart(2,'0');
  const chip=$('#uxChip');if(chip)chip.innerHTML=`<i></i>${l==='en'?'Sol':'Sol'} ${sol}`;
  const lb=$('#uxLive');if(lb)lb.innerHTML=l==='en'
    ?`<span><i></i>Live</span><span>Artemis Base <b>${hh}</b></span><span>Curiosity sol <b>${sol}</b></span><span>Space weather <b>quiet</b></span>`
    :`<span><i></i>En vivo</span><span>Base Ártemis <b>${hh}</b></span><span>Sol de Curiosity <b>${sol}</b></span><span>Clima espacial <b>tranquilo</b></span>`}
// --- recorrido
function render(){const p=cur(),g=groupOf(p),l=LANG();document.body.dataset.uxpg=p;
  $$('.ux-tabs a').forEach(a=>{const on=a.dataset.g===g.id;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(g.sub){sub.hidden=false;sub.innerHTML=`<span class="ux-sub-t">${g[l]}</span><div class="ux-seg">${g.pages.map(x=>`<a href="#${x}" class="${x===p?'on':''}">${g.sub[x][l==='en'?1:0]}</a>`).join('')}</div>`}
  else{sub.hidden=true;sub.innerHTML=''}
  // el globo vive donde la página tenga un hueco para él
  const wrap=$('#globeWrap'),page=$(`div[data-pg="${p}"]`),slot=page&&page.querySelector('[data-globe-slot]');if(wrap&&slot&&wrap.parentElement!==slot)slot.appendChild(wrap);
  if(page){page.classList.remove('ux-in');void page.offsetWidth;page.classList.add('ux-in')}}
window.addEventListener('hashchange',render);
new MutationObserver(i18n).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
i18n();live();setInterval(live,15000);
})();
