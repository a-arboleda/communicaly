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

type DailyActivityTemplate = {
  title: string
  description: string
}

const categoryDailyActivities: Record<Category, DailyActivityTemplate[]> = {
  "Pace & Presence": [
    {
      title: "Breath baseline",
      description: "Record a 60-second voice memo describing your day; inhale for four and speak on the exhale."
    },
    {
      title: "Pause markers",
      description: "Replay the memo and insert three intentional pauses; note where silence supports meaning."
    },
    {
      title: "Episode pacing",
      description: "Read Episode 1 — Morning Coffee aloud with a metronome at 70 bpm to steady your delivery."
    },
    {
      title: "Calm openers",
      description: "Draft two conversation openers and practice starting each one with a grounding breath."
    },
    {
      title: "Walking rehearsal",
      description: "Walk slowly while reciting tomorrow's agenda, matching your stride to measured sentences."
    },
    {
      title: "Energy check",
      description: "List three cues that make you rush, then rehearse how you will respond with a pause."
    },
    {
      title: "Evening reflection",
      description: "Reflect on a recent chat and note when pacing felt balanced versus hurried."
    },
    {
      title: "Countdown breathing",
      description: "Practice 4-6-8 breathing twice today before speaking with someone."
    },
    {
      title: "Slow story drill",
      description: "Tell a two-minute story to your phone, focusing on crisp starts and finishes to each idea."
    },
    {
      title: "Pause swaps",
      description: "Replace filler sounds with a silent two-count during a practice answer."
    }
  ],
  "Clarity & Articulation": [
    {
      title: "Jaw release",
      description: "Spend three minutes on jaw loosening, hums, and lip trills before your first conversation."
    },
    {
      title: "Consonant drill",
      description: "Read Episode 2 — Cooking Dinner, exaggerating consonants and syllable endings."
    },
    {
      title: "Mirror check",
      description: "Practice a short script in the mirror, over-enunciating challenging words."
    },
    {
      title: "Tongue twisters",
      description: "Repeat two tongue twisters five times each, keeping sound crisp rather than quick."
    },
    {
      title: "Warm-up stack",
      description: "Layer humming, sirens, and easy yawns into a five-minute vocal warm-up."
    },
    {
      title: "Clarity playback",
      description: "Record yourself explaining a process; replay and circle any muffled words."
    },
    {
      title: "Ending punch",
      description: "Practice sentences that end in t/d/k sounds, making each closure pop."
    },
    {
      title: "Articulation stretch",
      description: "Chew gum while reading a paragraph slowly to keep muscles engaged."
    },
    {
      title: "Resonance reset",
      description: "Hum on an 'm' sound, then speak a sentence, keeping vibration forward."
    },
    {
      title: "Daily clarity log",
      description: "Note one moment your words sounded strong and one you will refine tomorrow."
    }
  ],
  "Language & Word Choice": [
    {
      title: "Verb swap",
      description: "Rewrite yesterday's email with stronger verbs that show action."
    },
    {
      title: "Episode vocabulary",
      description: "List five vivid verbs from Episode 5 — Making a House a Home."
    },
    {
      title: "Concise summary",
      description: "Summarize an article in three sentences, trimming extra clauses."
    },
    {
      title: "Filler audit",
      description: "Record an answer to 'Tell me about yourself' and tally filler words."
    },
    {
      title: "Pause practice",
      description: "Repeat the answer, replacing fillers with a purposeful pause."
    },
    {
      title: "Power phrases",
      description: "Collect five phrases from a podcast that you want to reuse this week."
    },
    {
      title: "Specific nouns",
      description: "Describe your workspace using precise nouns and sensory details."
    },
    {
      title: "Contrast drill",
      description: "Draft a before-and-after sentence pair using sharper language."
    },
    {
      title: "Vocabulary deck",
      description: "Create flashcards for three new words and use each aloud in context."
    },
    {
      title: "Intentional close",
      description: "Write and speak a one-sentence call-to-action with lively verbs."
    }
  ],
  "Practice & Feedback": [
    {
      title: "Quick recording",
      description: "Capture a two-minute voice memo about your day and label one strength you hear."
    },
    {
      title: "Feedback ask",
      description: "Send a partner a prompt asking for one note on tone or clarity."
    },
    {
      title: "Episode shadow",
      description: "Shadow Episode 11 — Catching Up and compare your pacing to the audio."
    },
    {
      title: "Partner swap",
      description: "Trade recordings with a peer and discuss one improvement focus."
    },
    {
      title: "Question drill",
      description: "Answer three random questions aloud while timing your responses."
    },
    {
      title: "Review notes",
      description: "Replay last week's memo and jot the adjustments you want to try today."
    },
    {
      title: "Feedback filter",
      description: "List the most helpful prior feedback and how you will address it now."
    },
    {
      title: "Practice stack",
      description: "Combine warm-up, prompt response, and reflection in a 15-minute block."
    },
    {
      title: "Spotlight strength",
      description: "Record a story highlighting what you already do well."
    },
    {
      title: "Weekend wrap",
      description: "Summarize the week's learning and decide one tweak for next week."
    }
  ],
  "Preparation & Growth": [
    {
      title: "Week preview",
      description: "Outline the key conversations coming up and note desired outcomes."
    },
    {
      title: "Question planning",
      description: "Draft five audience questions and sketch fair responses."
    },
    {
      title: "Episode mapping",
      description: "Map Episode 3 — Decisions, Decisions to your next presentation structure."
    },
    {
      title: "Story bank",
      description: "Collect three stories you can use to explain current projects."
    },
    {
      title: "Vocabulary refresh",
      description: "Read an article and highlight phrases to weave into future answers."
    },
    {
      title: "Scenario rehearsal",
      description: "Script an opening for an upcoming meeting and speak it aloud."
    },
    {
      title: "Reflection loop",
      description: "Journal about a recent conversation—what worked and what to adjust."
    },
    {
      title: "Prep template",
      description: "Update your prep checklist with timing, key messages, and follow-up."
    },
    {
      title: "Growth check-in",
      description: "Write down one skill you advanced this week and one to focus on next."
    },
    {
      title: "Monthly review",
      description: "Review your notes from this plan and mark what to carry forward."
    }
  ]
}

