import React, { useState } from 'react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const PRECIOS = {
  jabon:       { 50: { Inicial: 23001, Intermedia: 25366, Premium: 27731 }, 200: { Inicial: 87268, Intermedia: 96728, Premium: 106188 } },
  suavizante:  { 50: { Inicial: 24772, Intermedia: 25954, Premium: 27731 }, 200: { Inicial: 94363, Intermedia: 99330, Premium: 106425 } },
  detergente:  { 50: { Inicial: 24662, Intermedia: 27755, Premium: 31464 }, 200: { Inicial: 93955, Intermedia: 106070, Premium: 120905 } },
  lavandina:   { 50: 4250, 200: 13975 },
  desodorante: { 50: 4250, 200: 13975 },
};

const PRECIOS_COMBOS = {
  50:  { Inicial: 77924, Intermedia: 83842, Premium: 90937  },
  200: { Inicial: 283679, Intermedia: 312180, Premium: 353568 },
};

const COLORES_JABON      = [{ label: 'Azul',    hex: '#3b82f6', tc: '#fff' }, { label: 'Verde',   hex: '#22c55e', tc: '#fff' }, { label: 'Violeta', hex: '#a855f7', tc: '#fff' }];
const COLORES_SUAVIZANTE = [{ label: 'Blanco',  hex: '#f1f5f9', tc: '#1e293b' }, { label: 'Celeste', hex: '#7dd3fc', tc: '#1e293b' }, { label: 'Violeta', hex: '#a855f7', tc: '#fff' }];
const COLORES_DETERGENTE = [{ label: 'Amarillo', hex: '#fbbf24', tc: '#1e293b' }, { label: 'Verde (a pedido)', hex: '#4ade80', tc: '#1e293b' }, { label: 'Azul (a pedido)', hex: '#60a5fa', tc: '#fff' }];
const FRAGANCIAS = [
  { label: 'Cherry', icon: '🍒' }, { label: 'Lavanda', icon: '💜' }, { label: 'Marina', icon: '🌊' },
  { label: 'Pino', icon: '🌲' }, { label: 'Arpegio', icon: '🎵' }, { label: 'Fresh', icon: '❄️' },
  { label: 'Summer', icon: '☀️' }, { label: 'Chile', icon: '🌶️' }, { label: 'Sandía', icon: '🍉' }, { label: 'Naranja', icon: '🍊' },
];

const PRECIO_ENVASE = 4000;

