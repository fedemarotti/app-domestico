import React, { useState } from 'react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const PRECIOS = {
  jabon:      { 50: { Fresh: 23001, Ultra: 25366, Premium: 27731 }, 200: { Fresh: 87268, Ultra: 96728, Premium: 106188 } },
  suavizante: { 50: { Fresh: 24772, Ultra: 25954, Premium: 27731 }, 200: { Fresh: 94363, Ultra: 99330, Premium: 106425 } },
  detergente: { 50: { Fresh: 24662, Ultra: 27755, Premium: 31464 }, 200: { Fresh: 93955, Ultra: 106070, Premium: 120905 } },
  lavandina:  { 50: 4250, 200: 13975 },
  desodorante:{ 50: 4250, 200: 13975 },
};

const PRECIOS_COMBOS = {
  50:  { Fresh: 77924,  Ultra: 83842,  Premium: 90937  },
  200: { Fresh: 283679, Ultra: 312180, Premium: 353568 },
};

const COLORES_JABON      = ['Azul', 'Verde', 'Violeta'];
const COLORES_SUAVIZANTE = ['Blanco', 'Celeste', 'Violeta'];
const COLORES_DETERGENTE = ['Amarillo', 'Verde (a pedido)', 'Azul (a pedido)'];
const FRAGANCIAS         = ['Cherry', 'Lavanda', 'Marina', 'Pino', 'Arpegio', 'Fresh', 'Summer', 'Chile', 'Sandía', 'Naranja'];

const PRECIO_ENVASE = 4000;

const ZONAS_ENVIO = [
  { zona: 'Nuestra localidad', localidades: ['MORENO'], precio: 4500 },
  { zona: 'Cordón 1', localidades: ['JOSE C PAZ', 'SAN MIGUEL', 'ITUZAINGO', 'MERLO'], precio: 5500 },
  { zona: 'Cordón 2', localidades: ['LA MATANZA', 'MORON', 'HURLINGHAM', '3 DE FEBRERO', 'SAN MARTIN', 'VICENTE LOPEZ', 'SAN FERNANDO', 'TIGRE', 'MAV ARG', 'AVELLANEDA', 'LANUS', 'BERAZATEGUI', 'FLORENCIO VARELA', 'ALMIRANTE BROWN', 'QUILMES', 'EZEIZA', 'CABA', 'CAPITAL FEDERAL'], precio: 6500 },
  { zona: 'Cordón 3', localidades: ['ESCOBAR', 'INGENIERO MASCHWITZ', 'DEL VISO', 'PILAR', 'ZARATE', 'CAMPANA', 'LUJAN', 'GENERAL RODRIGUEZ', 'MARCOS PAZ', 'CAÑUELAS', 'GUERNICA', 'SAN VICENTE', 'VILLA ELISA', 'BERISSO', 'LA PLATA', 'ENSENADA', 'DERQUI', 'VILLA ROSA', 'NORDELTA'], precio: 9500 },
];

function detectarZona(localidad) {
  const norm = localidad.toUpperCase().trim();
  for (const z of ZONAS_ENVIO) {
    if (z.localidades.some(l => norm.includes(l) || l.includes(norm))) return z;
  }
  return null;
}

// ─── ESTILOS BASE ────────────────────────────────────────────────────────────

const C = {
  verde:     '#0d5c3a',
  verdeOsc:  '#083d27',
  verdeMed:  '#1a7a52',
  naranja:   '#f97316',
  naranjaOsc:'#c2520a',
  blanco:    '#ffffff',
  gris1:     '#f8fafc',
  gris2:     '#e2e8f0',
  gris3:     '#94a3b8',
  texto:     '#1e293b',
  textoClaro:'#64748b',
  rojo:      '#ef4444',
  verde2:    '#22c55e',
};

const s = {
  app: {
    minHeight: '100vh',
    background: `linear-gradient(160deg, ${C.verdeOsc} 0%, ${C.verde} 60%, ${C.verdeMed} 100%)`,
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    color: C.blanco,
    padding: '0 0 40px 0',
  },
  header: {
    background: 'rgba(0,0,0,0.25)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    padding: '16px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 640,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: C.blanco },
  badge: {
    background: C.naranja,
    color: C.blanco,
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 20,
    letterSpacing: '0.5px',
  },
  container: { maxWidth: 640, margin: '0 auto', padding: '20px 16px' },
  card: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 },
  btnPrimary: {
    width: '100%', padding: '15px 20px',
    background: `linear-gradient(135deg, ${C.naranja}, ${C.naranjaOsc})`,
    color: C.blanco, border: 'none', borderRadius: 12,
    fontWeight: 700, fontSize: 15, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
    transition: 'transform 0.1s',
    letterSpacing: '-0.2px',
  },
  btnSecondary: {
    width: '100%', padding: '14px 20px',
    background: 'rgba(255,255,255,0.1)',
    color: C.blanco, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12,
    fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
  btnVerde: {
    width: '100%', padding: '14px 20px',
    background: `linear-gradient(135deg, #16a34a, #15803d)`,
    color: C.blanco, border: 'none', borderRadius: 12,
    fontWeight: 700, fontSize: 15, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
  },
  btnBack: {
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
    fontWeight: 600, fontSize: 12, cursor: 'pointer', marginBottom: 18,
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },
  btnOption: {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,0.07)',
    color: C.blanco, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
    fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  stepLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 },
  stepTitle: { fontSize: 20, fontWeight: 800, color: C.blanco, marginBottom: 20, letterSpacing: '-0.3px' },
  input: {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.08)',
    color: C.blanco, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
    fontSize: 14, boxSizing: 'border-box',
    outline: 'none',
  },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 5 },
  total: { fontSize: 28, fontWeight: 800, color: C.naranja, letterSpacing: '-0.5px' },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)',
    color: C.naranja, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const uid = () => Math.random().toString(36).substr(2, 9);

