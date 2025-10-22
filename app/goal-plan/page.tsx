// app/goal-plan/page.tsx
"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"

type LikertValue = 1 | 2 | 3 | 4 | 5
type Category =
  | "Pace & Presence"
  | "Clarity & Articulation"
  | "Language & Word Choice"
  | "Practice & Feedback"
  | "Preparation & Growth"

type LikertQuestion = {
  id: string
  prompt: string
  helper?: string
  category: Category
}

type CategorySummary = {
  category: Category
  average: number
  items: LikertQuestion[]
}

type PlanSummary = {
  categorySummaries: CategorySummary[]
  lowest: CategorySummary[]
  responses: Record<string, LikertValue>
  ownerName?: string
}

type ContentRecommendation = {
  title: string
  slug: `/episodes/${string}`
  description: string
  format: "Episode"
}

const likertQuestions: LikertQuestion[] = [
  {
    id: "pace-speed",
    prompt: "I speak at a steady pace that gives me time to think and helps listeners process my message.",
    helper: "Slow enough to stay clear, fast enough to keep attention.",
    category: "Pace & Presence"
  },
  {
    id: "pace-pause",
    prompt: "I pause intentionally to organize my thoughts before responding, especially to questions.",
    helper: "A short pause keeps you composed and your ideas sharp.",
    category: "Pace & Presence"
  },
  {
    id: "pace-breath",
    prompt: "I take a calming breath before I speak so I have enough air to finish my thought with control.",
    helper: "Inhale through the nose, exhale steadily as you begin to speak.",
    category: "Pace & Presence"
  },
  {
    id: "clarity-syllables",
    prompt: "I pronounce each syllable clearly so my words never sound mumbled.",
    helper: "Focus on crisp starts and clean endings to every word.",
    category: "Clarity & Articulation"
  },
  {
    id: "clarity-warmup",
    prompt: "I loosen my jaw, hum, and yawn daily to relax my vocal cords before important conversations.",
    helper: "A quick warmup keeps your sound open and reduces tension.",
    category: "Clarity & Articulation"
  },
  {
    id: "clarity-consonants",
    prompt: "I emphasize consonants and word endings so my message stays sharp and easy to follow.",
    helper: "Tap tongue twisters or vowel drills to stay precise.",
    category: "Clarity & Articulation"
  },
  {
    id: "language-concise",
    prompt: "I avoid unnecessary words and flowery language so my message stays clear and direct.",
    helper: "Trim extra clauses and stick to the point that matters most.",
    category: "Language & Word Choice"
  },
  {
    id: "language-fillers",
    prompt: 'I catch filler words like "um" or "you know" and replace them with a purposeful pause.',
    helper: "Silent beats sound confident and give listeners time to absorb your point.",
    category: "Language & Word Choice"
  },
  {
    id: "language-verbs",
    prompt: "I choose strong, specific verbs to add energy and clarity to my speech.",
    helper: 'Swap vague verbs for vivid ones like "pinpoint," "spark," or "upgrade."',
    category: "Language & Word Choice"
  },
  {
    id: "practice-record",
    prompt: "I listen back to recordings of myself to spot strengths and areas for improvement.",
    helper: "Short voice memos count—as long as you review them.",
    category: "Practice & Feedback"
  },
  {
    id: "practice-feedback",
    prompt: "I ask people I trust for specific, honest feedback about how I sound.",
    helper: "Invite notes on clarity, warmth, and persuasion.",
    category: "Practice & Feedback"
  },
  {
    id: "practice-models",
    prompt: "I study speakers I admire and mimic their tone, cadence, or structure during practice.",
    helper: "Borrow techniques, then adapt them to your own voice.",
    category: "Practice & Feedback"
  },
  {
    id: "practice-reps",
    prompt: "I practice aloud with friends, family, or in front of a mirror to stay comfortable speaking spontaneously.",
    helper: "Frequent reps build confidence and natural delivery.",
    category: "Practice & Feedback"
  },
  {
    id: "growth-prepare",
    prompt: "I prepare what I want to say and anticipate questions before important conversations or presentations.",
    helper: "Outline the opening, key points, and closing ask.",
    category: "Preparation & Growth"
  },
  {
    id: "growth-inputs",
    prompt: "I read or watch content that expands my vocabulary and gives me fresh phrases to use.",
    helper: "Books, articles, podcasts, and shows all count when you pull new language into conversation.",
    category: "Preparation & Growth"
  },
  {
    id: "growth-reflect",
    prompt: "I review each speaking experience to note what worked well and what I will adjust next time.",
    helper: "Quick reflections help you iterate instead of repeat old habits.",
    category: "Preparation & Growth"
  }
]

