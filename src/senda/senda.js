/* SENDA · motor del planificador de EVA y consola de inteligencia — TESLA STARS ONE
   Sitios: Base Ártemis (Arcadia Planitia, misión) y Gale (validación con datos reales de Curiosity). */
(function(){
"use strict";
const $=id=>document.getElementById(id);
if(!$('sxMap'))return;
// ================= DATOS REALES (instantánea 14 nov 2026) =================
const SNAP='2026-11-14T15:45:00Z';
const ROVER={sol:5073,lat:-4.82602331,lon:137.388886,elev:-3472.085,dist:38638.02,driveM:27.91,tilt:12.45,yaw:-171.6,site:125,drive:2490};
const TRACK=[[4851,-403.7,-828.7,-3588.0],[4855,-397.2,-779.4,-3583.1],[4857,-415.0,-760.5,-3578.4],[4861,-443.1,-757.0,-3579.3],[4865,-464.8,-723.8,-3574.2],[4868,-423.2,-695.5,-3570.4],[4889,-415.8,-684.9,-3568.9],[4891,-429.4,-694.8,-3570.6],[4893,-430.6,-687.8,-3569.6],[4912,-416.5,-660.6,-3566.1],[4914,-396.8,-638.1,-3563.6],[4916,-381.7,-614.7,-3562.2],[4919,-383.1,-586.5,-3558.8],[4921,-372.4,-570.2,-3557.6],[4923,-349.2,-542.2,-3554.1],[4928,-343.4,-508.5,-3550.7],[4932,-341.1,-479.6,-3546.4],[4936,-351.6,-442.2,-3543.3],[4939,-335.5,-405.0,-3539.0],[4942,-335.7,-395.0,-3538.0],[4946,-330.4,-378.8,-3535.7],[4948,-329.0,-344.3,-3531.7],[4950,-290.0,-286.2,-3523.9],[4953,-276.1,-266.7,-3521.7],[4955,-249.8,-261.7,-3519.3],[4957,-242.3,-308.3,-3526.3],[4959,-224.7,-361.6,-3531.1],[4963,-205.2,-345.5,-3528.5],[4966,-199.1,-313.0,-3523.4],[4970,-193.5,-299.3,-3520.9],[4973,-187.6,-283.6,-3516.7],[4977,-181.0,-271.7,-3514.6],[4983,-164.3,-267.8,-3512.6],[4987,-133.6,-233.5,-3508.3],[4989,-130.9,-209.1,-3505.5],[4994,-127.7,-178.2,-3501.8],[4996,-129.1,-143.5,-3498.7],[4998,-130.4,-139.0,-3498.5],[5004,-133.5,-130.8,-3496.9],[5008,-104.6,-111.3,-3493.7],[5011,-76.2,-84.0,-3488.9],[5014,-45.1,-82.5,-3486.3],[5016,-24.1,-84.0,-3484.8],[5018,-2.9,-53.1,-3480.0],[5021,-2.3,-52.3,-3479.9],[5041,-65.3,-85.1,-3488.3],[5045,-75.0,-80.4,-3488.0],[5069,2.9,-45.3,-3478.8],[5070,15.8,-20.4,-3473.7],[5073,0,0,-3472.1]];
const REMS=[[4956,-66,-11],[4957,-71,-16],[4958,-72,-12],[4959,-72,-7],[4960,-72,-9],[4961,-72,-10],[4962,-74,-7],[4963,-70,-2],[4964,-70,-3],[4965,-71,0],[4966,-71,-3],[4967,-72,-3],[4968,-70,-3],[4969,-71,-4],[4970,-72,-5],[4971,-70,-4],[4972,-69,-6],[4973,-69,-3],[4974,-72,-8],[4975,-71,-6],[4976,-72,-5],[4977,-70,-4],[4978,-72,-7],[4979,-71,-7],[4980,-78,-7],[4981,-69,-8],[4982,-69,-6],[4983,-70,-4],[4984,-71,-6],[4985,-70,-6],[4986,-71,-9],[4987,-70,-9],[4988,-70,-10],[4989,-72,-6],[4990,-72,-8],[4991,-69,-11],[4992,-69,-6],[4993,-70,-6],[4994,-70,-7],[4995,-71,-5]];
const REMS_LAST={sol:4995,ls:341,tmin:-71,tmax:-5,p:777,gmin:-84,gmax:4};
const SWX={kp:0,level:'Tranquilo',kpTime:'2026-11-14T15:42:00Z',flare:{cls:'C4.4',peak:'2026-11-14T06:06:00Z'},alerts:0};
const EVENTS=[
 ['2026-11-14T15:42:00Z','sw','NOAA SWPC','Índice Kp 0: campo geomagnético tranquilo. Sin alertas activas.'],
 ['2026-11-14T06:06:00Z','sw','NOAA SWPC','Fulguración solar clase C4.4 (inicio 06:02, fin 06:08 UTC). Sin efecto esperado en la superficie marciana.'],
 ['2026-11-13T16:01:24Z','rov','Navcam','Sol 5073: Navcam izquierda registra losas claras y arena tras la conducción.'],
 ['2026-11-13T15:39:54Z','rov','Hazcam','Sol 5073: pares Hazcam trasero y frontal para evaluar peligros.'],
 ['2026-11-13T15:00:00Z','rov','MMGIS','Sol 5073: conducción de 27,9 m. Posición −4,82602°, 137,38889°, elev. −3472 m, inclinación 12,5°. Odómetro 38,64 km.'],
 ['2026-11-13T12:42:52Z','rov','ChemCam','Sol 5073: el telescopio RMI fotografía dunas y la ladera lejana.'],
 ['2026-11-10T12:00:00Z','rov','MMGIS','Sol 5070: conducción de 28,7 m hacia el sur, ladera arriba.'],
 ['2026-11-09T12:00:00Z','rov','MMGIS','Sol 5069: conducción de 101,3 m. Elev. −3478,8 m.'],
 ['2026-08-25T12:00:00Z','atm','REMS','Sol 4995: aire −71 / −5 °C, suelo −84 / 4 °C, 777 Pa, cielo despejado, UV moderado. Último reporte público.']
];
// ================= utilidades =================
const AREA=1800,N=300,CELL=AREA/N,NN=N*N,CX=900,CY=900,MPD=59160;
const DEC=9.9*Math.PI/180; // Ls ≈ 24°
const EGRESS=.25,INGRESS=.25,PLSS=8;
const C={fg:'#EEF1F7',mute:'#8A93A8',ochre:'#E8894A',route:'#8FE3FF',blue:'#3B7BFF',ok:'#7cc48a',warn:'#e7b94c',crit:'#ec6a55',bg:'#0A1020',panel:'#111a2e',trk:'#f2efe8'};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const fmt=(v,d=0)=>v.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const hhmm=t=>{t=((t%24)+24)%24;let h=Math.floor(t),m=Math.round((t-h)*60);if(m===60){h=(h+1)%24;m=0}return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')};
const mins=s=>Math.round(s/60);
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fdate=iso=>{const d=new Date(iso);return d.getUTCDate()+' '+MES[d.getUTCMonth()]+' · '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0')};
function hash(x,y,s){let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(s|0,982451653);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,y,s,o){let t=0,a=.5,f=1,n=0;for(let i=0;i<o;i++){t+=a*vnoise(x*f,y*f,s+i*17);n+=a;a*=.5;f*=2}return t/n}
function vor(x,y,S,seed){const gx=Math.floor(x/S),gy=Math.floor(y/S);let f1=1e9,f2=1e9;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx=gx+i,cy=gy+j,px=(cx+.15+.7*hash(cx,cy,seed))*S,py=(cy+.15+.7*hash(cx,cy,seed+12))*S,d=Math.hypot(x-px,y-py);if(d<f1){f2=f1;f1=d}else if(d<f2)f2=d}return f2-f1}
// ================= campos =================
const H=new Float32Array(NN),SL=new Float32Array(NN),SAND=new Float32Array(NN),ROCK=new Float32Array(NN),FEAT=new Float32Array(NN),BOX=new Float32Array(NN),CHAN=new Float32Array(NN),BUT=new Float32Array(NN),TI=new Float32Array(NN),SVF=new Float32Array(NN),RET=new Float32Array(NN),ICE=new Float32Array(NN),PERC=new Float32Array(NN);
const MIN=new Uint8Array(NN),PASS=new Uint8Array(NN);
const sampleF=(F,gx,gy)=>{gx=clamp(gx,0,N-1.001);gy=clamp(gy,0,N-1.001);const i=Math.floor(gx),j=Math.floor(gy),fx=gx-i,fy=gy-j,k=j*N+i;return F[k]*(1-fx)*(1-fy)+F[k+1]*fx*(1-fy)+F[k+N]*(1-fx)*fy+F[k+N+1]*fx*fy};
const hAt=(x,y)=>sampleF(H,x/CELL-.5,y/CELL-.5);
const cellOf=(x,y)=>clamp(Math.floor(y/CELL),0,N-1)*N+clamp(Math.floor(x/CELL),0,N-1);
function clearAround(x,y,sts,f){for(const s of sts){const d=Math.hypot(x-s.x,y-s.y),r=s.clear||30;const c=1-Math.exp(-((d/r)**2));f.sand*=c;f.rock*=c}}

// ---------- Sitio 1: Base Ártemis, Arcadia Planitia (escenario del equipo)
const ARC={id:'arc',name:'Base Ártemis · Arcadia Planitia',short:'Arcadia',lat:40.1,lon:191.4,elev:-4120,anchor:[CX,CY],
  tmin:-85,tmax:-30,tSrc:'modelo con referencia de Viking 2 (48° N)',p:610,pSrc:'dato del equipo: 6,1 hPa',vex3d:9,
  hab:'Nave · Base Ártemis',crew:['EV1 · camina los 2 km, toma muestras y fotos','Nave · 3 tripulantes supervisan por radio'],roverDefault:false,
  unitsName:'Unidades de superficie',unitsSrc:'HiRISE + SHARAD (estimado)',
  units:[{n:'Dunas de arena',c:[90,84,100]},{n:'Regolito con percloratos',c:[214,158,96]},{n:'Hielo somero (< 0,6 m)',c:[110,190,235]},{n:'Hielo expuesto',c:[240,250,255]},{n:'Basalto en bloques',c:[150,70,70]},{n:'Suelo poligonal',c:[236,206,140]}],
  stations:[
   {id:'H',name:'Nave · Base Ártemis',x:900,y:900,dwell:0,clear:110,
    obj:'Módulo de aterrizaje y refugio. Desde aquí tres tripulantes siguen la caminata por radio y vídeo.',
    see:'Una llanura casi plana de regolito anaranjado, con grietas que forman polígonos. El horizonte está a solo 3,4 km y no hay montañas a la vista.',
    tools:'Esclusa de traje, recarga de oxígeno y baterías, caja de muestras con sello.'},
   {id:'E1',name:'Suelo poligonal',x:1130,y:700,dwell:20,
    obj:'Medir la red de polígonos de contracción térmica. Sus grietas se abren y cierran cada año por el hielo del subsuelo: miden cuánto hielo hay y a qué profundidad.',
    see:'Grietas poco profundas que dibujan polígonos de 10 a 30 m. Camina por el centro de cada polígono, no sobre la grieta.',
    tools:'Telémetro láser, cámara estéreo, sonda térmica de 30 cm.'},
   {id:'E2',name:'Cráter reciente con hielo',x:1270,y:985,dwell:25,clear:12,
    obj:'Fotografiar y muestrear hielo expuesto por un impacto reciente. HiRISE ha visto cráteres pequeños así en latitudes medias del norte, con hielo blanco que se sublima en pocas semanas.',
    see:'Un hoyo de unos 28 m con el fondo y los bordes blanquecinos. Trabaja desde el borde: la pared interior es empinada y el hielo resbala.',
    tools:'Taladro de núcleo con camisa térmica, tubo sellado en frío, espectrómetro de mano.'},
   {id:'E3',name:'Borde de depresión escalonada',x:1085,y:1300,dwell:20,
    obj:'Las depresiones escalonadas se forman cuando el hielo del subsuelo se sublima. Su borde da el acceso al agua más somero del sitio, por eso es la parada clave para el uso de recursos (ISRU).',
    see:'Un hundimiento de unos 9 m en escalones con paredes casi verticales. No bajes: los escalones se desmoronan.',
    tools:'Pala, sonda de penetración, radar de suelo portátil.'},
   {id:'E4',name:'Mirador del cráter degradado',x:650,y:700,dwell:15,optional:true,
    obj:'Parada opcional. Fotografiar el interior del cráter degradado y su manto de bloques. Activarla lleva la caminata por encima de los 2 km del plan.',
    see:'Un cráter viejo de unos 220 m, relleno de polvo, con bloques basálticos en el borde.',
    tools:'Cámara panorámica, telémetro láser.'}
  ],
  snaps:{E1:k=>BOX[k]-SL[k]*.05,E2:k=>-SL[k]*.08-ROCK[k]+(ICE[k]<.3?.5:0),E3:k=>-SL[k]*.1+(ICE[k]<.8?.3:0),E4:k=>-SL[k]*.1-ROCK[k]},
  layers:['opt','topo','slope','ice','units','thermal','perc','haz','rad','cont','iso'],
  far:a=>.15+(fbm(a/9,.5,61,3)-.5)*.25,
  gen(){
    const SC={x:1300,y:1310,r:140},CB={x:560,y:610,r:110},CF={x:1300,y:985,r:14};
    const sts=this.stations;
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){
      const x=(i+.5)*CELL,y=(j+.5)*CELL,k=j*N+i;
      let h=(fbm(x/520,y/520,41,4)-.5)*7+y*.003+(fbm(x/40,y/40,42,3)-.5)*.5;
      // suelo poligonal (grietas de contracción térmica)
      const pm=sstep(.32,.6,fbm(x/320,y/320,43,3)+.12);
      const e=vor(x,y,22,51),tr=pm*Math.exp(-((e/2.4)**2));
      h-=.6*tr;
      let ice=1.2+(fbm(x/260,y/260,44,3)-.5)*.5;
      // depresión escalonada (terrazas)
      const sd=Math.hypot((x-SC.x)/1.25,y-SC.y);let sc=0;
      if(sd<SC.r+30){const q=clamp((SC.r+30-sd)/(SC.r+30),0,1),q4=q*4,f=Math.floor(q4);sc=Math.min(1,f/4+sstep(.9,1,q4-f)/4);h-=9*sc}
      ice-=.7*sstep(SC.r+120,SC.r-20,sd);
      // cráter degradado con bloques
      const cd=Math.hypot(x-CB.x,y-CB.y),q=cd/CB.r;
      if(q<1)h-=8*(1-q*q);
      h+=2.4*Math.exp(-(((cd-CB.r)/24)**2));
      let rock=.8*Math.exp(-(((cd-CB.r)/32)**2))+(q>1?.3*Math.pow(q,-3):0);
      // cráter reciente con hielo expuesto
      const fd=Math.hypot(x-CF.x,y-CF.y),fq=fd/CF.r;
      if(fq<1)h-=3.2*(1-fq*fq);
      h+=.9*Math.exp(-(((fd-CF.r)/5)**2));
      if(fq<1.5)ice=Math.min(ice,Math.max(0,(fq-1)*.8));
      rock+=.35*Math.exp(-(((fd-CF.r*1.4)/8)**2));
      // dunas
      const dm=sstep(.6,.7,fbm(x/260,y/260,47,4)+.2*Math.exp(-((x-380)**2+(y-1420)**2)/(2*320*320)));
      h+=dm*2.4*Math.pow(Math.max(0,Math.sin((x*.8+y*.6)/14+fbm(x/90,y/90,48,2)*3)),2);
      ice+=.4*dm;
      // campos de bloques
      rock+=.5*sstep(.69,.82,fbm(x/90,y/90,49,3));
      const f={sand:dm,rock};clearAround(x,y,sts,f);
      rock=clamp(f.rock,0,1);
      H[k]=h;SAND[k]=f.sand;ROCK[k]=rock;FEAT[k]=tr;BOX[k]=pm;CHAN[k]=sc;BUT[k]=0;ICE[k]=clamp(ice,0,2.5);
      PERC[k]=clamp(.45+.25*f.sand+(fbm(x/150,y/150,50,2)-.5)*.3-.3*(fq<1.5?1:0),.05,1);
      let m=1;if(pm>.55)m=5;if(ICE[k]<.6)m=2;if(rock>.45)m=4;if(f.sand>.5)m=0;if(fq<1.3)m=3;
      MIN[k]=m;
      TI[k]=[180,250,330,1100,620,290][m]+rock*300;
    }
  },
  albedo(k,i,j){
    let r=196,g=146,b=104;const m=MIN[k];
    if(m===5){r=204;g=156;b=112}
    r-=FEAT[k]*60;g-=FEAT[k]*48;b-=FEAT[k]*36;
    if(m===2){r=r*.9+18;g=g*.9+16;b=b*.9+20}
    if(m===3){r=228;g=236;b=242}
    const sd=SAND[k];r+=(92-r)*sd;g+=(76-g)*sd;b+=(68-b)*sd;
    if(CHAN[k]>0){r*=1-.12*CHAN[k];g*=1-.12*CHAN[k]}
    return [r,g,b];
  },
  terrainName(k){if(ROCK[k]>.5)return 'Campo de bloques';if(SAND[k]>.5)return 'Duna de arena';if(MIN[k]===3)return 'Hielo expuesto';if(CHAN[k]>.05)return 'Depresión escalonada';if(FEAT[k]>.35)return 'Grieta poligonal';return 'Llanura de regolito'},
  interest(k){return MIN[k]===3?'muy alto: hielo de agua expuesto':ICE[k]<.6?'alto: hielo a menos de 60 cm':FEAT[k]>.3||BOX[k]>.55?'medio-alto: suelo poligonal':SAND[k]>.5?'bajo: arena':'medio: regolito'},
  dossierExtra(k,p){return [['Hielo bajo la superficie',ICE[k]<.02?'expuesto':fmt(ICE[k],1)+' m','SHARAD · GRS (estimado)'],['Percloratos en el polvo','≈ '+fmt(PERC[k],2)+' % en peso','referencia Phoenix'],['Distancia a la nave',fmt(Math.hypot(p.x-CX,p.y-CY),0)+' m al '+cardOf(bearing(p,{x:CX,y:CY})),'plan del equipo']]}
};
// ---------- Sitio 2: Gale, ladera del Monte Sharp (validación con Curiosity)
const GALE={id:'gale',name:'Gale · validación con Curiosity',short:'Gale',lat:ROVER.lat,lon:ROVER.lon,elev:ROVER.elev,anchor:[CX,CY],
  tmin:REMS_LAST.tmin,tmax:REMS_LAST.tmax,tSrc:'REMS, sol '+REMS_LAST.sol,p:REMS_LAST.p,pSrc:'REMS, sol '+REMS_LAST.sol,vex3d:1.6,
  hab:'Hábitat móvil',crew:['EV1 · geología de campo, guía de ruta','EV2 · muestras e instrumentos'],roverDefault:true,
  unitsName:'Mineralogía',unitsSrc:'CRISM',track:true,
  units:[{n:'Arena basáltica',c:[78,80,96]},{n:'Sulfato de Mg polihidratado',c:[214,158,70]},{n:'Esmectita (filosilicatos)',c:[84,170,204]},{n:'Hematita',c:[178,62,72]},{n:'Sulfatos y azufre del canal',c:[236,232,96]},{n:'Sulfato de Ca cementado (crestas)',c:[246,244,240]}],
  stations:[
   {id:'H',name:'Hábitat móvil',x:300,y:260,dwell:0,clear:90,obj:'Rover presurizado y refugio. Punto de salida y regreso de la pareja.',see:'Llanura de roca plana con parches de arena, unos 60 m más abajo que Curiosity. Al sur sube la ladera del Monte Sharp.',tools:'Esclusa de traje, recarga del PLSS, caja de muestras con sello.'},
   {id:'E1',name:'Cresta de boxwork',x:820,y:990,dwell:30,obj:'Muestrear el cemento mineral de una cresta: fracturas rellenas por minerales que dejó el agua subterránea y que resistieron la erosión.',see:'Muros bajos de roca clara de 1 a 2 m que forman celdas de 30 a 60 m, como en las imágenes Navcam del sol 5073.',tools:'Martillo, broca de núcleo, espectrómetro Raman/XRF de mano, cámara estéreo.'},
   {id:'E2',name:'Hueco entre crestas',x:1000,y:1130,dwell:25,obj:'Comparar el suelo del hueco con la cresta y abrir una zanja de 20 cm para buscar filosilicatos y materia orgánica.',see:'Un piso plano y algo más oscuro rodeado de crestas.',tools:'Pala de zanja, tubos sellados, espectrómetro de mano.'},
   {id:'E3',name:'Bloques del canal',x:0,y:1280,dwell:30,clear:16,obj:'Muestrear bloques claros del canal. En 2024 Curiosity encontró azufre elemental casi puro en el canal Gediz Vallis.',see:'Un canal de unos 50 m de ancho y 5 m de profundidad lleno de bloques angulosos.',tools:'Guantes de protección, pinzas, bolsa rígida, XRF de mano.'},
   {id:'E4',name:'Mirador de la mesa',x:430,y:1430,dwell:20,obj:'Fotografiar en estéreo la red de crestas y la estratigrafía de la ladera.',see:'Una mesa de 18 m con escarpes al norte, oeste y sur. Se sube solo por la rampa del este.',tools:'Cámara panorámica, telémetro láser, antena de relé.'}
  ],
  snaps:{E1:k=>FEAT[k]-SL[k]*.01,E2:k=>BOX[k]*(1-FEAT[k]*3)-SL[k]*.03,H:k=>-SL[k]-SAND[k]*5,E3:k=>-SL[k]*.05-ROCK[k],E4:k=>-SL[k]*.1+BUT[k]*2},
  layers:['opt','trk','topo','slope','units','thermal','haz','rad','cont','iso'],
  far(a){const da=Math.abs(((a-180+540)%360)-180);return 1.1+10.5*Math.exp(-((da/52)**2))+(fbm(a/14,.5,31,3)-.5)*1.6*(1+5*Math.exp(-((da/52)**2)))},
  gen(){
    const chanX=y=>1330+85*Math.sin(y/230)+30*Math.sin(y/90+1.3);this.stations[3].x=chanX(1280)-58;
    const CR={x:1360,y:430,r:65},BT={x:430,y:1430,r:130,h:18},sts=this.stations;
    const TRK=TRACK.map(p=>({x:CX+p[1],y:CY+p[2]}));
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){
      const x=(i+.5)*CELL,y=(j+.5)*CELL,k=j*N+i;
      let h=y*.1+(fbm(x/420,y/420,1,4)-.5)*16+(fbm(x/45,y/45,2,3)-.5)*1.4;
      const g=Math.exp(-((x-880)**2+(y-1060)**2)/(2*340*340)),bm=sstep(.35,.7,g*1.25+(fbm(x/260,y/260,5,3)-.5)*.9);
      const e=vor(x,y,48,11),ridge=bm*Math.exp(-((e/4)**2));
      h+=1.7*ridge-.6*bm*(1-Math.exp(-((e/16)**2)));
      const cd=Math.hypot(x-CR.x,y-CR.y),q=cd/CR.r;if(q<1)h+=-11*(1-q*q);h+=3.2*Math.exp(-(((cd-CR.r)/16)**2));
      let rock=.9*Math.exp(-(((cd-CR.r)/28)**2))+(q>1?.35*Math.pow(q,-3):0);
      const cf=sstep(680,860,y),cw=Math.abs(x-chanX(y));let chan=0;
      if(cf>0){const W=26,B=22,p=cw<W?1:cw<W+B?1-sstep(0,1,(cw-W)/B):0;h-=5.5*p*cf;chan=p*cf}
      if(chan>.6)rock+=.42+.4*(fbm(x/14,y/14,15,2)-.3);
      const bd=Math.hypot(x-BT.x,y-BT.y),ba=Math.atan2(y-BT.y,x-BT.x),ramp=Math.max(0,Math.cos(ba))**2,sw=34+120*ramp,bs=sstep(0,1,(BT.r+sw/2-bd)/sw);
      h+=BT.h*bs+bs*(fbm(x/30,y/30,4,2)-.5)*.8;rock+=.7*(1-ramp)*Math.exp(-(((bd-(BT.r+sw/2+8))/18)**2));
      rock+=.6*sstep(.64,.78,fbm(x/120,y/120,9,3));
      let sand=sstep(.55,.66,fbm(x/230,y/230,7,4)+.16*(1-y/1800)-.35*bm-.5*bs-.6*chan);if(q<.6)sand=Math.max(sand,.75);
      const f={sand,rock};clearAround(x,y,sts,f);
      let dT=1e9;for(const t of TRK){const dd=Math.hypot(x-t.x,y-t.y);if(dd<dT)dT=dd}
      const ct=1-Math.exp(-((dT/22)**2));f.rock*=ct;f.sand*=.4+.6*ct;
      rock=clamp(f.rock,0,1);
      H[k]=h;SAND[k]=f.sand;ROCK[k]=rock;FEAT[k]=ridge;BOX[k]=bm;CHAN[k]=chan;BUT[k]=bs;ICE[k]=0;PERC[k]=0;
      const clayLine=640+(fbm(x/300,y/300,13,3)-.5)*260;let m=1;
      if(y<clayLine)m=2;if(bm>.45&&ridge<.12&&fbm(x/60,y/60,17,2)>.5)m=2;if(bs>.85&&fbm(x/70,y/70,19,2)>.45)m=3;if(chan>.3)m=4;if(ridge>.35)m=5;if(f.sand>.5)m=0;
      MIN[k]=m;TI[k]=[210,480,420,560,640,720][m]*(1-f.sand)+210*f.sand+rock*340;
    }
  },
  albedo(k){let r=176,g=124,b=86;const m=MIN[k];if(m===2){r=164;g=124;b=100}if(m===3){r=150;g=96;b=78}
    const rd=FEAT[k];r+=(218-r)*rd;g+=(184-g)*rd;b+=(146-b)*rd;
    if(CHAN[k]>.3){r=r*.6+78;g=g*.6+68;b=b*.6+51}const sd=SAND[k];r+=(92-r)*sd;g+=(70-g)*sd;b+=(58-b)*sd;return [r,g,b]},
  terrainName(k){if(ROCK[k]>.5)return 'Campo de bloques';if(SAND[k]>.5)return 'Arena suelta';if(FEAT[k]>.35)return 'Cresta de boxwork';if(CHAN[k]>.6)return 'Fondo del canal';if(BUT[k]>.85)return 'Cima de la mesa';return 'Roca firme'},
  interest(k){return FEAT[k]>.35?'alto: cresta de boxwork':CHAN[k]>.3?'alto: canal con sulfatos':MIN[k]===2?'medio-alto: filosilicatos':SAND[k]>.5?'bajo: arena':'medio: sulfato de la ladera'},
  dossierExtra(k,p){let nt=null,nd=1e9;TRACK.forEach(t=>{const d=Math.hypot(CX+t[1]-p.x,CY+t[2]-p.y);if(d<nd){nd=d;nt=t}});
    return [['Curiosity',fmt(Math.hypot(CX-p.x,CY-p.y),0)+' m al '+cardOf(bearing(p,{x:CX,y:CY})),'posición sol '+ROVER.sol],['Huella del rover',nd<60?'pasó a '+fmt(nd,0)+' m el sol '+nt[0]:'a '+fmt(nd,0)+' m del recorrido','MMGIS'],['Inercia térmica',fmt(TI[k],0)+' J m⁻² K⁻¹ s⁻½','THEMIS']]}
};
const SITES={arc:ARC,gale:GALE};
let SITE=ARC,PHI,LAT0,LON0,SUNRISE,SUNSET;

function genSite(){
  LAT0=SITE.lat;LON0=SITE.lon;PHI=LAT0*Math.PI/180;
  SUNRISE=12-Math.acos(clamp(-Math.tan(PHI)*Math.tan(DEC),-1,1))*12/Math.PI;SUNSET=24-SUNRISE;
  SITE.gen();
  const off=SITE.elev-sampleF(H,SITE.anchor[0]/CELL-.5,SITE.anchor[1]/CELL-.5);for(let k=0;k<NN;k++)H[k]+=off;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){
    const k=j*N+i,il=Math.max(0,i-1),ir=Math.min(N-1,i+1),ju=Math.max(0,j-1),jd=Math.min(N-1,j+1);
    const gx=(H[j*N+ir]-H[j*N+il])/((ir-il)*CELL),gy=(H[jd*N+i]-H[ju*N+i])/((jd-ju)*CELL);
    SL[k]=Math.atan(Math.hypot(gx,gy))*180/Math.PI;PASS[k]=(SL[k]<=25&&ROCK[k]<.78)?1:0}
  const D8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;let s=0;
    for(const [dx,dy] of D8){let mx=0;const dl=(dx&&dy)?CELL*1.41421:CELL;for(let st=1;st<=25;st++){const ii=i+dx*st,jj=j+dy*st;if(ii<0||jj<0||ii>=N||jj>=N)break;const a=(H[jj*N+ii]-H[k])/(st*dl);if(a>mx)mx=a}s+=Math.sin(Math.atan(mx))}
    SVF[k]=1-s/8}
  for(const s of SITE.stations){const f=SITE.snaps[s.id];if(f)snap(s,f,8);else snap(s,k=>-SL[k],3)}
}
function snap(st,score,R){const ci=Math.floor(st.x/CELL),cj=Math.floor(st.y/CELL);let best=-1,bs=-Infinity;
  for(let dj=-R;dj<=R;dj++)for(let di=-R;di<=R;di++){const i=ci+di,j=cj+dj;if(i<0||j<0||i>=N||j>=N)continue;const k=j*N+i;if(!PASS[k])continue;const s=score(k)-.004*(di*di+dj*dj);if(s>bs){bs=s;best=k}}
  if(best<0)best=nearestPass(ci,cj);st.x=(best%N+.5)*CELL;st.y=(Math.floor(best/N)+.5)*CELL}
