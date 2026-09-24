import { STATIONS } from '../config'
import Squiggle from './Squiggle'

// Live rush meter: one colour tile per kitchen station. Blue = calm, amber = busy, red = won't make the bell.
function level(wait, minsLeft) {
  if (wait >= minsLeft) return { bg: 'bg-red text-white', label: 'Jammed' }
  if (wait >= minsLeft / 2) return { bg: 'bg-amber text-neutral-900', label: 'Busy' }
  return { bg: 'bg-blue text-white', label: wait === 0 ? 'Free' : 'Calm' }
}

export default function KitchenPulse({ loads, minsLeft }) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Kitchen rush meter</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
          <span className="size-2 rounded-full bg-red animate-pulse" /> LIVE
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {Object.entries(STATIONS).map(([id, st]) => {
          const wait = Math.ceil(loads[id])
          const lv = level(wait, minsLeft)
          return (
            <li key={id} className={`relative overflow-hidden rounded-3xl px-2 py-3 text-center transition-colors duration-500 ${lv.bg}`}>
              <Squiggle className="opacity-15" />
              <p className="relative text-[11px] font-semibold uppercase tracking-wide opacity-80">{st.label}</p>
              <p key={wait} className="relative mt-1 font-display text-3xl font-bold leading-none animate-pop">
                {wait}<span className="text-sm">m</span>
              </p>
              <p className="relative mt-1 text-[11px] font-semibold">{lv.label}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
