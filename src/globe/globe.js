/* Globo 3D de Marte con los sitios candidatos — TESLA STARS ONE · Senda
   Textura: mosaico Viking MDIM2.1 (NASA/JPL/USGS, dominio público), proyección equirectangular centrada en 0°. */
(function(){
"use strict";
const box=document.getElementById('globe');if(!box||typeof THREE==='undefined')return;
const R=10,D2R=Math.PI/180;
const SITES=[
  {k:'a',lat:40.1,lon:191.4,col:0x6dffb0,css:'#6dffb0',ell:true},
  {k:'g',lat:-14.5,lon:175.4,col:0xff4d3a,css:'#ff4d3a'},
  {k:'m',lat:-2,lon:354.5,col:0xffc247,css:'#ffc247'},
  {k:'c',lat:-4.826,lon:137.389,col:0xEEF1F7,css:'#EEF1F7',name:['Curiosity · Gale','Curiosity · Gale'],
   info:['Posición real del rover Curiosity (sol 5073). Senda se valida aquí con datos reales antes de usarse en Arcadia.','Real position of the Curiosity rover (sol 5073). Senda is validated here with real data before being used on Arcadia.']}
];
const L=()=>(typeof lang!=='undefined'&&lang==='en')?'en':'es';
const NN=()=>(typeof N!=='undefined'&&N[L()])?N[L()]:null;
const nameOf=s=>s.name?s.name[L()==='en'?1:0]:(NN()?NN().c[s.k][0]:s.k);
const fmt=(v,d)=>v.toLocaleString(L()==='en'?'en-US':'es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const coord=s=>`${fmt(Math.abs(s.lat),1)}° ${s.lat>=0?'N':'S'} · ${fmt(s.lon,1)}° E`;

let rd;try{rd=new THREE.WebGLRenderer({antialias:true})}catch(e){box.insertAdjacentHTML('beforeend','<p class="glb-err">WebGL no disponible en este navegador.</p>');return}
rd.setPixelRatio(Math.min(2,window.devicePixelRatio||1));rd.outputEncoding=THREE.sRGBEncoding;box.prepend(rd.domElement);
const sc=new THREE.Scene();sc.background=new THREE.Color(0x0A1020);
const cam=new THREE.PerspectiveCamera(38,1,.1,2000);
const img=new Image(),tex=new THREE.Texture(img);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=8;img.onload=()=>{tex.needsUpdate=true};img.src='@@MARS_TEX@@';
const tilt=new THREE.Group(),spin=new THREE.Group();tilt.add(spin);sc.add(tilt);
spin.add(new THREE.Mesh(new THREE.SphereGeometry(R,128,96),new THREE.MeshStandardMaterial({map:tex,roughness:1,metalness:0})));
sc.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.04,64,48),new THREE.MeshBasicMaterial({color:0xE8894A,transparent:true,opacity:.10,side:THREE.BackSide})));
sc.add(new THREE.AmbientLight(0xffffff,.42));const sun=new THREE.DirectionalLight(0xfff1dc,1.05);sun.position.set(30,14,40);sc.add(sun);
{const g=new THREE.BufferGeometry(),p=[];let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let i=0;i<1400;i++){const th=r()*6.283,ph=Math.acos(2*r()-1),d=400;p.push(d*Math.sin(ph)*Math.cos(th),d*Math.cos(ph),d*Math.sin(ph)*Math.sin(th))}
 g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xEEF1F7,size:1.3,sizeAttenuation:false})))}
// lat/lon (longitud este 0–360) → punto en la esfera, igual que las UV de SphereGeometry
function ll(lat,lon,r){const u=(((lon+180)%360)+360)%360/360,phi=u*Math.PI*2,th=(90-lat)*D2R;return new THREE.Vector3(-r*Math.cos(phi)*Math.sin(th),r*Math.cos(th),r*Math.sin(phi)*Math.sin(th))}
const lb=document.getElementById('glbLbl');
SITES.forEach(s=>{
  const p=ll(s.lat,s.lon,R),n=p.clone().normalize();s.p=p;s.n=n;
  const mat=new THREE.MeshBasicMaterial({color:s.col});
  const pin=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.1,8),mat);pin.position.copy(n.clone().multiplyScalar(R+.55));pin.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);spin.add(pin);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),mat);head.position.copy(n.clone().multiplyScalar(R+1.12));spin.add(head);s.head=head;
  const ring=new THREE.Mesh(new THREE.RingGeometry(.28,.38,40),new THREE.MeshBasicMaterial({color:s.col,side:THREE.DoubleSide,transparent:true,opacity:.95}));
  ring.position.copy(n.clone().multiplyScalar(R+.02));ring.lookAt(n.clone().multiplyScalar(R*2));spin.add(ring);s.ring=ring;
  if(s.ell){const el=new THREE.Mesh(new THREE.RingGeometry(.9,1.02,64),new THREE.MeshBasicMaterial({color:s.col,side:THREE.DoubleSide,transparent:true,opacity:.9}));
    el.position.copy(n.clone().multiplyScalar(R+.03));el.lookAt(n.clone().multiplyScalar(R*2));el.scale.set(1.6,.9,1);spin.add(el);
    const fill=new THREE.Mesh(new THREE.CircleGeometry(.9,48),new THREE.MeshBasicMaterial({color:s.col,transparent:true,opacity:.16,side:THREE.DoubleSide}));fill.position.copy(el.position);fill.quaternion.copy(el.quaternion);fill.scale.copy(el.scale);spin.add(fill);s.ell=el}
  const t=document.createElement('button');t.type='button';t.className='glb-tag';t.style.setProperty('--c',s.css);t.addEventListener('click',()=>focus(s));lb.appendChild(t);s.tag=t});