function nearestPass(ci,cj){for(let r=0;r<60;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){const i=ci+di,j=cj+dj;if(i<0||j<0||i>=N||j>=N)continue;if(PASS[j*N+i])return j*N+i}return cj*N+ci}

// ================= estado =================
const params={payload:12,rover:false,sep:'quiet',start:10,tau:.6,opac:.6,vex:3};
const SEP={quiet:{rate:.028,label:'Rayos cósmicos galácticos'},mod:{rate:.12,label:'Evento solar moderado'},strong:{rate:.42,label:'Evento solar fuerte'}};
const LAYERDEF={
 opt:{name:'Óptico',src:'HiRISE 25 cm · CTX',on:true},
 trk:{name:'Recorrido real de Curiosity',src:'MMGIS · soles 4851–5073',on:true},
 topo:{name:'Topografía',src:'DTM HiRISE · MOLA',on:false},
 slope:{name:'Pendiente',src:'derivada del DTM',on:true},
 ice:{name:'Profundidad del hielo',src:'SHARAD (MRO) · GRS (Odyssey)',on:false},
 units:{name:'Unidades',src:'',on:false},
 thermal:{name:'Inercia térmica',src:'THEMIS',on:false},
 perc:{name:'Percloratos',src:'estimado con datos de Phoenix',on:false},
 haz:{name:'Peligros: bloques y arena',src:'conteo de bloques HiRISE',on:false},
 rad:{name:'Dosis de radiación',src:'RAD + horizonte local',on:false},
 cont:{name:'Curvas de nivel',src:'cada 1 m, maestras cada 5 m',on:true},
 iso:{name:'Isócronas de regreso',src:'tiempo a pie hasta la base',on:false}
};
let seq=[],wpCount=0,legs=[],totals=null,hover=null,selSt='E1',hud=false,hudLeg=0,mode='inspect',dosPt={x:CX,y:CY},logF='all',view='2d';
function resetSeq(){seq=SITE.stations.filter(s=>s.id!=='H').map(s=>({k:'st',id:s.id,on:!s.optional}));wpCount=0;selSt='E1';hudLeg=0;dosPt={x:SITE.stations[0].x,y:SITE.stations[0].y};
  if(SITE.id==='gale')dosPt={x:CX,y:CY}}
