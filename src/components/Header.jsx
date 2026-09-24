import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Header({ minsLeft }) {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-10 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-md md:max-w-3xl px-5 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Home"><Logo /></Link>
        {minsLeft !== undefined && (
          <span className="flex items-center gap-2 rounded-full bg-neutral-900 pl-3 pr-1 py-1 text-xs font-semibold text-white">
            Bell in
            <span className="rounded-full bg-amber px-2 py-0.5 font-mono text-neutral-900">{minsLeft}m</span>
          </span>
        )}
      </div>
    </header>
  )
}
