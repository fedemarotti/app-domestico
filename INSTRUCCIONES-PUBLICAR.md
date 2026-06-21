# Instrucciones para publicar la App Doméstico

## Paso 1 — Crear cuenta en Supabase (base de datos)

1. Andá a **https://supabase.com** y hacé clic en **"Start your project"**
2. Iniciá sesión con `infodomesticocentral@gmail.com`
3. Hacé clic en **"New project"**
   - Organization: la que aparece por defecto
   - Project name: `domestico-app`
   - Database Password: elegí una contraseña segura y **guardala**
   - Region: **South America (São Paulo)**
4. Esperá ~2 minutos a que se cree el proyecto

---

## Paso 2 — Crear las tablas en Supabase

1. En el menú izquierdo hacé clic en **"SQL Editor"**
2. Pegá y ejecutá este código:

```sql
-- Tabla de pedidos
CREATE TABLE pedidos (
  codigo TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  ts BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- Tabla de clientes
CREATE TABLE clientes (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- Permisos para usuarios autenticados
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver pedidos" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden ver clientes" ON clientes
  FOR ALL USING (auth.role() = 'authenticated');
```

3. Hacé clic en **"Run"**

---

## Paso 3 — Obtener las claves de conexión

1. En el menú izquierdo andá a **"Project Settings"** → **"API"**
2. Copiá:
   - **Project URL** (algo como `https://xxxxxx.supabase.co`)
   - **anon / public key** (la clave larga que empieza con `eyJ...`)

3. Abrí el archivo `app-domestico.html` con un editor de texto
4. Buscá estas líneas cerca del principio:
   ```
   window.__SUPA_URL__ = 'TU_URL_DE_SUPABASE';
   window.__SUPA_KEY__ = 'TU_CLAVE_ANON_DE_SUPABASE';
   ```
5. Reemplazalas con tus valores reales, por ejemplo:
   ```
   window.__SUPA_URL__ = 'https://abcdefghij.supabase.co';
   window.__SUPA_KEY__ = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

---

## Paso 4 — Crear los 3 usuarios

1. En Supabase, andá a **"Authentication"** → **"Users"**
2. Hacé clic en **"Add user"** → **"Create new user"**
3. Completá:
   - Email: el correo de cada usuario (ej: `fede@domestico.com`, `vendedor@domestico.com`, `planta@domestico.com`)
   - Password: contraseña segura para cada uno
4. Para **suspender** un usuario: hacé clic en el usuario → **"Ban user"**

---

## Paso 5 — Publicar en Vercel

1. Andá a **https://github.com** e iniciá sesión
2. Creá un repositorio nuevo llamado `domestico-app` (privado)
3. Subí el archivo `app-domestico.html` al repositorio

4. Andá a **https://vercel.com** e iniciá sesión
5. Hacé clic en **"Add New Project"**
6. Seleccioná el repositorio `domestico-app` de GitHub
7. En la pantalla de configuración:
   - Framework Preset: **Other**
   - Root Directory: dejalo vacío
8. Hacé clic en **"Deploy"**

¡Listo! En 2 minutos tenés la URL pública (ej: `domestico-app.vercel.app`)

---

## Cada vez que actualices la app

1. Subí el nuevo `app-domestico.html` al repositorio de GitHub
2. Vercel lo republica automáticamente en segundos

---

## Soporte

Si algo no funciona, avisale a Claude con el mensaje de error exacto.
