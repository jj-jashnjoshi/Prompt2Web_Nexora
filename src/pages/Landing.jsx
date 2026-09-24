import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { markIntroSeen } from '../data'
import { APP_NAME } from '../config'
import KitchenPulse from '../components/KitchenPulse'
import Squiggle from '../components/Squiggle'

const STEPS = [
  ['Order', 'Pick your food during class. Every item shows how long it takes right now.'],
  ['Pay', 'Pay on your phone. No counter, no change.'],
  ['Pick up', 'Walk in when your token turns ready. Show it, grab it, go.'],
]

// Shown on the first visit only; returning students go straight to the menu.
export default function Landing() {
  const s = useStore()
  const nav = useNavigate()
  if (s.seenIntro) return <Navigate to="/menu" replace />

  function start() {
    markIntroSeen()
    nav('/menu')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="mx-auto w-full max-w-md px-5 pt-6 flex-1">
        <p className="font-display text-2xl font-bold tracking-tight text-red">{APP_NAME}</p>
        <section className="relative mt-5 overflow-hidden rounded-[2rem] bg-red px-6 pt-10 pb-8 text-white">
          <Squiggle className="text-white/10" />
          <h1 className="relative font-display text-5xl font-bold leading-[0.95] tracking-tight">
            Skip the<br /><span className="outline-text">canteen</span><br />line.
          </h1>
          <p className="relative mt-5 max-w-[16rem] text-white/85">
            Order before the bell. Your food is ready when you get there.
          </p>
        </section>

        <ol className="mt-10 space-y-5">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-amber font-mono text-sm text-neutral-900">{i + 1}</span>
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{title}</p>
                <p className="mt-0.5 text-sm text-neutral-500">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <KitchenPulse loads={s.loads} minsLeft={s.minsLeft} />
      </main>

      <div className="sticky bottom-0 bg-white px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button onClick={start} className="mx-auto block w-full max-w-md h-14 rounded-full bg-neutral-900 text-white font-display text-lg font-semibold">
          Order now
        </button>
      </div>
    </div>
  )
}
