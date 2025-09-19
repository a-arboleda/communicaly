"use client"

import { forwardRef } from "react"
function isYouTubeUrl(url: string) {
  try {
    const u = new URL(url)
    return (
      u.hostname.includes("youtube.com") ||
      u.hostname.includes("youtu.be")
    )
  } catch {
    return false
  }
}

function getYouTubeIdAndParams(url: string): { id?: string; start?: number; end?: number } {
  try {
    const u = new URL(url)
    let id: string | undefined
    let start: number | undefined
    let end: number | undefined

    if (u.hostname.includes("youtu.be")) {
      // Short link: https://youtu.be/{id}?t=123
      id = u.pathname.replace(/^\//, "") || undefined
      const t = u.searchParams.get("t")
      if (t) start = parseTimeToSeconds(t)
    } else if (u.hostname.includes("youtube.com")) {
      // Watch URL: https://www.youtube.com/watch?v={id}&t=123
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v") || undefined
        const t = u.searchParams.get("t")
        if (t) start = parseTimeToSeconds(t)
      }
      // Already an embed URL
      if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/").pop()
        const s = u.searchParams.get("start")
        const e = u.searchParams.get("end")
        if (s) start = Number(s)
        if (e) end = Number(e)
      }
    }
    return { id, start, end }
  } catch {
    return {}
  }
}

function parseTimeToSeconds(t: string): number | undefined {
  // Supports "90", "1m30s", "01:30" formats
  if (/^\d+$/.test(t)) return Number(t)
  if (/^\d+:\d{1,2}$/.test(t)) {
    const [mm, ss] = t.split(":").map(Number)
    return mm * 60 + ss
  }
  const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(t)
  if (!m) return undefined
  const h = Number(m[1] || 0)
  const mm = Number(m[2] || 0)
  const ss = Number(m[3] || 0)
  return h * 3600 + mm * 60 + ss
}

type Props = { src?: string; start?: number; end?: number }

const AudioPlayer = forwardRef<HTMLAudioElement, Props>(function AudioPlayer(
  { src, start, end }: Props,
  ref
) {
  if (!src) return null

  if (isYouTubeUrl(src)) {
    const base = getYouTubeIdAndParams(src)
    const videoId = base.id
    const s = start ?? base.start
    const e = end ?? base.end
    if (!videoId) return null
    const params = new URLSearchParams()
    if (typeof s === "number") params.set("start", String(s))
    if (typeof e === "number") params.set("end", String(e))
    params.set("rel", "0")
    const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`
    return (
      <div className="mt-4 aspect-video w-full">
        <iframe
          className="h-full w-full rounded"
          src={embedUrl}
          title="YouTube video player"
          name="yt-player"
          id="yt-player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <audio ref={ref} controls className="w-full mt-4">
      <source src={src} />
      Your browser does not support the audio element.
    </audio>
  )
})

export default AudioPlayer
