import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { STATUSES, reorder } from '../data'
import { itemEta } from '../eta'
import Layout from '../components/Layout'
import Squiggle from '../components/Squiggle'
import Cloud from '../components/Cloud'
import Marquee from '../components/Marquee'
import FoodIcon from '../components/FoodIcon'

const LABELS = { placed: 'Placed', preparing: 'Cooking', ready: 'Ready', collected: 'Collected' }

function ActiveOrder({ order, loads }) {
  const step = STATUSES.indexOf(order.status)
  const ready = order.status === 'ready'
  const eta = Math.max(0, ...order.items.map((i) => itemEta(i, loads)))

  return (
    <li className={`relative overflow-hidden rounded-[2.25rem] animate-rise ${ready ? 'bg-amber' : 'bg-blue text-white'}`}>
      {ready && <Marquee items={["It's ready", 'Go grab it', 'Show your token']} className="bg-red text-white" />}
      <div className="relative p-5 sm:p-6">
        <Squiggle className={ready ? 'text-white/25' : 'text-white/10'} />
        <div className="relative flex items-center gap-4 sm:gap-5">
          <Cloud className={`size-24 sm:size-32 shrink-0 ${ready ? 'animate-wiggle' : ''}`} fill={ready ? 'fill-red' : 'fill-white'} bumps={12}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${ready ? 'text-white/80' : 'text-neutral-500'}`}>Token</p>
            <p className={`font-display text-2xl sm:text-3xl font-bold leading-none ${ready ? 'text-white' : 'text-neutral-900'}`}>{order.token}</p>
          </Cloud>
          <div>
            {ready ? (
              <p className="font-display text-3xl font-bold leading-none">Hot &amp;<br />ready!</p>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{LABELS[order.status]}</p>
                <p className="font-display text-4xl sm:text-5xl font-bold leading-none">~{eta}<span className="text-xl"> min</span></p>
              </>
            )}
            {order.name && <p className="mt-2 text-sm opacity-80">for {order.name}</p>}
          </div>
        </div>

        <ol className="relative mt-6 grid grid-cols-4 gap-1.5">
          {STATUSES.map((st, i) => (
            <li key={st}>
              <div className={`h-2.5 rounded-full transition-colors duration-500 ${i <= step ? (ready ? 'bg-red' : 'bg-amber') : ready ? 'bg-white/50' : 'bg-white/25'}`} />
              <p className={`mt-1.5 text-[11px] font-semibold ${i <= step ? '' : 'opacity-50'}`}>{LABELS[st]}</p>
            </li>
          ))}
        </ol>

        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          {order.items.map((i) => (
            <span key={i.id} className="flex items-center gap-1 rounded-full bg-white py-1 pl-1 pr-3 text-xs font-semibold text-neutral-900">
              <FoodIcon id={i.id} className="size-6" /> {i.qty}× {i.name}
            </span>
          ))}
        </div>
      </div>
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
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight animate-rise">Your orders</h1>

      {!s.myOrders.length && (
        <div className="pt-12 flex flex-col items-center text-center">
          <Cloud className="size-44 animate-float" fill="fill-neutral-50" bumps={12}>
            <FoodIcon id="chai" className="size-20" />
          </Cloud>
          <p className="mt-6 font-display text-2xl font-bold">No orders yet</p>
          <p className="mt-1 text-neutral-500">Your tokens will show up here, live.</p>
          <Link to="/menu" className="mt-6 h-14 px-8 grid place-items-center rounded-full bg-red text-white font-display text-lg font-bold">
            Order something
          </Link>
        </div>
      )}

      {active.length > 0 && (
        <ul className="mt-5 space-y-4">
          {active.map((o) => <ActiveOrder key={o.id} order={o} loads={s.loads} />)}
        </ul>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-lg font-bold">Eaten before</h2>
          <ul className="mt-3 space-y-2">
            {past.map((o) => (
              <li key={o.id} className="flex items-center gap-3 rounded-full bg-neutral-50 p-2 pl-3">
                <div className="flex -space-x-3 shrink-0">
                  {o.items.slice(0, 3).map((i) => (
                    <span key={i.id} className="grid size-10 place-items-center rounded-full bg-white ring-2 ring-neutral-50">
                      <FoodIcon id={i.id} className="size-7" />
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{o.items.map((i) => i.name).join(', ')}</p>
                  <p className="text-xs text-neutral-500">{o.token} · ₹{o.total}</p>
                </div>
                <button onClick={() => again(o)} className="h-10 px-5 rounded-full bg-neutral-900 text-white text-sm font-bold shrink-0 active:scale-95">
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
