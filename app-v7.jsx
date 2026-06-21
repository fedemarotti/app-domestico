import React, { useState } from 'react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const PRECIOS = {
  jabon:       { 50: { Fresh: 23001, Ultra: 25366, Premium: 27731 }, 200: { Fresh: 87268, Ultra: 96728, Premium: 106188 } },
  suavizante:  { 50: { Fresh: 24772, Ultra: 25954, Premium: 27731 }, 200: { Fresh: 94363, Ultra: 99330, Premium: 106425 } },
  detergente:  { 50: { Fresh: 24662, Ultra: 27755, Premium: 31464 }, 200: { Fresh: 93955, Ultra: 106070, Premium: 120905 } },
  lavandina:   { 50: 4250, 200: 13975 },
  desodorante: { 50: 4250, 200: 13975 },
};

const PRECIOS_COMBOS = {
  50:  { Fresh: 77924,  Ultra: 83842,  Premium: 90937  },
  200: { Fresh: 283679, Ultra: 312180, Premium: 353568 },
};

// Colores con valor visual real
const COLORES_JABON = [
  { label: 'Azul',    hex: '#3b82f6', textColor: '#fff' },
  { label: 'Verde',   hex: '#22c55e', textColor: '#fff' },
  { label: 'Violeta', hex: '#a855f7', textColor: '#fff' },
];
const COLORES_SUAVIZANTE = [
  { label: 'Blanco',   hex: '#f1f5f9', textColor: '#1e293b' },
  { label: 'Celeste',  hex: '#7dd3fc', textColor: '#1e293b' },
  { label: 'Violeta',  hex: '#a855f7', textColor: '#fff'    },
];
const COLORES_DETERGENTE = [
  { label: 'Amarillo',          hex: '#fbbf24', textColor: '#1e293b' },
  { label: 'Verde (a pedido)',  hex: '#4ade80', textColor: '#1e293b' },
  { label: 'Azul (a pedido)',   hex: '#60a5fa', textColor: '#fff'    },
];
const FRAGANCIAS = [
  { label: 'Cherry',   icon: '🍒' },
  { label: 'Lavanda',  icon: '💜' },
  { label: 'Marina',   icon: '🌊' },
  { label: 'Pino',     icon: '🌲' },
  { label: 'Arpegio',  icon: '🎵' },
  { label: 'Fresh',    icon: '❄️' },
  { label: 'Summer',   icon: '☀️' },
  { label: 'Chile',    icon: '🌶️' },
  { label: 'Sandía',   icon: '🍉' },
  { label: 'Naranja',  icon: '🍊' },
];

const PRECIO_ENVASE = 4000;

const ZONAS_ENVIO = [
  { zona: 'Nuestra localidad', localidades: ['MORENO'], precio: 4500 },
  { zona: 'Cordón 1', localidades: ['JOSE C PAZ', 'SAN MIGUEL', 'ITUZAINGO', 'MERLO'], precio: 5500 },
  { zona: 'Cordón 2', localidades: ['LA MATANZA', 'MORON', 'HURLINGHAM', '3 DE FEBRERO', 'SAN MARTIN', 'VICENTE LOPEZ', 'SAN FERNANDO', 'TIGRE', 'MAV ARG', 'AVELLANEDA', 'LANUS', 'BERAZATEGUI', 'FLORENCIO VARELA', 'ALMIRANTE BROWN', 'QUILMES', 'EZEIZA', 'CABA', 'CAPITAL FEDERAL'], precio: 6500 },
  { zona: 'Cordón 3', localidades: ['ESCOBAR', 'INGENIERO MASCHWITZ', 'DEL VISO', 'PILAR', 'ZARATE', 'CAMPANA', 'LUJAN', 'GENERAL RODRIGUEZ', 'MARCOS PAZ', 'CAÑUELAS', 'GUERNICA', 'SAN VICENTE', 'VILLA ELISA', 'BERISSO', 'LA PLATA', 'ENSENADA', 'DERQUI', 'VILLA ROSA', 'NORDELTA'], precio: 9500 },
];

function detectarZona(localidad) {
  if (!localidad) return null;
  const norm = localidad.toUpperCase().trim();
  for (const z of ZONAS_ENVIO) {
    if (z.localidades.some(l => norm.includes(l) || l.includes(norm))) return z;
  }
  return null;
}

// ─── ESTILOS ─────────────────────────────────────────────────────────────────

const C = {
  verde: '#0d5c3a', verdeOsc: '#062918', verdeMed: '#1a7a52',
  naranja: '#f97316', naranjaOsc: '#c2520a',
  blanco: '#ffffff', texto: '#1e293b', textoClaro: '#64748b',
};

