import { useEffect, useState } from 'react'
import { getState, subscribe } from './data'
import { stationLoads, minsLeft } from './eta'

// Live app state plus derived values, re-rendered on data changes and every 15s.
export function useStore() {
  const [state, setState] = useState(getState)
  const [now, setNow] = useState(Date.now())
  useEffect(() => subscribe((s) => setState({ ...s })), [])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(t)
  }, [])
  return {
    ...state,
    loads: stationLoads(state.orders),
    minsLeft: minsLeft(state.breakEndsAt, now),
    cartCount: Object.values(state.cart).reduce((a, b) => a + b, 0),
  }
}
