// Wavy line pattern from the brand boards. Fills its parent; colour via `className` (currentColor).
export default function Squiggle({ className = '' }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 size-full ${className}`} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" aria-hidden="true">
      <path d="M-20 60c40-40 80 40 120 0s80-40 120 0 80 40 120 0 80-40 120 0" />
      <path d="M-20 170c50 50 90-60 150-10s70 70 130 10 80-50 140 0" />
      <path d="M-20 290c40-50 90 30 130-10s90-60 140 0 60 60 150-10" />
      <path d="M60-20c-40 60 60 80 20 140" />
      <path d="M330 420c40-60-60-80-20-140" />
    </svg>
  )
}
