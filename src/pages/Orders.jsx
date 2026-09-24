import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { STATUSES, reorder } from '../data'
import { itemEta } from '../eta'
import Layout from '../components/Layout'
import Squiggle from '../components/Squiggle'

const LABELS = { placed: 'Placed', preparing: 'Preparing', ready: 'Ready', collected: 'Collected' }

function ActiveOrder({ order, loads }) {
  const step = STATUSES.indexOf(order.status)
  const ready = order.status === 'ready'
  const eta = Math.max(0, ...order.items.map((i) => itemEta(i, loads)))

  return (
    <li className={`relative overflow-hidden rounded-[2rem] p-6 ${ready ? 'bg-amber' : 'bg-neutral-50'}`}>
      {ready && <Squiggle className="text-white/25" />}
      <div className="relative flex items-baseline justify-between">
        <p className="font-display text-5xl font-bold tracking-tight">{order.token}</p>
        <p className="text-sm text-neutral-600">
          {ready ? <span className="font-display text-base font-bold text-red">Ready!</span> : <>~<span className="font-mono text-neutral-900">{eta}</span> min</>}
        </p>
      </div>
      <p className="relative mt-1 text-sm text-neutral-700">
        {ready ? 'Show this token at the counter.' : order.name ? `For ${order.name}` : ''}
      </p>

      <ol className="relative mt-5 grid grid-cols-4 gap-2">
        {STATUSES.map((st, i) => (
          <li key={st}>
            <div className={`h-1.5 rounded-full transition-colors duration-500 ${i <= step ? (ready ? 'bg-red' : 'bg-blue') : 'bg-neutral-200'}`} />
            <p className={`mt-2 text-[11px] ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}>{LABELS[st]}</p>
          </li>
        ))}
      </ol>

      <p className="relative mt-4 text-sm text-neutral-700">
        {order.items.map((i) => `${i.qty}× ${i.name}`).join(', ')} · <span className="font-mono">₹{order.total}</span>
      </p>
    </li>
  )
}

export default function Orders() {
  const s = useStore()
  const nav = useNavigate()
  const active = s.myOrders.filter((o) => o.status !== 'collected')
  const past = s.myOrders.filter((o) => o.status === 'collected')

  function again(order) {
    reorder(order)
    nav('/cart')
  }

  return (
    <Layout s={s}>
      <h1 className="mt-8 text-2xl font-display font-bold tracking-tight">Orders</h1>

      {!s.myOrders.length && (
        <div className="pt-20 text-center">
          <p className="text-neutral-500">No orders yet.</p>
          <Link to="/menu" className="mt-4 inline-block text-sm underline underline-offset-4">Order something</Link>
        </div>
      )}

      {active.length > 0 && (
        <ul className="mt-6 space-y-3">
          {active.map((o) => <ActiveOrder key={o.id} order={o} loads={s.loads} />)}
        </ul>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-10 text-xs font-medium uppercase tracking-wider text-neutral-500">Past</h2>
          <ul className="mt-2 divide-y divide-neutral-100">
            {past.map((o) => (
              <li key={o.id} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm truncate">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
                  <p className="mt-0.5 text-xs text-neutral-500 font-mono">{o.token} · ₹{o.total}</p>
                </div>
                <button onClick={() => again(o)} className="h-8 px-4 rounded-full border border-neutral-900 text-sm font-medium shrink-0">
                  Again
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Layout>
  )
}
