# CHRISTMAS FEUD — THE ULTIMATE CHRISTMAS GAME SHOW

A production-ready, online multiplayer, real-time 3D React + Three.js Christmas television game show covering **all aspects of Christmas** across **15 official categories**.

## Highlights
- **3 Complete All-Christmas Editions:**
  - **Classic:** 70 unique survey rounds (all 15 categories, 8 ranked answers, exact 100 points)
  - **Deluxe:** 100 unique survey rounds
  - **Ultimate:** 150 unique survey rounds
- **15 Official Categories:** Christmas Traditions, Christmas Gifts, Christmas Movies, Christmas Music, Christmas Decorations, Santa Claus and the North Pole, Christmas Activities, Christmas Family and Friends, Winter and Snow, Christmas Travel, Christmas Parties, Christmas Food and Drinks, Christmas Shopping, Christmas Characters and Stories, and Funny Christmas Situations.
- **Main Two-Team FEUD Gameplay:** Editable team & captain names, 3D-flipping 8-answer board (zero answer keys exposed), Reveal Answer, Reveal All, Hide Answers, Reset Round, Round Points bank, Send to Team A/B with confirmation & duplicate-transfer protection, Custom Points, Transaction History & Undo, Three-Strike handling, and Live Player Buzz-In.
- **Private Manual-Scoring Fast Money:** Zero live answer reveals and zero automatic answer matching. Live Fast Money handles questions, private locked Player 1 & Player 2 submissions (Player 1's answers remain strictly hidden from Player 2), synchronized timers (5–30s presets, +5s, +10s, Pause, Resume, Reset, Skip Question), and Host Manual Scoring + Manual Bonus Points.
- **Separate Administrator-Only PDF Answer Keys:** Dynamically generated from the current saved banks:
  - `CHRISTMAS FEUD CLASSIC – 70 ROUND ANSWER KEY.pdf`
  - `CHRISTMAS FEUD DELUXE – 100 ROUND ANSWER KEY.pdf`
  - `CHRISTMAS FEUD ULTIMATE – 150 ROUND ANSWER KEY.pdf`
  - `CHRISTMAS FEUD FAST MONEY ANSWER KEY.pdf`
- **4-Role Backend Access Control:** Administrator (`admin`), Co-Host (`host`), Player (`player`), and Audience TV (`audience`).
- **Broadcast-Grade Three.js 3D Stage & Responsive UI:** Deep Emerald Green, Burgundy Red, Dark Navy, Champagne Gold, and Warm Ivory across 16:9 Desktop/TV, Tablet, and Mobile layouts.

*Note: All sample survey point values are illustrative game-show entertainment data, not verified statistical survey research.*

## Quick Start
```bash
npm install
npm run build
npm start
# Open http://localhost:3000
```

For hot-reload React development (with backend running on `:3000`):
```bash
npm run dev
# Open http://localhost:5173
```

## Run Full QA, Privacy & PDF Audit Suite
```bash
npm test
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for cloud hosting (Render, Vercel, Railway, Fly.io, Docker) and local Wi-Fi setup.
