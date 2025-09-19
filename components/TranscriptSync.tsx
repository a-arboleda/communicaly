"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type React from "react"

export type Cue = {
  start: number
  end?: number
  text: string
}

export default function TranscriptSync({
  audioRef,
  cues,
  autoscroll = true,
  collapsible = true,
  defaultOpen = false,
  timeOffset = 0,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>
  cues: Cue[]
  autoscroll?: boolean
  collapsible?: boolean
  defaultOpen?: boolean
  timeOffset?: number // seconds; positive shifts highlight later
}) {
  const [activeIdx, setActiveIdx] = useState<number>(-1)
  const [open, setOpen] = useState<boolean>(defaultOpen)
  const containerRef = useRef<HTMLDivElement>(null)
  const ordered = useMemo(() => {
    return [...cues].sort((a, b) => a.start - b.start)
  }, [cues])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      const t = audio.currentTime + (timeOffset || 0)
      // Find current cue: start <= t < next.start (or <= end if provided)
      let idx = -1
      for (let i = 0; i < ordered.length; i++) {
        const c = ordered[i]
        const nextStart = ordered[i + 1]?.start
        const end = typeof c.end === "number" ? c.end : nextStart ?? Number.POSITIVE_INFINITY
        if (t >= c.start && t < end) {
          idx = i
          break
        }
      }
      setActiveIdx(idx)
    }
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("seeked", onTime)
    audio.addEventListener("loadedmetadata", onTime)
    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("seeked", onTime)
      audio.removeEventListener("loadedmetadata", onTime)
    }
  }, [audioRef, ordered, timeOffset])

  useEffect(() => {
    if (!autoscroll || activeIdx < 0) return
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-cue-idx="${activeIdx}"]`)
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [activeIdx, autoscroll])

  const onClickCue = (i: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = ordered[i].start
    audio.play().catch(() => {})
  }

  const Header = (
    <div className="px-3 py-2 border-b flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {collapsible ? (
          <button
            type="button"
            className="text-sm font-medium text-gray-800 hover:text-gray-900 inline-flex items-center gap-1"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="inline-block w-4 text-center">{open ? "▾" : "▸"}</span>
            Transcript
          </button>
        ) : (
          <p className="text-sm text-gray-700">Transcript</p>
        )}
        <span className="text-xs text-gray-500">Click any line to jump</span>
      </div>
      <div />
    </div>
  )

  return (
    <div className="mt-4 rounded border bg-white" aria-label="Transcript">
      {Header}
      {(!collapsible || open) && (
        <div ref={containerRef} className="max-h-64 overflow-auto px-4 py-3 space-y-2">
          {ordered.map((c, i) => {
            const isActive = i === activeIdx
            return (
              <p
                key={i}
                data-cue-idx={i}
                role="button"
                tabIndex={0}
                onClick={() => onClickCue(i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClickCue(i)}
                className={
                  "cursor-pointer rounded px-2 py-1 outline-none transition-colors " +
                  (isActive
                    ? "bg-brand-50 ring-1 ring-brand-300 text-gray-900"
                    : "hover:bg-gray-50 text-gray-800")
                }
                aria-current={isActive ? "true" : undefined}
              >
                {cleanText(c.text)}
                <span className="sr-only"> starts at {formatTime(c.start)}</span>
              </p>
            )
          })}
          {ordered.length === 0 && (
            <p className="text-sm text-gray-600">No transcript cues provided.</p>
          )}
        </div>
      )}
    </div>
  )
}

function formatTime(sec: number) {
  const t = Math.max(0, Math.floor(sec))
  const mm = String(Math.floor(t / 60)).padStart(2, "0")
  const ss = String(t % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

function cleanText(s: string) {
  return s
    // Remove bracketed tags like [laughs], [noise]
    .replace(/\[[^\]]+\]/g, "")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim()
}
