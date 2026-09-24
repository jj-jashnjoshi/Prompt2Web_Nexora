// Single data layer ("backend") — components never touch storage directly.
// Shared state (menu, orders, queue, break timer) syncs through one Firestore document when
// Firebase is reachable, and always mirrors to localStorage so the demo also works offline.
// Per-device state (cart, name) stays in localStorage only.
import { MENU } from './menu'
import { DEFAULT_BREAK_MINS } from './config'
import { seedOrders, SEED_NEXT_TOKEN, makeOrder, line } from './seed'
import { kitchenStep, cookMs } from './kitchenSim'
import { connect } from './firebase'

const KEY = 'nexkitchen:v2'
const LOCK = 'nexkitchen:tick'
const TICK_MS = 2000
const SHARED = ['menu', 'orders', 'nextToken', 'breakEndsAt', 'autoKitchen', 'nextSpawnAt']
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(KEY) : null
const listeners = new Set()

function initial() {
  const now = Date.now()
  return {
    menu: MENU.map((m) => ({ ...m, inStock: true })),
    orders: seedOrders(now),
    cart: {},
    nextToken: SEED_NEXT_TOKEN,
    breakEndsAt: now + DEFAULT_BREAK_MINS * 60000,
    name: '',
    autoKitchen: true,
    nextSpawnAt: now + 8000,
  }
}

const sharedOf = (s) => Object.fromEntries(SHARED.map((k) => [k, s[k]]))
const same = (a, b) => JSON.stringify(sharedOf(a)) === JSON.stringify(sharedOf(b))

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch {}
  return initial()
}

let state = read()
let fb = null // { db, liveRef, onSnapshot, runTransaction } once the SDK has loaded
let online = false // true once Firestore has answered at least once

function write(next) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  channel?.postMessage('changed')
  listeners.forEach((fn) => fn(state))
}

function reload() {
  state = read()
  listeners.forEach((fn) => fn(state))
}
channel && (channel.onmessage = reload)
typeof window !== 'undefined' && window.addEventListener('storage', (e) => e.key === KEY && reload())

// Live updates from Firestore; seeds the document with the demo queue if it doesn't exist yet.
connect().then((conn) => {
  if (!conn) return
  fb = conn
  fb.onSnapshot(
    fb.liveRef,
    (snap) => {
      online = true
      if (snap.exists()) write({ ...state, ...snap.data() })
      else commit(() => initial())
    },
    (err) => {
      online = false
      console.warn('[nexkitchen] Firestore unavailable, running on localStorage:', err.code || err.message)
    },
  )
})

// Apply a change to shared state. Optimistic locally; in a Firestore transaction when online
// so two phones ordering at once never get the same token. Resolves to the committed state.
async function commit(fn) {
  const local = fn(state)
  if (!same(local, state)) write(local)
  if (!fb || !online) return local
  try {
    return await fb.runTransaction(fb.db, async (tx) => {
      const snap = await tx.get(fb.liveRef)
      const cur = { ...state, ...(snap.exists() ? snap.data() : {}) }
      const next = fn(cur)
      if (!snap.exists() || !same(next, cur)) tx.set(fb.liveRef, sharedOf(next))
      return next
    })
  } catch (err) {
    console.warn('[nexkitchen] Firestore write failed, kept local copy:', err.code || err.message)
    return local
  }
}

export const getState = () => state
export const isOnline = () => online
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Auto kitchen heartbeat. A per-browser lock keeps multiple tabs from stepping together;
// across devices the Firestore transaction serialises steps.
function tick() {
  const now = Date.now()
  try {
    if (now - Number(localStorage.getItem(LOCK) || 0) < TICK_MS * 0.8) return
    localStorage.setItem(LOCK, String(now))
  } catch {}
  if (!state.autoKitchen) return
  commit((s) => (s.autoKitchen ? kitchenStep(s, now) : s))
}
typeof window !== 'undefined' && setInterval(tick, TICK_MS)

// Cart (this device only)
export function setQty(itemId, qty) {
  const cart = { ...state.cart }
  if (qty <= 0) delete cart[itemId]
  else cart[itemId] = qty
  write({ ...state, cart })
}
export function swapItem(fromId, toId) {
  const cart = { ...state.cart }
  const qty = cart[fromId] || 1
  delete cart[fromId]
  cart[toId] = (cart[toId] || 0) + qty
  write({ ...state, cart })
}

// Put a previous order's (in-stock) items back in the cart.
export function reorder(order) {
  const cart = {}
  for (const i of order.items) {
    if (state.menu.find((m) => m.id === i.id)?.inStock) cart[i.id] = i.qty
  }
  write({ ...state, cart })
}

// Orders

// Resolves to the placed order (token assigned by the shared counter).
export async function placeOrder(name = '') {
  const items = Object.entries(state.cart).map(([id, qty]) => line(id, qty))
  if (!items.length) return null
  const id = crypto.randomUUID()
  const clean = name.trim()
  const next = await commit((s) => ({
    ...s,
    orders: [...s.orders, { ...makeOrder({ token: s.nextToken, items, name: clean, simulated: false }), id }],
    nextToken: s.nextToken + 1,
  }))
  write({ ...state, cart: {}, name: clean })
  return next.orders.find((o) => o.id === id) || null
}

export const STATUSES = ['placed', 'preparing', 'ready', 'collected']
export function advanceOrder(id) {
  const now = Date.now()
  commit((s) => ({
    ...s,
    orders: s.orders.map((o) => {
      if (o.id !== id) return o
      const status = STATUSES[Math.min(STATUSES.indexOf(o.status) + 1, STATUSES.length - 1)]
      return {
        ...o,
        status,
        ...(status === 'preparing' && { doneAt: now + cookMs(o) }),
        ...(status === 'ready' && { pickupBy: now + 12000 }),
        ...(status === 'collected' && { collectedAt: now }),
      }
    }),
  }))
}

// Kitchen / demo controls
export function toggleStock(itemId) {
  commit((s) => ({ ...s, menu: s.menu.map((m) => (m.id === itemId ? { ...m, inStock: !m.inStock } : m)) }))
}
export function setBreakMinsLeft(mins) {
  const at = Date.now() + mins * 60000
  commit((s) => ({ ...s, breakEndsAt: at }))
}
export function setAutoKitchen(on) {
  commit((s) => ({ ...s, autoKitchen: on }))
}
export function simulateRush(station, count = 5) {
  commit((s) => {
    const pool = s.menu.filter((m) => m.station === station && m.inStock)
    if (!pool.length) return s
    const orders = [...s.orders]
    let next = s.nextToken
    for (let n = 0; n < count; n++) orders.push(makeOrder({ token: next++, items: [line(pool[n % pool.length].id)] }))
    return { ...s, orders, nextToken: next }
  })
}
export function resetAll() {
  const fresh = initial()
  write({ ...fresh, name: state.name })
  commit(() => fresh)
}
