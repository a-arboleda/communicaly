// app/page.tsx
import Image from "next/image"
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
      "Communicaly gets me talking every day. The prompts make me prepare what I really want to say, then I record it until it sounds natural. Now meetings feel like real conversations, not exams.",
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

const statHighlights = [
  { value: "10 min", label: "Daily prompts", detail: "Stay consistent with short, focused practice." },
  { value: "3x", label: "Speak & reflect", detail: "Record, review, and refine each answer." },
  { value: "100+", label: "Real phrases saved", detail: "Build a personal bank of natural sentences." },
] as const

const backgroundLeaves = [
  { src: "/images/leaf-green.svg", className: "absolute -top-16 -left-14 w-32 sm:w-36 opacity-70" },
  { src: "/images/leaf-brown.svg", className: "absolute -top-12 right-0 sm:right-6 w-32 sm:w-40 opacity-60" },
  { src: "/images/leaf-green.svg", className: "absolute -top-6 left-1/2 w-16 sm:w-20 -translate-x-1/2 opacity-45 -rotate-6" },
  { src: "/images/leaf-brown.svg", className: "absolute top-24 -left-12 w-20 sm:w-24 opacity-55 -rotate-12" },
  { src: "/images/leaf-green.svg", className: "absolute top-28 right-6 w-20 sm:w-24 opacity-55 rotate-6" },
  { src: "/images/leaf-brown.svg", className: "absolute top-1/2 left-8 w-16 sm:w-20 opacity-40 rotate-3" },
  { src: "/images/leaf-green.svg", className: "absolute top-1/2 right-10 w-20 sm:w-24 opacity-45 -rotate-3" },
  { src: "/images/leaf-brown.svg", className: "absolute bottom-40 left-2 w-24 sm:w-28 opacity-45 -rotate-3" },
  { src: "/images/leaf-green.svg", className: "absolute bottom-44 right-4 w-24 sm:w-28 opacity-50 rotate-3" },
  { src: "/images/leaf-brown.svg", className: "absolute bottom-24 left-12 w-16 sm:w-20 opacity-40 rotate-8" },
  { src: "/images/leaf-green.svg", className: "absolute bottom-20 right-16 w-16 sm:w-20 opacity-40 -rotate-10" },
  { src: "/images/leaf-brown.svg", className: "absolute -bottom-14 -left-10 w-28 sm:w-36 opacity-60 rotate-12" },
  { src: "/images/leaf-green.svg", className: "absolute -bottom-16 right-2 sm:right-12 w-32 sm:w-40 opacity-70 -rotate-6" },
] as const

