"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Route } from "next"

type Slide = {
  title: string
  text: string
  image: string
  chips?: string[]
}

type Pillar = {
  number: string
  title: string
  description: string
  slug: string
  slides: Slide[]
}

const pillars: Pillar[] = [
  {
    number: "01",
    title: "Active Listening",
    description: "Understand before you respond.",
    slug: "listening",
    slides: [
      {
        title: "Active Listening",
        text: "Understanding the main idea matters more than catching every word.",
        image: "/images/pillars/listening-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Listen for intention, not perfection.",
        image: "/images/pillars/listening-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Listen to someone and respond with: “So what you’re saying is…”",
        image: "/images/pillars/listening-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/listening-4.jpg",
        chips: ["I see.", "That makes sense.", "Do you mean…?"],
      },
    ],
  },
  {
    number: "02",
    title: "Better Questions",
    description: "Lead with curiosity.",
    slug: "questions",
    slides: [
      {
        title: "Better Questions",
        text: "Good questions create connection.",
        image: "/images/pillars/questions-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Open questions keep conversations alive.",
        image: "/images/pillars/questions-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Ask one open question and one follow-up question.",
        image: "/images/pillars/questions-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/questions-4.jpg",
        chips: ["What made you…?", "How did it feel?", "Can you tell me more?"],
      },
    ],
  },
  {
    number: "03",
    title: "Structured Answers",
    description: "Respond with clarity.",
    slug: "structured",
    slides: [
      {
        title: "Structured Answers",
        text: "Structure helps you sound clear even when you’re nervous.",
        image: "/images/pillars/structured-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Use a simple pattern: point → detail → point.",
        image: "/images/pillars/structured-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Answer a question in three short sentences.",
        image: "/images/pillars/structured-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/structured-4.jpg",
        chips: ["First…", "Because…", "So overall…"],
      },
    ],
  },
  {
    number: "04",
    title: "Sentence Starters",
    description: "Speak without hesitation.",
    slug: "starters",
    slides: [
      {
        title: "Sentence Starters",
        text: "A strong start removes hesitation.",
        image: "/images/pillars/starters-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Keep three starters ready for common topics.",
        image: "/images/pillars/starters-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Choose a topic and begin with three different starters.",
        image: "/images/pillars/starters-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/starters-4.jpg",
        chips: ["One thing is…", "What I mean is…", "To be honest…"],
      },
    ],
  },
  {
    number: "05",
    title: "Presence",
    description: "Let your body support your words.",
    slug: "presence",
    slides: [
      {
        title: "Presence",
        text: "Your voice follows your posture and breath.",
        image: "/images/pillars/presence-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Slow your exhale before you speak.",
        image: "/images/pillars/presence-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Stand tall, breathe out, then say one sentence slowly.",
        image: "/images/pillars/presence-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/presence-4.jpg",
        chips: ["Let me think.", "Give me a second.", "I’m here."],
      },
    ],
  },
  {
    number: "06",
    title: "Emotional Expression",
    description: "Sound human, not robotic.",
    slug: "emotion",
    slides: [
      {
        title: "Emotional Expression",
        text: "Naming feelings helps you sound human.",
        image: "/images/pillars/emotion-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Use small emotion words, not big drama.",
        image: "/images/pillars/emotion-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Say one feeling and why in one sentence.",
        image: "/images/pillars/emotion-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/emotion-4.jpg",
        chips: ["I feel relieved.", "I’m a bit nervous.", "I’m excited about…"],
      },
    ],
  },
  {
    number: "07",
    title: "Repair & Recovery",
    description: "Stay in the conversation.",
    slug: "repair",
    slides: [
      {
        title: "Repair & Recovery",
        text: "Mistakes are normal. Recovery keeps the conversation going.",
        image: "/images/pillars/repair-1.jpg",
      },
      {
        title: "Key Tip",
        text: "Use repair phrases quickly and move on.",
        image: "/images/pillars/repair-2.jpg",
      },
      {
        title: "Today’s Practice",
        text: "Correct yourself once and continue.",
        image: "/images/pillars/repair-3.jpg",
      },
      {
        title: "Helpful Phrases",
        text: "",
        image: "/images/pillars/repair-4.jpg",
        chips: ["Let me rephrase.", "What I meant was…", "Sorry—let me try again."],
      },
    ],
  },
]

