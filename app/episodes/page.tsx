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
        <p className="text-sm text-gray-600">Home • Episodes</p>
        <h1 className="font-serif text-3xl font-bold">All Episodes</h1>
        <p className="text-gray-700">Short, everyday audios. Click any episode to open its practice page.</p>
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
