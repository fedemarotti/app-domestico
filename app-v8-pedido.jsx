import React, { useState } from 'react';
import { PreCotizacion, PRECIOS, PRECIOS_COMBOS, COLORES_JABON, COLORES_SUAVIZANTE, COLORES_DETERGENTE, FRAGANCIAS, PRECIO_ENVASE, ZONAS_ENVIO, detectarZona, componentesDeItem, fmt, uid, G, BB, SH, s, C } from './app-v8.jsx';

// ─── HELPER: abrir documento en nueva pestaña ─────────────────────────────────

function abrirEnPestana(htmlContent, titulo) {
  const w = window.open('', '_blank');
  if (!w) { alert('Habilitá las ventanas emergentes para este sitio e intentá de nuevo.'); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${titulo}</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; }
      @media print { @page { margin: 0; } body { margin: 0; } }
    </style>
  </head><body>${htmlContent}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

function htmlEtiqueta(pedido) {
  const { numero, fecha, cliente, extras, zonaEnvio } = pedido;
  return `
  <div style="width:100mm;min-height:150mm;background:#fff;color:#1e293b;font-family:Arial,sans-serif;padding:8mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="border-bottom:4px solid #0d5c3a;padding-bottom:4mm;margin-bottom:4mm;text-align:center;">
      <div style="font-size:20px;font-weight:900;color:#0d5c3a;">🧹 DOMÉSTICO</div>
      <div style="font-size:9px;color:#64748b;">Química de Limpieza · Moreno, Bs. As.</div>
    </div>
    <div style="flex:1;">
      <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Destinatario</div>
      <div style="font-size:19px;font-weight:900;line-height:1.1;margin-bottom:4px;">${cliente.nombre}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${cliente.direccion}</div>
      <div style="font-size:13px;font-weight:600;">${cliente.localidad}${cliente.cp ? ` (CP: ${cliente.cp})` : ''}</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px;">📱 ${cliente.telefono}</div>
      ${cliente.observaciones ? `<div style="margin-top:6px;padding:4px 8px;background:#fef3c7;border-radius:4px;font-size:10px;font-weight:600;">⚠️ ${cliente.observaciones}</div>` : ''}
    </div>
    ${extras.esInterior ? `<div style="margin:6px 0;padding:6px 8px;background:#fbbf24;border-radius:6px;text-align:center;font-weight:900;font-size:12px;">📦 VIA CARGO / ANDREANI — ENVÍO INTERIOR</div>` : ''}
    <div style="border-top:2px solid #e2e8f0;padding-top:3mm;margin-top:3mm;display:flex;justify-content:space-between;align-items:flex-end;">
      <div style="font-size:9px;"><div style="font-weight:700;">Pedido: ${numero}</div><div style="color:#64748b;">${fecha.split(',')[0]}</div></div>
      <div style="text-align:right;font-size:9px;"><div style="font-weight:700;">${extras.bultos || 1} bulto${(extras.bultos || 1) !== 1 ? 's' : ''}</div><div style="color:#64748b;">Mantenerse vertical</div></div>
    </div>
    <style>@media print{@page{size:100mm 150mm;margin:0;}body{margin:0;}}</style>
  </div>`;
}

function htmlProduccion(pedido) {
  const { numero, fecha, cliente, items } = pedido;
  const rows = items.map(item => {
    const comps = componentesDeItem(item);
    const colorInfo = item.detalle?.color && item.detalle.color !== 'fija'
      ? [...COLORES_JABON, ...COLORES_SUAVIZANTE, ...COLORES_DETERGENTE].find(c => c.label === item.detalle.color)
      : null;
    const divs = item.detalle?.divisiones;
    return `
      <div style="padding:8px 10px;border-left:4px solid #0d5c3a;background:#f8fafc;margin-bottom:7px;border-radius:4px;">
        <div style="font-weight:800;font-size:13px;">${item.cantidad > 1 ? `[×${item.cantidad}] ` : ''}${item.nombre}</div>
        ${item.descripcion ? `<div style="font-size:10px;color:#64748b;">${item.descripcion}</div>` : ''}
        ${divs && divs.length > 1 ? divs.map(d => {
          const ci = [...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===d.color);
          return `<div style="margin-top:4px;display:inline-flex;align-items:center;gap:5px;background:${ci?.hex||'#e2e8f0'};color:${ci?.tc||'#1e293b'};border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;margin-right:5px;">● 50lts ${d.color}</div>`;
        }).join('') : colorInfo ? `<div style="margin-top:4px;display:inline-flex;align-items:center;gap:5px;background:${colorInfo.hex};color:${colorInfo.tc};border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;">● ${colorInfo.label}</div>` : ''}
        ${comps.length > 0 ? `<div style="margin-top:5px;font-size:10px;color:#64748b;">${comps.join(' · ')}</div>` : ''}
      </div>`;
  }).join('');
  const obs = cliente.observaciones ? `<div style="margin-top:10px;padding:8px 10px;background:#fef3c7;border-radius:6px;font-size:11px;"><strong>⚠️ Obs:</strong> ${cliente.observaciones}</div>` : '';
  return `
    <div style="padding:14px;font-family:Arial,sans-serif;font-size:12px;color:#1e293b;max-width:800px;">
      <div style="border-bottom:3px solid #0d5c3a;padding-bottom:8px;margin-bottom:10px;">
        <div style="font-size:16px;font-weight:900;color:#0d5c3a;">🏭 ORDEN DE PRODUCCIÓN</div>
        <div style="font-size:11px;color:#64748b;">Pedido: <strong>${numero}</strong> · ${fecha}</div>
        <div style="font-size:11px;">Cliente: <strong>${cliente.nombre}</strong> · ${cliente.localidad}</div>
      </div>
      ${rows}${obs}
      <div style="margin-top:10px;padding:6px 10px;background:#fee2e2;border-radius:6px;font-size:11px;font-weight:700;">✋ VERIFICAR colores, fragancias y cantidades antes de embolsar.</div>
      <style>@media print{@page{size:A4;margin:10mm;}}</style>
    </div>`;
}

function htmlChecklist(pedido) {
  const { numero, fecha, cliente, items, extras, totales } = pedido;
  const checkItem = (label, color) => `
    <div style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9;">
      <div style="width:18px;height:18px;border:2px solid ${color||'#0d5c3a'};border-radius:3px;flex-shrink:0;margin-top:1px;"></div>
      <div>${label}</div>
    </div>`;

  const itemsHTML = items.map(item => {
    const comps = componentesDeItem(item);
    const divs = item.detalle?.divisiones;
    const colorInfo = item.detalle?.color && item.detalle.color !== 'fija'
      ? [...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===item.detalle.color)
      : null;
    let rows = [];
    for (let q = 0; q < item.cantidad; q++) {
      let detalle = '';
      if (divs && divs.length > 1) {
        detalle = divs.map(d => {
          const ci = [...COLORES_JABON,...COLORES_SUAVIZANTE,...COLORES_DETERGENTE].find(c=>c.label===d.color);
          return `<span style="background:${ci?.hex||'#e2e8f0'};color:${ci?.tc||'#1e293b'};border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700;margin-right:4px;">● 50lts ${d.color}</span>`;
        }).join('');
      } else if (colorInfo) {
        detalle = `<span style="background:${colorInfo.hex};color:${colorInfo.tc};border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700;">● ${colorInfo.label}</span>`;
      }
      rows.push(`
        <div style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid #f1f5f9;">
          <div style="width:18px;height:18px;border:2px solid #0d5c3a;border-radius:3px;flex-shrink:0;margin-top:1px;"></div>
          <div>
            <div style="font-weight:700;">${item.nombre}${item.cantidad > 1 ? ` (${q+1}/${item.cantidad})` : ''}</div>
            ${detalle ? `<div style="margin-top:3px;">${detalle}</div>` : ''}
            ${comps.length > 0 ? `<div style="font-size:10px;color:#64748b;margin-top:2px;">${comps.join(' · ')}</div>` : ''}
          </div>
        </div>`);
    }
    return rows.join('');
  }).join('');

  const envasesHTML = extras.envases > 0 ? Array.from({ length: extras.envases }).map((_, i) =>
    checkItem(`🪣 Envase / Balde vacío (${i+1}/${extras.envases})`, '#f97316')).join('') : '';

  const obs = cliente.observaciones ? `<div style="margin-top:10px;padding:7px 10px;background:#fef3c7;border-radius:6px;font-size:11px;"><strong>⚠️ Obs:</strong> ${cliente.observaciones}</div>` : '';

  return `
    <div style="padding:14px;font-family:Arial,sans-serif;font-size:12px;color:#1e293b;max-width:800px;">
      <div style="border-bottom:3px solid #0d5c3a;padding-bottom:8px;margin-bottom:10px;">
        <div style="font-size:16px;font-weight:900;color:#0d5c3a;">✅ CHECKLIST DE CONTROL</div>
        <div style="font-size:11px;color:#64748b;">${numero} · ${fecha}</div>
        <div style="font-size:11px;">${cliente.nombre} · ${cliente.localidad}</div>
      </div>
      <div style="font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;color:#0d5c3a;">Items a verificar</div>
      ${itemsHTML}
      ${extras.envases > 0 ? `<div style="font-weight:800;font-size:11px;text-transform:uppercase;margin-top:10px;margin-bottom:6px;color:#f97316;">Envases</div>${envasesHTML}` : ''}
      <div style="font-weight:800;font-size:11px;text-transform:uppercase;margin-top:10px;margin-bottom:6px;color:#0d5c3a;">Embalaje y despacho</div>
      ${checkItem(`Bultos embalados: ${extras.bultos || 1}`)}
      ${checkItem('Etiqueta de envío pegada')}
      ${extras.esInterior ? checkItem('Entregado en VIA CARGO / ANDREANI') : checkItem(`Cobro de envío confirmado: ${fmt(totales.envio)}`)}
      ${obs}
      <div style="margin-top:12px;text-align:center;font-size:10px;color:#94a3b8;">${numero} · Doméstico Química de Limpieza</div>
      <style>@media print{@page{size:A4;margin:10mm;}}</style>
    </div>`;
}

function htmlCotizacion(pedido) {
  const { numero, fecha, cliente, items, extras, totales, zonaEnvio } = pedido;
  const rows = items.map(item => `
    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:13px;">
      <span>${item.nombre}${item.cantidad > 1 ? ` ×${item.cantidad}` : ''}${item.descripcion ? `<span style="display:block;font-size:11px;color:#94a3b8;">${item.descripcion}</span>` : ''}</span>
      <span style="font-weight:700;">${fmt(item.precio * item.cantidad)}</span>
    </div>`).join('');
  const obs = cliente.observaciones ? `<div style="margin-top:12px;padding:10px;background:#fef3c7;border-radius:8px;font-size:12px;"><strong>📝 Observaciones:</strong> ${cliente.observaciones}</div>` : '';
  return `
    <div style="padding:20px;font-family:Arial,sans-serif;color:#1e293b;max-width:600px;">
      <div style="border-bottom:3px solid #0d5c3a;padding-bottom:10px;margin-bottom:16px;">
        <div style="font-size:20px;font-weight:900;color:#0d5c3a;">🧹 DOMÉSTICO · Cotización</div>
        <div style="font-size:12px;color:#64748b;">Pedido: ${numero} · ${fecha}</div>
      </div>
      <div style="margin-bottom:14px;"><div style="font-weight:700;">${cliente.nombre}</div><div style="color:#64748b;font-size:12px;">${cliente.telefono} · ${cliente.email||''}</div><div style="color:#64748b;font-size:12px;">${cliente.direccion}, ${cliente.localidad}${cliente.cp ? ` ${cliente.cp}` : ''}</div></div>
      <div style="font-weight:800;font-size:11px;text-transform:uppercase;color:#0d5c3a;margin-bottom:8px;">Productos</div>
      ${rows}
      ${extras.envases > 0 ? `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:13px;"><span>Envases (${extras.envases} ud.)</span><span style="font-weight:700;">${fmt(totales.envases)}</span></div>` : ''}
      ${extras.agregados?.map(a => `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:13px;"><span>${a.nombre}</span><span style="font-weight:700;">${fmt(a.precio)}</span></div>`).join('')||''}
      <div style="font-weight:800;font-size:11px;text-transform:uppercase;color:#0d5c3a;margin:12px 0 8px;">Envío</div>
      ${extras.esInterior ? `<div style="padding:8px 12px;background:#fef3c7;border-radius:8px;font-size:12px;">📦 Envío al interior vía <strong>VIA CARGO / ANDREANI</strong> — el costo lo abona el cliente al transportista.</div>`
        : zonaEnvio ? `<div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid #f1f5f9;"><span>${zonaEnvio.zona} · ${extras.bultos||1} bulto${(extras.bultos||1)!==1?'s':''}</span><span style="font-weight:700;">${fmt(totales.envio)}</span></div>` : ''}
      <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:18px;color:#0d5c3a;border-top:2px solid #0d5c3a;padding-top:10px;">
        <span>TOTAL A ABONAR</span><span>${fmt(totales.total)}</span>
      </div>
      ${obs}
      <div style="margin-top:16px;padding:10px;background:#f8fafc;border-radius:8px;font-size:10px;color:#94a3b8;">Precios con 15% OFF vigente · Doméstico Química de Limpieza · Av. Victorica 280, Moreno</div>
      <style>@media print{@page{size:A4;margin:10mm;}}</style>
    </div>`;
}

// ─── PEDIDO DEFINITIVO ────────────────────────────────────────────────────────

const PedidoDefinitivo = ({ onVolver }) => {
  const [paso, setPaso]       = useState('inicio');
  const [carrito, setCarrito] = useState([]);
  const [extras, setExtras]   = useState({ envases: 0, agregados: [], envio: null, bultos: 1, esInterior: false });
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '', localidad: '', cp: '', observaciones: '' });
  const [pedidoFinal, setPedidoFinal] = useState(null);
  const [borradores, setBorradores]   = useState(() => { try { return JSON.parse(localStorage.getItem('dom_v8')) || []; } catch { return []; } });

  // estados de construcción
  const [prodInd, setProdInd] = useState({ tipo: null, cantidad: null, calidad: null, color: null, divisiones: [] });
  const [combo, setCombo]     = useState({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [], canje_lavandina: false, dividir_jabon: [], dividir_suavizante: [], dividir_detergente: [] });
  const [modoDivision, setModoDivision] = useState(false);

  const zona = detectarZona(cliente.localidad);
  const zonaEf = extras.envio || zona;
  const totalProd    = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalEnvases = extras.envases * PRECIO_ENVASE;
  const totalAgr     = extras.agregados.reduce((s, a) => s + (parseFloat(a.precio) || 0), 0);
  const totalEnvio   = extras.esInterior ? 0 : (zonaEf ? zonaEf.precio * extras.bultos : 0);
  const totalG       = totalProd + totalEnvases + totalAgr + totalEnvio;

  const eliminarItem    = id => setCarrito(carrito.filter(i => i.id !== id));
  const cambiarCantidad = (id, d) => setCarrito(carrito.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + d) } : i));

  // Construir nombre de ítem con divisiones
  const nombreConDivisiones = (tipo, cantidad, calidad, divisiones) => {
    if (!divisiones || divisiones.length <= 1) {
      const col = divisiones?.[0]?.color || '';
      return `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts${col ? ` · ${col}` : ''}`;
    }
    return `${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts (dividido: ${divisiones.map(d => `${d.cantidad}lts ${d.color}`).join(', ')})`;
  };

  const agregarIndividual = () => {
    const { tipo, cantidad, calidad, color, divisiones } = prodInd;
    let nombre = '', precio = 0;
    if (tipo === 'lavandina')        { nombre = `Lavandina ${cantidad}lts`; precio = PRECIOS.lavandina[cantidad]; }
    else if (tipo === 'desodorante') { nombre = `Desodorante Piso ${cantidad}lts`; precio = PRECIOS.desodorante[cantidad]; }
    else {
      precio = PRECIOS[tipo][cantidad][calidad];
      nombre = nombreConDivisiones(tipo, cantidad, calidad, divisiones);
    }
    setCarrito([...carrito, { id: uid(), tipo: 'individual', nombre, detalle: { tipo, cantidad, calidad, color, divisiones }, precio, cantidad: 1 }]);
    setProdInd({ tipo: null, cantidad: null, calidad: null, color: null, divisiones: [] });
    setModoDivision(false);
    setPaso('carrito');
  };

  const agregarCombo = () => {
    const { tamaño, calidad, jabon_color, suavizante_color, detergente_color, fragancias_piso, canje_lavandina, dividir_jabon, dividir_suavizante, dividir_detergente } = combo;
    const precio = PRECIOS_COMBOS[tamaño][calidad];
    const descFrag = fragancias_piso.map(f => `${f.fragancia} ${f.cantidad}lts`).join(' + ');
    const nbJabon = dividir_jabon.length > 1 ? `Jabón (${dividir_jabon.map(d=>`${d.cantidad}lts ${d.color}`).join(', ')})` : `Jabón ${jabon_color}`;
    const nbSuav  = dividir_suavizante.length > 1 ? `Suavizante (${dividir_suavizante.map(d=>`${d.cantidad}lts ${d.color}`).join(', ')})` : `Suavizante ${suavizante_color}`;
    const nbDet   = dividir_detergente.length > 1 ? `Detergente (${dividir_detergente.map(d=>`${d.cantidad}lts ${d.color}`).join(', ')})` : `Detergente ${detergente_color}`;
    const nbLav   = canje_lavandina ? '⚠️ CANJE: Lavandina → Desodorante' : 'Lavandina';
    const descripcion = `${nbJabon} · ${nbSuav} · ${nbDet} · Desodorante (${descFrag}) · ${nbLav}`;
    setCarrito([...carrito, { id: uid(), tipo: 'combo', nombre: `Combo Full ${tamaño===50?'Chico':'Grande'} ${calidad}`, descripcion, detalle: combo, precio, cantidad: 1 }]);
    setCombo({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [], canje_lavandina: false, dividir_jabon: [], dividir_suavizante: [], dividir_detergente: [] });
    setPaso('carrito');
  };

  const confirmar = () => {
    const p = { numero: `DOM-${Date.now().toString().slice(-8)}`, fecha: new Date().toLocaleString('es-AR'), cliente, items: carrito, extras, totales: { productos: totalProd, envases: totalEnvases, agregados: totalAgr, envio: totalEnvio, total: totalG }, zonaEnvio: zonaEf, estado: 'pendiente' };
    setPedidoFinal(p);
    setPaso('docs');
  };

  const imprimirTodo = () => {
    if (!pedidoFinal) return;
    setTimeout(() => abrirEnPestana(htmlCotizacion(pedidoFinal), 'Cotización · ' + pedidoFinal.numero), 0);
    setTimeout(() => abrirEnPestana(htmlProduccion(pedidoFinal), 'Producción · ' + pedidoFinal.numero), 400);
    setTimeout(() => abrirEnPestana(htmlChecklist(pedidoFinal), 'Checklist · ' + pedidoFinal.numero), 800);
    setTimeout(() => abrirEnPestana(htmlEtiqueta(pedidoFinal), 'Etiqueta · ' + pedidoFinal.numero), 1200);
  };

  const guardarBorrador = () => {
    if (!pedidoFinal) return;
    const n = [...borradores, pedidoFinal];
    setBorradores(n);
    localStorage.setItem('dom_v8', JSON.stringify(n));
    alert('✓ Guardado');
  };

  const resetear = () => {
    setCarrito([]); setExtras({ envases: 0, agregados: [], envio: null, bultos: 1, esInterior: false });
    setCliente({ nombre: '', telefono: '', email: '', direccion: '', localidad: '', cp: '', observaciones: '' });
    setPedidoFinal(null); setPaso('inicio');
  };

  // ── RENDER ──

  return (
    <div>
      {/* INICIO PEDIDO */}
      {paso === 'inicio' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>Etapa 2</div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.4px', marginBottom: 4 }}>Pedido Definitivo</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Post-confirmación de pago</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => { setProdInd({ tipo: null, cantidad: null, calidad: null, color: null, divisiones: [] }); setModoDivision(false); setPaso('tipo'); }} style={s.btnP}>➕ Producto Individual</button>
            <button onClick={() => { setCombo({ tamaño: null, calidad: null, jabon_color: null, suavizante_color: null, detergente_color: null, fragancias_piso: [], canje_lavandina: false, dividir_jabon: [], dividir_suavizante: [], dividir_detergente: [] }); setPaso('c1'); }} style={s.btnV}>📦 Combo Pre-armado</button>
            {carrito.length > 0 && <button onClick={() => setPaso('carrito')} style={s.btnS}>🛒 Carrito — {fmt(totalProd)}</button>}
            <button onClick={onVolver} style={{ ...s.btnS, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>← Volver a Pre-cotización</button>
          </div>
        </div>
      )}

      {/* TIPO */}
      {paso === 'tipo' && (
        <div>
          <BB onClick={() => setPaso('inicio')} />
          <SH step="Paso 1 de 4" title="¿Qué producto?" />
          <G gap={10}>
            {[{k:'jabon',l:'Jabón',i:'🫧'},{k:'suavizante',l:'Suavizante',i:'🌸'},{k:'detergente',l:'Detergente',i:'🟡'},{k:'lavandina',l:'Lavandina',i:'🧴'},{k:'desodorante',l:'Desodorante Piso',i:'✨'}].map(p => (
              <button key={p.k} onClick={() => { setProdInd({ ...prodInd, tipo: p.k }); setPaso('cantidad'); }} style={s.btnO}>
                <span>{p.i} <strong>{p.l}</strong></span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
              </button>
            ))}
          </G>
        </div>
      )}

      {/* CANTIDAD */}
      {paso === 'cantidad' && (
        <div>
          <BB onClick={() => setPaso('tipo')} />
          <SH step="Paso 2 de 4" title="¿Cuántos litros?" />
          <G cols={2} gap={14}>
            {[50, 200].map(lts => (
              <button key={lts} onClick={() => { setProdInd({ ...prodInd, cantidad: lts, divisiones: [] }); setPaso(['jabon','suavizante','detergente'].includes(prodInd.tipo) ? 'calidad' : 'color'); }}
                style={{ ...s.btnO, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <span style={{ fontSize: 32, fontWeight: 900 }}>{lts}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>litros</span>
                {PRECIOS[prodInd.tipo]?.[lts] && (
                  <span style={{ fontSize: 12, color: C.naranja, fontWeight: 700, marginTop: 4 }}>
                    {typeof PRECIOS[prodInd.tipo][lts] === 'number' ? fmt(PRECIOS[prodInd.tipo][lts]) : `desde ${fmt(Math.min(...Object.values(PRECIOS[prodInd.tipo][lts])))}`}
                  </span>
                )}
              </button>
            ))}
          </G>
        </div>
      )}

      {/* CALIDAD */}
      {paso === 'calidad' && (
        <div>
          <BB onClick={() => setPaso('cantidad')} />
          <SH step="Paso 3 de 4" title="Línea de calidad" />
          <G gap={10}>
            {[{k:'Inicial',d:'Línea económica'},{k:'Intermedia',d:'Línea estándar'},{k:'Premium',d:'Línea superior'}].map(c => {
              const p = PRECIOS[prodInd.tipo]?.[prodInd.cantidad]?.[c.k];
              return (
                <button key={c.k} onClick={() => { setProdInd({ ...prodInd, calidad: c.k }); setPaso('color'); }} style={s.btnO}>
                  <span><strong>{c.k}</strong><span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>{c.d}</span></span>
                  <span style={{ color: C.naranja, fontWeight: 800 }}>{p ? fmt(p) : ''}</span>
                </button>
              );
            })}
          </G>
        </div>
      )}

      {/* COLOR / FRAGANCIA con DIVISIÓN */}
      {paso === 'color' && (
        <ColorYDivision
          prodInd={prodInd} setProdInd={setProdInd}
          modoDivision={modoDivision} setModoDivision={setModoDivision}
          onConfirm={agregarIndividual}
          onBack={() => setPaso(['jabon','suavizante','detergente'].includes(prodInd.tipo) ? 'calidad' : 'cantidad')}
        />
      )}

      {/* COMBO */}
      {paso === 'c1' && <ComboTamano combo={combo} setCombo={setCombo} onNext={() => setPaso('c2')} onBack={() => setPaso('inicio')} />}
      {paso === 'c2' && <ComboCalidad combo={combo} setCombo={setCombo} onNext={() => setPaso('c3a')} onBack={() => setPaso('c1')} />}
      {paso === 'c3a' && <ComboDivision tipo="jabon" label="Jabón" colores={COLORES_JABON} combo={combo} setCombo={setCombo} onNext={() => setPaso('c3b')} onBack={() => setPaso('c2')} field="jabon_color" divField="dividir_jabon" />}
      {paso === 'c3b' && <ComboDivision tipo="suavizante" label="Suavizante" colores={COLORES_SUAVIZANTE} combo={combo} setCombo={setCombo} onNext={() => setPaso('c3c')} onBack={() => setPaso('c3a')} field="suavizante_color" divField="dividir_suavizante" />}
      {paso === 'c3c' && <ComboDivision tipo="detergente" label="Detergente" colores={COLORES_DETERGENTE} combo={combo} setCombo={setCombo} onNext={() => setPaso('c4')} onBack={() => setPaso('c3b')} field="detergente_color" divField="dividir_detergente" />}
      {paso === 'c4' && <ComboFraganciasYLavandina combo={combo} setCombo={setCombo} onConfirm={agregarCombo} onBack={() => setPaso('c3c')} />}

      {/* CARRITO */}
      {paso === 'carrito' && (
        <div>
          <BB onClick={() => setPaso('inicio')} />
          <SH step="Carrito" title={`${carrito.length} ítem${carrito.length !== 1 ? 's' : ''}`} />
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>El carrito está vacío</div>
              <button onClick={() => setPaso('inicio')} style={s.btnP}>Agregar productos</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {carrito.map(item => (
                  <div key={item.id} style={{ ...s.card, padding: '14px 16px', marginBottom: 0, borderLeft: `4px solid ${C.naranja}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{item.nombre}</div>
                        {item.descripcion && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginBottom: 4 }}>{item.descripcion}</div>}
                        <div style={{ fontSize: 14, color: C.naranja, fontWeight: 800, marginTop: 4 }}>{fmt(item.precio * item.cantidad)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => cambiarCantidad(item.id, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 18 }}>−</button>
                        <span style={{ fontWeight: 800, minWidth: 22, textAlign: 'center' }}>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 18 }}>+</button>
                        <button onClick={() => eliminarItem(item.id)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: 14 }}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...s.card, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', textAlign: 'right', marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Subtotal productos</div>
                <div style={s.total}>{fmt(totalProd)}</div>
              </div>
              <G cols={2} gap={10}><button onClick={() => setPaso('inicio')} style={s.btnS}>➕ Agregar más</button><button onClick={() => setPaso('cli')} style={s.btnP}>Continuar →</button></G>
            </>
          )}
        </div>
      )}

      {/* CLIENTE */}
      {paso === 'cli' && (
        <ClienteForm cliente={cliente} setCliente={setCliente} zona={zona}
          onSig={() => setPaso('extras')} onVolver={() => setPaso('carrito')} />
      )}

      {/* EXTRAS */}
      {paso === 'extras' && (
        <ExtrasEnvio extras={extras} setExtras={setExtras} zona={zona}
          totalProd={totalProd} totalEnvases={totalEnvases} totalAgr={totalAgr} totalEnvio={totalEnvio} totalG={totalG}
          onConfirmar={confirmar} onVolver={() => setPaso('cli')} />
      )}

      {/* DOCS */}
      {paso === 'docs' && pedidoFinal && (
        <div>
          <div style={{ ...s.card, background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.28)', marginBottom: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#4ade80', marginBottom: 2 }}>✓ Pedido generado</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>{pedidoFinal.numero}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{pedidoFinal.fecha} · {pedidoFinal.cliente.nombre}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.naranja, marginTop: 8 }}>{fmt(pedidoFinal.totales.total)}</div>
          </div>

          <button onClick={imprimirTodo} style={{ ...s.btnP, marginBottom: 10 }}>
            🖨️ Imprimir todo — 4 pestañas (Cotización · Producción · Checklist · Etiqueta)
          </button>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, textAlign: 'center' }}>
            Se abrirán 4 pestañas. Si el navegador las bloquea, habilitá las ventanas emergentes.
          </div>

          <WACopiable pedido={pedidoFinal} />

          <G cols={2} gap={10} style={{ marginTop: 14 }}>
            <button onClick={guardarBorrador} style={s.btnS}>💾 Borrador</button>
            <button onClick={resetear} style={s.btnP}>➕ Nuevo pedido</button>
          </G>
        </div>
      )}
    </div>
  );
};

