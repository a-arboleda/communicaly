// app/page.tsx
import Link from "next/link"
import { getAllEpisodes } from "@/utils/episodes"
import { displayTitle } from "@/utils/format"
// Removed search from Home

const testimonials = [
  {
    name: "Mariana",
    initials: "MG",
    occupation: "Marketing Professional",
    quote:
      "I never realized how important it was to build my English identity until my tutor and I started a weekly class focused on sounding more like myself. Now, I feel so much more confident when I speak.",
    rating: 5,
    avatarGradient: "from-amber-200 via-rose-200 to-pink-300",
  },
  {
    name: "Daniel",
    initials: "DM",
    occupation: "Software Engineer",
    quote:
      "Being able to reflect on my answers, record myself, and then listen back has been a game-changer. I didn't know how much I needed this to really improve my listening skills.",
    rating: 4,
    avatarGradient: "from-sky-200 via-cyan-200 to-emerald-200",
  },
  {
    name: "Laura",
    initials: "LL",
    occupation: "English Tutor",
    quote:
      "As a tutor, this tool has been incredibly helpful. I feel I can plan my lessons so much better, and my students truly feel they've made progress.",
    rating: 5,
    avatarGradient: "from-indigo-200 via-purple-200 to-violet-200",
  },
]

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
        <div className="space-y-2 text-gray-700 max-w-3xl">
          <p>
            Short, natural audios about everyday life. Each episode ends with a question for you.
            Open its <strong>interactive practice page</strong> to personalize details and write what you’d say in a real conversation.
          </p>
          <p>
            When you want to set the tone for the week, visit the{" "}
            <Link href="/goals" className="text-brand-900 underline-offset-2 hover:underline">
              Goals page
            </Link>{" "}
            to sketch the voice you’re building, choose your weekly spotlight, and download a personal plan.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">How it works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border p-4 bg-white/60 transition-colors duration-200 ease-out hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60">
            <div className="text-2xl" aria-hidden>🎧</div>
            <h3 className="font-semibold mt-1">Listen</h3>
            <p className="text-gray-700 text-sm mt-1">Play a short, natural audio about daily life.</p>
          </div>
          <div className="rounded-2xl border p-4 bg-white/60 transition-colors duration-200 ease-out hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60">
            <div className="text-2xl" aria-hidden>🗣️</div>
            <h3 className="font-semibold mt-1">Answer</h3>
            <p className="text-gray-700 text-sm mt-1">Write what you’d really say in that situation.</p>
          </div>
          <div className="rounded-2xl border p-4 bg-white/60 transition-colors duration-200 ease-out hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60">
            <div className="text-2xl" aria-hidden>🎙️</div>
            <h3 className="font-semibold mt-1">Record</h3>
            <p className="text-gray-700 text-sm mt-1">Record yourself, self‑rate, and save your phrases.</p>
          </div>
        </div>
      </section>

      {/* Learner stories */}
      <section className="space-y-6">
        <div className="space-y-3 max-w-3xl text-center mx-auto">
          <p className="tag tag-accent w-fit">Community voices</p>
          <h2 className="font-serif text-3xl font-semibold text-gray-900">Learners finding their voice</h2>
          <p className="text-gray-700">
            Communicaly helps you speak English more naturally through short audios and reflective questions about everyday life.
            Each episode lets you listen, write your own response, and record yourself so you can sound more like you in English.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-4 sm:mt-6">
          {testimonials.map((story) => (
            <figure
              key={story.name}
              className="flex h-full flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-lg"
            >
              <div className="flex items-center gap-1 text-lg" aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={index < story.rating ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="sr-only">Rated {story.rating} out of 5 stars</span>
              <blockquote className="text-sm text-gray-700 leading-relaxed">“{story.quote}”</blockquote>
              <div className="flex items-center gap-4 mt-auto">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${story.avatarGradient} text-base font-semibold text-brand-900 shadow-inner`}
                  aria-hidden
                >
                  {story.initials}
                </span>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{story.name}</p>
                  <p className="text-xs text-gray-500">— {story.occupation}</p>
                </div>
              </div>
            </figure>
          ))}
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
                className="rounded-2xl border bg-white/60 block group h-full overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:bg-brand-50/60"
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
