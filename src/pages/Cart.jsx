import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { setQty, swapItem, placeOrder } from '../data'
import { itemEta, suggestSwap } from '../eta'
import { STATIONS } from '../config'
import Layout from '../components/Layout'
import Qty from '../components/Qty'
import Halftone from '../components/Halftone'
import Cloud from '../components/Cloud'
import FoodIcon from '../components/FoodIcon'
import FoodPhoto from '../components/FoodPhoto'

export default function Cart() {
  const s = useStore()
  const nav = useNavigate()
  const [name, setName] = useState(s.name)
  const [paid, setPaid] = useState(null)
  const [busy, setBusy] = useState(false)

  const lines = Object.entries(s.cart).map(([id, qty]) => {
    const m = s.menu.find((x) => x.id === id)
    const eta = itemEta(m, s.loads)
    const swap = eta > s.minsLeft ? suggestSwap(m, s.menu, s.loads, s.minsLeft, Object.keys(s.cart)) : null
    return { ...m, qty, eta, swap }
  })
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const readyIn = Math.max(0, ...lines.map((l) => l.eta))
  const makesBell = readyIn <= s.minsLeft

  async function checkout(e) {
    e.preventDefault()
    if (!name.trim() || busy) return
    setBusy(true)
    const order = await placeOrder(name)
    setBusy(false)
    if (!order) return
    setPaid(order)
    setTimeout(() => nav('/orders'), 1600)
  }

  if (paid) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-red text-white flex flex-col items-center justify-center px-5 text-center">
        <Halftone className="text-white/50" />
        <p className="relative font-display text-lg font-bold uppercase tracking-widest text-amber animate-rise">Paid ₹{paid.total}</p>
        <Cloud className="relative mt-6 size-64 animate-pop" fill="fill-white" stroke="stroke-neutral-900" bumps={14}>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Your token</p>
          <p className="font-display text-6xl font-bold text-neutral-900">{paid.token}</p>
        </Cloud>
        <p className="relative mt-6 font-display text-2xl font-bold animate-rise [animation-delay:300ms]">We're on it, {paid.name.split(' ')[0]}!</p>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <Layout s={s}>
        <div className="pt-16 flex flex-col items-center text-center">
          <Cloud className="size-44 animate-float" fill="fill-neutral-50" bumps={12}>
            <FoodIcon id="maggi" className="size-20" />
          </Cloud>
          <p className="mt-6 font-display text-2xl font-bold">Your tray is empty</p>
          <p className="mt-1 text-neutral-500">Hungry? The kitchen is waiting.</p>
          <Link to="/menu" className="mt-6 h-14 px-8 grid place-items-center rounded-full bg-red text-white font-display text-lg font-bold">
            Browse the menu
          </Link>
        </div>
      </Layout>
    )
  }

  const payBar = (
    <form onSubmit={checkout} className="rounded-[2rem] bg-neutral-900 p-3 text-white ink-shadow">
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="given-name"
          className="min-w-0 flex-1 h-12 px-5 rounded-full bg-white/10 text-white placeholder:text-white/50 text-base outline-none focus:bg-white/15"
        />
        <button disabled={!name.trim() || busy} className="h-12 px-5 sm:px-6 shrink-0 rounded-full ink bg-amber text-neutral-900 font-display text-lg font-bold disabled:opacity-40 active:scale-95 transition-transform">
          Pay ₹{total}
        </button>
      </div>
    </form>
  )

  return (
    <Layout s={s} bottom={payBar}>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight animate-rise">Your tray</h1>

      <div className={`relative mt-4 overflow-hidden rounded-[2rem] p-5 text-white animate-rise ink ink-shadow ${makesBell ? 'bg-blue' : 'bg-red'}`}>
        <Halftone className="opacity-30" />
        <p className="relative text-xs font-bold uppercase tracking-widest opacity-80">{makesBell ? 'Ready before the bell' : 'Cutting it close'}</p>
        <p className="relative mt-1 font-display text-5xl font-bold leading-none">~{readyIn}<span className="text-2xl"> min</span></p>
        <p className="relative mt-1 text-sm opacity-85">Bell rings in {s.minsLeft} min</p>
      </div>

      <ul className="mt-4 space-y-3 pb-20">
        {lines.map((l, i) => (
          <li key={l.id} style={{ animationDelay: `${i * 60}ms` }} className="rounded-[2rem] bg-neutral-50 p-3 animate-rise ink">
            <div className="flex items-center gap-3">
              <FoodPhoto id={l.id} name={l.name} className="size-16 shrink-0 rounded-3xl ink" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-tight">{l.name}</p>
                <p className="text-sm text-neutral-600">
                  ₹{l.price * l.qty} · <span className={l.eta > s.minsLeft ? 'font-semibold text-red' : ''}>~{l.eta} min</span>
                </p>
              </div>
              <Qty qty={l.qty} onChange={(q) => setQty(l.id, q)} />
            </div>

            {l.eta > s.minsLeft && (
              <div className="relative mt-3 overflow-hidden rounded-3xl bg-amber p-4 text-neutral-900 ink">
                <Halftone className="text-white/50" />
                <p className="relative text-sm">
                  <span className="font-bold">{STATIONS[l.station].label} is jammed.</span> This lands after the bell.
                </p>
                {l.swap && (
                  <div className="relative mt-3 flex items-center gap-3 rounded-full bg-white p-1.5 pl-1.5 ink">
                    <FoodPhoto id={l.swap.id} name={l.swap.name} className="size-10 shrink-0 rounded-full" />
                    <p className="min-w-0 flex-1 text-sm leading-tight">
                      <span className="font-bold">{l.swap.name}</span><br />
                      <span className="text-neutral-600">ready in ~{l.swap.eta} min</span>
                    </p>
                    <button
                      onClick={() => swapItem(l.id, l.swap.id)}
                      className="h-10 px-5 rounded-full bg-red text-white font-display font-bold shrink-0 animate-wiggle ink"
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
