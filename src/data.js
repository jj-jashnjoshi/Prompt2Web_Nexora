// Single data layer. Components never touch storage directly.
// Currently localStorage + cross-tab sync; swap internals for Firebase later
// without changing these function signatures.
import { MENU } from './menu'
import { DEFAULT_BREAK_MINS } from './config'

const KEY = 'canteen:v1'
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(KEY) : null
const listeners = new Set()

function initial() {
  return {
    menu: MENU.map((m) => ({ ...m, inStock: true })),
    orders: [],
    cart: {},
    nextToken: 1,
    breakEndsAt: Date.now() + DEFAULT_BREAK_MINS * 60000,
  }
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
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
export function placeOrder() {
  const items = Object.entries(state.cart).map(([id, qty]) => {
    const m = state.menu.find((x) => x.id === id)
    return { id, name: m.name, price: m.price, station: m.station, prepMins: m.prepMins, qty }
  })
  if (!items.length) return null
  const order = {
    id: crypto.randomUUID(),
    token: 'A-' + String(state.nextToken).padStart(3, '0'),
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    status: 'placed',
    createdAt: Date.now(),
  }
  write({ ...state, orders: [...state.orders, order], cart: {}, nextToken: state.nextToken + 1 })
  return order
}

export const STATUSES = ['placed', 'preparing', 'ready', 'collected']
export function advanceOrder(id) {
  const orders = state.orders.map((o) => {
    if (o.id !== id) return o
    const i = STATUSES.indexOf(o.status)
    return { ...o, status: STATUSES[Math.min(i + 1, STATUSES.length - 1)] }
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
export function simulateRush(station, count = 5) {
  const pool = state.menu.filter((m) => m.station === station)
  const orders = [...state.orders]
  let next = state.nextToken
  for (let n = 0; n < count; n++) {
    const m = pool[n % pool.length]
    orders.push({
      id: crypto.randomUUID(),
      token: 'A-' + String(next++).padStart(3, '0'),
      items: [{ id: m.id, name: m.name, price: m.price, station: m.station, prepMins: m.prepMins, qty: 1 }],
      total: m.price,
      status: 'placed',
      createdAt: Date.now(),
      simulated: true,
    })
  }
  write({ ...state, orders, nextToken: next })
}
export function resetAll() {
  write(initial())
}
