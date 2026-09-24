// Endless scrolling text band, like the "TOO GOOD TO RESIST" poster.
function Star() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-current" aria-hidden="true">
      <path d="M12 0l2.6 8.4L23 6l-6 6 6 6-8.4-2.4L12 24l-2.6-8.4L1 18l6-6-6-6 8.4 2.4z" />
    </svg>
  )
}

export default function Marquee({ items, className = 'bg-neutral-900 text-white', speed = 'animate-marquee' }) {
  const row = (
    <div className="flex shrink-0 items-center gap-5 pr-5">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-5">
          <span className={i % 2 ? 'outline-text' : ''}>{t}</span>
          <Star />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`overflow-hidden py-2.5 font-display text-lg font-bold uppercase tracking-wide ${className}`}>
      <div className={`flex w-max ${speed}`}>
        {row}{row}{row}{row}
      </div>
    </div>
  )
}
