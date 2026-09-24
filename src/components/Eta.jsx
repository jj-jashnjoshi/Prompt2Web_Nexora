import { isReadyNow } from '../eta'

export default function Eta({ eta, minsLeft }) {
  if (isReadyNow(eta)) {
    return <span className="rounded-full bg-amber px-2 py-0.5 text-[11px] font-semibold text-neutral-900">Ready now</span>
  }
  const late = eta > minsLeft
  return (
    <span className={`text-xs font-mono ${late ? 'text-red' : 'text-neutral-500'}`}>
      ~{eta} min{late && ' · after bell'}
    </span>
  )
}
