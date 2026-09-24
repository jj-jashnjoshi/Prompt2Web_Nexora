import { Link } from 'react-router-dom'
import { useStore } from '../useStore'
import { itemEta, isReadyNow } from '../eta'
import Layout from '../components/Layout'
import KitchenPulse from '../components/KitchenPulse'
import Halftone from '../components/Halftone'
import Cloud from '../components/Cloud'
import Marquee from '../components/Marquee'
import FoodIcon from '../components/FoodIcon'

const STEPS = [
  ['Order', 'Pick food in class. Every item shows its live wait.', 'bg-red text-white'],
  ['Pay', 'UPI on your phone. No counter, no change.', 'bg-amber text-neutral-900'],
  ['Grab', 'Token turns ready, walk in, show it, go.', 'bg-blue text-white'],
]

export default function Home() {
  const s = useStore()
  const readyNow = s.menu.filter((m) => m.inStock && isReadyNow(itemEta(m, s.loads)))

  return (
    <Layout s={s}>
      {/* Hero */}
      <section className="relative mt-2 overflow-hidden rounded-[2.25rem] bg-red px-6 pt-10 pb-24 text-white animate-rise ink ink-shadow">
        <Halftone className="text-white/50" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-amber">Campus canteen, minus the queue</p>
        <h1 className="relative mt-3 font-display text-[clamp(2.6rem,13vw,4.5rem)] font-bold leading-[0.9] tracking-tight">
          Grab<br />Your Meal<br /><span className="outline-text">Fatafat!</span>
        </h1>
        <FoodIcon id="fries" className="absolute right-3 bottom-6 size-20 sm:size-28 animate-float" />
        <FoodIcon id="cold-coffee" className="absolute right-20 sm:right-28 bottom-3 size-12 sm:size-16 animate-float [animation-delay:-2s]" />
        <Cloud className="absolute -left-3 -bottom-8 size-28 sm:size-32 -rotate-12" fill="fill-amber" stroke="stroke-neutral-900" bumps={12}>
          <p className="font-display text-3xl font-bold leading-none text-neutral-900">0<span className="text-base">min</span></p>
          <p className="text-[10px] font-bold uppercase text-neutral-900">in line</p>
        </Cloud>
      </section>

      <Link
        to="/menu"
        className="mt-6 flex h-16 items-center justify-between rounded-full bg-neutral-900 pl-7 pr-2 font-display text-xl font-bold text-white ink ink-shadow press"
      >
        Start my order
        <span className="grid size-12 place-items-center rounded-full bg-amber text-neutral-900 ink">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </Link>

      {readyNow.length > 0 && (
        <div className="mt-6 -mx-5">
          <Marquee items={readyNow.map((m) => `${m.name} ready now`)} className="bg-amber text-neutral-900 -rotate-1" />
        </div>
      )}

      <KitchenPulse loads={s.loads} minsLeft={s.minsLeft} />

      <h2 className="mt-8 font-display text-lg font-bold">How it works</h2>
      <ol className="mt-3 -mx-5 px-5 flex gap-4 overflow-x-auto snap-x pb-3 pr-6">
        {STEPS.map(([title, body, color], i) => (
          <li
            key={title}
            style={{ animationDelay: `${150 + i * 90}ms` }}
            className={`relative shrink-0 w-[70%] md:w-1/3 snap-start rounded-[2rem] p-5 animate-rise ink ink-shadow ${color}`}
          >
            <Halftone className="opacity-30" />
            <Cloud className="relative size-12" fill="fill-white" stroke="stroke-neutral-900" bumps={9}>
              <span className="font-display text-xl font-bold text-neutral-900">{i + 1}</span>
            </Cloud>
            <p className="relative mt-6 font-display text-3xl font-bold">{title}</p>
            <p className="relative mt-1 text-sm opacity-85">{body}</p>
          </li>
        ))}
      </ol>
    </Layout>
  )
}
