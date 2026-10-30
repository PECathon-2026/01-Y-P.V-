// Mock API layer. Swap these functions for real fetch() calls to the server later.
// Planned server: GET /api/fetch?url= (raw proxy), POST /api/discovery/submit, GET /api/discovery/recommendations
import { ARTICLES, FEEDS, RECS } from '../data/mock'
const wait = ms => new Promise(r => setTimeout(r, ms))
export const loadArticles = async () => { await wait(600); return ARTICLES }
export const loadFeeds = async () => FEEDS
export const loadRecommendations = async () => RECS
export const fmtDate = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
export const ago = iso => { const h = (Date.now() - +new Date(iso)) / 36e5; return h < 1 ? 'just now' : h < 24 ? `${Math.floor(h)}h ago` : `${Math.floor(h / 24)}d ago` }
export const isPrivateHost = h => /^(localhost|.*\.local|\[::1\])$/i.test(h) || /^(0|10|127)\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)
export function normalizeUrl(raw) {
  const u = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : 'https://' + raw.trim())
  if (!/^https?:$/.test(u.protocol)) throw new Error('Only http(s) URLs are supported.')
  if (isPrivateHost(u.hostname)) throw new Error('Private or local addresses are not allowed.')
  if (!u.hostname.includes('.')) throw new Error('Enter a full domain, like example.com/feed.xml.')
  return u.origin + u.pathname.replace(/\/$/, '') + u.search
}
// Demo only: validates and adds a feed locally. It does NOT fetch or parse anything.
export async function addFeed(raw, existing) {
  await wait(900)
  let url
  try { url = normalizeUrl(raw) } catch (e) { throw new Error(e.message.includes('Invalid') ? 'That does not look like a valid URL.' : e.message) }
  if (existing.some(f => normalizeUrl(f.url) === url)) throw new Error('You already follow this feed.')
  const host = new URL(url).hostname.replace(/^www\./, '')
  return { id: 'c' + Date.now(), name: host, cat: 'Custom', hue: (host.length * 47) % 360, url, desc: 'Custom feed added locally. Articles appear once the parsing backend is connected.', custom: true }
}