const ST=id=>SITE.stations.find(s=>s.id===id);

// ================= movilidad =================
function vmax(){return 6/3.6*.5/(1+params.payload/60)}
function speedMS(gr,k){let v=6*Math.exp(-3.5*Math.abs(gr+.05))/3.6;v*=.5/(1+params.payload/60);v*=1-.4*SAND[k];v*=1-.55*ROCK[k];return v}
const DX=[1,-1,0,0,1,1,-1,-1],DY=[0,0,1,-1,1,-1,1,-1];
function edgeT(a,b,diag){const d=diag?CELL*1.41421356:CELL;return d/speedMS((H[b]-H[a])/d,b)}
const HN=new Int32Array(NN*8),HF=new Float32Array(NN*8);let hs=0;
function hpush(n,f){let i=hs++;while(i>0){const p=(i-1)>>1;if(HF[p]<=f)break;HN[i]=HN[p];HF[i]=HF[p];i=p}HN[i]=n;HF[i]=f}
function hpop(){const top=HN[0];hs--;const n=HN[hs],f=HF[hs];let i=0;for(;;){let c=2*i+1;if(c>=hs)break;if(c+1<hs&&HF[c+1]<HF[c])c++;if(HF[c]>=f)break;HN[i]=HN[c];HF[i]=HF[c];i=c}HN[i]=n;HF[i]=f;return top}
const G=new Float32Array(NN),PREV=new Int32Array(NN),CLOSED=new Uint8Array(NN);
function astar(s,g){G.fill(Infinity);PREV.fill(-1);CLOSED.fill(0);hs=0;const vm=vmax(),gi=g%N,gj=Math.floor(g/N),heur=k=>Math.hypot(k%N-gi,Math.floor(k/N)-gj)*CELL/vm;
  G[s]=0;hpush(s,heur(s));
  while(hs>0){const u=hpop();if(CLOSED[u])continue;CLOSED[u]=1;if(u===g)break;const ui=u%N,uj=(u-ui)/N;
    for(let d=0;d<8;d++){const vi=ui+DX[d],vj=uj+DY[d];if(vi<0||vj<0||vi>=N||vj>=N)continue;const v=vj*N+vi;if(!PASS[v]||CLOSED[v])continue;const nd=G[u]+edgeT(u,v,d>=4);if(nd<G[v]){G[v]=nd;PREV[v]=u;hpush(v,nd+heur(v))}}}
  if(!isFinite(G[g]))return null;const p=[];for(let k=g;k!==-1;k=PREV[k])p.push(k);p.reverse();return {path:p,time:G[g]}}
function dijkstraHome(){RET.fill(Infinity);CLOSED.fill(0);hs=0;const h0=ST('H'),s=cellOf(h0.x,h0.y);RET[s]=0;hpush(s,0);
  while(hs>0){const u=hpop();if(CLOSED[u])continue;CLOSED[u]=1;const ui=u%N,uj=(u-ui)/N;
    for(let d=0;d<8;d++){const vi=ui+DX[d],vj=uj+DY[d];if(vi<0||vj<0||vi>=N||vj>=N)continue;const v=vj*N+vi;if(!PASS[v]||CLOSED[v])continue;const nd=RET[u]+edgeT(v,u,d>=4);if(nd<RET[v]){RET[v]=nd;hpush(v,nd)}}}}
function stopsActive(){const h0=ST('H'),a=[{id:'H',name:h0.name,x:h0.x,y:h0.y,dwell:0,kind:'h'}];
  for(const s of seq){if(s.k==='st'){if(s.on){const t=ST(s.id);a.push({id:t.id,name:t.name,x:t.x,y:t.y,dwell:t.dwell,kind:'st'})}}else a.push({id:s.id,name:'Punto de paso',x:s.x,y:s.y,dwell:0,kind:'wp'})}
  a.push({id:'H',name:h0.name,x:h0.x,y:h0.y,dwell:0,kind:'h'});return a}
function recalcRoute(){const stops=stopsActive();legs=[];
  for(let n=0;n<stops.length-1;n++){const A=stops[n],B=stops[n+1],r=astar(cellOf(A.x,A.y),cellOf(B.x,B.y)),leg={from:A,to:B,ok:!!r};
    if(r){let dist=0,maxS=0,sandM=0,up=0,down=0,svfT=0,maxRet=0;const prof=[];
      for(let q=0;q<r.path.length;q++){const k=r.path[q];
        if(q>0){const p=r.path[q-1],diag=(Math.abs(k-p)!==1&&Math.abs(k-p)!==N),dl=diag?CELL*1.41421:CELL;dist+=dl;if(SAND[k]>.5)sandM+=dl;const dh=H[k]-H[p];if(dh>0)up+=dh;else down-=dh;svfT+=edgeT(p,k,diag)/3600*SVF[k]}
        if(SL[k]>maxS)maxS=SL[k];if(RET[k]>maxRet)maxRet=RET[k];prof.push([dist,H[k],SL[k]])}
      Object.assign(leg,{path:r.path,time:r.time,dist,maxS,sandM,up,down,svfT,maxRet,prof,svfStop:SVF[cellOf(B.x,B.y)]})}
    legs.push(leg)}
  hudLeg=Math.max(0,Math.min(hudLeg,legs.length-1))}
function tempAir(t){const Tmax=SITE.tmax-13*(params.tau-.6),Tmin=SITE.tmin+9*(params.tau-.6);let f;
  if(t>=6&&t<=14)f=Math.sin((t-6)/8*Math.PI/2);else{const dt=t>14?t-14:t+10;f=Math.exp(-dt/3.2)}return Tmin+(Tmax-Tmin)*f}
function sunPos(t){const Hh=(t-12)*15*Math.PI/180,el=Math.asin(Math.sin(PHI)*Math.sin(DEC)+Math.cos(PHI)*Math.cos(DEC)*Math.cos(Hh));
  const az=Math.atan2(-Math.cos(DEC)*Math.sin(Hh),Math.sin(DEC)*Math.cos(PHI)-Math.cos(DEC)*Math.sin(PHI)*Math.cos(Hh))*180/Math.PI;return {el:el*180/Math.PI,az:(az+360)%360}}
function computeTotals(){const rate=SEP[params.sep].rate;let t=params.start+EGRESS,walk=0,dwell=0,dist=0,dose=0,cons=EGRESS*.9,maxRet=0,tmin=Infinity,failed=false;
  legs.forEach(l=>{l.t0=t;if(!l.ok){failed=true;l.t1=t;return}t+=l.time/3600;walk+=l.time/3600;dist+=l.dist;dose+=l.svfT*rate;cons+=l.time/3600*1.3;maxRet=Math.max(maxRet,l.maxRet);l.t1=t;
    if(l.to.dwell){const dh=l.to.dwell/60;t+=dh;dwell+=dh;dose+=dh*rate*l.svfStop;cons+=dh}l.consAfter=cons/PLSS});
  const tEnd=t+INGRESS;cons+=INGRESS*.9;for(let s=params.start;s<=tEnd;s+=.1)tmin=Math.min(tmin,tempAir(s));
  totals={walk,dwell,dist,dose,cons:cons/PLSS,tEnd,dur:tEnd-params.start,maxRet,tmin,failed,shelter:params.rover?Math.min(maxRet/60,10):maxRet/60}}

// ================= capas =================
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const cOpt=mk(N,N),cTopo=mk(N,N),cSlope=mk(N,N),cUnits=mk(N,N),cTher=mk(N,N),cHaz=mk(N,N),cRad=mk(N,N),cIce=mk(N,N),cPerc=mk(N,N),cCont=mk(600,600),cIso=mk(600,600);
function ramp(st,t){t=clamp(t,0,1)*(st.length-1);const i=Math.min(Math.floor(t),st.length-2),f=t-i,a=st[i],b=st[i+1];return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]}
const R_TOPO=[[38,58,108],[52,124,140],[150,182,120],[222,184,110],[214,118,72],[244,236,226]];
const R_THER=[[22,20,60],[96,36,128],[196,64,92],[240,128,56],[250,222,120]];
const R_RAD=[[56,30,96],[48,90,150],[38,150,140],[110,200,96],[250,228,60]];
const R_ICE=[[230,250,255],[143,227,255],[59,123,255],[30,60,150],[14,24,60]];
const R_PERC=[[40,40,60],[120,60,120],[220,90,120],[250,200,120]];
let hmin,hmax,svfMin;
function paint(c,fn){const x=c.getContext('2d'),im=x.createImageData(c.width,c.height),d=im.data;for(let k=0;k<c.width*c.height;k++){const o=fn(k);d[k*4]=o[0];d[k*4+1]=o[1];d[k*4+2]=o[2];d[k*4+3]=o[3]==null?255:o[3]}x.putImageData(im,0,0)}
function renderStatic(){hmin=Infinity;hmax=-Infinity;svfMin=1;for(let k=0;k<NN;k++){if(H[k]<hmin)hmin=H[k];if(H[k]>hmax)hmax=H[k];if(SVF[k]<svfMin)svfMin=SVF[k]}
  paint(cTopo,k=>ramp(R_TOPO,(H[k]-hmin)/(hmax-hmin)));
  paint(cSlope,k=>{const s=SL[k];if(s<10)return [0,0,0,0];if(s<18)return [231,211,106,200];if(s<=25)return [238,154,69,225];return [236,80,70,245]});
  paint(cUnits,k=>SITE.units[MIN[k]].c);
  paint(cTher,k=>ramp(R_THER,(TI[k]-150)/950));
  paint(cHaz,k=>{const i=k%N,j=(k-i)/N;if(ROCK[k]>.25)return [236,90,70,Math.round(ROCK[k]*255)];if(SAND[k]>.5&&((i+j)%4<2))return [231,190,80,210];if(CHAN[k]>.05&&SL[k]>20)return [236,80,70,230];return [0,0,0,0]});
  paint(cRad,k=>ramp(R_RAD,(SVF[k]-svfMin)/(1-svfMin+1e-6)));
  paint(cIce,k=>ramp(R_ICE,ICE[k]/2));
  paint(cPerc,k=>ramp(R_PERC,PERC[k]));
  const W=600,sc=N/W,h2=new Float32Array(W*W),iv=SITE.id==='arc'?1:2;
  for(let y=0;y<W;y++)for(let x=0;x<W;x++)h2[y*W+x]=sampleF(H,x*sc-.5+sc/2,y*sc-.5+sc/2);
  paint(cCont,p=>{const x=p%W,y=(p-x)/W;if(x>=W-1||y>=W-1)return [0,0,0,0];const a=Math.floor(h2[p]/iv),b=Math.floor(h2[p+1]/iv),c=Math.floor(h2[p+W]/iv);
    if(a!==b||a!==c)return Math.max(a,b,c)%5===0?[250,244,232,230]:[250,244,232,100];return [0,0,0,0]})}