const scaleValues: LikertValue[] = [1, 2, 3, 4, 5]

const scaleLabels: Record<LikertValue, string> = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly agree"
}

const recommendations: Record<Category, { high: string; medium: string; low: string }> = {
  "Pace & Presence": {
    high: "Maintain your breathing and pacing habits to preserve steady, composed delivery.",
    medium:
      "Add a brief breath cue and mark intentional pauses so your responses stay measured under pressure.",
    low: "Practice paced read-alouds with a timer to reduce rushing and support clearer delivery."
  },
  "Clarity & Articulation": {
    high: "Continue rotating jaw, tongue, and articulation drills to keep diction precise.",
    medium:
      "Schedule a brief warmup before important conversations to reinforce clarity and resonance.",
    low: "Build a daily five-minute routine of jaw loosening, humming, and consonant drills to prevent muffled speech."
  },
  "Language & Word Choice": {
    high: "Continue reinforcing concise phrasing and purposeful verb choices in your planning notes.",
    medium:
      "Draft upcoming responses with specific verbs and indicate where a pause should replace filler words.",
    low: "Rewrite sample answers with stronger verbs and rehearse them aloud, substituting silence for filler language."
  },
  "Practice & Feedback": {
    high: "Maintain your rhythm of recording, reviewing, and seeking targeted feedback.",
    medium:
      "Plan a weekly review session and request one focused note after each practice run.",
    low: "Capture two short practice clips this week, evaluate them, and invite candid feedback from someone you trust."
  },
  "Preparation & Growth": {
    high: "Sustain your preparation templates and vocabulary work to stay ready for new situations.",
    medium:
      "Outline the opener, key messages, likely questions, and new phrases before upcoming conversations.",
    low: "Draft core talking points, anticipate audience questions, and gather fresh language from current reading or listening."
  }
}

const getRecommendation = (category: Category, score: number) => {
  const guidance = recommendations[category]
  if (score >= 4.2) return guidance.high
  if (score >= 3) return guidance.medium
  return guidance.low
}

const contentRecommendations: Record<Category, ContentRecommendation[]> = {
  "Pace & Presence": [
    {
      title: "Episode 10 — When Meetings Run Long",
      slug: "/episodes/when-meetings-run-long-10",
      description: "Shadow the opening story to practice calm pacing even when energy drops.",
      format: "Episode"
    },
    {
      title: "Episode 4 — One Bus an Hour",
      slug: "/episodes/one-bus-an-hour-4",
      description: "Use the transit delays narrative to rehearse measured storytelling with patient pauses.",
      format: "Episode"
    },
    {
      title: "Episode 1 — Morning Coffee",
      slug: "/episodes/morning-coffee-1",
      description: "Read the ritual aloud to sync breathing with natural everyday pacing.",
      format: "Episode"
    }
  ],
  "Clarity & Articulation": [
    {
      title: "Episode 2 — Cooking Dinner",
      slug: "/episodes/cooking-dinner-2",
      description: "Mirror the step-by-step instructions to sharpen consonants and syllable endings.",
      format: "Episode"
    },
    {
      title: "Episode 6 — Where Are My Keys?",
      slug: "/episodes/where-are-my-keys-6",
      description: "Retell the scene focusing on crisp transitions and descriptive details.",
      format: "Episode"
    },
    {
      title: "Episode 8 — Tools, Plans, and a Little Patience",
      slug: "/episodes/tools-plans-patience-8",
      description: "Use the hardware-store checklist to practice precise sequencing language.",
      format: "Episode"
    }
  ],
  "Language & Word Choice": [
    {
      title: "Episode 5 — Making a House a Home",
      slug: "/episodes/a-budget-dilemma-5",
      description: "Study the vivid verbs and swap your filler phrases with stronger wording.",
      format: "Episode"
    },
    {
      title: "Episode 7 — Small Surprises",
      slug: "/episodes/small-surprises-7",
      description: "Note how contrast and precise vocabulary build emotional impact.",
      format: "Episode"
    },
    {
      title: "Episode 9 — Trust Takes Time",
      slug: "/episodes/trust-takes-time-9",
      description: "Lift calm, persuasive phrases for thoughtful and confident responses.",
      format: "Episode"
    }
  ],
  "Practice & Feedback": [
    {
      title: "Episode 11 — Catching Up",
      slug: "/episodes/catching-up-11",
      description: "Record yourself answering the reflection prompts, then review tone and clarity.",
      format: "Episode"
    },
    {
      title: "Episode 10 — When Meetings Run Long",
      slug: "/episodes/when-meetings-run-long-10",
      description: "Share the recap with a partner and invite feedback on how engaging your summary sounds.",
      format: "Episode"
    },
    {
      title: "Episode 6 — Where Are My Keys?",
      slug: "/episodes/where-are-my-keys-6",
      description: "Swap practice recordings and ask listeners for clarity notes on details and delivery.",
      format: "Episode"
    }
  ],
  "Preparation & Growth": [
    {
      title: "Episode 3 — Decisions, Decisions",
      slug: "/episodes/decisions-decisions-3",
      description: "Outline the narrative before listening, then compare to refine your prep template.",
      format: "Episode"
    },
    {
      title: "Episode 9 — Trust Takes Time",
      slug: "/episodes/trust-takes-time-9",
      description: "Pull relationship language and thoughtful pauses into your own planning scripts.",
      format: "Episode"
    },
    {
      title: "Episode 8 — Tools, Plans, and a Little Patience",
      slug: "/episodes/tools-plans-patience-8",
      description: "Map the checklist structure onto your next big conversation or presentation.",
      format: "Episode"
    }
  ]
}