type SevenDayActivity = {
  day: number
  category: Category
  title: string
  description: string
}

const buildSevenDayPlan = (plan: PlanSummary, totalDays = 7): SevenDayActivity[] => {
  if (plan.categorySummaries.length === 0) return []

  const scoreByCategory = plan.categorySummaries.reduce<Record<Category, number>>((acc, item) => {
    acc[item.category] = item.average
    return acc
  }, {} as Record<Category, number>)

  const sortedCategories = [...plan.categorySummaries]
    .sort((a, b) => a.average - b.average)
    .map(item => item.category)

  const selectedCategories = sortedCategories.length > 0 ? sortedCategories : (Object.keys(categoryDailyActivities) as Category[])

  const sequence: Category[] = []
  while (sequence.length < totalDays) {
    selectedCategories.forEach(category => {
      if (sequence.length < totalDays) sequence.push(category)
    })
  }

  const usageTracker: Partial<Record<Category, number>> = {}

  return sequence.map((category, index) => {
    const count = usageTracker[category] ?? 0
    const templates = categoryDailyActivities[category] ?? []
    const template = templates[count % Math.max(templates.length, 1)]
    usageTracker[category] = count + 1

    return {
      day: index + 1,
      category,
      title: template?.title ?? "Micro habit",
      description: template?.description ?? getRecommendation(category, scoreByCategory[category] ?? 3.5)
    }
  })
}

const classifyScore = (score: number) => {
  if (score >= 4.2) return { label: "On track", tone: "text-emerald-600" }
  if (score >= 3) return { label: "Needs tuning", tone: "text-amber-600" }
  return { label: "Priority focus", tone: "text-rose-600" }
}

