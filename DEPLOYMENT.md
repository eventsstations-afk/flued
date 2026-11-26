# CHRISTMAS FEUD — Production Hosting & Multiplayer Deployment Guide

## Architecture & Security Summary
- **Unified React 19 + Vite + Three.js Frontend (`src/` → `dist/`):** Built with `npm run build` and served directly by the Node.js backend.
- **Authoritative Node.js Backend (`server/server.js` + `api/index.js`):** Serves the production `dist/` bundle and enforces 4-role RBAC (`admin`, `host`, `player`, `audience`).
- **Private All-Christmas Question Banks (`server/data/`) & Administrator-Only PDF Generator (`server/pdfGenerator.js`):** Reside strictly on the server and are never bundled into client JavaScript or sent to Players/Audience screens.
- **Live Fast Money Privacy:** Zero live answer reveals and zero automatic answer matching. Answer keys live exclusively in the Administrator Studio Editor and downloadable Administrator-Only Answer-Key PDFs.
- **Safe Persistence & Migration:** Active rooms, scores, and custom studio banks persist atomically to `server/runtime-data/rooms.json` (or `/tmp` on serverless platforms) with automatic v1→v2 schema migration.

## Option 1: One-Click Cloud Hosting (Render — Recommended for Live Multiplayer)
1. Push this repository to GitHub.
2. Create a Blueprint (uses `render.yaml`) or Web Service on [render.com](https://render.com) with Build Command `npm install && npm run build`, Start Command `node server/server.js`, and Health Check `/api/health`.
3. Open your live HTTPS URL → click **PLAY GAME** → open **ONLINE** to share:
   - **Player Join Link:** `https://your-url/?room=CODE&role=player`
   - **Audience TV Link:** `https://your-url/?room=CODE&role=audience`
   - **Co-Host PIN / Admin PIN:** Available in the Online Room modal & Studio Settings.

## Option 2: Vercel
1. Import the GitHub repository on [vercel.com](https://vercel.com) (auto-configured via `vercel.json`).
2. Vercel runs `npm install` + `npm run build`, serves `dist/`, and routes `/api/*` to `api/index.js`.

## Option 3: Docker / Railway / Fly.io
```bash
docker build -t christmas-feud .
docker run -p 3000:3000 -v cff_data:/app/server/runtime-data christmas-feud
```

## Option 4: Local Party Wi-Fi (Windows / Mac / Linux)
1. Run `npm install && npm run build && npm start` (or double-click `start-christmas-feud.bat` on Windows).
2. Open `http://localhost:3000` on the Host screen.
3. Share `http://<YOUR-LOCAL-IP>:3000/?room=CODE&role=player` with phones/tablets on the same Wi-Fi.
