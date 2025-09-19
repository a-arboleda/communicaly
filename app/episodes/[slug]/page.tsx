import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllEpisodes, getEpisode } from "@/utils/episodes"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import EpisodeAudioWithTranscript from "@/components/EpisodeAudioWithTranscript"
import { displayTitle } from "@/utils/format"
import Details from "@/components/Details"
import EpisodeQuickNav from "@/components/EpisodeQuickNav"
import { getTranscript } from "@/utils/transcripts"
import EpisodeInteractive from "@/components/EpisodeInteractive"
import EpisodeTextAnswer from "@/components/EpisodeTextAnswer"
import PracticeJournal from "@/components/PracticeJournal"
import PracticeTips from "@/components/PracticeTips"
import EpisodeHero from "@/components/EpisodeHero"
import EpisodeHighlights from "@/components/EpisodeHighlights"

type TextAnswerCat = "short" | "reflective" | "personal" | "conversation" | "summary"

const TEXT_ANSWER_OVERRIDE_MAP: Record<string, Partial<Record<TextAnswerCat, string>>> = {
  "morning-coffee-1": {
    short: "What stood out to you?",
    reflective: "Why do you think coffee (or any morning drink) matters in your day?",
    personal: "What’s your own little ritual that helps you wake up?",
    conversation: "So, do you usually make it at home, or do you like buying it outside?",
    summary: "If you had to describe your mornings in one sentence, what would you say?",
  },
  "cooking-dinner-2": {
    short: "What do you usually do in this situation?",
    reflective: "How does her planning-ahead routine make you feel?",
    personal: "Does this remind you of a memory or a moment from your own life?",
    conversation: "What clarifying question could you ask to keep the chat going?",
    summary: "If you had to explain your own version of the audio in one sentence, what would it be?",
  },
  "decisions-decisions-3": {
    short: "What decision are you putting off right now?",
    reflective: "How does indecision usually show up in your day?",
    personal: "Tell a quick story about a time you had to choose and finally did.",
    conversation: "What question could you ask the speaker to help them pick a direction?",
    summary: "In one or two sentences, what’s the lesson you hear in this audio?",
  },
  "one-bus-an-hour-4": {
    short: "How would you handle it if your bus came only once an hour?",
    reflective: "What does a long wait like that do to the rest of your schedule?",
    personal: "Share a moment when unreliable transport forced you to improvise.",
    conversation: "What question would you ask the speaker to keep the chat going while you both wait?",
    summary: "In a sentence or two, how would you sum up their commuting dilemma?",
  },
}

const TEXT_HELPER_OVERRIDE_MAP: Record<string, Partial<Record<TextAnswerCat, string[]>>> = {
  "cooking-dinner-2": {
    short: [
      "Usually, I…",
      "For me, the easiest is…",
      "It depends on the day…",
    ],
    reflective: [
      "It makes me feel…",
      "On busy days, I…",
      "When I plan ahead, I…",
    ],
    personal: [
      "I remember when…",
      "In my family, we…",
      "Back then, I used to…",
    ],
    conversation: [
      "Could you tell me more about…?",
      "Why do you …?",
      "How do you usually …?",
      "What made you decide to …?",
      "When do you usually …?",
      "Have you ever tried …?",
    ],
    summary: [
      "In one sentence: …",
      "Basically, …",
      "Overall, I think …",
    ],
  },
  "one-bus-an-hour-4": {
    short: [
      "With only one bus an hour, I…",
      "If I miss it, I…",
      "My quick fix is…",
    ],
    reflective: [
      "A long wait usually makes me…",
      "It changes my plan because…",
      "I notice that I…",
    ],
    personal: [
      "One time I waited because…",
      "I keep a backup plan like…",
      "Usually I text…",
    ],
    conversation: [
      "Do you ever…?",
      "Would it help if…?",
      "What if we…?",
      "Should we call…?",
    ],
    summary: [
      "Bottom line: …",
      "In short, they…",
      "It all comes down to…",
    ],
  },
}

const JOURNAL_REFLECTION_OVERRIDE_MAP: Record<string, string[] | undefined> = {
  "morning-coffee-1": [
    "What do you usually drink in the morning, and why?",
    "Where do you normally have your first drink of the day?",
    "How does that small routine set the tone for the rest of your day?",
    "If you didn’t have your usual drink, how would your morning feel different?",
    "What small change would make your mornings even better?",
  ],
  "cooking-dinner-2": [
    "What’s the easiest part of this routine for you?",
    "What makes it harder on some days?",
    "How do you usually feel before and after doing it?",
    "Is there something you’d like to change about it?",
    "Does this remind you of a childhood memory?",
    "How would you explain this habit to someone from another country?",
  ],
  "decisions-decisions-3": [
    "What decision have you postponed lately, and why?",
    "How does overthinking usually feel in your body?",
    "Who helps you choose when you’re stuck, and how?",
    "What’s a small step you could take to move forward this week?",
    "How would you encourage a friend who can’t decide?",
  ],
  "one-bus-an-hour-4": [
    "How do long gaps between buses or trains affect your energy?",
    "What backup plan do you keep for late or missing transport?",
    "Who could you call if you needed a ride, and why them?",
    "What small habit keeps you calm while you wait?",
    "If you redesigned this bus schedule, what would you change first?",
  ],
}

export const dynamic = "force-static"
export const runtime = "nodejs"