// ─── COLOR Y DIVISIÓN ─────────────────────────────────────────────────────────

const ColorYDivision = ({ prodInd, setProdInd, modoDivision, setModoDivision, onConfirm, onBack }) => {
  const { tipo, cantidad, calidad, divisiones } = prodInd;
  const colores = tipo === 'jabon' ? COLORES_JABON : tipo === 'suavizante' ? COLORES_SUAVIZANTE : tipo === 'detergente' ? COLORES_DETERGENTE : [];
  const puedeDiv = ['jabon','suavizante','detergente'].includes(tipo) && cantidad === 200;
  const totalDiv = divisiones.reduce((s, d) => s + d.cantidad, 0);
  const resto = 200 - totalDiv;
  const fragSel = prodInd.fragSel || '';
  const cantFrag = prodInd.cantFrag || '';

  // Desodorante especial
  if (tipo === 'desodorante') {
    const litUsados = (divisiones || []).reduce((s, d) => s + d.cantidad, 0);
    const litResto = cantidad - litUsados;
    return (
      <div>
        <BB onClick={onBack} />
        <SH step="Paso 4 de 4" title="Fragancia" />
        <div style={{ ...s.card, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>Restante: <strong>{litResto}lts</strong></span>
            <span>Fragancias: <strong>{(divisiones||[]).length}/{cantidad===200?4:1}</strong></span>
          </div>
        </div>
        {litResto > 0 && (divisiones||[]).length < (cantidad===200?4:1) && (
          <div style={{ marginBottom: 14 }}>
            <G cols={2} gap={8}>
              {FRAGANCIAS.map(f => (
                <button key={f.label} onClick={() => setProdInd({ ...prodInd, fragSel: f.label })}
                  style={{ padding: '10px 12px', borderRadius: 10, border: prodInd.fragSel === f.label ? `2px solid ${C.naranja}` : '1px solid rgba(255,255,255,0.14)', background: prodInd.fragSel === f.label ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </G>
            {prodInd.fragSel && (
              <div style={{ marginTop: 10 }}>
                <label style={s.lbl}>Cantidad (lts)</label>
                <select value={cantFrag} onChange={e => setProdInd({ ...prodInd, cantFrag: e.target.value })} style={{ ...s.inp, marginBottom: 10 }}>
                  <option value="">— Cantidad —</option>
                  {[50,100,200].filter(v => v <= litResto).map(v => <option key={v} value={v}>{v}lts</option>)}
                </select>
                <button onClick={() => {
                  if (!prodInd.fragSel || !cantFrag) return;
                  setProdInd({ ...prodInd, divisiones: [...(divisiones||[]), { fragancia: prodInd.fragSel, cantidad: parseInt(cantFrag) }], fragSel: '', cantFrag: '' });
                }} style={s.btnS}>➕ Agregar fragancia</button>
              </div>
            )}
          </div>
        )}
        {(divisiones||[]).map((d, i) => {
          const info = FRAGANCIAS.find(f => f.label === d.fragancia);
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 8 }}>
              <span>{info?.icon} {d.fragancia} · {d.cantidad}lts</span>
              <button onClick={() => setProdInd({ ...prodInd, divisiones: (divisiones||[]).filter((_,j) => j !== i) })} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
            </div>
          );
        })}
        {litResto === 0 && <button onClick={onConfirm} style={s.btnP}>✓ Agregar al carrito</button>}
        {cantidad === 50 && (divisiones||[]).length === 1 && <button onClick={onConfirm} style={s.btnP}>✓ Agregar al carrito</button>}
      </div>
    );
  }

  // Lavandina
  if (tipo === 'lavandina') {
    return (
      <div>
        <BB onClick={onBack} />
        <SH step="Paso 4 de 4" title="Confirmar" />
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🧴</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Lavandina {cantidad}lts</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: C.naranja, marginTop: 8 }}>{fmt(PRECIOS.lavandina[cantidad])}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Incluye: activador en polvo + activador líquido amarillo</div>
        </div>
        <button onClick={() => { setProdInd({ ...prodInd, color: 'fija', divisiones: [] }); onConfirm(); }} style={s.btnP}>✓ Agregar al carrito</button>
      </div>
    );
  }

  // Jabón / Suavizante / Detergente — con opción de división
  return (
    <div>
      <BB onClick={onBack} />
      <SH step="Paso 4 de 4" title={`Color · ${tipo.charAt(0).toUpperCase()+tipo.slice(1)} ${calidad} ${cantidad}lts`} />

      {puedeDiv && (
        <div style={{ ...s.card, background: modoDivision ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.06)', border: modoDivision ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.12)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>✂️ Dividir en fracciones de 50lts</span>
            <button onClick={() => { setModoDivision(!modoDivision); setProdInd({ ...prodInd, divisiones: [], color: null }); }}
              style={{ padding: '5px 12px', borderRadius: 20, border: 'none', background: modoDivision ? C.naranja : 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
              {modoDivision ? 'ON' : 'OFF'}
            </button>
          </div>
          {modoDivision && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Podés agregar hasta 4 fracciones de 50lts, cada una con un color distinto</div>}
        </div>
      )}

      {!modoDivision ? (
        <>
          <G cols={tipo === 'detergente' ? 1 : 3} gap={12}>
            {colores.map(c => (
              <button key={c.label} onClick={() => setProdInd({ ...prodInd, color: c.label, divisiones: [{ cantidad, color: c.label }] })}
                style={{ padding: tipo === 'detergente' ? '16px 20px' : '16px 8px', borderRadius: 12, border: prodInd.color === c.label ? '3px solid #fff' : '3px solid transparent', background: c.hex, color: c.tc, fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', boxShadow: prodInd.color === c.label ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none' }}>
                {c.label}
              </button>
            ))}
          </G>
          {prodInd.color && <button onClick={onConfirm} style={{ ...s.btnP, marginTop: 14 }}>✓ Agregar al carrito</button>}
        </>
      ) : (
        <DivisionFracciones colores={colores} divisiones={divisiones} setProdInd={setProdInd} prodInd={prodInd} onConfirm={onConfirm} />
      )}
    </div>
  );
};

const DivisionFracciones = ({ colores, divisiones, prodInd, setProdInd, onConfirm }) => {
  const [colorSel, setColorSel] = useState('');
  const totalUsado = divisiones.reduce((s, d) => s + d.cantidad, 0);
  const resto = 200 - totalUsado;

  const agregar = () => {
    if (!colorSel || resto < 50) return;
    setProdInd({ ...prodInd, divisiones: [...divisiones, { cantidad: 50, color: colorSel }] });
    setColorSel('');
  };

  return (
    <div>
      <div style={{ ...s.card, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Restante: <strong>{resto}lts</strong></span>
          <span>Fracciones: <strong>{divisiones.length}/4</strong></span>
        </div>
      </div>

      {divisiones.length < 4 && resto >= 50 && (
        <div style={{ marginBottom: 14 }}>
          <label style={s.lbl}>Color para esta fracción de 50lts</label>
          <G cols={prodInd.tipo === 'detergente' ? 1 : 3} gap={10} style={{ marginBottom: 10 }}>
            {colores.map(c => (
              <button key={c.label} onClick={() => setColorSel(c.label)}
                style={{ padding: prodInd.tipo === 'detergente' ? '12px 16px' : '12px 8px', borderRadius: 10, border: colorSel === c.label ? '3px solid #fff' : '3px solid transparent', background: c.hex, color: c.tc, fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: colorSel === c.label ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none' }}>
                {c.label}
              </button>
            ))}
          </G>
          <button onClick={agregar} disabled={!colorSel} style={{ ...s.btnS, opacity: colorSel ? 1 : 0.45 }}>➕ Agregar fracción 50lts</button>
        </div>
      )}

      {divisiones.map((d, i) => {
        const ci = colores.find(c => c.label === d.color);
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderRadius: 10, marginBottom: 8, background: ci?.hex || '#e2e8f0', color: ci?.tc || '#1e293b' }}>
            <span style={{ fontWeight: 700 }}>{d.cantidad}lts — {d.color}</span>
            <button onClick={() => setProdInd({ ...prodInd, divisiones: divisiones.filter((_, j) => j !== i) })} style={{ background: 'rgba(0,0,0,0.15)', color: ci?.tc || '#1e293b', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
          </div>
        );
      })}

      {totalUsado === 200 && <button onClick={onConfirm} style={{ ...s.btnP, marginTop: 10 }}>✓ Agregar al carrito</button>}
    </div>
  );
};

// ─── COMBO COMPONENTS ─────────────────────────────────────────────────────────

const ComboTamano = ({ combo, setCombo, onNext, onBack }) => (
  <div>
    <BB onClick={onBack} />
    <SH step="Combo · Paso 1" title="Tamaño del combo" />
    <G cols={2} gap={14}>
      {[{lts:50,l:'Chico'},{lts:200,l:'Grande'}].map(t => (
        <button key={t.lts} onClick={() => { setCombo({ ...combo, tamaño: t.lts }); onNext(); }}
          style={{ ...s.btnO, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <span style={{ fontSize: 22, fontWeight: 900 }}>{t.l}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{t.lts}lts total</span>
        </button>
      ))}
    </G>
  </div>
);

const ComboCalidad = ({ combo, setCombo, onNext, onBack }) => (
  <div>
    <BB onClick={onBack} />
    <SH step="Combo · Paso 2" title="Línea de calidad" />
    <G gap={10}>
      {['Inicial','Intermedia','Premium'].map(cal => (
        <button key={cal} onClick={() => { setCombo({ ...combo, calidad: cal }); onNext(); }} style={s.btnO}>
          <span>{cal}</span>
          <span style={{ color: C.naranja, fontWeight: 800 }}>{PRECIOS_COMBOS[combo.tamaño]?.[cal] ? fmt(PRECIOS_COMBOS[combo.tamaño][cal]) : ''}</span>
        </button>
      ))}
    </G>
  </div>
);

const ComboDivision = ({ tipo, label, colores, combo, setCombo, onNext, onBack, field, divField }) => {
  const [modDiv, setModDiv] = useState(false);
  const es200 = combo.tamaño === 200;

  const elegirColor = (color) => {
    setCombo({ ...combo, [field]: color, [divField]: [{ cantidad: combo.tamaño, color }] });
    onNext();
  };

  const confirmarDiv = () => onNext();

  return (
    <div>
      <BB onClick={onBack} />
      <SH step={`Combo · ${label}`} title={`Color del ${label}`} />

      {es200 && (
        <div style={{ ...s.card, background: modDiv ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.06)', border: modDiv ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.12)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>✂️ Dividir en 4 fracciones de 50lts</span>
            <button onClick={() => { setModDiv(!modDiv); setCombo({ ...combo, [field]: null, [divField]: [] }); }}
              style={{ padding: '5px 12px', borderRadius: 20, border: 'none', background: modDiv ? C.naranja : 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
              {modDiv ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {!modDiv ? (
        <G cols={tipo === 'detergente' ? 1 : 3} gap={12}>
          {colores.map(c => (
            <button key={c.label} onClick={() => elegirColor(c.label)}
              style={{ padding: tipo === 'detergente' ? '16px 20px' : '16px 8px', borderRadius: 12, border: '3px solid transparent', background: c.hex, color: c.tc, fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
              {c.label}
            </button>
          ))}
        </G>
      ) : (
        <ComboDivisionFracciones colores={colores} tipo={tipo} combo={combo} setCombo={setCombo} divField={divField} field={field} onConfirm={confirmarDiv} />
      )}
    </div>
  );
};

const ComboDivisionFracciones = ({ colores, tipo, combo, setCombo, divField, field, onConfirm }) => {
  const [colorSel, setColorSel] = useState('');
  const divs = combo[divField] || [];
  const totalUsado = divs.reduce((s, d) => s + d.cantidad, 0);
  const resto = 200 - totalUsado;

  const agregar = () => {
    if (!colorSel || resto < 50) return;
    setCombo({ ...combo, [divField]: [...divs, { cantidad: 50, color: colorSel }], [field]: colorSel });
    setColorSel('');
  };

  return (
    <div>
      <div style={{ ...s.card, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Restante: <strong>{resto}lts</strong></span>
          <span>Fracciones: <strong>{divs.length}/4</strong></span>
        </div>
      </div>
      {divs.length < 4 && resto >= 50 && (
        <div style={{ marginBottom: 12 }}>
          <G cols={tipo === 'detergente' ? 1 : 3} gap={10} style={{ marginBottom: 10 }}>
            {colores.map(c => (
              <button key={c.label} onClick={() => setColorSel(c.label)}
                style={{ padding: tipo === 'detergente' ? '12px 16px' : '12px 8px', borderRadius: 10, border: colorSel === c.label ? '3px solid #fff' : '3px solid transparent', background: c.hex, color: c.tc, fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: colorSel === c.label ? '0 0 0 3px rgba(255,255,255,0.4)' : 'none' }}>
                {c.label}
              </button>
            ))}
          </G>
          <button onClick={agregar} disabled={!colorSel} style={{ ...s.btnS, opacity: colorSel ? 1 : 0.45 }}>➕ Agregar fracción 50lts</button>
        </div>
      )}
      {divs.map((d, i) => {
        const ci = colores.find(c => c.label === d.color);
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderRadius: 10, marginBottom: 8, background: ci?.hex || '#e2e8f0', color: ci?.tc || '#1e293b' }}>
            <span style={{ fontWeight: 700 }}>{d.cantidad}lts — {d.color}</span>
            <button onClick={() => setCombo({ ...combo, [divField]: divs.filter((_, j) => j !== i) })} style={{ background: 'rgba(0,0,0,0.15)', color: ci?.tc || '#1e293b', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
          </div>
        );
      })}
      {totalUsado === 200 && <button onClick={onConfirm} style={{ ...s.btnP, marginTop: 10 }}>✓ Confirmar colores</button>}
    </div>
  );
};

const ComboFraganciasYLavandina = ({ combo, setCombo, onConfirm, onBack }) => {
  const [fragSel, setFragSel] = useState('');
  const [cantSel, setCantSel] = useState('');
  const esChico = combo.tamaño === 50;
  const maxLitros = combo.tamaño;
  const litUsados = combo.fragancias_piso.reduce((s, f) => s + f.cantidad, 0);
  const litResto  = maxLitros - litUsados;
  const maxFrag   = esChico ? 1 : 4;
  const opciones  = esChico ? [50] : [50, 100, 200].filter(v => v <= litResto);

  const agregar = () => {
    if (!fragSel || !cantSel) return;
    setCombo({ ...combo, fragancias_piso: [...combo.fragancias_piso, { fragancia: fragSel, cantidad: parseInt(cantSel) }] });
    setFragSel(''); setCantSel('');
  };

  const listo = litResto === 0;

  return (
    <div>
      <BB onClick={onBack} />
      <SH step="Combo · Desodorante + Lavandina" title="Fragancias y opciones" />

      {/* Desodorante */}
      <div style={s.card}>
        <div style={s.cardTitle}>✨ Desodorante de piso</div>
        <div style={{ ...s.card, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>Restante: <strong>{litResto}lts</strong></span>
            <span>Fragancias: <strong>{combo.fragancias_piso.length}/{maxFrag}</strong></span>
          </div>
        </div>
        {combo.fragancias_piso.length < maxFrag && litResto > 0 && (
          <div style={{ marginBottom: 12 }}>
            <G cols={2} gap={8} style={{ marginBottom: 10 }}>
              {FRAGANCIAS.map(f => (
                <button key={f.label} onClick={() => setFragSel(f.label)}
                  style={{ padding: '9px 12px', borderRadius: 10, border: fragSel === f.label ? `2px solid ${C.naranja}` : '1px solid rgba(255,255,255,0.14)', background: fragSel === f.label ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </G>
            <select value={cantSel} onChange={e => setCantSel(e.target.value)} style={{ ...s.inp, marginBottom: 8 }}>
              <option value="">— Cantidad —</option>
              {opciones.map(v => <option key={v} value={v}>{v}lts</option>)}
            </select>
            <button onClick={agregar} disabled={!fragSel || !cantSel} style={{ ...s.btnS, opacity: (!fragSel || !cantSel) ? 0.45 : 1 }}>➕ Agregar</button>
          </div>
        )}
        {combo.fragancias_piso.map((f, i) => {
          const info = FRAGANCIAS.find(x => x.label === f.fragancia);
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 8 }}>
              <span>{info?.icon} {f.fragancia} · {f.cantidad}lts</span>
              <button onClick={() => setCombo({ ...combo, fragancias_piso: combo.fragancias_piso.filter((_, j) => j !== i) })} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Lavandina / Canje */}
      {listo && (
        <div style={s.card}>
          <div style={s.cardTitle}>🧴 Lavandina</div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={combo.canje_lavandina} onChange={e => setCombo({ ...combo, canje_lavandina: e.target.checked })} style={{ width: 18, height: 18, marginTop: 2 }} />
            <span style={{ fontSize: 13, lineHeight: 1.5 }}>
              🔄 <strong>CANJE POR DESODORANTE</strong><br />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {combo.tamaño === 50 ? 'Da crédito por 50lts de desodorante adicional' : 'Da crédito por 200lts de desodorante adicional'}
              </span>
            </span>
          </label>
          {combo.canje_lavandina && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(249,115,22,0.15)', borderRadius: 10, fontSize: 12, fontWeight: 700, color: C.naranja }}>
              ⚠️ La lavandina se reemplaza por desodorante. Se aclarará en los documentos.
            </div>
          )}
        </div>
      )}

      {listo && (
        <button onClick={onConfirm} style={s.btnP}>✓ Agregar combo al carrito</button>
      )}
    </div>
  );
};

// ─── CLIENTE FORM ─────────────────────────────────────────────────────────────

const ClienteForm = ({ cliente, setCliente, zona, onSig, onVolver }) => {
  const valido = cliente.nombre && cliente.telefono && cliente.direccion && cliente.localidad;
  return (
    <div>
      <BB onClick={onVolver} />
      <SH step="Datos del cliente" title="¿A quién le vendés?" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {[{k:'nombre',l:'Nombre completo *',t:'text'},{k:'telefono',l:'Teléfono / WhatsApp *',t:'tel'},{k:'email',l:'Email',t:'email'},{k:'direccion',l:'Dirección de entrega *',t:'text'},{k:'localidad',l:'Localidad *',t:'text'},{k:'cp',l:'Código Postal',t:'text'}].map(f => (
          <div key={f.k}>
            <label style={s.lbl}>{f.l}</label>
            <input type={f.t} value={cliente[f.k]} onChange={e => setCliente({ ...cliente, [f.k]: e.target.value })} style={s.inp} placeholder={f.l.replace(' *','')} />
          </div>
        ))}
        <div>
          <label style={s.lbl}>Observaciones / Notas especiales</label>
          <textarea value={cliente.observaciones} onChange={e => setCliente({ ...cliente, observaciones: e.target.value })} style={{ ...s.inp, minHeight: 80, resize: 'vertical' }} placeholder="Llamar antes, entregar en depósito, etc." />
        </div>
        {cliente.localidad && (
          <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: zona ? 'rgba(34,197,94,0.13)' : 'rgba(239,68,68,0.13)', border: `1px solid ${zona ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {zona ? `📍 ${zona.zona} — envío base: ${fmt(zona.precio)}/bulto` : '⚠️ Localidad no encontrada. Podrás seleccionar la zona en el siguiente paso.'}
          </div>
        )}
      </div>
      <button onClick={onSig} disabled={!valido} style={{ ...s.btnP, opacity: valido ? 1 : 0.45, cursor: valido ? 'pointer' : 'not-allowed' }}>Continuar → Extras y envío</button>
    </div>
  );
};

// ─── EXTRAS Y ENVÍO ───────────────────────────────────────────────────────────

const ExtrasEnvio = ({ extras, setExtras, zona, totalProd, totalEnvases, totalAgr, totalEnvio, totalG, onConfirmar, onVolver }) => {
  const [nomAgr, setNomAgr]   = useState('');
  const [precAgr, setPrecAgr] = useState('');
  const zonaEf = extras.envio || zona;

  return (
    <div>
      <BB onClick={onVolver} />
      <SH step="Extras y envío" title="Completar cotización" />

      <div style={s.card}>
        <div style={s.cardTitle}>🪣 Envases — $4.000 c/u</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setExtras({ ...extras, envases: Math.max(0, extras.envases - 1) })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>−</button>
          <span style={{ fontSize: 26, fontWeight: 900, minWidth: 44, textAlign: 'center' }}>{extras.envases}</span>
          <button onClick={() => setExtras({ ...extras, envases: extras.envases + 1 })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>+</button>
          {extras.envases > 0 && <span style={{ color: C.naranja, fontWeight: 800 }}>{fmt(extras.envases * PRECIO_ENVASE)}</span>}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>➕ Agregado Extra</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          <div><label style={s.lbl}>Descripción</label><input value={nomAgr} onChange={e => setNomAgr(e.target.value)} style={s.inp} placeholder="Ej: Dispenser..." /></div>
          <div><label style={s.lbl}>Importe</label><input type="number" value={precAgr} onChange={e => setPrecAgr(e.target.value)} style={s.inp} placeholder="$0" /></div>
          <button onClick={() => { if (!nomAgr || !precAgr) return; setExtras({ ...extras, agregados: [...extras.agregados, { nombre: nomAgr, precio: parseFloat(precAgr) }] }); setNomAgr(''); setPrecAgr(''); }} disabled={!nomAgr || !precAgr} style={{ ...s.btnS, opacity: (!nomAgr || !precAgr) ? 0.45 : 1 }}>Agregar</button>
        </div>
        {extras.agregados.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 9, marginBottom: 7 }}>
            <span style={{ fontSize: 13 }}>{a.nombre}</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(a.precio)}</span>
              <button onClick={() => setExtras({ ...extras, agregados: extras.agregados.filter((_, j) => j !== i) })} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>🚚 Envío</div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
          <input type="checkbox" checked={extras.esInterior} onChange={e => setExtras({ ...extras, esInterior: e.target.checked })} style={{ width: 18, height: 18, marginTop: 2 }} />
          <span style={{ fontSize: 13 }}>Envío al interior (VIA CARGO / ANDREANI)<br /><span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>El cliente paga al transportista</span></span>
        </label>
        {!extras.esInterior && (
          <>
            {zona ? (
              <div style={{ padding: '11px 14px', background: 'rgba(34,197,94,0.12)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.25)', fontSize: 13, marginBottom: 12 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: zona.color, marginRight: 6 }}></span>
                <strong>{zona.zona}</strong> — {fmt(zona.precio)}/bulto
              </div>
            ) : (
              <>
                <div style={{ padding: '11px 14px', background: 'rgba(239,68,68,0.12)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, marginBottom: 10 }}>⚠️ Seleccioná la zona:</div>
                <G gap={8} style={{ marginBottom: 12 }}>
                  {ZONAS_ENVIO.map(z => (
                    <button key={z.zona} onClick={() => setExtras({ ...extras, envio: z })}
                      style={{ ...s.btnO, background: extras.envio?.zona === z.zona ? 'rgba(249,115,22,0.2)' : undefined, borderColor: extras.envio?.zona === z.zona ? C.naranja : undefined, borderWidth: extras.envio?.zona === z.zona ? 2 : 1 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, display: 'inline-block' }}></span>{z.zona}</span>
                      <span style={{ color: C.naranja, fontWeight: 700 }}>{fmt(z.precio)}/bulto</span>
                    </button>
                  ))}
                </G>
              </>
            )}
            {zonaEf && (
              <div>
                <label style={s.lbl}>Cantidad de bultos</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                  <button onClick={() => setExtras({ ...extras, bultos: Math.max(1, extras.bultos - 1) })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>−</button>
                  <span style={{ fontSize: 26, fontWeight: 900, minWidth: 44, textAlign: 'center' }}>{extras.bultos}</span>
                  <button onClick={() => setExtras({ ...extras, bultos: extras.bultos + 1 })} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 22 }}>+</button>
                  <span style={{ color: C.naranja, fontWeight: 800 }}>{fmt(zonaEf.precio * extras.bultos)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ ...s.card, background: 'rgba(249,115,22,0.11)', border: '1px solid rgba(249,115,22,0.28)', marginBottom: 20 }}>
        <div style={s.cardTitle}>Resumen</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Productos</span><span>{fmt(totalProd)}</span></div>
          {extras.envases > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envases ({extras.envases})</span><span>{fmt(totalEnvases)}</span></div>}
          {extras.agregados.map((a, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>{a.nombre}</span><span>{fmt(a.precio)}</span></div>)}
          {extras.esInterior
            ? <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío interior</span><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>VIA CARGO / ANDREANI</span></div>
            : totalEnvio > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.65)' }}>Envío ({extras.bultos} bulto{extras.bultos !== 1 ? 's' : ''})</span><span>{fmt(totalEnvio)}</span></div>}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 16 }}>TOTAL</span><span style={s.total}>{fmt(totalG)}</span>
          </div>
        </div>
      </div>
      <button onClick={onConfirmar} style={s.btnP}>✓ Confirmar y generar documentos</button>
    </div>
  );
};

// ─── WA COPIABLE ─────────────────────────────────────────────────────────────

const WACopiable = ({ pedido }) => {
  const { numero, fecha, cliente, items, extras, totales, zonaEnvio } = pedido;
  const texto = [
    `🧹 *DOMÉSTICO · Pedido Confirmado*`,
    `📋 *${numero}*`,
    `📅 ${fecha}`,
    ``,
    `👤 *${cliente.nombre}*`,
    `📱 ${cliente.telefono}`,
    `📍 ${cliente.direccion}, ${cliente.localidad}`,
    cliente.observaciones ? `📝 *Obs:* ${cliente.observaciones}` : null,
    ``,
    `━━━━━━━━━━━━━━━━`,
    `🛒 *PRODUCTOS*`,
    `━━━━━━━━━━━━━━━━`,
    ...items.map(i => `• ${i.nombre}${i.cantidad > 1 ? ` ×${i.cantidad}` : ''} — *${fmt(i.precio * i.cantidad)}*${i.descripcion ? `\n  ↳ ${i.descripcion}` : ''}`),
    extras.envases > 0 ? `• Envases (${extras.envases}) — *${fmt(totales.envases)}*` : null,
    ...extras.agregados.map(a => `• ${a.nombre} — *${fmt(a.precio)}*`),
    ``,
    extras.esInterior
      ? `🚚 Envío interior por *VIA CARGO / ANDREANI*\n_(el flete lo abona el cliente al transportista)_`
      : zonaEnvio ? `🚚 Envío ${zonaEnvio.zona} · ${extras.bultos || 1} bulto${(extras.bultos||1)!==1?'s':''} — *${fmt(totales.envio)}*` : null,
    ``,
    `━━━━━━━━━━━━━━━━`,
    `💰 *TOTAL: ${fmt(totales.total)}*`,
    `━━━━━━━━━━━━━━━━`,
    ``,
    `_Doméstico · Química de Limpieza · Moreno, Bs. As._`,
  ].filter(l => l !== null).join('\n');

  return (
    <div style={{ ...s.card, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', marginBottom: 14 }}>
      <div style={s.cardTitle}>💬 Resumen para WhatsApp</div>
      <pre style={{ fontFamily: '"Segoe UI",sans-serif', fontSize: 12, whiteSpace: 'pre-wrap', color: '#fff', lineHeight: 1.6, margin: '0 0 12px' }}>{texto}</pre>
      <button onClick={() => navigator.clipboard.writeText(texto).then(() => alert('✓ Copiado'))} style={{ ...s.btnP, background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>📋 Copiar para WhatsApp</button>
    </div>
  );
};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

const App = () => {
  const [etapa, setEtapa] = useState('pre');

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.hInner}>
          <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-0.5px' }}>🧹 Doméstico</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.5px', background: etapa === 'pre' ? 'rgba(255,255,255,0.15)' : C.naranja, color: '#fff' }}>
              {etapa === 'pre' ? 'PRE-COTIZACIÓN' : 'PEDIDO DEFINITIVO'}
            </div>
            <div style={{ background: C.naranja, color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.5px' }}>15% OFF</div>
          </div>
        </div>
      </div>
      <div style={s.wrap}>
        {etapa === 'pre'
          ? <PreCotizacion onIrAPedido={() => setEtapa('pedido')} />
          : <PedidoDefinitivo onVolver={() => setEtapa('pre')} />}
      </div>
    </div>
  );
};

export default App;