function PillarList({
  onSelect,
  selectedSlug,
}: {
  onSelect: (slug: string) => void
  selectedSlug: string | null
}) {
  return (
    <section
      className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-300 ease-out ${
        selectedSlug ? "opacity-20 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={!!selectedSlug}
    >
      {pillars.map((pillar) => (
        <button
          key={pillar.slug}
          type="button"
          onClick={() => onSelect(pillar.slug)}
          className="group text-left rounded-3xl border border-emerald-100/60 bg-white/90 px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          aria-label={`Explore ${pillar.title}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              {pillar.number}
            </span>
            <span className="text-sm font-semibold text-emerald-700">Explore →</span>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-brand-900">{pillar.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{pillar.description}</p>
        </button>
      ))}
    </section>
  )
}

function Carousel({
  pillar,
  onExit,
}: {
  pillar: Pillar
  onExit: () => void
}) {
  const [index, setIndex] = useState(0)
  const slide = pillar.slides[index]

  useEffect(() => {
    setIndex(0)
  }, [pillar.slug])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((prev) => Math.min(prev + 1, pillar.slides.length - 1))
      if (e.key === "ArrowLeft") setIndex((prev) => Math.max(prev - 1, 0))
      if (e.key === "Escape") onExit()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pillar.slides.length, onExit])

  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(e.touches[0]?.clientX ?? null)
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX
    const delta = endX - touchStartX
    if (Math.abs(delta) > 40) {
      if (delta < 0) setIndex((prev) => Math.min(prev + 1, pillar.slides.length - 1))
      if (delta > 0) setIndex((prev) => Math.max(prev - 1, 0))
    }
    setTouchStartX(null)
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950/90 px-4 py-8 sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_60%)]" aria-hidden />
      <div className="relative z-10 mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="text-sm font-semibold text-emerald-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            aria-label="Back to pillars"
          >
            ← Back to pillars
          </button>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            {pillar.number} · {pillar.title}
          </div>
        </div>

        <div
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.45)] backdrop-blur"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <SlideImage src={slide.image} alt={`${pillar.title} - ${slide.title}`} />
          </div>
          <div className="mt-5 space-y-3 px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">{slide.title}</p>
            {slide.text && <p className="text-lg text-white/90 sm:text-xl">{slide.text}</p>}
            {slide.chips && (
              <div className="flex flex-wrap gap-2 pt-2">
                {slide.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
              className="btn btn-ghost text-white/80 hover:text-white"
              aria-label="Previous slide"
              disabled={index === 0}
            >
              ← Prev
            </button>
            <span className="text-xs font-semibold text-white/70">
              {index + 1} / {pillar.slides.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex((prev) => Math.min(prev + 1, pillar.slides.length - 1))}
              className="btn btn-ghost text-white/80 hover:text-white"
              aria-label="Next slide"
              disabled={index === pillar.slides.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SlideImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 sm:h-72">
        Image unavailable
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1280}
      height={720}
      className="h-56 w-full object-cover sm:h-72"
      sizes="(min-width: 1024px) 800px, 100vw"
      onError={() => setFailed(true)}
    />
  )
}

export default function CommunicationPillarsClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pillarParam = searchParams.get("pillar")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const selectedPillar = useMemo(() => {
    if (!selectedSlug) return null
    return pillars.find((p) => p.slug === selectedSlug) ?? null
  }, [selectedSlug])

  useEffect(() => {
    if (!pillarParam) {
      setSelectedSlug(null)
      return
    }
    const match = pillars.find((p) => p.slug === pillarParam)
    setSelectedSlug(match ? match.slug : null)
  }, [pillarParam])

  function handleSelect(slug: string) {
    setSelectedSlug(slug)
    router.push((`${pathname}?pillar=${slug}`) as Route, { scroll: false })
  }

  function handleExit() {
    setSelectedSlug(null)
    router.push(pathname as Route, { scroll: false })
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">Communication Pillars</p>
        <h1 className="font-serif text-4xl font-semibold text-brand-900 sm:text-5xl">Communication Pillars</h1>
        <p className="text-base text-gray-700">7 foundations for confident, natural English.</p>
        <p className="text-sm text-gray-500">Choose one pillar. Practice it today.</p>
      </header>

      <PillarList onSelect={handleSelect} selectedSlug={selectedSlug} />

      {selectedPillar && <Carousel pillar={selectedPillar} onExit={handleExit} />}
    </div>
  )
}
