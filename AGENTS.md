# App Doméstico — Instrucciones para Claude

## ¿Qué es este proyecto?
App web de ventas de pastas concentradas para la empresa **Doméstico** (Química de Limpieza).
Permite crear Pre-Cotizaciones (PRE) y Pedidos Definitivos (DEF) con generación automática de PDF/imagen para WhatsApp.

## Stack técnico
- **Frontend:** React 18.2.0 + Babel, single HTML file (`app-domestico.html`)
- **Backend:** Supabase (base de datos PostgreSQL en la nube)
- **Hosting:** Vercel (deploy automático desde GitHub)
- **Repo GitHub:** https://github.com/fedemarotti/app-domestico (rama `main`)
- **Vercel project ID:** `prj_BZTKDdl7mjLwlGJj7xHQtYNU0Xeb` (team: `marottifede-7399s-projects`)

## Credenciales Supabase
- **URL:** `https://okzkgtocotlfzpbucimq.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9remtndG9jb3RsZnpwYnVjaW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMDkzMjEsImV4cCI6MjA5Njg4NTMyMX0.oPuZTscGKuecXRa4Nz3Ly5d0aTueJsTCNeA4bc7QibE`
- **Email cuenta:** `infodomesticocentral@gmail.com`
- **Tablas:** `pedidos` (columnas: `codigo TEXT PK`, `data JSONB`, `ts BIGINT`) y `clientes` (columnas: `id TEXT PK`, `data JSONB`, `updated_at BIGINT`)

## Flujo de trabajo para hacer cambios
1. Editar `app-domestico.html` en esta carpeta
2. Hacer `git add`, `git commit`, `git push` desde Terminal
3. Vercel detecta el push y redeploya automáticamente en segundos
4. **IMPORTANTE:** Si hay un `.git/HEAD.lock`, borrarlo con: `rm "/Users/federicomarotti/Claude/Projects/App  Venta de Pastas/.git/HEAD.lock"`

## Usuarios de la app
- **Fede** (admin/vendedor principal)
- **Otro vendedor** (usuario secundario)
- Login vía Supabase Auth (email + password)

## Arquitectura del código
- `loadLS(codigo)` es **async** — siempre usar con `await` o `.then()`
- `saveLS(codigo, data)` es **async** — siempre usar con `await`
- El componente `PreCotizacion` recibe prop `preloaded` con datos de Supabase
- El flujo principal: `inicio → pre_cotizacion → pre_cargado_{codigo} → def → fin`
- Los estados globales se manejan con `useState` + `useEffect` en el componente `App`

## Para reparar la app
Si algo no funciona, Claude puede:
1. Leer `app-domestico.html` con las tools de archivo
2. Identificar el bug
3. Editar el archivo
4. Pedirle a Fede que ejecute `git add -A && git commit -m "fix: ..." && git push` en Terminal
5. Verificar el deploy en Vercel vía MCP

## Contacto del usuario
- **Nombre:** Fede (Federico Marotti)
- **Email:** marottifede@gmail.com