function renderIso(){const W=600,rs=new Float32Array(W*W);for(let y=0;y<W;y++)for(let x=0;x<W;x++){const k=cellOf((x+.5)*AREA/W,(y+.5)*AREA/W);rs[y*W+x]=isFinite(RET[k])?RET[k]/60:999}
  const cols=[[124,196,138],[231,185,76],[238,154,69],[236,106,85]];
  paint(cIso,p=>{const x=p%W,y=(p-x)/W,v=rs[p];if(v>60)return [236,106,85,v>900?40:55];if(x>=W-1||y>=W-1)return [0,0,0,0];const a=Math.floor(v/15),b=Math.floor(rs[p+1]/15),c=Math.floor(rs[p+W]/15);if((a!==b||a!==c)&&a<4)return [...cols[a],255];return [0,0,0,0]})}
function renderOptical(){const s=sunPos(params.start),el=s.el*Math.PI/180,az=s.az*Math.PI/180;
  const Lx=Math.cos(el)*Math.sin(az),Ly=-Math.cos(el)*Math.cos(az),Lz=Math.sin(el),day=clamp(s.el/12,0,1),amb=.28+.12*day,ex=SITE.id==='arc'?5:2.2;
  paint(cOpt,k=>{const i=k%N,j=(k-i)/N,il=Math.max(0,i-1),ir=Math.min(N-1,i+1),ju=Math.max(0,j-1),jd=Math.min(N-1,j+1);
    const gx=(H[j*N+ir]-H[j*N+il])/((ir-il)*CELL)*ex,gy=(H[jd*N+i]-H[ju*N+i])/((jd-ju)*CELL)*ex,sh=Math.max(0,(-gx*Lx-gy*Ly+Lz)/Math.hypot(gx,gy,1));
    let [r,g,b]=SITE.albedo(k,i,j);const n=hash(i,j,77);if(n<ROCK[k]*.55){r*=.55;g*=.55;b*=.55}else if(n>1-ROCK[k]*.25){r*=1.15;g*=1.12;b*=1.1}
    const f=(amb+(1.05-amb)*sh*day)*(.92+.16*hash(i,j,5));return [clamp(r*f,0,255),clamp(g*f,0,255),clamp(b*f,0,255)]})}

// ================= mapa 2D =================
const map=$('sxMap'),ctx=map.getContext('2d'),S=900,PX=S/AREA;
const LY=()=>SITE.layers.map(id=>Object.assign({id},LAYERDEF[id]));
let LS=1;
function drawMap(){
  LS=clamp(S/(map.clientWidth||S),1,2.4);
  ctx.globalAlpha=1;ctx.fillStyle=C.panel;ctx.fillRect(0,0,S,S);ctx.imageSmoothingEnabled=true;
  if(LAYERDEF.opt.on)ctx.drawImage(cOpt,0,0,S,S);
  const th={topo:cTopo,units:cUnits,thermal:cTher,rad:cRad,ice:cIce,perc:cPerc,haz:cHaz,slope:cSlope};
  for(const id of ['topo','ice','units','thermal','perc','rad','haz','slope'])if(SITE.layers.includes(id)&&LAYERDEF[id].on){ctx.globalAlpha=params.opac;ctx.drawImage(th[id],0,0,S,S)}
  ctx.globalAlpha=1;
  if(LAYERDEF.cont.on){ctx.globalAlpha=.5;ctx.drawImage(cCont,0,0,S,S);ctx.globalAlpha=1}
  if(LAYERDEF.iso.on)ctx.drawImage(cIso,0,0,S,S);
  if(hud){ctx.fillStyle='rgba(6,16,22,.35)';ctx.fillRect(0,0,S,S)}
  ctx.strokeStyle='rgba(238,241,247,.09)';ctx.lineWidth=1;ctx.beginPath();for(let m=200;m<AREA;m+=200){ctx.moveTo(m*PX,0);ctx.lineTo(m*PX,S);ctx.moveTo(0,m*PX);ctx.lineTo(S,m*PX)}ctx.stroke();
  if(SITE.track&&LAYERDEF.trk.on){const pts=TRACK.map(p=>[(CX+p[1])*PX,(CY+p[2])*PX]);ctx.setLineDash([6,4]);ctx.lineCap='round';ctx.strokeStyle='rgba(5,12,16,.8)';ctx.lineWidth=4.5;poly(pts);ctx.strokeStyle=C.trk;ctx.lineWidth=2;poly(pts);ctx.setLineDash([]);
    ctx.fillStyle=C.trk;pts.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],2,0,7);ctx.fill()});
    [0,18,34].forEach(i=>smallLabel('sol '+TRACK[i][0],pts[i][0]+7,pts[i][1]));
    const x=CX*PX,y=CY*PX;ctx.save();ctx.translate(x,y);ctx.rotate((ROVER.yaw)*Math.PI/180);ctx.fillStyle=C.trk;ctx.strokeStyle='#05090c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(8,8);ctx.lineTo(0,4);ctx.lineTo(-8,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();label('Curiosity · sol '+ROVER.sol,x+14,y+16)}
  legs.forEach((l,n)=>{if(!l.ok)return;const cur=!hud||n===hudLeg,pts=l.path.map(k=>[((k%N)+.5)*CELL*PX,(Math.floor(k/N)+.5)*CELL*PX]);
    ctx.lineJoin='round';ctx.lineCap='round';ctx.globalAlpha=cur?1:.28;ctx.strokeStyle='rgba(5,12,16,.85)';ctx.lineWidth=hud&&cur?8:6;poly(pts);ctx.strokeStyle=C.route;ctx.lineWidth=hud&&cur?4:2.6;poly(pts);
    ctx.fillStyle=C.route;let acc=0;for(let q=1;q<pts.length;q++){const dx=pts[q][0]-pts[q-1][0],dy=pts[q][1]-pts[q-1][1];acc+=Math.hypot(dx,dy);if(acc>70){acc=0;chev(pts[q][0],pts[q][1],Math.atan2(dy,dx))}}ctx.globalAlpha=1});
  const act=new Set(stopsActive().map(s=>s.id));
  for(const s of SITE.stations){const x=s.x*PX,y=s.y*PX,on=act.has(s.id);ctx.globalAlpha=on?1:.45;
    if(s.id===selSt){ctx.strokeStyle=C.fg;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,17,0,7);ctx.stroke()}
    ctx.fillStyle=s.id==='H'?C.fg:C.ochre;ctx.strokeStyle='#120c07';ctx.lineWidth=2;
    if(s.id==='H'){ctx.beginPath();ctx.rect(x-9,y-9,18,18);ctx.fill();ctx.stroke()}else{ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.fill();ctx.stroke()}
    ctx.fillStyle=s.id==='H'?C.bg:'#1a1108';ctx.font='600 10px "IBM Plex Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.id,x,y+.5);label(s.name,x+15,y-14);ctx.globalAlpha=1}
  for(const w of seq)if(w.k==='wp'){const x=w.x*PX,y=w.y*PX;ctx.fillStyle=C.route;ctx.strokeStyle='#06202a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-9);ctx.lineTo(x+9,y);ctx.lineTo(x,y+9);ctx.lineTo(x-9,y);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#06202a';ctx.font='600 9px "IBM Plex Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(w.id,x,y+.5)}
  if(!hud&&dosPt&&view==='2d'){const x=dosPt.x*PX,y=dosPt.y*PX;ctx.strokeStyle=C.warn;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.stroke()}
  ctx.fillStyle='rgba(8,12,16,.7)';ctx.fillRect(14,S-44,236,30);ctx.fillStyle=C.fg;ctx.fillRect(24,S-26,200*PX,4);ctx.fillStyle='#0b0f13';ctx.fillRect(24+100*PX,S-25,100*PX,2);
  ctx.fillStyle=C.fg;ctx.font='11px "IBM Plex Mono",monospace';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText('0',22,S-30);ctx.fillText('200 m',24+200*PX-14,S-30);ctx.fillText('6 m/celda',140,S-20);
  ctx.save();ctx.translate(S-34,40);ctx.fillStyle='rgba(8,12,16,.7)';ctx.beginPath();ctx.arc(0,0,22,0,7);ctx.fill();ctx.fillStyle=C.fg;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(7,8);ctx.lineTo(0,3);ctx.lineTo(-7,8);ctx.closePath();ctx.fill();ctx.font='600 10px "IBM Plex Mono",monospace';ctx.textAlign='center';ctx.fillText('N',0,19);ctx.restore();
  if(hover&&!hud){ctx.strokeStyle='rgba(238,241,247,.7)';ctx.lineWidth=1;const x=hover.x*PX,y=hover.y*PX;ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x-4,y);ctx.moveTo(x+4,y);ctx.lineTo(x+12,y);ctx.moveTo(x,y-12);ctx.lineTo(x,y-4);ctx.moveTo(x,y+4);ctx.lineTo(x,y+12);ctx.stroke()}
  if(view==='3d')upd3dTex();
}
function poly(p){ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke()}
function chev(x,y,a){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.moveTo(5,0);ctx.lineTo(-3,-4);ctx.lineTo(-3,4);ctx.closePath();ctx.fill();ctx.restore()}
function label(t,x,y){if(view==='3d')return;if(LS>1.6){const w=t.split(' · ')[0].split(' ');const n=/^(de|del|la|el)$/i.test(w[1]||'')?3:2;t=w.slice(0,n).join(' ')}const fs=Math.round(12*LS);ctx.font=`500 ${fs}px "IBM Plex Sans",sans-serif`;const w=ctx.measureText(t).width;x+=(LS-1)*10;if(x+w+8>S)x=x-w-38-(LS-1)*20;ctx.fillStyle='rgba(8,12,16,.72)';ctx.fillRect(x-4,y-fs*.75,w+8,fs*1.5);ctx.fillStyle=C.fg;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t,x,y)}
function smallLabel(t,x,y){if(view==='3d')return;ctx.font='10px "IBM Plex Mono",monospace';const w=ctx.measureText(t).width;ctx.fillStyle='rgba(8,12,16,.7)';ctx.fillRect(x-3,y-7,w+6,14);ctx.fillStyle=C.trk;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t,x,y)}

// ================= interacción =================
const readout=$('sxReadout'),toast=$('sxToast');
function evPos(e){const r=map.getBoundingClientRect();return {x:clamp((e.clientX-r.left)/r.width*AREA,0,AREA-1),y:clamp((e.clientY-r.top)/r.height*AREA,0,AREA-1)}}
const latlonV=(x,y)=>[LAT0-(y-CY)/MPD,LON0+(x-CX)/(MPD*Math.cos(PHI))];
const latlon=(x,y)=>{const [a,b]=latlonV(x,y);return fmt(Math.abs(a),4)+'° '+(a<0?'S':'N')+' · '+fmt(b,4)+'° E'};
const bearing=(a,b)=>(Math.atan2(b.x-a.x,-(b.y-a.y))*180/Math.PI+360)%360;
const CARD=['N','NE','E','SE','S','SO','O','NO'],cardOf=b=>CARD[Math.round(b/45)%8];
map.addEventListener('mousemove',e=>{hover=evPos(e);const k=cellOf(hover.x,hover.y);
  readout.innerHTML=`<span>${latlon(hover.x,hover.y)}</span><span>Elev <b>${fmt(H[k],0)} m</b></span><span>Pend <b>${fmt(SL[k],1)}°</b>${PASS[k]?'':' <b style="color:var(--crit)">no transitable</b>'}</span><span><b>${SITE.terrainName(k)}</b></span><span>${SITE.units[MIN[k]].n}</span>${SITE.id==='arc'?`<span>Hielo <b>${ICE[k]<.02?'expuesto':fmt(ICE[k],1)+' m'}</b></span>`:''}<span>Regreso <b>${isFinite(RET[k])?mins(RET[k])+' min':'—'}</b></span>`;drawMap()});
map.addEventListener('mouseleave',()=>{hover=null;drawMap()});
map.addEventListener('click',e=>{if(hud)return;const p=evPos(e);toast.textContent='';const hit=SITE.stations.find(s=>Math.hypot(s.x-p.x,s.y-p.y)<40);
  if(mode==='inspect'){dosPt=hit?{x:hit.x,y:hit.y}:p;if(hit){selSt=hit.id;renderPanoSection()}renderDossier();drawMap();showTab('punto');return}
  if(hit){selSt=hit.id;renderPanoSection();drawMap();return}
  if(seq.find(s=>s.k==='wp'&&Math.hypot(s.x-p.x,s.y-p.y)<30))return;
  const k=cellOf(p.x,p.y);if(!PASS[k]){toast.textContent=`No se puede pasar por ahí: ${SITE.terrainName(k).toLowerCase()}, pendiente ${fmt(SL[k],0)}°.`;return}
  addWaypoint(((k%N)+.5)*CELL,(Math.floor(k/N)+.5)*CELL)});
