"use client"
import { useEffect, useMemo, useRef, useState } from "react"

export const TEXT_RESPONSE_CATS = ["short", "reflective", "personal", "conversation", "summary"] as const
export type TextResponseCat = (typeof TEXT_RESPONSE_CATS)[number]

function createEmptyAnswers(): Record<TextResponseCat, string> {
  return {
    short: "",
    reflective: "",
    personal: "",
    conversation: "",
    summary: "",
  }
}

export const TEXT_RESPONSE_TEMPLATES: Record<TextResponseCat, { label: string; question: string; helpers: string[] }> = {
  short: {
    label: "Short/neutral",
    question: "What do you think of what you just heard?",
    helpers: [
      "I thought it was",
      "It sounded",
      "Overall, I felt",
    ],
  },
  reflective: {
    label: "Reflective",
    question: "What stood out to you in this audio?",
    helpers: [
      "What really stood out was",
      "One thing I noticed was",
      "It made me think about",
    ],
  },
  personal: {
    label: "Personal",
    question: "Have you experienced something similar? Describe it.",
    helpers: [
      "I’ve had a similar experience when",
      "This reminds me of the time",
      "In my case, I usually",
    ],
  },
  conversation: {
    label: "Conversation style",
    question: "Respond to the speaker like a real conversation. What would you say?",
    helpers: [
      "Honestly, I’d say",
      "If it were me, I’d",
      "I’d probably ask",
    ],
  },
  summary: {
    label: "Summary",
    question: "In 1–2 sentences, what’s your take?",
    helpers: [
      "In short,",
      "To me, the main point is",
      "My takeaway is",
    ],
  },
}

export default function EpisodeTextAnswer({ episodeId, overrideQuestions, overrideHelpers }: { episodeId?: string; overrideQuestions?: Partial<Record<TextResponseCat, string>>; overrideHelpers?: Partial<Record<TextResponseCat, string[]>> }) {
  const [cat, setCat] = useState<TextResponseCat>("short")
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  // Question styling uses brand-blue color and a subtle left border

  const baseKey = episodeId ? `ep:${episodeId}:textAnswer` : undefined
  const catKey = useMemo(() => (baseKey ? `${baseKey}:cat` : undefined), [baseKey])

  const [answers, setAnswers] = useState<Record<TextResponseCat, string>>(() => createEmptyAnswers())

  // Load persisted answers per category and last selected category
  useEffect(() => {
    try {
      const next: Record<TextResponseCat, string> = { ...answers }
      TEXT_RESPONSE_CATS.forEach((c) => {
        const k = baseKey ? `${baseKey}:${c}:value` : undefined
        if (!k) return
        const v = localStorage.getItem(k)
        if (typeof v === "string") next[c] = v
      })
      // Migration from old single-value storage => put into 'short'
      const oldKey = baseKey ? `${baseKey}:value` : undefined
      if (oldKey && !next.short) {
        const old = localStorage.getItem(oldKey)
        if (old) next.short = old
      }
      setAnswers(next)
      if (catKey) {
        const stored = localStorage.getItem(catKey) as TextResponseCat | null
        if (stored && TEXT_RESPONSE_TEMPLATES[stored]) setCat(stored)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseKey, catKey])

  useEffect(() => {
    try { if (catKey && cat) localStorage.setItem(catKey, cat) } catch {}
  }, [cat, catKey])

  function setCatAnswer(which: TextResponseCat, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [which]: value }
      try {
        const k = baseKey ? `${baseKey}:${which}:value` : undefined
        if (k) localStorage.setItem(k, value)
      } catch {}
      return next
    })
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    function clearStoredAnswers() {
      setAnswers(createEmptyAnswers())
      setCat("short")
      try {
        if (baseKey) {
          TEXT_RESPONSE_CATS.forEach((c) => {
            const valueKey = `${baseKey}:${c}:value`
            localStorage.removeItem(valueKey)
          })
          const legacyKey = `${baseKey}:value`
          localStorage.removeItem(legacyKey)
        }
        if (catKey) localStorage.removeItem(catKey)
      } catch {}
    }

    function handleEpisodeReset(event: Event) {
      const detail = (event as CustomEvent<{ episodeId?: string }>).detail
      if (detail?.episodeId && detail.episodeId !== episodeId) return
      clearStoredAnswers()
    }

    window.addEventListener("episode:reset", handleEpisodeReset)
    return () => {
      window.removeEventListener("episode:reset", handleEpisodeReset)
    }
  }, [episodeId, baseKey, catKey])

  const current = TEXT_RESPONSE_TEMPLATES[cat]
  const currentHelpers: string[] = overrideHelpers && overrideHelpers[cat]
    ? overrideHelpers[cat] as string[]
    : current.helpers

  function insertHelper(text: string) {
    setCatAnswer(cat, (() => {
      const prev = answers[cat]
      return !prev ? text + " " : prev.endsWith(" ") ? prev + text : prev + " " + text
    })())
    requestAnimationFrame(() => taRef.current?.focus())
  }

  return (
    <div className="space-y-3">
      <ul className="mt-[10px] mb-[15px] list-none flex flex-col gap-2 sm:flex-row sm:flex-wrap" role="list">
        {TEXT_RESPONSE_CATS.map((k) => {
          const active = cat === k
          return (
            <li key={k} className="w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCat(k)}
                className={`btn btn-ghost ${active ? "border-brand-900 bg-brand-200/40" : ""} w-full justify-start text-left sm:w-auto sm:justify-center`}
              >
                {TEXT_RESPONSE_TEMPLATES[k].label}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="space-y-2">
        <div className="text-base sm:text-lg text-brand-900 font-semibold italic pl-3 border-l-2 border-brand-300">{overrideQuestions?.[cat] || current.question}</div>
        {cat !== "conversation" && (
          <div className="flex flex-wrap gap-2">
            {currentHelpers.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => insertHelper(h)}
                className="tag tag-accent hover:border-brand-accent"
                title="Click to add to your answer"
              >
                {h}
              </button>
            ))}
          </div>
        )}
        <div>
          <label htmlFor={`text-answer-${episodeId || "ep"}-${cat}`} className="text-sm text-gray-600">
            Write your answer
          </label>
          <textarea
            ref={taRef}
            id={`text-answer-${episodeId || "ep"}-${cat}`}
            placeholder="Type your answer here..."
            className="mt-1 w-full rounded-xl border p-2 min-h-[140px]"
            value={answers[cat] || ""}
            onChange={(e) => setCatAnswer(cat, e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Saved locally on this device.</p>
        </div>
      </div>
    </div>
  )
}
