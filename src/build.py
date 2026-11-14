"""Fusiona el Atlas de Arcadia Planitia (archivo del equipo) con Senda y la marca TESLA STARS ONE.
Uso:  python build.py
Salida: ../dist/senda-tesla-stars-one.html (archivo completo, se abre con doble clic)
        ../dist/senda-artifact.html (misma página sin <html>/<head>, para publicarla en claude.ai)
"""
import base64, pathlib, re, sys

SRC = pathlib.Path(__file__).parent
DIST = SRC.parent / "dist"
DIST.mkdir(exist_ok=True)

html = (SRC / "arcadia-original.html").read_text(encoding="utf-8")
senda_html = (SRC / "senda" / "senda.html").read_text(encoding="utf-8")
senda_css = (SRC / "senda" / "senda.css").read_text(encoding="utf-8")
senda_js = (SRC / "senda" / "senda.js").read_text(encoding="utf-8")
brand_js = (SRC / "brand-svg.js").read_text(encoding="utf-8")


def rep(old, new, count=1, all_=False):
    """Reemplaza y verifica que el texto exista, para detectar si el original cambió."""
    global html
    n = html.count(old)
    if n == 0 or (not all_ and n != count):
        sys.exit(f"No encontré exactamente {count} vez/veces: {old[:70]!r} (hay {n})")
    html = html.replace(old, new)


DARK = ('--bg:#0A1020;--sf:#111a2e;--tx:#EEF1F7;--mu:#8A93A8;--ac:#3B7BFF;--ln:#24304a;--ok:#e9a23b;--hi:#ef6a55;'
        "--se:'Unbounded','Arial Black',system-ui,sans-serif;--mo:'IBM Plex Mono',Consolas,monospace;")

# 1. título y tipografías
rep("<title>Arcadia Planitia · Atlas</title>", "<title>Senda · Tesla Stars One</title>")
rep("family=Inter:wght@400;500;600&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500",
    "family=Unbounded:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500")
rep("Inter,", "'IBM Plex Sans',", all_=True)

# 1b. archivo autónomo: tipografías y Three.js dentro del HTML (funciona sin internet)
VENDOR = SRC / "vendor"
html, nlinks = re.subn(r'<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>', "", html)
if nlinks != 3:
    sys.exit(f"Esperaba 3 enlaces de Google Fonts y hay {nlinks}")
fonts_css = (VENDOR / "fonts-inline.css").read_text(encoding="utf-8")
rep("<style>", "<style>\n" + fonts_css + "\n</style>\n<style>")
three = (VENDOR / "three-r128.min.js").read_text(encoding="utf-8")
if "</script" in three.lower():
    sys.exit("three.min.js contiene </script")
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>', "<script>\n" + three + "\n</script>")
# El Módulo 3D del equipo importaba three@0.160 desde internet: ahora usa la copia incrustada (r128)
rep("const T=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');__mvInit(T);",
    "const T=window.THREE;__mvInit(T);")
# r128 necesita esto para verse igual que 0.160 (luces físicas y color sRGB)
rep("renderer.toneMappingExposure=1.15;",
    "renderer.toneMappingExposure=1.15;renderer.physicallyCorrectLights=true;renderer.outputEncoding=THREE.sRGBEncoding;")
rep("const initial={pos:",
    "scene.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];"
    "ms.forEach(m=>{if(m.color&&!m.__lin){m.color.convertSRGBToLinear();m.__lin=1}});"
    "if(o.isLight){o.color.convertSRGBToLinear();if(o.groundColor)o.groundColor.convertSRGBToLinear()}});"
    "scene.fog.color.convertSRGBToLinear();\nconst initial={pos:")

# 2. paleta de marca (tema oscuro único: la marca vive en el cielo nocturno)
rep('--bg:#0a0910;--sf:#121016;--tx:#efe7e0;--mu:#8f8790;--ac:#e8663d;--ln:#26222b;--ok:#e9a23b;--hi:#ef6a55;'
    '--se:"Instrument Serif",Georgia,serif;--mo:"JetBrains Mono",ui-monospace,Menlo,monospace;', DARK)
rep("--bg:#f6f0ea;--sf:#fff;--tx:#2a1a16;--mu:#76645b;--ac:#b5472a;--ln:#e2d3c8;--ok:#c98a1b;--hi:#c23a2a",
    DARK.rstrip(";"), count=2)
for a, b in {"#0a0910": "#0A1020", "0x0a0910": "0x0A1020", "#26222b": "#24304a", "#0e0c12": "#0c1426", "#121016": "#111a2e",
             "#2c2832": "#24304a", "#1a171e": "#16203a", "#17141b": "#16203a", "#8f8790": "#8A93A8", "#efe7e0": "#EEF1F7",
             "#f3ebe4": "#EEF1F7", "#4a4450": "#3a4766", "#e8663d": "#E8894A", "0xe8663d": "0xE8894A", "#150d10": "#0c1426"}.items():
    if a in html:
        html = html.replace(a, b)

