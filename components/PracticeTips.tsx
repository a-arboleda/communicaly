"use client"
import { useEffect, useRef, useState } from "react"

export default function PracticeTips() {
  type Section = { key: string; title: string; items: string[] }

  const sections: Section[] = [
    {
      key: "answer",
      title: "🔹 How to Answer",
      items: [
        "Keep your sentences short and clear.",
        "Answer the question first → then add one or two details.",
        "Use connectors: and, but, because, so to link ideas.",
        "If you forget a word, describe it in simple terms instead of stopping.",
        "End with a thought, feeling, or opinion — it makes your answer sound complete.",
      ],
    },
    {
      key: "intonation",
      title: "🔹 Intonation and Emphasis",
      items: [
        "Pay attention to which words are stressed. Important information is often stressed, and less important words are unstressed or pronounced quickly. Practice with short sentences, making sure to vary your tone.",
      ],
    },
    {
      key: "chunks",
      title: "🔹 Speak in Chunks",
      items: [
        "Rather than word-by-word, speak in phrases. For example: “When I get home, [pause] I’m going straight to bed” instead of pausing after each word.",
      ],
    },
    {
      key: "natural",
      title: "🔹 Tips for Sounding Natural",
      items: [
        "Use contractions: I’m, I’ll, don’t, it’s.",
        "Vary your tone: go up when asking, down when finishing a point.",
        "Pause briefly after key ideas (it gives you control and sounds confident).",
        "Don’t overthink grammar — focus on clarity and flow.",
        "Smile while speaking; it softens your voice and improves rhythm.",
      ],
    },
    {
      key: "confidence",
      title: "🔹 Confidence Boosters",
      items: [
        "Record yourself once — then listen for clarity, not perfection.",
        "Rate yourself by “Could a friend understand me?” instead of “Was it correct?”.",
        "Practice out loud, even if nobody is listening.",
        "Think: I’m sharing, not performing.",
        "Small daily practice beats one long stressful session.",
      ],
    },
    {
      key: "writing",
      title: "🔹 Writing & Phrasebook Tips",
      items: [
        "Write like you speak — avoid long, textbook-style sentences.",
        "Save phrases you actually want to use this week.",
        "Tag your phrases by purpose (feeling, opinion, give advice).",
        "Review your phrasebook before bed — short recall builds memory.",
        "Export to PDF weekly to track your growth.",
      ],
    },
    {
      key: "mindset",
      title: "🔹 Conversation Mindset",
      items: [
        "Listen first — repeat the main word you hear to buy time.",
        "Don’t fear silence; short pauses make you sound thoughtful.",
        "If you don’t understand, use polite phrases: “Sorry, could you say that again?” / “Do you mean…?”",
        "Always add a follow-up question: it shows interest.",
        "Remember: conversations are not tests, they’re connections.",
      ],
    },
  ]

  function TipsSection({ sec }: { sec: Section }) {
    const [isOpen, setIsOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const el = contentRef.current
      if (!el) return
      if (isOpen) {
        el.style.height = "0px"
        el.getBoundingClientRect() // reflow
        el.style.height = `${el.scrollHeight}px`
        const onEnd = () => {
          el.style.height = "auto"
        }
        el.addEventListener("transitionend", onEnd, { once: true })
      } else {
        const current = el.scrollHeight
        el.style.height = `${current}px`
        el.getBoundingClientRect() // reflow
        el.style.height = "0px"
      }
    }, [isOpen])

    return (
      <div className="rounded-lg border bg-white h-full">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={`tips-${sec.key}`}
          className="w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 text-left rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent transition-colors text-sm"
        >
          <span className="font-medium text-gray-800 text-sm">{sec.title}</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} aria-hidden>
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>
        <div
          id={`tips-${sec.key}`}
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: 0 }}
          aria-hidden={!isOpen}
        >
          <div className="px-3 pb-3">
            <ul className="list-disc ml-4 mt-1 space-y-0.5 text-sm text-gray-700">
              {sec.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((sec) => (
        <TipsSection key={sec.key} sec={sec} />
      ))}
    </div>
  )
}