const ZONAS_ENVIO = [
  {
    zona: 'Moreno', color: '#ef4444', precio: 4500,
    localidades: ['MORENO', 'PASO DEL REY', 'CUARTEL V', 'FRANCISCO ALVAREZ', 'LA REJA', 'TRUJUI', 'BORDENAVE'],
  },
  {
    zona: 'Cordón 1', color: '#fb923c', precio: 5500,
    localidades: ['JOSE C PAZ', 'JOSE C. PAZ', 'SAN MIGUEL', 'ITUZAINGO', 'ITUZAINGÓ', 'MERLO', 'MALVINAS ARGENTINAS', 'DEL VISO ITUZAINGO'],
  },
  {
    zona: 'Cordón 2', color: '#3b82f6', precio: 6500,
    localidades: ['LA MATANZA', 'MORON', 'MORÓN', 'HURLINGHAM', '3 DE FEBRERO', 'TRES DE FEBRERO', 'SAN MARTIN', 'SAN MARTÍN',
      'VICENTE LOPEZ', 'VICENTE LÓPEZ', 'SAN FERNANDO', 'TIGRE', 'SAN ISIDRO', 'AVELLANEDA', 'LANUS', 'LANÚS',
      'LOMAS DE ZAMORA', 'BERAZATEGUI', 'FLORENCIO VARELA', 'ALMIRANTE BROWN', 'QUILMES', 'EZEIZA',
      'ESTEBAN ECHEVERRIA', 'ESTEBAN ECHEVERRÍA', 'CABA', 'CAPITAL FEDERAL', 'BUENOS AIRES', 'CIUDAD DE BUENOS AIRES',
      'PALERMO', 'BELGRANO', 'CABALLITO', 'FLORES', 'VILLA DEL PARQUE', 'VILLA URQUIZA', 'NUÑEZ', 'RECOLETA',
      'VILLA DEVOTO', 'MATADEROS', 'LINIERS', 'RAMOS MEJIA', 'RAMOS MEJÍA', 'SAN JUSTO', 'TAPIALES',
      'CIUDADELA', 'EL PALOMAR', 'HAEDO', 'CASTELAR', 'ITUZAINGO', 'VILLA LUZURIAGA'],
  },
  {
    zona: 'Cordón 3', color: '#22c55e', precio: 9500,
    localidades: ['ESCOBAR', 'INGENIERO MASCHWITZ', 'ING MASCHWITZ', 'PILAR', 'ZARATE', 'ZÁRATE', 'CAMPANA',
      'LUJAN', 'LUJÁN', 'GENERAL RODRIGUEZ', 'GENERAL RODRÍGUEZ', 'MARCOS PAZ', 'CAÑUELAS', 'GUERNICA',
      'SAN VICENTE', 'VILLA ELISA', 'BERISSO', 'LA PLATA', 'ENSENADA', 'DERQUI', 'VILLA ROSA', 'NORDELTA',
      'EXALTACION DE LA CRUZ', 'EXALTACIÓN DE LA CRUZ', 'GENERAL LAS HERAS', 'CORONEL BRANDSEN',
      'BRANDSEN', 'MAGDALENA', 'LOBOS', 'MONTE', 'NAVARRO', 'SUIPACHA', 'MERCEDES'],
  },
];

function detectarZona(localidad) {
  if (!localidad) return null;
  const norm = localidad.toUpperCase().trim();
  for (const z of ZONAS_ENVIO) {
    if (z.localidades.some(l => norm === l || norm.includes(l) || l.includes(norm))) return z;
  }
  return null;
}

// Componentes incluidos por producto
function componentesDeItem(item) {
  const comps = [];
  if (item.tipo === 'combo') {
    const { tamaño, fragancias_piso, dividir_jabon, dividir_suavizante, dividir_detergente, canje_lavandina } = item.detalle;
    const n = tamaño === 200 ? 1 : 1;
    const sufijo = tamaño === 200 ? '200lts' : '50lts';
    // Jabón
    if (dividir_jabon && dividir_jabon.length > 1) dividir_jabon.forEach(() => comps.push('🧪 Activador en polvo 50lts (jabón)'));
    else comps.push(`🧪 Activador en polvo ${sufijo} (jabón)`);
    // Detergente
    if (dividir_detergente && dividir_detergente.length > 1) dividir_detergente.forEach(() => comps.push('🧪 Activador en polvo 50lts (detergente)'));
    else comps.push(`🧪 Activador en polvo ${sufijo} (detergente)`);
    // Lavandina o canje
    if (canje_lavandina) comps.push(`🔄 CANJE: Lavandina → Desodorante ${sufijo}`);
    else {
      comps.push(`🧪 Activador en polvo ${sufijo} (lavandina)`);
      comps.push(`🟡 Activador líquido amarillo ${sufijo} (lavandina)`);
    }
    return comps;
  }
  if (item.detalle?.tipo === 'jabon') {
    if (item.detalle.divisiones && item.detalle.divisiones.length > 1)
      item.detalle.divisiones.forEach(() => comps.push('🧪 Activador en polvo 50lts (jabón)'));
    else comps.push(`🧪 Activador en polvo ${item.detalle.cantidad}lts (jabón)`);
  }
  if (item.detalle?.tipo === 'detergente') {
    if (item.detalle.divisiones && item.detalle.divisiones.length > 1)
      item.detalle.divisiones.forEach(() => comps.push('🧪 Activador en polvo 50lts (detergente)'));
    else comps.push(`🧪 Activador en polvo ${item.detalle.cantidad}lts (detergente)`);
  }
  if (item.detalle?.tipo === 'lavandina') {
    comps.push(`🧪 Activador en polvo ${item.detalle.cantidad}lts (lavandina)`);
    comps.push(`🟡 Activador líquido amarillo ${item.detalle.cantidad}lts (lavandina)`);
  }
  return comps;
}