# 3. encabezado con la marca, lema y barra de estado
rep('<header><span id="tag" style="color:var(--mu)"></span>',
    '<header class="brandbar"><span class="bb-logo" id="bbLogo" aria-label="Tesla Stars One"></span><span id="tag" style="color:var(--mu)"></span>')
rep("<h1>Arcadia Planitia</h1>",
    '<div class="sx-status" id="sxStatus"></div>'
    '<div class="eyebrow-b">TESLA STARS ONE · NASA Space Apps Challenge 2026</div>'
    '<h1>Senda</h1><p class="slogan" id="bbSlogan"></p>')
rep("◈ ARCADIA PLANITIA", "SENDA · ARCADIA PLANITIA")

# 4. páginas nuevas: inicio, caminata y en vivo; la app abre en Inicio
rep('const PG=["mapa","ciencia",', 'const PG=["inicio","mapa","eva","consola","ciencia",')
rep('nv:["Mapa","Ciencia",', 'nv:["Inicio","Mapa","EVA 2 km","Consola","Ciencia",')
rep('nv:["Map","Science",', 'nv:["Home","Map","2 km EVA","Console","Science",')
rep('if(!PG.includes(h))h="mapa"', 'if(!PG.includes(h))h="inicio"')
inicio = (SRC / "ux" / "inicio.html").read_text(encoding="utf-8")
for n in ("modulo", "mapa", "caminata", "globo"):
    b64 = base64.b64encode((SRC / "ux" / "thumbs" / f"{n}.jpg").read_bytes()).decode()
    inicio = inicio.replace(f'src="thumbs/{n}.jpg"', f'src="data:image/jpeg;base64,{b64}"')
rep('<nav id="nv"></nav>', '<nav id="nv"></nav>' + inicio)

# 5. imágenes de Curiosity incrustadas
for n in ("fhaz", "nav", "rmi"):
    b64 = base64.b64encode((SRC / "senda" / "img" / f"{n}.jpg").read_bytes()).decode()
    senda_html = senda_html.replace(f'src="img/{n}.jpg"', f'src="data:image/jpeg;base64,{b64}"')

# 5b. Globo 3D de Marte en la página Candidatos (reemplaza el mapa plano)
rep('<canvas id="gm" style="width:100%;display:block;border-radius:8px"></canvas>',
    '<div data-globe-slot><div id="globeWrap">'
    '<div class="globe" id="globe"><div class="glb-lbl" id="glbLbl"></div><div class="glb-info" id="glbInfo"></div></div>'
    '<div class="glb-btns" id="glbBtns"></div>'
    '<p class="glb-src">Globo con el mosaico Viking MDIM2.1 (NASA/JPL/USGS, dominio público). Posiciones de los sitios en coordenadas reales.</p>'
    '</div></div>'
    '<p class="gm-t">Mapa plano de los candidatos</p>'
    '<canvas id="gm" style="width:100%;display:block;border-radius:14px"></canvas>')
mars_b64 = base64.b64encode((SRC / "vendor" / "mars-viking-1920.jpg").read_bytes()).decode()
globe_js = (SRC / "globe" / "globe.js").read_text(encoding="utf-8").replace("@@MARS_TEX@@", "data:image/jpeg;base64," + mars_b64)

# 6. secciones de Senda y pie de marca
rep('<footer id="ft"></footer>', senda_html + '<footer id="ft"></footer><div class="brandfoot" id="bbFoot"></div>')

