import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATOS
// ═══════════════════════════════════════════════════════════════════════════════

const PRECIOS = {
  jabon:       { 50: { Inicial: 23001, Intermedia: 25366, Premium: 27731 }, 200: { Inicial: 87268, Intermedia: 96728, Premium: 106188 } },
  suavizante:  { 50: { Inicial: 24772, Intermedia: 25954, Premium: 27731 }, 200: { Inicial: 94363, Intermedia: 99330, Premium: 106425 } },
  detergente:  { 50: { Inicial: 24662, Intermedia: 27755, Premium: 31464 }, 200: { Inicial: 93955, Intermedia: 106070, Premium: 120905 } },
  lavandina:   { 50: 4250, 200: 13975 },
  desodorante: { 50: 4250, 200: 13975 },
};
const PRECIOS_COMBOS = {
  50:  { Inicial: 77924,  Intermedia: 83842,  Premium: 90937  },
  200: { Inicial: 283679, Intermedia: 312180, Premium: 353568 },
};
const COLORES_JABON      = [{ label:'Azul',    hex:'#3b82f6', tc:'#fff' }, { label:'Verde',   hex:'#22c55e', tc:'#fff' }, { label:'Violeta', hex:'#a855f7', tc:'#fff' }];
const COLORES_SUAVIZANTE = [{ label:'Blanco',  hex:'#f1f5f9', tc:'#1e293b' }, { label:'Celeste', hex:'#7dd3fc', tc:'#1e293b' }, { label:'Violeta', hex:'#a855f7', tc:'#fff' }];
const COLORES_DETERGENTE = [{ label:'Amarillo', hex:'#fbbf24', tc:'#1e293b' }, { label:'Verde (a pedido)', hex:'#4ade80', tc:'#1e293b' }, { label:'Azul (a pedido)', hex:'#60a5fa', tc:'#fff' }];
const FRAGANCIAS = [
  { label:'Pino',        icon:'🌲' }, { label:'Lavanda',      icon:'💜' }, { label:'Cherry',     icon:'🍒' },
  { label:'Arpege',      icon:'🎵' }, { label:'Marina',       icon:'🌊' }, { label:'Chicle',     icon:'🩷' },
  { label:'Naranja',     icon:'🍊' }, { label:'Summer',       icon:'☀️' }, { label:'Fresh',      icon:'❄️' },
  { label:'Sandía',      icon:'🍉' }, { label:'Citronella',   icon:'🌿' }, { label:'Rosa',       icon:'🌹' },
  { label:'Limón',       icon:'🍋' }, { label:'Olor a Limpio',icon:'✨' },
];
const PRECIO_ENVASE = 4000;
const ZONAS_ENVIO = [
  { zona:'Moreno', color:'#ef4444', precio:4500, localidades:['MORENO','PASO DEL REY','CUARTEL V','FRANCISCO ALVAREZ','LA REJA','TRUJUI','BORDENAVE'] },
  { zona:'Cordón 1', color:'#fb923c', precio:5500, localidades:['JOSE C PAZ','JOSE C. PAZ','SAN MIGUEL','ITUZAINGO','ITUZAINGÓ','MERLO','MALVINAS ARGENTINAS'] },
  { zona:'Cordón 2', color:'#3b82f6', precio:6500, localidades:['LA MATANZA','MORON','MORÓN','HURLINGHAM','3 DE FEBRERO','TRES DE FEBRERO','SAN MARTIN','SAN MARTÍN','VICENTE LOPEZ','VICENTE LÓPEZ','SAN FERNANDO','TIGRE','SAN ISIDRO','AVELLANEDA','LANUS','LANÚS','LOMAS DE ZAMORA','BERAZATEGUI','FLORENCIO VARELA','ALMIRANTE BROWN','QUILMES','EZEIZA','ESTEBAN ECHEVERRIA','ESTEBAN ECHEVERRÍA','CABA','CAPITAL FEDERAL','BUENOS AIRES','CIUDAD DE BUENOS AIRES','PALERMO','BELGRANO','CABALLITO','FLORES','RAMOS MEJIA','RAMOS MEJÍA','SAN JUSTO','TAPIALES','CIUDADELA','EL PALOMAR','HAEDO','CASTELAR','VILLA LUZURIAGA'] },
  { zona:'Cordón 3', color:'#22c55e', precio:9500, localidades:['ESCOBAR','INGENIERO MASCHWITZ','ING MASCHWITZ','PILAR','ZARATE','ZÁRATE','CAMPANA','LUJAN','LUJÁN','GENERAL RODRIGUEZ','GENERAL RODRÍGUEZ','MARCOS PAZ','CAÑUELAS','GUERNICA','SAN VICENTE','VILLA ELISA','BERISSO','LA PLATA','ENSENADA','DERQUI','VILLA ROSA','NORDELTA','EXALTACION DE LA CRUZ','EXALTACIÓN DE LA CRUZ','GENERAL LAS HERAS','CORONEL BRANDSEN','BRANDSEN','DEL VISO','MAGDALENA','LOBOS','MONTE','NAVARRO','SUIPACHA','MERCEDES'] },
];

