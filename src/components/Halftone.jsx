// Retro print halftone: a dot grid that fades out from one corner. Colour via `className` (currentColor).
export default function Halftone({ className = '', at = '100% 0%', size = 12 }) {
  const mask = `radial-gradient(circle at ${at}, #000 0%, transparent 70%)`
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{
        backgroundImage: 'radial-gradient(currentColor 1.7px, transparent 2px)',
        backgroundSize: `${size}px ${size}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  )
}