// ─── ESTILOS ─────────────────────────────────────────────────────────────────

const C = { verde: '#0d5c3a', verdeOsc: '#062918', verdeMed: '#1a7a52', naranja: '#f97316', naranjaOsc: '#c2520a' };
const s = {
  app: { minHeight: '100vh', background: `linear-gradient(160deg,${C.verdeOsc} 0%,${C.verde} 55%,${C.verdeMed} 100%)`, fontFamily: '"Inter","Segoe UI",system-ui,sans-serif', color: '#fff', paddingBottom: 40 },
  header: { background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 100 },
  hInner: { maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  wrap: { maxWidth: 640, margin: '0 auto', padding: '20px 16px' },
  card: { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 16, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 },
  stepLbl: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 },
  stepTitle: { fontSize: 22, fontWeight: 900, letterSpacing: '-0.4px', marginBottom: 20 },
  btnP: { width: '100%', padding: '15px 20px', background: `linear-gradient(135deg,${C.naranja},${C.naranjaOsc})`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 18px rgba(249,115,22,0.45)' },
  btnS: { width: '100%', padding: '13px 20px', background: 'rgba(255,255,255,0.09)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  btnV: { width: '100%', padding: '15px 20px', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 18px rgba(22,163,74,0.35)' },
  btnB: { padding: '8px 14px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', marginBottom: 18 },
  btnO: { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  inp: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  lbl: { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 5 },
  total: { fontSize: 28, fontWeight: 900, color: C.naranja, letterSpacing: '-0.5px' },
};
const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const uid = () => Math.random().toString(36).substr(2, 9);
const G = ({ cols = 1, gap = 10, children }) => <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap }}>{children}</div>;
const BB = ({ onClick, label = '← Atrás' }) => <button onClick={onClick} style={s.btnB}>{label}</button>;
const SH = ({ step, title }) => <div style={{ marginBottom: 20 }}><div style={s.stepLbl}>{step}</div><div style={s.stepTitle}>{title}</div></div>;

// ─── PRE-COTIZACIÓN ───────────────────────────────────────────────────────────

