export default function Qty({ qty, onChange }) {
  if (!qty) {
    return (
      <button
        onClick={() => onChange(1)}
        className="h-8 px-4 rounded-full border-2 border-neutral-900 text-sm font-medium active:bg-neutral-100"
      >
        Add
      </button>
    )
  }
  return (
    <div className="h-8 flex items-center rounded-full bg-neutral-900 text-white text-sm">
      <button onClick={() => onChange(qty - 1)} className="w-8 h-8" aria-label="Decrease">−</button>
      <span className="w-4 text-center font-mono">{qty}</span>
      <button onClick={() => onChange(qty + 1)} className="w-8 h-8" aria-label="Increase">+</button>
    </div>
  )
}
