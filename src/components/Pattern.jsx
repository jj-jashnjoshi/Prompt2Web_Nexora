import Squiggle from './Squiggle'
import Halftone from './Halftone'

// Brand texture for colour blocks: wavy lines on red/amber, halftone dots on blue.
export default function Pattern({ blue = false, wave = 'opacity-10', dots = 'opacity-30' }) {
  return blue ? <Halftone className={dots} /> : <Squiggle className={wave} />
}