function detectarZona(loc) {
  if (!loc) return null;
  const n = loc.toUpperCase().trim();
  for (const z of ZONAS_ENVIO) {
    if (z.localidades.some(l => n === l || n.includes(l) || l.includes(n))) return z;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCALSTORAGE
// ═══════════════════════════════════════════════════════════════════════════════

function genCodigoPRE() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const keyFecha = 'dom9_fecha'; const keyCont = `dom9_cont_${dd}${mm}`;
  const fechaHoy = `${dd}${mm}`;
  let n = 1;
  if (localStorage.getItem(keyFecha) === fechaHoy) {
    n = parseInt(localStorage.getItem(keyCont)||'0') + 1;
  }
  localStorage.setItem(keyFecha, fechaHoy);
  localStorage.setItem(keyCont, String(n));
  return `PRE${dd}${mm}${String(n).padStart(2,'0')}`;
}
const toDEF = c => c?.replace(/^PRE/,'DEF') || '';
const saveLS = p => { try { const all = JSON.parse(localStorage.getItem('dom9_pedidos')||'{}'); all[p.codigo]=p; localStorage.setItem('dom9_pedidos',JSON.stringify(all)); } catch{} };
const loadLS = c => { try { return JSON.parse(localStorage.getItem('dom9_pedidos')||'{}')[c?.toUpperCase()] || null; } catch { return null; } };
const listLS = () => { try { return Object.values(JSON.parse(localStorage.getItem('dom9_pedidos')||'{}')).sort((a,b)=>(b.ts||0)-(a.ts||0)); } catch { return []; } };

// ═══════════════════════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════════════════════

const C = { vd:'#0d5c3a', vdO:'#062918', vdM:'#1a7a52', na:'#f97316', naO:'#c2520a' };
const s = {
  app: { minHeight:'100vh', background:`linear-gradient(160deg,${C.vdO} 0%,${C.vd} 55%,${C.vdM} 100%)`, fontFamily:'"Inter","Segoe UI",system-ui,sans-serif', color:'#fff', paddingBottom:50 },
  hdr: { background:'rgba(0,0,0,0.3)', backdropFilter:'blur(14px)', borderBottom:'1px solid rgba(255,255,255,0.1)', padding:'0 20px', position:'sticky', top:0, zIndex:100, height:56, display:'flex', alignItems:'center' },
  hIn: { maxWidth:640, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 },
  wrap: { maxWidth:640, margin:'0 auto', padding:'20px 16px' },
  card: { background:'rgba(255,255,255,0.08)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:16, padding:18, marginBottom:14 },
  cTit: { fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 },
  sLbl: { fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 },
  sTit: { fontSize:22, fontWeight:900, letterSpacing:'-0.4px', marginBottom:20 },
  bP: { width:'100%', padding:'15px 20px', background:`linear-gradient(135deg,${C.na},${C.naO})`, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 4px 18px rgba(249,115,22,0.45)' },
  bS: { width:'100%', padding:'13px 20px', background:'rgba(255,255,255,0.09)', color:'#fff', border:'1px solid rgba(255,255,255,0.18)', borderRadius:12, fontWeight:600, fontSize:14, cursor:'pointer' },
  bV: { width:'100%', padding:'15px 20px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 4px 18px rgba(22,163,74,0.35)' },
  bO: { width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.07)', color:'#fff', border:'1px solid rgba(255,255,255,0.14)', borderRadius:12, fontWeight:600, fontSize:14, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' },
  inp: { width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, fontSize:14, boxSizing:'border-box', outline:'none', fontFamily:'inherit' },
  lbl: { display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)', marginBottom:5 },
  tot: { fontSize:28, fontWeight:900, color:C.na, letterSpacing:'-0.5px' },
};

const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const uid = () => Math.random().toString(36).substr(2,9);
const G = ({ cols=1, gap=10, children, style }) => <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap, ...style }}>{children}</div>;
const SH = ({ step, title }) => <div style={{ marginBottom:20 }}><div style={s.sLbl}>{step}</div><div style={s.sTit}>{title}</div></div>;

// Chip de código
const Chip = ({ codigo, tipo }) => (
  <span style={{ fontSize:12, fontWeight:800, background: tipo==='PRE' ? 'rgba(249,115,22,0.2)' : 'rgba(34,197,94,0.2)', border:`1px solid ${tipo==='PRE' ? 'rgba(249,115,22,0.4)' : 'rgba(34,197,94,0.4)'}`, color: tipo==='PRE' ? C.na : '#4ade80', borderRadius:20, padding:'3px 12px', letterSpacing:'1px' }}>{codigo}</span>
);

// Ítem libre / Agregar manual
const ItemLibre = ({ lista, setLista }) => {
  const [nom, setNom] = useState('');
  const [prec, setPrec] = useState('');
  return (
    <div style={s.card}>
      <div style={s.cTit}>➕ Agregar ítem extra</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
        <div><label style={s.lbl}>Descripción</label><input value={nom} onChange={e=>setNom(e.target.value)} style={s.inp} placeholder="Ej: Tanque plástico, dispenser..." /></div>
        <div><label style={s.lbl}>Importe</label><input type="number" value={prec} onChange={e=>setPrec(e.target.value)} style={s.inp} placeholder="$0" /></div>
        <button onClick={()=>{ if(!nom||!prec) return; setLista([...lista,{id:uid(),nombre:nom,precio:parseFloat(prec)}]); setNom(''); setPrec(''); }} disabled={!nom||!prec} style={{...s.bS, opacity:(!nom||!prec)?0.45:1}}>Agregar</button>
      </div>
      {lista.map((a,i)=>(
        <div key={a.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', background:'rgba(255,255,255,0.05)', borderRadius:9, marginBottom:7 }}>
          <span style={{ fontSize:13 }}>{a.nombre}</span>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ color:C.na, fontWeight:700 }}>{fmt(a.precio)}</span>
            <button onClick={()=>setLista(lista.filter((_,j)=>j!==i))} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Extras + Envío (compartido PRE y DEF)
const ExtrasEnvio = ({ envases, setEnvases, extras, setExtras, zona, onConfirmar, onVolver, labelBtn='Confirmar' }) => {
  const zonaEf = extras.envio || zona;
  const totalEnvio = extras.retiraLocal || extras.esInterior ? 0 : (zonaEf ? zonaEf.precio * extras.bultos : 0);
  return (
    <div>
      <button onClick={onVolver} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
      <SH step="Extras y envío" title="Completar cotización" />

      {/* Envases */}
      <div style={s.card}>
        <div style={s.cTit}>🪣 Envases — $4.000 c/u</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={()=>setEnvases(Math.max(0,envases-1))} style={{ width:42, height:42, borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer', fontSize:22 }}>−</button>
          <span style={{ fontSize:26, fontWeight:900, minWidth:44, textAlign:'center' }}>{envases}</span>
          <button onClick={()=>setEnvases(envases+1)} style={{ width:42, height:42, borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer', fontSize:22 }}>+</button>
          {envases>0 && <span style={{ color:C.na, fontWeight:800 }}>{fmt(envases*PRECIO_ENVASE)}</span>}
        </div>
      </div>

      {/* Ítem libre */}
      <ItemLibre lista={extras.agregados} setLista={v=>setExtras({...extras,agregados:v})} />

      {/* Envío */}
      <div style={s.card}>
        <div style={s.cTit}>🚚 Envío</div>
        <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom:10, padding:'10px 14px', borderRadius:10, background:extras.retiraLocal?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.04)', border:`1px solid ${extras.retiraLocal?'rgba(34,197,94,0.3)':'rgba(255,255,255,0.1)'}` }}>
          <input type="checkbox" checked={extras.retiraLocal||false} onChange={e=>setExtras({...extras,retiraLocal:e.target.checked,esInterior:false})} style={{ width:18, height:18, marginTop:2 }} />
          <span style={{ fontSize:13, fontWeight:700 }}>🏪 Retira por el local<br /><span style={{ color:'rgba(255,255,255,0.5)', fontWeight:400, fontSize:12 }}>Sin costo de envío</span></span>
        </label>
        {!extras.retiraLocal && (
          <>
            <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom:10 }}>
              <input type="checkbox" checked={extras.esInterior||false} onChange={e=>setExtras({...extras,esInterior:e.target.checked})} style={{ width:18, height:18, marginTop:2 }} />
              <span style={{ fontSize:13 }}>Envío al interior (VIA CARGO / ANDREANI)<br /><span style={{ color:'rgba(255,255,255,0.45)', fontSize:12 }}>El cliente paga al transportista</span></span>
            </label>
            {!extras.esInterior && (
              <>
                <div style={{ marginBottom:10 }}>
                  <label style={s.lbl}>Localidad</label>
                  <input value={extras.localidad||''} onChange={e=>setExtras({...extras,localidad:e.target.value,envio:null})} style={{...s.inp,marginBottom:8}} placeholder="Ej: La Matanza, Pilar..." />
                </div>
                {extras.localidad && (
                  zona
                    ? <div style={{ padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:10, background:'rgba(34,197,94,0.13)', border:'1px solid rgba(34,197,94,0.3)' }}>
                        <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:zona.color, marginRight:6 }}></span>
                        <strong>{zona.zona}</strong> — {fmt(zona.precio)}/bulto
                      </div>
                    : <>
                        <div style={{ padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:10, background:'rgba(239,68,68,0.13)', border:'1px solid rgba(239,68,68,0.3)' }}>⚠️ Zona no detectada. Seleccioná manualmente:</div>
                        <G gap={8} style={{ marginBottom:10 }}>
                          {ZONAS_ENVIO.map(z=>(
                            <button key={z.zona} onClick={()=>setExtras({...extras,envio:z})} style={{...s.bO, background:extras.envio?.zona===z.zona?'rgba(249,115,22,0.2)':undefined, borderColor:extras.envio?.zona===z.zona?C.na:undefined}}>
                              <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ width:10, height:10, borderRadius:'50%', background:z.color, display:'inline-block' }}></span>{z.zona}</span>
                              <span style={{ color:C.na, fontWeight:700 }}>{fmt(z.precio)}/bulto</span>
                            </button>
                          ))}
                        </G>
                      </>
                )}
                {zonaEf && (
                  <div>
                    <label style={s.lbl}>Cantidad de bultos</label>
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:4 }}>
                      <button onClick={()=>setExtras({...extras,bultos:Math.max(1,extras.bultos-1)})} style={{ width:42, height:42, borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer', fontSize:22 }}>−</button>
                      <span style={{ fontSize:26, fontWeight:900, minWidth:44, textAlign:'center' }}>{extras.bultos}</span>
                      <button onClick={()=>setExtras({...extras,bultos:extras.bultos+1})} style={{ width:42, height:42, borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer', fontSize:22 }}>+</button>
                      <span style={{ color:C.na, fontWeight:800 }}>{fmt(zonaEf.precio*extras.bultos)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <button onClick={onConfirmar} style={s.bP}>{labelBtn}</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRE-COTIZACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const PreCotizacion = ({ onVolver, onIrDEF, preloaded }) => {
  const [codigo]  = useState(()=> preloaded?.codigo || genCodigoPRE());
  const [items, setItems]     = useState(preloaded?.items || []);
  const [envases, setEnvases] = useState(preloaded?.envases || 0);
  const [extras, setExtras]   = useState(preloaded?.extras || { agregados:[], envio:null, bultos:1, esInterior:false, retiraLocal:false, localidad:'' });
  const [paso, setPaso]       = useState('inicio');
  const [cur, setCur]         = useState({ tipo:null, cantidad:null, calidad:null });
  const [waMensaje, setWaMensaje] = useState('');

  const zona = detectarZona(extras.localidad) || extras.envio;
  const totalProd    = items.reduce((s,i)=>s+i.precio,0);
  const totalEnvases = envases * PRECIO_ENVASE;
  const totalAgr     = extras.agregados.reduce((s,a)=>s+(parseFloat(a.precio)||0),0);
  const totalEnvio   = (extras.retiraLocal||extras.esInterior) ? 0 : (zona ? zona.precio*extras.bultos : 0);
  const total        = totalProd + totalEnvases + totalAgr + totalEnvio;

  const snap = useCallback(() => {
    saveLS({ codigo, tipo:'PRE', items, envases, extras, total, ts:Date.now(), fecha:new Date().toLocaleString('es-AR') });
  }, [codigo, items, envases, extras, total]);

  const agregarIndividual = () => {
    const { tipo, cantidad, calidad } = cur;
    let precio = (tipo==='lavandina'||tipo==='desodorante') ? PRECIOS[tipo][cantidad] : PRECIOS[tipo][cantidad][calidad];
    let nombre = (tipo==='lavandina'||tipo==='desodorante')
      ? `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${cantidad}lts`
      : `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts`;
    setItems([...items,{ id:uid(), nombre, precio, tipoItem:'individual', tipo, cantidad, calidad }]);
    setCur({ tipo:null, cantidad:null, calidad:null }); setPaso('inicio');
  };

  const agregarCombo = (cantidad, calidad) => {
    const precio = PRECIOS_COMBOS[cantidad][calidad];
    setItems([...items,{ id:uid(), nombre:`Combo Full ${cantidad===50?'Chico':'Grande'} ${calidad}`, precio, tipoItem:'combo', cantidad, calidad }]);
    setPaso('inicio');
  };

  const generarWA = () => {
    snap();
    const lineas = [
      `🧹 *DOMÉSTICO · Pre-Cotización*`,
      `📋 *Código: ${codigo}*`,``,
      `📦 *Productos:*`,
      ...items.map(i=>`• ${i.nombre} — *${fmt(i.precio)}*`),
      envases>0?`• Envases (${envases}) — *${fmt(totalEnvases)}*`:null,
      ...extras.agregados.map(a=>`• ${a.nombre} — *${fmt(a.precio)}*`),``,
      extras.retiraLocal?`🏪 *Retira por el local*`:extras.esInterior?`🚚 Envío interior — VIA CARGO / ANDREANI _(paga el cliente)_`:zona?`🚚 Envío a ${extras.localidad} (${zona.zona}) · ${extras.bultos} bulto${extras.bultos!==1?'s':''} — *${fmt(totalEnvio)}*`:null,``,
      `━━━━━━━━━━━━━━━━`,`💰 *TOTAL ESTIMADO: ${fmt(total)}*`,`━━━━━━━━━━━━━━━━`,``,
      `📌 _Te adjunto esta cotización para que la revises. Si hay algo para modificar, avisame._`,``,
      `💳 _Una vez que nos envíes el comprobante de pago, te pediremos los detalles: colores, fragancias y datos de envío._`,``,
      `🙏 _¡Gracias por confiar en nosotros! Aguardamos tu confirmación._`,``,
      `_Doméstico · Química de Limpieza · Moreno, Bs. As._`,
    ].filter(l=>l!==null).join('\n');
    setWaMensaje(lineas); setPaso('wa');
  };

  return (
    <div>
      {/* Código chip */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <Chip codigo={codigo} tipo="PRE" />
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Pre-Cotización</span>
      </div>

      {/* INICIO */}
      {paso==='inicio' && (
        <div>
          <SH step="Etapa 1" title="Pre-Cotización" />
          {items.length>0 && (
            <div style={s.card}>
              <div style={s.cTit}>Productos cargados</div>
              {items.map((it,i)=>(
                <div key={it.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:i<items.length-1?'1px solid rgba(255,255,255,0.08)':'none' }}>
                  <span style={{ fontSize:13 }}>{it.nombre}</span>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ color:C.na, fontWeight:700 }}>{fmt(it.precio)}</span>
                    <button onClick={()=>setItems(items.filter(x=>x.id!==it.id))} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <button onClick={()=>{ setCur({tipo:null,cantidad:null,calidad:null}); setPaso('tipo'); }} style={s.bP}>➕ Producto Individual</button>
            <button onClick={()=>setPaso('c_tam')} style={s.bV}>📦 Combo Pre-armado</button>
            {items.length>0 && <button onClick={()=>setPaso('extras')} style={s.bS}>Continuar → Extras y envío</button>}
          </div>
        </div>
      )}

      {/* TIPO */}
      {paso==='tipo' && (
        <div>
          <button onClick={()=>setPaso('inicio')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Pre-cotización · Paso 1" title="¿Qué producto?" />
          <G gap={10}>
            {[{k:'jabon',l:'Jabón',i:'🫧'},{k:'suavizante',l:'Suavizante',i:'🌸'},{k:'detergente',l:'Detergente',i:'🟡'},{k:'lavandina',l:'Lavandina',i:'🧴'},{k:'desodorante',l:'Desodorante Piso',i:'✨'}].map(p=>(
              <button key={p.k} onClick={()=>{ setCur({...cur,tipo:p.k}); setPaso('cantidad'); }} style={s.bO}>
                <span>{p.i} <strong>{p.l}</strong></span>
                <span style={{ color:'rgba(255,255,255,0.25)', fontSize:18 }}>›</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* CANTIDAD */}
      {paso==='cantidad' && (
        <div>
          <button onClick={()=>setPaso('tipo')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Pre-cotización · Paso 2" title="¿Cuántos litros?" />
          <G cols={2} gap={14}>
            {[50,200].map(lts=>(
              <button key={lts} onClick={()=>{ setCur({...cur,cantidad:lts}); setPaso(['jabon','suavizante','detergente'].includes(cur.tipo)?'calidad':'confirmar'); }}
                style={{...s.bO,flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
                <span style={{ fontSize:32, fontWeight:900 }}>{lts}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>litros</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* CALIDAD */}
      {paso==='calidad' && (
        <div>
          <button onClick={()=>setPaso('cantidad')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Pre-cotización · Paso 3" title="Calidad" />
          <G gap={10}>
            {[{k:'Inicial',d:'Línea económica'},{k:'Intermedia',d:'Línea estándar'},{k:'Premium',d:'Línea superior'}].map(c=>{
              const p = PRECIOS[cur.tipo]?.[cur.cantidad]?.[c.k];
              return (
                <button key={c.k} onClick={()=>{ setCur({...cur,calidad:c.k}); setPaso('confirmar'); }} style={s.bO}>
                  <span><strong>{c.k}</strong><span style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.45)', fontWeight:400 }}>{c.d}</span></span>
                  <span style={{ color:C.na, fontWeight:800 }}>{p?fmt(p):''}</span>
                </button>
              );
            })}
          </G>
        </div>
      )}

      {/* CONFIRMAR INDIVIDUAL */}
      {paso==='confirmar' && (
        <div>
          <button onClick={()=>setPaso(['jabon','suavizante','detergente'].includes(cur.tipo)?'calidad':'cantidad')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Pre-cotización · Confirmar" title="¿Agregar este producto?" />
          <div style={{...s.card,textAlign:'center',marginBottom:20}}>
            <div style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>{cur.tipo?.charAt(0).toUpperCase()+cur.tipo?.slice(1)} {cur.calidad?`${cur.calidad} `:''}{cur.cantidad}lts</div>
            <div style={s.tot}>{fmt((cur.tipo==='lavandina'||cur.tipo==='desodorante')?PRECIOS[cur.tipo]?.[cur.cantidad]:PRECIOS[cur.tipo]?.[cur.cantidad]?.[cur.calidad]||0)}</div>
          </div>
          <button onClick={agregarIndividual} style={s.bP}>✓ Agregar al listado</button>
        </div>
      )}

      {/* COMBO TAMAÑO */}
      {paso==='c_tam' && (
        <div>
          <button onClick={()=>setPaso('inicio')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Combo · Tamaño" title="Tamaño del combo" />
          <G cols={2} gap={14}>
            {[{lts:50,l:'Chico'},{lts:200,l:'Grande'}].map(t=>(
              <button key={t.lts} onClick={()=>{ setCur({...cur,cantidad:t.lts}); setPaso('c_cal'); }}
                style={{...s.bO,flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
                <span style={{ fontSize:22, fontWeight:900 }}>{t.l}</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{t.lts}lts</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* COMBO CALIDAD */}
      {paso==='c_cal' && (
        <div>
          <button onClick={()=>setPaso('c_tam')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Combo · Calidad" title="Línea de calidad" />
          <G gap={10}>
            {['Inicial','Intermedia','Premium'].map(cal=>(
              <button key={cal} onClick={()=>agregarCombo(cur.cantidad,cal)} style={s.bO}>
                <span>{cal}</span>
                <span style={{ color:C.na, fontWeight:800 }}>{fmt(PRECIOS_COMBOS[cur.cantidad]?.[cal]||0)}</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* EXTRAS */}
      {paso==='extras' && (
        <ExtrasEnvio
          envases={envases} setEnvases={setEnvases}
          extras={extras} setExtras={setExtras}
          zona={detectarZona(extras.localidad)}
          onVolver={()=>setPaso('inicio')}
          onConfirmar={generarWA}
          labelBtn="💬 Pre-cierre → Generar WhatsApp"
        />
      )}

      {/* WA */}
      {paso==='wa' && (
        <div>
          <button onClick={()=>setPaso('extras')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Pre-cierre" title="Mensaje para WhatsApp" />
          <div style={{...s.card, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.25)', marginBottom:14}}>
            <pre style={{ fontFamily:'"Segoe UI",sans-serif', fontSize:13, whiteSpace:'pre-wrap', color:'#fff', lineHeight:1.65, margin:0 }}>{waMensaje}</pre>
          </div>
          <button onClick={()=>navigator.clipboard.writeText(waMensaje).then(()=>alert('✓ Copiado'))} style={{...s.bP, background:'linear-gradient(135deg,#25d366,#128c7e)', marginBottom:10}}>📋 Copiar para WhatsApp</button>
          {/* Opciones post-PRE */}
          <div style={{...s.card, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', marginTop:6}}>
            <div style={s.cTit}>¿Qué hacemos ahora?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={()=>onIrDEF && onIrDEF(codigo)} style={s.bV}>📦 Pasar al Pedido Definitivo ({toDEF(codigo)})</button>
              <button onClick={onVolver} style={s.bS}>🏠 Volver al inicio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DETALLE DEF — completar colores/fragancias por ítem heredado del PRE
// ═══════════════════════════════════════════════════════════════════════════════

const DetalleDEF = ({ itemPRE, onConfirm }) => {
  const { tipo, cantidad, calidad, tipoItem, nombre } = itemPRE;
  const [divisiones, setDivisiones] = useState([]);
  const [modDiv, setModDiv] = useState(false);
  const [colorSel, setColorSel] = useState('');
  const [fragSel, setFragSel] = useState('');
  const [cantFrag, setCantFrag] = useState('');
  const [canjeRev, setCanjeRev] = useState(false);

  const colores = tipo==='jabon'?COLORES_JABON:tipo==='suavizante'?COLORES_SUAVIZANTE:COLORES_DETERGENTE;
  const puedeDiv = ['jabon','suavizante','detergente'].includes(tipo) && cantidad===200;
  const litUsados = divisiones.reduce((s,d)=>s+d.cantidad,0);
  const litResto = (cantidad||0) - litUsados;

  // LAVANDINA — primero pregunta si canjea, luego fragancias si corresponde
  if (tipo==='lavandina') {
    const [canjeIndividual, setCanjeIndividual] = useState(null); // null=sin decidir, false=no, true=sí
    const [fragsIndiv, setFragsIndiv]           = useState([]);
    const [fragSelI, setFragSelI]               = useState('');
    const [cantFragI, setCantFragI]             = useState('');
    const litUsadosI = fragsIndiv.reduce((s,f)=>s+f.cantidad,0);
    const litRestoI  = cantidad - litUsadosI;
    const maxFragI   = cantidad === 200 ? 4 : 1;

    // Paso 1: elegir si canjea o no
    if (canjeIndividual === null) {
      return (
        <div>
          <SH step="Detalle · Lavandina" title={nombre} />
          <div style={{...s.card, textAlign:'center', marginBottom:16}}>
            <div style={{ fontSize:36, marginBottom:6 }}>🧴</div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>Lavandina {cantidad}lts</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>Incluye activador en polvo + activador líquido amarillo</div>
          </div>
          <div style={s.card}>
            <div style={s.cTit}>🔄 ¿Canjear lavandina por desodorante?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>
              Mismo precio · Da crédito de <strong>{cantidad}lts</strong> en desodorante de piso con fragancia a elección
            </div>
            <G cols={2} gap={10}>
              <button onClick={()=>setCanjeIndividual(true)} style={{...s.bP}}>🔄 Sí, canjear</button>
              <button onClick={()=>onConfirm({ ...itemPRE, color:'fija', divisiones:[], canje_lavandina:false })} style={s.bS}>🧴 No, llevar lavandina</button>
            </G>
          </div>
        </div>
      );
    }

    // Paso 2: elegir fragancias con los créditos del canje
    return (
      <div>
        <SH step="Detalle · Canje → Desodorante" title={nombre} />
        <div style={{...s.card, background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.25)', marginBottom:14}}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
            <span>Crédito restante: <strong>{litRestoI}lts</strong></span>
            <span>Fragancias: <strong>{fragsIndiv.length}/{maxFragI}</strong></span>
          </div>
        </div>
        {litRestoI > 0 && fragsIndiv.length < maxFragI && (
          <div style={{ marginBottom:14 }}>
            <G cols={2} gap={8} style={{ marginBottom:10 }}>
              {FRAGANCIAS.map(f=>(
                <button key={f.label} onClick={()=>setFragSelI(f.label)}
                  style={{ padding:'9px 12px', borderRadius:10, border:fragSelI===f.label?`2px solid ${C.na}`:'1px solid rgba(255,255,255,0.14)', background:fragSelI===f.label?'rgba(249,115,22,0.2)':'rgba(255,255,255,0.06)', color:'#fff', fontWeight:600, fontSize:12, cursor:'pointer', display:'flex', gap:6, alignItems:'center' }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </G>
            <label style={s.lbl}>Cantidad</label>
            <select value={cantFragI} onChange={e=>setCantFragI(e.target.value)} style={{...s.inp, marginBottom:10}}>
              <option value="">— Cantidad —</option>
              {(cantidad===200?[50,100,200]:[50]).filter(v=>v<=litRestoI).map(v=><option key={v} value={v}>{v}lts</option>)}
            </select>
            <button onClick={()=>{ if(!fragSelI||!cantFragI) return; setFragsIndiv([...fragsIndiv,{fragancia:fragSelI,cantidad:parseInt(cantFragI)}]); setFragSelI(''); setCantFragI(''); }} disabled={!fragSelI||!cantFragI} style={{...s.bS, opacity:(!fragSelI||!cantFragI)?0.45:1}}>➕ Agregar fragancia</button>
          </div>
        )}
        {fragsIndiv.map((f,i)=>{ const inf=FRAGANCIAS.find(x=>x.label===f.fragancia); return (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', background:'rgba(255,255,255,0.06)', borderRadius:10, marginBottom:8 }}>
            <span>{inf?.icon} {f.fragancia} · {f.cantidad}lts</span>
            <button onClick={()=>setFragsIndiv(fragsIndiv.filter((_,j)=>j!==i))} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>✕</button>
          </div>
        ); })}
        <div style={{ display:'flex', gap:10, marginTop:8 }}>
          <button onClick={()=>setCanjeIndividual(null)} style={{...s.bS, width:'auto', padding:'12px 20px'}}>← Atrás</button>
          {litRestoI === 0 && (
            <button onClick={()=>onConfirm({ ...itemPRE, color:'canje_desodorante', divisiones:fragsIndiv, canje_lavandina:true, fragancias_canje:fragsIndiv })} style={{...s.bP, flex:1}}>✓ Confirmar canje</button>
          )}
          {cantidad === 50 && fragsIndiv.length === 1 && (
            <button onClick={()=>onConfirm({ ...itemPRE, color:'canje_desodorante', divisiones:fragsIndiv, canje_lavandina:true, fragancias_canje:fragsIndiv })} style={{...s.bP, flex:1}}>✓ Confirmar canje</button>
          )}
        </div>
      </div>
    );
  }

  if (tipo==='desodorante') {
    return (
      <div>
        <SH step="Detalle · Fragancia" title={nombre} />
        <div style={{...s.card, background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.25)', marginBottom:14}}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
            <span>Restante: <strong>{litResto}lts</strong></span>
            <span>Fragancias: <strong>{divisiones.length}/{cantidad===200?4:1}</strong></span>
          </div>
        </div>
        {litResto>0 && divisiones.length<(cantidad===200?4:1) && (
          <div style={{ marginBottom:14 }}>
            <G cols={2} gap={8} style={{ marginBottom:10 }}>
              {FRAGANCIAS.map(f=>(
                <button key={f.label} onClick={()=>setFragSel(f.label)}
                  style={{ padding:'9px 12px', borderRadius:10, border:fragSel===f.label?`2px solid ${C.na}`:'1px solid rgba(255,255,255,0.14)', background:fragSel===f.label?'rgba(249,115,22,0.2)':'rgba(255,255,255,0.06)', color:'#fff', fontWeight:600, fontSize:12, cursor:'pointer', display:'flex', gap:6, alignItems:'center' }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </G>
            <label style={s.lbl}>Cantidad</label>
            <select value={cantFrag} onChange={e=>setCantFrag(e.target.value)} style={{...s.inp,marginBottom:10}}>
              <option value="">— Cantidad —</option>
              {[50,100,200].filter(v=>v<=litResto).map(v=><option key={v} value={v}>{v}lts</option>)}
            </select>
            <button onClick={()=>{ if(!fragSel||!cantFrag) return; setDivisiones([...divisiones,{fragancia:fragSel,cantidad:parseInt(cantFrag)}]); setFragSel(''); setCantFrag(''); }} disabled={!fragSel||!cantFrag} style={{...s.bS,opacity:(!fragSel||!cantFrag)?0.45:1}}>➕ Agregar fragancia</button>
          </div>
        )}
        {divisiones.map((d,i)=>{ const inf=FRAGANCIAS.find(f=>f.label===d.fragancia); return (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', background:'rgba(255,255,255,0.06)', borderRadius:10, marginBottom:8 }}>
            <span>{inf?.icon} {d.fragancia} · {d.cantidad}lts</span>
            <button onClick={()=>setDivisiones(divisiones.filter((_,j)=>j!==i))} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>✕</button>
          </div>
        ); })}
        {litResto===0 && <button onClick={()=>onConfirm({...itemPRE,divisiones})} style={s.bP}>✓ Confirmar</button>}
        {cantidad===50 && divisiones.length===1 && <button onClick={()=>onConfirm({...itemPRE,divisiones})} style={s.bP}>✓ Confirmar</button>}
      </div>
    );
  }

  // COMBO
  if (tipoItem==='combo') {
    return <DetalleDEFCombo itemPRE={itemPRE} onConfirm={onConfirm} />;
  }

  // JABÓN / SUAVIZANTE / DETERGENTE
  return (
    <div>
      <SH step="Detalle · Color" title={nombre} />
      {puedeDiv && (
        <div style={{...s.card, background:modDiv?'rgba(249,115,22,0.12)':'rgba(255,255,255,0.06)', border:`1px solid ${modDiv?'rgba(249,115,22,0.35)':'rgba(255,255,255,0.12)'}`, marginBottom:14}}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:600 }}>✂️ Dividir en fracciones de 50lts</span>
            <button onClick={()=>{ setModDiv(!modDiv); setDivisiones([]); setColorSel(''); }}
              style={{ padding:'5px 12px', borderRadius:20, border:'none', background:modDiv?C.na:'rgba(255,255,255,0.15)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:12 }}>
              {modDiv?'ON':'OFF'}
            </button>
          </div>
          {modDiv && <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:6 }}>Hasta 4 fracciones de 50lts, cada una con un color distinto</div>}
        </div>
      )}

      {!modDiv ? (
        <>
          <G cols={tipo==='detergente'?1:3} gap={12}>
            {colores.map(c=>(
              <button key={c.label} onClick={()=>setColorSel(c.label)}
                style={{ padding:tipo==='detergente'?'16px 20px':'16px 8px', borderRadius:12, border:colorSel===c.label?'3px solid #fff':'3px solid transparent', background:c.hex, color:c.tc, fontWeight:700, fontSize:13, cursor:'pointer', textAlign:'left', boxShadow:colorSel===c.label?'0 0 0 3px rgba(255,255,255,0.4)':'none' }}>
                {c.label}
              </button>
            ))}
          </G>
          {colorSel && <button onClick={()=>onConfirm({...itemPRE,color:colorSel,divisiones:[{cantidad,color:colorSel}]})} style={{...s.bP,marginTop:14}}>✓ Confirmar</button>}
        </>
      ) : (
        <div>
          <div style={{...s.card, background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.25)', marginBottom:12}}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span>Restante: <strong>{litResto}lts</strong></span>
              <span>Fracciones: <strong>{divisiones.length}/4</strong></span>
            </div>
          </div>
          {divisiones.length<4 && litResto>=50 && (
            <div style={{ marginBottom:12 }}>
              <label style={s.lbl}>Color para esta fracción (50lts)</label>
              <G cols={tipo==='detergente'?1:3} gap={10} style={{ marginBottom:10 }}>
                {colores.map(c=>(
                  <button key={c.label} onClick={()=>setColorSel(c.label)}
                    style={{ padding:tipo==='detergente'?'12px 16px':'12px 8px', borderRadius:10, border:colorSel===c.label?'3px solid #fff':'3px solid transparent', background:c.hex, color:c.tc, fontWeight:700, fontSize:12, cursor:'pointer', boxShadow:colorSel===c.label?'0 0 0 3px rgba(255,255,255,0.4)':'none' }}>
                    {c.label}
                  </button>
                ))}
              </G>
              <button onClick={()=>{ if(!colorSel||litResto<50) return; setDivisiones([...divisiones,{cantidad:50,color:colorSel}]); setColorSel(''); }} disabled={!colorSel} style={{...s.bS,opacity:colorSel?1:0.45}}>➕ Agregar fracción 50lts</button>
            </div>
          )}
          {divisiones.map((d,i)=>{ const ci=colores.find(c=>c.label===d.color); return (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', borderRadius:10, marginBottom:8, background:ci?.hex||'#e2e8f0', color:ci?.tc||'#1e293b' }}>
              <span style={{ fontWeight:700 }}>{d.cantidad}lts — {d.color}</span>
              <button onClick={()=>setDivisiones(divisiones.filter((_,j)=>j!==i))} style={{ background:'rgba(0,0,0,0.15)', color:ci?.tc||'#1e293b', border:'none', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>✕</button>
            </div>
          ); })}
          {litResto===0 && <button onClick={()=>onConfirm({...itemPRE,color:divisiones[0]?.color||'',divisiones})} style={{...s.bP,marginTop:10}}>✓ Confirmar</button>}
        </div>
      )}
    </div>
  );
};

const DetalleDEFCombo = ({ itemPRE, onConfirm }) => {
  const { cantidad } = itemPRE;
  const [jabonColor, setJabonColor]     = useState('');
  const [suavColor, setSuavColor]       = useState('');
  const [detColor, setDetColor]         = useState('');
  const [jabonDivs, setJabonDivs]       = useState([]);
  const [suavDivs, setSuavDivs]         = useState([]);
  const [detDivs, setDetDivs]           = useState([]);
  const [fragancias, setFragancias]     = useState([]);
  const [canje, setCanje]               = useState(false);
  const [modDiv, setModDiv]             = useState({ j:false, s:false, d:false });
  const [paso, setPaso]                 = useState('jabon');
  const [colorSel, setColorSel]         = useState('');
  const [fragSel, setFragSel]           = useState('');
  const [cantFrag, setCantFrag]         = useState('');
  const es200 = cantidad === 200;
  const maxFrag = es200 ? 4 : 1;
  const litFragUsados = fragancias.reduce((s,f)=>s+f.cantidad,0);
  const litFragResto = cantidad - litFragUsados;

  const agregarDiv = (tipo, color, divs, setDivs) => {
    if (!color || divs.reduce((s,d)=>s+d.cantidad,0) >= cantidad) return;
    setDivs([...divs, { cantidad:50, color }]);
  };

  const DivSelector = ({ colores, tipo, divs, setDivs, setColor, color }) => {
    const total = divs.reduce((s,d)=>s+d.cantidad,0);
    const resto = cantidad - total;
    return (
      <div>
        {total<cantidad && divs.length<4 && (
          <div style={{ marginBottom:12 }}>
            <G cols={tipo==='detergente'?1:3} gap={10} style={{ marginBottom:10 }}>
              {colores.map(c=>(
                <button key={c.label} onClick={()=>setColor(c.label)}
                  style={{ padding:tipo==='detergente'?'12px 16px':'12px 8px', borderRadius:10, border:color===c.label?'3px solid #fff':'3px solid transparent', background:c.hex, color:c.tc, fontWeight:700, fontSize:12, cursor:'pointer', boxShadow:color===c.label?'0 0 0 3px rgba(255,255,255,0.4)':'none' }}>
                  {c.label}
                </button>
              ))}
            </G>
            <button onClick={()=>{ agregarDiv(tipo,color,divs,setDivs); setColor(''); }} disabled={!color} style={{...s.bS,opacity:color?1:0.45}}>➕ Agregar fracción 50lts</button>
          </div>
        )}
        {divs.map((d,i)=>{ const ci=colores.find(c=>c.label===d.color); return (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', borderRadius:10, marginBottom:6, background:ci?.hex||'#e2e8f0', color:ci?.tc||'#1e293b' }}>
            <span style={{ fontWeight:700 }}>50lts — {d.color}</span>
            <button onClick={()=>setDivs(divs.filter((_,j)=>j!==i))} style={{ background:'rgba(0,0,0,0.15)', color:ci?.tc||'#1e293b', border:'none', borderRadius:6, padding:'3px 7px', cursor:'pointer' }}>✕</button>
          </div>
        ); })}
        {total===cantidad && <div style={{ fontSize:12, color:'#4ade80', marginTop:8, fontWeight:700 }}>✓ {cantidad}lts distribuidos</div>}
      </div>
    );
  };

  const [jColSel, setJColSel] = useState('');
  const [sColSel, setSColSel] = useState('');
  const [dColSel, setDColSel] = useState('');

  return (
    <div>
      <SH step="Combo · Detalle" title={itemPRE.nombre} />

      {/* JABÓN */}
      {paso==='jabon' && (
        <div>
          <div style={{ fontSize:16, fontWeight:900, textTransform:'uppercase', letterSpacing:'1px', marginBottom:14, color:'#fff' }}>Paso 1 — Color del Jabón</div>
          {es200 && (
            <div style={{...s.card, background:modDiv.j?'rgba(249,115,22,0.12)':'rgba(255,255,255,0.06)', border:`1px solid ${modDiv.j?'rgba(249,115,22,0.35)':'rgba(255,255,255,0.12)'}`, marginBottom:12}}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600 }}>✂️ Dividir en fracciones</span>
                <button onClick={()=>{ setModDiv({...modDiv,j:!modDiv.j}); setJabonDivs([]); setJabonColor(''); setJColSel(''); }}
                  style={{ padding:'5px 12px', borderRadius:20, border:'none', background:modDiv.j?C.na:'rgba(255,255,255,0.15)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:12 }}>{modDiv.j?'ON':'OFF'}</button>
              </div>
            </div>
          )}
          {!modDiv.j ? (
            <>
              <G cols={3} gap={12}>
                {COLORES_JABON.map(c=>(
                  <button key={c.label} onClick={()=>setJabonColor(c.label)}
                    style={{ padding:'16px 8px', borderRadius:12, border:jabonColor===c.label?'3px solid #fff':'3px solid transparent', background:c.hex, color:c.tc, fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:jabonColor===c.label?'0 0 0 3px rgba(255,255,255,0.4)':'none' }}>
                    {c.label}
                  </button>
                ))}
              </G>
              {jabonColor && <button onClick={()=>{ setJabonDivs([{cantidad,color:jabonColor}]); setPaso('suavizante'); }} style={{...s.bP,marginTop:14}}>Siguiente →</button>}
            </>
          ) : (
            <>
              <DivSelector colores={COLORES_JABON} tipo="jabon" divs={jabonDivs} setDivs={setJabonDivs} setColor={setJColSel} color={jColSel} />
              {jabonDivs.reduce((s,d)=>s+d.cantidad,0)===cantidad && <button onClick={()=>{ setJabonColor(jabonDivs[0]?.color||''); setPaso('suavizante'); }} style={{...s.bP,marginTop:14}}>Siguiente →</button>}
            </>
          )}
        </div>
      )}

      {/* SUAVIZANTE */}
      {paso==='suavizante' && (
        <div>
          <div style={{ fontSize:16, fontWeight:900, textTransform:'uppercase', letterSpacing:'1px', marginBottom:14, color:'#fff' }}>Paso 2 — Color del Suavizante</div>
          {es200 && (
            <div style={{...s.card, background:modDiv.s?'rgba(249,115,22,0.12)':'rgba(255,255,255,0.06)', border:`1px solid ${modDiv.s?'rgba(249,115,22,0.35)':'rgba(255,255,255,0.12)'}`, marginBottom:12}}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600 }}>✂️ Dividir en fracciones</span>
                <button onClick={()=>{ setModDiv({...modDiv,s:!modDiv.s}); setSuavDivs([]); setSuavColor(''); setSColSel(''); }}
                  style={{ padding:'5px 12px', borderRadius:20, border:'none', background:modDiv.s?C.na:'rgba(255,255,255,0.15)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:12 }}>{modDiv.s?'ON':'OFF'}</button>
              </div>
            </div>
          )}
          {!modDiv.s ? (
            <>
              <G cols={3} gap={12}>
                {COLORES_SUAVIZANTE.map(c=>(
                  <button key={c.label} onClick={()=>setSuavColor(c.label)}
                    style={{ padding:'16px 8px', borderRadius:12, border:suavColor===c.label?'3px solid #fff':'3px solid transparent', background:c.hex, color:c.tc, fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:suavColor===c.label?'0 0 0 3px rgba(255,255,255,0.4)':'none' }}>
                    {c.label}
                  </button>
                ))}
              </G>
              {suavColor && <button onClick={()=>{ setSuavDivs([{cantidad,color:suavColor}]); setPaso('detergente'); }} style={{...s.bP,marginTop:14}}>Siguiente →</button>}
            </>
          ) : (
            <>
              <DivSelector colores={COLORES_SUAVIZANTE} tipo="suavizante" divs={suavDivs} setDivs={setSuavDivs} setColor={setSColSel} color={sColSel} />
              {suavDivs.reduce((s,d)=>s+d.cantidad,0)===cantidad && <button onClick={()=>{ setSuavColor(suavDivs[0]?.color||''); setPaso('detergente'); }} style={{...s.bP,marginTop:14}}>Siguiente →</button>}
            </>
          )}
        </div>
      )}

      {/* DETERGENTE */}
      {paso==='detergente' && (
        <div>
          <div style={{ fontSize:16, fontWeight:900, textTransform:'uppercase', letterSpacing:'1px', marginBottom:14, color:'#fff' }}>Paso 3 — Color del Detergente</div>
          {es200 && (
            <div style={{...s.card, background:modDiv.d?'rgba(249,115,22,0.12)':'rgba(255,255,255,0.06)', border:`1px solid ${modDiv.d?'rgba(249,115,22,0.35)':'rgba(255,255,255,0.12)'}`, marginBottom:12}}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600 }}>✂️ Dividir en fracciones</span>
                <button onClick={()=>{ setModDiv({...modDiv,d:!modDiv.d}); setDetDivs([]); setDetColor(''); setDColSel(''); }}
                  style={{ padding:'5px 12px', borderRadius:20, border:'none', background:modDiv.d?C.na:'rgba(255,255,255,0.15)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:12 }}>{modDiv.d?'ON':'OFF'}</button>
              </div>
            </div>
          )}
          {!modDiv.d ? (
            <>
              <G gap={12}>
                {COLORES_DETERGENTE.map(c=>(
                  <button key={c.label} onClick={()=>setDetColor(c.label)}
                    style={{ padding:'16px 20px', borderRadius:12, border:detColor===c.label?'3px solid #fff':'3px solid transparent', background:c.hex, color:c.tc, fontWeight:700, fontSize:14, cursor:'pointer', textAlign:'left', boxShadow:detColor===c.label?'0 0 0 3px rgba(255,255,255,0.4)':'none' }}>
                    {c.label}
                  </button>
                ))}
              </G>
              {detColor && <button onClick={()=>{ setDetDivs([{cantidad,color:detColor}]); setPaso('lavandina'); }} style={{...s.bP,marginTop:14}}>Siguiente →</button>}
            </>
          ) : (
            <>
              <DivSelector colores={COLORES_DETERGENTE} tipo="detergente" divs={detDivs} setDivs={setDetDivs} setColor={setDColSel} color={dColSel} />
              {detDivs.reduce((s,d)=>s+d.cantidad,0)===cantidad && <button onClick={()=>{ setDetColor(detDivs[0]?.color||''); setPaso('lavandina'); }} style={{...s.bP,marginTop:14}}>Siguiente →</button>}
            </>
          )}
        </div>
      )}

      {/* LAVANDINA / CANJE — PRIMERO */}
      {paso==='lavandina' && (
        <div>
          <div style={s.cTit}>Paso 4 · Lavandina</div>
          <div style={{...s.card, textAlign:'center', marginBottom:14}}>
            <div style={{ fontSize:32, marginBottom:6 }}>🧴</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Lavandina {cantidad}lts</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>Incluye activador en polvo + activador líquido amarillo</div>
          </div>
          <div style={s.card}>
            <div style={s.cTit}>🔄 ¿Canjear lavandina por desodorante?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>
              {canje
                ? <span style={{ color:'#4ade80', fontWeight:700 }}>✓ Canjeada — sumás <strong>{cantidad}lts</strong> extra de desodorante</span>
                : `Mismo precio · Da crédito de ${cantidad}lts adicionales en desodorante de piso`}
            </div>
            <G cols={2} gap={10}>
              <button onClick={()=>setCanje(true)} style={{...s.bP, background:canje?'linear-gradient(135deg,#16a34a,#15803d)':undefined}}>🔄 Sí, canjear</button>
              <button onClick={()=>setCanje(false)} style={{...s.bS, borderColor:!canje&&canje!==null?C.na:undefined}}>🧴 No, mantener</button>
            </G>
            {canje && <div style={{ marginTop:10, padding:'10px 14px', background:'rgba(34,197,94,0.12)', borderRadius:10, fontSize:12, fontWeight:700, color:'#4ade80' }}>
              Total desodorante disponible: <strong>{cantidad * 2}lts</strong> ({cantidad}lts del combo + {cantidad}lts de canje)
            </div>}
          </div>
          {canje !== null && (
            <button onClick={()=>setPaso('fragancias')} style={s.bP}>Siguiente → Desodorante de piso</button>
          )}
        </div>
      )}

      {/* FRAGANCIAS — DESPUÉS (con créditos sumados si hay canje) */}
      {paso==='fragancias' && (
        <div>
          <div style={s.cTit}>Paso 5 · Desodorante de piso</div>
          {/* litFragTotal = litros base del combo + litros de canje si eligió canjear */}
          {(() => {
            const litBase = cantidad;
            const litCanje = canje ? cantidad : 0;
            const litTotal = litBase + litCanje;
            const litUsados = fragancias.reduce((s,f)=>s+f.cantidad,0);
            const litResto = litTotal - litUsados;
            const maxF = es200 ? (canje ? 8 : 4) : (canje ? 2 : 1);
            return (
              <div>
                <div style={{...s.card, background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.25)', marginBottom:12}}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                    <span>Restante: <strong>{litResto}lts</strong> / {litTotal}lts total</span>
                    <span>Fragancias: <strong>{fragancias.length}/{maxF}</strong></span>
                  </div>
                  {canje && <div style={{ fontSize:11, color:'#4ade80', marginTop:4 }}>✓ Incluye {litCanje}lts de canje de lavandina</div>}
                </div>
                {litResto>0 && fragancias.length<maxF && (
                  <div style={{ marginBottom:12 }}>
                    <G cols={2} gap={8} style={{ marginBottom:10 }}>
                      {FRAGANCIAS.map(f=>(
                        <button key={f.label} onClick={()=>setFragSel(f.label)}
                          style={{ padding:'9px 12px', borderRadius:10, border:fragSel===f.label?`2px solid ${C.na}`:'1px solid rgba(255,255,255,0.14)', background:fragSel===f.label?'rgba(249,115,22,0.2)':'rgba(255,255,255,0.06)', color:'#fff', fontWeight:600, fontSize:12, cursor:'pointer', display:'flex', gap:6, alignItems:'center' }}>
                          {f.icon} {f.label}
                        </button>
                      ))}
                    </G>
                    <select value={cantFrag} onChange={e=>setCantFrag(e.target.value)} style={{...s.inp,marginBottom:8}}>
                      <option value="">— Cantidad —</option>
                      {(es200?[50,100,200]:[50]).filter(v=>v<=litResto).map(v=><option key={v} value={v}>{v}lts</option>)}
                    </select>
                    <button onClick={()=>{ if(!fragSel||!cantFrag) return; setFragancias([...fragancias,{fragancia:fragSel,cantidad:parseInt(cantFrag)}]); setFragSel(''); setCantFrag(''); }} disabled={!fragSel||!cantFrag} style={{...s.bS,opacity:(!fragSel||!cantFrag)?0.45:1}}>➕ Agregar</button>
                  </div>
                )}
                {fragancias.map((f,i)=>{ const inf=FRAGANCIAS.find(x=>x.label===f.fragancia); return (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', background:'rgba(255,255,255,0.06)', borderRadius:10, marginBottom:8 }}>
                    <span>{inf?.icon} {f.fragancia} · {f.cantidad}lts</span>
                    <button onClick={()=>setFragancias(fragancias.filter((_,j)=>j!==i))} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>✕</button>
                  </div>
                ); })}
                {litResto===0 && (
                  <button onClick={()=>onConfirm({ ...itemPRE, jabon_color:jabonColor, jabon_divs:jabonDivs, suav_color:suavColor, suav_divs:suavDivs, det_color:detColor, det_divs:detDivs, fragancias_piso:fragancias, canje_lavandina:canje })} style={{...s.bP,marginTop:8}}>✓ Confirmar combo</button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PEDIDO DEFINITIVO — hereda del PRE, solo pide detalles
// ═══════════════════════════════════════════════════════════════════════════════

// Helpers para documentos — descarga como archivo HTML (funciona en Claude desktop)
const descargarHTML = (html, nombreArchivo) => {
  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${nombreArchivo}</title><style>body{margin:0;}</style></head><body onload="window.print()">${html}</body></html>`;
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nombreArchivo + '.html';
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
};

// Resumen legible de un ítem DEF confirmado
const ResumenItemDEF = ({ det, itemPRE }) => {
  if (!det) return null;
  const partes = [];
  if (det.canje_lavandina) {
    partes.push('🔄 Canje → Desodorante');
    if (det.fragancias_canje?.length) partes.push(det.fragancias_canje.map(f=>`${f.fragancia} ${f.cantidad}lts`).join(' + '));
  } else if (det.jabon_color) {
    // Combo
    partes.push(`Jabón: ${det.jabon_color}`);
    if (det.jabon_divs?.length>1) partes[partes.length-1] = `Jabón: ${det.jabon_divs.map(d=>`${d.color} 50lts`).join('+')}`;
    partes.push(`Suavizante: ${det.suav_color}`);
    partes.push(`Detergente: ${det.det_color}`);
    if (det.canje_lavandina===true) partes.push('🔄 Canje lavandina');
    if (det.fragancias_piso?.length) partes.push(`Desod: ${det.fragancias_piso.map(f=>`${f.fragancia} ${f.cantidad}lts`).join(' + ')}`);
  } else if (det.divisiones?.length>1) {
    partes.push(det.divisiones.map(d=>`${d.color||d.fragancia} ${d.cantidad}lts`).join(' + '));
  } else if (det.color && det.color!=='fija' && det.color!=='canje_desodorante') {
    partes.push(`Color: ${det.color}`);
  } else if (det.divisiones?.length===1) {
    const d = det.divisiones[0];
    partes.push(d.fragancia ? `${d.fragancia} ${d.cantidad}lts` : `Color: ${d.color}`);
  }
  return <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:3 }}>{partes.join(' · ')}</div>;
};

const PedidoDefinitivo = ({ onVolver, codigoPRE }) => {
  const [codigo]   = useState(()=> codigoPRE ? toDEF(codigoPRE) : toDEF(genCodigoPRE()));
  const preData    = codigoPRE ? loadLS(codigoPRE) : null;
  const itemsPRE   = preData?.items || [];

  // detalles[i] = detalle confirmado para itemsPRE[i] (null si aún no completado)
  const [detalles, setDetalles] = useState(() => itemsPRE.map(() => null));
  // itemActual = índice del ítem que se está completando/editando
  const [itemActual, setItemActual] = useState(preData ? 0 : null);
  // modoEdicion[i] = true si el ítem i está en modo edición
  const [modoEdicion, setModoEdicion] = useState(() => itemsPRE.map(() => false));

  const [carrito, setCarrito]   = useState([]);
  const [paso, setPaso]         = useState(preData ? 'detalles' : 'carrito_manual');
  const [prodInd, setProdInd]   = useState({ tipo:null, cantidad:null, calidad:null });
  const [combo, setCombo]       = useState({ tamaño:null, calidad:null });
  const [envases, setEnvases]   = useState(0);
  const [extras, setExtras]     = useState({ agregados:[], envio:null, bultos:1, esInterior:false, retiraLocal:false, localidad:'' });
  const [cliente, setCliente]   = useState({ nombre:'', telefono:'', email:'', direccion:'', localidad:'', cp:'', observaciones:'' });
  const [pedidoFinal, setPedidoFinal] = useState(null);

  const zonaCliente = detectarZona(cliente.localidad);
  const todosCompletos = detalles.length > 0 && detalles.every(d => d !== null);

  // Confirmar detalle de un ítem (nuevo o editado)
  const confirmarDetalle = (itemDetallado) => {
    const nuevos = detalles.map((d, i) => i === itemActual ? itemDetallado : d);
    setDetalles(nuevos);
    const nuevosEdicion = modoEdicion.map((_, i) => i === itemActual ? false : _);
    setModoEdicion(nuevosEdicion);

    // Avanzar al siguiente pendiente, o al siguiente en orden
    const sigPendiente = nuevos.findIndex((d, i) => d === null && i !== itemActual);
    if (sigPendiente !== -1) {
      setItemActual(sigPendiente);
    } else if (itemActual < itemsPRE.length - 1) {
      setItemActual(itemActual + 1);
    }
    // Si todos completos, no navegamos automáticamente — el usuario presiona el botón
  };

  const iniciarEdicion = (i) => {
    setItemActual(i);
    const nuevosEdicion = modoEdicion.map((_, idx) => idx === i ? true : _);
    setModoEdicion(nuevosEdicion);
  };

  const pasarACliente = () => {
    setCarrito(itemsPRE.map((item, i) => ({ ...item, ...detalles[i], id: item.id || uid() })));
    setPaso('cliente');
  };

  const confirmarPedido = () => {
    const zona = detectarZona(extras.localidad || cliente.localidad);
    // En DEF los precios ya están cerrados en el PRE — tomamos todo de allí
    const pre = preData || {};
    const totPRE = pre.totales || {};
    // Total: siempre del PRE (ya abonado). Si por alguna razón no existe, calculamos limpio.
    const totalProd = Number(totPRE.productos) || itemsPRE.reduce((s,i)=>s+Number(i.precio||0)*(Number(i.cantidad)||1),0);
    const totalEnv  = Number(totPRE.envases)  || 0;
    const totalAgr  = Number(totPRE.agregados) || 0;
    const totalEnvio = Number(totPRE.envio)    || 0;
    const total = Number(totPRE.total) || (totalProd + totalEnv + totalAgr + totalEnvio);
    const envasesHeredados = pre.envases ?? 0;
    const agregadosHeredados = pre.extras?.agregados ?? [];
    const p = {
      codigo, codigoPRE, tipo:'DEF', numero:codigo,
      fecha:new Date().toLocaleString('es-AR'), ts:Date.now(),
      cliente, items:carrito,
      envases:envasesHeredados,
      extras:{ ...extras, agregados:agregadosHeredados },
      totales:{ productos:totalProd, envases:totalEnv, agregados:totalAgr, envio:totalEnvio, total },
      zonaEnvio:zona, estado:'pendiente'
    };
    saveLS(p); setPedidoFinal(p); setPaso('docs');
  };

  const imprimirTodo = () => {
    if (!pedidoFinal) return;
    const { codigo, fecha, cliente, items, envases:env, extras:ex, totales:tot, zonaEnvio } = pedidoFinal;
    const esR = ex.retiraLocal; const esI = ex.esInterior;
    const envioTexto = esR?'🏪 Retira por el local':esI?'Envío interior — VIA CARGO / ANDREANI':(zonaEnvio?`${zonaEnvio.zona} · ${ex.bultos} bulto${ex.bultos!==1?'s':''} — ${fmt(tot.envio)}`:'');

    const htmlCot = `<div style="padding:20px;font-family:Arial;color:#1e293b;max-width:600px;">
      <div style="border-bottom:3px solid #0d5c3a;padding-bottom:10px;margin-bottom:16px;"><div style="font-size:20px;font-weight:900;color:#0d5c3a;">🧹 DOMÉSTICO · Cotización</div><div style="font-size:12px;color:#64748b;">${codigo} · ${fecha}</div></div>
      <div style="margin-bottom:14px;"><div style="font-weight:700;">${cliente.nombre}</div><div style="font-size:12px;color:#64748b;">${cliente.telefono} · ${cliente.email||''}</div><div style="font-size:12px;color:#64748b;">${cliente.direccion}, ${cliente.localidad}</div></div>
      ${items.map(i=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:13px;"><span>${i.nombre}${(i.cantidad||1)>1?` ×${i.cantidad}`:''}</span><span style="font-weight:700;">${fmt(i.precio*(i.cantidad||1))}</span></div>`).join('')}
      ${env>0?`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:13px;"><span>Envases (${env})</span><span style="font-weight:700;">${fmt(tot.envases)}</span></div>`:''}
      ${ex.agregados.map(a=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:13px;"><span>${a.nombre}</span><span style="font-weight:700;">${fmt(a.precio)}</span></div>`).join('')}
      <div style="padding:8px 0;font-size:13px;color:#64748b;">${envioTexto}</div>
      <div style="margin-top:14px;display:flex;justify-content:space-between;font-weight:900;font-size:18px;color:#0d5c3a;border-top:2px solid #0d5c3a;padding-top:10px;"><span>TOTAL A ABONAR</span><span>${fmt(tot.total)}</span></div>
      ${cliente.observaciones?`<div style="margin-top:12px;padding:10px;background:#fef3c7;border-radius:8px;font-size:12px;"><strong>📝 Obs:</strong> ${cliente.observaciones}</div>`:''}
      <div style="margin-top:16px;font-size:10px;color:#94a3b8;">Precios con 15% OFF · Doméstico Química de Limpieza · Moreno, Bs. As.</div>
      <style>@media print{@page{size:A4;margin:10mm;}}</style></div>`;

    const htmlProd = `<div style="padding:14px;font-family:Arial;font-size:12px;color:#1e293b;max-width:800px;">
      <div style="border-bottom:3px solid #0d5c3a;padding-bottom:8px;margin-bottom:10px;"><div style="font-size:16px;font-weight:900;color:#0d5c3a;">🏭 ORDEN DE PRODUCCIÓN</div><div style="font-size:11px;color:#64748b;">${codigo} · ${fecha} · ${cliente.nombre}</div></div>
      ${items.map(item=>{
        const divs = item.jabon_divs||item.suav_divs||item.det_divs||item.divisiones||[];
        const hasDivs = divs.length>1;
        const colInfo = [...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===item.color);
        return `<div style="padding:8px 10px;border-left:4px solid #0d5c3a;background:#f8fafc;margin-bottom:7px;border-radius:4px;">
          <div style="font-weight:800;font-size:13px;">${(item.cantidad||1)>1?`[×${item.cantidad}] `:''}${item.nombre}</div>
          ${item.descripcion?`<div style="font-size:10px;color:#64748b;">${item.descripcion}</div>`:''}
          ${hasDivs?divs.map(d=>{const ci=[...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===d.color);return `<span style="display:inline-flex;align-items:center;gap:4px;background:${ci?.hex||'#e2e8f0'};color:${ci?.tc||'#1e293b'};border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;margin:2px;">● 50lts ${d.color}</span>`;}).join(''):colInfo?`<div style="margin-top:4px;display:inline-flex;align-items:center;gap:5px;background:${colInfo.hex};color:${colInfo.tc};border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;">● ${colInfo.label}</div>`:''}
          ${item.jabon_color?`<div style="font-size:10px;margin-top:4px;">J:${item.jabon_color} · S:${item.suav_color} · D:${item.det_color}</div>`:''}
          ${item.fragancias_piso?.length?`<div style="font-size:10px;margin-top:2px;">Desodorante: ${item.fragancias_piso.map(f=>`${f.fragancia} ${f.cantidad}lts`).join(' + ')}</div>`:''}
          ${item.canje_lavandina?`<div style="font-size:11px;font-weight:700;color:#f97316;margin-top:4px;">⚠️ CANJE: Sin lavandina → Desodorante${item.fragancias_canje?.length?' ('+item.fragancias_canje.map(f=>`${f.fragancia} ${f.cantidad}lts`).join(' + ')+')'  :''}</div>`:''}
        </div>`;
      }).join('')}
      ${env>0?`<div style="padding:8px 10px;border-left:4px solid #f97316;background:#fff7ed;margin-bottom:7px;border-radius:4px;font-weight:800;">🪣 Envases vacíos: ${env}</div>`:''}
      ${cliente.observaciones?`<div style="margin-top:10px;padding:7px 10px;background:#fef3c7;border-radius:6px;font-size:11px;"><strong>⚠️ Obs:</strong> ${cliente.observaciones}</div>`:''}
      <div style="margin-top:10px;padding:6px 10px;background:#fee2e2;border-radius:6px;font-size:11px;font-weight:700;">✋ VERIFICAR colores, fragancias y cantidades antes de embolsar.</div>
      <style>@media print{@page{size:A4;margin:10mm;}}</style></div>`;

    const htmlEtiq = `<div style="width:100mm;min-height:150mm;background:#fff;color:#1e293b;font-family:Arial;padding:8mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
      <div style="border-bottom:4px solid #0d5c3a;padding-bottom:4mm;margin-bottom:4mm;text-align:center;"><div style="font-size:20px;font-weight:900;color:#0d5c3a;">🧹 DOMÉSTICO</div><div style="font-size:9px;color:#64748b;">Química de Limpieza · Moreno</div></div>
      <div style="flex:1;"><div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:3px;">Destinatario</div>
      <div style="font-size:19px;font-weight:900;line-height:1.1;margin-bottom:4px;">${cliente.nombre}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${cliente.direccion}</div>
      <div style="font-size:13px;font-weight:600;">${cliente.localidad}${cliente.cp?` (${cliente.cp})`:''}</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px;">📱 ${cliente.telefono}</div>
      ${cliente.observaciones?`<div style="margin-top:6px;padding:4px 8px;background:#fef3c7;border-radius:4px;font-size:10px;font-weight:600;">⚠️ ${cliente.observaciones}</div>`:''}
      </div>
      ${esI?`<div style="margin:5px 0;padding:5px 8px;background:#fbbf24;border-radius:5px;text-align:center;font-weight:900;font-size:12px;">📦 VIA CARGO / ANDREANI</div>`:''}
      <div style="border-top:2px solid #e2e8f0;padding-top:3mm;margin-top:3mm;display:flex;justify-content:space-between;align-items:flex-end;">
        <div style="font-size:9px;"><div style="font-weight:700;">${codigo}</div><div style="color:#64748b;">${fecha.split(',')[0]}</div></div>
        <div style="text-align:right;font-size:9px;"><div style="font-weight:700;">${ex.bultos||1} bulto${(ex.bultos||1)!==1?'s':''}</div></div>
      </div>
      <style>@media print{@page{size:100mm 150mm;margin:0;}body{margin:0;}}</style></div>`;

    const htmlCheck = `<div style="padding:14px;font-family:Arial;font-size:12px;color:#1e293b;max-width:800px;">
      <div style="border-bottom:3px solid #0d5c3a;padding-bottom:8px;margin-bottom:10px;"><div style="font-size:16px;font-weight:900;color:#0d5c3a;">✅ CHECKLIST DE CONTROL</div><div style="font-size:11px;color:#64748b;">${codigo} · ${fecha} · ${cliente.nombre}</div></div>
      ${items.map(item=>{
        const divs = item.divisiones||[];
        const colInfo = [...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===item.color);
        return `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9;">
          <div style="width:18px;height:18px;border:2px solid #0d5c3a;border-radius:3px;flex-shrink:0;margin-top:1px;"></div>
          <div><div style="font-weight:700;">${item.nombre}</div>
          ${divs.length>1?divs.map(d=>{const ci=[...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===d.color);return `<span style="background:${ci?.hex||'#e2e8f0'};color:${ci?.tc||'#1e293b'};border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700;margin-right:3px;">● 50lts ${d.color}</span>`;}).join(''):colInfo?`<span style="background:${colInfo.hex};color:${colInfo.tc};border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700;">● ${colInfo.label}</span>`:''}
          ${item.fragancias_piso?.length?`<div style="font-size:10px;margin-top:2px;">${item.fragancias_piso.map(f=>`${f.fragancia} ${f.cantidad}lts`).join(' + ')}</div>`:''}
          ${item.canje_lavandina?`<div style="font-size:11px;color:#f97316;font-weight:700;margin-top:3px;">⚠️ CANJE: Sin lavandina → Desodorante${item.fragancias_canje?.length?' ('+item.fragancias_canje.map(f=>`${f.fragancia} ${f.cantidad}lts`).join(' + ')+')'  :''}</div>`:''}
          </div></div>`;
      }).join('')}
      ${env>0?`<div style="font-weight:800;font-size:11px;text-transform:uppercase;margin-top:10px;margin-bottom:6px;color:#f97316;">Envases</div>${Array.from({length:env}).map((_,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9;"><div style="width:18px;height:18px;border:2px solid #f97316;border-radius:3px;flex-shrink:0;"></div><span>🪣 Envase vacío (${i+1}/${env})</span></div>`).join('')}`:''}
      <div style="font-weight:800;font-size:11px;text-transform:uppercase;margin-top:10px;margin-bottom:6px;color:#0d5c3a;">Embalaje y despacho</div>
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9;"><div style="width:18px;height:18px;border:2px solid #0d5c3a;border-radius:3px;"></div><span>Bultos embalados: ${ex.bultos||1}</span></div>
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9;"><div style="width:18px;height:18px;border:2px solid #0d5c3a;border-radius:3px;"></div><span>Etiqueta de envío pegada</span></div>
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;"><div style="width:18px;height:18px;border:2px solid #0d5c3a;border-radius:3px;"></div><span>${esR?'Entrega en local':'Envío despachado'}</span></div>
      ${cliente.observaciones?`<div style="margin-top:10px;padding:7px 10px;background:#fef3c7;border-radius:6px;font-size:11px;"><strong>⚠️ Obs:</strong> ${cliente.observaciones}</div>`:''}
      <style>@media print{@page{size:A4;margin:10mm;}}</style></div>`;

    descargarHTML(htmlCot, codigo+'-cotizacion');
    setTimeout(()=>descargarHTML(htmlProd, codigo+'-produccion'),400);
    setTimeout(()=>descargarHTML(htmlCheck, codigo+'-checklist'),800);
    setTimeout(()=>descargarHTML(htmlEtiq, codigo+'-etiqueta'),1200);
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <Chip codigo={codigo} tipo="DEF" />
        {codigoPRE && <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>desde {codigoPRE}</span>}
      </div>

      {/* DETALLAR ÍTEMS DEL PRE */}
      {paso==='detalles' && (
        <div>
          {/* Barra de navegación Atrás / Adelante */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <button
              onClick={()=>{ if(itemActual>0) setItemActual(itemActual-1); }}
              disabled={itemActual===0 || itemActual===null}
              style={{ padding:'7px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor: itemActual===0?'default':'pointer', opacity: itemActual===0?0.35:1 }}>
              ← Atrás
            </button>
            <button
              onClick={()=>{ if(itemActual<itemsPRE.length-1) setItemActual(itemActual+1); }}
              disabled={itemActual===itemsPRE.length-1}
              style={{ padding:'7px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor: itemActual===itemsPRE.length-1?'default':'pointer', opacity: itemActual===itemsPRE.length-1?0.35:1 }}>
              Adelante →
            </button>
            <div style={{ flex:1 }} />
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', alignSelf:'center' }}>
              {detalles.filter(Boolean).length}/{itemsPRE.length} completos
            </span>
          </div>

          {/* Panel de ítems con estado */}
          <div style={{ ...s.card, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', marginBottom:16 }}>
            <div style={s.cTit}>Productos del pedido</div>
            {itemsPRE.map((it, i) => {
              const completo = detalles[i] !== null;
              const activo   = i === itemActual;
              const det      = detalles[i];
              return (
                <div key={it.id} style={{ borderBottom: i<itemsPRE.length-1?'1px solid rgba(255,255,255,0.07)':'none', padding:'8px 0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                      {completo
                        ? <span style={{ color:'#4ade80', fontSize:14, fontWeight:900 }}>✓</span>
                        : activo
                          ? <span style={{ color:C.na, fontSize:13, fontWeight:700 }}>▶</span>
                          : <span style={{ color:'rgba(255,255,255,0.25)', fontSize:13 }}>○</span>
                      }
                      <span style={{ fontWeight: activo ? 700 : 400, color: activo ? '#fff' : 'rgba(255,255,255,0.7)' }}>{it.nombre}</span>
                    </span>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ color:C.na, fontWeight:700, fontSize:12 }}>{fmt(it.precio)}</span>
                      {completo && !activo && (
                        <button onClick={()=>iniciarEdicion(i)}
                          style={{ padding:'3px 10px', background:'rgba(249,115,22,0.15)', color:C.na, border:`1px solid rgba(249,115,22,0.3)`, borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                          ✏️ Editar
                        </button>
                      )}
                      {!completo && !activo && (
                        <button onClick={()=>setItemActual(i)}
                          style={{ padding:'3px 10px', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                          Ir
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Resumen si está completo */}
                  {completo && <ResumenItemDEF det={det} itemPRE={it} />}
                </div>
              );
            })}
          </div>

          {/* Formulario del ítem actual */}
          {itemActual !== null && itemActual < itemsPRE.length && (
            <div>
              {modoEdicion[itemActual] && (
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, padding:'8px 14px', background:'rgba(249,115,22,0.12)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:10 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C.na }}>✏️ Editando ítem {itemActual+1}</span>
                  <button onClick={()=>{ setModoEdicion(modoEdicion.map((_,i)=>i===itemActual?false:_)); }}
                    style={{ marginLeft:'auto', padding:'4px 10px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:6, fontSize:11, cursor:'pointer' }}>
                    Cancelar edición
                  </button>
                </div>
              )}
              <DetalleDEF key={`${itemActual}-${modoEdicion[itemActual]}`} itemPRE={itemsPRE[itemActual]} onConfirm={confirmarDetalle} />
            </div>
          )}

          {/* Botón continuar solo cuando todos completos */}
          {todosCompletos && (
            <div style={{ marginTop:20, padding:'14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#4ade80', marginBottom:10 }}>✓ Todos los productos definidos</div>
              <button onClick={pasarACliente} style={s.bV}>Continuar → Datos del cliente</button>
            </div>
          )}
        </div>
      )}

      {/* CLIENTE */}
      {paso==='cliente' && (
        <div>
          <button onClick={()=>setPaso('detalles')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
          <SH step="Datos del cliente" title="¿A quién le vendés?" />
          <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
            {[{k:'nombre',l:'Nombre completo *',t:'text'},{k:'telefono',l:'Teléfono / WhatsApp *',t:'tel'},{k:'email',l:'Email',t:'email'},{k:'direccion',l:'Dirección de entrega *',t:'text'},{k:'localidad',l:'Localidad *',t:'text'},{k:'cp',l:'Código Postal',t:'text'}].map(f=>(
              <div key={f.k}><label style={s.lbl}>{f.l}</label><input type={f.t} value={cliente[f.k]} onChange={e=>setCliente({...cliente,[f.k]:e.target.value})} style={s.inp} placeholder={f.l.replace(' *','')} /></div>
            ))}
            <div><label style={s.lbl}>Observaciones</label><textarea value={cliente.observaciones} onChange={e=>setCliente({...cliente,observaciones:e.target.value})} style={{...s.inp,minHeight:70,resize:'vertical'}} placeholder="Notas especiales para la entrega..." /></div>
            {cliente.localidad && (() => { const z = detectarZona(cliente.localidad); return (
              <div style={{ padding:'10px 14px', borderRadius:10, fontSize:13, background:z?'rgba(34,197,94,0.13)':'rgba(239,68,68,0.13)', border:`1px solid ${z?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}` }}>
                {z?<><span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:z.color, marginRight:6 }}></span><strong>{z.zona}</strong> — zona detectada</>:'⚠️ Zona no detectada — se confirmará en el siguiente paso.'}
              </div>
            ); })()}
          </div>
          <button onClick={()=>{ setExtras(e=>({...e,localidad:cliente.localidad})); setPaso('extras'); }} disabled={!cliente.nombre||!cliente.telefono||!cliente.direccion||!cliente.localidad} style={{...s.bP,opacity:(!cliente.nombre||!cliente.telefono||!cliente.direccion||!cliente.localidad)?0.45:1,cursor:(!cliente.nombre||!cliente.telefono||!cliente.direccion||!cliente.localidad)?'not-allowed':'pointer'}}>Continuar → Logística de entrega</button>
        </div>
      )}

      {/* LOGÍSTICA DEF — solo operativo, sin precios */}
      {paso==='extras' && (() => {
        const zona = detectarZona(extras.localidad || cliente.localidad);
        return (
          <div>
            <button onClick={()=>setPaso('cliente')} style={{ padding:'8px 14px', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.75)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer', marginBottom:18 }}>← Atrás</button>
            <SH step="Logística de entrega" title="¿Cómo entregamos el pedido?" />

            {/* Info: ya pagó */}
            <div style={{ marginBottom:18, padding:'10px 14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:10, fontSize:12, color:'rgba(255,255,255,0.65)' }}>
              ✓ Pedido ya abonado. Solo definí la logística de entrega.
            </div>

            {/* Opción: Retira por el local */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {[
                { key:'retiraLocal', label:'🏪 Retira por el local', desc:'El cliente pasa a buscar su pedido' },
                { key:'envioLocal',  label:'🚚 Envío (zona local)', desc: zona ? `${zona.zona}` : 'Entrega a domicilio' },
                { key:'esInterior', label:'📦 Envío al interior', desc:'Via Cargo / Andreani — el flete lo paga el cliente' },
              ].map(op => {
                const active = op.key === 'retiraLocal' ? extras.retiraLocal
                  : op.key === 'esInterior' ? extras.esInterior
                  : (!extras.retiraLocal && !extras.esInterior);
                return (
                  <button key={op.key} onClick={() => {
                    if (op.key === 'retiraLocal') setExtras(e=>({...e, retiraLocal:true, esInterior:false}));
                    else if (op.key === 'esInterior') setExtras(e=>({...e, retiraLocal:false, esInterior:true}));
                    else setExtras(e=>({...e, retiraLocal:false, esInterior:false}));
                  }} style={{ textAlign:'left', padding:'12px 16px', background: active ? 'rgba(13,92,58,0.35)' : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.12)'}`, borderRadius:10, color:'#fff', cursor:'pointer' }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{op.label}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{op.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Bultos — solo si es envío local */}
            {!extras.retiraLocal && !extras.esInterior && (
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.7)', display:'block', marginBottom:6 }}>Cantidad de bultos</label>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button onClick={()=>setExtras(e=>({...e,bultos:Math.max(1,e.bultos-1)}))} style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ fontSize:22, fontWeight:900, minWidth:30, textAlign:'center' }}>{extras.bultos || 1}</span>
                  <button onClick={()=>setExtras(e=>({...e,bultos:(e.bultos||1)+1}))} style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>bulto{(extras.bultos||1)!==1?'s':''}</span>
                </div>
              </div>
            )}

            {/* Nota interior */}
            {extras.esInterior && (
              <div style={{ marginBottom:20, padding:'10px 14px', background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.25)', borderRadius:10, fontSize:12, color:'rgba(255,255,255,0.65)' }}>
                📦 El flete al interior corre por cuenta del cliente. Coordinar con Via Cargo o Andreani.
              </div>
            )}

            <button onClick={confirmarPedido} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', border:'none', borderRadius:12, fontWeight:900, fontSize:15, cursor:'pointer', letterSpacing:0.5 }}>
              ✓ Confirmar y generar documentos
            </button>
          </div>
        );
      })()}

      {/* DOCUMENTOS */}
      {paso==='docs' && pedidoFinal && (
        <div>
          <div style={{...s.card, background:'rgba(34,197,94,0.14)', border:'1px solid rgba(34,197,94,0.28)', marginBottom:20}}>
            <div style={{ fontSize:17, fontWeight:900, color:'#4ade80', marginBottom:2 }}>✓ Pedido generado</div>
            <div style={{ fontSize:22, fontWeight:900, letterSpacing:1 }}>{pedidoFinal.codigo}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>{pedidoFinal.fecha} · {pedidoFinal.cliente.nombre}</div>
            <div style={{ fontSize:24, fontWeight:900, color:C.na, marginTop:8 }}>{fmt(pedidoFinal.totales.total)}</div>
          </div>
          <button onClick={imprimirTodo} style={{...s.bP,marginBottom:6}}>⬇️ Descargar 4 documentos</button>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textAlign:'center', marginBottom:16 }}>Se descargan 4 archivos .html → abrilos en Chrome y usá Cmd+P para imprimir</div>
          {/* WA resumen */}
          {(() => {
            const { codigo, fecha, cliente:cl, items, envases:env, extras:ex, totales:tot, zonaEnvio } = pedidoFinal;
            const texto = [`🧹 *DOMÉSTICO · Pedido Confirmado*`,`📋 *${codigo}*`,`📅 ${fecha}`,``,`👤 *${cl.nombre}*`,`📱 ${cl.telefono}`,`📍 ${cl.direccion}, ${cl.localidad}`,cl.observaciones?`📝 *Obs:* ${cl.observaciones}`:null,``,`━━━━━━━━━━━━━━━━`,`🛒 *PRODUCTOS*`,`━━━━━━━━━━━━━━━━`,...items.map(i=>`• ${i.nombre}${(i.cantidad||1)>1?` ×${i.cantidad}`:''} — *${fmt(i.precio*(i.cantidad||1))}*`),env>0?`• Envases (${env}) — *${fmt(tot.envases)}*`:null,...ex.agregados.map(a=>`• ${a.nombre} — *${fmt(a.precio)}*`),``,ex.retiraLocal?`🏪 *Retira por el local*`:ex.esInterior?`🚚 Envío interior — VIA CARGO / ANDREANI`:zonaEnvio?`🚚 ${zonaEnvio.zona} · ${ex.bultos} bulto${ex.bultos!==1?'s':''} — *${fmt(tot.envio)}*`:null,``,`━━━━━━━━━━━━━━━━`,`💰 *TOTAL: ${fmt(tot.total)}*`,`━━━━━━━━━━━━━━━━`,``,`_Doméstico · Química de Limpieza · Moreno, Bs. As._`].filter(l=>l!==null).join('\n');
            return (
              <div style={{...s.card, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.25)', marginBottom:14}}>
                <div style={s.cTit}>💬 Resumen para WhatsApp</div>
                <pre style={{ fontFamily:'"Segoe UI",sans-serif', fontSize:12, whiteSpace:'pre-wrap', color:'#fff', lineHeight:1.6, margin:'0 0 12px' }}>{texto}</pre>
                <button onClick={()=>navigator.clipboard.writeText(texto).then(()=>alert('✓ Copiado'))} style={{...s.bP, background:'linear-gradient(135deg,#25d366,#128c7e)'}}>📋 Copiar para WhatsApp</button>
              </div>
            );
          })()}
          <button onClick={onVolver} style={{...s.bS,marginTop:8}}>🏠 Volver al inicio</button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

const App = () => {
  const [etapa, setEtapa]     = useState('inicio');
  const [busqueda, setBusqueda] = useState('');
  const [busError, setBusError] = useState('');
  const [busResult, setBusResult] = useState(null);
  const [busResultExtra, setBusResultExtra] = useState(null);
  const [codigoPRE, setCodigoPRE] = useState(null);

  const pedidos = listLS();

  const buscar = () => {
    const q = busqueda.trim().toUpperCase();
    if (!q) return;
    // Si es solo números, intentar con prefijos PRE y DEF
    const soloNumeros = /^\d+$/.test(q);
    if (soloNumeros) {
      const resPRE = loadLS('PRE' + q);
      const resDEF = loadLS('DEF' + q);
      if (resPRE || resDEF) {
        // Mostrar ambos si existen
        setBusResult(resPRE || resDEF);
        setBusResultExtra(resPRE && resDEF ? resDEF : null);
        setBusError('');
      } else {
        setBusResult(null); setBusResultExtra(null);
        setBusError(`No se encontró ningún pedido con el número "${q}"`);
      }
      return;
    }
    const res = loadLS(q);
    if (res) { setBusResult(res); setBusResultExtra(null); setBusError(''); }
    else { setBusResult(null); setBusResultExtra(null); setBusError(`No se encontró "${q}"`); }
  };

  const abrir = (p) => {
    setBusResult(null); setBusqueda(''); setBusError('');
    if (p.tipo==='PRE') { setCodigoPRE(null); setEtapa('pre_cargado_'+p.codigo); }
    else { setCodigoPRE(p.codigoPRE||null); setEtapa('def'); }
  };

  const irPreNuevo = () => { setCodigoPRE(null); setEtapa('pre'); };
  const irDefNuevo = () => { setCodigoPRE(null); setEtapa('def'); };
  const irDefDesdePRE = (cod) => { setCodigoPRE(cod); setEtapa('def'); };
  const irInicio = () => { setEtapa('inicio'); setBusResult(null); setBusqueda(''); setBusError(''); };

  const esPRECargado = etapa.startsWith('pre_cargado_');
  const codigoCargado = esPRECargado ? loadLS(etapa.replace('pre_cargado_','')) : null;

  return (
    <div style={s.app}>
      {/* HEADER */}
      <div style={s.hdr}>
        <div style={s.hIn}>
          <button onClick={irInicio} style={{ background:'none', border:'none', color:'#fff', fontSize:20, fontWeight:900, cursor:'pointer', letterSpacing:'-0.5px', padding:0 }}>🧹 Doméstico</button>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={irInicio} style={{ padding:'5px 12px', background: etapa==='inicio' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer' }}>🏠 Inicio</button>
            <div style={{ background:C.na, color:'#fff', fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:20, letterSpacing:'0.5px' }}>15% OFF</div>
          </div>
        </div>
      </div>

      <div style={s.wrap}>

        {/* ── INICIO ── */}
        {etapa==='inicio' && (
          <div>
            <div style={{ paddingTop:8, marginBottom:28 }}>
              <div style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.5px', marginBottom:4 }}>Sistema de Ventas</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)' }}>Doméstico · Química de Limpieza</div>
            </div>

            <G gap={12} style={{ marginBottom:28 }}>
              <button onClick={irPreNuevo} style={s.bP}>📋 Nueva Pre-Cotización</button>
              <button onClick={irDefNuevo} style={s.bV}>📦 Nuevo Pedido Definitivo</button>
            </G>

            {/* Buscador */}
            <div style={s.card}>
              <div style={s.cTit}>🔍 Buscar por código</div>
              <div style={{ display:'flex', gap:10, marginBottom:6 }}>
                <input value={busqueda} onChange={e=>{ setBusqueda(e.target.value.toUpperCase()); setBusError(''); setBusResult(null); setBusResultExtra(null); }} onKeyDown={e=>e.key==='Enter'&&buscar()} style={{...s.inp,flex:1,letterSpacing:'1px',fontWeight:700}} placeholder="070601 · PRE070601 · DEF070601" />
                <button onClick={buscar} style={{ padding:'12px 18px', background:C.na, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', flexShrink:0 }}>Buscar</button>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:10 }}>Podés buscar solo con números o con el código completo</div>
              {busError && <div style={{ fontSize:13, color:'#f87171', marginBottom:8 }}>⚠️ {busError}</div>}
              {[busResult, busResultExtra].filter(Boolean).map((res, idx) => res && (
                <div key={idx} style={{ padding:'12px 14px', background:'rgba(34,197,94,0.12)', borderRadius:10, border:'1px solid rgba(34,197,94,0.25)', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <Chip codigo={res.codigo} tipo={res.tipo} />
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{res.fecha}</span>
                  </div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.na, marginBottom:10 }}>{fmt(res.total||0)}</div>
                  <G cols={res.tipo==='PRE'?3:2} gap={8}>
                    <button onClick={()=>abrir(res)} style={s.bV}>Continuar</button>
                    {res.tipo==='PRE' && <button onClick={()=>irDefDesdePRE(res.codigo)} style={s.bP}>→ DEF</button>}
                    <button onClick={()=>{ setBusResult(null); setBusResultExtra(null); }} style={s.bS}>✕</button>
                  </G>
                </div>
              ))}
            </div>

            {/* Últimos pedidos */}
            {pedidos.length>0 && (
              <div style={s.card}>
                <div style={s.cTit}>📋 Últimos pedidos</div>
                {pedidos.slice(0,6).map((p,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:i<Math.min(pedidos.length,6)-1?'1px solid rgba(255,255,255,0.07)':'none' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <Chip codigo={p.codigo} tipo={p.tipo} />
                      </div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{p.fecha}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ color:C.na, fontWeight:700, fontSize:13 }}>{fmt(p.total||0)}</span>
                      <button onClick={()=>abrir(p)} style={{ padding:'5px 12px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600 }}>Abrir</button>
                      {p.tipo==='PRE' && <button onClick={()=>irDefDesdePRE(p.codigo)} style={{ padding:'5px 12px', background:'rgba(34,197,94,0.2)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600 }}>→DEF</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRE NUEVA ── */}
        {etapa==='pre' && <PreCotizacion onVolver={irInicio} onIrDEF={(cod)=>{ setCodigoPRE(cod); setEtapa('def'); }} />}

        {/* ── PRE CARGADA ── */}
        {esPRECargado && <PreCotizacion onVolver={irInicio} onIrDEF={(cod)=>{ setCodigoPRE(cod); setEtapa('def'); }} preloaded={codigoCargado} />}

        {/* ── DEF ── */}
        {etapa==='def' && <PedidoDefinitivo onVolver={irInicio} codigoPRE={codigoPRE} />}

      </div>
    </div>
  );
};

export default App;