const PreCotizacion = ({ onIrAPedido }) => {
  const [items, setItems]   = useState([]);
  const [paso, setPaso]     = useState('inicio');
  const [cur, setCur]       = useState({ tipo: null, cantidad: null, calidad: null });
  const [envases, setEnvases] = useState(0);
  const [zonaManual, setZonaManual] = useState(null);
  const [localidad, setLocalidad]   = useState('');
  const [bultos, setBultos]         = useState(1);
  const [esInterior, setEsInterior] = useState(false);
  const [waMensaje, setWaMensaje]   = useState('');

  const zona = detectarZona(localidad) || zonaManual;
  const totalProd    = items.reduce((s, i) => s + i.precio, 0);
  const totalEnvases = envases * PRECIO_ENVASE;
  const totalEnvio   = esInterior ? 0 : (zona ? zona.precio * bultos : 0);
  const total        = totalProd + totalEnvases + totalEnvio;

  const agregarItem = () => {
    const { tipo, cantidad, calidad } = cur;
    let precio = 0;
    if (tipo === 'lavandina' || tipo === 'desodorante') precio = PRECIOS[tipo][cantidad];
    else precio = PRECIOS[tipo][cantidad][calidad];
    const nombre = tipo === 'lavandina' || tipo === 'desodorante'
      ? `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${cantidad}lts`
      : `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts`;
    setItems([...items, { id: uid(), nombre, precio }]);
    setCur({ tipo: null, cantidad: null, calidad: null });
    setPaso('inicio');
  };

  const generarWA = () => {
    const lineas = [
      `🧹 *DOMÉSTICO · Pre-Cotización*`,
      ``,
      `📋 *Productos solicitados:*`,
      ...items.map(i => `• ${i.nombre} — *${fmt(i.precio)}*`),
      envases > 0 ? `• Envases (${envases} ud.) — *${fmt(totalEnvases)}*` : null,
      ``,
      esInterior
        ? `🚚 Envío al interior — VIA CARGO / ANDREANI _(el flete lo abona el cliente)_`
        : zona ? `🚚 Envío a ${localidad} (${zona.zona}) · ${bultos} bulto${bultos !== 1 ? 's' : ''} — *${fmt(totalEnvio)}*` : null,
      ``,
      `━━━━━━━━━━━━━━━━`,
      `💰 *TOTAL ESTIMADO: ${fmt(total)}*`,
      `━━━━━━━━━━━━━━━━`,
      ``,
      `📌 _Te adjunto esta cotización para que la revises y me indiques si hay algo para modificar._`,
      ``,
      `💳 _El importe total es el que tenés que transferir a nuestra cuenta. Una vez que nos envíes el comprobante de pago, te pediremos los detalles del pedido: colores, fragancias y datos personales para el envío._`,
      ``,
      `🙏 _¡Gracias por confiar en nosotros! Aguardamos tu confirmación._`,
      ``,
      `_Doméstico · Química de Limpieza · Moreno, Bs. As._`,
    ].filter(l => l !== null).join('\n');
    setWaMensaje(lineas);
    setPaso('wa');
  };

  const copiarWA = () => {
    navigator.clipboard.writeText(waMensaje).then(() => alert('✓ Copiado. Pegalo en WhatsApp.'));
  };

  return (
    <div>
      {/* INICIO PRE */}
      {paso === 'inicio' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>Etapa 1</div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.4px', marginBottom: 4 }}>Pre-Cotización</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Cotización rápida · Sin colores ni datos personales</div>
          </div>

          {items.length > 0 && (
            <div style={{ ...s.card, marginBottom: 14 }}>
              <div style={s.cardTitle}>Productos agregados</div>
              {items.map((it, i) => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <span style={{ fontSize: 13 }}>{it.nombre}</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(it.precio)}</span>
                    <button onClick={() => setItems(items.filter(x => x.id !== it.id))} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { setCur({ tipo: null, cantidad: null, calidad: null }); setPaso('pre_tipo'); }} style={s.btnP}>➕ Agregar producto</button>
            {items.length > 0 && <button onClick={() => setPaso('pre_extras')} style={s.btnV}>Continuar → Envases y envío</button>}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, marginTop: 4 }}>
              <button onClick={onIrAPedido} style={{ ...s.btnS, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                📦 Ir al Pedido Definitivo (post-confirmación)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRE: TIPO */}
      {paso === 'pre_tipo' && (
        <div>
          <BB onClick={() => setPaso('inicio')} />
          <SH step="Pre-cotización · Paso 1" title="¿Qué producto?" />
          <G gap={10}>
            {[
              { key: 'jabon', label: 'Jabón', icon: '🫧' },
              { key: 'suavizante', label: 'Suavizante', icon: '🌸' },
              { key: 'detergente', label: 'Detergente', icon: '🟡' },
              { key: 'lavandina', label: 'Lavandina', icon: '🧴' },
              { key: 'desodorante', label: 'Desodorante Piso', icon: '✨' },
            ].map(p => (
              <button key={p.key} onClick={() => { setCur({ ...cur, tipo: p.key }); setPaso('pre_cantidad'); }} style={s.btnO}>
                <span>{p.icon} <strong>{p.label}</strong></span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* PRE: CANTIDAD */}
      {paso === 'pre_cantidad' && (
        <div>
          <BB onClick={() => setPaso('pre_tipo')} />
          <SH step="Pre-cotización · Paso 2" title="¿Cuántos litros?" />
          <G cols={2} gap={14}>
            {[50, 200].map(lts => (
              <button key={lts} onClick={() => { setCur({ ...cur, cantidad: lts }); setPaso(['jabon','suavizante','detergente'].includes(cur.tipo) ? 'pre_calidad' : 'pre_confirmar'); }}
                style={{ ...s.btnO, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <span style={{ fontSize: 32, fontWeight: 900 }}>{lts}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>litros</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* PRE: CALIDAD */}
      {paso === 'pre_calidad' && (
        <div>
          <BB onClick={() => setPaso('pre_cantidad')} />
          <SH step="Pre-cotización · Paso 3" title="Calidad" />
          <G gap={10}>
            {[
              { key: 'Inicial', desc: 'Línea económica' },
              { key: 'Intermedia', desc: 'Línea estándar' },
              { key: 'Premium', desc: 'Línea superior' },
            ].map(c => {
              const precio = PRECIOS[cur.tipo]?.[cur.cantidad]?.[c.key];
              return (
                <button key={c.key} onClick={() => { setCur({ ...cur, calidad: c.key }); setPaso('pre_confirmar'); }} style={s.btnO}>
                  <span><strong>{c.key}</strong><span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>{c.desc}</span></span>
                  <span style={{ color: C.naranja, fontWeight: 800 }}>{precio ? fmt(precio) : ''}</span>
                </button>
              );
            })}
          </G>
        </div>
      )}

      {/* PRE: CONFIRMAR */}
      {paso === 'pre_confirmar' && (
        <div>
          <BB onClick={() => setPaso(['jabon','suavizante','detergente'].includes(cur.tipo) ? 'pre_calidad' : 'pre_cantidad')} />
          <SH step="Pre-cotización · Confirmar" title="¿Agregar este producto?" />
          <div style={{ ...s.card, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              {cur.tipo?.charAt(0).toUpperCase()+cur.tipo?.slice(1)} {cur.calidad ? `${cur.calidad} ` : ''}{cur.cantidad}lts
            </div>
            <div style={s.total}>
              {cur.tipo === 'lavandina' || cur.tipo === 'desodorante'
                ? fmt(PRECIOS[cur.tipo]?.[cur.cantidad])
                : fmt(PRECIOS[cur.tipo]?.[cur.cantidad]?.[cur.calidad] || 0)}
            </div>
          </div>
          <button onClick={agregarItem} style={s.btnP}>✓ Agregar al listado</button>
        </div>
      )}

      {/* PRE: EXTRAS */}
      {paso === 'pre_extras' && (
        <div>
          <BB onClick={() => setPaso('inicio')} />
          <SH step="Pre-cotización · Extras" title="Envases y envío" />

          {/* Envases */}
          <div style={s.card}>
            <div style={s.cardTitle}>🪣 Envases — $4.000 c/u</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => setEnvases(Math.max(0, envases - 1))} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>−</button>
              <span style={{ fontSize: 26, fontWeight: 900, minWidth: 44, textAlign: 'center' }}>{envases}</span>
              <button onClick={() => setEnvases(envases + 1)} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>+</button>
              {envases > 0 && <span style={{ color: C.naranja, fontWeight: 800 }}>{fmt(envases * PRECIO_ENVASE)}</span>}
            </div>
          </div>

          {/* Envío */}
          <div style={s.card}>
            <div style={s.cardTitle}>🚚 Envío</div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
              <input type="checkbox" checked={esInterior} onChange={e => setEsInterior(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2 }} />
              <span style={{ fontSize: 13 }}>Envío al interior (VIA CARGO / ANDREANI)<br /><span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>El cliente paga al transportista</span></span>
            </label>
            {!esInterior && (
              <>
                <div><label style={s.lbl}>Localidad del cliente</label>
                  <input value={localidad} onChange={e => setLocalidad(e.target.value)} style={{ ...s.inp, marginBottom: 8 }} placeholder="Ej: La Matanza, Pilar..." />
                </div>
                {localidad && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 10,
                    background: zona ? 'rgba(34,197,94,0.13)' : 'rgba(239,68,68,0.13)',
                    border: `1px solid ${zona ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                    {zona ? `📍 ${zona.zona} — ${fmt(zona.precio)}/bulto` : '⚠️ No encontrada. Seleccioná la zona:'}
                  </div>
                )}
                {localidad && !zona && (
                  <G gap={8} style={{ marginBottom: 10 }}>
                    {ZONAS_ENVIO.map(z => (
                      <button key={z.zona} onClick={() => setZonaManual(z)}
                        style={{ ...s.btnO, background: zonaManual?.zona === z.zona ? 'rgba(249,115,22,0.2)' : undefined, borderColor: zonaManual?.zona === z.zona ? C.naranja : undefined }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 12, height: 12, borderRadius: '50%', background: z.color, display: 'inline-block' }}></span>
                          {z.zona}
                        </span>
                        <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(z.precio)}/bulto</span>
                      </button>
                    ))}
                  </G>
                )}
                {zona && (
                  <div style={{ marginTop: 8 }}>
                    <label style={s.lbl}>Cantidad de bultos</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <button onClick={() => setBultos(Math.max(1, bultos - 1))} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>−</button>
                      <span style={{ fontSize: 26, fontWeight: 900, minWidth: 44, textAlign: 'center' }}>{bultos}</span>
                      <button onClick={() => setBultos(bultos + 1)} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>+</button>
                      <span style={{ color: C.naranja, fontWeight: 800 }}>{fmt(zona.precio * bultos)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Resumen */}
          <div style={{ ...s.card, background: 'rgba(249,115,22,0.11)', border: '1px solid rgba(249,115,22,0.28)', marginBottom: 20 }}>
            <div style={s.cardTitle}>Resumen estimado</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              {items.map((it, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>{it.nombre}</span><span>{fmt(it.precio)}</span></div>)}
              {envases > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envases ({envases})</span><span>{fmt(totalEnvases)}</span></div>}
              {esInterior ? <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío interior</span><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>VIA CARGO / ANDREANI</span></div>
                : totalEnvio > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío ({bultos} bulto{bultos !== 1 ? 's' : ''})</span><span>{fmt(totalEnvio)}</span></div>}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>TOTAL ESTIMADO</span>
                <span style={s.total}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          <button onClick={generarWA} style={{ ...s.btnP, background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>
            💬 Pre-cierre → Generar mensaje WhatsApp
          </button>
        </div>
      )}

      {/* WA */}
      {paso === 'wa' && (
        <div>
          <BB onClick={() => setPaso('pre_extras')} />
          <SH step="Pre-cotización · Pre-cierre" title="Mensaje para WhatsApp" />
          <div style={{ ...s.card, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', marginBottom: 14 }}>
            <pre style={{ fontFamily: '"Segoe UI",sans-serif', fontSize: 13, whiteSpace: 'pre-wrap', color: '#fff', lineHeight: 1.65, margin: 0 }}>{waMensaje}</pre>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={copiarWA} style={{ ...s.btnP, background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>📋 Copiar para WhatsApp</button>
            <button onClick={onIrAPedido} style={s.btnV}>📦 Cliente confirmó → Ir al Pedido Definitivo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export { PreCotizacion, PRECIOS, PRECIOS_COMBOS, COLORES_JABON, COLORES_SUAVIZANTE, COLORES_DETERGENTE, FRAGANCIAS, PRECIO_ENVASE, ZONAS_ENVIO, detectarZona, componentesDeItem, fmt, uid, G, BB, SH, s, C };
