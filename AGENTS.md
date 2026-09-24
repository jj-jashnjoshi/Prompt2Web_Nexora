# NexKitchen — Project Context

Context for any agent or teammate joining this project. Read fully before changing code.

## Competition

- College-level **web development vibe-coding competition**. AI tools allowed; libraries/templates allowed.
- **Everything must be built within the 1-hour window** (no pre-built code).
- Judges review everything. **A surprise feature will be announced mid-competition** — code must stay modular so it can be added in ~10 min.
- Team of 3. All know React and Firebase. Almost all frontend is built on one laptop; **a teammate owns the backend** (details TBD).

## Problem chosen: Smart Campus Canteen

> Students waste time standing in queues during breaks, especially when they only want to buy a few items. Build a website that makes the campus canteen experience faster and easier.

Other problem options (not chosen): Lost & Found, Event Hub, Skill Exchange, Competition Portal.

## Core insight

The queue exists because one counter does ordering + paying + collecting, and everyone arrives in the same 5 minutes of break. Pre-ordering removes the ordering/paying queue.

## Standout feature (the one we build): Rush-aware menu

Every menu item shows a **live ETA based on how busy its kitchen station is right now**, not a fixed prep time.

- Each item belongs to a `station` (e.g. tawa, fryer, counter, beverages) and has `prepMins`.
- `stationLoad = sum(prepMins × qty of pending items at that station) / cooks at that station`
- `itemETA = stationLoad + item.prepMins`
- Items at idle stations get a **"Ready now"** tag.
- If `itemETA > minutes left in break`, the cart shows a **swap suggestion**: "Masala Dosa ~14 min (break ends in 10). Veg Sandwich ready in 2 — Swap?"
- Pitch: other apps *show* the queue; ours *reduces* it by redirecting demand away from the jammed station (like Maps rerouting traffic).

Considered but **dropped** for time: bell-synced cooking (kitchen cooks backwards from pickup time + batches identical items). Can be a stretch goal.

## Decisions

| Topic | Decision |
|---|---|
| Design | **Mobile-first, bold retro fast-food brand** — reference board in `img/`. Cream ground `#f6efdc`, chocolate brown ink `#4a1c13`, red `#e4032e` (CTAs, late), amber `#ffa200` (ready), blue `#0a57a6` (info). Fredoka (display/numbers) + Outfit (body). Big rounded colour blocks, wavy squiggle pattern (`Squiggle`). No emoji, glassmorphism or generic AI-template look. Tailwind `neutral-*` and `white` are remapped to the brown/cream scale in `src/index.css`. |
| Stack | React + Vite + Tailwind v4 + react-router-dom |
| Data | All data access goes through `src/data.js` — a **temporary localStorage backend** (cross-tab sync, key `nexkitchen:v2`) so the demo works offline. It starts with a **default demo queue** (`src/seed.js`: a lunch rush in progress + one past order of yours) and an **auto kitchen** (`src/kitchenSim.js`) that cooks orders one at a time per station (1 prep-minute = 5 real seconds), auto-collects campus orders, spawns new ones every 12–25s, and restarts the break when the bell rings. Toggle it on `/kitchen`. Firebase to replace `data.js` internals later; schema **still to be agreed**. |
| App name | **NexKitchen** (`APP_NAME` in `src/config.js`; wordmark in `components/Logo.jsx`) |
| Repo | https://github.com/jj-jashnjoshi/Prompt2Web_Nexora (local: `~/canteen`) |

## Screens

4 student pages, always reachable from a floating pill tab bar (Home · Menu · Cart · Orders). No login — student types their name once at checkout. Judges weigh **creativity** most, so pages lean on the brand: colour-block cards, scalloped Cloud badges, food illustrations, marquee bands, playful motion.

- `/` — Home: red hero, "Start my order", live "ready now" marquee, rush meter, how-it-works cards
- `/menu` — Menu: live "ready now" marquee, "Your usual" reorder, rush meter, sticky category tabs, 2-col colour cards (red meals / amber snacks / blue drinks) sorted fastest-first with READY NOW cloud stickers
- `/cart` — Your tray: ready-in vs bell card, amber swap card per late item, name + Pay bar → red Paid screen with cloud token → `/orders`
- `/orders` — Your orders: blue card with cloud token + live progress; turns amber with an "It's ready" marquee when ready (red dot on tab); past orders with "Again"
- `/kitchen` — Hidden staff/demo view (not linked): advance order status, toggle out-of-stock, demo controls (simulate rush, set break time left)

## Demo script (~90s)

1. "It's the 1:10 break. Normal queue: 40 students, 12 min."
2. Kitchen tab: simulate a rush on the tawa station.
3. Student tab: dosa ETA jumps to ~14 min; sandwich shows "Ready now".
4. Add dosa → cart warns it won't be ready before the bell → tap Swap.
5. Enter name, Pay → token on Orders → kitchen marks Ready → token card turns amber and the Orders tab shows a dot.

## Likely judge questions

- **No-shows?** Paid upfront; held 10 min then moved to a late shelf.
- **Fake orders?** College email login + payment before token.
- **Cash users?** Counter still exists; staff can enter orders.
- **Owner benefit?** Predictable demand, less waste, sell-out data.

## Rules for agents

- Keep files small and separated so the surprise feature can be added fast.
- Never call storage directly from components — use `src/data.js`.
- Stay within the brand palette and fonts above; don't introduce new colours.

## Code map

- `src/config.js` — app name, stations (cooks per station), default break length, "ready now" threshold
- `src/menu.js` — seed menu items (`station`, `prepMins`, `category`)
- `src/data.js` — the only data layer (localStorage + BroadcastChannel sync, 2s auto-kitchen heartbeat with a cross-tab lock). Replace internals with Firebase here.
- `src/seed.js` — default demo queue + `makeOrder`/`line` helpers
- `src/kitchenSim.js` — `kitchenStep(state, now)`: pure auto-kitchen step (easy to unit test)
- `src/eta.js` — rush-aware logic: `stationLoads`, `itemEta`, `suggestSwap`
- `src/useStore.js` — React hook exposing state + derived `loads`, `minsLeft`, `cartCount`
- `src/pages/` — `Home`, `Menu`, `Cart`, `Orders`, `Kitchen`
- `src/components/` — `Header`, `Qty`, `KitchenPulse` (live per-station wait strip), `Layout` (header + tab bar shell), `TabBar`, `Squiggle` (brand pattern), `Cloud` (scalloped badge), `FoodIcon` (SVG food art per item id), `Marquee`, `Logo`

Run: `npm run dev` → student app at `/`, staff at `/kitchen`. (open in two tabs).