BRAND_CSS = """
:root{color-scheme:dark}
.w{max-width:1360px}
h1{font:700 clamp(2.6rem,7vw,4.4rem)/1 var(--se);letter-spacing:-.03em;margin:.12em 0 .12em}
h2{font:600 clamp(1.2rem,2.4vw,1.55rem)/1.2 var(--se);letter-spacing:-.01em}
.rp h3{font:600 22px/1.15 var(--se)}
.brandbar{flex-wrap:wrap;padding-bottom:10px;border-bottom:1px solid var(--ln)}
.bb-logo{display:block;flex:none}.bb-logo svg{height:42px;width:auto;display:block}
.brandbar #tag{flex:1;min-width:0;font:12px var(--mo);letter-spacing:.06em;text-align:right;padding-right:6px}
@media(max-width:620px){.brandbar #tag{display:none}}
.eyebrow-b{font:500 11px var(--mo);letter-spacing:.16em;text-transform:uppercase;color:#8FE3FF;margin-top:14px}
.slogan{font:500 clamp(15px,2vw,19px)/1.4 var(--se);color:var(--tx);max-width:62ch;margin:.2em 0 .6em}
.slogan em{font-style:normal;color:#E8894A}
.sx-status{display:flex;flex-wrap:wrap;gap:6px 18px;font:12px var(--mo);color:var(--mu);padding:8px 0;border-bottom:1px solid var(--ln)}
.sx-status b{color:var(--tx);font-weight:500}
.sx-status .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#7cc48a;margin-right:6px;vertical-align:1px}
.brandfoot{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;border-top:1px solid var(--ln);margin-top:20px;padding-top:16px;font:12px var(--mo);color:var(--mu)}
.brandfoot svg{width:230px;height:auto;display:block}
.globe{position:relative;width:100%;aspect-ratio:16/10;max-height:78vh;min-height:340px;border:1px solid var(--ln);border-radius:12px;overflow:hidden;background:#0A1020;cursor:grab}
@media(max-width:700px){.globe{aspect-ratio:auto;height:min(92vw,560px)}}
.globe canvas{display:block;width:100%;height:100%}
.glb-lbl{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.glb-tag{position:absolute;transform:translate(-50%,-135%);pointer-events:auto;font:500 11px var(--mo);letter-spacing:.04em;color:#EEF1F7;background:rgba(10,16,32,.82);border:1px solid var(--c);border-radius:4px;padding:4px 8px;white-space:nowrap;cursor:pointer;min-height:0}
.glb-tag.on{background:var(--c);color:#0A1020}
.glb-info{position:absolute;left:12px;top:12px;max-width:min(340px,calc(100% - 24px));display:grid;gap:5px;background:rgba(10,16,32,.86);border:1px solid var(--ln);border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.4;color:#cfd5e2;pointer-events:auto}
.glb-info b{font:600 15px var(--se);color:#EEF1F7}.glb-info .mono{font:12px var(--mo);color:#8FE3FF}
.glb-info i{font-style:normal;justify-self:start;font:500 11px var(--mo);padding:1px 7px;border-radius:10px}
.glb-info i.ok{background:#6dffb0;color:#0A1020}.glb-info i.no{background:#ef6a55;color:#fff}.glb-info i.val{background:#EEF1F7;color:#0A1020}
.glb-info a{color:#8FE3FF;font-weight:500}
@media(max-width:700px){.glb-info{top:auto;bottom:10px;left:10px;right:10px;max-width:none;font-size:12px;max-height:45%;overflow:auto}}
.glb-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.glb-btns button{display:inline-flex;align-items:center;gap:8px}.glb-btns button span{width:10px;height:10px;border-radius:50%;display:inline-block}
.glb-src{font-size:12px;margin:8px 0 0}
.glb-err{position:absolute;inset:auto 0 45% 0;text-align:center;color:#EEF1F7}
"""
first_style_end = html.index("</style>")
ux_css = (SRC / "ux" / "ux.css").read_text(encoding="utf-8")
html = html[:first_style_end] + BRAND_CSS + senda_css + "\n" + ux_css + "\n" + html[first_style_end:]

BRAND_RUN = """
(function(){const T=window.TSO;if(!T)return;
document.getElementById('bbLogo').innerHTML=T.horizontal('dark');
document.getElementById('bbFoot').innerHTML=T.horizontal('dark')+'<span>Equipo TESLA STARS ONE · NASA Space Apps Challenge 2026 · Proyecto Senda</span>';
const SL={es:'Del dato abierto a la <em>primera huella</em>: atlas y planificador para la primera caminata humana en Arcadia Planitia.',
          en:'From open data to the <em>first footprint</em>: an atlas and planner for the first human walk on Arcadia Planitia.'};
const set=()=>{const l=document.documentElement.lang==='en'?'en':'es';document.getElementById('bbSlogan').innerHTML=SL[l]};
set();new MutationObserver(set).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});})();
"""
rep("</body>", "<script>\n" + brand_js + "\n</script>\n<script>" + BRAND_RUN + "</script>\n<script>\n" + senda_js + "\n</script>\n<script>\n" + globe_js + "\n</script>\n<script>\n" + (SRC / "ux" / "ux.js").read_text(encoding="utf-8") + "\n</script>\n</body>")

out = DIST / "senda-tesla-stars-one.html"
out.write_text(html, encoding="utf-8")

# Versión para claude.ai: sin doctype/html/head/body, con title, links y style arriba
head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
head = re.sub(r"<meta[^>]*>", "", head)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
(DIST / "senda-artifact.html").write_text(head.strip() + "\n" + body.strip() + "\n", encoding="utf-8")
print("OK", out, round(out.stat().st_size / 1024), "KB")

# Sitio web para Vercel: ../public
import shutil
ROOT = SRC.parent
PUB = ROOT / "public"
if PUB.exists():
    shutil.rmtree(PUB)
(PUB / "marca").mkdir(parents=True)
shutil.copy(out, PUB / "index.html")
manual = (ROOT / "manual-tesla-stars-one.html").read_text(encoding="utf-8")
(PUB / "marca" / "index.html").write_text(
    '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + manual + "\n</html>\n", encoding="utf-8")
for d in ("logo", "piezas"):
    shutil.copytree(ROOT / d, PUB / "marca" / d)
print("OK", PUB)
