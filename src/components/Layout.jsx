import Header from './Header'
import TabBar from './TabBar'

// Shell for student pages: header, content, bottom tabs. `bottom` sits just above the tabs.
export default function Layout({ s, children, bottom }) {
  return (
    <div className="min-h-dvh pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <Header minsLeft={s.minsLeft} />
      <main className={`mx-auto max-w-md px-5 ${bottom ? 'pb-40' : 'pb-8'}`}>{children}</main>
      {bottom && (
        <div className="fixed inset-x-0 z-10 bottom-[calc(4rem+env(safe-area-inset-bottom))] px-4 pb-3 pt-6 bg-gradient-to-t from-white via-white to-white/0">
          <div className="mx-auto max-w-md">{bottom}</div>
        </div>
      )}
      <TabBar cartCount={s.cartCount} hasReady={s.hasReady} />
    </div>
  )
}
