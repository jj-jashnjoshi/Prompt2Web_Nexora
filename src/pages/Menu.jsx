import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../useStore'
import { setQty } from '../data'
import { itemEta, isReadyNow } from '../eta'
import { CATEGORIES } from '../menu'
import Header from '../components/Header'
import Qty from '../components/Qty'
import Eta from '../components/Eta'
import KitchenPulse from '../components/KitchenPulse'

export default function Menu() {
  const s = useStore()
  const [cat, setCat] = useState('all')

  const items = s.menu
    .filter((m) => cat === 'all' || m.category === cat)
    .map((m) => ({ ...m, eta: itemEta(m, s.loads) }))
    // In stock first, then fastest first, so the menu steers away from the rush.
    .sort((a, b) => (b.inStock - a.inStock) || (a.eta - b.eta))

  const readyCount = items.filter((m) => m.inStock && isReadyNow(m.eta)).length
  const total = Object.entries(s.cart).reduce((sum, [id, q]) => sum + s.menu.find((m) => m.id === id).price * q, 0)

  return (
    <div className="min-h-dvh pb-28">
      <Header minsLeft={s.minsLeft} />
      <main className="mx-auto max-w-md px-5">
        <h1 className="mt-8 text-3xl font-semibold tracking-tight leading-tight">
          Order now,<br />skip the line.
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Times update live with the kitchen. {readyCount} items ready now.
        </p>

        <KitchenPulse loads={s.loads} minsLeft={s.minsLeft} />

        <nav className="mt-6 -mx-5 px-5 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`h-8 px-4 rounded-full text-sm shrink-0 ${cat === c.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'}`}
            >
              {c.label}
            </button>
          ))}
        </nav>

        <ul className="mt-4 divide-y divide-neutral-100">
          {items.map((m) => (
            <li key={m.id} className={`py-4 flex items-center justify-between gap-4 ${m.inStock ? '' : 'opacity-40'}`}>
              <div className="min-w-0">
                <p className="font-medium">{m.name}</p>
                <p className="mt-0.5 flex items-center gap-3 text-sm">
                  <span className="font-mono text-neutral-900">₹{m.price}</span>
                  {m.inStock ? <Eta eta={m.eta} minsLeft={s.minsLeft} /> : <span className="text-xs text-neutral-500">Sold out</span>}
                </p>
              </div>
              {m.inStock && <Qty qty={s.cart[m.id] || 0} onChange={(q) => setQty(m.id, q)} />}
            </li>
          ))}
        </ul>
      </main>

      {s.cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-white/0">
          <Link
            to="/cart"
            className="mx-auto max-w-md h-14 px-5 rounded-2xl bg-neutral-900 text-white flex items-center justify-between"
          >
            <span className="text-sm">{s.cartCount} item{s.cartCount > 1 ? 's' : ''}</span>
            <span className="font-medium">View cart · <span className="font-mono">₹{total}</span></span>
          </Link>
        </div>
      )}
    </div>
  )
}
