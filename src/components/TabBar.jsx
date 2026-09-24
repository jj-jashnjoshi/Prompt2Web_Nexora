import { NavLink } from 'react-router-dom'

const icon = {
  home: <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />,
  menu: <path d="M4 13h16a8 8 0 0 1-16 0zM7 9c0-2 2-2 2-4M12 9c0-2 2-2 2-4M17 9c0-2 2-2 2-4" />,
  cart: <path d="M3 4h2l2.4 11h11.2L21 7H6.2M9 20h.01M18 20h.01" />,
  orders: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
}

function Tab({ to, label, name, badge, dot, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex-1 flex flex-col items-center justify-center gap-0.5 rounded-full transition-colors ${isActive ? 'bg-amber text-neutral-900' : 'text-white/70'}`
      }
    >
      <span className="relative">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon[name]}
        </svg>
        {badge > 0 && (
          <span key={badge} className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-red text-white text-[11px] font-mono leading-5 text-center animate-pop">
            {badge}
          </span>
        )}
        {dot && <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red ring-2 ring-neutral-900 animate-pulse" />}
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </NavLink>
  )
}

// Floating pill nav — the 4 pages of the student site.
export default function TabBar({ cartCount, hasReady }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md h-16 p-1.5 flex gap-1 rounded-full bg-neutral-900 ink-shadow">
        <Tab to="/" end label="Home" name="home" />
        <Tab to="/menu" label="Menu" name="menu" />
        <Tab to="/cart" label="Cart" name="cart" badge={cartCount} />
        <Tab to="/orders" label="Orders" name="orders" dot={hasReady} />
      </div>
    </nav>
  )
}
