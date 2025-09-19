// components/PracticeJournal.tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"

type Cat = "short" | "reflective" | "personal" | "conversation" | "summary"

const QUESTION_TEMPLATES: Record<Cat, string> = {
  short: "What do you think of what you just heard?",
  reflective: "What stood out to you in this audio?",
  personal: "Have you experienced something similar? Describe it.",
  conversation: "How would you respond in a real conversation?",
  summary: "In 1–2 sentences, what’s your take?",
}

export default function PracticeJournal({ episodeId, audioTitle, episodeQuestion, reflectionQuestionsOverride, textAnswerQuestionsOverride, inline = false }: { episodeId: string; audioTitle?: string; episodeQuestion?: string; reflectionQuestionsOverride?: string[]; textAnswerQuestionsOverride?: Partial<Record<Cat, string>>; inline?: boolean }) {
  const STORAGE_EP = useMemo(() => `ep:${episodeId}`, [episodeId])
  const [answer, setAnswer] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_EP)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.answer) setAnswer(String(s.answer))
      }
    } catch {}
  }, [STORAGE_EP, episodeId])

  // Read per-question text answers on demand (new UI stores them separately)
  function readTextAnswers(): Array<{ key: Cat; label: string; question: string; text: string }> {
    try {
      const base = `ep:${episodeId}:textAnswer`
      const defs: Array<{ key: string; label: string }> = [
        { key: "short", label: "Short/neutral" },
        { key: "reflective", label: "Reflective" },
        { key: "personal", label: "Personal" },
        { key: "conversation", label: "Conversation style" },
        { key: "summary", label: "Summary" },
      ]
      const items: Array<{ key: Cat; label: string; question: string; text: string }> = []
      for (const d of defs) {
        const v = localStorage.getItem(`${base}:${d.key}:value`)
        if (v && v.trim()) {
          const k = d.key as Cat
          const q = (textAnswerQuestionsOverride && textAnswerQuestionsOverride[k]) || QUESTION_TEMPLATES[k]
          items.push({ key: k, label: d.label, question: q, text: String(v).trim() })
        }
      }
      // Back‑compat: old single key or EpisodeInteractive answer
      if (items.length === 0) {
        const legacy1 = localStorage.getItem(`${base}:value`)
        if (legacy1 && legacy1.trim()) items.push({ key: "short", label: "Short/neutral", question: QUESTION_TEMPLATES.short, text: legacy1.trim() })
        else if (answer && answer.trim()) items.push({ key: "short", label: "Short/neutral", question: QUESTION_TEMPLATES.short, text: answer.trim() })
      }
      return items
    } catch {
      return []
    }
  }

  async function exportJournal() {
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 48
    const contentWidth = pageWidth - margin * 2
    const makeSafe = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const epSafe = makeSafe((audioTitle || episodeId || "episode").toString())

    // Header bg + logo
    pdf.setFillColor(219, 234, 254) // light blue
    pdf.rect(0, 0, pageWidth, 64, "F")
    const brandY = 40
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(16)
    pdf.text("Communicaly", margin, brandY)

    // Title + subtitle
    // Use brand blue for titles
    pdf.setTextColor(37, 99, 235) // blue-600
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(20)
    pdf.text("Practice Journal", margin, brandY + 52)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    pdf.setTextColor(75, 85, 99)
    const subtitle = `${audioTitle ? `${audioTitle}` : ""}`
    if (subtitle) pdf.text(subtitle, margin, brandY + 76)

    let y = brandY + 116

    function addSectionTitle(t: string) {
      // add a little top space before each section title for clarity
      y += 8
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(13)
      pdf.setTextColor(37, 99, 235) // blue-600
      pdf.text(t, margin, y)
      y += 18
    }
    function ensureSpace(h: number) {
      if (y + h > pageHeight - margin) {
        pdf.addPage()
        // small repeat header
        pdf.setFillColor(219, 234, 254)
        pdf.rect(0, 0, pageWidth, 40, "F")
        y = 76
      }
    }

    // Your thoughts (supports per-question answers)
    addSectionTitle("Your Thoughts")
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(12)
    pdf.setTextColor(31, 41, 55)
    const perQs = readTextAnswers()
    if (perQs.length === 0) {
      const a = (answer || "(no answer recorded)").trim()
      const wrappedAns = pdf.splitTextToSize(a, contentWidth)
      ensureSpace(wrappedAns.length * 16)
      pdf.text(wrappedAns, margin, y)
      y += wrappedAns.length * 16 + 10
    } else {
      for (const item of perQs) {
        // Label + question
        pdf.setFont("helvetica", "bold")
        const headerTxt = `• ${item.label} — ${item.question}`
        const headerLines = pdf.splitTextToSize(headerTxt, contentWidth)
        ensureSpace(headerLines.length * 16)
        pdf.text(headerLines, margin, y)
        y += headerLines.length * 16
        // Answer text
        pdf.setFont("helvetica", "normal")
        const ansLines = pdf.splitTextToSize(item.text, contentWidth)
        ensureSpace(ansLines.length * 16 + 6)
        pdf.text(ansLines, margin + 16, y)
        y += ansLines.length * 16 + 6
      }
    }

    // (Self‑Rating removed from PDF per request)

    // (Removed: Phrases from this episode)

    // Extra Reflection questions
    addSectionTitle("Extra Reflection Questions")
    // If custom reflection questions are provided, drop the last one from the PDF
    const overrideQs = reflectionQuestionsOverride && reflectionQuestionsOverride.length
      ? reflectionQuestionsOverride.slice(0, -1)
      : null
    const questions: string[] = overrideQs && overrideQs.length
      ? overrideQs
      : [
          ...(episodeQuestion ? [episodeQuestion] : []),
          "How would you say this in your own daily context?",
          "Which phrase will you try today and where?",
          "What sounded unnatural? How will you fix it?",
          "What new vocabulary or chunks did you notice?",
          "What’s your next situation to practice?",
        ]

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(12)
    pdf.setTextColor(31, 41, 55)
    const lineHeight = 16
    for (const q of questions) {
      const wrappedQ = pdf.splitTextToSize(`• ${q}`, contentWidth)
      ensureSpace(wrappedQ.length * lineHeight + 12)
      pdf.text(wrappedQ, margin, y)
      y += wrappedQ.length * lineHeight + 10
    }

    pdf.save(`practice-journal-${epSafe}.pdf`)
  }

  if (inline) {
    return (
      <div className="mt-6">
        <h3 className="font-semibold">Practice Journal</h3>
        <p className="text-sm text-gray-600 mt-1">Download a PDF with your thoughts, phrases, and reflection questions.</p>
        <div className="mt-3">
          <button onClick={exportJournal} className="btn btn-primary">Download PDF</button>
        </div>
      </div>
    )
  }

  return (
    <section className="card scroll-mt-20">
      <div className="card-body">
        <h3 className="font-semibold">Practice Journal</h3>
        <p className="text-sm text-gray-600 mt-1">Download a PDF with your thoughts, phrases, and reflection questions.</p>
        <div className="mt-3">
          <button onClick={exportJournal} className="btn btn-primary">Download PDF</button>
        </div>
      </div>
    </section>
  )
}
