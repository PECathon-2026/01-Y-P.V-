import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useStore } from '../hooks/useStore'
import { ArticleList, FilterPanel } from '../components/ArticleCard'
import { EmptyState } from '../components/ui'

import {
  Bookmark,
  MailOpen,
  PenLine,
  X
} from 'lucide-react'

// Default filter settings
const DEF = {
  status: 'all',
  date: 'any',
  sort: 'new'
}

export default function Articles({ mode, title }) {

  // Store data
  const { s, set, mine, feedMap } = useStore()

  // URL search parameters
  const [sp, setSp] = useSearchParams()

  // Filter state
  const [f, setF] = useState(DEF)

  // Article editor state
  const [writing, setWriting] = useState(false)

  // Article form data
  const [draft, setDraft] = useState({
    title: '',
    author: '',
    excerpt: '',
    body: '',
    tags: ''
  })

  // Publish success message
  const [published, setPublished] = useState(false)


  // =========================
  // PUBLISH ARTICLE
  // =========================

  const publish = (e) => {

    e.preventDefault()

    // Check required fields
    if (!draft.title.trim() || !draft.body.trim()) {
      return
    }

    // Generate unique article ID
    const id = `mine-${Date.now()}`

    // Create article object
    const article = {

      id,

      title: draft.title.trim(),

      author: draft.author.trim() || 'You',

      excerpt:
        draft.excerpt.trim() ||
        draft.body.trim().slice(0, 220),

      date: new Date().toISOString(),

      mins: Math.max(
        1,
        Math.ceil(
          draft.body.trim().split(/\s+/).length / 220
        )
      ),

      body: draft.body
        .trim()
        .split(/\n+/)
        .filter(Boolean),

      tags: draft.tags
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
        .slice(0, 6),

      url: null
    }

    // Save article to local store
    set(o => ({
      customArticles: [
        article,
        ...(o.customArticles || [])
      ]
    }))

    // Clear form
    setDraft({
      title: '',
      author: '',
      excerpt: '',
      body: '',
      tags: ''
    })

    // Close editor
    setWriting(false)

    // Show success message
    setPublished(true)

    setTimeout(() => {
      setPublished(false)
    }, 4000)

  }


  // =========================
  // SEARCH AND FILTER
  // =========================

  // Search query
  const q = (sp.get('q') || '').toLowerCase()

  // Feed filter
  const feed = sp.get('feed') || ''

  // Article status
  const st = mode === 'all'
    ? f.status
    : mode

  // Date filter
  const maxDays = {
    any: 1e9,
    7: 7,
    30: 30
  }[f.date]


  // =========================
  // FILTER ARTICLES
  // =========================

  let list = mine.filter(a => {

    // Search by title, feed, author or tags
    const matchesSearch =
      !q ||
      [
        a.title,
        feedMap[a.feed]?.name,
        a.author,
        ...(a.tags || [])
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)

    // Filter by feed
    const matchesFeed =
      !feed || a.feed === feed

    // Filter unread articles
    const matchesUnread =
      st !== 'unread' ||
      !s.read.includes(a.id)

    // Filter saved articles
    const matchesSaved =
      st !== 'saved' ||
      s.saved.includes(a.id)

    // Filter by date
    const matchesDate =
      (Date.now() - +new Date(a.date)) / 864e5
      <= maxDays

    // Return article if all conditions match
    return (
      matchesSearch &&
      matchesFeed &&
      matchesUnread &&
      matchesSaved &&
      matchesDate
    )

  })


  // =========================
  // SORT ARTICLES
  // =========================

  list = [...list].sort((a, b) => {

    // Oldest first
    if (f.sort === 'old') {
      return (
        +new Date(a.date) -
        +new Date(b.date)
      )
    }

    // Shortest reading time
    if (f.sort === 'time') {
      return a.mins - b.mins
    }

    // Latest first
    return (
      +new Date(b.date) -
      +new Date(a.date)
    )

  })


  // =========================
  // CLEAR FILTERS
  // =========================

  const clear = () => {

    setF(DEF)

    setSp({})

  }


  // =========================
  // EMPTY STATE
  // =========================

  const empty =
    mode === 'saved' && !s.saved.length

      ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          text="Tap the bookmark on any article to keep it here."
        />
      )

      : mode === 'unread' && !q

        ? (
          <EmptyState
            icon={MailOpen}
            title="You’re all caught up"
            text="No unread articles in your feeds."
          />
        )

        : undefined


  // =========================
  // PAGE UI
  // =========================

  return (

    <div className="space-y-5">

      {/* PAGE HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>

          <h1 className="text-2xl font-semibold">
            {title}
          </h1>

          <p className="text-sm text-mute">

            {list.length} articles

            {q && ` matching “${q}”`}

            {feed &&
              ` from ${feedMap[feed]?.name}`}

          </p>

        </div>


        {/* WRITE ARTICLE BUTTON */}

        {mode === 'all' && (

          <button

            onClick={() => setWriting(!writing)}

            className="
              inline-flex
              h-10
              items-center
              gap-2
              rounded-xl
              bg-acc
              px-4
              text-sm
              font-medium
              text-white
            "

          >

            <PenLine size={16} />

            {writing
              ? 'Close editor'
              : 'Write article'}

          </button>

        )}

      </div>


      {/* PUBLISH SUCCESS MESSAGE */}

      {published && (

        <p
          role="status"
          className="
            rounded-xl
            border
            border-emerald-500/30
            bg-emerald-500/10
            p-3
            text-sm
          "
        >

          Your article was published locally
          and added to All Articles.

        </p>

      )}


      {/* ARTICLE EDITOR */}

      {writing && (

        <form

          onSubmit={publish}

          className="
            space-y-3
            rounded-2xl
            border
            border-line
            bg-panel
            p-5
          "

        >

          {/* EDITOR HEADER */}

          <div className="flex items-center justify-between">

            <h2 className="font-semibold">
              Create an article
            </h2>

            <button

              type="button"

              onClick={() => setWriting(false)}

              aria-label="Close editor"

            >

              <X size={18} />

            </button>

          </div>


          {/* ARTICLE TITLE */}

          <input

            required

            value={draft.title}

            onChange={e =>
              setDraft({
                ...draft,
                title: e.target.value
              })
            }

            placeholder="Article title"

            className="
              h-11
              w-full
              rounded-xl
              border
              border-line
              bg-bg
              px-3
              text-sm
            "

          />


          {/* AUTHOR AND TAGS */}

          <div className="grid gap-3 sm:grid-cols-2">

            <input

              value={draft.author}

              onChange={e =>
                setDraft({
                  ...draft,
                  author: e.target.value
                })
              }

              placeholder="Author (optional)"

              className="
                h-10
                rounded-xl
                border
                border-line
                bg-bg
                px-3
                text-sm
              "

            />


            <input

              value={draft.tags}

              onChange={e =>
                setDraft({
                  ...draft,
                  tags: e.target.value
                })
              }

              placeholder="Tags, comma separated"

              className="
                h-10
                rounded-xl
                border
                border-line
                bg-bg
                px-3
                text-sm
              "

            />

          </div>


          {/* ARTICLE SUMMARY */}

          <textarea

            value={draft.excerpt}

            onChange={e =>
              setDraft({
                ...draft,
                excerpt: e.target.value
              })
            }

            placeholder="Short summary (optional)"

            rows={2}

            className="
              w-full
              rounded-xl
              border
              border-line
              bg-bg
              p-3
              text-sm
            "

          />


          {/* ARTICLE CONTENT */}

          <textarea

            required

            value={draft.body}

            onChange={e =>
              setDraft({
                ...draft,
                body: e.target.value
              })
            }

            placeholder="Write your article here…"

            rows={8}

            className="
              w-full
              rounded-xl
              border
              border-line
              bg-bg
              p-3
              text-sm
            "

          />


          {/* LOCAL STORAGE MESSAGE */}

          <p className="text-xs text-mute">

            Saved in this browser only.
            This starter does not yet publish
            to a shared server.

          </p>


          {/* PUBLISH BUTTON */}

          <button

            type="submit"

            className="
              h-10
              rounded-xl
              bg-acc
              px-4
              text-sm
              font-semibold
              text-white
            "

          >

            Publish article

          </button>

        </form>

      )}


      {/* FILTER PANEL */}

      <FilterPanel

        f={f}

        setF={setF}

        lockStatus={mode !== 'all'}

        onClear={clear}

      />


      {/* ARTICLES LIST */}

      <ArticleList

        items={list}

        empty={empty}

      />

    </div>

  )

}