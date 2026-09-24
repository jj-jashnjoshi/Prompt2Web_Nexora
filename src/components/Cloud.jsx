// Scalloped "cloud" shape from the brand logo, used for badges, stickers and tokens.
function scallop(cx, cy, rx, ry, n) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]
  })
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % n]
    const r = Math.hypot(x2 - x1, y2 - y1) / 2
    d += ` A${r} ${r} 0 0 1 ${x2} ${y2}`
  }
  return d + 'Z'
}

const PATHS = {}
function path(bumps, wide) {
  const key = bumps + (wide ? 'w' : '')
  return (PATHS[key] ??= wide ? scallop(100, 60, 84, 46, bumps) : scallop(60, 60, 50, 50, bumps))
}

export default function Cloud({ children, className = '', fill = 'fill-white', stroke = '', bumps = 12, wide = false }) {
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox={wide ? '0 0 200 120' : '0 0 120 120'} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d={path(bumps, wide)} className={`${fill} ${stroke}`} strokeWidth="6" strokeLinejoin="round" />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  )
}
