import { Link } from 'react-router-dom'
import { Bookmark, Clock, CloudDownload, Check, SearchX } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { fmtDate } from '../api/api'
import { EmptyState, LoadingState } from './ui'
export const hueBg = h => ({ background: `linear-gradient(135deg, hsl(${h} 65% 42%), hsl(${(h + 50) % 360} 70% 28%))` })
export function ArticleCard({ a }) {
  const { s, flip, toggleOffline, feedMap } = useStore(); const f = feedMap[a.feed]
  const read = s.read.includes(a.id), saved = s.saved.includes(a.id), off = !!s.offline[a.id]
  return <article className={`flex gap-4 rounded-2xl border border-line bg-panel p-4 transition hover:border-acc/60 sm:p-5 ${read ? 'opacity-75' : ''}`}>
    <div aria-hidden className="hidden h-28 w-28 shrink-0 place-items-center rounded-xl text-3xl font-semibold text-white sm:grid" style={hueBg(f?.hue ?? 250)}>{f?.name[0]}</div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-x-2 text-xs text-mute">
        <span title={read ? 'Read' : 'Unread'} className={`h-2 w-2 rounded-full ${read ? 'bg-line' : 'bg-cy'}`} /><span className="sr-only">{read ? 'Read' : 'Unread'}</span>
        <span className="font-medium text-fg">{f?.name}</span><span>{a.author}</span><span>{fmtDate(a.date)}</span>
        <span className="inline-flex items-center gap-1"><Clock size={12} />{a.mins} min</span>
      </div>
      <h3 className="mt-1.5 text-lg font-semibold leading-snug"><Link to={`/read/${a.id}`} className="hover:text-acc">{a.title}</Link></h3>
      <p className="mt-1 line-clamp-2 text-sm text-mute">{a.excerpt}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {a.tags.map(t => <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-mute">{t}</span>)}
        <span className="ml-auto flex items-center gap-1">
          <button onClick={() => flip('read', a.id)} aria-label={read ? 'Mark as unread' : 'Mark as read'} className="grid h-9 w-9 place-items-center rounded-lg text-mute hover:bg-line/50"><Check size={17} className={read ? 'text-cy' : ''} /></button>
          <button onClick={() => toggleOffline(a.id)} aria-pressed={off} aria-label={off ? 'Remove from offline library' : 'Save to offline library'} className="grid h-9 w-9 place-items-center rounded-lg text-mute hover:bg-line/50"><CloudDownload size={17} className={off ? 'text-cy' : ''} /></button>
          <button onClick={() => flip('saved', a.id)} aria-pressed={saved} aria-label={saved ? 'Remove bookmark' : 'Bookmark article'} className="grid h-9 w-9 place-items-center rounded-lg text-mute hover:bg-line/50"><Bookmark size={17} className={saved ? 'fill-acc text-acc' : ''} /></button>
          <Link to={`/read/${a.id}`} className="ml-1 rounded-lg bg-acc px-3 py-2 text-sm font-medium text-white hover:brightness-110">Read Article</Link>
        </span>
      </div>
    </div>
  </article>
}
export function ArticleList({ items, empty }) {
  const { status, reload } = useStore()
  if (status === 'loading') return <LoadingState />
  if (status === 'error') return <EmptyState title="Could not load articles" text="Check your connection and try again." action={<button onClick={reload} className="rounded-xl bg-acc px-4 py-2 text-sm text-white">Retry</button>} />
  if (!items.length) return empty || <EmptyState icon={SearchX} title="No articles found" text="Try a different search or clear your filters." />
  return <div className="space-y-3">{items.map(a => <ArticleCard key={a.id} a={a} />)}</div>
}
const sel = 'h-10 rounded-xl border border-line bg-panel px-3 text-sm'
export function FilterPanel({ f, setF, lockStatus, onClear }) {
  const on = (k, v) => setF({ ...f, [k]: v })
  return <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters and sorting">
    {!lockStatus && <select aria-label="Status" className={sel} value={f.status} onChange={e => on('status', e.target.value)}><option value="all">All status</option><option value="unread">Unread</option><option value="saved">Saved</option></select>}
    <select aria-label="Date" className={sel} value={f.date} onChange={e => on('date', e.target.value)}><option value="any">Any date</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>
    <select aria-label="Sort" className={sel} value={f.sort} onChange={e => on('sort', e.target.value)}><option value="new">Newest</option><option value="old">Oldest</option><option value="time">Reading time</option></select>
    <button onClick={onClear} className="h-10 rounded-xl px-3 text-sm text-mute hover:text-fg">Clear filters</button>
  </div>
}