function setMode(m){mode=m;$('sxInspect').classList.toggle('on',m==='inspect');$('sxAdd').classList.toggle('on',m==='add');$('sxInspect').setAttribute('aria-pressed',m==='inspect');$('sxAdd').setAttribute('aria-pressed',m==='add');toast.textContent=m==='add'?'Toca un lugar transitable del mapa.':''}
$('sxInspect').addEventListener('click',()=>{setView('2d');setMode('inspect')});$('sxAdd').addEventListener('click',()=>{setView('2d');setMode('add')});
function addWaypoint(x,y){wpCount++;const w={k:'wp',id:'P'+wpCount,x,y},h0=ST('H');
  const act=[{x:h0.x,y:h0.y,si:-1}];seq.forEach((s,si)=>{if(s.k==='wp'||s.on){const t=s.k==='st'?ST(s.id):s;act.push({x:t.x,y:t.y,si})}});act.push({x:h0.x,y:h0.y,si:seq.length});
  let best=0,bc=Infinity;for(let n=0;n<act.length-1;n++){const a=act[n],b=act[n+1],c=Math.hypot(a.x-x,a.y-y)+Math.hypot(b.x-x,b.y-y)-Math.hypot(a.x-b.x,a.y-b.y);if(c<bc){bc=c;best=n}}
  seq.splice(act[best+1].si,0,w);update(true)}

// ================= dossier =================
function renderDossier(){const p=dosPt,k=cellOf(p.x,p.y);let ns=null,nd=1e9;SITE.stations.forEach(s=>{const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<nd){nd=d;ns=s}});
  const sun=sunPos(params.start),rate=SEP[params.sep].rate*SVF[k]*1000,v=$('sxVerdict');let cls='',txt;const tn=SITE.terrainName(k).toLowerCase();
  if(!PASS[k]){cls='crit';txt=`No transitable a pie: ${tn} con pendiente de ${fmt(SL[k],0)}°. Rodear.`}
  else if(SL[k]>18||SAND[k]>.5||ROCK[k]>.4){cls='warn';txt=`Transitable con precaución: ${tn}, ${fmt(SL[k],0)}° de pendiente.`}
  else txt=`Transitable: ${tn}, ${fmt(SL[k],0)}° de pendiente.`;
  v.className='verdict '+cls;v.textContent=txt+' Interés científico '+SITE.interest(k)+'.';
  $('sxWhere').textContent=latlon(p.x,p.y);
  const it=(a,b,c)=>`<div><div class="k">${a}</div><div class="v">${b}</div><div class="s">${c}</div></div>`;
  $('sxDossier').innerHTML=it('Elevación',fmt(H[k],0)+' m','DTM · MOLA')+it('Pendiente',fmt(SL[k],1)+'°','derivada del DTM')+it(SITE.unitsName,SITE.units[MIN[k]].n,SITE.unitsSrc)+
    SITE.dossierExtra(k,p).map(e=>it(...e)).join('')+
    it('Dosis aquí',fmt(rate,0)+' µSv/h · cielo '+fmt(SVF[k]*100,0)+' %','RAD + horizonte')+it('Regreso a la base',isFinite(RET[k])?mins(RET[k])+' min a pie':'sin paso','modelo de marcha')+
    it('Parada más cercana',`${ns.id} · ${fmt(nd,0)} m al ${cardOf(bearing(p,ns))}`,'plan EVA')+it('Sol a la salida',`${fmt(sun.el,0)}° alt · ${fmt(sun.az,0)}° az`,'efemérides')+it('Aire a la salida',fmt(tempAir(params.start),0)+' °C',SITE.tSrc)}

// ================= paneles =================
const grad=st=>'linear-gradient(90deg,'+st.map(c=>`rgb(${c.join(',')})`).join(',')+')';
function renderLayers(){const el=$('sxLayers');el.innerHTML='';LAYERDEF.units.name=SITE.unitsName;LAYERDEF.units.src=SITE.unitsSrc;
  LY().forEach(l=>{const d=document.createElement('div');d.className='lyr';d.innerHTML=`<label><input type="checkbox" id="sxly-${l.id}" ${l.on?'checked':''}> ${l.name}</label><span class="src">${l.src}</span>${l.on?legendHTML(l.id):''}`;
    d.querySelector('input').addEventListener('change',ev=>{LAYERDEF[l.id].on=ev.target.checked;preset='';renderLayers();drawMap()});el.appendChild(d)});renderPresets()}
// modos rápidos de capas: una decisión en vez de once casillas
let preset='seg';
const PRESETS=[
 {id:'terreno',n:'Terreno',d:'Imagen y relieve',on:['opt','cont','trk']},
 {id:'seg',n:'Seguridad',d:'Pendientes y peligros',on:['opt','slope','haz','cont','trk']},
 {id:'ciencia',n:'Ciencia',d:'Hielo y minerales',on:['opt','ice','units','trk']},
 {id:'regreso',n:'Regreso',d:'Minutos hasta la base',on:['opt','iso','trk']},
 {id:'rad',n:'Radiación',d:'Dónde protege el relieve',on:['opt','rad','trk']}];
function applyPreset(id){const p=PRESETS.find(x=>x.id===id);if(!p)return;preset=id;
  Object.keys(LAYERDEF).forEach(k=>LAYERDEF[k].on=p.on.includes(k));if(id==='ciencia'&&SITE.id==='arc')LAYERDEF.units.on=false;
  params.opac=id==='terreno'?.6:.68;renderLayers();drawMap()}
function renderPresets(){const el=$('sxPresets');if(!el)return;el.innerHTML='';
  PRESETS.forEach(p=>{const b=document.createElement('button');b.type='button';b.className=p.id===preset?'on':'';b.setAttribute('aria-pressed',p.id===preset);b.innerHTML=`${p.n}<small>${p.d}</small>`;b.addEventListener('click',()=>applyPreset(p.id));el.appendChild(b)})}
