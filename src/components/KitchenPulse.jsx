import { STATIONS } from '../config'

// Live per-station wait, shown on the menu so students see the rush before ordering.
export default function KitchenPulse({ loads, minsLeft }) {
  const max = Math.max(minsLeft, 1)
  return (
    <section className="mt-6 rounded-3xl bg-neutral-50 p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Kitchen right now</h2>
        <span className="flex items-center gap-1.5 text-xs text-neutral-400">
          <span className="size-1.5 rounded-full bg-red animate-pulse" /> Live
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {Object.entries(STATIONS).map(([id, st]) => {
          const wait = Math.ceil(loads[id])
          const busy = wait >= minsLeft
          return (
            <li key={id} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-sm">
              <span className="text-neutral-600">{st.label}</span>
              <span className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <span
                  className={`block h-full rounded-full transition-all duration-700 ${busy ? 'bg-red' : 'bg-blue'}`}
                  style={{ width: `${Math.min(100, (wait / max) * 100)}%` }}
                />
              </span>
              <span className={`text-right font-mono text-xs ${busy ? 'text-red' : 'text-neutral-500'}`}>
                {wait === 0 ? 'free' : `${wait}m`}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
