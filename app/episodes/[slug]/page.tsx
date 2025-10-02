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
  "a-budget-dilemma-5": {
    short: "What’s one small upgrade that would make your place feel more like home right now?",
    reflective: "How do you decide between saving money and making your space comfortable?",
    personal: "Tell a quick story about a time you stretched your budget to improve your space.",
    conversation: "What could you ask the speaker to understand their plan for staying on budget?",
    summary: "How would you describe the trade-off at the heart of this episode in one or two sentences?",
  },
  "where-are-my-keys-6": {
    short: "What’s the first thing you do when you realize your keys are missing?",
    reflective: "How do those frantic pre-departure moments usually affect the rest of your day?",
    personal: "Share a quick story about a time a missing item almost made you late.",
    conversation: "What could you ask the speaker to help them track the keys down faster?",
    summary: "In one or two sentences, how would you retell this rush-hour scramble?",
  },
  "small-surprises-7": {
    short: "Which small surprise from their day caught your attention?",
    reflective: "How do little unexpected moments change the way your day feels?",
    personal: "Share a quick story about a day that shifted because of a tiny surprise.",
    conversation: "What question would you ask them about discovering that new bakery?",
    summary: "In a sentence or two, how would you sum up their string of small surprises?",
  },
  "tools-plans-patience-8": {
    short: "What’s the first thing you do when a squeaky hinge or shelf project pops up?",
    reflective: "How does planning your supplies change the way you feel about a repair?",
    personal: "Share a home project you prepared for and how it went.",
    conversation: "What could you ask them about making that hardware-store list?",
    summary: "In a sentence or two, how would you retell their plan-from-list-to-home moment?",
  },
  "trust-takes-time-9": {
    short: "Which small promise in the story would make you pay closer attention?",
    reflective: "How do you usually decide whether someone is earning your trust step by step?",
    personal: "Tell a quick story about someone who proved themselves to you over time.",
    conversation: "What follow-up question could you ask the speaker to understand how they balance fear and openness?",
    summary: "In one or two sentences, how would you retell their advice about letting trust take time?",
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
  "a-budget-dilemma-5": {
    short: [
      "A quick win for me is…",
      "Even with a tight budget, I…",
      "If friends are coming over, I focus on…",
    ],
    reflective: [
      "It makes me rethink how I balance…",
      "When money is limited, I remind myself…",
      "I notice that comfort usually comes from…",
    ],
    personal: [
      "Last time I moved, I…",
      "I once borrowed…",
      "My go-to DIY trick is…",
    ],
    conversation: [
      "Could you walk me through how you…?",
      "Would it help if we shared…?",
      "Have you considered swapping…?",
    ],
    summary: [
      "Bottom line: …",
      "It’s really a choice between…",
      "The dilemma is balancing…",
    ],
  },
  "where-are-my-keys-6": {
    short: [
      "First, I check…",
      "My quick move is…",
      "I always retrace…",
    ],
    reflective: [
      "Moments like this remind me…",
      "When I misplace things, I notice…",
      "It throws off my morning because…",
    ],
    personal: [
      "One time I almost left without…",
      "I once tore apart the couch because…",
      "My worst rush-hour search was when…",
    ],
    conversation: [
      "Did you check…?",
      "Could it be in…?",
      "Want me to call your phone so we can listen for it?",
    ],
    summary: [
      "Quick recap: …",
      "Basically, they…",
      "The whole scene is…",
    ],
  },
  "small-surprises-7": {
    short: [
      "The surprise that stood out was…",
      "It’s funny how…",
      "My favorite tiny moment was…",
    ],
    reflective: [
      "Little surprises usually make me…",
      "When a day starts rough, I…",
      "I notice that unexpected moments…",
    ],
    personal: [
      "One morning I…",
      "I once bumped into…",
      "My version of a small win is…",
    ],
    conversation: [
      "Did the bakery…?",
      "How often do you…?",
      "What made you stop when…?",
      "Should we compare notes on…?",
    ],
    summary: [
      "Overall, their day…",
      "In short, they…",
      "The thread linking everything is…",
    ],
  },
  "tools-plans-patience-8": {
    short: [
      "My first step is…",
      "I always write down…",
      "Before I head out, I…",
    ],
    reflective: [
      "Planning ahead usually makes me…",
      "When I’m in a hardware store, I…",
      "I notice that getting advice…",
    ],
    personal: [
      "One small fix I remember is…",
      "I once asked an employee…",
      "My version of prepping is…",
    ],
    conversation: [
      "Could you show me how you…?",
      "What made you pick…?",
      "Do you think I should…?",
      "Should we compare our lists for…?",
    ],
    summary: [
      "Overall, their plan…",
      "In short, they…",
      "The key link is…",
    ],
  },
  "trust-takes-time-9": {
    short: [
      "The small promise that stood out was…",
      "I notice trust building when…",
      "Usually, I wait to see if…",
    ],
    reflective: [
      "Letting trust take time makes me…",
      "I tend to watch for…",
      "Balancing caution and openness means…",
    ],
    personal: [
      "One time someone proved themselves by…",
      "I used to hold back because…",
      "What changed my mind was…",
    ],
    conversation: [
      "How do you decide who earns your trust?",
      "What helps you stay open while careful?",
      "Could you tell me more about the small promises you mentioned?",
    ],
    summary: [
      "In short, they’re saying…",
      "Overall, their message is…",
      "The main takeaway for me is…",
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
  "a-budget-dilemma-5": [
    "What feelings come up when your space doesn’t match the home you imagine?",
    "Which small purchases or swaps give you the most comfort per dollar?",
    "Who do you turn to for home or budget advice, and what do they usually suggest?",
    "How do you track ‘nice-to-have’ items so they don’t derail your savings?",
    "What’s one hosting tip that makes people feel welcome without spending much?",
  ],
  "where-are-my-keys-6": [
    "What routine helps you keep essentials where they belong before you head out?",
    "How do you steady yourself when a missing item throws off your schedule?",
    "Who do you text or call when you need a quick rescue, and why them?",
    "What backup plans keep you from arriving late if the search takes too long?",
    "What change could make hectic mornings feel calmer next week?",
  ],
  "small-surprises-7": [
    "When a morning starts messy, what helps you reset the tone of your day?",
    "How do you notice and remember the small surprises that happen between tasks?",
    "Who usually pops up in your day unexpectedly, and how do you respond?",
    "What’s a recent discovery in your neighborhood that made you smile?",
    "How do you wind down on days that felt ordinary but still held little wins?",
  ],
  "tools-plans-patience-8": [
    "How do you decide which tools or supplies to buy before starting a project?",
    "What smells, sounds, or sights in a hardware store energize you?",
    "Who do you ask for help when you’re unsure about what part or tool you need?",
    "Which small fix taught you the most about patience and planning?",
    "How do you celebrate finishing a low-key home repair or setup?",
  ],
  "trust-takes-time-9": [
    "What slows you down when you decide whether to trust someone new?",
    "Which small promises or actions help you feel ready to rely on someone?",
    "How do you protect yourself without closing off possible connections?",
    "Who has earned your trust over time, and what did they consistently do?",
    "What risk could strengthen a relationship if you took it this month?",
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
        slug={slug}
        story={frontmatter.story}
        keyDetails={frontmatter.keyDetails}
        tryThis={frontmatter.tryThis}
        practiceQuiz={frontmatter.practiceQuiz}
      />
    </article>
  )
}
