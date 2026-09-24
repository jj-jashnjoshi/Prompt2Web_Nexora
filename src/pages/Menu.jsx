import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../useStore'
import { setQty, reorder } from '../data'
import { itemEta, isReadyNow } from '../eta'
import { CATEGORIES } from '../menu'
import Layout from '../components/Layout'
import Qty from '../components/Qty'
import KitchenPulse from '../components/KitchenPulse'
import FoodIcon from '../components/FoodIcon'
import Marquee from '../components/Marquee'
import Cloud from '../components/Cloud'
import Squiggle from '../components/Squiggle'

const CARD = {
  meal: 'bg-red text-white',
  snack: 'bg-amber text-neutral-900',
  drink: 'bg-blue text-white',
}

function ItemCard({ m, qty, minsLeft, i }) {
  const ready = isReadyNow(m.eta)
  const late = m.eta > minsLeft
  return (
    <li
      style={{ animationDelay: `${i * 45}ms` }}
      className={`relative overflow-hidden rounded-[2rem] p-4 flex flex-col animate-rise ${CARD[m.category]} ${m.inStock ? '' : 'grayscale opacity-60'}`}
    >
      <Squiggle className="opacity-10" />
      <div className="relative flex justify-center pt-2">
        <FoodIcon id={m.id} className="size-20 drop-shadow-[0_4px_0_rgba(74,28,19,0.25)]" />
      </div>

      {m.inStock && ready && (
        <Cloud className="absolute -right-1 -top-1 size-16 rotate-12 animate-wiggle" fill="fill-white" bumps={10}>
          <span className="block font-display text-[11px] font-bold leading-tight text-neutral-900">READY<br />NOW</span>
        </Cloud>
      )}

      <p className="relative mt-3 font-display text-lg font-bold leading-tight">{m.name}</p>
      <p className={`relative mt-0.5 text-xs font-semibold ${late ? 'underline decoration-2 underline-offset-2' : 'opacity-80'}`}>
        {!m.inStock ? 'Sold out' : ready ? 'No wait' : late ? `~${m.eta} min · after bell` : `~${m.eta} min`}
      </p>

      <div className="relative mt-auto pt-3 flex items-center justify-between">
        <span className="font-display text-2xl font-bold">₹{m.price}</span>
        {m.inStock && <Qty qty={qty} onChange={(q) => setQty(m.id, q)} tone="light" />}
      </div>

      {!m.inStock && (
        <span className="absolute inset-x-3 top-1/3 -rotate-12 rounded-full border-4 border-current py-1 text-center font-display text-xl font-bold">
          SOLD OUT
        </span>
      )}
    </li>
  )
}

export default function Menu() {
  const s = useStore()
  const [cat, setCat] = useState('all')

  const withEta = s.menu.map((m) => ({ ...m, eta: itemEta(m, s.loads) }))
  const items = withEta
    .filter((m) => cat === 'all' || m.category === cat)
    // In stock first, then fastest first, so the menu steers away from the rush.
    .sort((a, b) => (b.inStock - a.inStock) || (a.eta - b.eta))

  const readyNow = withEta.filter((m) => m.inStock && isReadyNow(m.eta))
  const total = Object.entries(s.cart).reduce((sum, [id, q]) => sum + s.menu.find((m) => m.id === id).price * q, 0)
  const usual = s.myOrders[0]

  const cartBar = s.cartCount > 0 && (
    <Link to="/cart" className="h-16 pl-6 pr-2 rounded-full bg-red text-white flex items-center justify-between shadow-[0_6px_0_0_rgba(74,28,19,0.2)]">
      <span className="font-display text-lg font-bold">
        {s.cartCount} item{s.cartCount > 1 ? 's' : ''} · ₹{total}
      </span>
      <span className="h-12 px-5 rounded-full bg-white text-neutral-900 font-display font-bold grid place-items-center">View cart</span>
    </Link>
  )

  const band = readyNow.length > 0 && (
    <Marquee items={['Ready now', ...readyNow.map((m) => m.name)]} className="bg-neutral-900 text-amber" />
  )

  return (
    <Layout s={s} bottom={cartBar} band={band}>
      <h1 className="mt-6 font-display text-4xl font-bold leading-[0.95] tracking-tight animate-rise">
        {s.name ? <>Hey {s.name.split(' ')[0]},<br /></> : null}
        what's for <span className="text-red">break?</span>
      </h1>

      {usual && (
        <section className="relative mt-5 overflow-hidden flex items-center gap-4 rounded-[2rem] bg-neutral-900 p-4 text-white animate-rise">
          <div className="flex -space-x-4 shrink-0">
            {usual.items.slice(0, 3).map((i) => (
              <span key={i.id} className="grid size-12 place-items-center rounded-full bg-white ring-2 ring-neutral-900">
                <FoodIcon id={i.id} className="size-9" />
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber">Your usual</p>
            <p className="text-sm truncate">{usual.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
          </div>
          <button onClick={() => reorder(usual)} className="h-10 px-4 rounded-full bg-amber text-neutral-900 text-sm font-bold shrink-0 active:scale-95 transition-transform">
            ₹{usual.total}
          </button>
        </section>
      )}

      <KitchenPulse loads={s.loads} minsLeft={s.minsLeft} />

      <nav className="sticky top-16 z-[5] mt-6 -mx-5 px-5 py-2 flex gap-2 overflow-x-auto bg-white/90 backdrop-blur">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`h-10 px-5 rounded-full font-display font-semibold shrink-0 transition-colors ${cat === c.id ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-700'}`}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <ul key={cat} className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((m, i) => (
          <ItemCard key={m.id} m={m} i={i} qty={s.cart[m.id] || 0} minsLeft={s.minsLeft} />
        ))}
      </ul>
    </Layout>
  )
}
