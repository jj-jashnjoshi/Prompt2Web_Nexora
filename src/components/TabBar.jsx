import { NavLink } from 'react-router-dom'

const icon = {
  menu: <path d="M4 6h16M4 12h16M4 18h10" />,
  cart: <path d="M3 4h2l2.4 11h11.2L21 7H6.2M9 20h.01M18 20h.01" />,
  orders: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
}

function Tab({ to, label, name, badge, dot }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `relative flex-1 flex flex-col items-center justify-center gap-1 ${isActive ? 'text-red' : 'text-neutral-400'}`}
    >
      <span className="relative">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {icon[name]}
        </svg>
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-neutral-900 text-white text-[10px] font-mono leading-4 text-center">
            {badge}
          </span>
        )}
        {dot && <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-amber ring-2 ring-white animate-pulse" />}
      </span>
      <span className="text-[11px] font-medium">{label}</span>
    </NavLink>
  )
}

export default function TabBar({ cartCount, hasReady }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-neutral-100 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md h-16 flex">
        <Tab to="/menu" label="Menu" name="menu" />
        <Tab to="/cart" label="Cart" name="cart" badge={cartCount} />
        <Tab to="/orders" label="Orders" name="orders" dot={hasReady} />
      </div>
    </nav>
  )
}