export async function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }))
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const ep = getEpisode(slug)
  if (!ep) return notFound()

  const { frontmatter, content } = ep

  const textAnswerOverrides = TEXT_ANSWER_OVERRIDE_MAP[slug]
  const textHelperOverrides = TEXT_HELPER_OVERRIDE_MAP[slug]
  const journalReflectionOverrides = JOURNAL_REFLECTION_OVERRIDE_MAP[slug]

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <Link href="/episodes">Episodes</Link> • Episode
        </p>
      </div>

      <header className="space-y-2">
        <h1 className="font-serif text-3xl font-bold">{displayTitle(frontmatter.title)}</h1>
        <EpisodeHero slug={slug} imageUrl={frontmatter.imageUrl} imageAlt={frontmatter.imageAlt} />
      </header>

      <section id="listen" className="card scroll-mt-20">
        <div className="card-body">
          {(() => {
            const t = getTranscript(slug)
            return (
              <EpisodeAudioWithTranscript
                src={frontmatter.audioUrl}
                start={frontmatter.youtubeStart}
                end={frontmatter.youtubeEnd}
                cues={t?.cues ?? undefined}
                timeOffset={t?.offset ?? 0}
                collapsible
                defaultOpen={false}
              />
            )
          })()}
          {(() => {
            const src = frontmatter.audioUrl
            const s = frontmatter.youtubeStart
            const e = frontmatter.youtubeEnd
            if (!src) return null
            // Minimal YouTube detection + ID extraction (server-safe)
            let videoId: string | undefined
            let baseStart: number | undefined
            try {
              const u = new URL(src)
              const host = u.hostname
              if (host.includes("youtu.be")) {
                videoId = u.pathname.replace(/^\//, "") || undefined
                const t = u.searchParams.get("t")
                if (t) {
                  if (/^\d+$/.test(t)) baseStart = Number(t)
                  else if (/^\d+:\d{1,2}$/.test(t)) {
                    const [mm, ss] = t.split(":").map(Number)
                    baseStart = mm * 60 + ss
                  } else {
                    const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(t)
                    if (m) {
                      const h = Number(m[1] || 0), mm = Number(m[2] || 0), ss = Number(m[3] || 0)
                      baseStart = h * 3600 + mm * 60 + ss
                    }
                  }
                }
              } else if (host.includes("youtube.com")) {
                if (u.pathname === "/watch") {
                  videoId = u.searchParams.get("v") || undefined
                  const t = u.searchParams.get("t")
                  if (t) {
                    if (/^\d+$/.test(t)) baseStart = Number(t)
                    else if (/^\d+:\d{1,2}$/.test(t)) {
                      const [mm, ss] = t.split(":").map(Number)
                      baseStart = mm * 60 + ss
                    } else {
                      const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(t)
                      if (m) {
                        const h = Number(m[1] || 0), mm = Number(m[2] || 0), ss = Number(m[3] || 0)
                        baseStart = h * 3600 + mm * 60 + ss
                      }
                    }
                  }
                } else if (u.pathname.startsWith("/embed/")) {
                  videoId = u.pathname.split("/").pop() || undefined
                }
              }
            } catch {}

            if (!videoId) return null

            function fmt(sec?: number) {
              if (typeof sec !== "number" || isNaN(sec)) return ""
              const t = Math.max(0, Math.floor(sec))
              const mm = String(Math.floor(t / 60)).padStart(2, "0")
              const ss = String(t % 60).padStart(2, "0")
              return `${mm}:${ss}`
            }

            const startSeconds = typeof s === "number" ? s : baseStart
            const startHref = typeof startSeconds === "number"
              ? `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0`
              : undefined
            const endHref = typeof e === "number"
              ? `https://www.youtube.com/embed/${videoId}?start=${e}&rel=0`
              : undefined

            if (!startHref && !endHref) return null

            return (
              <p className="mt-3 text-sm text-gray-700">
                {startHref && (
                  <>
                    Starts at <a className="text-brand-900" href={startHref} target="yt-player" rel="noreferrer">{fmt(s)}</a>
                  </>
                )}
                {startHref && endHref && <span> • </span>}
                {endHref && (
                  <>
                    Stops at <a className="text-brand-900" href={endHref} target="yt-player" rel="noreferrer">{fmt(e)}</a>
                  </>
                )}
              </p>
            )
          })()}
        </div>
      </section>

      <section className="prose max-w-none card prose-hr:my-2">
        <div className="card-body">
          <MDXRemote
            source={content}
            components={{ Details, EpisodeQuickNav, PracticeTips }}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </section>

      {/* Combined: Respond + Practice Journal in one card */}
      <section id="answer" className="card scroll-mt-20">
        <div className="card-body">
          <h3 className="font-semibold">Respond to the audio</h3>
          <div className="mt-2">
            <EpisodeTextAnswer
              episodeId={slug}
              overrideQuestions={textAnswerOverrides}
              overrideHelpers={textHelperOverrides}
            />
          </div>
          <PracticeJournal
            inline
            episodeId={slug}
            audioTitle={frontmatter.title}
            episodeQuestion={frontmatter.question}
            reflectionQuestionsOverride={journalReflectionOverrides}
            textAnswerQuestionsOverride={textAnswerOverrides}
          />
        </div>
      </section>

      <EpisodeInteractive
        episodeId={slug}
        audioTitle={frontmatter.title}
        showPhrasebook={false}
        showResetControls={false}
      />

      <EpisodeHighlights
        story={frontmatter.story}
        keyDetails={frontmatter.keyDetails}
        tryThis={frontmatter.tryThis}
      />
    </article>
  )
}
