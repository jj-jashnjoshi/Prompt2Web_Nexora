// Rush-aware ETA: how long an item takes *right now*, given queued work per station.
import { STATIONS, READY_NOW_MINS } from './config'

const PENDING = ['placed', 'preparing']

export function stationLoads(orders) {
  const load = Object.fromEntries(Object.keys(STATIONS).map((s) => [s, 0]))
  for (const o of orders) {
    if (!PENDING.includes(o.status)) continue
    for (const i of o.items) load[i.station] += i.prepMins * i.qty
  }
  for (const s in load) load[s] = load[s] / STATIONS[s].cooks
  return load
}

export function itemEta(item, loads) {
  return Math.ceil(loads[item.station] + item.prepMins)
}

export const isReadyNow = (eta) => eta <= READY_NOW_MINS

// Fastest in-stock alternative that fits in the break, preferring the same category.
export function suggestSwap(item, menu, loads, minsLeft, excludeIds = []) {
  const fits = menu
    .filter((m) => m.inStock && m.id !== item.id && !excludeIds.includes(m.id))
    .map((m) => ({ ...m, eta: itemEta(m, loads) }))
    .filter((m) => m.eta <= minsLeft)
    .sort((a, b) => a.eta - b.eta)
  return fits.find((m) => m.category === item.category) || null
}

export function minsLeft(breakEndsAt, now = Date.now()) {
  return Math.max(0, Math.ceil((breakEndsAt - now) / 60000))
}
