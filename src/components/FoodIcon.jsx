// Flat, chunky food illustrations in the brand palette (brown outline, red/amber/blue/cream fills).
const INK = '#4a1c13'
const RED = '#e4032e'
const AMBER = '#ffa200'
const BLUE = '#0a57a6'
const CREAM = '#f6efdc'

const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

const ART = {
  cone: ( // dosa
    <>
      <path {...S} fill={AMBER} d="M10 18 L54 18 L32 58 Z" />
      <path {...S} fill="none" d="M18 26 L46 26 M22 34 L42 34" opacity=".5" />
      <ellipse {...S} fill={CREAM} cx="32" cy="16" rx="23" ry="6" />
      <circle fill={RED} cx="24" cy="15" r="2.5" /><circle fill={RED} cx="38" cy="16" r="2.5" />
    </>
  ),
  bowl: ( // maggi, poha
    <>
      <path {...S} fill="none" stroke={AMBER} strokeWidth="4" d="M16 30 q4 -10 8 0 t8 0 t8 0 t8 0" />
      <path {...S} fill={RED} d="M6 30 H58 A26 22 0 0 1 6 30 Z" />
      <path {...S} fill="none" d="M20 44 q12 6 24 0" opacity=".5" />
      <path {...S} fill="none" d="M40 8 L50 30 M46 6 L54 28" />
    </>
  ),
  roll: ( // paneer roll
    <>
      <rect {...S} fill={AMBER} x="12" y="10" width="22" height="46" rx="11" transform="rotate(-30 23 33)" />
      <rect {...S} fill={RED} x="30" y="14" width="22" height="42" rx="6" transform="rotate(-30 41 35)" />
      <path {...S} fill="none" stroke={CREAM} d="M34 30 l12 -6 M38 38 l12 -6" />
    </>
  ),
  sandwich: (
    <>
      <path {...S} fill={CREAM} d="M8 48 L32 10 L56 48 Z" />
      <path {...S} fill="#6fbf4a" d="M10 44 H54 L56 48 H8 Z" />
      <path {...S} fill={RED} d="M14 38 H50 L53 43 H11 Z" />
      <path {...S} fill={AMBER} d="M8 48 H56 V54 H8 Z" />
    </>
  ),
  samosa: (
    <>
      <path {...S} fill={AMBER} d="M8 50 Q32 2 56 50 Q32 58 8 50 Z" />
      <path {...S} fill="none" d="M32 14 L32 52" opacity=".5" />
      <circle fill={INK} cx="22" cy="40" r="1.6" /><circle fill={INK} cx="42" cy="38" r="1.6" /><circle fill={INK} cx="30" cy="30" r="1.6" />
    </>
  ),
  bun: ( // vada pav
    <>
      <path {...S} fill={AMBER} d="M10 30 A22 16 0 0 1 54 30 Z" />
      <circle {...S} fill="#b86a1d" cx="32" cy="36" r="10" />
      <path {...S} fill={RED} d="M8 40 H56" strokeWidth="5" stroke={RED} />
      <path {...S} fill={AMBER} d="M10 44 H54 A22 10 0 0 1 10 44 Z" />
      <circle fill={INK} cx="24" cy="22" r="1.4" /><circle fill={INK} cx="36" cy="20" r="1.4" /><circle fill={INK} cx="44" cy="25" r="1.4" />
    </>
  ),
  fries: (
    <>
      {[16, 23, 30, 37, 44].map((x, i) => (
        <rect key={x} {...S} fill={AMBER} x={x} y={6 + (i % 2) * 6} width="6" height="30" rx="2" />
      ))}
      <path {...S} fill={RED} d="M10 26 H54 L48 58 H16 Z" />
      <path {...S} fill="none" stroke={CREAM} d="M26 38 q6 6 12 0" />
    </>
  ),
  cup: ( // chai
    <>
      <path {...S} fill="none" d="M24 6 q-4 6 0 10 t0 10 M34 4 q-4 6 0 10 t0 10" opacity=".6" />
      <path {...S} fill={CREAM} d="M14 26 H46 L42 56 H18 Z" />
      <path {...S} fill={AMBER} d="M15 32 H45 L43 44 H17 Z" stroke="none" />
      <path {...S} fill="none" d="M14 26 H46 L42 56 H18 Z" />
      <path {...S} fill="none" d="M46 32 q10 2 4 12 l-6 2" />
    </>
  ),
  tall: ( // cold coffee, lime soda
    <>
      <path {...S} fill="none" stroke={RED} strokeWidth="4" d="M38 4 L32 30" />
      <path {...S} fill={BLUE} d="M18 18 H46 L42 58 H22 Z" />
      <path {...S} fill={CREAM} d="M18 18 H46 L45 26 H19 Z" />
      <circle {...S} fill="#b7d63b" cx="44" cy="18" r="7" />
      <path {...S} fill="none" stroke={CREAM} d="M26 36 v14" opacity=".6" />
    </>
  ),
}

const KIND = {
  dosa: 'cone', maggi: 'bowl', poha: 'bowl', 'paneer-roll': 'roll', sandwich: 'sandwich',
  samosa: 'samosa', 'vada-pav': 'bun', fries: 'fries', chai: 'cup', 'cold-coffee': 'tall', 'lime-soda': 'tall',
}

export default function FoodIcon({ id, className = 'size-16' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {ART[KIND[id] || 'bowl']}
    </svg>
  )
}
