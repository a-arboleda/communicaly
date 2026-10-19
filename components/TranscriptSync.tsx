"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type React from "react"

export type Cue = {
  start: number
  end?: number
  text: string
  paragraph?: number
}

export default function TranscriptSync({
  audioRef,
  cues,
  autoscroll = true,
  collapsible = true,
  defaultOpen = false,
  timeOffset = 0,
  label = "Transcript",
  preserveParagraphs = false,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>
  cues: Cue[]
  autoscroll?: boolean
  collapsible?: boolean
  defaultOpen?: boolean
  label?: string
  preserveParagraphs?: boolean
  timeOffset?: number // seconds; positive shifts highlight later
}) {
  const transcriptId = useId()
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
      setActiveIdx(audio.ended || (audio.paused && audio.currentTime === 0) ? -1 : idx)
    }
    onTime()
    audio.addEventListener("play", onTime)
    audio.addEventListener("ended", onTime)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("seeked", onTime)
    audio.addEventListener("loadedmetadata", onTime)
    return () => {
      audio.removeEventListener("play", onTime)
      audio.removeEventListener("ended", onTime)
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("seeked", onTime)
      audio.removeEventListener("loadedmetadata", onTime)
    }
  }, [audioRef, ordered, timeOffset])

  useEffect(() => {
    if (!autoscroll || activeIdx < 0 || (collapsible && !open)) return
    const container = containerRef.current
    const el = container?.querySelector<HTMLElement>(`[data-cue-idx="${activeIdx}"]`)
    if (!el || !container) return
    const bounds = container.getBoundingClientRect()
    const line = el.getBoundingClientRect()
    if (line.top < bounds.top || line.bottom > bounds.bottom) {
      container.scrollTo({
        top: container.scrollTop + line.top - bounds.top - 16,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      })
    }
  }, [activeIdx, autoscroll, collapsible, open])

  const onClickCue = (i: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, ordered[i].start - timeOffset)
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
            aria-controls={transcriptId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="inline-block w-4 text-center">{open ? "▾" : "▸"}</span>
            {label}
          </button>
        ) : (
          <p className="text-sm text-gray-700">{label}</p>
        )}
        <span className="text-xs text-gray-500">Click any line to jump</span>
      </div>
      <div />
    </div>
  )

  return (
    <div className={preserveParagraphs ? "mt-6 card overflow-hidden" : "mt-4 rounded border bg-white"} aria-label="Transcript">
      {Header}
      {(!collapsible || open) && (
        <div id={transcriptId} ref={containerRef} className="max-h-64 overflow-auto px-4 py-3 space-y-2" style={{ overflowAnchor: "none" }}>
          {preserveParagraphs ? (
            Array.from(new Set(ordered.map((cue) => cue.paragraph ?? 0))).map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-8 last:mb-0">
                {ordered.map((cue, index) => (cue.paragraph ?? 0) === paragraph ? (
                  <span key={index}>
                    <button type="button" data-cue-idx={index} onClick={() => onClickCue(index)}
                      aria-current={index === activeIdx ? "true" : undefined}
                      aria-label={`${cleanText(cue.text)} — play from ${formatTime(cue.start)}`}
                      className={`read-along-phrase ${index === activeIdx ? "is-active" : ""}`}>
                      {cleanText(cue.text)}
                    </button>{" "}
                  </span>
                ) : null)}
              </p>
            ))
          ) : ordered.map((c, i) => (
            <button key={i} type="button" data-cue-idx={i} onClick={() => onClickCue(i)}
              className={"block w-full text-left cursor-pointer rounded px-2 py-1 transition-colors focus-visible:outline-2 " +
                (i === activeIdx ? "bg-brand-50 ring-1 ring-brand-300 text-gray-900" : "hover:bg-gray-50 text-gray-800")}
              aria-current={i === activeIdx ? "true" : undefined}>
              {cleanText(c.text)}
              <span className="sr-only"> starts at {formatTime(c.start)}</span>
            </button>
          ))}
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