function showTab(t){document.querySelectorAll('#sxTabs button').forEach(b=>{const on=b.dataset.tab===t;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  document.querySelectorAll('.sx-pane').forEach(p=>p.hidden=p.dataset.pane!==t)}
document.querySelectorAll('#sxTabs button').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
function legendHTML(id){
  if(id==='trk')return `<div class="legend"><div class="row"><span class="sw" style="background:repeating-linear-gradient(90deg,#f2efe8 0 4px,transparent 4px 7px)"></span>${TRACK.length} puntos · +${fmt(TRACK[TRACK.length-1][3]-TRACK[0][3],0)} m</div></div>`;
  if(id==='topo')return `<div class="legend"><div class="bar" style="background:${grad(R_TOPO)}"></div><div class="ends"><span>${fmt(hmin,0)} m</span><span>${fmt(hmax,0)} m</span></div></div>`;
  if(id==='slope')return `<div class="legend"><div class="row"><span class="sw" style="background:#e7d36a"></span>10–18° más lento</div><div class="row"><span class="sw" style="background:#ee9a45"></span>18–25° con precaución</div><div class="row"><span class="sw" style="background:#ec5046"></span>&gt; 25° prohibido a pie</div></div>`;
  if(id==='units')return `<div class="legend">${SITE.units.map(m=>`<div class="row"><span class="sw" style="background:rgb(${m.c.join(',')})"></span>${m.n}</div>`).join('')}</div>`;
  if(id==='ice')return `<div class="legend"><div class="bar" style="background:${grad(R_ICE)}"></div><div class="ends"><span>expuesto</span><span>2 m</span></div></div>`;
  if(id==='perc')return `<div class="legend"><div class="bar" style="background:${grad(R_PERC)}"></div><div class="ends"><span>0 %</span><span>1 % en peso</span></div><div>Tóxicos: limpiar el traje en la esclusa</div></div>`;
  if(id==='thermal')return `<div class="legend"><div class="bar" style="background:${grad(R_THER)}"></div><div class="ends"><span>150 arena</span><span>1100 hielo/roca</span></div></div>`;
  if(id==='haz')return `<div class="legend"><div class="row"><span class="sw" style="background:#ec5a46"></span>Bloques o escarpe</div><div class="row"><span class="sw" style="background:repeating-linear-gradient(45deg,#e7be50 0 3px,transparent 3px 6px)"></span>Arena suelta</div></div>`;
  if(id==='rad'){const r=SEP[params.sep].rate*1000;return `<div class="legend"><div class="bar" style="background:${grad(R_RAD)}"></div><div class="ends"><span>${fmt(r*svfMin,0)}</span><span>${fmt(r,0)} µSv/h</span></div></div>`}
  if(id==='iso')return `<div class="legend"><div class="row"><span class="sw" style="background:#7cc48a"></span>15 min</div><div class="row"><span class="sw" style="background:#e7b94c"></span>30 min</div><div class="row"><span class="sw" style="background:#ee9a45"></span>45 min</div><div class="row"><span class="sw" style="background:#ec6a55"></span>60 min; más allá, sombreado</div></div>`;
  return ''}
function renderStops(){const el=$('sxStops');el.innerHTML='';const h=document.createElement('div');h.className='stop';h.innerHTML=`<span></span><span class="tag h">H</span><span>${ST('H').name} · salida y regreso</span><span></span>`;el.appendChild(h);
  seq.forEach((s,i)=>{const d=document.createElement('div');d.className='stop';
    if(s.k==='st'){const t=ST(s.id);d.innerHTML=`<input type="checkbox" id="sxon-${s.id}" ${s.on?'checked':''} aria-label="Incluir ${t.name}"><span class="tag">${s.id}</span><span style="min-width:0">${t.name}${t.optional?' <span class="note">(opcional)</span>':''}</span><span class="row2" style="gap:4px"><input type="number" id="sxdw-${s.id}" min="0" max="120" step="5" value="${t.dwell}" aria-label="Minutos en ${t.name}"><span class="note">min</span></span>`;
      d.querySelector('input[type=checkbox]').addEventListener('change',ev=>{s.on=ev.target.checked;update(true)});d.querySelector('input[type=number]').addEventListener('change',ev=>{t.dwell=clamp(+ev.target.value||0,0,120);update(false)})}
    else{d.innerHTML=`<span></span><span class="tag wp">${s.id}</span><span>Punto de paso</span><button class="xbtn" type="button" aria-label="Quitar ${s.id}">Quitar</button>`;d.querySelector('button').addEventListener('click',()=>{seq.splice(i,1);update(true)})}
    el.appendChild(d)})}
let planAlerts=[];
function renderPlan(){const T=totals,cp=T.cons*100,cc=cp>75?C.crit:cp>60?C.warn:C.ok;
  $('sxTiles').innerHTML=`<div class="tile"><span class="k">Ciencia</span><span class="v">${fmt(T.dwell*60,0)} min</span></div>
   <div class="tile"><span class="k">Refugio</span><span class="v">${fmt(T.shelter,0)} min</span></div>
   <div class="tile"><span class="k">Radiación</span><span class="v">${fmt(T.dose,2)} mSv</span></div>`;
  const A=[];
  if(T.failed)A.push(['crit','Sin ruta','Un tramo no tiene paso seguro. Quita o mueve el punto de paso.']);
  if(SITE.id==='arc'&&T.dist>2100)A.push(['warn','Plan 2 km',`La ruta mide ${fmt(T.dist/1000,2)} km, más que los 2 km del plan del equipo.`]);
  if(cp>75)A.push(['crit','PLSS',`El plan usa el ${fmt(cp,0)} % de los consumibles. La reserva mínima es 25 %.`]);else if(cp>60)A.push(['warn','PLSS',`Consumibles al ${fmt(cp,0)} %. Margen justo para un retraso.`]);
  if(T.tEnd>SUNSET)A.push(['crit','Luz',`La EVA termina a las ${hhmm(T.tEnd)}, después de la puesta de sol (${hhmm(SUNSET)}).`]);else if(T.tEnd>SUNSET-1)A.push(['warn','Luz',`Regreso a las ${hhmm(T.tEnd)}, menos de una hora antes de la puesta de sol.`]);
  if(T.tmin<-60)A.push(['warn','Frío',`El aire baja a ${fmt(T.tmin,0)} °C durante la salida. Sal más tarde o acorta la EVA.`]);
  legs.forEach(l=>{if(!l.ok)return;const nm=`${l.from.id}→${l.to.id}`;if(l.maxS>18)A.push(['warn','Pendiente',`Tramo ${nm}: pendiente máxima ${fmt(l.maxS,0)}°.`]);if(l.sandM>60)A.push(['warn','Arena',`Tramo ${nm}: ${fmt(l.sandM,0)} m de arena suelta.`])});
  if(params.sep==='strong')A.push(['crit','Radiación','Tormenta solar: no iniciar la EVA. Si ya salieron, ir al refugio de inmediato.']);
  else if(params.sep==='mod'&&T.shelter>20)A.push(['warn','Radiación',`Evento solar: el punto más lejano está a ${fmt(T.shelter,0)} min del refugio.`]);
  if(SITE.id==='arc')A.push(['warn','Percloratos','El polvo de Arcadia contiene percloratos. Limpiar el traje en la esclusa antes de entrar a la nave.']);
  if(SITE.id==='gale')A.push(['warn','Datos','El último reporte público de REMS es del sol 4995 (78 soles atrás).']);
  if(!A.some(a=>a[0]==='crit'||a[1]==='PLSS'||a[1]==='Luz'))A.unshift(['ok','Listo','El plan cumple los márgenes de seguridad.']);
  const nCrit=A.filter(a=>a[0]==='crit').length,nWarn=A.filter(a=>a[0]==='warn'&&a[1]!=='Percloratos'&&a[1]!=='Datos').length;
  const stc=nCrit?C.crit:nWarn?C.warn:C.ok,stt=nCrit?'No salir todavía':nWarn?`Revisar ${nWarn} ${nWarn>1?'avisos':'aviso'}`:'Lista para salir';
  $('sxStrip').innerHTML=`<div class="m"><span class="k">Distancia</span><span class="v">${fmt(T.dist/1000,2)} km</span></div>
   <div class="m"><span class="k">Duración · ${hhmm(params.start)} a ${hhmm(T.tEnd)}</span><span class="v">${Math.floor(T.dur)} h ${String(Math.round(T.dur%1*60)).padStart(2,'0')} min</span></div>
   <div class="m"><span class="k">Oxígeno y energía usados</span><span class="v" style="color:${cc}">${fmt(cp,0)} %</span><div class="bar"><i style="width:${clamp(cp,0,100)}%;background:${cc}"></i></div></div>
   <div class="m st"><span class="dot" style="background:${stc};box-shadow:0 0 0 4px ${stc}33"></span><span class="k">Estado</span><span class="v" style="font-size:16px;font-family:var(--f-body)">${stt}</span></div>`;
  planAlerts=A;$('sxAlerts').innerHTML=A.map(a=>`<li class="${a[0]}"><span class="pill">${a[1]}</span><span>${a[2]}</span></li>`).join('');
  $('sxLegs').innerHTML='<tr><th>Tramo</th><th>km</th><th>min</th><th>máx °</th><th>Llega</th></tr>'+legs.map(l=>l.ok?`<tr><td>${l.from.id} → ${l.to.id}</td><td>${fmt(l.dist/1000,2)}</td><td>${mins(l.time)}</td><td style="color:${l.maxS>18?C.warn:'inherit'}">${fmt(l.maxS,0)}</td><td>${hhmm(l.t1)}</td></tr>`:`<tr><td>${l.from.id} → ${l.to.id}</td><td colspan="4" style="color:var(--crit)">sin paso seguro</td></tr>`).join('');
  $('sxCrew').innerHTML=SITE.crew.map(c=>`<li>${c}</li>`).join('')}
function drawProfile(){const c=$('sxProfile'),g=c.getContext('2d'),W=c.width,Hh=c.height,ml=52,mr=12,mt=26,mb=28;g.clearRect(0,0,W,Hh);
  const pts=[],marks=[];let off=0;legs.forEach(l=>{if(!l.ok)return;l.prof.forEach(p=>pts.push([off+p[0],p[1],p[2]]));off+=l.dist;marks.push([off,l.to.id])});if(pts.length<2)return;
  const tot=off;let lo=Infinity,hi=-Infinity;pts.forEach(p=>{lo=Math.min(lo,p[1]);hi=Math.max(hi,p[1])});const span=Math.max(10,hi-lo),stp=span>120?40:span>60?20:span>25?10:2;lo=Math.floor((lo-1)/stp)*stp;hi=Math.ceil((hi+1)/stp)*stp;
  const X=d=>ml+d/tot*(W-ml-mr),Y=h=>mt+(1-(h-lo)/(hi-lo))*(Hh-mt-mb);g.font='11px "IBM Plex Mono",monospace';g.fillStyle=C.mute;g.strokeStyle='rgba(238,241,247,.08)';g.lineWidth=1;
  for(let h=lo;h<=hi+.01;h+=stp){g.beginPath();g.moveTo(ml,Y(h));g.lineTo(W-mr,Y(h));g.stroke();g.textAlign='right';g.textBaseline='middle';g.fillText(fmt(h,0),ml-6,Y(h))}
  const ks=tot>3000?1000:tot>1200?500:250;for(let d=0;d<=tot;d+=ks){g.textAlign='center';g.textBaseline='top';g.fillText(fmt(d/1000,2)+' km',X(d),Hh-mb+8)}
  g.beginPath();g.moveTo(X(0),Y(lo));pts.forEach(p=>g.lineTo(X(p[0]),Y(p[1])));g.lineTo(X(tot),Y(lo));g.closePath();g.fillStyle='rgba(143,227,255,.10)';g.fill();
  g.lineWidth=2.2;for(let i=1;i<pts.length;i++){const s=pts[i][2];g.strokeStyle=s<10?C.route:s<18?'#e7d36a':'#ee9a45';g.beginPath();g.moveTo(X(pts[i-1][0]),Y(pts[i-1][1]));g.lineTo(X(pts[i][0]),Y(pts[i][1]));g.stroke()}
  g.textBaseline='alphabetic';marks.forEach(([d,id],i)=>{const x=X(d);g.strokeStyle='rgba(238,241,247,.25)';g.setLineDash([3,3]);g.beginPath();g.moveTo(x,mt-4);g.lineTo(x,Hh-mb);g.stroke();g.setLineDash([]);g.fillStyle=id==='H'?C.fg:id[0]==='P'?C.route:C.ochre;g.font='600 11px "IBM Plex Mono",monospace';g.textAlign=i===marks.length-1?'right':'center';g.fillText(id,x,mt-8)});
  g.fillStyle=C.fg;g.textAlign='left';g.fillText('H',X(0),mt-8);$('sxProfMeta').textContent=`+${fmt(legs.reduce((a,l)=>a+(l.up||0),0),0)} m / −${fmt(legs.reduce((a,l)=>a+(l.down||0),0),0)} m`}
function drawThermo(){const c=$('sxThermo'),g=c.getContext('2d'),W=c.width,Hh=c.height,ml=40,mr=10,mt=14,mb=26;g.clearRect(0,0,W,Hh);const t0=5,t1=20,lo=-100,hi=0,X=t=>ml+(t-t0)/(t1-t0)*(W-ml-mr),Y=v=>mt+(1-(v-lo)/(hi-lo))*(Hh-mt-mb);
  g.fillStyle='rgba(60,80,140,.2)';g.fillRect(X(t0),mt,X(SUNRISE)-X(t0),Hh-mt-mb);g.fillRect(X(SUNSET),mt,X(t1)-X(SUNSET),Hh-mt-mb);g.font='11px "IBM Plex Mono",monospace';g.strokeStyle='rgba(238,241,247,.08)';g.fillStyle=C.mute;
  for(let v=lo;v<=hi;v+=20){g.beginPath();g.moveTo(ml,Y(v));g.lineTo(W-mr,Y(v));g.stroke();g.textAlign='right';g.textBaseline='middle';g.fillText(v+'°',ml-5,Y(v))}
  for(let t=6;t<=20;t+=2){g.textAlign='center';g.textBaseline='top';g.fillText(String(t).padStart(2,'0')+'h',X(t),Hh-mb+7)}
  const T=totals;g.fillStyle='rgba(232,137,74,.22)';g.fillRect(X(params.start),mt,X(Math.min(T.tEnd,t1))-X(params.start),Hh-mt-mb);
  g.strokeStyle='rgba(236,106,85,.5)';g.setLineDash([4,4]);g.beginPath();g.moveTo(ml,Y(-60));g.lineTo(W-mr,Y(-60));g.stroke();g.setLineDash([]);g.fillStyle=C.crit;g.textAlign='left';g.textBaseline='bottom';g.fillText('límite de confort del traje −60°',ml+4,Y(-60)-2);
  g.strokeStyle=C.ochre;g.lineWidth=2;g.beginPath();for(let t=t0;t<=t1+.01;t+=.1){const x=X(t),y=Y(tempAir(t));t===t0?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();g.fillStyle=C.fg;g.textBaseline='top';g.fillText('EVA',X(params.start)+4,mt+3);
  const s=sunPos(params.start);$('sxAtmo').innerHTML=`<dt>Sol (hora solar)</dt><dd>sale ${hhmm(SUNRISE)} · se pone ${hhmm(SUNSET)}</dd><dt>Sol a la salida</dt><dd>${fmt(s.el,0)}° alt · ${fmt(s.az,0)}° az</dd><dt>Aire a la salida</dt><dd>${fmt(tempAir(params.start),0)} °C</dd><dt>Mínima en la EVA</dt><dd>${fmt(T.tmin,0)} °C</dd><dt>Presión</dt><dd>${SITE.p} Pa</dd><dt>Fuente</dt><dd>${SITE.tSrc}</dd><dt>Estación</dt><dd>Ls ≈ 24° · primavera boreal</dd>`}
function renderRad(){const T=totals,r=SEP[params.sep].rate;$('sxRad').innerHTML=`<dt>Estado real hoy</dt><dd>Kp ${SWX.kp} · ${SWX.level.toLowerCase()}</dd><dt>Tasa en terreno abierto</dt><dd>${fmt(r*1000,0)} µSv/h</dd><dt>Dosis de la EVA</dt><dd>${fmt(T.dose,2)} mSv</dd><dt>Equivale a</dt><dd>${fmt(T.dose/.67,1)} días en superficie</dd><dt>Refugio más lejano</dt><dd>${fmt(T.shelter,0)} min</dd>`;
  const a=$('sxRadAction');if(params.sep==='quiet'){a.className='action';a.textContent='Sin restricción. Llevar el dosímetro encendido toda la caminata.'}
  else if(params.sep==='mod'){a.className='action warn';a.textContent='Quedarse a menos de 20 min de la nave. Acortar las paradas y suspender las opcionales.'}
  else{a.className='action crit';a.textContent='No iniciar la EVA. Si el astronauta está fuera, volver al refugio. El aviso llega de 20 a 60 min después de la alerta de rayos X.'}}

// ================= panorama =================
function horizon(st){const h0=hAt(st.x,st.y)+1.7,loc=new Float32Array(360),far=new Float32Array(360);
  for(let a=0;a<360;a++){const az=a*Math.PI/180,dx=Math.sin(az),dy=-Math.cos(az);let mx=-8;
    for(let r=6;r<1500;r+=3+r*.02){const x=st.x+dx*r,y=st.y+dy*r;if(x<0||y<0||x>=AREA||y>=AREA)break;const ang=Math.atan2((hAt(x,y)-h0)*params.vex-r*r/(2*3389500),r)*180/Math.PI;if(ang>mx)mx=ang}
    loc[a]=mx;far[a]=SITE.far(a)*Math.min(params.vex,2.2)}return {loc,far}}
function drawPano(){const c=$('sxPano'),g=c.getContext('2d'),W=c.width,Hh=c.height,ppd=W/360,top=30,horY=Hh*.62,st=ST(selSt);if(!st)return;const {loc,far}=horizon(st);
  const Y=ang=>horY-ang*ppd,s=sunPos(params.start),day=clamp(s.el/15,0,1),cx=a=>a*ppd;
  const sky=g.createLinearGradient(0,0,0,horY);sky.addColorStop(0,`rgb(${118*day+20},${92*day+18},${70*day+26})`);sky.addColorStop(1,`rgb(${214*day+30},${168*day+26},${120*day+34})`);g.fillStyle=sky;g.fillRect(0,0,W,Hh);
  g.fillStyle=`rgb(${150*day+30},${104*day+24},${80*day+22})`;g.beginPath();g.moveTo(0,Hh);for(let a=0;a<=360;a++)g.lineTo(cx(a),Y(far[a%360]));g.lineTo(W,Hh);g.closePath();g.fill();
  g.fillStyle=`rgb(${126*day+20},${84*day+16},${58*day+14})`;g.beginPath();g.moveTo(0,Hh);for(let a=0;a<=360;a++)g.lineTo(cx(a),Y(Math.max(loc[a%360],-6)));g.lineTo(W,Hh);g.closePath();g.fill();
  const gr=g.createLinearGradient(0,horY,0,Hh);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=gr;g.fillRect(0,horY,W,Hh-horY);
  if(s.el>-2){const y=Y(s.el);if(y>4){g.fillStyle='rgba(255,246,220,.95)';g.beginPath();g.arc(cx(s.az),Math.max(y,10),7,0,7);g.fill()}}
  g.font='600 12px "IBM Plex Mono",monospace';g.textAlign='center';g.textBaseline='bottom';const card={0:'N',45:'NE',90:'E',135:'SE',180:'S',225:'SO',270:'O',315:'NO'};
  for(let a=0;a<360;a+=15){const x=cx(a);g.fillStyle='rgba(238,241,247,.85)';g.fillRect(x,Hh-10,1,a%45?5:10);if(card[a]!=null)g.fillText(card[a],x+(a===0?10:0),Hh-12)}
  const targets=SITE.stations.filter(o=>o.id!==st.id).concat(SITE.track?[{id:'MSL',x:CX,y:CY}]:[]);
  targets.forEach(o=>{const b=bearing(st,o),d=Math.hypot(o.x-st.x,o.y-st.y),ang=Math.atan2((hAt(o.x,o.y)-hAt(st.x,st.y)-1.7)*params.vex,d)*180/Math.PI,x=cx(b),y=Y(ang),col=o.id==='H'||o.id==='MSL'?C.fg:C.ochre;
    g.strokeStyle=col;g.lineWidth=1.5;g.beginPath();g.moveTo(x,y);g.lineTo(x,top+6);g.stroke();const t=`${o.id==='MSL'?'Curiosity':o.id} · ${fmt(d,0)} m`,w=g.measureText(t).width;g.fillStyle='rgba(8,12,16,.75)';g.fillRect(x-w/2-5,top-12,w+10,18);g.fillStyle=col;g.textBaseline='middle';g.fillText(t,x,top-3);g.textBaseline='bottom'});
  g.fillStyle='rgba(8,12,16,.7)';g.fillRect(6,Hh-40,280,22);g.fillStyle=C.fg;g.textAlign='left';g.textBaseline='middle';g.font='11px "IBM Plex Mono",monospace';g.fillText(`${SITE.short} · ${st.id} · ${hhmm(params.start)} · exageración ×${params.vex}`,12,Hh-29);
  const box=c.parentElement,next=legs.find(l=>l.from.id===st.id);if(next&&box.clientWidth)box.scrollLeft=clamp(cx(bearing(st,next.to))-box.clientWidth/2,0,W)}
function renderPanoSection(){const tabs=$('sxStTabs');tabs.innerHTML='';
  SITE.stations.forEach(s=>{const b=document.createElement('button');b.type='button';b.textContent=`${s.id} · ${s.name}`;if(s.id===selSt)b.className='on';b.setAttribute('aria-pressed',s.id===selSt);b.addEventListener('click',()=>{selSt=s.id;renderPanoSection();drawMap()});tabs.appendChild(b)});
  const s=ST(selSt),k=cellOf(s.x,s.y);
  $('sxStInfo').innerHTML=`<div><h3>Objetivo científico</h3><p>${s.obj}</p></div><div><h3>Qué vas a ver</h3><p>${s.see}</p></div><div><h3>Equipo y datos del punto</h3><p>${s.tools}</p><p class="mono" style="font-size:12px;color:var(--mute)">${latlon(s.x,s.y)} · ${fmt(H[k],0)} m · ${SITE.units[MIN[k]].n.toLowerCase()}</p></div>`;drawPano()}

// ================= HUD =================
function renderHud(){const box=$('sxHud');box.hidden=!hud;if(!hud)return;const l=legs[hudLeg],card=$('sxHudCard');if(!l||!l.ok){card.innerHTML='<div class="big">Sin ruta para este tramo</div>';return}
  const b=bearing(l.from,l.to);
  card.innerHTML=`<div class="rowh" style="justify-content:space-between;align-items:center"><span>TRAMO ${hudLeg+1}/${legs.length}</span><span class="row2" style="gap:6px"><button type="button" id="sxHPrev">Anterior</button><button type="button" id="sxHNext">Siguiente</button></span></div>
   <div class="big">${l.from.id} → ${l.to.id} · ${l.to.name}</div>
   <div class="rowh"><span>DIST ${fmt(l.dist,0)} m</span><span>RUMBO ${String(Math.round(b)).padStart(3,'0')}°</span><span>TIEMPO ${mins(l.time)} min</span><span>PEND MÁX ${fmt(l.maxS,0)}°</span><span>▲${fmt(l.up,0)} ▼${fmt(l.down,0)} m</span></div>
   <div class="rowh"><span>LLEGADA ${hhmm(l.t1)}</span><span>PLSS ${fmt(100-l.consAfter*100,0)} % al salir de ${l.to.id}</span><span>REFUGIO ${params.rover?'≤ 10':fmt(l.maxRet/60,0)} min</span><span>Kp ${SWX.kp}</span><span>ENLACE ${fmt(geom(Date.now()).light/60,1)} min</span>${l.sandM>60?`<span style="color:var(--warn)">ARENA ${fmt(l.sandM,0)} m</span>`:''}</div>`;
  $('sxHPrev').addEventListener('click',()=>{hudLeg=(hudLeg-1+legs.length)%legs.length;renderHud();drawMap()});$('sxHNext').addEventListener('click',()=>{hudLeg=(hudLeg+1)%legs.length;renderHud();drawMap()});
  const c=$('sxTape'),g=c.getContext('2d'),W=c.width,Hh=c.height,ppd=W/120;g.clearRect(0,0,W,Hh);const X=a=>W/2+(((a-b+540)%360)-180)*ppd,names={0:'N',45:'NE',90:'E',135:'SE',180:'S',225:'SO',270:'O',315:'NO'};
  g.strokeStyle=C.route;g.fillStyle=C.route;g.font='500 12px "IBM Plex Mono",monospace';g.textAlign='center';
  for(let a=0;a<360;a+=5){const x=X(a);if(x<0||x>W)continue;g.globalAlpha=.8;g.beginPath();g.moveTo(x,Hh);g.lineTo(x,Hh-(a%15?6:12));g.stroke();if(a%45===0)g.fillText(names[a],x,Hh-18);else if(a%15===0){g.globalAlpha=.55;g.fillText(a,x,Hh-18)}}
  g.globalAlpha=1;const sp=sunPos(params.start),xs=X(sp.az);if(xs>0&&xs<W){g.fillStyle='#ffe9b8';g.beginPath();g.arc(xs,14,6,0,7);g.fill()}
  const xh=X(bearing(l.from,ST('H')));if(xh>0&&xh<W&&l.from.id!=='H'){g.fillStyle=C.fg;g.fillRect(xh-6,8,12,12);g.fillStyle=C.bg;g.font='600 9px "IBM Plex Mono",monospace';g.fillText('H',xh,18)}
  g.fillStyle='#dff7fc';g.beginPath();g.moveTo(W/2,24);g.lineTo(W/2-8,6);g.lineTo(W/2+8,6);g.closePath();g.fill()}
$('sxHudBtn').addEventListener('click',e=>{hud=!hud;if(hud)setView('2d');e.currentTarget.classList.toggle('on',hud);e.currentTarget.setAttribute('aria-pressed',hud);renderHud();drawMap()});

// ================= VISTA 3D =================
let R3=null,walkT=0,walking=false,lastTs=0;
function init3d(){
  if(R3)return true;if(typeof THREE==='undefined'){toast.textContent='La vista 3D necesita internet para cargar Three.js.';return false}
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true})}catch(e){toast.textContent='Este navegador no puede mostrar 3D (WebGL).';return false}
  const box=$('sx3d');box.appendChild(renderer.domElement);renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x0A1020);scene.fog=new THREE.Fog(0x0A1020,260,520);
  const cam=new THREE.PerspectiveCamera(42,1,.5,2000);
  const tex=new THREE.CanvasTexture(map);tex.anisotropy=4;
  const seg=150,geo=new THREE.PlaneGeometry(180,180,seg,seg);geo.rotateX(-Math.PI/2);
  const mat=new THREE.MeshLambertMaterial({map:tex});const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);
  // borde del bloque
  const skirtMat=new THREE.MeshBasicMaterial({color:0x111a2e});const skirt=new THREE.Mesh(new THREE.BoxGeometry(180,1,180),skirtMat);scene.add(skirt);
  const amb=new THREE.AmbientLight(0xffffff,.45),sun=new THREE.DirectionalLight(0xfff1dc,.85);scene.add(amb,sun);
  // estrellas
  const sg=new THREE.BufferGeometry(),sp=[];for(let i=0;i<600;i++){const th=Math.random()*6.28,ph=Math.random()*1.3,r=700;sp.push(r*Math.sin(ph)*Math.cos(th),r*Math.cos(ph)+40,r*Math.sin(ph)*Math.sin(th))}
  sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xEEF1F7,size:1.6,sizeAttenuation:false})));
  // astronauta
  const astro=new THREE.Group(),suit=new THREE.MeshLambertMaterial({color:0xEEF1F7}),visor=new THREE.MeshBasicMaterial({color:0xE8894A}),pack=new THREE.MeshLambertMaterial({color:0x3B7BFF});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.55,.6,1.6,12),suit);body.position.y=1.4;const head=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12),suit);head.position.y=2.6;
  const vz=new THREE.Mesh(new THREE.SphereGeometry(.36,12,10),visor);vz.position.set(0,2.62,.28);const bp=new THREE.Mesh(new THREE.BoxGeometry(.9,1.1,.5),pack);bp.position.set(0,1.6,-.5);
  const legL=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.9,8),suit);legL.position.set(-.25,.45,0);const legR=legL.clone();legR.position.x=.25;
  astro.add(body,head,vz,bp,legL,legR);astro.scale.setScalar(1.6);scene.add(astro);
  const beacon=new THREE.Mesh(new THREE.RingGeometry(1.6,2.2,32),new THREE.MeshBasicMaterial({color:0x8FE3FF,side:THREE.DoubleSide,transparent:true,opacity:.8}));beacon.rotation.x=-Math.PI/2;scene.add(beacon);
  // marcadores de parada
  const markers=new THREE.Group();scene.add(markers);
  R3={renderer,scene,cam,tex,geo,mesh,skirt,sun,astro,beacon,markers,legL,legR,box,orb:{th:.7,ph:.95,d:200,tx:0,tz:0},labels:[]};
  // controles
  let drag=null,pinch=0;const el=renderer.domElement,PT=new Map;el.style.touchAction='none';
  el.addEventListener('pointerdown',e=>{PT.set(e.pointerId,[e.clientX,e.clientY]);drag={x:e.clientX,y:e.clientY,b:e.button};pinch=0;el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointercancel',e=>{PT.delete(e.pointerId);drag=null;pinch=0});
  el.addEventListener('pointermove',e=>{if(PT.has(e.pointerId))PT.set(e.pointerId,[e.clientX,e.clientY]);
    if(PT.size===2){const [a,b]=[...PT.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)R3.orb.d=clamp(R3.orb.d*pinch/d,25,420);pinch=d;return}
    if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;const o=R3.orb;
    if(drag.b===2||e.shiftKey){const s=o.d/600;o.tx-=(dx*Math.cos(o.th)+dy*Math.sin(o.th))*s;o.tz-=(-dx*Math.sin(o.th)+dy*Math.cos(o.th))*s;o.tx=clamp(o.tx,-90,90);o.tz=clamp(o.tz,-90,90)}
    else{o.th-=dx*.006;o.ph=clamp(o.ph-dy*.005,.15,1.45)}});
  el.addEventListener('pointerup',e=>{PT.delete(e.pointerId);drag=PT.size?drag:null;pinch=0});el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('wheel',e=>{e.preventDefault();R3.orb.d=clamp(R3.orb.d*(1+Math.sign(e.deltaY)*.1),25,420)},{passive:false});
  build3d();requestAnimationFrame(loop3d);return true}
const toW=(x,y)=>[x/10-90,y/10-90];
function hW(x,y){return (hAt(x,y)-hmin)/10*SITE.vex3d}
function build3d(){if(!R3)return;const pos=R3.geo.attributes.position,seg=150;
  for(let j=0;j<=seg;j++)for(let i=0;i<=seg;i++){const idx=j*(seg+1)+i,x=i/seg*AREA,y=j/seg*AREA;pos.setY(idx,hW(Math.min(x,AREA-1),Math.min(y,AREA-1)))}
  pos.needsUpdate=true;R3.geo.computeVertexNormals();R3.skirt.position.y=-.6;
  // marcadores
  const g=R3.markers;while(g.children.length)g.remove(g.children[0]);R3.labels.forEach(l=>l.el.remove());R3.labels=[];
  const lb=$('sx3dLabels');
  SITE.stations.forEach(s=>{const [wx,wz]=toW(s.x,s.y),wy=hW(s.x,s.y),col=s.id==='H'?0xEEF1F7:0xE8894A;
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,9,6),new THREE.MeshBasicMaterial({color:col}));pole.position.set(wx,wy+4.5,wz);
    const cap=s.id==='H'?new THREE.Mesh(new THREE.BoxGeometry(3,3,3),new THREE.MeshLambertMaterial({color:col})):new THREE.Mesh(new THREE.OctahedronGeometry(1.6),new THREE.MeshLambertMaterial({color:col}));cap.position.set(wx,wy+10,wz);g.add(pole,cap);
    const el=document.createElement('span');el.innerHTML='<b>'+s.id+'</b><i> · '+s.name+'</i>';lb.appendChild(el);R3.labels.push({el,v:new THREE.Vector3(wx,wy+13,wz)})});
  if(SITE.id==='arc'){ // nave
    const [wx,wz]=toW(ST('H').x,ST('H').y),wy=hW(ST('H').x,ST('H').y);const ship=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:0xcfd6e4});
    const hull=new THREE.Mesh(new THREE.CylinderGeometry(2.2,3,6,16),m);hull.position.y=4;const nose=new THREE.Mesh(new THREE.ConeGeometry(2.2,3,16),m);nose.position.y=8.5;
    for(let a=0;a<4;a++){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,3.4,6),new THREE.MeshLambertMaterial({color:0x3B7BFF}));leg.position.set(Math.cos(a*1.57)*3.2,1.2,Math.sin(a*1.57)*3.2);leg.rotation.z=Math.cos(a*1.57)*.5;leg.rotation.x=-Math.sin(a*1.57)*.5;ship.add(leg)}
    ship.add(hull,nose);ship.position.set(wx+5,wy,wz+5);g.add(ship)}
  if(SITE.track){const pts=TRACK.map(p=>{const x=CX+p[1],y=CY+p[2],[wx,wz]=toW(x,y);return new THREE.Vector3(wx,hW(x,y)+.4,wz)});g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0xf2efe8,dashSize:1.5,gapSize:1})).computeLineDistances())}
  // ruta como tubo
  const rp=routePts();if(rp.length>1){const curve=new THREE.CatmullRomCurve3(rp.map(p=>new THREE.Vector3(p.wx,p.wy+.6,p.wz)));g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,Math.min(1200,rp.length*2),.45,6,false),new THREE.MeshBasicMaterial({color:0x8FE3FF})))}
  const s=sunPos(params.start),el=Math.max(.05,s.el*Math.PI/180),az=s.az*Math.PI/180;R3.sun.position.set(Math.sin(az)*Math.cos(el)*300,Math.sin(el)*300,-Math.cos(az)*Math.cos(el)*300);R3.sun.intensity=.25+.75*clamp(s.el/20,0,1);
  const [hx,hz]=toW(ST('H').x,ST('H').y);R3.orb.tx=hx*.3;R3.orb.tz=hz*.3;placeAstro();upd3dTex()}
