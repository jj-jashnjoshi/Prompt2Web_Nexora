// Auto kitchen for demos: cooks queued orders one at a time per station (up to its cooks),
// lets campus orders get picked up, and trickles in new campus orders so the rush meter stays alive.
// Your own orders cook automatically too but stay "Ready" until staff mark them collected.
import { STATIONS, DEFAULT_BREAK_MINS } from './config'
import { line, makeOrder } from './seed'

// Demo time scale: one "minute" of prep takes this many real seconds.
export const DEMO_SECS_PER_MIN = 5
const PICKUP_MS = 12000
const MAX_CAMPUS_ACTIVE = 7

export const mainStation = (o) => o.items.reduce((a, b) => (b.prepMins > a.prepMins ? b : a)).station
export const cookMs = (o) => Math.max(8, o.items.reduce((s, i) => s + i.prepMins * i.qty, 0) * DEMO_SECS_PER_MIN) * 1000

const rand = (a, b) => a + Math.random() * (b - a)

export function kitchenStep(s, now = Date.now()) {
  let orders = s.orders.map((o) => ({ ...o }))
  let { nextToken, nextSpawnAt = 0, breakEndsAt } = s

  for (const o of orders) {
    if (o.status === 'preparing' && o.doneAt <= now) {
      o.status = 'ready'
      o.pickupBy = now + PICKUP_MS
    } else if (o.status === 'ready' && o.simulated && o.pickupBy <= now) {
      o.status = 'collected'
      o.collectedAt = now
    }
  }

  // Each station starts its oldest waiting orders while it has a free cook.
  for (const [id, st] of Object.entries(STATIONS)) {
    const here = orders.filter((o) => mainStation(o) === id)
    let busy = here.filter((o) => o.status === 'preparing').length
    const queue = here.filter((o) => o.status === 'placed').sort((a, b) => a.createdAt - b.createdAt)
    while (busy < st.cooks && queue.length) {
      const o = queue.shift()
      o.status = 'preparing'
      o.doneAt = now + cookMs(o)
      busy++
    }
  }

  if (now >= nextSpawnAt) {
    const active = orders.filter((o) => o.simulated && o.status !== 'collected').length
    const pool = s.menu.filter((m) => m.inStock)
    if (active < MAX_CAMPUS_ACTIVE && pool.length) {
      const m = pool[Math.floor(Math.random() * pool.length)]
      orders.push(makeOrder({ token: nextToken++, items: [line(m.id, Math.random() < 0.3 ? 2 : 1)], createdAt: now }))
    }
    nextSpawnAt = now + rand(12000, 25000)
  }

  // Forget campus orders a minute after pickup so storage stays small.
  orders = orders.filter((o) => !(o.simulated && o.status === 'collected' && now - o.collectedAt > 60000))

  // Keep the demo break running: when the bell rings, start the next break.
  if (now >= breakEndsAt) breakEndsAt = now + DEFAULT_BREAK_MINS * 60000

  return { ...s, orders, nextToken, nextSpawnAt, breakEndsAt }
}
