// Single data layer ("backend") — components never touch storage directly.
// Temporary: localStorage + cross-tab sync, pre-filled with a demo queue and driven by the
// auto kitchen in kitchenSim.js. Swap internals for Firebase later without changing these signatures.
import { MENU } from './menu'
import { DEFAULT_BREAK_MINS } from './config'
import { seedOrders, SEED_NEXT_TOKEN, makeOrder, line } from './seed'
import { kitchenStep, cookMs } from './kitchenSim'

const KEY = 'nexkitchen:v2'
const LOCK = 'nexkitchen:tick'
const TICK_MS = 2000
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

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch {}
  return initial()
}

let state = read()

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

export const getState = () => state
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Auto kitchen heartbeat. With several tabs open, a shared lock makes only one tab step per tick.
function tick() {
  const now = Date.now()
  try {
    if (now - Number(localStorage.getItem(LOCK) || 0) < TICK_MS * 0.8) return
    localStorage.setItem(LOCK, String(now))
  } catch {}
  const fresh = read()
  if (!fresh.autoKitchen) return
  const next = kitchenStep(fresh, now)
  if (JSON.stringify(next) !== JSON.stringify(fresh)) write(next)
}
typeof window !== 'undefined' && setInterval(tick, TICK_MS)

// Cart
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

// Orders

// Put a previous order's (in-stock) items back in the cart.
export function reorder(order) {
  const cart = {}
  for (const i of order.items) {
    if (state.menu.find((m) => m.id === i.id)?.inStock) cart[i.id] = i.qty
  }
  write({ ...state, cart })
}

export function placeOrder(name = '') {
  const items = Object.entries(state.cart).map(([id, qty]) => line(id, qty))
  if (!items.length) return null
  const order = makeOrder({ token: state.nextToken, items, name: name.trim(), simulated: false })
  write({ ...state, orders: [...state.orders, order], cart: {}, name: name.trim(), nextToken: state.nextToken + 1 })
  return order
}

export const STATUSES = ['placed', 'preparing', 'ready', 'collected']
export function advanceOrder(id) {
  const now = Date.now()
  const orders = state.orders.map((o) => {
    if (o.id !== id) return o
    const status = STATUSES[Math.min(STATUSES.indexOf(o.status) + 1, STATUSES.length - 1)]
    return {
      ...o,
      status,
      ...(status === 'preparing' && { doneAt: now + cookMs(o) }),
      ...(status === 'ready' && { pickupBy: now + 12000 }),
      ...(status === 'collected' && { collectedAt: now }),
    }
  })
  write({ ...state, orders })
}

// Kitchen / demo controls
export function toggleStock(itemId) {
  write({ ...state, menu: state.menu.map((m) => (m.id === itemId ? { ...m, inStock: !m.inStock } : m)) })
}
export function setBreakMinsLeft(mins) {
  write({ ...state, breakEndsAt: Date.now() + mins * 60000 })
}
export function setAutoKitchen(on) {
  write({ ...state, autoKitchen: on })
}
export function simulateRush(station, count = 5) {
  const pool = state.menu.filter((m) => m.station === station && m.inStock)
  if (!pool.length) return
  const orders = [...state.orders]
  let next = state.nextToken
  for (let n = 0; n < count; n++) {
    orders.push(makeOrder({ token: next++, items: [line(pool[n % pool.length].id)] }))
  }
  write({ ...state, orders, nextToken: next })
}
export function resetAll() {
  write(initial())
}
