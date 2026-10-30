import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Check, ChevronLeft, ChevronRight, CloudDownload, ExternalLink, Minus, Plus } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { fmtDate } from '../api/api'
import { EmptyState, LoadingState } from '../components/ui'
const TH = { dark: ['#101016', '#e6e6ee', '#9d9db3'], light: ['#ffffff', '#1a1a22', '#5d5d73'], sepia: ['#f4ecd8', '#433422', '#7a6a52'] }
export default function Reader() {
  const { id } = useParams(); const nav = useNavigate(); const { s, set, flip, toggleOffline, articles, mine, feedMap, status } = useStore()
  const [pct, setPct] = useState(0); const ref = useRef(0)
  const a = articles.find(x => x.id === id)
  useEffect(() => {
    window.scrollTo(0, 0); ref.current = 0; setPct(0)
    const on = () => { const h = document.documentElement; const p = Math.min(100, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100); ref.current = p; setPct(p) }
    addEventListener('scroll', on, { passive: true })
    return () => { removeEventListener('scroll', on); if (ref.current > 1) set(o => ({ progress: { ...o.progress, [id]: ref.current } })) }
  }, [id, set])
  if (status === 'loading') return <LoadingState label="Loading article…" />
  if (!a) return <EmptyState title="Article not found" text="It may have been removed from your feeds." action={<Link className="text-cy" to="/articles">Back to feed</Link>} />
  const f = feedMap[a.feed]; const list = mine.some(x => x.id === id) ? mine : articles; const i = list.findIndex(x => x.id === id)
  const prev = list[i - 1], next = list[i + 1]; const [bg, fg, mute] = TH[s.rtheme]
  const read = s.read.includes(id), saved = s.saved.includes(id), off = !!s.offline[id]
  const tb = 'inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border border-line bg-panel px-3 text-sm'
  const ib = { display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: mute + '66', background: 'transparent', color: fg }
  return <div>
    <div className="fixed left-0 right-0 top-0 z-50 h-1"><div className="h-full bg-gradient-to-r from-acc to-cy" style={{ width: `${pct}%` }} role="progressbar" aria-label="Reading progress" aria-valuenow={Math.round(pct)} /></div>
    <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center gap-2">
      <button onClick={() => nav(-1)} className={tb}><ArrowLeft size={16} />Back to feed</button>
      <span className="ml-auto flex flex-wrap gap-2">
        <button className={tb} aria-label="Decrease font size" onClick={() => set({ size: Math.max(15, s.size - 1) })}><Minus size={16} /></button>
        <button className={tb} aria-label="Increase font size" onClick={() => set({ size: Math.min(26, s.size + 1) })}><Plus size={16} /></button>
        {['dark', 'light', 'sepia'].map(t => <button key={t} aria-pressed={s.rtheme === t} onClick={() => set({ rtheme: t })} className={`${tb} capitalize ${s.rtheme === t ? 'ring-2 ring-acc' : ''}`}>{t}</button>)}
      </span>
    </div>
    <article className="mx-auto max-w-3xl rounded-3xl px-6 py-10 sm:px-14 sm:py-14" style={{ background: bg, color: fg }}>
      <p className="text-sm font-medium" style={{ color: mute }}>{f?.name} · {a.author ? `By ${a.author} · ` : ''}{fmtDate(a.date)} · {a.mins} min read</p>
      <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ fontFamily: 'Georgia, serif' }}>{a.title}</h1>
      <p className="mt-5 text-xl leading-relaxed" style={{ color: mute, fontFamily: 'Georgia, serif' }}>{a.excerpt}</p>
      <div className="my-8 flex flex-wrap gap-2 border-y py-4" style={{ borderColor: mute + '55' }}>
        <button className={tb} style={ib} onClick={() => flip('saved', id)} aria-pressed={saved}><Bookmark size={16} className={saved ? 'fill-current' : ''} />{saved ? 'Saved' : 'Bookmark'}</button>
        <button className={tb} style={ib} onClick={() => flip('read', id)} aria-pressed={read}><Check size={16} />{read ? 'Mark as unread' : 'Mark as read'}</button>
        <button className={tb} style={ib} onClick={() => toggleOffline(id)} aria-pressed={off}><CloudDownload size={16} />{off ? 'Remove offline' : 'Save offline'}</button>
      </div>
      <div className="space-y-6" style={{ fontFamily: 'Georgia, serif', fontSize: s.size, lineHeight: 1.8, maxWidth: '62ch', margin: '0 auto' }}>{a.body.map((p, k) => <p key={k}>{p}</p>)}</div>
      <p className="mt-10 text-xs" style={{ color: mute }}>Sample article for demo purposes.</p>
      <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm underline" style={{ color: mute }}><ExternalLink size={14} />View original source</a>
    </article>
    <nav aria-label="Article navigation" className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-3">
      {prev ? <Link to={`/read/${prev.id}`} className="flex items-center gap-2 rounded-2xl border border-line bg-panel p-4 text-sm hover:border-acc"><ChevronLeft size={18} /><span className="line-clamp-2">{prev.title}</span></Link> : <span />}
      {next ? <Link to={`/read/${next.id}`} className="flex items-center justify-end gap-2 rounded-2xl border border-line bg-panel p-4 text-right text-sm hover:border-acc"><span className="line-clamp-2">{next.title}</span><ChevronRight size={18} /></Link> : <span />}
    </nav>
  </div>
}
