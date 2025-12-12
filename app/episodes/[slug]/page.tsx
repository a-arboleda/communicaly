import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import EpisodeAudioWithTranscript from "@/components/EpisodeAudioWithTranscript"
import EpisodeHero from "@/components/EpisodeHero"
import EpisodePracticeQuestions from "@/components/EpisodePracticeQuestions"
import Details from "@/components/Details"
import EpisodeQuickNav from "@/components/EpisodeQuickNav"
import PracticeTips from "@/components/PracticeTips"
import { displayTitle } from "@/utils/format"
import { getTranscript } from "@/utils/transcripts"
import { getAllEpisodes, getEpisode } from "@/utils/episodes"

type YouTubeLinks = {
  startHref?: string
  endHref?: string
  startSeconds?: number
  endSeconds?: number
}

export const dynamic = "force-static"
export const runtime = "nodejs"

export async function generateStaticParams() {
  return getAllEpisodes().map((episode) => ({ slug: episode.slug }))
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const episode = getEpisode(slug)
  if (!episode) return notFound()

  const { frontmatter, content } = episode
  const transcript = getTranscript(slug)
  const youtubeLinks = getYouTubeLinks(frontmatter.audioUrl, frontmatter.youtubeStart, frontmatter.youtubeEnd)

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
          <EpisodeAudioWithTranscript
            src={frontmatter.audioUrl}
            start={frontmatter.youtubeStart}
            end={frontmatter.youtubeEnd}
            cues={transcript?.cues ?? undefined}
            timeOffset={transcript?.offset ?? 0}
            collapsible
            defaultOpen={false}
          />

          {youtubeLinks && (
            <p className="mt-3 text-sm text-gray-700">
              {youtubeLinks.startHref && (
                <>
                  Starts at{" "}
                  <a className="text-brand-900" href={youtubeLinks.startHref} target="yt-player" rel="noreferrer">
                    {formatSeconds(youtubeLinks.startSeconds)}
                  </a>
                </>
              )}
              {youtubeLinks.startHref && youtubeLinks.endHref && <span> • </span>}
              {youtubeLinks.endHref && (
                <>
                  Stops at{" "}
                  <a className="text-brand-900" href={youtubeLinks.endHref} target="yt-player" rel="noreferrer">
                    {formatSeconds(youtubeLinks.endSeconds)}
                  </a>
                </>
              )}
            </p>
          )}
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

      <EpisodePracticeQuestions
        episodeId={slug}
        episodeTitle={frontmatter.title}
        practiceQuiz={frontmatter.practiceQuiz}
      />
    </article>
  )
}

function getYouTubeLinks(src?: string, start?: number, end?: number): YouTubeLinks | null {
  if (!src) return null

  let videoId: string | undefined
  let baseStart: number | undefined

  try {
    const url = new URL(src)
    const host = url.hostname

    if (host.includes("youtu.be")) {
      videoId = url.pathname.replace(/^\//, "") || undefined
      baseStart = parseStartTime(url.searchParams.get("t"))
    } else if (host.includes("youtube.com")) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || undefined
        baseStart = parseStartTime(url.searchParams.get("t"))
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/").pop() || undefined
      }
    }
  } catch {
    return null
  }

  if (!videoId) return null

  const startSeconds = typeof start === "number" ? start : baseStart
  const endSeconds = typeof end === "number" ? end : undefined

  const startHref =
    typeof startSeconds === "number" ? `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0` : undefined
  const endHref =
    typeof endSeconds === "number" ? `https://www.youtube.com/embed/${videoId}?start=${endSeconds}&rel=0` : undefined

  if (!startHref && !endHref) return null

  return { startHref, endHref, startSeconds, endSeconds }
}

function parseStartTime(value: string | null) {
  if (!value) return undefined
  if (/^\d+$/.test(value)) return Number(value)
  if (/^\d+:\d{1,2}$/.test(value)) {
    const [mm, ss] = value.split(":").map(Number)
    return mm * 60 + ss
  }
  const match = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(value)
  if (!match) return undefined
  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  return hours * 3600 + minutes * 60 + seconds
}

function formatSeconds(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return ""
  const totalSeconds = Math.max(0, Math.floor(value))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${minutes}:${seconds}`
}
