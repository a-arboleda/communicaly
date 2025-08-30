// app/page.tsx
import Link from "next/link"
import { getAllEpisodes } from "@/utils/episodes"
import EpisodeSearch from "@/components/EpisodeSearch"

export default function Home() {
  const episodes = getAllEpisodes()
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="tag">Daily practice</p>
        <h1 className="font-serif text-4xl font-bold">Your everyday English — short audios, real conversations</h1>
        <p className="text-gray-700 max-w-2xl">
          Listen to a quick story, then answer a simple question about <em>your</em> life.
          Each episode links to an interactive page where you build sentences you’d actually use.
        </p>
      </header>

      <div className="flex gap-3">
        <Link href="/episodes" className="btn btn-primary">Browse Episodes</Link>
        <Link href="/about" className="btn btn-ghost">About</Link>
      </div>

      <section className="space-y-2">
        <h2 className="font-serif text-2xl font-semibold">What is this?</h2>
        <p className="text-gray-700 max-w-3xl">
          Short, natural audios about everyday life. Each episode ends with a question for you.
          Open its <strong>interactive practice page</strong> to personalize details and write what you’d say in a real conversation.
        </p>
      </section>

      {episodes.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold">Find an episode</h2>
          <EpisodeSearch episodes={episodes as any} />
        </section>
      )}
    </section>
  )
}
