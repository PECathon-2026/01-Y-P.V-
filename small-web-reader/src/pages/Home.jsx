import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { ArticleList } from '../components/ArticleCard'
import { RecommendationCard, PrivacyNote, AddFeedModal, AddFeedButton } from '../components/FeedCard'
import { RECS } from '../data/mock'
export default function Home() {
  const { s, mine, articles, feedMap } = useStore(); const [add, setAdd] = useState(false)
  const unread = mine.filter(a => !s.read.includes(a.id))
  const cont = mine.filter(a => s.progress[a.id] > 0 && !s.read.includes(a.id))[0]
  const topics = Object.entries(mine.flatMap(a => a.tags).reduce((m, t) => ({ ...m, [t]: (m[t] || 0) + 1 }), {})).slice(0, 8)
  const recs = RECS.filter(r => !s.dismissed.includes(r.id) && !s.subs.includes(r.feed)).slice(0, 3)
  const stats = [['Articles', mine.length], ['Unread', unread.length], ['Saved', s.saved.length], ['Feeds', s.subs.length]]
  const readList = articles.filter(a => s.read.includes(a.id))
  return <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
    <div className="min-w-0 space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your corner of the open web.</h1><p className="mt-2 text-mute">Read what matters. Discover what’s next.</p></div>
        <AddFeedButton onClick={() => setAdd(true)} />
      </section>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(([l, n]) => <div key={l} className="rounded-2xl border border-line bg-panel p-4"><p className="text-2xl font-semibold">{n}</p><p className="text-sm text-mute">{l}</p></div>)}</section>
      {cont && <section aria-labelledby="cr"><h2 id="cr" className="mb-3 text-lg font-semibold">Continue Reading</h2>
        <Link to={`/read/${cont.id}`} className="block rounded-2xl border border-acc/40 bg-panel p-5 hover:border-acc"><p className="text-xs text-mute">{feedMap[cont.feed]?.name} · {cont.mins} min</p><p className="mt-1 text-lg font-semibold">{cont.title}</p>
          <div className="mt-3 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-gradient-to-r from-acc to-cy" style={{ width: `${s.progress[cont.id]}%` }} /></div><p className="mt-1 text-xs text-mute">{Math.round(s.progress[cont.id])}% read</p></Link></section>}
      <section aria-labelledby="lf"><h2 id="lf" className="mb-3 text-lg font-semibold">Latest from Your Feeds</h2><ArticleList items={mine.slice(0, 5)} /></section>
      <section aria-labelledby="rf"><h2 id="rf" className="mb-3 text-lg font-semibold">Recommended for You</h2>
        <div className="mb-3"><PrivacyNote /></div>
        <div className="grid gap-3 md:grid-cols-3">{recs.map(r => <RecommendationCard key={r.id} r={r} />)}</div>
        {!recs.length && <p className="text-sm text-mute">No suggestions left. Visit Discover to browse more.</p>}</section>
    </div>
    <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start" aria-label="Reading insights">
      <div className="rounded-2xl border border-line bg-panel p-5"><h2 className="font-semibold">Reading stats</h2>
        <p className="mt-2 text-sm text-mute">{readList.length} read · {readList.reduce((t, a) => t + a.mins, 0)} min total</p></div>
      <div className="rounded-2xl border border-line bg-panel p-5"><h2 className="font-semibold">Trending in your feeds</h2>
        <div className="mt-3 flex flex-wrap gap-2">{topics.map(([t]) => <Link key={t} to={`/articles?q=${t}`} className="rounded-full border border-line px-3 py-1 text-xs text-mute hover:text-fg">{t}</Link>)}</div></div>
    </aside>
    {add && <AddFeedModal onClose={() => setAdd(false)} />}
  </div>
}
