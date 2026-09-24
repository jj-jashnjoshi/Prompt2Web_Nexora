// Add button that becomes a − qty + stepper. `tone` = 'dark' on cream, 'light' on coloured cards.
export default function Qty({ qty, onChange, tone = 'dark', compact = false }) {
  const solid = tone === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
  if (!qty) {
    return (
      <button
        onClick={() => onChange(1)}
        aria-label="Add"
        className={`grid size-10 place-items-center rounded-full ink ${solid} active:scale-90 transition-transform`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    )
  }
  return (
    <div className={`h-10 flex items-center rounded-full font-semibold animate-pop ink ${solid}`}>
      <button onClick={() => onChange(qty - 1)} className={`${compact ? 'w-7' : 'w-9'} h-10 text-lg`} aria-label="Decrease">−</button>
      <span key={qty} className="w-5 text-center font-mono animate-pop">{qty}</span>
      <button onClick={() => onChange(qty + 1)} className={`${compact ? 'w-7' : 'w-9'} h-10 text-lg`} aria-label="Increase">+</button>
    </div>
  )
}
