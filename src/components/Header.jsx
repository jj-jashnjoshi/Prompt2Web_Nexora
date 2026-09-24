import { Link } from 'react-router-dom'
import { APP_NAME } from '../config'

export default function Header({ minsLeft }) {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-10 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="mx-auto max-w-md px-5 h-14 flex items-center justify-between">
        <Link to="/menu" className="font-display text-xl font-bold tracking-tight text-red">{APP_NAME}</Link>
        {minsLeft !== undefined && (
          <span className="text-xs text-neutral-500">
            Break ends in <span className="font-mono text-neutral-900">{minsLeft}m</span>
          </span>
        )}
      </div>
    </header>
  )
}
