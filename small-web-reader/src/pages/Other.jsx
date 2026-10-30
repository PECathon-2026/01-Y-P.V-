import { Link } from 'react-router-dom'
import { CloudDownload, Info } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import { EmptyState } from '../components/ui'
import { OfflineArticleCard } from '../components/FeedCard'
export function Offline() {
  const { s, articles } = useStore(); const list = articles.filter(a => s.offline[a.id])
  return <div className="space-y-5">
    <div><h1 className="text-2xl font-semibold">Offline Library</h1><p className="text-sm text-mute">{list.length} articles marked for offline</p></div>
    <p className="flex items-start gap-2 rounded-xl border border-line bg-panel p-3 text-xs text-mute"><Info size={16} className="mt-0.5 shrink-0 text-cy" />Demo status: this list tracks your choices in localStorage. Real offline storage (IndexedDB with full article text) is not connected yet, so content will not load without a network.</p>
    {list.length ? <div className="space-y-3">{list.map(a => <OfflineArticleCard key={a.id} a={a} />)}</div> : <EmptyState icon={CloudDownload} title="No offline articles" text="Open an article and choose “Save offline”, or use the cloud icon on any card." action={<Link to="/articles" className="text-cy">Browse articles</Link>} />}
  </div>
}
const Row = ({ t, d, children }) => <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-0"><div><p className="font-medium">{t}</p><p className="text-sm text-mute">{d}</p></div>{children}</div>
export function SettingsPage() {
  const { s, set } = useStore(); const reset = () => { if (confirm('Reset all demo data?')) { localStorage.clear(); location.href = '/' } }
  return <div className="max-w-2xl space-y-5"><h1 className="text-2xl font-semibold">Settings</h1>
    <div className="rounded-2xl border border-line bg-panel px-5">
      <Row t="Theme" d="Dark is the default."><select aria-label="Theme" value={s.theme} onChange={e => set({ theme: e.target.value })} className="h-10 rounded-xl border border-line bg-bg px-3 text-sm"><option value="dark">Dark</option><option value="light">Light</option></select></Row>
      <Row t="Reader theme" d="Applies inside the article reader."><select aria-label="Reader theme" value={s.rtheme} onChange={e => set({ rtheme: e.target.value })} className="h-10 rounded-xl border border-line bg-bg px-3 text-sm"><option>dark</option><option>light</option><option>sepia</option></select></Row>
      <Row t="Share anonymous subscriptions" d="Opt-in. Not connected yet: no data is sent anywhere."><input type="checkbox" aria-label="Share anonymous subscriptions" checked={s.sharing} onChange={e => set({ sharing: e.target.checked })} className="h-5 w-5 accent-violet-500" /></Row>
      <Row t="Reset demo data" d="Clears saved articles, feeds and preferences."><button onClick={reset} className="h-10 rounded-xl border border-red-500/50 px-4 text-sm text-red-400">Reset</button></Row>
    </div>
    <p className="text-sm text-mute">Built by Team V² Overdrive for PECathon 2026 · PS-003.</p></div>
}