const s = {
  app: { minHeight: '100vh', background: `linear-gradient(160deg, ${C.verdeOsc} 0%, ${C.verde} 55%, ${C.verdeMed} 100%)`, fontFamily: '"Inter","Segoe UI",system-ui,sans-serif', color: '#fff', paddingBottom: 40 },
  header: { background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 21, fontWeight: 900, letterSpacing: '-0.5px' },
  badge: { background: C.naranja, color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.5px' },
  wrap: { maxWidth: 640, margin: '0 auto', padding: '20px 16px' },
  card: { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 16, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 },
  stepLbl: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 },
  stepTitle: { fontSize: 22, fontWeight: 900, letterSpacing: '-0.4px', marginBottom: 20 },
  btnPrimary: { width: '100%', padding: '15px 20px', background: `linear-gradient(135deg, ${C.naranja}, ${C.naranjaOsc})`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 18px rgba(249,115,22,0.45)', letterSpacing: '-0.2px' },
  btnSecondary: { width: '100%', padding: '13px 20px', background: 'rgba(255,255,255,0.09)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  btnVerde: { width: '100%', padding: '15px 20px', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 18px rgba(22,163,74,0.35)' },
  btnBack: { padding: '8px 14px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', marginBottom: 18 },
  btnOption: { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  input: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 5 },
  total: { fontSize: 28, fontWeight: 900, color: C.naranja, letterSpacing: '-0.5px' },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const uid = () => Math.random().toString(36).substr(2, 9);
const Grid = ({ cols = 1, gap = 10, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>{children}</div>
);
const BtnBack = ({ onClick, label = '← Atrás' }) => (
  <button onClick={onClick} style={s.btnBack}>{label}</button>
);
const StepHeader = ({ step, title }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={s.stepLbl}>{step}</div>
    <div style={s.stepTitle}>{title}</div>
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────

const PedidosApp = () => {
  const [paso, setPaso]       = useState('inicio');
  const [carrito, setCarrito] = useState([]);
  const [extras, setExtras]   = useState({ envases: 0, agregados: [], envio: null, bultos: 1, esInterior: false });
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '', localidad: '', cp: '', observaciones: '' });
  const [pedidoFinal, setPedidoFinal] = useState(null);
  const [docActivo, setDocActivo]     = useState(null);
  const [borradores, setBorradores]   = useState(() => { try { return JSON.parse(localStorage.getItem('dom_v7')) || []; } catch { return []; } });

  const [prodInd, setProdInd] = useState({ tipo: null, cantidad: null, calidad: null, color: null });
  const [combo, setCombo]     = useState({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [] });

  const totalProductos = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalEnvases   = extras.envases * PRECIO_ENVASE;
  const totalAgregados = extras.agregados.reduce((s, a) => s + (parseFloat(a.precio) || 0), 0);
  const zona           = detectarZona(cliente.localidad);
  const zonaEfectiva   = extras.envio || zona;
  const totalEnvio     = extras.esInterior ? 0 : (zonaEfectiva ? zonaEfectiva.precio * extras.bultos : 0);
  const totalGeneral   = totalProductos + totalEnvases + totalAgregados + totalEnvio;

  const eliminarItem     = (id) => setCarrito(carrito.filter(i => i.id !== id));
  const cambiarCantidad  = (id, d) => setCarrito(carrito.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + d) } : i));

  const agregarIndividual = () => {
    const { tipo, cantidad, calidad, color } = prodInd;
    let nombre = '', precio = 0;
    if (tipo === 'lavandina')       { nombre = `Lavandina ${cantidad}lts`; precio = PRECIOS.lavandina[cantidad]; }
    else if (tipo === 'desodorante'){ nombre = `Desodorante Piso ${cantidad}lts · ${color}`; precio = PRECIOS.desodorante[cantidad]; }
    else { nombre = `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts · ${color}`; precio = PRECIOS[tipo][cantidad][calidad]; }
    setCarrito([...carrito, { id: uid(), tipo: 'individual', nombre, detalle: { tipo, cantidad, calidad, color }, precio, cantidad: 1 }]);
    setProdInd({ tipo: null, cantidad: null, calidad: null, color: null });
    setPaso('carrito');
  };

  const agregarCombo = () => {
    const { tamaño, calidad, jabon_color, suavizante_color, detergente_color, fragancias_piso } = combo;
    const precio = PRECIOS_COMBOS[tamaño][calidad];
    const descFrag = fragancias_piso.map(f => `${f.fragancia} ${f.cantidad}lts`).join(' + ');
    setCarrito([...carrito, {
      id: uid(), tipo: 'combo',
      nombre: `Combo Full ${tamaño === 50 ? 'Chico' : 'Grande'} ${calidad}`,
      descripcion: `Jabón ${jabon_color} · Suavizante ${suavizante_color} · Detergente ${detergente_color} · Desodorante (${descFrag}) · Lavandina`,
      detalle: combo, precio, cantidad: 1
    }]);
    setCombo({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [] });
    setPaso('carrito');
  };

  const generarPedido = () => ({
    numero: `DOM-${Date.now().toString().slice(-8)}`,
    fecha: new Date().toLocaleString('es-AR'),
    cliente,
    items: carrito,
    extras,
    totales: { productos: totalProductos, envases: totalEnvases, agregados: totalAgregados, envio: totalEnvio, total: totalGeneral },
    zonaEnvio: zonaEfectiva,
    estado: 'pendiente',
  });

  const confirmarPedido = () => { setPedidoFinal(generarPedido()); setPaso('documentos'); };
  const guardarBorrador = () => {
    const p = generarPedido();
    const n = [...borradores, p];
    setBorradores(n);
    localStorage.setItem('dom_v7', JSON.stringify(n));
    alert('✓ Guardado');
  };
  const resetear = () => {
    setCarrito([]); setExtras({ envases: 0, agregados: [], envio: null, bultos: 1, esInterior: false });
    setCliente({ nombre: '', telefono: '', email: '', direccion: '', localidad: '', cp: '', observaciones: '' });
    setPedidoFinal(null); setDocActivo(null); setPaso('inicio');
  };

  return (
    <div style={s.app}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>🧹 Doméstico</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {carrito.length > 0 && (
              <button onClick={() => setPaso('carrito')} style={{ background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)', color: C.naranja, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                🛒 {carrito.length} · {fmt(totalProductos)}
              </button>
            )}
            <div style={s.badge}>15% OFF</div>
          </div>
        </div>
      </div>

      <div style={s.wrap}>

        {/* INICIO */}
        {paso === 'inicio' && (
          <div>
            <div style={{ paddingTop: 8, marginBottom: 28 }}>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>Sistema de Pedidos</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Cargá productos y generá el pedido completo</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => { setProdInd({ tipo: null, cantidad: null, calidad: null, color: null }); setPaso('prod_tipo'); }} style={s.btnPrimary}>➕ Producto Individual</button>
              <button onClick={() => { setCombo({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [] }); setPaso('combo_1'); }} style={s.btnVerde}>📦 Combo Pre-armado</button>
              {carrito.length > 0 && <button onClick={() => setPaso('carrito')} style={s.btnSecondary}>🛒 Ver Carrito — {fmt(totalProductos)}</button>}
              {borradores.length > 0 && <button onClick={() => setPaso('borradores')} style={{ ...s.btnSecondary, fontSize: 13 }}>📋 Borradores ({borradores.length})</button>}
            </div>
          </div>
        )}

        {/* TIPO DE PRODUCTO */}
        {paso === 'prod_tipo' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Paso 1 de 4" title="¿Qué producto?" />
            <Grid gap={10}>
              {[
                { key: 'jabon',       label: 'Jabón',            icon: '🫧', sub: '3 calidades · 2 tamaños · 3 colores' },
                { key: 'suavizante',  label: 'Suavizante',       icon: '🌸', sub: '3 calidades · 2 tamaños · 3 colores' },
                { key: 'detergente',  label: 'Detergente',       icon: '🟡', sub: '3 calidades · 2 tamaños · 3 colores' },
                { key: 'lavandina',   label: 'Lavandina',        icon: '🧴', sub: '50lts o 200lts' },
                { key: 'desodorante', label: 'Desodorante Piso', icon: '✨', sub: '10 fragancias · 2 tamaños' },
              ].map(p => (
                <button key={p.key} onClick={() => { setProdInd({ ...prodInd, tipo: p.key }); setPaso('prod_cantidad'); }} style={s.btnOption}>
                  <span>{p.icon} <strong>{p.label}</strong><span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 400, marginTop: 1 }}>{p.sub}</span></span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* CANTIDAD */}
        {paso === 'prod_cantidad' && (
          <div>
            <BtnBack onClick={() => setPaso('prod_tipo')} />
            <StepHeader step="Paso 2 de 4" title="¿Cuántos litros?" />
            <Grid cols={2} gap={14}>
              {[50, 200].map(lts => (
                <button key={lts} onClick={() => { setProdInd({ ...prodInd, cantidad: lts }); setPaso(['jabon','suavizante','detergente'].includes(prodInd.tipo) ? 'prod_calidad' : 'prod_color'); }}
                  style={{ ...s.btnOption, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900 }}>{lts}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>litros</span>
                  {PRECIOS[prodInd.tipo]?.[lts] && (
                    <span style={{ fontSize: 12, color: C.naranja, fontWeight: 700, marginTop: 4 }}>
                      {typeof PRECIOS[prodInd.tipo][lts] === 'number' ? fmt(PRECIOS[prodInd.tipo][lts]) : `desde ${fmt(Math.min(...Object.values(PRECIOS[prodInd.tipo][lts])))}`}
                    </span>
                  )}
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* CALIDAD */}
        {paso === 'prod_calidad' && (
          <div>
            <BtnBack onClick={() => setPaso('prod_cantidad')} />
            <StepHeader step="Paso 3 de 4" title="Línea de calidad" />
            <Grid gap={10}>
              {[
                { key: 'Fresh',   emoji: '🟢', desc: 'Línea económica' },
                { key: 'Ultra',   emoji: '🔵', desc: 'Línea estándar' },
                { key: 'Premium', emoji: '🟣', desc: 'Línea superior' },
              ].map(c => {
                const precio = PRECIOS[prodInd.tipo]?.[prodInd.cantidad]?.[c.key];
                return (
                  <button key={c.key} onClick={() => { setProdInd({ ...prodInd, calidad: c.key }); setPaso('prod_color'); }} style={s.btnOption}>
                    <span>{c.emoji} <strong>{c.key}</strong><span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>{c.desc}</span></span>
                    <span style={{ color: C.naranja, fontWeight: 800, fontSize: 16 }}>{precio ? fmt(precio) : ''}</span>
                  </button>
                );
              })}
            </Grid>
          </div>
        )}

        {/* COLOR / FRAGANCIA */}
        {paso === 'prod_color' && (
          <div>
            <BtnBack onClick={() => setPaso(['jabon','suavizante','detergente'].includes(prodInd.tipo) ? 'prod_calidad' : 'prod_cantidad')} />
            <StepHeader step="Paso 4 de 4" title={prodInd.tipo === 'desodorante' ? 'Fragancia' : prodInd.tipo === 'lavandina' ? 'Confirmar' : 'Color'} />

            {/* LAVANDINA */}
            {prodInd.tipo === 'lavandina' && (
              <div>
                <div style={{ ...s.card, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🧴</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Lavandina {prodInd.cantidad}lts</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.naranja, marginTop: 8 }}>{fmt(PRECIOS.lavandina[prodInd.cantidad])}</div>
                </div>
                <button onClick={() => { setProdInd({ ...prodInd, color: 'fija' }); agregarIndividual(); }} style={s.btnPrimary}>✓ Agregar al carrito</button>
              </div>
            )}

            {/* DESODORANTE - FRAGANCIAS */}
            {prodInd.tipo === 'desodorante' && (
              <>
                <Grid cols={2} gap={10}>
                  {FRAGANCIAS.map(f => (
                    <button key={f.label} onClick={() => setProdInd({ ...prodInd, color: f.label })}
                      style={{ ...s.btnOption, justifyContent: 'flex-start', gap: 10,
                        background: prodInd.color === f.label ? 'rgba(249,115,22,0.22)' : 'rgba(255,255,255,0.07)',
                        borderColor: prodInd.color === f.label ? C.naranja : 'rgba(255,255,255,0.14)',
                        borderWidth: prodInd.color === f.label ? 2 : 1 }}>
                      <span style={{ fontSize: 22 }}>{f.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{f.label}</span>
                    </button>
                  ))}
                </Grid>
                {prodInd.color && (
                  <button onClick={agregarIndividual} style={{ ...s.btnPrimary, marginTop: 14 }}>✓ Agregar al carrito</button>
                )}
              </>
            )}

            {/* JABÓN - COLORES */}
            {prodInd.tipo === 'jabon' && (
              <>
                <Grid cols={3} gap={12}>
                  {COLORES_JABON.map(c => (
                    <button key={c.label} onClick={() => setProdInd({ ...prodInd, color: c.label })}
                      style={{ padding: '16px 8px', borderRadius: 12, border: prodInd.color === c.label ? '3px solid #fff' : '3px solid transparent',
                        background: c.hex, color: c.textColor, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        boxShadow: prodInd.color === c.label ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none',
                        transition: 'all 0.15s' }}>
                      {c.label}
                    </button>
                  ))}
                </Grid>
                {prodInd.color && <button onClick={agregarIndividual} style={{ ...s.btnPrimary, marginTop: 14 }}>✓ Agregar al carrito</button>}
              </>
            )}

            {/* SUAVIZANTE - COLORES */}
            {prodInd.tipo === 'suavizante' && (
              <>
                <Grid cols={3} gap={12}>
                  {COLORES_SUAVIZANTE.map(c => (
                    <button key={c.label} onClick={() => setProdInd({ ...prodInd, color: c.label })}
                      style={{ padding: '16px 8px', borderRadius: 12, border: prodInd.color === c.label ? '3px solid #fff' : '3px solid transparent',
                        background: c.hex, color: c.textColor, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        boxShadow: prodInd.color === c.label ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none',
                        transition: 'all 0.15s' }}>
                      {c.label}
                    </button>
                  ))}
                </Grid>
                {prodInd.color && <button onClick={agregarIndividual} style={{ ...s.btnPrimary, marginTop: 14 }}>✓ Agregar al carrito</button>}
              </>
            )}

            {/* DETERGENTE - COLORES */}
            {prodInd.tipo === 'detergente' && (
              <>
                <Grid gap={12}>
                  {COLORES_DETERGENTE.map(c => (
                    <button key={c.label} onClick={() => setProdInd({ ...prodInd, color: c.label })}
                      style={{ padding: '16px 20px', borderRadius: 12, border: prodInd.color === c.label ? '3px solid #fff' : '3px solid transparent',
                        background: c.hex, color: c.textColor, fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'left',
                        boxShadow: prodInd.color === c.label ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none',
                        transition: 'all 0.15s' }}>
                      {c.label}
                    </button>
                  ))}
                </Grid>
                {prodInd.color && <button onClick={agregarIndividual} style={{ ...s.btnPrimary, marginTop: 14 }}>✓ Agregar al carrito</button>}
              </>
            )}
          </div>
        )}

        {/* COMBO 1: TAMAÑO */}
        {paso === 'combo_1' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Combo · Paso 1 de 6" title="Tamaño del combo" />
            <Grid cols={2} gap={14}>
              {[{ lts: 50, label: 'Chico', desc: '50 litros total' }, { lts: 200, label: 'Grande', desc: '200 litros total' }].map(t => (
                <button key={t.lts} onClick={() => { setCombo({ ...combo, tamaño: t.lts }); setPaso('combo_2'); }}
                  style={{ ...s.btnOption, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                  <span style={{ fontSize: 22, fontWeight: 900 }}>{t.label}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{t.desc}</span>
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* COMBO 2: CALIDAD */}
        {paso === 'combo_2' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, tamaño: null }); setPaso('combo_1'); }} />
            <StepHeader step="Combo · Paso 2 de 6" title="Línea de calidad" />
            <Grid gap={10}>
              {['Fresh','Ultra','Premium'].map(cal => (
                <button key={cal} onClick={() => { setCombo({ ...combo, calidad: cal }); setPaso('combo_3a'); }} style={s.btnOption}>
                  <span>{cal}</span>
                  <span style={{ color: C.naranja, fontWeight: 800 }}>{PRECIOS_COMBOS[combo.tamaño]?.[cal] ? fmt(PRECIOS_COMBOS[combo.tamaño][cal]) : ''}</span>
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* COMBO 3A: COLOR JABÓN */}
        {paso === 'combo_3a' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, calidad: null }); setPaso('combo_2'); }} />
            <StepHeader step="Combo · Paso 3 de 6" title="Color del Jabón" />
            <Grid cols={3} gap={12}>
              {COLORES_JABON.map(c => (
                <button key={c.label} onClick={() => { setCombo({ ...combo, jabon_color: c.label }); setPaso('combo_3b'); }}
                  style={{ padding: 20, borderRadius: 12, border: '3px solid transparent', background: c.hex, color: c.textColor, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  {c.label}
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* COMBO 3B: COLOR SUAVIZANTE */}
        {paso === 'combo_3b' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, jabon_color: null }); setPaso('combo_3a'); }} />
            <StepHeader step="Combo · Paso 4 de 6" title="Color del Suavizante" />
            <Grid cols={3} gap={12}>
              {COLORES_SUAVIZANTE.map(c => (
                <button key={c.label} onClick={() => { setCombo({ ...combo, suavizante_color: c.label }); setPaso('combo_3c'); }}
                  style={{ padding: 20, borderRadius: 12, border: '3px solid transparent', background: c.hex, color: c.textColor, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  {c.label}
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* COMBO 3C: COLOR DETERGENTE */}
        {paso === 'combo_3c' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, suavizante_color: null }); setPaso('combo_3b'); }} />
            <StepHeader step="Combo · Paso 5 de 6" title="Color del Detergente" />
            <Grid gap={12}>
              {COLORES_DETERGENTE.map(c => (
                <button key={c.label} onClick={() => { setCombo({ ...combo, detergente_color: c.label }); setPaso('combo_4'); }}
                  style={{ padding: '16px 20px', borderRadius: 12, border: '3px solid transparent', background: c.hex, color: c.textColor, fontWeight: 700, cursor: 'pointer', fontSize: 14, textAlign: 'left' }}>
                  {c.label}
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* COMBO 4: FRAGANCIAS */}
        {paso === 'combo_4' && (
          <ComboFragancias combo={combo} setCombo={setCombo}
            onConfirm={agregarCombo}
            onCancel={() => { setCombo({ ...combo, detergente_color: null }); setPaso('combo_3c'); }} />
        )}

        {/* CARRITO */}
        {paso === 'carrito' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Carrito" title={`${carrito.length} ítem${carrito.length !== 1 ? 's' : ''}`} />
            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>El carrito está vacío</div>
                <button onClick={() => setPaso('inicio')} style={s.btnPrimary}>Agregar productos</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {carrito.map(item => {
                    const colorInfo = item.detalle?.color && item.detalle.color !== 'fija'
                      ? [...COLORES_JABON, ...COLORES_SUAVIZANTE, ...COLORES_DETERGENTE].find(c => c.label === item.detalle.color)
                      : null;
                    const fragInfo = item.detalle?.tipo === 'desodorante'
                      ? FRAGANCIAS.find(f => f.label === item.detalle.color)
                      : null;
                    return (
                      <div key={item.id} style={{ ...s.card, padding: '14px 16px', marginBottom: 0, borderLeft: `4px solid ${C.naranja}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, marginRight: 10 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{item.nombre}</div>
                            {item.descripcion && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginBottom: 4 }}>{item.descripcion}</div>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {colorInfo && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: colorInfo.hex, color: colorInfo.textColor, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                                  ● {colorInfo.label}
                                </span>
                              )}
                              {fragInfo && (
                                <span style={{ fontSize: 13 }}>{fragInfo.icon} {fragInfo.label}</span>
                              )}
                            </div>
                            <div style={{ fontSize: 14, color: C.naranja, fontWeight: 800, marginTop: 6 }}>{fmt(item.precio * item.cantidad)}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button onClick={() => cambiarCantidad(item.id, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                            <span style={{ fontWeight: 800, minWidth: 22, textAlign: 'center' }}>{item.cantidad}</span>
                            <button onClick={() => cambiarCantidad(item.id, 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            <button onClick={() => eliminarItem(item.id)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: 14 }}>✕</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ ...s.card, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', textAlign: 'right', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Subtotal productos</div>
                  <div style={s.total}>{fmt(totalProductos)}</div>
                </div>
                <Grid cols={2} gap={10}>
                  <button onClick={() => setPaso('inicio')} style={s.btnSecondary}>➕ Agregar más</button>
                  <button onClick={() => setPaso('cliente')} style={s.btnPrimary}>Continuar →</button>
                </Grid>
              </>
            )}
          </div>
        )}

        {/* DATOS CLIENTE */}
        {paso === 'cliente' && (
          <div>
            <BtnBack onClick={() => setPaso('carrito')} />
            <StepHeader step="Datos del cliente" title="¿A quién le vendés?" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[
                { key: 'nombre',    label: 'Nombre completo *',      type: 'text' },
                { key: 'telefono',  label: 'Teléfono / WhatsApp *',  type: 'tel' },
                { key: 'email',     label: 'Email',                  type: 'email' },
                { key: 'direccion', label: 'Dirección de entrega *', type: 'text' },
                { key: 'localidad', label: 'Localidad *',            type: 'text' },
                { key: 'cp',        label: 'Código Postal',          type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={s.label}>{f.label}</label>
                  <input type={f.type} value={cliente[f.key]}
                    onChange={e => setCliente({ ...cliente, [f.key]: e.target.value })}
                    style={s.input} placeholder={f.label.replace(' *', '')} />
                </div>
              ))}
              {/* OBSERVACIONES */}
              <div>
                <label style={s.label}>Observaciones / Notas especiales</label>
                <textarea value={cliente.observaciones}
                  onChange={e => setCliente({ ...cliente, observaciones: e.target.value })}
                  style={{ ...s.input, minHeight: 80, resize: 'vertical' }}
                  placeholder="Ej: Llamar antes de entregar, timbre no funciona, entregar en depósito..." />
              </div>

              {cliente.localidad && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13,
                  background: zona ? 'rgba(34,197,94,0.13)' : 'rgba(239,68,68,0.13)',
                  border: `1px solid ${zona ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  {zona ? `📍 ${zona.zona} — envío base: ${fmt(zona.precio)}/bulto` : '⚠️ Localidad no encontrada. Podrás seleccionar la zona en el siguiente paso.'}
                </div>
              )}
            </div>
            <button onClick={() => setPaso('extras')}
              disabled={!cliente.nombre || !cliente.telefono || !cliente.direccion || !cliente.localidad}
              style={{ ...s.btnPrimary, opacity: (!cliente.nombre || !cliente.telefono || !cliente.direccion || !cliente.localidad) ? 0.45 : 1,
                cursor: (!cliente.nombre || !cliente.telefono || !cliente.direccion || !cliente.localidad) ? 'not-allowed' : 'pointer' }}>
              Continuar → Extras y envío
            </button>
          </div>
        )}

        {/* EXTRAS Y ENVÍO */}
        {paso === 'extras' && (
          <ExtrasEnvio extras={extras} setExtras={setExtras} zona={zona}
            totalProductos={totalProductos} totalEnvases={totalEnvases}
            totalAgregados={totalAgregados} totalEnvio={totalEnvio} totalGeneral={totalGeneral}
            onConfirmar={confirmarPedido} onVolver={() => setPaso('cliente')} />
        )}

        {/* DOCUMENTOS */}
        {paso === 'documentos' && pedidoFinal && (
          <DocumentosPanel pedido={pedidoFinal} docActivo={docActivo}
            setDocActivo={setDocActivo} onNuevo={resetear} onGuardar={guardarBorrador} />
        )}

        {/* BORRADORES */}
        {paso === 'borradores' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Historial" title={`${borradores.length} borradores`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {borradores.map((p, idx) => (
                <div key={idx} style={{ ...s.card, borderLeft: `4px solid ${C.naranja}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.numero}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{p.cliente?.nombre} · {p.fecha}</div>
                      <div style={{ color: C.naranja, fontWeight: 800, marginTop: 4 }}>{fmt(p.totales?.total || 0)}</div>
                    </div>
                    <button onClick={() => { const n = borradores.filter((_, i) => i !== idx); setBorradores(n); localStorage.setItem('dom_v7', JSON.stringify(n)); }}
                      style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 8, cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── COMBO FRAGANCIAS ─────────────────────────────────────────────────────────

const ComboFragancias = ({ combo, setCombo, onConfirm, onCancel }) => {
  const [fragSel, setFragSel] = useState('');
  const [cantSel, setCantSel] = useState('');
  const esChico    = combo.tamaño === 50;
  const litrosUsados = combo.fragancias_piso.reduce((s, f) => s + f.cantidad, 0);
  const litrosRest = combo.tamaño - litrosUsados;
  const maxFrag    = esChico ? 1 : 4;
  const opciones   = esChico ? [50] : [50, 100, 200].filter(v => v <= litrosRest);

  const agregar = () => {
    if (!fragSel || !cantSel) return;
    setCombo({ ...combo, fragancias_piso: [...combo.fragancias_piso, { fragancia: fragSel, cantidad: parseInt(cantSel) }] });
    setFragSel(''); setCantSel('');
  };

  return (
    <div>
      <BtnBack onClick={onCancel} />
      <StepHeader step="Combo · Paso 6 de 6" title="Desodorante de piso" />
      <div style={{ ...s.card, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Restante: <strong>{litrosRest}lts</strong></span>
          <span>Fragancias: <strong>{combo.fragancias_piso.length}/{maxFrag}</strong></span>
        </div>
      </div>

      {combo.fragancias_piso.length < maxFrag && litrosRest > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={s.label}>Fragancia</label>
            <Grid cols={2} gap={8}>
              {FRAGANCIAS.map(f => (
                <button key={f.label} onClick={() => setFragSel(f.label)}
                  style={{ padding: '10px 12px', borderRadius: 10, border: fragSel === f.label ? `2px solid ${C.naranja}` : '1px solid rgba(255,255,255,0.14)',
                    background: fragSel === f.label ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)',
                    color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </Grid>
          </div>
          <label style={s.label}>Cantidad</label>
          <select value={cantSel} onChange={e => setCantSel(e.target.value)} style={{ ...s.input, marginBottom: 10 }}>
            <option value="">— Cantidad —</option>
            {opciones.map(v => <option key={v} value={v}>{v}lts</option>)}
          </select>
          <button onClick={agregar} disabled={!fragSel || !cantSel} style={{ ...s.btnSecondary, opacity: (!fragSel || !cantSel) ? 0.5 : 1 }}>➕ Agregar fragancia</button>
        </div>
      )}

      {combo.fragancias_piso.map((f, i) => {
        const info = FRAGANCIAS.find(x => x.label === f.fragancia);
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>{info?.icon} {f.fragancia} · {f.cantidad}lts</span>
            <button onClick={() => setCombo({ ...combo, fragancias_piso: combo.fragancias_piso.filter((_, j) => j !== i) })}
              style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '4px 9px', cursor: 'pointer' }}>✕</button>
          </div>
        );
      })}

      {litrosRest === 0 && (
        <button onClick={onConfirm} style={{ ...s.btnPrimary, marginTop: 8 }}>✓ Agregar combo al carrito</button>
      )}
    </div>
  );
};

// ─── EXTRAS Y ENVÍO ───────────────────────────────────────────────────────────

const ExtrasEnvio = ({ extras, setExtras, zona, totalProductos, totalEnvases, totalAgregados, totalEnvio, totalGeneral, onConfirmar, onVolver }) => {
  const [nomAgr, setNomAgr]   = useState('');
  const [precAgr, setPrecAgr] = useState('');
  const zonaEfectiva = extras.envio || zona;

  const agregarExtra = () => {
    if (!nomAgr || !precAgr) return;
    setExtras({ ...extras, agregados: [...extras.agregados, { nombre: nomAgr, precio: parseFloat(precAgr) }] });
    setNomAgr(''); setPrecAgr('');
  };

  return (
    <div>
      <button onClick={onVolver} style={s.btnBack}>← Atrás</button>
      <StepHeader step="Extras y envío" title="Completar cotización" />

      {/* ENVASES */}
      <div style={s.card}>
        <div style={s.cardTitle}>🪣 Envases / Baldes — $4.000 c/u</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setExtras({ ...extras, envases: Math.max(0, extras.envases - 1) })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>−</button>
          <span style={{ fontSize: 26, fontWeight: 900, minWidth: 44, textAlign: 'center' }}>{extras.envases}</span>
          <button onClick={() => setExtras({ ...extras, envases: extras.envases + 1 })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>+</button>
          {extras.envases > 0 && <span style={{ color: C.naranja, fontWeight: 800, fontSize: 16 }}>{fmt(extras.envases * 4000)}</span>}
        </div>
      </div>

      {/* AGREGADO EXTRA */}
      <div style={s.card}>
        <div style={s.cardTitle}>➕ Agregado Extra</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={s.label}>Descripción</label>
            <input value={nomAgr} onChange={e => setNomAgr(e.target.value)} style={s.input} placeholder="Ej: Dispenser, packaging especial..." />
          </div>
          <div>
            <label style={s.label}>Importe</label>
            <input type="number" value={precAgr} onChange={e => setPrecAgr(e.target.value)} style={s.input} placeholder="$0" />
          </div>
          <button onClick={agregarExtra} disabled={!nomAgr || !precAgr} style={{ ...s.btnSecondary, opacity: (!nomAgr || !precAgr) ? 0.45 : 1 }}>Agregar</button>
        </div>
        {extras.agregados.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 9, marginBottom: 7 }}>
            <span style={{ fontSize: 13 }}>{a.nombre}</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(a.precio)}</span>
              <button onClick={() => setExtras({ ...extras, agregados: extras.agregados.filter((_, j) => j !== i) })}
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* ENVÍO */}
      <div style={s.card}>
        <div style={s.cardTitle}>🚚 Envío</div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
          <input type="checkbox" checked={extras.esInterior} onChange={e => setExtras({ ...extras, esInterior: e.target.checked })} style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, lineHeight: 1.5 }}>Envío al interior (VIA CARGO / ANDREANI)<br /><span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>El cliente paga al transportista</span></span>
        </label>

        {!extras.esInterior && (
          <>
            {zona ? (
              <div style={{ padding: '11px 14px', background: 'rgba(34,197,94,0.12)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.25)', fontSize: 13, marginBottom: 12 }}>
                📍 <strong>{zona.zona}</strong> — {fmt(zona.precio)}/bulto
              </div>
            ) : (
              <>
                <div style={{ padding: '11px 14px', background: 'rgba(239,68,68,0.12)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, marginBottom: 10 }}>
                  ⚠️ Seleccioná la zona manualmente:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {ZONAS_ENVIO.map(z => (
                    <button key={z.zona} onClick={() => setExtras({ ...extras, envio: z })}
                      style={{ ...s.btnOption, background: extras.envio?.zona === z.zona ? 'rgba(249,115,22,0.2)' : undefined, borderColor: extras.envio?.zona === z.zona ? C.naranja : undefined, borderWidth: extras.envio?.zona === z.zona ? 2 : 1 }}>
                      <span>{z.zona}</span>
                      <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(z.precio)}/bulto</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {zonaEfectiva && (
              <div>
                <label style={s.label}>Cantidad de bultos</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                  <button onClick={() => setExtras({ ...extras, bultos: Math.max(1, extras.bultos - 1) })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>−</button>
                  <span style={{ fontSize: 26, fontWeight: 900, minWidth: 44, textAlign: 'center' }}>{extras.bultos}</span>
                  <button onClick={() => setExtras({ ...extras, bultos: extras.bultos + 1 })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>+</button>
                  <span style={{ color: C.naranja, fontWeight: 800, fontSize: 16 }}>{fmt(zonaEfectiva.precio * extras.bultos)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* RESUMEN TOTAL */}
      <div style={{ ...s.card, background: 'rgba(249,115,22,0.11)', border: '1px solid rgba(249,115,22,0.28)', marginBottom: 20 }}>
        <div style={s.cardTitle}>Resumen del pedido</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Productos</span><span>{fmt(totalProductos)}</span></div>
          {extras.envases > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envases ({extras.envases})</span><span>{fmt(totalEnvases)}</span></div>}
          {extras.agregados.map((a, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>{a.nombre}</span><span>{fmt(a.precio)}</span></div>)}
          {extras.esInterior
            ? <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío interior</span><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>VIA CARGO / ANDREANI</span></div>
            : totalEnvio > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío ({extras.bultos} bulto{extras.bultos !== 1 ? 's' : ''})</span><span>{fmt(totalEnvio)}</span></div>
          }
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 16 }}>TOTAL</span>
            <span style={s.total}>{fmt(totalGeneral)}</span>
          </div>
        </div>
      </div>

      <button onClick={onConfirmar} style={s.btnPrimary}>✓ Confirmar y generar documentos</button>
    </div>
  );
};

// ─── PANEL DE DOCUMENTOS ──────────────────────────────────────────────────────

const DocumentosPanel = ({ pedido, docActivo, setDocActivo, onNuevo, onGuardar }) => {
  const docs = [
    { key: 'whatsapp',   label: '💬 Cotización para WhatsApp', desc: 'Para compartir con el cliente' },
    { key: 'produccion', label: '🏭 Hoja de Producción',       desc: 'Para el sector de fabricación' },
    { key: 'etiqueta',   label: '🏷️ Etiqueta de Envío',       desc: 'Para pegar en el bulto · 10×15cm' },
    { key: 'checklist',  label: '✅ Checklist de Control',     desc: 'Para verificar antes de despachar' },
  ];

  if (docActivo) {
    return (
      <div>
        <BtnBack onClick={() => setDocActivo(null)} label="← Ver todos los documentos" />
        <DocViewer tipo={docActivo} pedido={pedido} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ ...s.card, background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.28)', marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#4ade80', marginBottom: 2 }}>✓ Pedido generado</div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1, marginBottom: 2 }}>{pedido.numero}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{pedido.fecha} · {pedido.cliente.nombre}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.naranja, marginTop: 8 }}>{fmt(pedido.totales.total)}</div>
      </div>

      <div style={s.cardTitle}>Elegí un documento</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {docs.map(d => (
          <button key={d.key} onClick={() => setDocActivo(d.key)} style={s.btnOption}>
            <span>{d.label}<span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 400, marginTop: 2 }}>{d.desc}</span></span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
          </button>
        ))}
      </div>
      <Grid cols={2} gap={10}>
        <button onClick={onGuardar} style={s.btnSecondary}>💾 Guardar borrador</button>
        <button onClick={onNuevo} style={s.btnPrimary}>➕ Nuevo pedido</button>
      </Grid>
    </div>
  );
};

// ─── VISOR DE DOCUMENTOS ──────────────────────────────────────────────────────

const PRINT_STYLE = `
@media print {
  body * { visibility: hidden; }
  #doc-print, #doc-print * { visibility: visible; }
  #doc-print { position: fixed; top: 0; left: 0; width: 100mm; }
  @page { size: 100mm 150mm; margin: 0; }
}
`;

const DocViewer = ({ tipo, pedido }) => {
  const { numero, fecha, cliente, items, extras, totales, zonaEnvio } = pedido;

  const imprimir = () => {
    const style = document.createElement('style');
    style.innerHTML = PRINT_STYLE;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  // ── WHATSAPP ──
  if (tipo === 'whatsapp') {
    const lineas = [
      `🧹 *DOMÉSTICO · Química de Limpieza*`,
      `📋 *Pedido: ${numero}*`,
      `📅 ${fecha}`,
      ``,
      `👤 *Cliente:* ${cliente.nombre}`,
      `📱 ${cliente.telefono}`,
      `📍 ${cliente.direccion}, ${cliente.localidad}`,
      cliente.observaciones ? `📝 *Obs:* ${cliente.observaciones}` : null,
      ``,
      `━━━━━━━━━━━━━━━━`,
      `🛒 *PRODUCTOS*`,
      `━━━━━━━━━━━━━━━━`,
      ...items.map(item => {
        const lines = [`• ${item.nombre}${item.cantidad > 1 ? ` ×${item.cantidad}` : ''} — *${fmt(item.precio * item.cantidad)}*`];
        if (item.descripcion) lines.push(`  ↳ ${item.descripcion}`);
        return lines.join('\n');
      }),
      ``,
      extras.envases > 0 ? `• Envases (${extras.envases} ud.) — *${fmt(totales.envases)}*` : null,
      ...extras.agregados.map(a => `• ${a.nombre} — *${fmt(a.precio)}*`),
      ``,
      `━━━━━━━━━━━━━━━━`,
      `🚚 *ENVÍO*`,
      `━━━━━━━━━━━━━━━━`,
      extras.esInterior
        ? `📦 Envío al interior por VIA CARGO / ANDREANI\n_(el costo lo abona el cliente al transportista)_`
        : zonaEnvio
          ? `📍 ${zonaEnvio.zona} — ${extras.bultos} bulto${extras.bultos !== 1 ? 's' : ''} — *${fmt(totales.envio)}*`
          : null,
      ``,
      `━━━━━━━━━━━━━━━━`,
      `💰 *TOTAL A ABONAR: ${fmt(totales.total)}*`,
      `━━━━━━━━━━━━━━━━`,
      ``,
      `_Precios con 15% OFF · Doméstico Química de Limpieza_`,
      `_Moreno, Pcia. de Buenos Aires_`,
    ].filter(l => l !== null).join('\n');

    const copiar = () => {
      navigator.clipboard.writeText(lineas).then(() => alert('✓ Copiado al portapapeles. Pegalo en WhatsApp.'));
    };

    return (
      <div>
        <div style={{ ...s.card, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80', marginBottom: 10 }}>💬 Cotización para WhatsApp</div>
          <pre style={{ fontFamily: '"Segoe UI", sans-serif', fontSize: 13, whiteSpace: 'pre-wrap', color: '#fff', lineHeight: 1.6, margin: 0 }}>{lineas}</pre>
        </div>
        <button onClick={copiar} style={{ ...s.btnPrimary, background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>
          📋 Copiar para pegar en WhatsApp
        </button>
      </div>
    );
  }

  // ── PRODUCCIÓN ──
  if (tipo === 'produccion') {
    const contenido = (
      <div style={{ background: '#fff', color: '#1e293b', fontFamily: 'Arial, sans-serif', fontSize: 12, padding: 14, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ borderBottom: '3px solid #0d5c3a', paddingBottom: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#0d5c3a' }}>🏭 ORDEN DE PRODUCCIÓN</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Pedido: <strong>{numero}</strong> · {fecha}</div>
          <div style={{ fontSize: 11 }}>Cliente: <strong>{cliente.nombre}</strong> · {cliente.localidad}</div>
        </div>
        {items.map((item, i) => {
          const colorInfo = item.detalle?.color && item.detalle.color !== 'fija'
            ? [...COLORES_JABON, ...COLORES_SUAVIZANTE, ...COLORES_DETERGENTE].find(c => c.label === item.detalle.color)
            : null;
          const fragInfo = item.detalle?.tipo === 'desodorante' ? FRAGANCIAS.find(f => f.label === item.detalle.color) : null;
          return (
            <div key={i} style={{ padding: '8px 10px', borderLeft: '4px solid #0d5c3a', background: i % 2 === 0 ? '#f8fafc' : '#fff', marginBottom: 6, borderRadius: 4 }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{item.cantidad > 1 ? `[×${item.cantidad}] ` : ''}{item.nombre}</div>
              {item.descripcion && <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{item.descripcion}</div>}
              {colorInfo && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4, background: colorInfo.hex, color: colorInfo.textColor, borderRadius: 12, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>
                  ● Color: {colorInfo.label}
                </div>
              )}
              {fragInfo && <div style={{ fontSize: 10, marginTop: 3 }}>{fragInfo.icon} Fragancia: <strong>{fragInfo.label}</strong></div>}
              {item.detalle?.calidad && <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>Línea: <strong>{item.detalle.calidad}</strong> · {item.detalle.cantidad}lts</div>}
            </div>
          );
        })}
        {extras.envases > 0 && (
          <div style={{ padding: '8px 10px', borderLeft: '4px solid #f97316', background: '#fff7ed', marginBottom: 6, borderRadius: 4 }}>
            <div style={{ fontWeight: 800 }}>🪣 Envases vacíos: {extras.envases} unidad{extras.envases !== 1 ? 'es' : ''}</div>
          </div>
        )}
        {cliente.observaciones && (
          <div style={{ marginTop: 10, padding: '8px 10px', background: '#fef3c7', borderRadius: 6, fontSize: 11 }}>
            ⚠️ <strong>Obs:</strong> {cliente.observaciones}
          </div>
        )}
        <div style={{ marginTop: 10, padding: '6px 10px', background: '#fee2e2', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
          ✋ VERIFICAR colores, fragancias y cantidades antes de embolsar.
        </div>
      </div>
    );
    return (
      <div>
        <div id="doc-print">{contenido}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={imprimir} style={{ ...s.btnVerde, flex: 1 }}>🖨️ Imprimir</button>
        </div>
      </div>
    );
  }

  // ── ETIQUETA 10×15 ──
  if (tipo === 'etiqueta') {
    const contenido = (
      <div id="doc-print" style={{ width: '100mm', minHeight: '150mm', background: '#fff', color: '#1e293b', fontFamily: 'Arial, sans-serif', padding: '8mm', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Header */}
        <div style={{ borderBottom: '4px solid #0d5c3a', paddingBottom: '4mm', marginBottom: '4mm', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#0d5c3a', letterSpacing: '-0.5px' }}>🧹 DOMÉSTICO</div>
          <div style={{ fontSize: 9, color: '#64748b' }}>Química de Limpieza · Moreno, Bs. As.</div>
        </div>
        {/* Destinatario */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Destinatario</div>
          <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1, marginBottom: 4 }}>{cliente.nombre}</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{cliente.direccion}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{cliente.localidad} {cliente.cp && `(CP: ${cliente.cp})`}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>📱 {cliente.telefono}</div>
          {cliente.email && <div style={{ fontSize: 10, color: '#64748b' }}>✉️ {cliente.email}</div>}
          {cliente.observaciones && (
            <div style={{ marginTop: 6, padding: '4px 8px', background: '#fef3c7', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
              ⚠️ {cliente.observaciones}
            </div>
          )}
        </div>
        {/* Interior notice */}
        {extras.esInterior && (
          <div style={{ margin: '6px 0', padding: '6px 8px', background: '#fbbf24', borderRadius: 6, textAlign: 'center', fontWeight: 900, fontSize: 12 }}>
            📦 VIA CARGO / ANDREANI — ENVÍO INTERIOR
          </div>
        )}
        {/* Footer */}
        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '3mm', marginTop: '3mm', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 9 }}>
            <div style={{ fontWeight: 700 }}>Pedido: {numero}</div>
            <div style={{ color: '#64748b' }}>{fecha.split(',')[0]}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 9 }}>
            <div style={{ fontWeight: 700 }}>{extras.bultos} bulto{extras.bultos !== 1 ? 's' : ''}</div>
            <div style={{ color: '#64748b' }}>Mantenerse vertical</div>
          </div>
        </div>
      </div>
    );
    return (
      <div>
        <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          {contenido}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12, textAlign: 'center' }}>
          Tamaño: 10×15cm · Impresión térmica
        </div>
        <button onClick={imprimir} style={s.btnVerde}>🖨️ Imprimir etiqueta (10×15cm)</button>
      </div>
    );
  }

  // ── CHECKLIST ──
  if (tipo === 'checklist') {
    const contenido = (
      <div style={{ background: '#fff', color: '#1e293b', fontFamily: 'Arial, sans-serif', fontSize: 12, padding: 14, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ borderBottom: '3px solid #0d5c3a', paddingBottom: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#0d5c3a' }}>✅ CHECKLIST DE CONTROL</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{numero} · {fecha}</div>
          <div style={{ fontSize: 11 }}>{cliente.nombre} · {cliente.localidad}</div>
        </div>

        <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, color: '#0d5c3a' }}>Items a verificar</div>
        {items.map((item, i) => {
          const rows = [];
          for (let q = 0; q < item.cantidad; q++) {
            const colorInfo = item.detalle?.color && item.detalle.color !== 'fija'
              ? [...COLORES_JABON, ...COLORES_SUAVIZANTE, ...COLORES_DETERGENTE].find(c => c.label === item.detalle.color)
              : null;
            const fragInfo = item.detalle?.tipo === 'desodorante' ? FRAGANCIAS.find(f => f.label === item.detalle.color) : null;
            rows.push(
              <div key={`${i}-${q}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 18, height: 18, border: '2px solid #0d5c3a', borderRadius: 3, flexShrink: 0, marginTop: 1 }}></div>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.nombre} {item.cantidad > 1 ? `(${q+1}/${item.cantidad})` : ''}</div>
                  {item.descripcion && <div style={{ fontSize: 10, color: '#64748b' }}>{item.descripcion}</div>}
                  {colorInfo && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: colorInfo.hex, color: colorInfo.textColor, borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700, marginTop: 2 }}>
                      ● {colorInfo.label}
                    </span>
                  )}
                  {fragInfo && <span style={{ fontSize: 10, marginTop: 2, display: 'block' }}>{fragInfo.icon} {fragInfo.label}</span>}
                </div>
              </div>
            );
          }
          return rows;
        })}

        {extras.envases > 0 && (
          <>
            <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 10, marginBottom: 6, color: '#f97316' }}>Envases</div>
            {Array.from({ length: extras.envases }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 18, height: 18, border: '2px solid #f97316', borderRadius: 3, flexShrink: 0 }}></div>
                <span style={{ fontWeight: 600 }}>🪣 Envase / Balde vacío ({i+1}/{extras.envases})</span>
              </div>
            ))}
          </>
        )}

        <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 10, marginBottom: 6, color: '#0d5c3a' }}>Embalaje y despacho</div>
        {[
          `Bultos embalados: ${extras.bultos}`,
          'Etiqueta de envío pegada',
          extras.esInterior ? 'Entregado en VIA CARGO / ANDREANI' : `Cobro de envío confirmado: ${fmt(totales.envio)}`,
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 18, height: 18, border: '2px solid #0d5c3a', borderRadius: 3, flexShrink: 0 }}></div>
            <span>{t}</span>
          </div>
        ))}

        {cliente.observaciones && (
          <div style={{ marginTop: 10, padding: '7px 10px', background: '#fef3c7', borderRadius: 6, fontSize: 11 }}>
            ⚠️ <strong>Obs:</strong> {cliente.observaciones}
          </div>
        )}

        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 10, color: '#94a3b8' }}>
          {numero} · Doméstico Química de Limpieza
        </div>
      </div>
    );
    return (
      <div>
        <div id="doc-print">{contenido}</div>
        <button onClick={imprimir} style={{ ...s.btnVerde, marginTop: 14 }}>🖨️ Imprimir</button>
      </div>
    );
  }

  return null;
};

export default PedidosApp;