const classifyScore = (score: number) => {
  if (score >= 4.2) return { label: "On track", tone: "text-emerald-600" }
  if (score >= 3) return { label: "Needs tuning", tone: "text-amber-600" }
  return { label: "Priority focus", tone: "text-rose-600" }
}

type RgbColor = [number, number, number]

const getPdfScoreMeta = (score: number): { label: string; color: RgbColor } => {
  if (score >= 4.2) return { label: "On track", color: [16, 185, 129] }
  if (score >= 3) return { label: "Needs tuning", color: [234, 179, 8] }
  return { label: "Priority focus", color: [244, 63, 94] }
}

export default function GoalPlanPage() {
  const [responses, setResponses] = useState<Record<string, LikertValue>>({})
  const [summary, setSummary] = useState<PlanSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const normalized = userName.trim() || undefined
    setSummary(prev => {
      if (!prev) return prev
      if (prev.ownerName === normalized) return prev
      return { ...prev, ownerName: normalized }
    })
  }, [userName])

  const categories = useMemo(() => Array.from(new Set(likertQuestions.map(question => question.category))), [])

  const handleResponseChange = (questionId: string, value: LikertValue) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
    if (error) setError(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const missing = likertQuestions.filter(question => responses[question.id] === undefined)
    if (missing.length > 0) {
      setError("Please rate every statement before generating your plan.")
      return
    }

    const categorySummaries: CategorySummary[] = categories.map(category => {
      const items = likertQuestions.filter(question => question.category === category)
      const total = items.reduce((acc, item) => acc + (responses[item.id] ?? 0), 0)
      const average = items.length > 0 ? total / items.length : 0
      return { category, average, items }
    })

    const lowest = [...categorySummaries].sort((a, b) => a.average - b.average).slice(0, Math.min(2, categorySummaries.length))

    setSummary({
      categorySummaries,
      lowest,
      responses,
      ownerName: userName.trim() ? userName.trim() : undefined
    })
  }

  const handleDownloadPDF = () => {
    if (!summary) return

    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    let pageWidth = pdf.internal.pageSize.getWidth()
    let pageHeight = pdf.internal.pageSize.getHeight()
    const marginX = 56
    const footerHeight = 56
    const contentWidth = pageWidth - marginX * 2
    const brandPrimary: RgbColor = [5, 122, 85]
    const brandAccent: RgbColor = [16, 185, 129]
    const slate: RgbColor = [30, 41, 59]
    const slateMuted: RgbColor = [71, 85, 105]
    const divider: RgbColor = [209, 213, 219]
    const formattedDate = new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date())
    const ownerName = summary.ownerName?.trim() ?? ""
    let pageNumber = 1
    let y = 0

    const setTextColor = ([r, g, b]: RgbColor) => pdf.setTextColor(r, g, b)
    const setFillColor = ([r, g, b]: RgbColor) => pdf.setFillColor(r, g, b)
    const setDrawColor = ([r, g, b]: RgbColor) => pdf.setDrawColor(r, g, b)

    const drawFooter = () => {
      setDrawColor(divider)
      pdf.setLineWidth(0.5)
      pdf.line(marginX, pageHeight - footerHeight, pageWidth - marginX, pageHeight - footerHeight)
      setTextColor(slateMuted)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(9)
      pdf.text(`Communicaly Goal Plan • Page ${pageNumber}`, marginX, pageHeight - footerHeight + 28)
    }

    const drawNameBadge = (topOffset: number, fontSize: number) => {
      if (!ownerName) return
      const label = `Plan for ${ownerName}`
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(fontSize)
      const textWidth = pdf.getTextWidth(label)
      const padX = 18
      const padY = fontSize <= 11 ? 6 : 8
      const badgeWidth = textWidth + padX * 2
      const badgeHeight = fontSize + padY * 2
      const badgeX = Math.max(marginX, pageWidth - marginX - badgeWidth)
      const badgeY = topOffset
      setFillColor([255, 255, 255])
      setDrawColor(brandPrimary)
      pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 18, 18, "FD")
      setTextColor(brandPrimary)
      const textY = badgeY + badgeHeight / 2 + fontSize * 0.32
      pdf.text(label, badgeX + badgeWidth / 2, textY, { align: "center" })
    }

    const drawPageHeader = (firstPage: boolean) => {
      if (firstPage) {
        setFillColor(brandAccent)
        pdf.rect(0, 0, pageWidth, 92, "F")
        setFillColor([224, 231, 255])
        pdf.rect(0, 92, pageWidth, 28, "F")
        setTextColor([255, 255, 255])
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(22)
        pdf.text("Communicaly Goal Plan", marginX, 48)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(12)
        pdf.text(`Generated ${formattedDate}`, marginX, 68)
        drawNameBadge(36, 12)
        setTextColor(slate)
        return 132
      }

      setFillColor([236, 253, 245])
      pdf.rect(0, 0, pageWidth, 64, "F")
      setTextColor(brandPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.text("Communicaly Goal Plan", marginX, 36)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      setTextColor(slateMuted)
      pdf.text(`Generated ${formattedDate}`, marginX, 52)
      drawNameBadge(18, 10)
      setTextColor(slate)
      return 96
    }

    const ensureSpace = (requiredHeight: number) => {
      if (y + requiredHeight <= pageHeight - footerHeight) return
      drawFooter()
      pdf.addPage()
      pageNumber += 1
      pageWidth = pdf.internal.pageSize.getWidth()
      pageHeight = pdf.internal.pageSize.getHeight()
      y = drawPageHeader(false)
    }

    const addSectionTitle = (title: string, helper?: string) => {
      const helperLines = helper ? pdf.splitTextToSize(helper, contentWidth) : []
      const helperHeight = helperLines.length > 0 ? helperLines.length * 14 + 6 : 0
      ensureSpace(34 + helperHeight)
      setTextColor(brandPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.text(title, marginX, y)
      y += 18
      if (helperLines.length > 0) {
        setTextColor(slateMuted)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(11)
        pdf.text(helperLines, marginX, y)
        y += helperHeight
      }
      setDrawColor(divider)
      pdf.setLineWidth(0.5)
      pdf.line(marginX, y, marginX + contentWidth, y)
      y += 16
    }

    const addPriorityCard = (category: Category, average: number) => {
      const recommendation = getRecommendation(category, average)
      const lines = pdf.splitTextToSize(recommendation, contentWidth - 32)
      const cardHeight = 72 + lines.length * 14
      ensureSpace(cardHeight + 10)
      setFillColor([240, 253, 244])
      pdf.roundedRect(marginX, y, contentWidth, cardHeight, 12, 12, "F")
      setDrawColor([187, 247, 208])
      pdf.roundedRect(marginX, y, contentWidth, cardHeight, 12, 12)

      const badge = getPdfScoreMeta(average)
      setFillColor(badge.color)
      pdf.roundedRect(marginX + contentWidth - 126, y + 16, 110, 26, 13, 13, "F")
      setTextColor([255, 255, 255])
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(10)
      pdf.text(badge.label, marginX + contentWidth - 71, y + 33, { align: "center" })

      setTextColor(brandPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.text(`${category} • ${average.toFixed(1)}/5`, marginX + 18, y + 30)

      setTextColor(slateMuted)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      pdf.text(lines, marginX + 18, y + 54)
      y += cardHeight + 16
    }

    const addCategoryCard = (category: Category, average: number) => {
      const recommendation = getRecommendation(category, average)
      const summaryLines = pdf.splitTextToSize(recommendation, contentWidth - 32)
      const height = 64 + summaryLines.length * 14
      ensureSpace(height + 10)
      setFillColor([255, 255, 255])
      pdf.roundedRect(marginX, y, contentWidth, height, 10, 10, "F")
      setDrawColor([209, 250, 229])
      pdf.roundedRect(marginX, y, contentWidth, height, 10, 10)

      setTextColor(brandPrimary)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.text(category, marginX + 16, y + 26)

      setTextColor(slate)
      pdf.setFontSize(20)
      pdf.text(average.toFixed(1), marginX + 16, y + 52)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      setTextColor(slateMuted)
      pdf.text("/ 5", marginX + 52, y + 52)

      const badge = getPdfScoreMeta(average)
      setFillColor([255, 255, 255])
      setDrawColor(badge.color)
      pdf.roundedRect(marginX + contentWidth - 138, y + 18, 122, 24, 12, 12, "D")
      setTextColor(badge.color)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(10)
      pdf.text(badge.label, marginX + contentWidth - 77, y + 35, { align: "center" })

      setTextColor(slateMuted)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      pdf.text(summaryLines, marginX + 16, y + 72)
      y += height + 16
    }

    const addDetailedRatings = () => {
      addSectionTitle("Detailed Ratings", "Keep this section for monthly reviews and track rising scores over time.")
      likertQuestions.forEach(question => {
        const value = summary.responses[question.id]
        const questionLines = pdf.splitTextToSize(question.prompt, contentWidth)
        ensureSpace(questionLines.length * 14 + 36)
        setTextColor(slate)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(11)
        pdf.text(questionLines, marginX, y)
        y += questionLines.length * 14 + 6
        setTextColor(slateMuted)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.text(`Score: ${value} — ${scaleLabels[value]}`, marginX, y)
        y += 22
      })
    }

    y = drawPageHeader(true)

    addSectionTitle("Priority Focus", "Start each practice block here. Revisit this section weekly and celebrate shifts upward.")
    summary.lowest.forEach(({ category, average }) => addPriorityCard(category, average))

    addSectionTitle("Category Score Snapshot", "Glance at these averages to see what's humming and where to add a little extra practice time.")
    summary.categorySummaries.forEach(({ category, average }) => addCategoryCard(category, average))

    addDetailedRatings()

    ensureSpace(40)
    setTextColor(slateMuted)
    pdf.setFont("helvetica", "italic")
    pdf.setFontSize(10)
    pdf.text(
      "Tip: Re-run the questionnaire monthly and compare PDFs to spot the habits that moved your scores.",
      marginX,
      y
    )

    drawFooter()
    pdf.save("communicaly-goal-plan.pdf")
  }

  return (
    <section className="space-y-10 pb-12">
      <header className="space-y-2">
        <p className="text-sm text-gray-500">Home • Goal Plan</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Speaking Goal Questionnaire</h1>
        <p className="max-w-2xl text-gray-700">
          Rate each statement from strongly disagree (1) to strongly agree (5). Your scores shape a tailored practice
          plan and a PDF-ready summary you can keep on hand.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm print:hidden"
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <p>If you strongly agree with a statement, choose 5. If you strongly disagree, choose 1.</p>
          <p>If the statement feels partly true, pick the number that matches how true it feels right now.</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span>1 • Strongly disagree</span>
            <span>2 • Disagree</span>
            <span>3 • Neutral</span>
            <span>4 • Agree</span>
            <span>5 • Strongly agree</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="goal-plan-name" className="text-sm font-medium text-gray-700">
            What name should appear on your goal plan? <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <textarea
            id="goal-plan-name"
            value={userName}
            onChange={event => setUserName(event.target.value)}
            rows={2}
            placeholder="Type your name or team name…"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <p className="text-xs text-gray-500">We will display this on your summary and in the downloaded PDF.</p>
        </div>

        <ol className="divide-y divide-gray-200">
          {likertQuestions.map((question, index) => {
            const selected = responses[question.id]
            return (
              <li key={question.id} className="py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="md:max-w-2xl">
                    <p className="font-medium text-gray-900">
                      {index + 1}. {question.prompt}
                    </p>
                    {question.helper && <p className="mt-1 text-sm text-gray-600">{question.helper}</p>}
                  </div>
                  <fieldset className="flex items-center gap-2" aria-label={`Response options for ${question.prompt}`}>
                    {scaleValues.map(value => (
                      <label key={`${question.id}-${value}`} className="group flex flex-col items-center text-xs text-gray-500">
                        <input
                          type="radio"
                          name={question.id}
                          value={value}
                          checked={selected === value}
                          onChange={() => handleResponseChange(question.id, value)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition
                          ${selected === value ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" : "border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"}`}
                        >
                          {value}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              </li>
            )
          })}
        </ol>

        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            When you submit, we will translate your scores into the top focus areas and give you a PDF-friendly plan.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            Generate My Goal Plan
          </button>
        </div>
      </form>

      {summary && (
        <aside className="space-y-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-8 print:bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-emerald-900">Your Speaking Goal Blueprint</h2>
              {summary.ownerName && (
                <p className="text-sm font-medium text-emerald-900">Plan for {summary.ownerName}</p>
              )}
              <p className="text-sm text-emerald-800">
                Use this snapshot during weekly reviews. The focus areas below pull directly from your questionnaire.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 print:hidden"
            >
              Download Plan (PDF)
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summary.categorySummaries.map(({ category, average }) => {
              const status = classifyScore(average)
              const percent = Math.round((average / 5) * 100)
              return (
                <div key={category} className="space-y-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-emerald-900">{category}</p>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${status.tone}`}>{status.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-emerald-900">{average.toFixed(1)}</p>
                    <p className="text-sm text-emerald-600">/ 5</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-emerald-100">
                    <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-xs text-emerald-700">{getRecommendation(category, average)}</p>
                </div>
              )
            })}
          </div>

          <div className="space-y-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-emerald-900">Focus Priorities</p>
            {summary.lowest.map(({ category, average }) => (
              <div key={`priority-${category}`} className="space-y-1">
                <p className="text-sm font-medium text-emerald-900">
                  {category} • {average.toFixed(1)}/5
                </p>
                <p className="text-sm text-emerald-700">{getRecommendation(category, average)}</p>
              </div>
            ))}
            <p className="text-xs text-emerald-700">
              Tip: Start each practice block by reviewing the first priority, then layer in the next area once the score climbs above 4.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-emerald-900">Communicaly Practice Plan</p>
            <p className="text-sm text-emerald-700">
              Start with the playlists below. Each one combines Communicaly episodes and tools tailored to your top priorities.
            </p>
            {summary.lowest.map(({ category }) => {
              const playlist = contentRecommendations[category] ?? []
              if (playlist.length === 0) return null
              return (
                <div key={`playlist-${category}`} className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-900">{category}</p>
                  <ul className="space-y-2">
                    {playlist.map(item => (
                      <li key={`${category}-${item.slug}`} className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-900">
                        <p className="font-medium">
                          <span className="mr-2 inline-flex h-5 items-center rounded-full bg-emerald-100 px-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            {item.format}
                          </span>
                          <Link href={item.slug} className="transition hover:text-emerald-600 hover:underline">
                            {item.title}
                          </Link>
                        </p>
                        <p className="text-xs text-emerald-700">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
            <p className="text-xs text-emerald-700">
              Bonus: When a playlist feels solid, rotate in content from the other categories to stay sharp across every skill.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-emerald-900">Detailed Ratings</p>
            <ul className="space-y-2 text-sm text-emerald-900">
              {likertQuestions.map(question => {
                const value = summary.responses[question.id]
                return (
                  <li key={`detail-${question.id}`} className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                    <p className="font-medium">{question.prompt}</p>
                    <p className="text-xs text-emerald-700">
                      Score: {value} — {scaleLabels[value]}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>

          <p className="text-xs text-emerald-700 print:text-gray-600">
            Keep this blueprint nearby. Re-run the questionnaire monthly to track progress and update your practice plan.
          </p>
        </aside>
      )}
    </section>
  )
}
