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

const CATEGORIES: { id: CategoryId; name: string; description: string }[] = [
  { id: "all", name: "All", description: "Every practice" },
  { id: "everyday", name: "Everyday Life", description: "The little things" },
  { id: "work", name: "Work & Career", description: "Life at work" },
  { id: "family", name: "Family", description: "People close to us" },
  { id: "relationships", name: "Relationships", description: "Love & friendship" },
  { id: "growth", name: "Personal Growth", description: "Thoughts & feelings" },
  { id: "money", name: "Money & Life", description: "Choices & priorities" },
  { id: "more", name: "More Topics", description: "Other conversations" },
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
    <div className="space-y-8">
      <section aria-label="Explore by topic" className="space-y-3">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-brand-900">What would you like to talk about?</h2>
          <p className="text-sm text-gray-600">Choose a topic, or explore everything. You can always change your mind.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category.id
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => chooseCategory(category.id)}
                className={[
                  "flex min-h-[118px] flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                  active
                    ? "border-brand-700 bg-[#E7F2F0] shadow-sm"
                    : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md",
                ].join(" ")}
              >
                <span className="text-base font-semibold text-brand-900">{category.name}</span>
                <span className="text-xs text-gray-600">{category.description}</span>
                <span className="text-xs font-medium text-brand-700">
                  {categoryCounts[category.id]} {categoryCounts[category.id] === 1 ? "practice" : "practices"}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section aria-label="Find a practice" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="practice-search" className="sr-only">Search practices</label>
          <input
            id="practice-search"
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Search stories, topics or expressions..."
            className="w-full flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {(query || selectedCategory !== "all") && (
            <button type="button" onClick={resetFilters} className="btn btn-ghost self-start sm:self-auto">
              Clear filters
            </button>
          )}
        </div>

        <div>
          <h2 className="font-serif text-2xl text-brand-900">{categoryLabel(selectedCategory)}</h2>
          <p aria-live="polite" className="mt-1 text-sm text-gray-600">
            {filtered.length} {filtered.length === 1 ? "practice" : "practices"} to explore
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-[#F8F3EA] p-6 text-gray-700">
            No practices found here yet. Try another topic or clear your search.
          </div>
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visibleCount).map(({ episode, category }) => (
                <li key={episode.slug}>
                  <Link
                    href={"/episodes/" + episode.slug}
                    className="group flex h-full min-h-[200px] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                  >
                    <span className="text-xs font-medium text-brand-700">{categoryLabel(category)}</span>
                    <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-brand-900">
                      {displayTitle(episode.title)}
                    </h3>
                    {episode.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{episode.excerpt}</p>
                    )}
                    <span className="mt-auto pt-5 text-sm font-semibold text-brand-700 group-hover:underline">
                      Listen & practice →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {visibleCount < filtered.length && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  Show more practices
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
