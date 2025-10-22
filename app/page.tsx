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

const practicePillars = [
  {
    icon: "🌱",
    title: "Personal stories",
    description:
      "Every scenario bends to your life so you practice the words you&rsquo;ll really need with friends, colleagues, and clients.",
  },
  {
    icon: "🎯",
    title: "Intentional repetition",
    description:
      "Prompts guide you to say it again with better rhythm and tone--great accents are built through mindful redo&rsquo;s.",
  },
  {
    icon: "🪞",
    title: "Honest feedback",
    description:
      "Self-rate recordings with friendly rubrics so you notice what improved and what still needs attention next round.",
  },
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
      <div className="relative z-10 space-y-16 px-6 py-12 sm:px-12 md:px-16 lg:px-20">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <div className="space-y-5 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-sm font-medium text-emerald-800">
              Speaking confidence
            </p>
            <h1 className="font-serif text-4xl font-bold text-brand-900 sm:text-5xl">
              Speak English the way you mean it
            </h1>
            <p className="text-lg leading-relaxed text-pretty text-gray-700/90">
              Communicaly guides English learners through short stories, thoughtful prompts, and real speech practice so you can sound natural when it&rsquo;s time to talk.
              Each session helps you plan what you want to say, rehearse it aloud, and make it stick.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-gradient-to-r from-emerald-200/80 to-brand-200/70 px-4 py-2 text-sm font-medium text-emerald-900">
                Daily 10-minute loops
              </span>
              <span className="rounded-full border border-brand-300/70 bg-white/70 px-4 py-2 text-sm font-medium text-brand-800">
                Record, review, improve
              </span>
              <span className="rounded-full border border-emerald-300/70 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-800">
                Built for real conversations
              </span>
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
            <h2 className="font-serif text-3xl font-semibold text-brand-900">Why Communicaly helps you talk better</h2>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              You don&rsquo;t memorize rules here—you practice speaking like yourself. Every prompt ends with a question about your real life,
              so the English you build is ready for the conversations you actually have.
            </p>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              The <strong>interactive practice pages</strong> walk you from ideas to full sentences, then ask you to record and self-evaluate.
              That loop trains clarity, pacing, and confidence every day.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {practicePillars.map(pillar => (
              <div
                key={pillar.title}
                className="group rounded-3xl border border-brand-200/60 bg-gradient-to-br from-white via-brand-100/50 to-emerald-50/60 p-6 transition hover:-translate-y-1 hover:border-brand-300"
              >
                <span className="text-2xl" aria-hidden>{pillar.icon}</span>
                <h3 className="mt-3 font-semibold text-brand-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2rem] border border-brand-200/60 bg-gradient-to-br from-brand-100/80 via-white to-emerald-100/70 p-6 sm:grid-cols-[minmax(0,1fr)_1fr] sm:p-10">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl font-semibold text-brand-900">Your speaking loop</h2>
            <p className="text-lg leading-relaxed text-pretty text-gray-700">
              Follow the same rhythm every day so your mouth, memory, and confidence stay aligned.
            </p>
            <div className="space-y-4">
              <article className="rounded-2xl border border-emerald-200/70 bg-white/80 p-4">
                <h3 className="font-semibold text-emerald-900">1. Listen in context</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Play a short, natural audio to hear tone, rhythm, and phrasing from real conversations.
                </p>
              </article>
              <article className="rounded-2xl border border-brand-200/70 bg-white/80 p-4">
                <h3 className="font-semibold text-brand-900">2. Plan your response</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Personalize prompts to match your life so your sentences feel true to you.
                </p>
              </article>
              <article className="rounded-2xl border border-emerald-200/70 bg-white/80 p-4">
                <h3 className="font-semibold text-emerald-900">3. Say it out loud</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Record, self-rate, and repeat until your English sounds and feels natural.
                </p>
              </article>
            </div>
          </div>
          <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 p-6">
            <div className="absolute -top-20 right-0 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl" aria-hidden />
            <div className="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-brand-200/50 blur-3xl" aria-hidden />
            <div className="relative space-y-4">
              <h3 className="font-serif text-2xl font-semibold text-brand-900">Micro-habits to unlock your voice</h3>
              <p className="text-sm text-gray-700">
                We track the questions you answer, the recordings you revisit, and the phrases you save so you notice growth every session.
              </p>
              <ul className="space-y-3 text-sm text-emerald-900">
                <li className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3">
                  <strong className="font-semibold">Streak support:</strong> gentle nudges keep your speaking muscle active.
                </li>
                <li className="rounded-xl border border-brand-200/80 bg-brand-50/60 px-4 py-3">
                  <strong className="font-semibold">Voice workshop:</strong> compare takes to hear your own improvement.
                </li>
                <li className="rounded-xl border border-emerald-200/80 bg-white px-4 py-3">
                  <strong className="font-semibold">Phrase locker:</strong> capture your best sentences for future conversations.
                </li>
              </ul>
            </div>
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
                    <span className="inline-flex items-center gap-1 text-sm text-brand-900">
                      Start talking <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
