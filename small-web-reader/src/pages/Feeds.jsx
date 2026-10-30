import { useState } from 'react'
import { Search, Rss } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { CATS, RECS } from '../data/mock'
import { FeedCard, RecommendationCard, PrivacyNote, AddFeedModal, AddFeedButton } from '../components/FeedCard'
import { EmptyState } from '../components/ui'
export function Feeds() {
  const { feeds, s } = useStore(); const [add, setAdd] = useState(false); const list = feeds.filter(f => s.subs.includes(f.id))
  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">My Feeds</h1><p className="text-sm text-mute">{list.length} subscriptions</p></div><AddFeedButton onClick={() => setAdd(true)} /></div>
    {list.length ? <div className="grid gap-4 md:grid-cols-2">{list.map(f => <FeedCard key={f.id} f={f} />)}</div> : <EmptyState icon={Rss} title="No subscriptions yet" text="Add a feed URL or browse Discover to follow your first blog." action={<AddFeedButton onClick={() => setAdd(true)} />} />}
    {add && <AddFeedModal onClose={() => setAdd(false)} />}
  </div>
}
export function Discover() {
  const { feeds, s } = useStore(); const [q, setQ] = useState(''); const [cat, setCat] = useState('All'); const [add, setAdd] = useState(false)
  const list = feeds.filter(f => (cat === 'All' || f.cat === cat) && [f.name, f.desc, f.cat].join(' ').toLowerCase().includes(q.toLowerCase()))
  const recs = RECS.filter(r => !s.dismissed.includes(r.id) && !s.subs.includes(r.feed))
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Discover</h1><p className="text-sm text-mute">Find independent blogs and subscribe in one click.</p></div><AddFeedButton onClick={() => setAdd(true)} /></div>
    <section aria-labelledby="dr" className="space-y-3"><h2 id="dr" className="font-semibold">Recommended for you</h2><PrivacyNote />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{recs.map(r => <RecommendationCard key={r.id} r={r} />)}</div>
      {!recs.length && <p className="text-sm text-mute">No suggestions left for now.</p>}</section>
    <div className="relative"><label htmlFor="ds" className="sr-only">Search publications</label><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
      <input id="ds" value={q} onChange={e => setQ(e.target.value)} placeholder="Search blogs, publications and feeds" className="h-11 w-full rounded-xl border border-line bg-panel pl-10 pr-3 text-sm" /></div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">{['All', ...CATS].map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? 'border-acc bg-acc/15' : 'border-line text-mute hover:text-fg'}`}>{c}</button>)}</div>
    {list.length ? <div className="grid gap-4 md:grid-cols-2">{list.map(f => <FeedCard key={f.id} f={f} />)}</div> : <EmptyState title="No publications found" text="Try another category or add the feed URL yourself." action={<AddFeedButton onClick={() => setAdd(true)} />} />}
    {add && <AddFeedModal onClose={() => setAdd(false)} />}
  </div>
}