// ─── COMPONENTES PEQUEÑOS ────────────────────────────────────────────────────

const BtnBack = ({ onClick, label = '← Atrás' }) => (
  <button onClick={onClick} style={s.btnBack}>{label}</button>
);

const StepHeader = ({ step, title }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={s.stepLabel}>{step}</div>
    <div style={s.stepTitle}>{title}</div>
  </div>
);

const Grid = ({ cols = 1, gap = 10, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>{children}</div>
);

const OpcionBtn = ({ onClick, label, sub, icon }) => (
  <button onClick={onClick} style={s.btnOption}>
    <span>{icon && <span style={{ marginRight: 8 }}>{icon}</span>}{label}{sub && <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 400, marginTop: 2 }}>{sub}</span>}</span>
    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
  </button>
);

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

const PedidosApp = () => {
  const [paso, setPaso]           = useState('inicio');
  const [carrito, setCarrito]     = useState([]);
  const [extras, setExtras]       = useState({ envases: 0, agregados: [], envio: null, bultos: 1, esInterior: false });
  const [datosCliente, setDatosCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '', localidad: '', cp: '' });
  const [pedidoFinal, setPedidoFinal]   = useState(null);
  const [docActivo, setDocActivo]       = useState(null);
  const [borradores, setBorradores]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('dom_borradores')) || []; } catch { return []; }
  });

  const [prodInd, setProdInd] = useState({ tipo: null, cantidad: null, calidad: null, color: null });
  const [combo, setCombo]     = useState({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [] });

  // Totales
  const totalProductos = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalEnvases   = extras.envases * PRECIO_ENVASE;
  const totalAgregados = extras.agregados.reduce((s, a) => s + (parseFloat(a.precio) || 0), 0);
  const totalEnvio     = extras.esInterior ? 0 : (extras.envio ? extras.envio.precio * extras.bultos : 0);
  const totalGeneral   = totalProductos + totalEnvases + totalAgregados + totalEnvio;

  // Acciones carrito
  const eliminarItem = (id) => setCarrito(carrito.filter(i => i.id !== id));
  const cambiarCantidad = (id, delta) => setCarrito(carrito.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i));

  const agregarIndividual = () => {
    const { tipo, cantidad, calidad, color } = prodInd;
    let nombre = '', precio = 0;
    if (tipo === 'lavandina')      { nombre = `Lavandina ${cantidad}lts`; precio = PRECIOS.lavandina[cantidad]; }
    else if (tipo === 'desodorante') { nombre = `Desodorante Piso ${cantidad}lts · ${color}`; precio = PRECIOS.desodorante[cantidad]; }
    else { nombre = `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts · ${color}`; precio = PRECIOS[tipo][cantidad][calidad]; }
    setCarrito([...carrito, { id: uid(), tipo: 'individual', nombre, detalle: { tipo, cantidad, calidad, color }, precio, cantidad: 1 }]);
    setProdInd({ tipo: null, cantidad: null, calidad: null, color: null });
    setPaso('carrito');
  };

  const agregarCombo = () => {
    const { tamaño, calidad, jabon_color, suavizante_color, detergente_color, fragancias_piso } = combo;
    const precio = PRECIOS_COMBOS[tamaño][calidad];
    const descFragancias = fragancias_piso.map(f => `${f.fragancia} ${f.cantidad}lts`).join(' + ');
    const nombre = `Combo Full ${tamaño === 50 ? 'Chico' : 'Grande'} ${calidad}`;
    const descripcion = `Jabón ${jabon_color} · Suavizante ${suavizante_color} · Detergente ${detergente_color} · Desodorante (${descFragancias}) · Lavandina`;
    setCarrito([...carrito, { id: uid(), tipo: 'combo', nombre, descripcion, detalle: combo, precio, cantidad: 1 }]);
    setCombo({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [] });
    setPaso('carrito');
  };

  const generarPedido = () => ({
    numero: `DOM-${Date.now().toString().slice(-8)}`,
    fecha: new Date().toLocaleString('es-AR'),
    vendedor: '',
    cliente: datosCliente,
    items: carrito,
    extras,
    totales: { productos: totalProductos, envases: totalEnvases, agregados: totalAgregados, envio: totalEnvio, total: totalGeneral },
    estado: 'pendiente',
  });

  const confirmarPedido = () => {
    const p = generarPedido();
    setPedidoFinal(p);
    setPaso('documentos');
  };

  const resetear = () => {
    setCarrito([]); setExtras({ envases: 0, agregados: [], envio: null, bultos: 1, esInterior: false });
    setDatosCliente({ nombre: '', telefono: '', email: '', direccion: '', localidad: '', cp: '' });
    setPedidoFinal(null); setDocActivo(null); setPaso('inicio');
  };

  const guardarBorrador = () => {
    const p = generarPedido();
    const nuevos = [...borradores, p];
    setBorradores(nuevos);
    localStorage.setItem('dom_borradores', JSON.stringify(nuevos));
    alert('✓ Guardado como borrador');
  };

  // Detectar zona cuando cambia localidad
  const zona = detectarZona(datosCliente.localidad);

  return (
    <div style={s.app}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>🧹 Doméstico</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {carrito.length > 0 && (
              <button onClick={() => setPaso('carrito')} style={{ ...s.chip, cursor: 'pointer', border: 'none' }}>
                🛒 {carrito.length}
              </button>
            )}
            <div style={s.badge}>15% OFF</div>
          </div>
        </div>
      </div>

      <div style={s.container}>

        {/* ── INICIO ── */}
        {paso === 'inicio' && (
          <div>
            <div style={{ marginBottom: 28, paddingTop: 8 }}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Sistema de Pedidos</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Cargá productos y generá el pedido completo</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => { setPaso('prod_tipo'); setProdInd({ tipo: null, cantidad: null, calidad: null, color: null }); }} style={s.btnPrimary}>
                ➕ Producto Individual
              </button>
              <button onClick={() => { setPaso('combo_1'); setCombo({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [] }); }} style={s.btnVerde}>
                📦 Combo Pre-armado
              </button>
              {carrito.length > 0 && (
                <button onClick={() => setPaso('carrito')} style={s.btnSecondary}>
                  🛒 Ver Carrito — {fmt(totalProductos)}
                </button>
              )}
              {borradores.length > 0 && (
                <button onClick={() => setPaso('borradores')} style={{ ...s.btnSecondary, fontSize: 13 }}>
                  📋 Borradores ({borradores.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTO INDIVIDUAL: TIPO ── */}
        {paso === 'prod_tipo' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Paso 1 de 4" title="¿Qué producto?" />
            <Grid gap={10}>
              {[
                { key: 'jabon',       label: 'Jabón',           icon: '🫧' },
                { key: 'suavizante',  label: 'Suavizante',      icon: '🌸' },
                { key: 'detergente',  label: 'Detergente',      icon: '🟡' },
                { key: 'lavandina',   label: 'Lavandina',       icon: '🧴' },
                { key: 'desodorante', label: 'Desodorante Piso', icon: '✨' },
              ].map(p => (
                <OpcionBtn key={p.key} onClick={() => { setProdInd({ ...prodInd, tipo: p.key }); setPaso('prod_cantidad'); }} label={p.label} icon={p.icon} />
              ))}
            </Grid>
          </div>
        )}

        {/* ── PRODUCTO: CANTIDAD ── */}
        {paso === 'prod_cantidad' && (
          <div>
            <BtnBack onClick={() => setPaso('prod_tipo')} />
            <StepHeader step="Paso 2 de 4" title="¿Cuántos litros?" />
            <Grid cols={2} gap={12}>
              {[50, 200].map(lts => (
                <button key={lts} onClick={() => { setProdInd({ ...prodInd, cantidad: lts }); setPaso(['jabon','suavizante','detergente'].includes(prodInd.tipo) ? 'prod_calidad' : 'prod_color'); }} style={{ ...s.btnOption, flexDirection: 'column', textAlign: 'center', padding: 20, justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 800 }}>{lts}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>litros</span>
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* ── PRODUCTO: CALIDAD ── */}
        {paso === 'prod_calidad' && (
          <div>
            <BtnBack onClick={() => setPaso('prod_cantidad')} />
            <StepHeader step="Paso 3 de 4" title="Línea de calidad" />
            <Grid gap={10}>
              {[
                { key: 'Fresh',   desc: 'Línea económica', icon: '🟢' },
                { key: 'Ultra',   desc: 'Línea estándar',  icon: '🔵' },
                { key: 'Premium', desc: 'Línea superior',  icon: '🟣' },
              ].map(c => {
                const precio = PRECIOS[prodInd.tipo]?.[prodInd.cantidad]?.[c.key];
                return (
                  <button key={c.key} onClick={() => { setProdInd({ ...prodInd, calidad: c.key }); setPaso('prod_color'); }} style={{ ...s.btnOption }}>
                    <span>{c.icon} {c.key}<span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{c.desc}</span></span>
                    <span style={{ color: C.naranja, fontWeight: 700, fontSize: 15 }}>{precio ? fmt(precio) : ''}</span>
                  </button>
                );
              })}
            </Grid>
          </div>
        )}

        {/* ── PRODUCTO: COLOR / FRAGANCIA / CONFIRMAR ── */}
        {paso === 'prod_color' && (
          <div>
            <BtnBack onClick={() => { setPaso(['jabon','suavizante','detergente'].includes(prodInd.tipo) ? 'prod_calidad' : 'prod_cantidad'); }} />
            <StepHeader step="Paso 4 de 4" title={prodInd.tipo === 'desodorante' ? 'Fragancia' : prodInd.tipo === 'lavandina' ? 'Confirmar' : 'Color'} />
            {prodInd.tipo === 'lavandina' && (
              <div>
                <div style={{ ...s.card, marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Lavandina {prodInd.cantidad}lts</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.naranja, marginTop: 8 }}>{fmt(PRECIOS.lavandina[prodInd.cantidad])}</div>
                </div>
                <button onClick={() => { setProdInd({ ...prodInd, color: 'fija' }); agregarIndividual(); }} style={s.btnPrimary}>✓ Agregar al carrito</button>
              </div>
            )}
            {prodInd.tipo === 'desodorante' && (
              <Grid cols={2} gap={10}>
                {FRAGANCIAS.map(f => (
                  <button key={f} onClick={() => { setProdInd({ ...prodInd, color: f }); }} style={{ ...s.btnOption, background: prodInd.color === f ? 'rgba(249,115,22,0.25)' : undefined, borderColor: prodInd.color === f ? C.naranja : undefined }}>
                    <span>{f}</span>
                  </button>
                ))}
              </Grid>
            )}
            {prodInd.tipo === 'desodorante' && prodInd.color && (
              <button onClick={agregarIndividual} style={{ ...s.btnPrimary, marginTop: 16 }}>✓ Agregar al carrito</button>
            )}
            {prodInd.tipo === 'jabon' && (
              <Grid cols={3} gap={10}>
                {COLORES_JABON.map(c => (
                  <button key={c} onClick={() => { setProdInd({ ...prodInd, color: c }); }} style={{ ...s.btnOption, justifyContent: 'center', background: prodInd.color === c ? 'rgba(249,115,22,0.25)' : undefined, borderColor: prodInd.color === c ? C.naranja : undefined }}>{c}</button>
                ))}
              </Grid>
            )}
            {prodInd.tipo === 'suavizante' && (
              <Grid cols={3} gap={10}>
                {COLORES_SUAVIZANTE.map(c => (
                  <button key={c} onClick={() => { setProdInd({ ...prodInd, color: c }); }} style={{ ...s.btnOption, justifyContent: 'center', background: prodInd.color === c ? 'rgba(249,115,22,0.25)' : undefined, borderColor: prodInd.color === c ? C.naranja : undefined }}>{c}</button>
                ))}
              </Grid>
            )}
            {prodInd.tipo === 'detergente' && (
              <Grid gap={10}>
                {COLORES_DETERGENTE.map(c => (
                  <button key={c} onClick={() => { setProdInd({ ...prodInd, color: c }); }} style={{ ...s.btnOption, background: prodInd.color === c ? 'rgba(249,115,22,0.25)' : undefined, borderColor: prodInd.color === c ? C.naranja : undefined }}>{c}</button>
                ))}
              </Grid>
            )}
            {['jabon','suavizante','detergente'].includes(prodInd.tipo) && prodInd.color && (
              <button onClick={agregarIndividual} style={{ ...s.btnPrimary, marginTop: 16 }}>✓ Agregar al carrito</button>
            )}
          </div>
        )}

        {/* ── COMBO 1: TAMAÑO ── */}
        {paso === 'combo_1' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Combo · Paso 1 de 6" title="Tamaño del combo" />
            <Grid cols={2} gap={12}>
              {[
                { lts: 50,  label: 'Chico', desc: '50 litros total' },
                { lts: 200, label: 'Grande', desc: '200 litros total' },
              ].map(t => (
                <button key={t.lts} onClick={() => { setCombo({ ...combo, tamaño: t.lts }); setPaso('combo_2'); }} style={{ ...s.btnOption, flexDirection: 'column', textAlign: 'center', padding: 20, justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 800 }}>{t.label}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{t.desc}</span>
                </button>
              ))}
            </Grid>
          </div>
        )}

        {/* ── COMBO 2: CALIDAD ── */}
        {paso === 'combo_2' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, tamaño: null }); setPaso('combo_1'); }} />
            <StepHeader step="Combo · Paso 2 de 6" title="Línea de calidad" />
            <Grid gap={10}>
              {['Fresh','Ultra','Premium'].map(cal => {
                const p = PRECIOS_COMBOS[combo.tamaño]?.[cal];
                return (
                  <button key={cal} onClick={() => { setCombo({ ...combo, calidad: cal }); setPaso('combo_3a'); }} style={s.btnOption}>
                    <span>{cal}</span>
                    <span style={{ color: C.naranja, fontWeight: 700 }}>{p ? fmt(p) : ''}</span>
                  </button>
                );
              })}
            </Grid>
          </div>
        )}

        {/* ── COMBO 3A: COLOR JABÓN ── */}
        {paso === 'combo_3a' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, calidad: null }); setPaso('combo_2'); }} />
            <StepHeader step="Combo · Paso 3 de 6" title="Color del Jabón" />
            <Grid cols={3} gap={10}>
              {COLORES_JABON.map(c => (
                <button key={c} onClick={() => { setCombo({ ...combo, jabon_color: c }); setPaso('combo_3b'); }} style={{ ...s.btnOption, justifyContent: 'center' }}>{c}</button>
              ))}
            </Grid>
          </div>
        )}

        {/* ── COMBO 3B: COLOR SUAVIZANTE ── */}
        {paso === 'combo_3b' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, jabon_color: null }); setPaso('combo_3a'); }} />
            <StepHeader step="Combo · Paso 4 de 6" title="Color del Suavizante" />
            <Grid cols={3} gap={10}>
              {COLORES_SUAVIZANTE.map(c => (
                <button key={c} onClick={() => { setCombo({ ...combo, suavizante_color: c }); setPaso('combo_3c'); }} style={{ ...s.btnOption, justifyContent: 'center' }}>{c}</button>
              ))}
            </Grid>
          </div>
        )}

        {/* ── COMBO 3C: COLOR DETERGENTE ── */}
        {paso === 'combo_3c' && (
          <div>
            <BtnBack onClick={() => { setCombo({ ...combo, suavizante_color: null }); setPaso('combo_3b'); }} />
            <StepHeader step="Combo · Paso 5 de 6" title="Color del Detergente" />
            <Grid gap={10}>
              {COLORES_DETERGENTE.map(c => (
                <button key={c} onClick={() => { setCombo({ ...combo, detergente_color: c }); setPaso('combo_4'); }} style={s.btnOption}>{c}</button>
              ))}
            </Grid>
          </div>
        )}

        {/* ── COMBO 4: FRAGANCIAS ── */}
        {paso === 'combo_4' && (
          <ComboFragancias combo={combo} setCombo={setCombo} onConfirm={agregarCombo} onCancel={() => { setCombo({ ...combo, detergente_color: null }); setPaso('combo_3c'); }} />
        )}

        {/* ── CARRITO ── */}
        {paso === 'carrito' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Carrito" title={`${carrito.length} producto${carrito.length !== 1 ? 's' : ''}`} />
            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>El carrito está vacío</div>
                <button onClick={() => setPaso('inicio')} style={{ ...s.btnPrimary, marginTop: 20 }}>Agregar productos</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {carrito.map(item => (
                    <div key={item.id} style={{ ...s.card, padding: '14px 16px', marginBottom: 0, borderLeft: `3px solid ${C.naranja}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: 12 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.nombre}</div>
                          {item.descripcion && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>{item.descripcion}</div>}
                          <div style={{ fontSize: 13, color: C.naranja, fontWeight: 700, marginTop: 6 }}>{fmt(item.precio * item.cantidad)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => cambiarCantidad(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.cantidad}</span>
                          <button onClick={() => cambiarCantidad(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          <button onClick={() => eliminarItem(item.id)} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: 14 }}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ ...s.card, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', textAlign: 'right', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Subtotal productos</div>
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

        {/* ── DATOS CLIENTE ── */}
        {paso === 'cliente' && (
          <div>
            <BtnBack onClick={() => setPaso('carrito')} />
            <StepHeader step="Datos del cliente" title="¿A quién le vendés?" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[
                { key: 'nombre',    label: 'Nombre completo *', type: 'text' },
                { key: 'telefono',  label: 'Teléfono / WhatsApp *', type: 'tel' },
                { key: 'email',     label: 'Email', type: 'email' },
                { key: 'direccion', label: 'Dirección de entrega *', type: 'text' },
                { key: 'localidad', label: 'Localidad *', type: 'text' },
                { key: 'cp',        label: 'Código Postal', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={s.label}>{f.label}</label>
                  <input type={f.type} value={datosCliente[f.key]}
                    onChange={e => setDatosCliente({ ...datosCliente, [f.key]: e.target.value })}
                    style={s.input} placeholder={f.label.replace(' *', '')} />
                </div>
              ))}
              {datosCliente.localidad && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: zona ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${zona ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: 13 }}>
                  {zona ? `📍 ${zona.zona} — envío base: ${fmt(zona.precio)}/bulto` : '⚠️ Localidad no encontrada en tabla de envíos'}
                </div>
              )}
            </div>
            <button
              onClick={() => setPaso('extras')}
              disabled={!datosCliente.nombre || !datosCliente.telefono || !datosCliente.direccion || !datosCliente.localidad}
              style={{ ...s.btnPrimary, opacity: (!datosCliente.nombre || !datosCliente.telefono || !datosCliente.direccion || !datosCliente.localidad) ? 0.5 : 1, cursor: (!datosCliente.nombre || !datosCliente.telefono || !datosCliente.direccion || !datosCliente.localidad) ? 'not-allowed' : 'pointer' }}
            >
              Continuar → Extras y envío
            </button>
          </div>
        )}

        {/* ── EXTRAS Y ENVÍO ── */}
        {paso === 'extras' && (
          <ExtrasEnvio
            extras={extras} setExtras={setExtras}
            zona={zona} totalProductos={totalProductos}
            totalEnvases={totalEnvases} totalAgregados={totalAgregados} totalEnvio={totalEnvio} totalGeneral={totalGeneral}
            onConfirmar={confirmarPedido} onVolver={() => setPaso('cliente')}
          />
        )}

        {/* ── DOCUMENTOS ── */}
        {paso === 'documentos' && pedidoFinal && (
          <DocumentosPanel
            pedido={pedidoFinal} docActivo={docActivo} setDocActivo={setDocActivo}
            onNuevo={resetear} onGuardar={guardarBorrador}
          />
        )}

        {/* ── BORRADORES ── */}
        {paso === 'borradores' && (
          <div>
            <BtnBack onClick={() => setPaso('inicio')} />
            <StepHeader step="Historial" title={`${borradores.length} borradores`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {borradores.map((p, idx) => (
                <div key={idx} style={{ ...s.card, borderLeft: `3px solid ${C.naranja}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.numero}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{p.cliente?.nombre} · {p.fecha}</div>
                      <div style={{ color: C.naranja, fontWeight: 700, marginTop: 4 }}>{fmt(p.totales?.total || 0)}</div>
                    </div>
                    <button onClick={() => { const n = borradores.filter((_,i) => i !== idx); setBorradores(n); localStorage.setItem('dom_borradores', JSON.stringify(n)); }}
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
  const [fragSel, setFragSel]   = useState('');
  const [cantSel, setCantSel]   = useState('');
  const esChico     = combo.tamaño === 50;
  const maxLitros   = combo.tamaño;
  const litrosUsados = combo.fragancias_piso.reduce((s, f) => s + f.cantidad, 0);
  const litrosRest  = maxLitros - litrosUsados;
  const maxFrag     = esChico ? 1 : 4;

  const agregar = () => {
    if (!fragSel || !cantSel) return;
    setCombo({ ...combo, fragancias_piso: [...combo.fragancias_piso, { fragancia: fragSel, cantidad: parseInt(cantSel) }] });
    setFragSel(''); setCantSel('');
  };

  const opciones = esChico ? [50] : [50, 100, 200].filter(v => v <= litrosRest);

  return (
    <div>
      <BtnBack onClick={onCancel} />
      <StepHeader step="Combo · Paso 6 de 6" title="Desodorante de piso" />
      <div style={{ ...s.card, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Litros restantes: <strong>{litrosRest}lts</strong></span>
          <span>Fragancias: <strong>{combo.fragancias_piso.length}/{maxFrag}</strong></span>
        </div>
      </div>

      {combo.fragancias_piso.length < maxFrag && litrosRest > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Fragancia</label>
          <select value={fragSel} onChange={e => setFragSel(e.target.value)} style={{ ...s.input, marginBottom: 10 }}>
            <option value="">— Elegir —</option>
            {FRAGANCIAS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <label style={s.label}>Cantidad</label>
          <select value={cantSel} onChange={e => setCantSel(e.target.value)} style={{ ...s.input, marginBottom: 10 }}>
            <option value="">— Elegir —</option>
            {opciones.map(v => <option key={v} value={v}>{v}lts</option>)}
          </select>
          <button onClick={agregar} disabled={!fragSel || !cantSel} style={{ ...s.btnSecondary, opacity: (!fragSel || !cantSel) ? 0.5 : 1 }}>➕ Agregar fragancia</button>
        </div>
      )}

      {combo.fragancias_piso.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {combo.fragancias_piso.map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>{f.fragancia} · {f.cantidad}lts</span>
              <button onClick={() => setCombo({ ...combo, fragancias_piso: combo.fragancias_piso.filter((_, j) => j !== i) })}
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {litrosRest === 0 && (
        <button onClick={onConfirm} style={s.btnPrimary}>✓ Agregar combo al carrito</button>
      )}
    </div>
  );
};

// ─── EXTRAS Y ENVÍO ───────────────────────────────────────────────────────────

const ExtrasEnvio = ({ extras, setExtras, zona, totalProductos, totalEnvases, totalAgregados, totalEnvio, totalGeneral, onConfirmar, onVolver }) => {
  const [nombreAgr, setNombreAgr] = useState('');
  const [precioAgr, setPrecioAgr] = useState('');

  const agregarExtra = () => {
    if (!nombreAgr || !precioAgr) return;
    setExtras({ ...extras, agregados: [...extras.agregados, { nombre: nombreAgr, precio: parseFloat(precioAgr) }] });
    setNombreAgr(''); setPrecioAgr('');
  };

  return (
    <div>
      <BtnBack onClick={onVolver} />
      <StepHeader step="Extras y envío" title="Completar cotización" />

      {/* ENVASES */}
      <div style={s.card}>
        <div style={s.cardTitle}>🪣 Envases / Baldes</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>$4.000 por unidad</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setExtras({ ...extras, envases: Math.max(0, extras.envases - 1) })} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 20 }}>−</button>
          <span style={{ fontSize: 24, fontWeight: 800, minWidth: 40, textAlign: 'center' }}>{extras.envases}</span>
          <button onClick={() => setExtras({ ...extras, envases: extras.envases + 1 })} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 20 }}>+</button>
          {extras.envases > 0 && <span style={{ color: C.naranja, fontWeight: 700 }}>= {fmt(extras.envases * 4000)}</span>}
        </div>
      </div>

      {/* AGREGADO EXTRA */}
      <div style={s.card}>
        <div style={s.cardTitle}>➕ Agregado Extra</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={s.label}>Descripción</label>
            <input value={nombreAgr} onChange={e => setNombreAgr(e.target.value)} style={s.input} placeholder="Ej: Dispenser, etiqueta especial..." />
          </div>
          <div>
            <label style={s.label}>Importe</label>
            <input type="number" value={precioAgr} onChange={e => setPrecioAgr(e.target.value)} style={s.input} placeholder="$0" />
          </div>
          <button onClick={agregarExtra} disabled={!nombreAgr || !precioAgr} style={{ ...s.btnSecondary, opacity: (!nombreAgr || !precioAgr) ? 0.5 : 1 }}>Agregar</button>
        </div>
        {extras.agregados.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 6 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={extras.esInterior} onChange={e => setExtras({ ...extras, esInterior: e.target.checked })} style={{ width: 18, height: 18 }} />
            <span style={{ fontSize: 13 }}>Envío al interior (VIA CARGO / ANDREANI) — <strong>el cliente paga al transportista</strong></span>
          </label>

          {!extras.esInterior && (
            <>
              {zona ? (
                <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.12)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.25)', fontSize: 13 }}>
                  📍 <strong>{zona.zona}</strong> — {fmt(zona.precio)}/bulto
                </div>
              ) : (
                <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.12)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', fontSize: 13 }}>
                  ⚠️ Localidad no reconocida. Seleccioná la zona manualmente:
                </div>
              )}
              {!zona && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ZONAS_ENVIO.map(z => (
                    <button key={z.zona} onClick={() => setExtras({ ...extras, envio: z })}
                      style={{ ...s.btnOption, background: extras.envio?.zona === z.zona ? 'rgba(249,115,22,0.2)' : undefined, borderColor: extras.envio?.zona === z.zona ? C.naranja : undefined }}>
                      <span>{z.zona}</span>
                      <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(z.precio)}/bulto</span>
                    </button>
                  ))}
                </div>
              )}
              {(zona || extras.envio) && (
                <div>
                  <label style={s.label}>Cantidad de bultos</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={() => setExtras({ ...extras, bultos: Math.max(1, extras.bultos - 1) })} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 20 }}>−</button>
                    <span style={{ fontSize: 24, fontWeight: 800, minWidth: 40, textAlign: 'center' }}>{extras.bultos}</span>
                    <button onClick={() => setExtras({ ...extras, bultos: extras.bultos + 1 })} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 20 }}>+</button>
                    <span style={{ color: C.naranja, fontWeight: 700 }}>= {fmt((extras.envio?.precio || zona?.precio || 0) * extras.bultos)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* RESUMEN TOTAL */}
      <div style={{ ...s.card, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', marginBottom: 20 }}>
        <div style={s.cardTitle}>Resumen</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}>Productos</span><span>{fmt(totalProductos)}</span></div>
          {extras.envases > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}>Envases ({extras.envases})</span><span>{fmt(totalEnvases)}</span></div>}
          {extras.agregados.map((a, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}>{a.nombre}</span><span>{fmt(a.precio)}</span></div>)}
          {extras.esInterior ? (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}>Envío interior</span><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>VIA CARGO / ANDREANI</span></div>
          ) : totalEnvio > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}>Envío ({extras.bultos} bulto{extras.bultos !== 1 ? 's' : ''})</span><span>{fmt(totalEnvio)}</span></div>
          )}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>TOTAL</span>
            <span style={{ ...s.total }}>{fmt(totalGeneral)}</span>
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
    { key: 'cotizacion',  label: '📄 Cotización Cliente',    desc: 'Para compartir con el cliente' },
    { key: 'produccion',  label: '🏭 Hoja de Producción',    desc: 'Para el sector de fabricación' },
    { key: 'etiqueta',    label: '🏷️ Etiqueta de Envío',    desc: 'Para pegar en el paquete' },
    { key: 'checklist',   label: '✅ Checklist de Control',  desc: 'Para verificar el pedido completo' },
  ];

  if (docActivo) {
    return (
      <div>
        <BtnBack onClick={() => setDocActivo(null)} label="← Documentos" />
        <DocViewer tipo={docActivo} pedido={pedido} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...s.card, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#4ade80', marginBottom: 2 }}>✓ Pedido generado</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>{pedido.numero}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{pedido.fecha} · {pedido.cliente.nombre}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.naranja, marginTop: 8 }}>{fmt(pedido.totales.total)}</div>
        </div>
      </div>

      <div style={s.cardTitle}>Elegí un documento</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {docs.map(d => (
          <button key={d.key} onClick={() => setDocActivo(d.key)} style={s.btnOption}>
            <span>{d.label}<span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{d.desc}</span></span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
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

const DocViewer = ({ tipo, pedido }) => {
  const { numero, fecha, cliente, items, extras, totales } = pedido;
  const zona = detectarZona(cliente.localidad);

  const docStyle = {
    background: '#fff', color: '#1e293b', borderRadius: 12, padding: 24,
    fontFamily: '"Inter", sans-serif', fontSize: 13, lineHeight: 1.6,
  };
  const h1 = { fontSize: 18, fontWeight: 800, marginBottom: 4, color: C.verde };
  const h2 = { fontSize: 13, fontWeight: 700, marginTop: 16, marginBottom: 6, color: C.verde, borderBottom: '1px solid #e2e8f0', paddingBottom: 4 };
  const row = { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 };
  const totalRow = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 800, fontSize: 16, color: C.verde };

  const copyText = () => {
    const el = document.getElementById('doc-content');
    if (el) {
      const text = el.innerText;
      navigator.clipboard.writeText(text).then(() => alert('✓ Copiado al portapapeles'));
    }
  };

  if (tipo === 'cotizacion') return (
    <div>
      <div style={docStyle} id="doc-content">
        <div style={h1}>🧹 DOMÉSTICO · Cotización</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Pedido: {numero} · {fecha}</div>

        <div style={h2}>Cliente</div>
        <div><strong>{cliente.nombre}</strong></div>
        <div style={{ color: '#64748b' }}>{cliente.telefono} · {cliente.email}</div>
        <div style={{ color: '#64748b' }}>{cliente.direccion}, {cliente.localidad} {cliente.cp}</div>

        <div style={h2}>Productos</div>
        {items.map((item, i) => (
          <div key={i} style={row}>
            <span>{item.nombre} {item.cantidad > 1 ? `x${item.cantidad}` : ''}{item.descripcion ? <span style={{ display: 'block', fontSize: 11, color: '#94a3b8' }}>{item.descripcion}</span> : null}</span>
            <span style={{ fontWeight: 600 }}>{fmt(item.precio * item.cantidad)}</span>
          </div>
        ))}

        {extras.envases > 0 && <div style={row}><span>Envases ({extras.envases} ud.)</span><span style={{ fontWeight: 600 }}>{fmt(totales.envases)}</span></div>}
        {extras.agregados.map((a, i) => <div key={i} style={row}><span>{a.nombre}</span><span style={{ fontWeight: 600 }}>{fmt(a.precio)}</span></div>)}

        <div style={h2}>Envío</div>
        {extras.esInterior ? (
          <div style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: 8, fontSize: 12 }}>
            📦 Envío al interior vía <strong>VIA CARGO / ANDREANI</strong> — el costo lo abona el cliente al transportista.
          </div>
        ) : (
          <div style={row}>
            <span>Envío a {cliente.localidad} · {extras.bultos} bulto{extras.bultos !== 1 ? 's' : ''} {zona ? `(${zona.zona})` : ''}</span>
            <span style={{ fontWeight: 600 }}>{fmt(totales.envio)}</span>
          </div>
        )}

        <div style={{ marginTop: 16, ...totalRow }}>
          <span>TOTAL A ABONAR</span>
          <span>{fmt(totales.total)}</span>
        </div>

        <div style={{ marginTop: 20, padding: '12px', background: '#f8fafc', borderRadius: 8, fontSize: 11, color: '#94a3b8' }}>
          Precios con 15% OFF vigente · Doméstico Química de Limpieza · Av. Victorica 280, Moreno
        </div>
      </div>
      <button onClick={copyText} style={{ ...s.btnSecondary, marginTop: 14 }}>📋 Copiar texto</button>
    </div>
  );

  if (tipo === 'produccion') return (
    <div>
      <div style={docStyle} id="doc-content">
        <div style={h1}>🏭 ORDEN DE PRODUCCIÓN</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Pedido: <strong>{numero}</strong> · {fecha}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Cliente: <strong>{cliente.nombre}</strong> · {cliente.localidad}</div>

        <div style={h2}>ITEMS A PRODUCIR</div>
        {items.map((item, i) => (
          <div key={i} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, marginBottom: 8, borderLeft: '4px solid #0d5c3a' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{item.cantidad > 1 ? `[×${item.cantidad}] ` : ''}{item.nombre}</div>
            {item.descripcion && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{item.descripcion}</div>}
            {item.detalle?.tipo === 'jabon' && <div style={{ fontSize: 11, marginTop: 4 }}>🎨 Color: <strong>{item.detalle.color}</strong> · Calidad: <strong>{item.detalle.calidad}</strong> · {item.detalle.cantidad}lts</div>}
            {item.detalle?.tipo === 'suavizante' && <div style={{ fontSize: 11, marginTop: 4 }}>🎨 Color: <strong>{item.detalle.color}</strong> · Calidad: <strong>{item.detalle.calidad}</strong> · {item.detalle.cantidad}lts</div>}
            {item.detalle?.tipo === 'detergente' && <div style={{ fontSize: 11, marginTop: 4 }}>🎨 Color: <strong>{item.detalle.color}</strong> · Calidad: <strong>{item.detalle.calidad}</strong> · {item.detalle.cantidad}lts</div>}
            {item.detalle?.tipo === 'desodorante' && <div style={{ fontSize: 11, marginTop: 4 }}>🌸 Fragancia: <strong>{item.detalle.color}</strong> · {item.detalle.cantidad}lts</div>}
            {item.detalle?.tipo === 'lavandina' && <div style={{ fontSize: 11, marginTop: 4 }}>🧴 Lavandina estándar · {item.detalle.cantidad}lts</div>}
          </div>
        ))}

        {extras.envases > 0 && (
          <>
            <div style={h2}>ENVASES / BALDES</div>
            <div style={{ padding: '10px 12px', background: '#fff7ed', borderRadius: 8, borderLeft: '4px solid #f97316' }}>
              🪣 <strong>{extras.envases} envase{extras.envases !== 1 ? 's' : ''}</strong> vacíos para incluir
            </div>
          </>
        )}

        <div style={{ marginTop: 20, padding: '10px 12px', background: '#fef3c7', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
          ⚠️ VERIFICAR: Revisar colores, fragancias y cantidades antes de embolsar.
        </div>
      </div>
      <button onClick={copyText} style={{ ...s.btnSecondary, marginTop: 14 }}>📋 Copiar texto</button>
    </div>
  );

  if (tipo === 'etiqueta') return (
    <div>
      <div style={{ ...docStyle, borderTop: `6px solid ${C.verde}` }} id="doc-content">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.verde, letterSpacing: '-0.5px' }}>🧹 DOMÉSTICO</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Química de Limpieza · Moreno, Pcia. Bs. As.</div>
        </div>

        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 10, marginBottom: 16, borderLeft: '4px solid #0d5c3a' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>DESTINATARIO</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{cliente.nombre}</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{cliente.direccion}</div>
          <div style={{ fontSize: 14 }}>{cliente.localidad} {cliente.cp}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>📱 {cliente.telefono}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          <span>Pedido: <strong>{numero}</strong></span>
          <span>{fecha.split(',')[0]}</span>
        </div>

        {extras.esInterior && (
          <div style={{ padding: '10px', background: '#fef3c7', borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            📦 ENVÍO INTERIOR · VIA CARGO / ANDREANI
          </div>
        )}

        <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 8, fontSize: 12, textAlign: 'center' }}>
          {extras.bultos > 1 ? `${extras.bultos} bultos · Mantenerse vertical` : '1 bulto · Mantenerse vertical'}
        </div>
      </div>
      <button onClick={copyText} style={{ ...s.btnSecondary, marginTop: 14 }}>📋 Copiar texto</button>
    </div>
  );

  if (tipo === 'checklist') return (
    <div>
      <div style={docStyle} id="doc-content">
        <div style={h1}>✅ CHECKLIST DE CONTROL</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Pedido: {numero} · {fecha}<br />Cliente: {cliente.nombre}</div>

        <div style={h2}>VERIFICAR ITEM POR ITEM</div>
        {items.map((item, i) => {
          // Expandir items con cantidad > 1
          const rows = [];
          for (let q = 0; q < item.cantidad; q++) {
            rows.push(
              <div key={`${i}-${q}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 20, height: 20, border: '2px solid #0d5c3a', borderRadius: 4, flexShrink: 0, marginTop: 2 }}></div>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.nombre} {item.cantidad > 1 ? `(${q+1}/${item.cantidad})` : ''}</div>
                  {item.descripcion && <div style={{ fontSize: 11, color: '#64748b' }}>{item.descripcion}</div>}
                  {item.detalle?.color && item.detalle.color !== 'fija' && (
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {item.detalle.tipo === 'desodorante' ? `🌸 Fragancia: ${item.detalle.color}` : `🎨 Color: ${item.detalle.color}`}
                      {item.detalle.calidad ? ` · ${item.detalle.calidad}` : ''} · {item.detalle.cantidad}lts
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return rows;
        })}

        {extras.envases > 0 && (
          <>
            <div style={h2}>ENVASES</div>
            {Array.from({ length: extras.envases }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 20, height: 20, border: '2px solid #f97316', borderRadius: 4, flexShrink: 0 }}></div>
                <span style={{ fontWeight: 600 }}>🪣 Envase / Balde vacío ({i+1}/{extras.envases})</span>
              </div>
            ))}
          </>
        )}

        <div style={h2}>EMBALAJE Y ENVÍO</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: 20, height: 20, border: '2px solid #0d5c3a', borderRadius: 4, flexShrink: 0 }}></div>
          <span>Bultos embalados: {extras.bultos}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: 20, height: 20, border: '2px solid #0d5c3a', borderRadius: 4, flexShrink: 0 }}></div>
          <span>Etiqueta de envío pegada</span>
        </div>
        {extras.esInterior ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <div style={{ width: 20, height: 20, border: '2px solid #f97316', borderRadius: 4, flexShrink: 0 }}></div>
            <span>Entregado en VIA CARGO / ANDREANI</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <div style={{ width: 20, height: 20, border: '2px solid #0d5c3a', borderRadius: 4, flexShrink: 0 }}></div>
            <span>Envío a {cliente.localidad} — {fmt(totales.envio)} cobrado</span>
          </div>
        )}

        <div style={{ marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
          Pedido {numero} · Doméstico Química de Limpieza
        </div>
      </div>
      <button onClick={copyText} style={{ ...s.btnSecondary, marginTop: 14 }}>📋 Copiar texto</button>
    </div>
  );

  return null;
};

export default PedidosApp;