function routePts(){const out=[];let cum=0,cumT=0;legs.forEach(l=>{if(!l.ok)return;l.path.forEach((k,q)=>{const x=((k%N)+.5)*CELL,y=(Math.floor(k/N)+.5)*CELL,[wx,wz]=toW(x,y);if(q>0){const p=out[out.length-1];cum+=Math.hypot(x-p.x,y-p.y)}out.push({x,y,wx,wz,wy:hW(x,y),d:cum,leg:l})})});return out}
let RP=[];
function placeAstro(){if(!R3)return;if(!RP.length)RP=routePts();if(!RP.length)return;const tot=RP[RP.length-1].d,target=walkT*tot;let i=1;while(i<RP.length-1&&RP[i].d<target)i++;
  const a=RP[i-1],b=RP[i],f=b.d>a.d?(target-a.d)/(b.d-a.d):0,wx=a.wx+(b.wx-a.wx)*f,wz=a.wz+(b.wz-a.wz)*f,wy=a.wy+(b.wy-a.wy)*f;
  R3.astro.position.set(wx,wy,wz);R3.astro.rotation.y=Math.atan2(b.wx-a.wx,b.wz-a.wz);R3.beacon.position.set(wx,wy+.15,wz);
  const sw=Math.sin(walkT*tot*.6)*.5*(walking?1:0);R3.legL.rotation.x=sw;R3.legR.rotation.x=-sw;
  const l=b.leg,el=$('sx3dInfo');el.innerHTML=`<b>EV1</b> · ${fmt(target/1000,2)} / ${fmt(tot/1000,2)} km · tramo ${l.from.id} → ${l.to.id} · pendiente ${fmt(SL[cellOf(b.x,b.y)],0)}° · regreso a la base ${mins(RET[cellOf(b.x,b.y)])} min`;$('sx3dSlider').value=Math.round(walkT*1000)}