// estado de cámara
const st={yaw:0,pitch:.35,dist:34,ty:0,tp:.35,td:34,auto:true,idle:0,sel:null};
function focus(s){const p=s.p,a=Math.atan2(-p.x,p.z);let d=a-st.yaw;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;st.ty=st.yaw+d;
  st.tp=Math.atan2(p.y,Math.hypot(p.x,p.z));st.td=Math.min(st.td,24);st.auto=false;st.idle=0;st.sel=s;info()}
function info(){const e=document.getElementById('glbInfo'),s=st.sel;const en=L()==='en';
  if(!s){e.innerHTML=`<b>${en?'Mars · candidate sites':'Marte · sitios candidatos'}</b><span>${en?'Drag to rotate, scroll or pinch to zoom. Tap a site.':'Arrastra para girar, rueda o pellizco para acercar. Toca un sitio.'}</span>`;return}
  const c=NN()&&NN().c[s.k],chosen=c?c[3]:null;
  e.innerHTML=`<b style="color:${s.css}">${nameOf(s)}</b>${chosen!=null?`<i class="${chosen?'ok':'no'}">${chosen?(en?'Chosen':'Elegida'):(en?'Not chosen':'No elegida')}</i>`:`<i class="val">${en?'Validation':'Validación'}</i>`}
   <span class="mono">${coord(s)}</span><span>${c?c[1]:s.info[en?1:0]}</span>${c?`<span><b>${en?'Why:':'Por qué:'}</b> ${c[2]}</span>`:''}${s.k==='a'?`<a href="#eva">${en?'Plan the 2 km walk →':'Planear la caminata de 2 km →'}</a>`:''}`}
function buttons(){const b=document.getElementById('glbBtns'),en=L()==='en';b.innerHTML='';
  SITES.forEach(s=>{const x=document.createElement('button');x.type='button';x.innerHTML=`<span style="background:${s.css}"></span>${nameOf(s)}`;x.addEventListener('click',()=>focus(s));b.appendChild(x)});
  const r=document.createElement('button');r.type='button';r.textContent=en?'Spin':'Girar';r.addEventListener('click',()=>{st.auto=true;st.sel=null;st.td=34;info()});b.appendChild(r)}
// controles: arrastre, rueda y pellizco
const cv=rd.domElement,PT=new Map;let pinch=0;cv.style.touchAction='none';
cv.addEventListener('pointerdown',e=>{PT.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);st.auto=false;st.idle=0;pinch=0});
cv.addEventListener('pointermove',e=>{const p=PT.get(e.pointerId);if(!p)return;
  if(PT.size===2){PT.set(e.pointerId,[e.clientX,e.clientY]);const [a,b]=[...PT.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)st.td=Math.min(60,Math.max(14,st.td*pinch/d));pinch=d;return}
  const dx=e.clientX-p[0],dy=e.clientY-p[1];PT.set(e.pointerId,[e.clientX,e.clientY]);const k=1.6/Math.max(300,cv.clientHeight)*(st.dist/34);
  st.ty+=dx*k*2.2;st.tp=Math.max(-1.3,Math.min(1.3,st.tp+dy*k*2.2))});
const up=e=>{PT.delete(e.pointerId);pinch=0};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();st.td=Math.min(60,Math.max(14,st.td*Math.exp(e.deltaY*.001)))},{passive:false});
let lastLang='',last=0;
function frame(t){requestAnimationFrame(frame);if(!box.offsetParent)return;const dt=Math.min(.05,(t-last)/1000||0);last=t;
  if(L()!==lastLang){lastLang=L();buttons();info()}
  if(st.auto){st.ty+=dt*.12}else{st.idle+=dt;if(st.idle>14&&!st.sel)st.auto=true}
  st.yaw+=(st.ty-st.yaw)*.08;st.pitch+=(st.tp-st.pitch)*.08;st.dist+=(st.td-st.dist)*.08;
  spin.rotation.y=st.yaw;tilt.rotation.x=st.pitch;
  const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;
  if(cv.width!==Math.round(w*rd.getPixelRatio())||cv.height!==Math.round(h*rd.getPixelRatio())){rd.setSize(w,h,false);cv.style.width='100%';cv.style.height='100%';cam.aspect=w/h;cam.updateProjectionMatrix()}
  cam.position.set(0,0,st.dist);cam.lookAt(0,0,0);
  const pulse=1+.25*Math.sin(t/260);
  SITES.forEach(s=>{s.ring.scale.setScalar(s===st.sel?pulse*1.3:pulse);
    const wp=s.head.getWorldPosition(new THREE.Vector3()),nw=wp.clone().normalize(),toCam=cam.position.clone().sub(wp).normalize(),vis=nw.dot(toCam)>.08;
    const p=wp.clone().project(cam);s.tag.style.display=vis?'block':'none';s.tag.style.left=((p.x*.5+.5)*w)+'px';s.tag.style.top=((-p.y*.5+.5)*h)+'px';
    s.tag.textContent=nameOf(s);s.tag.classList.toggle('on',s===st.sel)});
  rd.render(sc,cam)}
requestAnimationFrame(frame);
// arranque: mostrar Arcadia primero
focus(SITES[0]);st.td=st.dist=30;st.yaw=st.ty;st.pitch=st.tp;st.idle=0;
})();
