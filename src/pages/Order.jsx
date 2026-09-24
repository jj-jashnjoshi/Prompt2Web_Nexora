import { Link, useParams } from 'react-router-dom'
import { useStore } from '../useStore'
import { STATUSES } from '../data'
import { itemEta } from '../eta'
import Header from '../components/Header'

const LABELS = { placed: 'Placed', preparing: 'Preparing', ready: 'Ready', collected: 'Collected' }

export default function Order() {
  const { id } = useParams()
  const s = useStore()
  const order = s.orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="min-h-dvh">
        <Header back="/" />
        <main className="mx-auto max-w-md px-5 pt-24 text-center text-neutral-500">Order not found.</main>
      </div>
    )
  }

  const step = STATUSES.indexOf(order.status)
  const ready = order.status === 'ready'
  const eta = Math.max(0, ...order.items.map((i) => itemEta(i, s.loads)))

  return (
    <div className="min-h-dvh">
      <Header back="/" minsLeft={s.minsLeft} />
      <main className="mx-auto max-w-md px-5 pt-10 text-center">
        <p className="text-sm text-neutral-500">{ready ? 'Ready for pickup' : 'Your token'}</p>
        <p className={`mt-2 font-mono text-7xl tracking-tight ${ready ? 'text-accent' : ''}`}>{order.token}</p>
        <p className="mt-3 text-sm text-neutral-500">
          {ready ? 'Show this token at the counter.' : order.status === 'collected' ? 'Enjoy your food.' : <>Estimated <span className="font-mono text-neutral-900">~{eta} min</span></>}
        </p>

        <ol className="mt-10 grid grid-cols-4 gap-2">
          {STATUSES.map((st, i) => (
            <li key={st}>
              <div className={`h-1 rounded-full ${i <= step ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              <p className={`mt-2 text-xs ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}>{LABELS[st]}</p>
            </li>
          ))}
        </ol>

        <ul className="mt-10 text-left divide-y divide-neutral-100 border-y border-neutral-100">
          {order.items.map((i) => (
            <li key={i.id} className="py-3 flex justify-between text-sm">
              <span>{i.qty} × {i.name}</span>
              <span className="font-mono">₹{i.price * i.qty}</span>
            </li>
          ))}
          <li className="py-3 flex justify-between text-sm font-medium">
            <span>Paid</span>
            <span className="font-mono">₹{order.total}</span>
          </li>
        </ul>

        <Link to="/" className="mt-8 inline-block text-sm text-neutral-500 underline underline-offset-4">Order something else</Link>
      </main>
    </div>
  )
}
