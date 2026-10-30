import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Sidebar, Topbar } from './components/ui'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Reader from './pages/Reader'
import { Feeds, Discover } from './pages/Feeds'
import { Offline, SettingsPage } from './pages/Other'
export default function App() {
  const [collapsed, setCollapsed] = useState(false); const [open, setOpen] = useState(false); const { pathname } = useLocation()
  return <div className="flex min-h-screen">
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} open={open} close={() => setOpen(false)} />
    <div className="min-w-0 flex-1">
      <Topbar onMenu={() => setOpen(true)} />
      <main key={pathname.startsWith('/read') ? 'r' : 'x'} className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles mode="all" title="All Articles" />} />
          <Route path="/unread" element={<Articles mode="unread" title="Unread" />} />
          <Route path="/saved" element={<Articles mode="saved" title="Saved" />} />
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<p className="py-20 text-center text-mute">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  </div>
}