export default function Home() {
  const episodes = getAllEpisodes()
  const latest = episodes.slice(0, 3)
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white/80">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {backgroundLeaves.map((leaf, index) => (
          <Image
            key={`${leaf.src}-${index}`}
            src={leaf.src}
            width={160}
            height={160}
            alt=""
            className={`${leaf.className} mix-blend-multiply`}
            priority={index === 0}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-sky-100/70"
        aria-hidden
      />
      <div className="relative z-10 space-y-16 px-2 py-12 sm:px-12 md:px-16 lg:px-0">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <div className="space-y-5 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-sm font-medium text-emerald-800">
              Speaking confidence
            </p>
            <h1 className="font-serif text-4xl font-bold text-brand-900 sm:text-5xl">
              Practice real-life English through everyday moments.
            </h1>
            <p className="text-lg leading-relaxed text-pretty text-gray-700/90">
              Communicaly helps adult English learners build confidence by listening to short, natural audio stories inspired by daily life
              — and reflecting on them.
            </p>
            <p className="text-sm text-gray-600">
              No lessons. No pressure. Just real English, as it&rsquo;s lived.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/episodes" className="btn btn-primary">
                Start listening
              </Link>
            </div>
          </div>
          <aside className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-100/60 via-white/90 to-sky-100/60 p-6 backdrop-blur">
            <h3 className="font-serif text-2xl font-semibold text-brand-900">Your daily speaking boost</h3>
            <p className="mt-2 text-sm text-gray-600">
              A snapshot of what consistent practice shapes inside Communicaly.
            </p>
            <ul className="mt-6 space-y-4">
              {statHighlights.map(stat => (
                <li key={stat.label} className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-brand-900">{stat.value}</span>
                    <span className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                      {stat.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{stat.detail}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-xs text-emerald-800/90">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Designed for busy learners who want confident, natural speech.
            </div>
          </aside>
        </header>

        <section className="space-y-6 rounded-[2rem] border border-emerald-200/60 bg-white/80 p-6 sm:p-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-serif text-3xl font-semibold text-brand-900">Why Communicaly</h2>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              Most language platforms focus on rules, tests, and perfect sentences.
            </p>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              Communicaly focuses on something different.
            </p>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              Here, English is not about being perfect. It&rsquo;s about thinking, feeling, and expressing yourself — the way you do in real life.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="rounded-2xl border border-brand-200/60 bg-white/80 px-4 py-3">Short, calm audio stories</li>
            <li className="rounded-2xl border border-brand-200/60 bg-white/80 px-4 py-3">Real-life language, not scripts</li>
            <li className="rounded-2xl border border-brand-200/60 bg-white/80 px-4 py-3">Space to reflect, not rush</li>
            <li className="rounded-2xl border border-brand-200/60 bg-white/80 px-4 py-3">Confidence over correctness</li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-brand-200/60 bg-gradient-to-br from-brand-100/80 via-white to-emerald-100/70 p-6 sm:p-10">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl font-semibold text-brand-900">How it works</h2>
            <div className="space-y-4">
              <article className="rounded-2xl border border-emerald-200/70 bg-white/80 p-4">
                <h3 className="font-semibold text-emerald-900">Listen</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Start with a short audio story inspired by a real-life moment.
                </p>
              </article>
              <article className="rounded-2xl border border-brand-200/70 bg-white/80 p-4">
                <h3 className="font-semibold text-brand-900">Reflect</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Think about the story using simple prompts designed to get you thinking in English.
                </p>
              </article>
              <article className="rounded-2xl border border-emerald-200/70 bg-white/80 p-4">
                <h3 className="font-semibold text-emerald-900">Build confidence</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Practice expressing thoughts and emotions in natural, everyday English.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-[2rem] border border-emerald-200/60 bg-white/80 p-6 sm:p-10">
          <h2 className="font-serif text-3xl font-semibold text-brand-900">Who Communicaly is for</h2>
          <p className="text-lg leading-relaxed text-pretty text-gray-700">
            Communicaly is for adult English learners who already understand English but want to feel more confident using it in real life.
          </p>
          <p className="text-lg leading-relaxed text-pretty text-gray-700">
            It&rsquo;s especially helpful if you&rsquo;re tired of textbooks and want to sound more natural, thoughtful, and yourself in English.
          </p>
        </section>

        <section className="rounded-[2rem] border border-brand-200/60 bg-gradient-to-br from-brand-100/80 via-white to-emerald-100/70 p-6 text-center sm:p-10">
          <h2 className="font-serif text-2xl font-semibold text-brand-900">Ready to practice real-life English?</h2>
          <div className="mt-4 flex justify-center">
            <Link href="/episodes" className="btn btn-primary">
              Explore the episodes
            </Link>
          </div>
        </section>

        <section className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 sm:p-10">
          <div className="space-y-3 text-center">
            <p className="mx-auto w-fit rounded-full border border-brand-200/70 bg-brand-100/70 px-4 py-1 text-sm font-medium text-brand-800">
              Community voices
            </p>
            <h2 className="font-serif text-3xl font-semibold text-gray-900">Learners transforming how they speak</h2>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              Communicaly gives English learners a daily space to practice talking, not just studying. Hear a story, choose your words, and rehearse
              them until speaking up feels comfortable and clear.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((story) => (
              <figure
                key={story.name}
                className="flex h-full flex-col gap-3 rounded-3xl border border-brand-100/80 bg-gradient-to-br from-white via-brand-50/70 to-emerald-50/70 p-6 sm:p-7"
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
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${story.avatarGradient} text-base font-semibold text-brand-900`}
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

        <section className="space-y-3 rounded-[2rem] border border-brand-200/60 bg-gradient-to-br from-brand-100/80 via-white to-emerald-100/70 p-6 sm:p-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-serif text-2xl font-semibold text-brand-900">Latest speaking prompts</h2>
            <Link href="/episodes" className="btn btn-muted px-3 py-1 text-sm hover:bg-brand-200/60 hover:border-brand-200">
              See all practice sets
            </Link>
          </div>
          <div className="relative">
            <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((ep) => (
                <li key={ep.slug}>
                  <Link
                    href={`/episodes/${ep.slug}`}
                    className="rounded-2xl border border-white/70 bg-white/75 backdrop-blur-sm block h-full overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:border-brand-300 hover:bg-white/95"
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
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <span className="pointer-events-none absolute -bottom-2 right-0 inline-flex items-center gap-1 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-900 shadow-sm">
              Start talking <span aria-hidden>→</span>
            </span>
          </div>
        </section>
      </div>
    </section>
  )
}
