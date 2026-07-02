# poemario vivo — guía completa
## desde cero hasta publicado en internet

---

## lo que vas a construir

Una página web colaborativa donde cualquier persona puede arrastrar palabras
en español para armar poemas, en tiempo real. Los cambios persisten para todos
los visitantes nuevos. Sin frameworks, sin base de datos propia — solo HTML,
un servidor PartyKit (~30 líneas), y Netlify para el frontend.

**Stack:**
- Frontend: HTML + CSS + JS vanilla (un solo archivo)
- Backend: PartyKit (WebSockets + storage persistente)
- Deploy frontend: Netlify (gratis)
- Deploy backend: PartyKit Cloud (gratis)

---

## requisitos previos

Instala esto antes de empezar:

| herramienta | para qué | link |
|-------------|----------|------|
| Node.js 18+ | correr PartyKit | nodejs.org |
| VS Code | editor | code.visualstudio.com |
| Git | control de versiones | git-scm.com |
| cuenta GitHub | repositorio | github.com |
| cuenta Netlify | deploy del frontend | netlify.com |
| cuenta PartyKit | deploy del backend | partykit.dev |

---

## parte 1 — configurar el proyecto localmente

### paso 1: abrir la carpeta en VS Code

Tienes la carpeta `poemario-vivo/` con estos archivos:

```
poemario-vivo/
├── index.html          ← frontend (el poemario)
├── src/
│   └── server.ts       ← servidor PartyKit (persistencia + tiempo real)
├── partykit.json       ← configuración del servidor
├── package.json        ← dependencias
└── .gitignore
```

En VS Code: `Archivo → Abrir carpeta` → selecciona `poemario-vivo/`

### paso 2: instalar dependencias

Abre la terminal en VS Code (`Ctrl+ñ` o `View → Terminal`) y ejecuta:

```bash
npm install
```

Esto instala `partykit` y `partysocket` en `node_modules/`.

### paso 3: levantar el servidor en local

```bash
npx partykit dev
```

Deberías ver algo así:

```
🎈 PartyKit dev server running at:
  http://localhost:1999
```

### paso 4: abrir el poemario en el browser

Abre `index.html` directamente en el browser — pero para que PartyKit
funcione en local, necesitas servirlo con un servidor simple.

En una **segunda terminal** en VS Code:

```bash
npx serve . --port 3000
```

Luego abre: http://localhost:3000

Deberías ver las palabras en el poemario. Si abres la misma URL en dos
pestañas, mover una palabra en una pestaña la mueve en la otra.

---

## parte 2 — hacer deploy del backend (PartyKit)

### paso 5: crear cuenta en PartyKit

1. Ve a https://partykit.dev y crea una cuenta (gratis)
2. Recuerda tu nombre de usuario — lo necesitas en el siguiente paso

### paso 6: hacer login desde la terminal

```bash
npx partykit login
```

Se abre el browser para autenticar. Acepta y vuelve a la terminal.

### paso 7: hacer deploy del servidor

```bash
npx partykit deploy
```

Al terminar, verás algo así:

```
✓ Deployed poemario-vivo to:
  https://poemario-vivo.TU_USUARIO.partykit.dev
```

Guarda esa URL — la necesitas en el siguiente paso.

---

## parte 3 — conectar el frontend a tu servidor

### paso 8: actualizar el HOST en index.html

Abre `index.html` en VS Code. Busca esta línea (está en el `<script>`):

```javascript
const PARTYKIT_HOST = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "localhost:1999"
  : "TU_USUARIO-poemario-vivo.TU_USUARIO.partykit.dev";
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de PartyKit. Ejemplo:

```javascript
  : "alexander-poemario-vivo.alexander.partykit.dev";
```

Guarda el archivo (`Ctrl+S`).

---

## parte 4 — publicar el frontend en Netlify

### paso 9: subir el proyecto a GitHub

En la terminal de VS Code:

```bash
git init
git add .
git commit -m "poemario vivo v1"
```

Luego crea un repositorio en https://github.com/new (nombre: `poemario-vivo`)
y sigue las instrucciones que te muestra GitHub para conectarlo:

```bash
git remote add origin https://github.com/TU_USUARIO_GITHUB/poemario-vivo.git
git branch -M main
git push -u origin main
```

### paso 10: conectar Netlify con GitHub

1. Ve a https://app.netlify.com → `Add new site → Import an existing project`
2. Elige `GitHub` y autoriza Netlify
3. Selecciona el repo `poemario-vivo`
4. En la configuración del deploy:
   - **Build command:** (dejar vacío)
   - **Publish directory:** `.` (un punto)
5. Click en `Deploy site`

Netlify le asigna una URL automática tipo:
`https://nombre-aleatorio.netlify.app`

