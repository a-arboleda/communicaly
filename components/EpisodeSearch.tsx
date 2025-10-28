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
        <fieldset className="rounded-xl border border-gray-200 p-3">
          <legend className="text-sm font-medium text-gray-700">Filter by tag</legend>
          <div className="mt-2 flex flex-wrap gap-2 max-h-16 overflow-y-auto overflow-x-hidden pr-1 tag-scroll-area">
            {allTags.map((t) => {
              const active = selected.has(t)
              return (
                <label
                  key={t}
                  className={`tag cursor-pointer select-none transition ${
                    active
                      ? "bg-brand-accent/10 border-brand-accent text-brand-accent"
                      : "tag-accent"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={t}
                    checked={active}
                    onChange={() => toggleTag(t)}
                    className="sr-only"
                  />
                  <span>{t}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
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
              className="card group block overflow-hidden rounded-3xl border border-gray-200 transition-transform transition-colors duration-200 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">{displayTitle(ep.title)}</h3>
                  {!!ep.tags?.length && (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {ep.tags.map((t) => (
                        <span key={t} className="tag tag-accent">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="btn btn-episode shrink-0">Open</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
