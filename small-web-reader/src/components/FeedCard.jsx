import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, ShieldCheck, Eye, Trash2, WifiOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { addFeed, ago, fmtDate } from '../api/api'
import { hueBg } from './ArticleCard'
import { Btn, Spinner } from './ui'
export function FeedCard({ f }) {
  const { s, flip, articles } = useStore(); const [peek, setPeek] = useState(false)
  const on = s.subs.includes(f.id); const latest = articles.find(a => a.feed === f.id)
  return <div className="rounded-2xl border border-line bg-panel p-5">
    <div className="flex items-start gap-3">
      <div aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-semibold text-white" style={hueBg(f.hue)}>{f.name[0]}</div>
      <div className="min-w-0 flex-1"><h3 className="font-semibold">{f.name}</h3><span className="text-xs text-mute">{f.cat}</span></div>
      <Btn primary={!on} onClick={() => flip('subs', f.id)} aria-pressed={on}>{on ? 'Unsubscribe' : 'Subscribe'}</Btn>
    </div>
    <p className="mt-3 text-sm text-mute">{f.desc}</p>
    <p className="mt-3 line-clamp-1 text-sm"><span className="text-mute">Latest: </span>{latest ? latest.title : 'No articles yet'}</p>
    <div className="mt-3 flex gap-2">
      <button onClick={() => setPeek(!peek)} aria-expanded={peek} className="inline-flex items-center gap-1.5 text-sm text-cy hover:underline"><Eye size={15} />{peek ? 'Hide preview' : 'Preview feed'}</button>
      {on && <Link to={`/articles?feed=${f.id}`} className="ml-auto text-sm text-mute hover:text-fg">View articles</Link>}
    </div>
    {peek && <div className="mt-3 space-y-2 rounded-xl bg-bg p-3 text-sm">
      {articles.filter(a => a.feed === f.id).slice(0, 2).map(a => <Link key={a.id} to={`/read/${a.id}`} className="block hover:text-acc"><b>{a.title}</b><span className="block text-xs text-mute">{fmtDate(a.date)} · {a.mins} min</span></Link>)}
      {!articles.some(a => a.feed === f.id) && <p className="text-mute">Nothing to preview. Real parsing needs the backend.</p>}
    </div>}
  </div>
}
export function RecommendationCard({ r }) {
  const { feedMap, flip, set } = useStore(); const f = feedMap[r.feed]
  return <div className="rounded-2xl border border-line bg-panel p-4">
    <div className="flex items-start gap-3">
      <div aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-semibold text-white" style={hueBg(f.hue)}>{f.name[0]}</div>
      <div className="min-w-0 flex-1"><h4 className="font-semibold">{f.name}</h4><p className="text-xs text-mute">{f.cat}</p></div>
      <button onClick={() => set(o => ({ dismissed: [...o.dismissed, r.id] }))} aria-label={`Dismiss ${f.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-mute hover:bg-line/50"><X size={16} /></button>
    </div>
    <p className="mt-3 text-sm text-mute">{r.reason}</p>
    <div className="mt-3 flex items-center gap-2"><Btn primary className="h-9" onClick={() => flip('subs', f.id)}>Subscribe</Btn><span className="rounded-full border border-cy/40 px-2 py-0.5 text-xs text-cy">Sample suggestion</span></div>
  </div>
}
export const PrivacyNote = () => <p className="flex items-start gap-2 rounded-xl border border-line bg-panel p-3 text-xs text-mute"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-cy" />Recommendations are built from anonymous feed overlap only: no accounts, no personal data. The suggestions shown here are labelled mock data until the discovery API is connected.</p>
export function OfflineArticleCard({ a }) {
  const { s, toggleOffline, feedMap } = useStore()
  return <div className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-4">
    <div className="min-w-0 flex-1">
      <Link to={`/read/${a.id}`} className="line-clamp-1 font-semibold hover:text-acc">{a.title}</Link>
      <p className="text-xs text-mute">{feedMap[a.feed]?.name} · {a.mins} min · synced {ago(new Date(s.offline[a.id]).toISOString())}</p>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-cy/40 px-2 py-0.5 text-xs text-cy"><WifiOff size={12} />Marked for offline (demo)</span>
    </div>
    <button onClick={() => toggleOffline(a.id)} aria-label={`Remove ${a.title} from offline`} className="grid h-10 w-10 place-items-center rounded-xl text-mute hover:bg-line/50 hover:text-red-400"><Trash2 size={18} /></button>
  </div>
}
export function AddFeedModal({ onClose }) {
  const { feeds, set } = useStore(); const [url, setUrl] = useState(''); const [st, setSt] = useState('idle'); const [msg, setMsg] = useState('')
  const submit = async e => {
    e.preventDefault(); setSt('loading')
    try { const f = await addFeed(url, feeds); set(o => ({ custom: [...o.custom, f], subs: [...o.subs, f.id] })); setSt('ok'); setMsg(`Added ${f.name}.`) }
    catch (err) { setSt('err'); setMsg(err.message) }
  }
  return <div role="dialog" aria-modal="true" aria-labelledby="afh" className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onKeyDown={e => e.key === 'Escape' && onClose()}>
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-line bg-panel p-6">
      <div className="flex items-center justify-between"><h2 id="afh" className="text-lg font-semibold">Add a feed</h2><button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      <label htmlFor="fu" className="mt-4 block text-sm text-mute">Site or RSS/Atom URL</label>
      <input id="fu" autoFocus required value={url} onChange={e => { setUrl(e.target.value); setSt('idle') }} placeholder="https://example.com/feed.xml" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm" />
      <div aria-live="polite" className="mt-3 min-h-6 text-sm">
        {st === 'err' && <p className="flex items-center gap-2 text-red-400"><AlertCircle size={16} />{msg}</p>}
        {st === 'ok' && <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={16} />{msg}</p>}
      </div>
      <p className="mt-2 text-xs text-mute">Demo mode: the URL is validated and saved locally. Fetching and parsing need the backend.</p>
      <div className="mt-5 flex justify-end gap-2"><Btn type="button" onClick={onClose}>{st === 'ok' ? 'Done' : 'Cancel'}</Btn><Btn primary type="submit" disabled={st === 'loading'}>{st === 'loading' ? <><Spinner />Checking…</> : 'Add feed'}</Btn></div>
    </form>
  </div>
}
export const AddFeedButton = ({ onClick }) => <Btn primary onClick={onClick}><Plus size={16} />Add feed</Btn>
