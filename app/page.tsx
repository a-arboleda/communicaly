// app/page.tsx
import Link from "next/link"
import { getAllEpisodes } from "@/utils/episodes"
import { displayTitle } from "@/utils/format"
// Removed search from Home

export default function Home() {
  const episodes = getAllEpisodes()
  const latest = episodes.slice(0, 3)
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="tag tag-accent">Daily practice</p>
        <h1 className="font-serif text-4xl font-bold">Your everyday English — short audios, real conversations</h1>
        <p className="text-gray-700 max-w-2xl">
          Listen to a quick story, then answer a simple question about <em>your</em> life.
          Each episode links to an interactive page where you build sentences you’d actually use.
        </p>
      </header>

      {/* Removed home CTA buttons (Episodes, About) */}

      <section className="space-y-2">
        <h2 className="font-serif text-2xl font-semibold">What is this?</h2>
        <p className="text-gray-700 max-w-3xl">
          Short, natural audios about everyday life. Each episode ends with a question for you.
          Open its <strong>interactive practice page</strong> to personalize details and write what you’d say in a real conversation.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">How it works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border p-4 bg-white/60 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60">
            <div className="text-2xl" aria-hidden>🎧</div>
            <h3 className="font-semibold mt-1">Listen</h3>
            <p className="text-gray-700 text-sm mt-1">Play a short, natural audio about daily life.</p>
          </div>
          <div className="rounded-2xl border p-4 bg-white/60 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60">
            <div className="text-2xl" aria-hidden>🗣️</div>
            <h3 className="font-semibold mt-1">Answer</h3>
            <p className="text-gray-700 text-sm mt-1">Write what you’d really say in that situation.</p>
          </div>
          <div className="rounded-2xl border p-4 bg-white/60 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60">
            <div className="text-2xl" aria-hidden>🎙️</div>
            <h3 className="font-semibold mt-1">Record</h3>
            <p className="text-gray-700 text-sm mt-1">Record yourself, self‑rate, and save your phrases.</p>
          </div>
        </div>
      </section>

      {/* Latest episodes */}
      <section className="space-y-3 rounded-2xl border bg-brand-50/60 p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-2xl font-semibold">Latest episodes</h2>
          <Link href="/episodes" className="btn btn-muted px-3 py-1 text-sm">Browse all</Link>
        </div>
        <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((ep) => (
            <li key={ep.slug}>
              <Link
                href={`/episodes/${ep.slug}`}
                className="rounded-2xl border bg-white block group h-full overflow-hidden transition-colors duration-150 hover:border-brand-300"
              >
                <div className="p-4 flex flex-col justify-between gap-2 h-full">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold">
                      {displayTitle(ep.title)}
                    </h3>
                    {ep.excerpt && (
                      <p className="text-gray-600 text-sm">{ep.excerpt}</p>
                    )}
                    {!!ep.tags?.length && (
                      <div className="mt-0.5 flex flex-wrap gap-1.5">
                        {ep.tags.map((t: string) => (
                          <span key={t} className="tag tag-accent text-[11px] py-0.5">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-900">
                    Open <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Search removed from Home to avoid listing all episodes here */}
    </section>
  )
}
