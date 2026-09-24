// Default demo queue: a lunch rush already in progress, plus one past order
// of "yours" so the Your usual / Eaten before sections have something to show.
import { MENU } from './menu'

const byId = Object.fromEntries(MENU.map((m) => [m.id, m]))

export function line(id, qty = 1) {
  const m = byId[id]
  return { id, name: m.name, price: m.price, station: m.station, prepMins: m.prepMins, qty }
}

export function makeOrder({ token, items, status = 'placed', simulated = true, name = '', createdAt = Date.now(), ...rest }) {
  return {
    id: crypto.randomUUID(),
    token: 'A-' + String(token).padStart(3, '0'),
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    name,
    status,
    createdAt,
    simulated,
    ...rest,
  }
}

export function seedOrders(now = Date.now()) {
  const ago = (s) => now - s * 1000
  return [
    makeOrder({ token: 12, items: [line('samosa', 2), line('chai')], status: 'collected', simulated: false, createdAt: now - 86400000 }),
    makeOrder({ token: 31, items: [line('dosa')], status: 'preparing', doneAt: now + 15000, createdAt: ago(90) }),
    makeOrder({ token: 32, items: [line('maggi')], createdAt: ago(80) }),
    makeOrder({ token: 33, items: [line('paneer-roll')], createdAt: ago(70) }),
    makeOrder({ token: 34, items: [line('vada-pav', 2)], status: 'preparing', doneAt: now + 10000, createdAt: ago(60) }),
    makeOrder({ token: 35, items: [line('fries')], createdAt: ago(50) }),
    makeOrder({ token: 36, items: [line('cold-coffee')], status: 'preparing', doneAt: now + 8000, createdAt: ago(40) }),
    makeOrder({ token: 37, items: [line('chai', 3)], createdAt: ago(30) }),
    makeOrder({ token: 38, items: [line('sandwich')], status: 'ready', pickupBy: now + 12000, createdAt: ago(20) }),
  ]
}

export const SEED_NEXT_TOKEN = 41
