import { useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { setQty, swapItem, placeOrder } from '../data'
import { itemEta, suggestSwap } from '../eta'
import Header from '../components/Header'
import Qty from '../components/Qty'
import Eta from '../components/Eta'

export default function Cart() {
  const s = useStore()
  const nav = useNavigate()

  const lines = Object.entries(s.cart).map(([id, qty]) => {
    const m = s.menu.find((x) => x.id === id)
    const eta = itemEta(m, s.loads)
    const swap = eta > s.minsLeft ? suggestSwap(m, s.menu, s.loads, s.minsLeft, Object.keys(s.cart)) : null
    return { ...m, qty, eta, swap }
  })
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const readyIn = Math.max(0, ...lines.map((l) => l.eta))

  function checkout() {
    const order = placeOrder()
    if (order) nav(`/order/${order.id}`)
  }

  if (!lines.length) {
    return (
      <div className="min-h-dvh">
        <Header back="/" minsLeft={s.minsLeft} />
        <main className="mx-auto max-w-md px-5 pt-24 text-center text-neutral-500">Your cart is empty.</main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh pb-40">
      <Header back="/" minsLeft={s.minsLeft} />
      <main className="mx-auto max-w-md px-5">
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Your order</h1>

        <ul className="mt-4 divide-y divide-neutral-100">
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
                <div className="mt-3 rounded-xl bg-neutral-50 p-4 text-sm">
                  <p className="text-neutral-600">
                    The {s.menu.find((m) => m.id === l.id).station} station is busy. This won't be ready before your break ends.
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
                        className="h-8 px-4 rounded-full bg-accent text-white text-sm font-medium shrink-0"
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
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-100 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md">
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Ready in</span>
            <span className="font-mono text-neutral-900">~{readyIn} min</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-neutral-500">
            <span>Total</span>
            <span className="font-mono text-neutral-900">₹{total}</span>
          </div>
          <button onClick={checkout} className="mt-4 w-full h-14 rounded-2xl bg-neutral-900 text-white font-medium">
            Pay ₹{total} & place order
          </button>
        </div>
      </div>
    </div>
  )
}
