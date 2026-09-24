import { isReadyNow } from '../eta'

export default function Eta({ eta, minsLeft }) {
  if (isReadyNow(eta)) return <span className="text-xs font-medium text-accent">Ready now</span>
  const late = eta > minsLeft
  return (
    <span className={`text-xs font-mono ${late ? 'text-neutral-900 underline decoration-accent decoration-2 underline-offset-2' : 'text-neutral-500'}`}>
      ~{eta} min
    </span>
  )
}
