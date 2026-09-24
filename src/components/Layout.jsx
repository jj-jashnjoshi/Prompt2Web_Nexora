import Header from './Header'
import TabBar from './TabBar'

// Shell for student pages: header, content, floating tabs. `bottom` sits just above the tabs.
export default function Layout({ s, children, bottom, band }) {
  return (
    <div className="min-h-dvh pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <Header minsLeft={s.minsLeft} />
      {band}
      <main className={`mx-auto max-w-md md:max-w-3xl px-5 ${bottom ? 'pb-40' : 'pb-8'}`}>{children}</main>
      {bottom && (
        <div className="fixed inset-x-0 z-10 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] px-4 pb-2 pt-6 bg-gradient-to-t from-white via-white/90 to-white/0">
          <div className="mx-auto max-w-md animate-rise">{bottom}</div>
        </div>
      )}
      <TabBar cartCount={s.cartCount} hasReady={s.hasReady} />
    </div>
  )
}
