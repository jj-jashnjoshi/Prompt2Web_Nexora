import { useStore } from '../useStore'
import { advanceOrder, toggleStock, simulateRush, setBreakMinsLeft, resetAll } from '../data'
import { STATIONS, APP_NAME } from '../config'

const NEXT = { placed: 'Start', preparing: 'Mark ready', ready: 'Collected' }

export default function Kitchen() {
  const s = useStore()
  const active = s.orders.filter((o) => o.status !== 'collected')

  return (
    <div className="min-h-dvh">
      <header className="border-b border-neutral-100">
        <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight"><span className="text-red">{APP_NAME}</span> Kitchen</span>
          <span className="text-xs text-neutral-500">Break ends in <span className="font-mono text-neutral-900">{s.minsLeft}m</span></span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 grid gap-10 md:grid-cols-[1fr_280px]">
        <section>
          <h2 className="text-sm text-neutral-500">Station load</h2>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(STATIONS).map(([id, st]) => (
              <div key={id} className="rounded-xl border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">{st.label}</p>
                <p className={`mt-1 font-mono text-xl ${s.loads[id] > s.minsLeft ? 'text-accent' : ''}`}>{Math.ceil(s.loads[id])}m</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-sm text-neutral-500">Orders ({active.length})</h2>
          {!active.length && <p className="mt-3 text-sm text-neutral-400">No active orders.</p>}
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {active.map((o) => (
              <li key={o.id} className={`rounded-xl border p-4 ${o.status === 'ready' ? 'border-accent' : 'border-neutral-100'}`}>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-lg">{o.token}</span>
                  <span className="text-xs text-neutral-500 capitalize">{o.status}</span>
                </div>
                <ul className="mt-2 text-sm text-neutral-600">
                  {o.items.map((i) => <li key={i.id}>{i.qty} × {i.name}</li>)}
                </ul>
                <button onClick={() => advanceOrder(o.id)} className="mt-3 w-full h-9 rounded-lg bg-neutral-900 text-white text-sm">
                  {NEXT[o.status]}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-10">
          <div>
            <h2 className="text-sm text-neutral-500">Stock</h2>
            <ul className="mt-3 divide-y divide-neutral-100">
              {s.menu.map((m) => (
                <li key={m.id} className="py-2 flex items-center justify-between text-sm">
                  <span className={m.inStock ? '' : 'text-neutral-400 line-through'}>{m.name}</span>
                  <button onClick={() => toggleStock(m.id)} className="text-xs text-neutral-500 underline underline-offset-4">
                    {m.inStock ? 'Sold out' : 'Restock'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm text-neutral-500">Demo controls</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(STATIONS).map(([id, st]) => (
                <button key={id} onClick={() => simulateRush(id)} className="h-8 px-3 rounded-full bg-neutral-100 text-xs">
                  Rush {st.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[5, 10, 20].map((m) => (
                <button key={m} onClick={() => setBreakMinsLeft(m)} className="h-8 px-3 rounded-full bg-neutral-100 text-xs">
                  Break: {m}m
                </button>
              ))}
            </div>
            <button onClick={resetAll} className="mt-3 text-xs text-neutral-500 underline underline-offset-4">Reset everything</button>
          </div>
        </aside>
      </main>
    </div>
  )
}
