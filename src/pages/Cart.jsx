import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { setQty, swapItem, placeOrder } from '../data'
import { itemEta, suggestSwap } from '../eta'
import Layout from '../components/Layout'
import Qty from '../components/Qty'
import Eta from '../components/Eta'
import Squiggle from '../components/Squiggle'

export default function Cart() {
  const s = useStore()
  const nav = useNavigate()
  const [name, setName] = useState(s.name)
  const [paid, setPaid] = useState(null)

  const lines = Object.entries(s.cart).map(([id, qty]) => {
    const m = s.menu.find((x) => x.id === id)
    const eta = itemEta(m, s.loads)
    const swap = eta > s.minsLeft ? suggestSwap(m, s.menu, s.loads, s.minsLeft, Object.keys(s.cart)) : null
    return { ...m, qty, eta, swap }
  })
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const readyIn = Math.max(0, ...lines.map((l) => l.eta))

  function checkout(e) {
    e.preventDefault()
    if (!name.trim()) return
    const order = placeOrder(name)
    if (!order) return
    setPaid(order)
    setTimeout(() => nav('/orders'), 1100)
  }

  if (paid) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-red text-white flex flex-col items-center justify-center px-5 text-center">
        <Squiggle className="text-white/10" />
        <svg viewBox="0 0 24 24" className="relative size-16 text-amber" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m7.5 12.5 3 3 6-6.5" />
        </svg>
        <p className="relative mt-4 font-display text-3xl font-bold">Paid <span className="font-mono">₹{paid.total}</span></p>
        <p className="relative mt-1 text-white/85">Token <span className="font-mono text-white">{paid.token}</span></p>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <Layout s={s}>
        <div className="pt-24 text-center">
          <p className="text-neutral-500">Your cart is empty.</p>
          <Link to="/menu" className="mt-4 inline-block text-sm underline underline-offset-4">Browse the menu</Link>
        </div>
      </Layout>
    )
  }

  const payBar = (
    <form onSubmit={checkout} className="space-y-3">
      <div className="flex justify-between text-sm text-neutral-500">
        <span>Ready in <span className="font-mono text-neutral-900">~{readyIn} min</span></span>
        <span>Total <span className="font-mono text-neutral-900">₹{total}</span></span>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (called at pickup)"
        autoComplete="given-name"
        className="w-full h-12 px-4 rounded-full border-2 border-neutral-200 bg-white text-base outline-none focus:border-neutral-900"
      />
      <button disabled={!name.trim()} className="w-full h-14 rounded-full bg-red text-white font-display text-lg font-medium disabled:opacity-30">
        Pay <span className="font-mono">₹{total}</span> & place order
      </button>
    </form>
  )

  return (
    <Layout s={s} bottom={payBar}>
      <h1 className="mt-8 text-2xl font-display font-bold tracking-tight">Your order</h1>

      <ul className="mt-4 pb-24 divide-y divide-neutral-100">
        {lines.map((l) => (
          <li key={l.id} className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="mt-0.5 flex items-center gap-3 text-sm">
                  <span className="font-mono">₹{l.price * l.qty}</span>
                  <Eta eta={l.eta} minsLeft={s.minsLeft} />
                </p>
              </div>
              <Qty qty={l.qty} onChange={(q) => setQty(l.id, q)} />
            </div>

            {l.eta > s.minsLeft && (
              <div className="mt-3 rounded-3xl bg-neutral-50 p-4 text-sm">
                <p className="text-neutral-600">
                  The {l.station} station is busy. This won't be ready before your break ends.
                </p>
                {l.swap && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p>
                      <span className="font-medium">{l.swap.name}</span>{' '}
                      <span className="text-neutral-500">is ready in</span>{' '}
                      <span className="font-mono">~{l.swap.eta} min</span>
                    </p>
                    <button
                      onClick={() => swapItem(l.id, l.swap.id)}
                      className="h-8 px-4 rounded-full bg-amber text-neutral-900 text-sm font-semibold shrink-0"
                    >
                      Swap
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  )
}
