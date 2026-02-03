// app/episodes/page.tsx
// app/episodes/page.tsx
import { getAllEpisodes } from "@/utils/episodes"
import EpisodeSearch from "@/components/EpisodeSearch"

export const dynamic = "force-static"
export const runtime = "nodejs"

export default function Episodes() {
  const episodes = getAllEpisodes()
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-900">All Episodes</h1>
        <p className="text-sm sm:text-base text-gray-700">
          Each episode is a short, natural reflection on a familiar moment — waiting in line, missing someone, overthinking at night.
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          Listen, reflect, and practice expressing your thoughts in English.
        </p>
        {/* Removed YouTube badge per request */}
      </div>
      {episodes.length === 0 ? (
        <p className="text-gray-600">
          No episodes yet. Add an <code>.mdx</code> file to <code>content/episodes</code>.
        </p>
      ) : (
        <EpisodeSearch episodes={episodes} />
      )}
    </section>
  )
}
