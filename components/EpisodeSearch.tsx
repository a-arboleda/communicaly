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

type CategoryId = "all" | "everyday" | "work" | "family" | "relationships" | "growth" | "money" | "more"
type TopicId = Exclude<CategoryId, "all">

const PAGE_SIZE = 9

const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: "all", name: "All" },
  { id: "everyday", name: "Everyday Life" },
  { id: "work", name: "Work & Career" },
  { id: "family", name: "Family" },
  { id: "relationships", name: "Relationships" },
  { id: "growth", name: "Personal Growth" },
  { id: "money", name: "Money & Life" },
  { id: "more", name: "More Topics" },
]

// Group existing tag-based episodes into broader topics without editing MDX files.
function categoryForEpisode(episode: EpisodeItem): TopicId {
  const text = [episode.title, ...(episode.tags ?? [])].join(" ").toLowerCase()
  if (/family|parent|mother|father|sibling|childhood|relatives/.test(text)) return "family"
  if (/work|career|job|office|boss|colleague|professional|interview/.test(text)) return "work"
  if (/relationship|friend|love|dating|partner|trust|breakup|romance/.test(text)) return "relationships"
  if (/money|financ|saving|spending|budget|salary/.test(text)) return "money"
  if (/confidence|growth|mindset|emotion|feeling|fear|perfectionis|self-|identity|boundaries|stress|overthink|motivation/.test(text)) return "growth"
  if (/everyday|daily|routine|habit|home|chores|laundry|small talk|ordinary/.test(text)) return "everyday"
  return "more"
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const debouncedQuery = useDebounced(query, 300)

  const categorizedEpisodes = useMemo(
    () => episodes.map((episode) => ({ episode, category: categoryForEpisode(episode) })),
    [episodes]
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: episodes.length,
      everyday: 0,
      work: 0,
      family: 0,
      relationships: 0,
      growth: 0,
      money: 0,
      more: 0,
    }
    for (const item of categorizedEpisodes) counts[item.category] += 1
    return counts
  }, [categorizedEpisodes, episodes.length])

  const filtered = useMemo(() => {
    const search = debouncedQuery.trim().toLowerCase()
    return categorizedEpisodes.filter(({ episode, category }) => {
      if (selectedCategory !== "all" && category !== selectedCategory) return false
      if (!search) return true
      const searchable = [episode.title, episode.excerpt ?? "", ...(episode.tags ?? [])].join(" ").toLowerCase()
      return searchable.includes(search)
    })
  }, [categorizedEpisodes, selectedCategory, debouncedQuery])

  function chooseCategory(category: CategoryId) {
    setSelectedCategory(category)
    setVisibleCount(PAGE_SIZE)
  }

  function changeQuery(nextQuery: string) {
    setQuery(nextQuery)
    setVisibleCount(PAGE_SIZE)
  }

  function resetFilters() {
    setQuery("")
    chooseCategory("all")
  }

  const categoryLabel = (id: CategoryId) => CATEGORIES.find((category) => category.id === id)?.name ?? "More Topics"

  return (
    <div className="space-y-6">
      <section aria-label="Filter stories" className="space-y-4">
        <label htmlFor="practice-search" className="sr-only">Search stories</label>
        <input id="practice-search" type="search" value={query}
          onChange={(event) => changeQuery(event.target.value)}
          placeholder="Search by title, topic or keyword"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-[#2852d6]" />
        <div role="group" aria-label="Topic" className="flex flex-wrap gap-2">
          {CATEGORIES.filter(category => categoryCounts[category.id] > 0).map(({ id, name }) => (
            <button type="button" key={id} aria-pressed={selectedCategory === id}
              onClick={() => chooseCategory(id)}
              className="rounded-full border border-slate-200 px-3.5 py-2 text-sm font-medium hover:border-blue-400 aria-pressed:border-[#2852d6] aria-pressed:bg-[#2852d6] aria-pressed:text-white">
              {id === "all" ? "All stories" : name}
            </button>
          ))}
        </div>
      </section>
      <div className="flex min-h-10 items-center justify-between border-t border-slate-200 pt-4 text-sm">
        <p aria-live="polite" className="text-slate-600">{filtered.length} {filtered.length === 1 ? "story" : "stories"}</p>
        {(query || selectedCategory !== "all") && <button type="button" onClick={resetFilters} className="font-medium text-[#2852d6] hover:underline">Clear filters</button>}
      </div>
      {filtered.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-5">No stories found. Try another keyword or clear the filters.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, visibleCount).map(({ episode, category }) => (
            <li key={episode.slug}>
              <Link href={`/episodes/${episode.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-[#f6f8ff] focus-visible:outline-2 focus-visible:outline-[#2852d6]">
                <span className="font-mono text-xs text-[#2852d6]">{categoryLabel(category)}</span>
                <h2 className="text-xl font-semibold leading-tight tracking-tight">{displayTitle(episode.title)}</h2>
                {episode.excerpt && <p className="text-sm leading-relaxed text-slate-600">{episode.excerpt}</p>}
                <span className="mt-auto pt-2 text-sm font-medium text-[#2852d6] group-hover:underline">Listen &amp; practice <span aria-hidden="true">↗</span></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {visibleCount < filtered.length && (
        <button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
          className="mx-auto block rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium hover:border-[#2852d6] hover:text-[#2852d6]">
          Show more stories
        </button>
      )}
    </div>
  )
}
