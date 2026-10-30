import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Home, Newspaper, MailOpen, Bookmark, Rss, Compass, CloudDownload, Settings, Search, Sun, Moon, Bell, Menu, X, PanelLeft, Loader2, Inbox, Radio } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { ago } from '../api/api'

export function ThemeToggle() {
  const { s, set } = useStore(); const dark = s.theme === 'dark'
  return <button onClick={() => set({ theme: dark ? 'light' : 'dark' })} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel text-mute transition hover:text-fg">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
}
export function SearchBar({ className = '' }) {
  const nav = useNavigate(); const ref = useRef(); const [v, setV] = useState('')
  useEffect(() => { const k = e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); ref.current?.focus() } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  return <form role="search" className={`relative ${className}`} onSubmit={e => { e.preventDefault(); nav(`/articles?q=${encodeURIComponent(v)}`) }}>
    <label htmlFor="gs" className="sr-only">Search articles</label>
    <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
    <input id="gs" ref={ref} value={v} onChange={e => setV(e.target.value)} placeholder="Search title, blog, author or topic  ( / )" className="h-10 w-full rounded-xl border border-line bg-panel pl-10 pr-3 text-sm placeholder:text-mute" />
  </form>
}
const NAV = [['/', 'Home', Home], ['/articles', 'All Articles', Newspaper], ['/unread', 'Unread', MailOpen], ['/saved', 'Saved', Bookmark], ['/feeds', 'My Feeds', Rss], ['/discover', 'Discover', Compass], ['/offline', 'Offline Library', CloudDownload], ['/settings', 'Settings', Settings]]
export function Sidebar({ collapsed, setCollapsed, open, close }) {
  const { s, mine } = useStore(); const unread = mine.filter(a => !s.read.includes(a.id)).length
  return <>
    {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={close} />}
    <aside aria-label="Primary" className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-panel p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-acc text-white"><Radio size={18} /></span>
          <span className={collapsed ? 'lg:hidden' : ''}>Small Web Reader</span>
        </Link>
        <button onClick={close} aria-label="Close menu" className="lg:hidden"><X size={20} /></button>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={close} title={label}
          className={({ isActive }) => `flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${isActive ? 'bg-acc/15 text-fg ring-1 ring-acc/50' : 'text-mute hover:bg-line/50 hover:text-fg'}`}>
          <Icon size={18} className="shrink-0" /><span className={`flex-1 ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
          {label === 'Unread' && unread > 0 && <span className={`rounded-full bg-cy/20 px-2 text-xs text-cy ${collapsed ? 'lg:hidden' : ''}`}>{unread}</span>}
        </NavLink>)}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar" className="hidden h-10 items-center gap-3 rounded-xl px-3 text-sm text-mute hover:text-fg lg:flex"><PanelLeft size={18} /><span className={collapsed ? 'hidden' : ''}>Collapse</span></button>
      <p className={`mt-2 px-1 text-xs text-mute ${collapsed ? 'lg:hidden' : ''}`}>Team V² Overdrive · PECathon 2026</p>
    </aside>
  </>
}
export function Topbar({ onMenu }) {
  const { mine, feedMap } = useStore(); const [n, setN] = useState(false)
  return <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur sm:px-6">
    <button onClick={onMenu} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel lg:hidden"><Menu size={18} /></button>
    <SearchBar className="max-w-xl flex-1" />
    <div className="ml-auto flex items-center gap-2">
      <ThemeToggle />
      <div className="relative">
        <button onClick={() => setN(!n)} aria-label="Notifications" aria-expanded={n} className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel text-mute hover:text-fg"><Bell size={18} /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-cy" /></button>
        {n && <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-line bg-panel p-3 shadow-2xl">
          <p className="mb-2 px-1 text-sm font-semibold">New in your feeds</p>
          {mine.slice(0, 3).map(a => <Link key={a.id} to={`/read/${a.id}`} onClick={() => setN(false)} className="block rounded-lg p-2 text-sm hover:bg-line/50"><span className="line-clamp-1">{a.title}</span><span className="text-xs text-mute">{feedMap[a.feed]?.name} · {ago(a.date)}</span></Link>)}
        </div>}
      </div>
      <Link to="/settings" aria-label="Profile and settings" className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-acc to-cy text-sm font-semibold text-white">V²</Link>
    </div>
  </header>
}
export const EmptyState = ({ icon: Icon = Inbox, title, text, action }) => <div className="grid place-items-center rounded-2xl border border-dashed border-line px-6 py-14 text-center"><Icon className="mb-3 text-mute" size={30} /><h3 className="font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-mute">{text}</p>{action && <div className="mt-4">{action}</div>}</div>
export const LoadingState = ({ label = 'Loading articles…' }) => <div role="status" className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl border border-line bg-panel" />)}<span className="sr-only">{label}</span></div>
export const Spinner = () => <Loader2 className="animate-spin" size={16} />
export const Btn = ({ primary, className = '', ...p }) => <button {...p} className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition disabled:opacity-50 ${primary ? 'bg-acc text-white hover:brightness-110' : 'border border-line bg-panel hover:border-acc/60'} ${className}`} />
