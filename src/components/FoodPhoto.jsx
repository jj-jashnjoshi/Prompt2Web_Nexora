import { useState } from 'react'
import FoodIcon from './FoodIcon'

// Real photos live in public/food/<id>.jpg. Items without one (or if it fails to load)
// fall back to the drawn illustration on a cream plate, framed the same way.
const PHOTOS = new Set(['dosa', 'maggi', 'samosa', 'vada-pav', 'fries', 'chai', 'cold-coffee'])

export default function FoodPhoto({ id, name, className = '' }) {
  const [broken, setBroken] = useState(false)
  if (PHOTOS.has(id) && !broken) {
    return <img src={`/food/${id}.jpg`} alt={name} loading="lazy" onError={() => setBroken(true)} className={`object-cover ${className}`} />
  }
  return (
    <span className={`grid place-items-center bg-white ${className}`}>
      <FoodIcon id={id} className="size-3/5" />
    </span>
  )
}
