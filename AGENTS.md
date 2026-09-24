# Canteen — Project Context

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
| Design | **Extremely clean, minimal, mobile-first.** White bg, black text, one accent. No gradients, glassmorphism, emoji icons, or generic "Welcome 🚀" heroes. Must not look AI-generated. |
| Stack | React + Vite + Tailwind v4 + react-router-dom |
| Data | All data access goes through `src/data.js`. Runs on `localStorage` (+ cross-tab sync) now so the demo works offline; Firebase to be plugged in later by the backend teammate. Schema/contract **still to be agreed**. |
| App name | Placeholder "Canteen" in `src/config.js` — final name TBD |
| Repo | https://github.com/jj-jashnjoshi/Prompt2Web_Nexora (local: `~/canteen`) |

## Screens

- `/` — Menu (student, mobile): items with live ETA, "Ready now" tags, add to cart
- `/cart` — Cart with swap suggestions, place order
- `/order/:id` — Token + live status (Placed → Preparing → Ready → Collected)
- `/kitchen` — Staff view: advance order status, toggle out-of-stock, demo controls (simulate rush, set break time left)

## Demo script (~90s)

1. "It's the 1:10 break. Normal queue: 40 students, 12 min."
2. Kitchen tab: simulate a rush on the tawa station.
3. Student tab: dosa ETA jumps to ~14 min; sandwich shows "Ready now".
4. Add dosa → cart warns it won't be ready before the bell → tap Swap.
5. Place order → token → kitchen marks Ready → student screen updates live.

## Likely judge questions

- **No-shows?** Paid upfront; held 10 min then moved to a late shelf.
- **Fake orders?** College email login + payment before token.
- **Cash users?** Counter still exists; staff can enter orders.
- **Owner benefit?** Predictable demand, less waste, sell-out data.

## Rules for agents

- Keep files small and separated so the surprise feature can be added fast.
- Never call storage directly from components — use `src/data.js`.
- Keep the visual language minimal; don't add colors, shadows, or decorative UI.

## Code map

- `src/config.js` — app name, stations (cooks per station), default break length, "ready now" threshold
- `src/menu.js` — seed menu items (`station`, `prepMins`, `category`)
- `src/data.js` — the only data layer (localStorage + BroadcastChannel sync). Replace internals with Firebase here.
- `src/eta.js` — rush-aware logic: `stationLoads`, `itemEta`, `suggestSwap`
- `src/useStore.js` — React hook exposing state + derived `loads`, `minsLeft`, `cartCount`
- `src/pages/` — `Menu`, `Cart`, `Order`, `Kitchen`
- `src/components/` — `Header`, `Qty`, `Eta`

Run: `npm run dev` → student app at `/`, staff at `/kitchen` (open in two tabs).