function upd3dTex(){if(R3)R3.tex.needsUpdate=true}
function loop3d(ts){if(!R3)return;requestAnimationFrame(loop3d);if(view!=='3d')return;const dt=Math.min(.05,(ts-lastTs)/1000||0);lastTs=ts;
  if(walking){walkT+=dt/45;if(walkT>=1){walkT=1;walking=false;$('sx3dPlay').textContent='▶ Simular caminata'}placeAstro()}
  const box=R3.box,w=box.clientWidth,h=box.clientHeight;if(!w)return;if(R3.renderer.domElement.width!==Math.round(w*R3.renderer.getPixelRatio())){R3.renderer.setSize(w,h,false);R3.renderer.domElement.style.width='100%';R3.renderer.domElement.style.height='100%';R3.cam.aspect=w/h;R3.cam.updateProjectionMatrix()}
  const o=R3.orb;let tx=o.tx,tz=o.tz;if($('sx3dFollow').checked){tx=R3.astro.position.x;tz=R3.astro.position.z}
  R3.cam.position.set(tx+o.d*Math.sin(o.ph)*Math.sin(o.th),o.d*Math.cos(o.ph)+10,tz+o.d*Math.sin(o.ph)*Math.cos(o.th));R3.cam.lookAt(tx,5,tz);
  R3.beacon.material.opacity=.45+.4*Math.sin(ts/300);
  R3.renderer.render(R3.scene,R3.cam);
  R3.labels.forEach(l=>{const p=l.v.clone().project(R3.cam);l.el.style.display=p.z<1?'block':'none';l.el.style.left=((p.x*.5+.5)*w)+'px';l.el.style.top=((-p.y*.5+.5)*h)+'px'})}
function setView(v){view=v;$('sx2dBtn').classList.toggle('on',v==='2d');$('sx3dBtn').classList.toggle('on',v==='3d');$('sx2dBtn').setAttribute('aria-pressed',v==='2d');$('sx3dBtn').setAttribute('aria-pressed',v==='3d');
  $('sxMapBox').hidden=v==='3d';$('sx3dBox').hidden=v!=='3d';
  if(v==='3d'){if(hud){hud=false;$('sxHudBtn').classList.remove('on');renderHud()}if(!init3d()){view='2d';$('sxMapBox').hidden=false;$('sx3dBox').hidden=true;$('sx2dBtn').classList.add('on');$('sx3dBtn').classList.remove('on');return}drawMap()}}
$('sx2dBtn').addEventListener('click',()=>setView('2d'));$('sx3dBtn').addEventListener('click',()=>setView('3d'));
$('sx3dPlay').addEventListener('click',e=>{if(walkT>=1)walkT=0;walking=!walking;e.currentTarget.textContent=walking?'❚❚ Pausar':'▶ Simular caminata'});
$('sx3dSlider').addEventListener('input',e=>{walkT=e.target.value/1000;walking=false;$('sx3dPlay').textContent='▶ Simular caminata';placeAstro()});
$('sx3dTop').addEventListener('click',()=>{if(!R3)return;R3.orb.ph=.2;R3.orb.d=230;R3.orb.tx=0;R3.orb.tz=0;$('sx3dFollow').checked=false});
$('sx3dReset').addEventListener('click',()=>{if(!R3)return;Object.assign(R3.orb,{th:.7,ph:.95,d:200});$('sx3dFollow').checked=false});

// ================= consola: fuentes, reloj, geometría =================
function msdOf(ms){const jd=ms/86400000+2440587.5;return (jd+69.184/86400-2405522.0028779)/1.0274912517}
function kepler(T,a,e,L0,Lr,w){const D=Math.PI/180,M=((L0+Lr*T-w)%360)*D;let E=M;for(let i=0;i<8;i++)E=M+e*Math.sin(E);const x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E),nu=Math.atan2(y,x)+w*D,r=Math.hypot(x,y);return [r*Math.cos(nu),r*Math.sin(nu)]}
function geom(ms){const T=(ms/86400000+2440587.5-2451545)/36525,e=kepler(T,1.00000261,.01671123,100.46457166,35999.37244981,102.93768193),m=kepler(T,1.52371034,.0933941,-4.55343205,19140.30268499,-23.94362959);
  const d=Math.hypot(m[0]-e[0],m[1]-e[1]);let ang=Math.abs(Math.atan2(m[1],m[0])-Math.atan2(e[1],e[0]))*180/Math.PI;if(ang>180)ang=360-ang;
  const elong=Math.acos(clamp(((-e[0])*(m[0]-e[0])+(-e[1])*(m[1]-e[1]))/(Math.hypot(e[0],e[1])*d),-1,1))*180/Math.PI;return {d,light:d*499.005,ang,elong}}
function renderStatus(){const now=Date.now(),msd=msdOf(now),g=geom(now),lmstA=((msd%1)*24+191.4/15)%24,lmstG=((msd%1)*24+137.389/15)%24,sol=Math.floor(msd+137.389/360-49269);
  const sb=$('sxStatus');if(sb)sb.innerHTML=`<span><span class="dot"></span>UTC <b>${new Date(now).toISOString().slice(11,19)}</b></span><span>Base Ártemis <b>${hhmm(lmstA)}</b> hora local</span><span>Gale <b>${hhmm(lmstG)}</b></span><span>Sol de Curiosity <b>${sol}</b></span><span>Señal Tierra→Marte <b>${fmt(g.light/60,1)} min</b></span><span>Kp <b>${SWX.kp}</b></span>`;return {msd,g,sol}}
function renderFeeds(){const {g,sol}=renderStatus();
  $('sxFArc').innerHTML=`<div class="hd"><h3>Base Ártemis · sitio de misión</h3><span class="badge">plan</span></div><div class="big">40,1° N · 191,4° E</div><div class="sub">−4 120 m · hielo a 1,2 m · media −63 °C · 6,1 hPa · pendiente media 1,4°</div><span class="src">datos del equipo con referencia MOLA, THEMIS y SHARAD</span>`;
  $('sxFRover').innerHTML=`<div class="hd"><h3>Curiosity · validación en Gale</h3><span class="badge ${sol-ROVER.sol<=2?'ok':'warn'}">sol ${ROVER.sol}</span></div><div class="big">${fmt(ROVER.elev,0)} m</div><div class="sub">${fmt(Math.abs(ROVER.lat),4)}° S · ${fmt(ROVER.lon,4)}° E · inclinación ${fmt(ROVER.tilt,1)}° · odómetro ${fmt(ROVER.dist/1000,2)} km</div><span class="src">MMGIS MSL_waypoints · real</span>`;
  $('sxFAtm').innerHTML=`<div class="hd"><h3>Atmósfera · REMS</h3><span class="badge warn">${sol-REMS_LAST.sol} soles atrás</span></div><div class="big">${REMS_LAST.tmin} / ${REMS_LAST.tmax} °C</div><canvas class="spark" id="sxSpark" width="300" height="42" aria-label="Máximas y mínimas de los últimos ${REMS.length} soles"></canvas><div class="sub">${REMS_LAST.p} Pa · despejado · UV moderado</div><span class="src">REMS (CAB) · Gale · sol ${REMS_LAST.sol}</span>`;
  $('sxFSw').innerHTML=`<div class="hd"><h3>Clima espacial</h3><span class="badge ok">${SWX.level}</span></div><div class="big">Kp ${SWX.kp}</div><div class="sub">Fulguración ${SWX.flare.cls} con pico a las ${SWX.flare.peak.slice(11,16)} UTC. Marte está a ${fmt(g.ang,0)}° de la línea Sol–Tierra: ${g.ang<60?'los avisos de NOAA son representativos':'los avisos de NOAA lo cubren solo en parte'}.</div><span class="src">NOAA SWPC · ${fdate(SWX.kpTime)} UTC</span>`;
  $('sxFLink').innerHTML=`<div class="hd"><h3>Enlace Tierra–Marte</h3><span class="badge ${g.elong<10?'crit':'ok'}">${g.elong<10?'conjunción':'nominal'}</span></div><div class="big">${fmt(g.light/60,1)} min</div><div class="sub">${fmt(g.d,3)} UA · ida y vuelta ${fmt(g.light/30,0)} min: el astronauta decide en el lugar.</div><span class="src">calculado en vivo</span>`;
  const c=$('sxSpark');if(c){const x=c.getContext('2d'),W=c.width,Hh=c.height,lo=-80,hi=0,X=i=>4+i/(REMS.length-1)*(W-8),Y=v=>2+(1-(v-lo)/(hi-lo))*(Hh-4);x.clearRect(0,0,W,Hh);
    x.fillStyle='rgba(232,137,74,.14)';x.beginPath();REMS.forEach((r,i)=>i?x.lineTo(X(i),Y(r[2])):x.moveTo(X(i),Y(r[2])));for(let i=REMS.length-1;i>=0;i--)x.lineTo(X(i),Y(REMS[i][1]));x.closePath();x.fill();
    [[2,C.ochre],[1,C.route]].forEach(([ix,col])=>{x.strokeStyle=col;x.lineWidth=1.5;x.beginPath();REMS.forEach((r,i)=>i?x.lineTo(X(i),Y(r[ix])):x.moveTo(X(i),Y(r[ix])));x.stroke()})}}
const LOGSRC={all:'Todo',rov:'Rover',sw:'Clima espacial',atm:'Atmósfera',plan:'Plan'};
function renderLogFilter(){const el=$('sxLogFilter');el.innerHTML='';Object.entries(LOGSRC).forEach(([k,v])=>{const b=document.createElement('button');b.type='button';b.textContent=v;b.className=k===logF?'on':'';b.setAttribute('aria-pressed',k===logF);b.addEventListener('click',()=>{logF=k;renderLogFilter();renderLog()});el.appendChild(b)})}
function renderLog(){const plan=planAlerts.filter(a=>a[0]!=='ok').map(a=>[SNAP,'plan','EVA · '+SITE.short+' · '+a[1],a[2]]);const all=[...plan,...EVENTS].filter(e=>logF==='all'||e[1]===logF);
  $('sxLog').innerHTML=all.map(e=>`<li><time datetime="${e[0]}">${e[1]==='plan'?'plan actual':fdate(e[0])}</time><span class="srcb ${e[1]}">${e[2]}</span><span>${e[3]}</span></li>`).join('')}

// ================= controles y arranque =================
function update(route){if(route){recalcRoute();RP=[]}computeTotals();renderStops();renderPlan();renderLog();drawProfile();drawThermo();renderRad();renderHud();renderDossier();drawMap();if(route&&R3)build3d()}
function loadSite(id){SITE=SITES[id];resetSeq();params.rover=SITE.roverDefault;$('sxRover').checked=params.rover;
  genSite();renderStatic();dijkstraHome();renderIso();renderOptical();legs=[];if(preset)applyPreset(preset);else renderLayers();recalcRoute();RP=[];walkT=0;walking=false;$('sx3dPlay').textContent='▶ Simular caminata';
  update(false);renderPanoSection();if(R3)build3d();
  document.querySelectorAll('#sxSite button').forEach(b=>{b.classList.toggle('on',b.dataset.site===id);b.setAttribute('aria-pressed',b.dataset.site===id)});
  $('sxSiteNote').textContent=id==='arc'?'Sitio de misión del equipo. Terreno modelado con los rasgos típicos de Arcadia: suelo poligonal, hielo somero, depresiones escalonadas y dunas.':'Validación: el mismo planificador corre en Gale, centrado en la posición real de Curiosity, con su recorrido real y el clima de REMS.'}
document.querySelectorAll('#sxSite button').forEach(b=>b.addEventListener('click',()=>{if(SITE.id!==b.dataset.site){toast.textContent='Generando el sitio…';setTimeout(()=>{loadSite(b.dataset.site);toast.textContent=''},20)}}));
$('sxOpac').addEventListener('input',e=>{params.opac=+e.target.value;drawMap()});
$('sxPayload').addEventListener('input',e=>{params.payload=+e.target.value;$('sxPayloadV').textContent=params.payload+' kg'});
$('sxPayload').addEventListener('change',()=>{dijkstraHome();renderIso();update(true)});
$('sxRover').addEventListener('change',e=>{params.rover=e.target.checked;update(false)});
$('sxStart').addEventListener('input',e=>{params.start=+e.target.value;$('sxStartV').textContent=hhmm(params.start);renderOptical();update(false);drawPano();if(R3)build3d()});
$('sxTau').addEventListener('input',e=>{params.tau=+e.target.value;$('sxTauV').textContent=fmt(params.tau,1);update(false)});
$('sxSep').addEventListener('change',e=>{params.sep=e.target.value;renderLayers();update(false)});
$('sxVex').addEventListener('change',e=>{params.vex=+e.target.value;drawPano()});
// al entrar a la caminata: guía la primera vez y relieve 3D en pantallas grandes
let evaSeen=false;
function enterEva(){setTimeout(()=>{drawMap();
  if(!evaSeen){evaSeen=true;let seen=false;try{seen=localStorage.getItem('sendaTip')==='1'}catch(e){}$('sxTip').hidden=seen;
    if(window.innerWidth>900&&view==='2d')setView('3d')}},40)}
$('sxTipOk').addEventListener('click',()=>{$('sxTip').hidden=true;try{localStorage.setItem('sendaTip','1')}catch(e){}});
$('sxPanoAcc').addEventListener('toggle',e=>{if(e.target.open)drawPano()});
window.addEventListener('hashchange',()=>{if(location.hash==='#eva')enterEva()});
window.addEventListener('resize',()=>{if(location.hash==='#eva')drawMap()});
if(location.hash==='#eva')enterEva();
renderFeeds();renderLogFilter();loadSite('arc');
setInterval(renderStatus,1000);
})();
