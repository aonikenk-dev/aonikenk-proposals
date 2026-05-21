# aonikenk-proposals

Client proposals & budgets for [aonikenk.dev](https://aonikenk.dev).  
Built with **Astro** · **SCSS** · **JSON data files**.

> ⚠️ This repo is **always private**. Never make it public — it contains client pricing and commercial data.

---

## Stack

| Tool | Purpose |
|------|---------|
| [Astro](https://astro.build) | Static site, routing, components |
| Sass/SCSS | Brand styling with tokens + print variant |
| `src/data/*.json` | All proposal content (client, pricing, modules) |

---

## Project structure

```
aonikenk-proposals/
├── public/                         # Static assets (logos, images)
├── src/
│   ├── components/
│   │   ├── Isotipo.astro           # SVG logo mark (shared)
│   │   ├── ProposalNav.astro       # Top nav with print button
│   │   ├── ProposalCover.astro     # Full-screen cover page
│   │   ├── ProposalModule.astro    # Service module + table
│   │   ├── ProposalTotals.astro    # Summary + discount + total
│   │   ├── ProposalConditions.astro# Commercial conditions table
│   │   ├── ProposalSignatures.astro# Provider + client signature blocks
│   │   └── ProposalFooter.astro    # Footer lockup (isotipo + tagline + slogan)
│   ├── data/
│   │   └── *.json                  # ← One JSON file per proposal
│   ├── layouts/
│   │   └── ProposalLayout.astro    # HTML shell: <head>, cursor, scripts
│   ├── pages/
│   │   ├── index.astro             # Redirects to latest proposal
│   │   └── proposals/
│   │       └── af-servicios-mineros.astro  # One .astro file per proposal
│   ├── scripts/
│   │   ├── cursor.js               # Custom cursor
│   │   └── reveal.js               # Scroll reveal
│   └── styles/
│       ├── main.scss               # Entry point
│       ├── _tokens.scss            # Brand colors, fonts (dark + light variants)
│       ├── _animations.scss        # @keyframes
│       ├── _global.scss            # Base, layout, buttons
│       ├── _components.scss        # All proposal-specific components
│       └── _print.scss             # on-light print variant (#F0F4F8)
└── astro.config.mjs
```

---

## Creating a new proposal

### 1. Duplicate the data file
```bash
cp src/data/af-servicios-mineros_marketing-proposal.json \
   src/data/new-client_project-name.json
```

### 2. Edit the JSON
Update all fields: `meta`, `provider`, `client`, `intro`, `modules`, `totals`, `conditions`.  
The template components read everything from this file — no HTML to touch.

### 3. Create the page
```bash
cp src/pages/proposals/af-servicios-mineros.astro \
   src/pages/proposals/new-client.astro
```

In the new file, change **one line** — the data import:
```js
// Before:
import data from '../../data/af-servicios-mineros_marketing-proposal.json';

// After:
import data from '../../data/new-client_project-name.json';
```

### 4. Deploy
```bash
git add .
git commit -m "feat: add new-client project-name proposal"
git push
```
Vercel deploys automatically. The URL will be:
```
aonikenk.dev/proposals/new-client
```

---

## JSON structure

```json
{
  "meta":       { "ref", "date", "validity", "lang" },
  "provider":   { "name", "tld", "tagline", "slogan", "email", "location" },
  "client":     { "name", "location" },
  "intro":      "string",
  "modules": [
    {
      "id", "num", "title", "desc", "table_title",
      "items": [{ "name", "desc", "qty", "price" }],
      "subtotal_label", "subtotal_value",
      "note"  // optional
    }
  ],
  "totals": {
    "subtotal":  { "label", "value" },
    "discount":  { "label", "value" },
    "total":     { "label", "value" },
    "notes":     ["string"]
  },
  "conditions": [{ "key", "value" }]
}
```

In the future, the JSON import can be replaced by a `fetch()` call to an API or database with minimal refactoring.

---

## Print / PDF

Click **Imprimir / PDF** in the nav, or `Ctrl+P` / `Cmd+P`.

Print uses the brand **on-light variant** (`#F0F4F8` background), matching the manual's light lockup:
- Light background, dark text
- Sienna accents
- Table headers: dark bg / light text
- Total row: dark bg / light text for maximum contrast
- All brand colors forced via `print-color-adjust: exact`

---


---

## Access protection (SSR + login)

All `/proposals/*` routes are protected by a server-side login page.

### How it works

1. User visits `/proposals/af-servicios-mineros`
2. Middleware (`src/middleware.ts`) checks for a valid `httpOnly` cookie — server-side only, never exposed to the browser
3. If no valid cookie → redirect to `/login?redirect=/proposals/af-servicios-mineros`
4. User enters the access code → POST to server → validated against env var
5. If correct → cookie set, redirect to proposal
6. Cookie lasts **7 days** — client doesn't need to re-enter on every visit

### Setting access codes

Codes live in **environment variables only** — never in the code.

```bash
# .env (local dev)
PROPOSAL_CODE_DEFAULT=any-fallback-code
PROPOSAL_CODE_AF_SERVICIOS_MINEROS=the-code-for-this-client
```

**In Vercel:**
Project Settings → Environment Variables → add each key.

**Naming convention:**
```
/proposals/af-servicios-mineros  →  PROPOSAL_CODE_AF_SERVICIOS_MINEROS
/proposals/new-client            →  PROPOSAL_CODE_NEW_CLIENT
```
Slug → uppercase → hyphens become underscores.

### Sharing with a client

Just send them the URL + the code separately (e.g. by WhatsApp or email):
```
URL:    https://aonikenk.dev/proposals/af-servicios-mineros
Código: [the code you set in the env var]
```

### Adding a new proposal (full checklist)

```bash
# 1. Create data
cp src/data/af-servicios-mineros_marketing-proposal.json \
   src/data/new-client_project.json
# edit the JSON...

# 2. Create page
cp src/pages/proposals/af-servicios-mineros.astro \
   src/pages/proposals/new-client.astro
# change the import line to point to the new JSON

# 3. Add env var in Vercel
# PROPOSAL_CODE_NEW_CLIENT=the-access-code

# 4. Deploy
git add .
git commit -m "feat: add new-client proposal"
git push
```

## Dev & build

```bash
npm install
npm run dev      # localhost:4321
npm run build    # output → dist/
npm run preview  # preview the build
```

---

## Deploy (Vercel)

1. Push to `aonikenk-dev/aonikenk-proposals` (private repo)
2. Vercel auto-detects Astro
3. Set domain/subpath in Vercel settings

Recommended URL structure:
```
aonikenk.dev/proposals/[client-name]
```
Configure via `vercel.json` rewrite in `aonikenk-site` (see deploy-guide.md).

---

## Related repos

| Repo | Purpose |
|------|---------|
| `aonikenk-site`  | Main website & portfolio |
| `aonikenk-brand` | Brand system & identity assets |
| `aonikenk-ui`    | UI component library |