type RgbColor = [number, number, number]

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

    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const marginX = 48
    const headerHeight = 84
    const footerHeight = 48
    const contentWidth = pageWidth - marginX * 2
    const brandPrimary: RgbColor = [5, 122, 85]
    const slate: RgbColor = [30, 41, 59]
    const slateMuted: RgbColor = [71, 85, 105]
    const lightBorder: RgbColor = [187, 247, 208]
    const softFill: RgbColor = [236, 253, 245]
    const formattedDate = new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date())
    const ownerName = summary.ownerName?.trim()
    const sortedSummaries = [...summary.categorySummaries].sort((a, b) => a.average - b.average)
    const focusAreas = sortedSummaries.slice(0, Math.min(3, sortedSummaries.length))
    const sevenDayPlan = buildSevenDayPlan(summary)

    const drawHeader = (subheading: string) => {
      pdf.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2])
      pdf.rect(0, 0, pageWidth, headerHeight, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(24)
      pdf.text("Communicaly 7-Day Speaking Sprint", marginX, 40)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(12)
      const headerLine = ownerName ? `For ${ownerName} • Generated ${formattedDate}` : `Generated ${formattedDate}`
      pdf.text(headerLine, marginX, 60)
      pdf.setFont("helvetica", "italic")
      pdf.setFontSize(10)
      pdf.text(subheading, marginX, 76)
    }

    const drawFooter = (tip: string) => {
      const footerY = pageHeight - footerHeight + 24
      pdf.setFont("helvetica", "italic")
      pdf.setFontSize(9)
      pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
      pdf.text(tip, marginX, footerY)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(9)
      pdf.text("communicaly.com", pageWidth - marginX, footerY, { align: "right" })
    }

    drawHeader("Build momentum with one simple focus every day.")
    let currentY = headerHeight + 24

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(14)
    pdf.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2])
    pdf.text("How to use this plan", marginX, currentY)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
    const instructionLines = [
      "1. Review the focus for today and keep the task somewhere visible.",
      "2. Spend 10 focused minutes completing the micro-task.",
      "3. Write one sentence about what sounded smoother."
    ]
    let lineY = currentY + 18
    instructionLines.forEach(line => {
      pdf.text(line, marginX, lineY)
      lineY += 14
    })
    currentY = lineY + 18

    if (focusAreas.length > 0) {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2])
      pdf.text("Top focus areas", marginX, currentY)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
      pdf.text("Scores show where daily reps will create the biggest lift.", marginX, currentY + 16)

      const cardGap = 12
      const cardWidth = (contentWidth - cardGap * (focusAreas.length - 1)) / focusAreas.length
      const preparedCards = focusAreas.map(area => {
        const recommendation = getRecommendation(area.category, area.average)
        const summaryLines = pdf.splitTextToSize(recommendation, cardWidth - 32)
        const quickHabit = categoryDailyActivities[area.category]?.[0]
        const quickLines = quickHabit
          ? pdf.splitTextToSize(`${quickHabit.title} - ${quickHabit.description}`, cardWidth - 32)
          : []
        const contentHeight = summaryLines.length * 12 + (quickLines.length > 0 ? quickLines.length * 12 + 20 : 8)
        const cardHeight = Math.max(120, 72 + contentHeight)
        return { area, summaryLines, quickLines, cardHeight }
      })
      const cardHeight = Math.max(...preparedCards.map(card => card.cardHeight))
      const cardStartY = currentY + 32

      preparedCards.forEach((card, index) => {
        const x = marginX + index * (cardWidth + cardGap)
        const y = cardStartY
        pdf.setFillColor(softFill[0], softFill[1], softFill[2])
        pdf.roundedRect(x, y, cardWidth, cardHeight, 12, 12, "F")
        pdf.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2])
        pdf.roundedRect(x, y, cardWidth, cardHeight, 12, 12)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2])
        pdf.text(card.area.category, x + 16, y + 24)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(20)
        pdf.setTextColor(slate[0], slate[1], slate[2])
        pdf.text(card.area.average.toFixed(1), x + 16, y + 48)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
        pdf.text("/ 5", x + 56, y + 48)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
        pdf.text(card.summaryLines, x + 16, y + 66)
        if (card.quickLines.length > 0) {
          const quickY = y + 66 + card.summaryLines.length * 12 + 10
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(9)
          pdf.setTextColor(slate[0], slate[1], slate[2])
          pdf.text("Micro-task to start:", x + 16, quickY)
          pdf.setFont("helvetica", "normal")
          pdf.setFontSize(9)
          pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
          pdf.text(card.quickLines, x + 16, quickY + 12)
        }
      })

      currentY = cardStartY + cardHeight + 24
    }

    if (sevenDayPlan.length > 0) {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2])
      pdf.text("7-day focus roadmap", marginX, currentY)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      pdf.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2])
      pdf.text("Keep it easy: complete one micro-task each day and note your progress.", marginX, currentY + 16)

      let bulletY = currentY + 34
      sevenDayPlan.forEach(item => {
        const text = `Day ${item.day} • ${item.category}: ${item.title} — ${item.description}`
        const lines = pdf.splitTextToSize(text, contentWidth)
        pdf.text(lines, marginX, bulletY)
        bulletY += lines.length * 12 + 8
      })
      currentY = bulletY + 12
    }

    drawFooter("Re-run the goal planner after seven days to refresh your focus.")

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
                Use this snapshot during your daily check-ins. The focus areas below pull directly from your questionnaire.
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
