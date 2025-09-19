"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { displayTitle } from "@/utils/format"

type EpisodeItem = {
  slug: string
  title: string
  date: string
  tags?: string[]
  excerpt?: string
}

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function EpisodeSearch({ episodes }: { episodes: EpisodeItem[] }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const debouncedQuery = useDebounced(query, 300)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    for (const e of episodes) (e.tags || []).forEach((t) => s.add(t))
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [episodes])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    const hasTagFilter = selected.size > 0
    return episodes.filter((e) => {
      const text = (e.title + "\n" + (e.excerpt || "")).toLowerCase()
      const matchesText = !q || text.includes(q)
      if (!matchesText) return false
      if (!hasTagFilter) return true
      const tags = new Set(e.tags || [])
      // OR match: at least one selected tag present in episode tags
      for (const t of selected) if (tags.has(t)) return true
      return false
    })
  }, [episodes, debouncedQuery, selected])

  function toggleTag(t: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  function clearFilters() {
    setQuery("")
    setSelected(new Set())
  }

  return (
    <div className="space-y-4">
      {/* Search and tag filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes…"
            className="w-full rounded-xl border px-3 py-2"
            aria-label="Search episodes"
          />
        </div>
        {(query || selected.size > 0) && (
          <button onClick={clearFilters} className="btn btn-ghost self-start sm:self-auto">Clear</button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => {
            const active = selected.has(t)
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`tag ${active ? "bg-brand-accent/10 border-brand-accent text-brand-accent" : "tag-accent"}`}
                aria-pressed={active}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      <p className="text-sm text-gray-600">Showing {filtered.length} of {episodes.length}</p>

      <ul className="grid gap-4">
        {filtered.length === 0 && (
          <li className="text-gray-600">No episodes match your search.</li>
        )}
        {filtered.map((ep) => (
          <li key={ep.slug}>
            <Link
              href={`/episodes/${ep.slug}`}
              className="card block group overflow-hidden transition-all duration-200 hover:shadow-[0_8px_24px_rgba(59,130,246,0.25)] hover:-translate-y-0.5"
            >
              <div className="card-body flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{displayTitle(ep.title)}</h3>
                  {ep.excerpt && <p className="text-gray-700 mt-1">{ep.excerpt}</p>}
                  {!!ep.tags?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ep.tags.map((t) => (
                        <span key={t} className="tag tag-accent">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="btn btn-muted shrink-0">Open</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