### paso 11: cambiar el dominio (opcional pero recomendado)

En Netlify: `Site configuration → Domain management → Options → Edit site name`

Pudes ponerle algo como `poemario-vivo` para obtener:
188:`https://poemario-vivo.netlify.app`

---

## parte 5 — probar que todo funciona

### paso 12: verificar la persistencia

1. Abre `https://tu-sitio.netlify.app` en tu browser
2. Mueve algunas palabras
3. Cierra la pestaña completamente
4. Vuelve a abrir la misma URL
5. Las palabras deberían estar exactamente donde las dejaste ✓

6. Abre la misma URL en otro dispositivo (celular, otro computador)
7. Mueve una palabra — deberías verlo moverse en el otro dispositivo también ✓

---

## parte 6 — darlo a conocer

### canales donde este proyecto encaja bien

**Comunidades técnico-creativas:**
- Are.na (arena.io) — comparte el link en un channel de arte digital o web experiments
- Mastodon / Fediverse — etiquetas útiles: #indieweb #smallweb #creativecoding
- Hacker News — "Show HN: poemario vivo, fridge poetry collab en español"
- Product Hunt — lánzalo como proyecto el día que esté pulido

**Comunidades en español:**
- Twitter/X con los hashtags #WebCreativa #IndieWeb #PoesíaDigital
- Discord de comunidades de desarrollo hispanohablante (ManzDev, etc.)
- Reddit: r/argentina, r/chile, r/es — con un post explicando la idea

**Approach de Spencer Chang (el creador del original):**
- Comparte el link con un poema que armaste tú mismo como primera demostración
- Invita a personas específicas a dejar algo — la primera actividad en el poemario
  importa mucho para que no parezca una pantalla vacía

### idea de lanzamiento

Comparte algo así:
> "armé un poemario de poesía colaborativa para internet en español 🧲
> cualquiera puede arrastrar palabras y dejar algo para los que lleguen después
> → [link]"

Incluye un screenshot o GIF corto mostrando el drag — visualmente es muy atractivo.
Para hacer el GIF: usa Giphy Capture (Mac) o ScreenToGif (Windows).

---

## parte 7 — personalizar (opcional)

### cambiar las palabras iniciales

En `index.html`, encuentra el array `PALABRAS_DEFAULT` y edítalo libremente.

Para resetear el estado del servidor (borrar palabras y empezar desde cero):
cambia el nombre del room en `const ROOM = "poemario-vivo-principal"` a otro nombre,
por ejemplo `"poemario-vivo-v2"`.

### agregar dominio propio

Si tienes un dominio (.cl, .com, etc.) puedes conectarlo en Netlify:
`Site configuration → Domain management → Add custom domain`

### CORS (si ves errores de conexión)

Agrega esto a `partykit.json` si el browser bloquea la conexión:

```json
{
  "name": "poemario-vivo",
  "main": "src/server.ts",
  "compatibilityDate": "2024-01-01",
  "parties": {
    "main": { "origin": "*" }
  }
}
```

---

## resumen de comandos

```bash
npm install           # instalar dependencias (solo la primera vez)
npx partykit dev      # servidor local en localhost:1999
npx serve . -p 3000   # frontend local en localhost:3000
npx partykit deploy   # publicar servidor a PartyKit Cloud
```

---

## estructura final del proyecto

```
poemario-vivo/
├── index.html          ← el poemario (frontend completo en un archivo)
├── src/
│   └── server.ts       ← lógica del servidor (persistencia + broadcast)
├── partykit.json       ← config PartyKit
├── package.json        ← dependencias
├── package-lock.json   ← generado por npm
├── node_modules/       ← ignorado por git
└── .gitignore
```

---

*ante cualquier duda: la documentación de PartyKit está en docs.partykit.dev
y el repo original de playhtml en github.com/spencerc99/playhtml*
