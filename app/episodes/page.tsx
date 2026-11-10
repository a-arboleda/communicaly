import { getAllEpisodes } from "@/utils/episodes"
import EpisodeSearch from "@/components/EpisodeSearch"

export const dynamic = "force-static"
export const runtime = "nodejs"

export default function Episodes() {
  const episodes = getAllEpisodes()
  return (
    <section className="mx-auto max-w-6xl space-y-8 bg-white font-sans text-[#182021]">
      <header className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">Story library</h1>
        <p className="max-w-xl text-base text-slate-600 sm:text-lg">Find a short story to listen to, then share your take in English.</p>
      </header>
      {episodes.length ? <EpisodeSearch episodes={episodes} /> : <p>New stories are on their way.</p>}
    </section>
  )
}
