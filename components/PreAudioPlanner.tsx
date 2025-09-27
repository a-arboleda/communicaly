"use client"
import { useEffect, useMemo, useRef, useState } from "react"

const PLACEHOLDER_BY_EPISODE: Record<string, string> = {
  "morning-coffee-1": "e.g. Use: “grind my beans…”, “first sip…”, and a sentence like “Before I leave, I grab my own latte to go.”",
  "cooking-dinner-2": "e.g. Use: “throw something together…”, “sheet pan dinner…”, and a sentence like “On busy nights I roast veggies while I set the table.”",
  "decisions-decisions-3": "e.g. Use: “weigh my options…”, “either way…”, and a sentence like “When I’m stuck, I set a timer and pick the choice that feels lighter.”",
  "one-bus-an-hour-4": "e.g. Use: “one bus an hour…”, “backup plan…”, and a sentence like “If I miss it, I text a friend and start walking to the next stop.”",
  "a-budget-dilemma-5": "e.g. Use: “stretch my budget…”, “borrowed from a friend…”, and a sentence like “I’ll invest in one lamp now and wait on the rug.”",
  "where-are-my-keys-6": "e.g. Use: “pat my pockets…”, “rush-hour scramble…”, and a sentence like “I finally spot the keys clipped to my gym bag.”",
}

const DEFAULT_PLACEHOLDER = "e.g. Use: “ended up…”, “supposed to…”, and a sentence like “When I walk in, I’m heading straight to the kitchen.”"

export default function PreAudioPlanner({ episodeId }: { episodeId: string }) {
  const STORAGE_KEY = useMemo(() => `ep:${episodeId}:preplan`, [episodeId])
  const [text, setText] = useState("")
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setText(raw)
        if (raw.trim().length > 0) setIsOpen(true)
      }
    } catch {}
  }, [STORAGE_KEY])

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (text.trim()) {
          localStorage.setItem(STORAGE_KEY, text)
          setSavedAt(Date.now())
        } else {
          localStorage.removeItem(STORAGE_KEY)
          setSavedAt(null)
        }
      } catch {}
    }, 400)
    return () => window.clearTimeout(id)
  }, [STORAGE_KEY, text])

  useEffect(() => {
    if (typeof window === "undefined") return

    function handleReset(event: Event) {
      const detail = (event as CustomEvent<{ episodeId?: string }>).detail
      if (detail?.episodeId && detail.episodeId !== episodeId) return
      setText("")
      setSavedAt(null)
      setIsOpen(false)
      try { localStorage.removeItem(STORAGE_KEY) } catch {}
    }

    window.addEventListener("episode:reset", handleReset)
    return () => {
      window.removeEventListener("episode:reset", handleReset)
    }
  }, [STORAGE_KEY, episodeId])

  // Smooth expand/collapse
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (isOpen) {
      el.style.height = "0px"
      el.getBoundingClientRect()
      el.style.height = `${el.scrollHeight}px`
      const onEnd = () => { el.style.height = "auto" }
      el.addEventListener("transitionend", onEnd, { once: true })
    } else {
      const current = el.scrollHeight
      el.style.height = `${current}px`
      el.getBoundingClientRect()
      el.style.height = "0px"
    }
  }, [isOpen])

  const count = text.trim().length
  const placeholder = PLACEHOLDER_BY_EPISODE[episodeId] ?? DEFAULT_PLACEHOLDER

  return (
    <section className="rounded-2xl border bg-white/60">
      <div className="p-2 sm:p-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="pre-audio-planner-content"
          className="w-full flex items-center justify-between gap-2 text-left rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 px-2 py-1"
        >
          <div>
            <h3 className="font-semibold">Plan 2–3 phrases to include</h3>
            <span className="text-xs text-gray-500">{savedAt ? "Saved" : "Autosave"}</span>
          </div>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
            aria-hidden
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>

        <div
          id="pre-audio-planner-content"
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: 0 }}
          aria-hidden={!isOpen}
        >
          <div className="pt-1.5">
            <p className="text-sm text-gray-600">
              What 2–3 sentences, verbs, or phrasal verbs would you like to include in your audio?
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={placeholder}
              className="mt-1.5 w-full rounded-xl border p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/60"
              aria-label="Plan phrases to include in your audio"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
              <span>Saved locally on this device</span>
              <span>{count} chars</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
