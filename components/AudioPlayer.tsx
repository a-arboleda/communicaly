"use client"

import { forwardRef, useRef, useState } from "react"
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

type Props = { src?: string; start?: number; end?: number; pendingMessage?: string; showSpeed?: boolean }

const AudioPlayer = forwardRef<HTMLAudioElement, Props>(function AudioPlayer(
  { src, start, end, pendingMessage, showSpeed = false }: Props,
  ref
) {
  const localRef = useRef<HTMLAudioElement | null>(null)
  const [failed, setFailed] = useState(false)
  if (!src || failed) return pendingMessage ? <p role="status" className="rounded-xl bg-stone-50 p-4 text-stone-600">{failed ? "Audio is unavailable right now. You can still read along and practice below." : pendingMessage}</p> : null

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
    <div>
    <audio key={src} ref={(element) => { localRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element }} controls preload="metadata" onError={() => setFailed(true)} aria-label="Episode audio" className="w-full mt-4">
      <source src={src} onError={() => setFailed(true)} />
      Your browser does not support the audio element.
    </audio>
    {showSpeed && <label className="mt-4 flex items-center gap-3 text-sm text-stone-500">Playback speed
      <span className="playback-speed-control">
      <select defaultValue="1" className="playback-speed-select" onChange={(event) => { if (localRef.current) localRef.current.playbackRate = Number(event.target.value) }}>
        {[0.75, 1, 1.25, 1.5, 2].map((speed) => <option key={speed} value={speed}>{speed}×</option>)}
      </select>
      <svg aria-hidden="true" className="playback-speed-chevron" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </label>}
    </div>
  )
})

export default AudioPlayer
