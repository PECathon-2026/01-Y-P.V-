import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { FEEDS } from '../data/mock'
import { loadArticles } from '../api/api'
const KEY = 'swr-v2-overdrive'
const init = { theme: 'dark', saved: [], read: ['a3'], subs: ['f1', 'f2', 'f3', 'f4'], custom: [], dismissed: [], offline: {}, size: 19, rtheme: 'dark', progress: { a1: 40 }, sharing: false }
const Ctx = createContext()
export const useStore = () => useContext(Ctx)
export function StoreProvider({ children }) {
  const [s, setS] = useState(() => { try { return { ...init, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return init } })
  const [all, setAll] = useState([]); const [status, setStatus] = useState('loading')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} document.documentElement.classList.toggle('light', s.theme === 'light') }, [s])
  const load = useCallback(() => { setStatus('loading'); loadArticles().then(a => { setAll(a); setStatus('ready') }).catch(() => setStatus('error')) }, [])
  useEffect(() => { load() }, [load])
  const set = useCallback(p => setS(o => ({ ...o, ...(typeof p === 'function' ? p(o) : p) })), [])
  const flip = useCallback((k, id) => set(o => ({ [k]: o[k].includes(id) ? o[k].filter(x => x !== id) : [...o[k], id] })), [set])
  const toggleOffline = useCallback(id => set(o => { const n = { ...o.offline }; if (n[id]) delete n[id]; else n[id] = Date.now(); return { offline: n } }), [set])
  const feeds = useMemo(() => [...FEEDS, ...s.custom], [s.custom])
  const feedMap = useMemo(() => Object.fromEntries(feeds.map(f => [f.id, f])), [feeds])
  const articles = useMemo(() => [...all].sort((a, b) => +new Date(b.date) - +new Date(a.date)), [all])
  const mine = useMemo(() => articles.filter(a => s.subs.includes(a.feed)), [articles, s.subs])
  return <Ctx.Provider value={{ s, set, flip, toggleOffline, feeds, feedMap, articles, mine, status, reload: load }}>{children}</Ctx.Provider>
}
