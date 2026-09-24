import Cloud from './Cloud'

// NextKitchen wordmark: spinning cloud mark + two-tone name.
export default function Logo({ size = 'text-2xl', mark = 'size-9' }) {
  return (
    <span className="flex items-center gap-2">
      <Cloud className={`${mark} animate-[spin_20s_linear_infinite]`} fill="fill-red" bumps={10}>
        <span className="block size-3 rounded-full bg-amber" />
      </Cloud>
      <span className={`font-display font-bold tracking-tight leading-none ${size}`}>
        <span className="text-red">next</span>kitchen
      </span>
    </span>
  )
}
